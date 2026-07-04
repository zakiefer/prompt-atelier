import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";

const PORT = Number(process.env.PORT || process.env.PROMPT_LAB_API_PORT || 8787);
const HOST = process.env.HOST || process.env.PROMPT_LAB_API_HOST || "127.0.0.1";
const ROOT = process.cwd();
const DATA_DIR = resolve(process.env.PROMPT_LAB_DATA_DIR || join(ROOT, "data"));
const DB_PATH = join(DATA_DIR, "prompt-atelier.sqlite");
const API_TOKEN = process.env.PROMPT_LAB_API_TOKEN || "";
const ALLOWED_ORIGIN = process.env.PROMPT_LAB_ALLOWED_ORIGIN || "*";
const API_RATE_LIMIT = Number(process.env.PROMPT_LAB_RATE_LIMIT || 240);
const COLLECTION_KEYS = [
  "userPrompts",
  "history",
  "outcomes",
  "screenshots",
  "buildRuns",
  "queueJobs",
  "lineage",
  "datasetVersions",
  "curationDecisions",
  "modelBatchEvaluations",
  "pairwiseReviews",
  "backupSnapshots",
  "activeWorkspace",
  "closedLoopRuns",
  "benchmarkRuns",
];
const SKILL_PATH = join(homedir(), ".codex", "skills", "website-prompt-atelier", "SKILL.md");

mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS collections (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS api_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL,
    detail TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const upsertCollection = db.prepare(`
  INSERT INTO collections (key, value, updated_at)
  VALUES (?, ?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
`);
const getCollection = db.prepare("SELECT value FROM collections WHERE key = ?");
const getAllCollections = db.prepare("SELECT key, value, updated_at FROM collections ORDER BY key");
const insertEvent = db.prepare("INSERT INTO api_events (kind, detail, created_at) VALUES (?, ?, ?)");
const getRecentEvents = db.prepare("SELECT id, kind, detail, created_at FROM api_events ORDER BY id DESC LIMIT ?");
const rateLimitBuckets = new Map();

function now() {
  return new Date().toISOString();
}

function logEvent(kind, detail) {
  insertEvent.run(kind, JSON.stringify(detail), now());
}

function jsonResponse(response, status, payload) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "content-type, authorization, x-prompt-lab-token",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(payload, null, 2));
}

function requestIsAuthorized(request) {
  if (!API_TOKEN) return true;
  const bearer = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const token = request.headers["x-prompt-lab-token"];
  return bearer === API_TOKEN || token === API_TOKEN;
}

function clientKey(request) {
  return String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "local").split(",")[0].trim();
}

function rateLimitAllows(request) {
  if (!API_RATE_LIMIT) return true;
  const key = clientKey(request);
  const nowMs = Date.now();
  const current = rateLimitBuckets.get(key);
  if (!current || current.resetAt < nowMs) {
    rateLimitBuckets.set(key, { count: 1, resetAt: nowMs + 60_000 });
    return true;
  }
  current.count += 1;
  return current.count <= API_RATE_LIMIT;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 15_000_000) reject(new Error("Request body too large."));
    });
    request.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function readCollections() {
  const rows = getAllCollections.all();
  return Object.fromEntries(
    rows.map((row) => {
      try {
        return [row.key, JSON.parse(row.value)];
      } catch {
        return [row.key, null];
      }
    }),
  );
}

function writeCollection(key, value) {
  upsertCollection.run(key, JSON.stringify(value), now());
}

function skillStatus() {
  const installed = existsSync(SKILL_PATH);
  return {
    installed,
    path: SKILL_PATH,
    size: installed ? statSync(SKILL_PATH).size : 0,
    updatedAt: installed ? statSync(SKILL_PATH).mtime.toISOString() : "",
  };
}

function runNodeScript(script, args, timeout = 120000) {
  const result = spawnSync(process.execPath, [join(ROOT, "scripts", script), ...args], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "pipe",
    timeout,
  });
  let parsed = null;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    parsed = null;
  }
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.error?.message || result.stderr.trim(),
    parsed,
  };
}

function normalizeImportedResult(result) {
  const updatedAt = result.updatedAt || now();
  const promptId = result.promptId || result.id || `imported-${Date.now()}`;
  const buildRun = {
    id: result.id || `import-${Date.now()}`,
    promptId,
    promptTitle: result.promptTitle || result.variantTitle || "Imported result",
    promptText: result.promptText || "",
    status: result.status === "completed" ? "passed" : result.status === "failed" ? "failed" : "needs-review",
    resultUrl: result.resultUrl || "",
    folderPath: result.runFolder || result.folderPath || "",
    screenshotUrl: result.screenshotUrl || "",
    filesChanged: result.filesChanged || "",
    errors: result.errors || "",
    notes: result.notes || "Imported from queue-result.json.",
    score: Number(result.score || 0),
    failureCategories: [],
    createdAt: result.createdAt || updatedAt,
    updatedAt,
  };
  const screenshot = buildRun.screenshotUrl
    ? {
        id: `screenshot-${Date.now()}`,
        promptId,
        title: `${buildRun.promptTitle} desktop`,
        url: buildRun.screenshotUrl,
        notes: buildRun.notes,
        rating: buildRun.status === "passed" ? "great" : "unrated",
        createdAt: updatedAt,
      }
    : null;
  const lineage = {
    id: `lineage-import-${buildRun.id}`,
    parentId: `lineage-source-${promptId}`,
    promptId,
    kind: "build",
    title: buildRun.promptTitle,
    score: buildRun.score,
    status: buildRun.status,
    detail: buildRun.resultUrl || buildRun.folderPath || "Imported build result.",
    createdAt: updatedAt,
  };
  return { buildRun, screenshot, lineage };
}

function localModelEvaluation(body) {
  const prompt = String(body.prompt || "");
  const memory = String(body.memory || "");
  const words = prompt.match(/[A-Za-z0-9_'-]+/g)?.length || 0;
  const exactSignals = ["react", "typescript", "tailwind", "video", "font", "color", "responsive", "aria", "verify", "no "].filter((term) =>
    prompt.toLowerCase().includes(term),
  );
  const score = Math.max(18, Math.min(96, Math.round(words / 18 + exactSignals.length * 7 + Math.min(20, memory.length / 1000))));
  return {
    ok: true,
    mode: "local-fallback",
    score,
    findings: [
      `${words} prompt words`,
      `${exactSignals.length} implementation signals: ${exactSignals.join(", ") || "none"}`,
      memory ? "Prompt memory included." : "No prompt memory supplied.",
    ],
    recommendations: [
      score < 70 ? "Add exact assets, responsive rules, interaction states, and QA checks." : "Ready for runner comparison.",
      "Set PROMPT_LAB_MODEL_ENDPOINT to use an external evaluator through this same API route.",
    ],
  };
}

function clampText(value, limit) {
  const text = String(value || "");
  return text.length > limit ? `${text.slice(0, limit)}\n\n[truncated ${text.length - limit} characters]` : text;
}

function parsePossiblyJsonText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function buildEvaluatorPrompt(body) {
  return [
    "You are a strict website-prompt evaluator for Prompt Atelier.",
    "Score whether the prompt is specific, buildable, visually strong, responsive, accessible, and ready for a coding agent.",
    "Return only JSON with this schema:",
    '{"score": number, "findings": string[], "recommendations": string[], "readiness": "blocked" | "ready" | "excellent", "diagnosis": string[], "questions": string[], "rewrittenPrompt": string}',
    "",
    "PROMPT:",
    clampText(body.prompt, 9000),
    "",
    "LEARNED MEMORY:",
    clampText(body.memory, 9000),
    "",
    "CONTEXT:",
    clampText(JSON.stringify(body.context || {}, null, 2), 4000),
  ].join("\n");
}

function normalizeModelEvaluation({ mode, payload, rawText }) {
  const parsed = parsePossiblyJsonText(rawText) || {};
  const score = Number(parsed.score ?? payload?.score ?? rawText?.match(/score[^0-9]*(\d{1,3})/i)?.[1] ?? 0);
  const findings = Array.isArray(parsed.findings) ? parsed.findings.map(String) : Array.isArray(payload?.findings) ? payload.findings.map(String) : [];
  const recommendations = Array.isArray(parsed.recommendations)
    ? parsed.recommendations.map(String)
    : Array.isArray(payload?.recommendations)
      ? payload.recommendations.map(String)
      : [];
  const diagnosis = Array.isArray(parsed.diagnosis) ? parsed.diagnosis.map(String) : [];
  const questions = Array.isArray(parsed.questions) ? parsed.questions.map(String) : [];
  return {
    ok: true,
    mode,
    score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
    readiness: parsed.readiness || payload?.readiness || "needs-review",
    findings,
    recommendations,
    diagnosis,
    questions,
    rewrittenPrompt: typeof parsed.rewrittenPrompt === "string" ? parsed.rewrittenPrompt : "",
    rawText,
    payload,
  };
}

async function anthropicModelEvaluation(body) {
  const settings = body.settings || {};
  const endpoint = settings.endpoint || process.env.ANTHROPIC_API_ENDPOINT || "https://api.anthropic.com/v1/messages";
  const apiKey = settings.apiKey || process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || process.env.PROMPT_LAB_MODEL_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Anthropic API key. Set ANTHROPIC_API_KEY, CLAUDE_API_KEY, PROMPT_LAB_MODEL_API_KEY, or provide settings.apiKey.");
  }
  const model = settings.model || process.env.PROMPT_LAB_MODEL_NAME || "claude-sonnet-5";
  const requestBody = {
    model,
    max_tokens: Number(settings.maxTokens || process.env.PROMPT_LAB_MODEL_MAX_TOKENS || 900),
    messages: [{ role: "user", content: buildEvaluatorPrompt(body) }],
  };
  if (!/\bclaude-[a-z-]*5\b/.test(model)) {
    requestBody.temperature = Number(settings.temperature ?? 0.2);
  }
  const modelResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": process.env.ANTHROPIC_VERSION || "2023-06-01",
    },
    body: JSON.stringify(requestBody),
  });
  const payload = await modelResponse.json();
  if (!modelResponse.ok) {
    return { ok: false, status: modelResponse.status, mode: "anthropic", payload };
  }
  const rawText = Array.isArray(payload.content)
    ? payload.content.map((block) => (block?.type === "text" ? block.text : "")).filter(Boolean).join("\n")
    : "";
  return normalizeModelEvaluation({ mode: "anthropic", payload, rawText });
}

async function externalModelEvaluation(body, endpoint) {
  const settings = body.settings || {};
  const modelResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(settings.apiKey || process.env.PROMPT_LAB_MODEL_API_KEY ? { Authorization: `Bearer ${settings.apiKey || process.env.PROMPT_LAB_MODEL_API_KEY}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const payload = await modelResponse.json();
  return { ok: modelResponse.ok, mode: "external", payload };
}

async function handle(request, response) {
  if (request.method === "OPTIONS") {
    jsonResponse(response, 200, { ok: true });
    return;
  }

  const url = new URL(request.url || "/", `http://127.0.0.1:${PORT}`);

  try {
    if (url.pathname !== "/api/health" && !rateLimitAllows(request)) {
      jsonResponse(response, 429, { ok: false, error: "Rate limit exceeded. Try again in a minute." });
      return;
    }

    if (!requestIsAuthorized(request) && url.pathname !== "/api/health") {
      logEvent("unauthorized", { path: url.pathname, client: clientKey(request) });
      jsonResponse(response, 401, { ok: false, error: "Unauthorized. Set Authorization: Bearer <token> or x-prompt-lab-token." });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      jsonResponse(response, 200, {
        ok: true,
        port: PORT,
        sqlitePath: DB_PATH,
        dataDir: DATA_DIR,
        authRequired: Boolean(API_TOKEN),
        allowedOrigin: ALLOWED_ORIGIN,
        rateLimitPerMinute: API_RATE_LIMIT,
        skill: skillStatus(),
        collections: COLLECTION_KEYS,
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/collections") {
      const key = url.searchParams.get("key");
      if (key) {
        const row = getCollection.get(key);
        jsonResponse(response, 200, { key, value: row ? JSON.parse(row.value) : null });
        return;
      }
      jsonResponse(response, 200, { collections: readCollections() });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/events") {
      const limit = Math.max(1, Math.min(100, Number(url.searchParams.get("limit") || 30)));
      const events = getRecentEvents.all(limit).map((event) => {
        let detail = null;
        try {
          detail = JSON.parse(event.detail);
        } catch {
          detail = event.detail;
        }
        return { id: event.id, kind: event.kind, detail, createdAt: event.created_at };
      });
      jsonResponse(response, 200, { ok: true, events });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/collections") {
      const body = await readBody(request);
      if (body.key) writeCollection(body.key, body.value ?? []);
      if (body.collections) {
        for (const [key, value] of Object.entries(body.collections)) writeCollection(key, value);
      }
      logEvent("collections-sync", { keys: body.key ? [body.key] : Object.keys(body.collections || {}) });
      jsonResponse(response, 200, { ok: true, collections: readCollections() });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/snapshot") {
      const collections = readCollections();
      const skill = skillStatus();
      const snapshot = {
        version: 1,
        exportedAt: now(),
        sqlitePath: DB_PATH,
        collections,
        skill: skill.installed ? { ...skill, content: readFileSync(SKILL_PATH, "utf8") } : skill,
      };
      jsonResponse(response, 200, snapshot);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/skill/status") {
      jsonResponse(response, 200, skillStatus());
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/skill/install") {
      const body = await readBody(request);
      if (!body.content || typeof body.content !== "string") {
        jsonResponse(response, 400, { ok: false, error: "Missing skill content." });
        return;
      }
      mkdirSync(dirname(SKILL_PATH), { recursive: true });
      writeFileSync(SKILL_PATH, body.content);
      logEvent("skill-install", { path: SKILL_PATH });
      jsonResponse(response, 200, { ok: true, skill: skillStatus() });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/queue/run") {
      const body = await readBody(request);
      const queuePath = resolve(body.queuePath || join(DATA_DIR, "api-queue.json"));
      if (body.queue) writeFileSync(queuePath, `${JSON.stringify(body.queue, null, 2)}\n`);
      const args = ["--queue", queuePath];
      if (body.jobId) args.push("--job", body.jobId);
      if (body.capture) args.push("--capture");
      if (body.scaffold) args.push("--scaffold");
      if (body.install) args.push("--install");
      if (body.buildCommand) args.push("--build", body.buildCommand);
      if (body.agentCommand) args.push("--agent", body.agentCommand);
      const result = runNodeScript("runQueue.mjs", args, 180000);
      logEvent("queue-run", { queuePath, ok: result.ok });
      jsonResponse(response, result.ok ? 200 : 500, result);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/capture") {
      const body = await readBody(request);
      if (!body.url) {
        jsonResponse(response, 400, { ok: false, error: "Missing url." });
        return;
      }
      const args = ["--url", body.url, "--out", body.out || join("output", "playwright", "api-capture")];
      if (body.desktop) args.push("--desktop", body.desktop);
      if (body.mobile) args.push("--mobile", body.mobile);
      const result = runNodeScript("captureResult.mjs", args, 90000);
      logEvent("capture", { url: body.url, ok: result.ok });
      jsonResponse(response, result.ok ? 200 : 500, result);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/visual/analyze") {
      const body = await readBody(request);
      const files = Array.isArray(body.files) ? body.files.filter(Boolean) : [body.desktop, body.mobile, body.file].filter(Boolean);
      if (!files.length) {
        jsonResponse(response, 400, { ok: false, error: "Missing screenshot file path." });
        return;
      }
      const args = files.flatMap((file) => ["--file", file]);
      const result = runNodeScript("analyzeScreenshots.mjs", args, 90000);
      logEvent("visual-analyze", { files, ok: result.ok });
      jsonResponse(response, result.ok ? 200 : 500, result);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/visual/qa") {
      const body = await readBody(request);
      if (!body.url) {
        jsonResponse(response, 400, { ok: false, error: "Missing url." });
        return;
      }
      const args = ["--url", body.url, "--out", body.out || join("output", "visual-qa", "api-qa")];
      if (body.desktop) args.push("--desktop", body.desktop);
      if (body.mobile) args.push("--mobile", body.mobile);
      const result = runNodeScript("visualQa.mjs", args, 120000);
      logEvent("visual-qa", { url: body.url, ok: result.ok, score: result.parsed?.score ?? 0 });
      jsonResponse(response, result.ok ? 200 : 500, result);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/result/import") {
      const body = await readBody(request);
      const normalized = normalizeImportedResult(body.result || body);
      const current = readCollections();
      const buildRuns = [normalized.buildRun, ...((current.buildRuns || []).filter((item) => item.id !== normalized.buildRun.id))].slice(0, 100);
      const screenshots = normalized.screenshot ? [normalized.screenshot, ...(current.screenshots || [])].slice(0, 100) : current.screenshots || [];
      const lineage = [normalized.lineage, ...(current.lineage || [])].slice(0, 200);
      writeCollection("buildRuns", buildRuns);
      writeCollection("screenshots", screenshots);
      writeCollection("lineage", lineage);
      logEvent("result-import", { id: normalized.buildRun.id });
      jsonResponse(response, 200, { ok: true, ...normalized, collections: { buildRuns, screenshots, lineage } });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/model/evaluate") {
      const body = await readBody(request);
      const provider = body.settings?.provider || process.env.PROMPT_LAB_MODEL_PROVIDER || "";
      const endpoint = body.settings?.endpoint || process.env.PROMPT_LAB_MODEL_ENDPOINT;
      if (provider === "anthropic" || endpoint?.includes("api.anthropic.com")) {
        const result = await anthropicModelEvaluation(body);
        logEvent("model-evaluate", { mode: "anthropic", ok: result.ok, score: result.score ?? 0 });
        jsonResponse(response, result.ok ? 200 : 502, result);
        return;
      }
      if (endpoint) {
        const result = await externalModelEvaluation(body, endpoint);
        logEvent("model-evaluate", { endpoint, ok: result.ok });
        jsonResponse(response, result.ok ? 200 : 502, result);
        return;
      }
      const local = localModelEvaluation(body);
      logEvent("model-evaluate", { mode: local.mode, score: local.score });
      jsonResponse(response, 200, local);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/model/settings") {
      jsonResponse(response, 200, {
        endpointConfigured: Boolean(process.env.PROMPT_LAB_MODEL_ENDPOINT),
        apiKeyConfigured: Boolean(process.env.PROMPT_LAB_MODEL_API_KEY),
        anthropicApiKeyConfigured: Boolean(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY),
        anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || process.env.PROMPT_LAB_MODEL_PROVIDER === "anthropic"),
        agentCommandConfigured: Boolean(process.env.PROMPT_LAB_AGENT_COMMAND),
        buildCommandConfigured: Boolean(process.env.PROMPT_LAB_BUILD_COMMAND),
      });
      return;
    }

    jsonResponse(response, 404, { ok: false, error: `No route for ${request.method} ${url.pathname}` });
  } catch (error) {
    jsonResponse(response, 500, { ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

const server = createServer((request, response) => {
  void handle(request, response);
});

server.listen(PORT, HOST, () => {
  console.log(`Prompt Lab API listening on http://${HOST}:${PORT}`);
  console.log(`SQLite database: ${DB_PATH}`);
});
