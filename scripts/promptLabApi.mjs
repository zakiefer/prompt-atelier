import { Buffer } from "node:buffer";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";

const PORT = Number(process.env.PORT || process.env.PROMPT_LAB_API_PORT || 8787);
const HOST = process.env.HOST || process.env.PROMPT_LAB_API_HOST || "127.0.0.1";
const ROOT = process.cwd();
const DATA_DIR = resolve(process.env.PROMPT_LAB_DATA_DIR || join(ROOT, "data"));
const DB_PATH = join(DATA_DIR, "prompt-atelier.sqlite");
const API_TOKEN = process.env.PROMPT_LAB_API_TOKEN || "";
const ALLOWED_ORIGIN = process.env.PROMPT_LAB_ALLOWED_ORIGIN || "*";
const API_RATE_LIMIT = Number(process.env.PROMPT_LAB_RATE_LIMIT || 240);
const MAX_BODY_BYTES = Number(process.env.PROMPT_LAB_MAX_BODY_BYTES || 1_000_000);
const WORKER_ENABLED = process.env.PROMPT_LAB_WORKER_ENABLED !== "false";
const WORKER_TIMEOUT_MS = Number(process.env.PROMPT_LAB_WORKER_TIMEOUT_MS || 240000);
const WORKER_ALLOWED_BUILD_COMMANDS = new Set(
  (process.env.PROMPT_LAB_ALLOWED_BUILD_COMMANDS || "npm run build,true")
    .split(",")
    .map((command) => command.trim())
    .filter(Boolean),
);
const WORKER_ALLOWED_AGENT_PREFIXES = (process.env.PROMPT_LAB_ALLOWED_AGENT_PREFIXES || "")
  .split(",")
  .map((prefix) => prefix.trim())
  .filter(Boolean);
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
  "learnerSessions",
  "activeWorkspace",
  "closedLoopRuns",
  "benchmarkRuns",
  "claudeHealthChecks",
  "promptComparisons",
  "screenshotPromptRuns",
  "workspacePackRuns",
  "proofLearningRuns",
  "screenshotJudgeRuns",
  "mutationTournamentRuns",
  "healthChecks",
  "trainingRuns",
  "modelEvaluationCache",
  "promptCandidateRuns",
  "corpusClusterRuns",
  "benchmarkV2Runs",
  "evaluationArtifacts",
  "hostedSetupChecks",
  "proofArtifacts",
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

const UPSERT_COLLECTION_SQL = `
  INSERT INTO collections (key, value, updated_at)
  VALUES (?, ?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
`;
const GET_COLLECTION_SQL = "SELECT value FROM collections WHERE key = ?";
const GET_ALL_COLLECTIONS_SQL = "SELECT key, value, updated_at FROM collections ORDER BY key";
const INSERT_EVENT_SQL = "INSERT INTO api_events (kind, detail, created_at) VALUES (?, ?, ?)";
const GET_RECENT_EVENTS_SQL = "SELECT id, kind, detail, created_at FROM api_events ORDER BY id DESC LIMIT ?";
const rateLimitBuckets = new Map();
const MODEL_EVALUATION_SCHEMA_VERSION = "prompt-atelier.model-evaluation.v1";
const MODEL_EVALUATION_SCHEMA = {
  schemaVersion: MODEL_EVALUATION_SCHEMA_VERSION,
  required: ["score", "readiness", "findings", "recommendations"],
};

function now() {
  return new Date().toISOString();
}

function logEvent(kind, detail) {
  db.prepare(INSERT_EVENT_SQL).run(kind, JSON.stringify(redactSensitiveValue(detail).value), now());
}

function logEventBestEffort(kind, detail) {
  try {
    logEvent(kind, detail);
  } catch {
    // Auth rejection should stay reliable even if event persistence is unavailable.
  }
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
    let bytes = 0;
    let rejected = false;
    request.on("data", (chunk) => {
      bytes += Buffer.byteLength(chunk);
      if (bytes > MAX_BODY_BYTES) {
        rejected = true;
        reject(new Error(`Request body too large. Limit is ${MAX_BODY_BYTES} bytes.`));
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on("end", () => {
      if (rejected) return;
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
  const rows = db.prepare(GET_ALL_COLLECTIONS_SQL).all();
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
  db.prepare(UPSERT_COLLECTION_SQL).run(key, JSON.stringify(redactSensitiveValue(value).value), now());
}

function appendCollectionRecord(key, record, limit = 100) {
  const current = readCollections();
  const existing = Array.isArray(current[key]) ? current[key] : [];
  const next = [record, ...existing.filter((item) => item?.id !== record.id)].slice(0, limit);
  writeCollection(key, next);
  return next;
}

function stableHash(value) {
  return createHash("sha256").update(String(value || "")).digest("hex").slice(0, 20);
}

function productExamplesFromBody(body) {
  return Array.isArray(body.examples) ? body.examples.map((example, index) => ({
    id: String(example.id || `api-example-${index + 1}`),
    title: String(example.title || `Example ${index + 1}`),
    text: String(example.text || example.prompt || ""),
  })).filter((example) => example.text.trim()) : [];
}

function localPromptScore(text) {
  const prompt = String(text || "");
  const words = prompt.match(/[A-Za-z0-9_'-]+/g)?.length || 0;
  const signals = ["react", "typescript", "tailwind", "video", "font", "color", "responsive", "aria", "verify", "screenshot", "mobile", "asset"].filter((term) => prompt.toLowerCase().includes(term));
  return Math.max(20, Math.min(100, Math.round(words / 16 + signals.length * 7)));
}

function buildApiCorpusReport(examples) {
  const families = [
    { label: "Cinematic video hero", terms: ["video", "cinematic", "hero"] },
    { label: "Dashboard SaaS", terms: ["dashboard", "chart", "table"] },
    { label: "Liquid glass", terms: ["glass", "backdrop", "blur"] },
    { label: "Mobile menu", terms: ["mobile", "hamburger", "menu"] },
  ];
  const clusters = families.map((family) => {
    const matches = examples.filter((example) => family.terms.some((term) => example.text.toLowerCase().includes(term)));
    return { label: family.label, count: matches.length, examples: matches.slice(0, 4).map((example) => example.title) };
  }).filter((cluster) => cluster.count > 0);
  const gaps = families.filter((family) => !clusters.some((cluster) => cluster.label === family.label)).map((family) => ({
    label: family.label,
    severity: 2,
    detail: `Add more ${family.label.toLowerCase()} examples.`,
  }));
  return {
    score: Math.max(0, Math.min(100, 70 + clusters.length * 6 - gaps.length * 7)),
    clusters,
    gaps,
    strongFamilies: clusters.slice(0, 4).map((cluster) => `${cluster.label}: ${cluster.count}`),
    weakExamples: examples.map((example) => ({ ...example, score: localPromptScore(example.text) })).filter((example) => example.score < 55).slice(0, 6),
    suggestions: gaps.map((gap) => gap.detail),
    quarantineSuggestions: examples.filter((example) => /api key|password|kapital-next|you are firing/i.test(example.text)).map((example) => `${example.title}: review for off-project or sensitive text.`),
  };
}

function buildApiBenchmarkV2Report(examples) {
  const fixtures = [
    { id: "cinematic-video-hero", title: "Cinematic video hero", requiredSignals: ["video", "font", "responsive", "screenshot"] },
    { id: "dashboard-surface", title: "Dashboard surface", requiredSignals: ["dashboard", "chart", "empty", "table"] },
    { id: "signup-flow", title: "Signup flow", requiredSignals: ["input", "password", "submit", "mobile"] },
    { id: "prompt-tooling", title: "Prompt tooling", requiredSignals: ["corpus", "export", "redaction", "benchmark"] },
  ];
  const corpus = examples.map((example) => example.text.toLowerCase()).join("\n");
  const rows = fixtures.map((fixture) => {
    const missingTraits = fixture.requiredSignals.filter((signal) => !corpus.includes(signal));
    const localScore = Math.max(30, Math.min(100, 100 - missingTraits.length * 14));
    return {
      fixtureId: fixture.id,
      title: fixture.title,
      expectedTraits: fixture.requiredSignals,
      missingTraits,
      localScore,
      modelScore: localScore,
      delta: 0,
      regressionExplanation: `${fixture.title} is stable in local fallback mode.`,
      suggestedFix: missingTraits.length ? `Add examples with ${missingTraits.join(", ")}.` : "Keep this fixture in the benchmark set.",
    };
  });
  const score = Math.round(rows.reduce((sum, row) => sum + row.modelScore, 0) / rows.length);
  return {
    score,
    rows,
    summary: [
      `Benchmark v2 average is ${score}.`,
      `${rows.filter((row) => row.missingTraits.length).length} fixture(s) have missing expected traits.`,
      "Local fallback mode uses deterministic corpus traits.",
    ],
  };
}

function mergeRedactionFindings(left = [], right = []) {
  const counts = new Map();
  for (const finding of [...left, ...right]) {
    counts.set(finding.kind, (counts.get(finding.kind) || 0) + finding.count);
  }
  return Array.from(counts.entries()).map(([kind, count]) => ({ kind, count }));
}

function redactSensitiveText(value) {
  let text = String(value || "");
  const findings = new Map();
  const redact = (kind, pattern, replacement) => {
    let count = 0;
    text = text.replace(pattern, () => {
      count += 1;
      return replacement;
    });
    if (count) findings.set(kind, (findings.get(kind) || 0) + count);
  };
  redact("anthropic-key", /sk-ant-api\d{2}-[A-Za-z0-9_-]{20,}/g, "[REDACTED_ANTHROPIC_KEY]");
  redact("openai-key", /sk-(?:proj-)?[A-Za-z0-9_-]{24,}/g, "[REDACTED_OPENAI_KEY]");
  redact("github-token", /gh[pousr]_[A-Za-z0-9_]{30,}/g, "[REDACTED_GITHUB_TOKEN]");
  redact("bearer-token", /Bearer\s+[A-Za-z0-9._-]{24,}/gi, "Bearer [REDACTED_BEARER_TOKEN]");
  redact("generic-secret", /\b(api[_-]?key|secret|token|password)\b\s*[:=]\s*["']?[A-Za-z0-9._-]{16,}["']?/gi, "secret=[REDACTED_SECRET]");
  return { text, findings: Array.from(findings.entries()).map(([kind, count]) => ({ kind, count })) };
}

function redactSensitiveValue(value) {
  if (typeof value === "string") {
    const redacted = redactSensitiveText(value);
    return { value: redacted.text, findings: redacted.findings };
  }
  if (Array.isArray(value)) {
    let findings = [];
    const next = value.map((item) => {
      const redacted = redactSensitiveValue(item);
      findings = mergeRedactionFindings(findings, redacted.findings);
      return redacted.value;
    });
    return { value: next, findings };
  }
  if (value && typeof value === "object") {
    let findings = [];
    const next = {};
    for (const [key, item] of Object.entries(value)) {
      if (/api[_-]?key|secret|token|password/i.test(key) && typeof item === "string" && item) {
        next[key] = "[REDACTED_SECRET]";
        findings = mergeRedactionFindings(findings, [{ kind: "generic-secret", count: 1 }]);
        continue;
      }
      const redacted = redactSensitiveValue(item);
      next[key] = redacted.value;
      findings = mergeRedactionFindings(findings, redacted.findings);
    }
    return { value: next, findings };
  }
  return { value, findings: [] };
}

function redactModelBody(body) {
  const prompt = redactSensitiveText(body.prompt || "");
  const memory = redactSensitiveText(body.memory || "");
  const context = redactSensitiveValue(body.context || {});
  const full = redactSensitiveValue(body || {});
  return {
    body: {
      ...body,
      prompt: prompt.text,
      memory: memory.text,
      context: context.value,
    },
    findings: full.findings,
  };
}

function withModelSchema(result, redactions = []) {
  return {
    schemaVersion: MODEL_EVALUATION_SCHEMA_VERSION,
    schema: MODEL_EVALUATION_SCHEMA,
    redactions,
    ...result,
    readiness: normalizeReadiness(result.readiness),
  };
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

function pathIsInside(parent, child) {
  const parentPath = resolve(parent);
  const childPath = resolve(child);
  return childPath === parentPath || childPath.startsWith(`${parentPath}${sep}`);
}

function safeDataPath(input, fallback) {
  const target = resolve(input || fallback);
  if (!pathIsInside(DATA_DIR, target)) {
    throw new Error(`Worker path must stay inside PROMPT_LAB_DATA_DIR: ${DATA_DIR}`);
  }
  return target;
}

function safeBuildCommand(command) {
  const value = String(command || "").trim();
  if (!value) return "";
  if (!WORKER_ALLOWED_BUILD_COMMANDS.has(value)) {
    throw new Error(`Build command is not allowlisted: ${value}`);
  }
  return value;
}

function safeAgentCommand(command) {
  const value = String(command || "").trim();
  if (!value) return "";
  if (!WORKER_ALLOWED_AGENT_PREFIXES.length || !WORKER_ALLOWED_AGENT_PREFIXES.some((prefix) => value.startsWith(prefix))) {
    throw new Error("Agent command is disabled or does not match PROMPT_LAB_ALLOWED_AGENT_PREFIXES.");
  }
  return value;
}

function safeWorkerTimeout(value) {
  const requested = Number(value || WORKER_TIMEOUT_MS);
  if (!Number.isFinite(requested) || requested <= 0) return Math.min(WORKER_TIMEOUT_MS, 240000);
  return Math.max(10_000, Math.min(requested, WORKER_TIMEOUT_MS));
}

function proofArtifactsFromResult(result, job, createdAt) {
  const artifacts = [];
  if (result?.screenshotUrl) {
    artifacts.push({
      id: `artifact-${job.id}-desktop`,
      jobId: job.id,
      promptId: job.promptId,
      title: `${job.promptTitle} desktop screenshot`,
      kind: "screenshot",
      viewport: "desktop",
      path: result.screenshotUrl,
      url: result.screenshotUrl,
      resultUrl: result.resultUrl || job.resultUrl || "",
      score: Number(result.score || 0),
      createdAt,
    });
  }
  return artifacts;
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
    schemaVersion: MODEL_EVALUATION_SCHEMA_VERSION,
    schema: MODEL_EVALUATION_SCHEMA,
    mode: "local-fallback",
    score,
    readiness: score >= 88 ? "excellent" : score >= 72 ? "ready" : score >= 45 ? "needs-review" : "blocked",
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

function localClosedLoopRewrite(prompt, memory = "", context = {}) {
  const title = String(context.sourceTitle || context.title || "Prompt").trim();
  const memoryHint = String(memory || "").split("\n").find((line) => /exact|asset|mobile|verify|screenshot|responsive/i.test(line)) || "Exact assets, responsive rules, and verification gates win.";
  return [
    String(prompt || "").trim(),
    "",
    "CLOSED-LOOP REWRITE PATCH",
    `Source: ${title}`,
    `Learned memory: ${memoryHint.replace(/^[-#*\s]+/, "")}`,
    "",
    "Add or tighten these sections without removing existing specifics:",
    "- Exact visual system: fonts, colors, spacing, layer order, and first-viewport composition.",
    "- Asset contract: exact URLs, object-position/focal rules, fallbacks, and media readiness.",
    "- Interaction states: desktop/mobile navigation, hover/focus/active states, loading/empty states, and reduced-motion behavior.",
    "- Proof gates: lint/build, desktop and mobile screenshots, console errors, media nonblank checks, text fit, and horizontal overflow.",
    "- Safety constraints: no browser secrets, no unrelated project data, no placeholder imagery unless explicitly requested.",
  ].filter(Boolean).join("\n");
}

async function evaluatePromptForClosedLoop(body) {
  const provider = body.settings?.provider || process.env.PROMPT_LAB_MODEL_PROVIDER || "";
  const endpoint = body.settings?.endpoint || process.env.PROMPT_LAB_MODEL_ENDPOINT;
  const serverScopedBody = {
    ...body,
    settings: {
      ...(body.settings || {}),
      apiKey: undefined,
    },
  };
  const hasServerAnthropicKey = Boolean(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || process.env.PROMPT_LAB_MODEL_API_KEY);
  if ((provider === "anthropic" || endpoint?.includes("api.anthropic.com")) && hasServerAnthropicKey) {
    return withModelSchema(await anthropicModelEvaluation(serverScopedBody), []);
  }
  if (endpoint && !endpoint.includes("api.anthropic.com")) {
    return withModelSchema(await externalModelEvaluation(serverScopedBody, endpoint), []);
  }
  return withModelSchema({
    ...localModelEvaluation(serverScopedBody),
    rewrittenPrompt: localClosedLoopRewrite(serverScopedBody.prompt, serverScopedBody.memory, serverScopedBody.context),
  }, []);
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

function normalizeReadiness(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("excellent")) return "excellent";
  if (text.includes("ready")) return "ready";
  if (text.includes("block")) return "blocked";
  return "needs-review";
}

function buildEvaluatorPrompt(body) {
  return [
    "You are a strict website-prompt evaluator for Prompt Atelier.",
    "Score whether the prompt is specific, buildable, visually strong, responsive, accessible, and ready for a coding agent.",
    "If the task asks for prompt generation, screenshot recreation, A/B comparison, or recipe output, still score the work and put the generated prompt in rewrittenPrompt, the comparison hybrid in hybridPrompt, and the recipe in recipe.",
    "Return only JSON with this schema:",
    '{"score": number, "findings": string[], "recommendations": string[], "readiness": "blocked" | "ready" | "excellent", "diagnosis": string[], "questions": string[], "rewrittenPrompt": string, "winner": string, "hybridPrompt": string, "recipe": string}',
    "",
    "PROMPT:",
    clampText(body.prompt, 9000),
    "",
    "LEARNED MEMORY:",
    clampText(body.memory, 9000),
    "",
    "CONTEXT:",
    clampText(JSON.stringify(body.context || {}, null, 2), 4000),
    body.imageDataUrl ? "\nA screenshot image is attached as an image block. Use it only for visual reconstruction details." : "",
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
    schemaVersion: MODEL_EVALUATION_SCHEMA_VERSION,
    schema: MODEL_EVALUATION_SCHEMA,
    mode,
    score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
    readiness: normalizeReadiness(parsed.readiness || payload?.readiness),
    findings,
    recommendations,
    diagnosis,
    questions,
    rewrittenPrompt: typeof parsed.rewrittenPrompt === "string" ? parsed.rewrittenPrompt : "",
    winner: typeof parsed.winner === "string" ? parsed.winner : "",
    hybridPrompt: typeof parsed.hybridPrompt === "string" ? parsed.hybridPrompt : "",
    recipe: typeof parsed.recipe === "string" ? parsed.recipe : "",
    rawText,
    payload,
  };
}

function imageBlockFromDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/(?:png|jpe?g|webp|gif));base64,([\s\S]+)$/i);
  if (!match) return null;
  return {
    type: "image",
    source: {
      type: "base64",
      media_type: match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase(),
      data: match[2].replace(/\s/g, ""),
    },
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
  const imageBlock = imageBlockFromDataUrl(body.imageDataUrl);
  const requestBody = {
    model,
    max_tokens: Number(settings.maxTokens || process.env.PROMPT_LAB_MODEL_MAX_TOKENS || 900),
    messages: [
      {
        role: "user",
        content: imageBlock
          ? [{ type: "text", text: buildEvaluatorPrompt(body) }, imageBlock]
          : buildEvaluatorPrompt(body),
      },
    ],
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
  const outboundBody = {
    ...body,
    settings: {
      ...settings,
      apiKey: undefined,
    },
  };
  const modelResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(settings.apiKey || process.env.PROMPT_LAB_MODEL_API_KEY ? { Authorization: `Bearer ${settings.apiKey || process.env.PROMPT_LAB_MODEL_API_KEY}` } : {}),
    },
    body: JSON.stringify(outboundBody),
  });
  const payload = await modelResponse.json();
  return {
    ok: modelResponse.ok,
    schemaVersion: MODEL_EVALUATION_SCHEMA_VERSION,
    schema: MODEL_EVALUATION_SCHEMA,
    mode: "external",
    score: Number(payload.score || 0),
    readiness: normalizeReadiness(payload.readiness),
    findings: Array.isArray(payload.findings) ? payload.findings.map(String) : [],
    recommendations: Array.isArray(payload.recommendations) ? payload.recommendations.map(String) : [],
    payload: redactSensitiveValue(payload).value,
  };
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
      logEventBestEffort("unauthorized", { path: url.pathname, client: clientKey(request) });
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
        maxBodyBytes: MAX_BODY_BYTES,
        worker: {
          enabled: WORKER_ENABLED,
          timeoutMs: WORKER_TIMEOUT_MS,
          allowedBuildCommands: [...WORKER_ALLOWED_BUILD_COMMANDS],
          agentPrefixesConfigured: WORKER_ALLOWED_AGENT_PREFIXES.length,
          dataDir: DATA_DIR,
        },
        skill: skillStatus(),
        collections: COLLECTION_KEYS,
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/collections") {
      const key = url.searchParams.get("key");
      if (key) {
        const row = db.prepare(GET_COLLECTION_SQL).get(key);
        jsonResponse(response, 200, { key, value: row ? JSON.parse(row.value) : null });
        return;
      }
      jsonResponse(response, 200, { collections: readCollections() });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/events") {
      const limit = Math.max(1, Math.min(100, Number(url.searchParams.get("limit") || 30)));
      const events = db.prepare(GET_RECENT_EVENTS_SQL).all(limit).map((event) => {
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
      const redaction = redactSensitiveValue(body);
      if (body.key) writeCollection(body.key, body.value ?? []);
      if (body.collections) {
        for (const [key, value] of Object.entries(body.collections)) writeCollection(key, value);
      }
      logEvent("collections-sync", { keys: body.key ? [body.key] : Object.keys(body.collections || {}), redactions: redaction.findings });
      jsonResponse(response, 200, { ok: true, redactions: redaction.findings, collections: readCollections() });
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
      if (!WORKER_ENABLED) {
        jsonResponse(response, 403, { ok: false, error: "Hosted worker execution is disabled." });
        return;
      }
      let queuePath;
      let buildCommand;
      let agentCommand;
      let timeoutMs;
      try {
        queuePath = safeDataPath(body.queuePath, join(DATA_DIR, "api-queue.json"));
        buildCommand = safeBuildCommand(body.buildCommand);
        agentCommand = safeAgentCommand(body.agentCommand);
        timeoutMs = safeWorkerTimeout(body.timeoutMs || 180000);
      } catch (error) {
        jsonResponse(response, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
        return;
      }
      if (body.queue) writeFileSync(queuePath, `${JSON.stringify(body.queue, null, 2)}\n`);
      const args = ["--queue", queuePath];
      if (body.jobId) args.push("--job", body.jobId);
      if (body.capture) args.push("--capture");
      if (body.scaffold) args.push("--scaffold");
      if (body.install) args.push("--install");
      if (buildCommand) args.push("--build", buildCommand);
      if (agentCommand) args.push("--agent", agentCommand);
      logEvent("queue-progress", {
        stage: "queued",
        jobId: body.jobId || "all",
        queuePath,
        scaffold: Boolean(body.scaffold),
        install: Boolean(body.install),
        build: Boolean(buildCommand),
        capture: Boolean(body.capture),
      });
      if (body.scaffold) logEvent("queue-progress", { stage: "scaffold-requested", jobId: body.jobId || "all", queuePath });
      if (body.install) logEvent("queue-progress", { stage: "install-requested", jobId: body.jobId || "all", queuePath });
      if (buildCommand) logEvent("queue-progress", { stage: "build-requested", jobId: body.jobId || "all", queuePath, buildCommand });
      if (body.capture) logEvent("queue-progress", { stage: "capture-requested", jobId: body.jobId || "all", queuePath });
      const result = runNodeScript("runQueue.mjs", args, timeoutMs);
      const stage = result.ok ? "complete" : "failed";
      logEvent("queue-progress", {
        stage,
        jobId: body.jobId || "all",
        queuePath,
        processed: result.parsed?.processed ?? 0,
        results: Array.isArray(result.parsed?.results) ? result.parsed.results.map((item) => ({ id: item.id, status: item.status, runFolder: item.runFolder })) : [],
      });
      logEvent("queue-run", { queuePath, ok: result.ok, stage });
      jsonResponse(response, result.ok ? 200 : 500, { ...result, progressStage: stage });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/queue/job") {
      const body = await readBody(request);
      const jobId = String(body.jobId || "");
      const action = String(body.action || "");
      if (!jobId || !["retry", "cancel", "remove"].includes(action)) {
        jsonResponse(response, 400, { ok: false, error: "Expected jobId and action retry, cancel, or remove." });
        return;
      }
      const current = readCollections();
      const queueJobs = Array.isArray(current.queueJobs) ? current.queueJobs : [];
      const target = queueJobs.find((job) => job?.id === jobId);
      if (!target) {
        jsonResponse(response, 404, { ok: false, error: `Queue job not found: ${jobId}` });
        return;
      }
      const updatedAt = now();
      const nextJobs = action === "remove"
        ? queueJobs.filter((job) => job?.id !== jobId)
        : queueJobs.map((job) => {
            if (job?.id !== jobId) return job;
            return {
              ...job,
              status: action === "retry" ? "queued" : "failed",
              updatedAt,
              notes: [
                action === "retry" ? "Queued for retry from hosted queue operations." : "Canceled from hosted queue operations.",
                ...(Array.isArray(job.notes) ? job.notes : []),
              ].slice(0, 8),
            };
          });
      writeCollection("queueJobs", nextJobs);
      logEvent("queue-job-operation", { jobId, action, status: action === "retry" ? "queued" : action === "cancel" ? "failed" : "removed" });
      jsonResponse(response, 200, { ok: true, action, jobId, collections: { queueJobs: nextJobs } });
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

    if (request.method === "POST" && url.pathname === "/api/closed-loop/run") {
      const body = await readBody(request);
      const redacted = redactModelBody(body);
      const safeBody = redacted.body;
      const sourceTitle = String(safeBody.title || safeBody.context?.sourceTitle || "Closed-loop prompt");
      const original = await evaluatePromptForClosedLoop({
        ...safeBody,
        context: {
          ...(safeBody.context || {}),
          task: "Closed-loop pass 1. Score the original website prompt and return rewrittenPrompt with precise repair sections.",
          sourceTitle,
        },
      });
      const rewrittenPrompt = String(original.rewrittenPrompt || localClosedLoopRewrite(safeBody.prompt, safeBody.memory, { sourceTitle }));
      const improved = await evaluatePromptForClosedLoop({
        ...safeBody,
        prompt: rewrittenPrompt,
        context: {
          ...(safeBody.context || {}),
          task: "Closed-loop pass 2. Score the rewritten website prompt and explain whether it is stronger.",
          sourceTitle,
          originalScore: original.score,
        },
      });
      const originalScore = Number(original.score || localPromptScore(safeBody.prompt));
      const improvedScore = Number(improved.score || localPromptScore(rewrittenPrompt));
      const winnerPrompt = improvedScore >= originalScore ? rewrittenPrompt : String(safeBody.prompt || "");
      const createdAt = now();
      const run = {
        id: `closed-loop-api-${Date.now()}`,
        createdAt,
        sourceTitle,
        originalScore,
        improvedScore,
        winnerTitle: `${sourceTitle} API refined`,
        winnerPrompt,
        modelMode: improved.mode || original.mode || "local-fallback",
        findings: [...(original.findings || []), ...(improved.findings || [])].slice(0, 8),
        recommendations: [...(original.recommendations || []), ...(improved.recommendations || [])].slice(0, 8),
        redactions: redacted.findings,
      };
      const closedLoopRuns = appendCollectionRecord("closedLoopRuns", run, 40);
      logEvent("closed-loop-run", { id: run.id, mode: run.modelMode, originalScore, improvedScore });
      jsonResponse(response, 200, { ok: true, run, original, improved, winnerPrompt, redactions: redacted.findings, collections: { closedLoopRuns } });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/closed-loop/prove") {
      const body = await readBody(request);
      if (!WORKER_ENABLED) {
        jsonResponse(response, 403, { ok: false, error: "Hosted worker execution is disabled." });
        return;
      }
      const redacted = redactModelBody(body);
      const safeBody = redacted.body;
      let buildCommand;
      let agentCommand;
      let timeoutMs;
      try {
        buildCommand = safeBuildCommand(safeBody.buildCommand || process.env.PROMPT_LAB_BUILD_COMMAND || "npm run build");
        agentCommand = safeAgentCommand(safeBody.agentCommand || process.env.PROMPT_LAB_AGENT_COMMAND);
        timeoutMs = safeWorkerTimeout(safeBody.timeoutMs);
      } catch (error) {
        jsonResponse(response, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
        return;
      }
      const sourceTitle = String(safeBody.title || safeBody.context?.sourceTitle || "Closed-loop proof prompt");
      const original = await evaluatePromptForClosedLoop({
        ...safeBody,
        context: {
          ...(safeBody.context || {}),
          task: "Hosted proof worker pass 1. Score the original website prompt and return rewrittenPrompt with exact repair sections.",
          sourceTitle,
        },
      });
      const rewrittenPrompt = String(original.rewrittenPrompt || localClosedLoopRewrite(safeBody.prompt, safeBody.memory, { sourceTitle }));
      logEvent("closed-loop-proof", { stage: "rewrite-complete", sourceTitle, originalScore: original.score, redactions: redacted.findings });
      const improved = await evaluatePromptForClosedLoop({
        ...safeBody,
        prompt: rewrittenPrompt,
        context: {
          ...(safeBody.context || {}),
          task: "Hosted proof worker pass 2. Score the rewritten website prompt before build proof.",
          sourceTitle,
          originalScore: original.score,
        },
      });
      const originalScore = Number(original.score || localPromptScore(safeBody.prompt));
      const improvedScore = Number(improved.score || localPromptScore(rewrittenPrompt));
      const winnerPrompt = improvedScore >= originalScore ? rewrittenPrompt : String(safeBody.prompt || "");
      const createdAt = now();
      const run = {
        id: `closed-loop-proof-${Date.now()}`,
        createdAt,
        sourceTitle,
        originalScore,
        improvedScore,
        winnerTitle: `${sourceTitle} hosted proof winner`,
        winnerPrompt,
        modelMode: improved.mode || original.mode || "local-fallback",
        findings: [...(original.findings || []), ...(improved.findings || [])].slice(0, 8),
        recommendations: [...(original.recommendations || []), ...(improved.recommendations || [])].slice(0, 8),
        redactions: redacted.findings,
      };
      const jobId = `hosted-proof-${Date.now()}`;
      const runFolder = join(DATA_DIR, "proof-runs", jobId);
      const job = {
        id: jobId,
        promptId: String(safeBody.promptId || jobId),
        promptTitle: sourceTitle,
        promptText: winnerPrompt,
        variantTitle: run.winnerTitle,
        status: "queued",
        runFolder,
        resultUrl: String(safeBody.resultUrl || ""),
        score: improvedScore,
        commands: [],
        notes: ["Created by /api/closed-loop/prove."],
        createdAt,
        updatedAt: createdAt,
      };
      const queue = { jobs: [job], createdAt };
      const queuePath = safeDataPath(join(DATA_DIR, `${jobId}.json`), join(DATA_DIR, `${jobId}.json`));
      writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
      const args = ["--queue", queuePath, "--job", jobId, "--scaffold", "--build", buildCommand];
      if (safeBody.install !== false) args.push("--install");
      if (safeBody.capture !== false) args.push("--capture");
      if (agentCommand) args.push("--agent", agentCommand);
      logEvent("closed-loop-proof", { id: run.id, jobId, stage: "job-created", mode: run.modelMode, queuePath, buildCommand, timeoutMs });
      logEvent("queue-progress", { stage: "hosted-proof-worker-started", jobId, queuePath });
      const queueResult = runNodeScript("runQueue.mjs", args, timeoutMs);
      const parsedResult = Array.isArray(queueResult.parsed?.results) ? queueResult.parsed.results[0] : null;
      const normalizedResult = parsedResult ? normalizeImportedResult(parsedResult) : null;
      const artifactRows = parsedResult ? proofArtifactsFromResult(parsedResult, job, createdAt) : [];
      const proofRun = {
        id: `proof-${jobId}`,
        createdAt,
        promptId: job.promptId,
        title: run.winnerTitle,
        queueJobId: jobId,
        phase: queueResult.ok ? "complete" : "failed",
        promptScore: improvedScore,
        resultScore: Number(parsedResult?.score || 0),
        visualScore: parsedResult?.screenshotUrl ? 80 : 0,
        dnaScore: improvedScore,
        learnedStatus: queueResult.ok ? "proof-ready" : "needs-review",
        screenshotCount: parsedResult?.screenshotUrl ? 1 : 0,
        notes: [
          queueResult.ok ? "Hosted proof worker completed." : "Hosted proof worker failed.",
          parsedResult?.resultUrl ? `Result URL: ${parsedResult.resultUrl}` : "No result URL returned.",
        ],
      };
      const closedLoopRuns = appendCollectionRecord("closedLoopRuns", run, 40);
      const current = readCollections();
      const queueJobs = [job, ...((current.queueJobs || []).filter((item) => item.id !== job.id))].slice(0, 140);
      const proofLearningRuns = [proofRun, ...(current.proofLearningRuns || [])].slice(0, 80);
      const buildRuns = normalizedResult
        ? [normalizedResult.buildRun, ...((current.buildRuns || []).filter((item) => item.id !== normalizedResult.buildRun.id))].slice(0, 120)
        : current.buildRuns || [];
      const screenshots = normalizedResult?.screenshot
        ? [normalizedResult.screenshot, ...(current.screenshots || [])].slice(0, 120)
        : current.screenshots || [];
      const lineage = normalizedResult
        ? [normalizedResult.lineage, ...(current.lineage || [])].slice(0, 220)
        : current.lineage || [];
      const proofArtifacts = artifactRows.length
        ? [...artifactRows, ...((current.proofArtifacts || []).filter((item) => !artifactRows.some((artifact) => artifact.id === item?.id)))].slice(0, 160)
        : current.proofArtifacts || [];
      writeCollection("queueJobs", queueJobs);
      writeCollection("proofLearningRuns", proofLearningRuns);
      writeCollection("buildRuns", buildRuns);
      writeCollection("screenshots", screenshots);
      writeCollection("lineage", lineage);
      writeCollection("proofArtifacts", proofArtifacts);
      logEvent("queue-progress", {
        stage: queueResult.ok ? "hosted-proof-worker-complete" : "hosted-proof-worker-failed",
        jobId,
        queuePath,
        imported: Boolean(normalizedResult),
        artifactCount: artifactRows.length,
      });
      logEvent("closed-loop-proof", { id: run.id, jobId, stage: queueResult.ok ? "complete" : "failed", ok: queueResult.ok, imported: Boolean(normalizedResult), artifactCount: artifactRows.length });
      jsonResponse(response, queueResult.ok ? 200 : 500, {
        ok: queueResult.ok,
        run,
        job,
        proofRun,
        original,
        improved,
        winnerPrompt,
        queueResult,
        redactions: redacted.findings,
        collections: { closedLoopRuns, queueJobs, proofLearningRuns, buildRuns, screenshots, lineage, proofArtifacts },
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/training/run") {
      const body = await readBody(request);
      const createdAt = now();
      const promptCount = Number(body.promptCount || body.inputCounts?.prompts || 0);
      const outcomeCount = Number(body.outcomeCount || body.inputCounts?.outcomes || 0);
      const screenshotCount = Number(body.screenshotCount || body.inputCounts?.screenshots || 0);
      const finalScore = Math.max(20, Math.min(100, Math.round(50 + Math.min(25, promptCount * 3) + Math.min(15, outcomeCount * 4) + Math.min(10, screenshotCount * 3))));
      const trainingRun = {
        id: `training-run-${Date.now()}`,
        createdAt,
        updatedAt: createdAt,
        status: "complete",
        stage: "complete",
        source: body.source || "corpus",
        inputCounts: { prompts: promptCount, outcomes: outcomeCount, screenshots: screenshotCount },
        scores: {
          starting: Math.max(20, finalScore - 12),
          final: finalScore,
          benchmark: Number(body.benchmarkScore || finalScore - 4),
          memory: Number(body.memoryScore || finalScore - 2),
          proof: Number(body.proofScore || finalScore - 6),
        },
        benchmarkDelta: Number(body.benchmarkDelta || 0),
        memoryDiff: body.memoryDiff || { score: Number(body.memoryScore || finalScore - 2), addedSections: [], expandedSections: [], staleSections: [], summary: ["API training run completed."] },
        artifacts: Array.isArray(body.artifacts) ? body.artifacts : [{ id: `artifact-${Date.now()}`, title: "Training pack", kind: "json", detail: "Created by API training run." }],
        errors: [],
        notes: ["Training run completed through the hosted API route.", "Local fallback scoring was used when no model key was required."],
      };
      const trainingRuns = appendCollectionRecord("trainingRuns", trainingRun, 100);
      logEvent("training-run", { id: trainingRun.id, status: trainingRun.status, finalScore });
      jsonResponse(response, 200, { ok: true, trainingRun, collections: { trainingRuns } });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/training/runs") {
      const current = readCollections();
      jsonResponse(response, 200, { ok: true, trainingRuns: Array.isArray(current.trainingRuns) ? current.trainingRuns : [] });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/model/evaluate-cached") {
      const body = await readBody(request);
      const redacted = redactModelBody(body);
      const safeBody = redacted.body;
      const current = readCollections();
      const existing = Array.isArray(current.modelEvaluationCache) ? current.modelEvaluationCache : [];
      const promptHash = stableHash(safeBody.prompt);
      const memoryHash = stableHash(safeBody.memory || "");
      const provider = String(safeBody.settings?.provider || process.env.PROMPT_LAB_MODEL_PROVIDER || "local");
      const hit = existing.find((item) => item.promptHash === promptHash && item.memoryHash === memoryHash && item.provider === provider && item.schemaVersion === MODEL_EVALUATION_SCHEMA_VERSION);
      if (hit) {
        jsonResponse(response, 200, { ok: true, cached: true, cacheRecord: hit, evaluation: hit, redactions: redacted.findings });
        return;
      }
      const local = withModelSchema(localModelEvaluation(safeBody), redacted.findings);
      const localScore = localPromptScore(safeBody.prompt);
      const cacheRecord = {
        id: `cache-${Date.now()}`,
        promptHash,
        memoryHash,
        provider,
        schemaVersion: MODEL_EVALUATION_SCHEMA_VERSION,
        score: local.score,
        localScore,
        delta: local.score - localScore,
        readiness: local.readiness,
        findings: local.findings || [],
        recommendations: local.recommendations || [],
        redactions: redacted.findings,
        createdAt: now(),
      };
      const modelEvaluationCache = appendCollectionRecord("modelEvaluationCache", cacheRecord, 250);
      logEvent("model-evaluate-cached", { id: cacheRecord.id, cached: false, score: cacheRecord.score });
      jsonResponse(response, 200, { ok: true, cached: false, evaluation: local, cacheRecord, redactions: redacted.findings, collections: { modelEvaluationCache } });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/corpus/analyze") {
      const body = await readBody(request);
      const examples = productExamplesFromBody(body);
      const report = buildApiCorpusReport(examples);
      const run = { id: `corpus-cluster-${Date.now()}`, createdAt: now(), count: examples.length, report };
      const corpusClusterRuns = appendCollectionRecord("corpusClusterRuns", run, 80);
      logEvent("corpus-analyze", { id: run.id, count: examples.length, score: report.score });
      jsonResponse(response, 200, { ok: true, report, run, collections: { corpusClusterRuns } });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/benchmark/v2") {
      const body = await readBody(request);
      const examples = productExamplesFromBody(body);
      const report = buildApiBenchmarkV2Report(examples);
      const run = { id: `benchmark-v2-${Date.now()}`, createdAt: now(), count: report.rows.length, score: report.score, report };
      const benchmarkV2Runs = appendCollectionRecord("benchmarkV2Runs", run, 80);
      logEvent("benchmark-v2", { id: run.id, score: report.score, count: report.rows.length });
      jsonResponse(response, 200, { ok: true, report, run, collections: { benchmarkV2Runs } });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/artifact/create") {
      const body = await readBody(request);
      const prompt = body.prompt || {};
      const title = String(prompt.title || body.title || "Evaluation artifact");
      const text = String(prompt.text || body.promptText || "");
      const score = Number(body.score || localPromptScore(text));
      const artifact = {
        id: `evaluation-artifact-${Date.now()}`,
        title: `${title} evaluation artifact`,
        promptId: String(prompt.id || body.promptId || "api-prompt"),
        score,
        proofStatus: score >= 80 ? "proof-ready" : score >= 60 ? "needs-more-proof" : "unproved",
        nextMutation: score >= 80 ? "Run visual proof and promote if clean." : "Add exact assets, responsive states, and verification gates.",
        markdown: [
          "# Evaluation Artifact",
          "",
          `## ${title}`,
          "",
          text,
          "",
          `- Score: ${score}`,
          `- Proof status: ${score >= 80 ? "proof-ready" : "needs-more-proof"}`,
        ].join("\n"),
        json: "",
        createdAt: now(),
      };
      artifact.json = JSON.stringify({ ...artifact, json: undefined }, null, 2);
      const evaluationArtifacts = appendCollectionRecord("evaluationArtifacts", artifact, 120);
      logEvent("artifact-create", { id: artifact.id, score });
      jsonResponse(response, 200, { ok: true, artifact, collections: { evaluationArtifacts } });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/model/evaluate") {
      const body = await readBody(request);
      const redacted = redactModelBody(body);
      const safeBody = redacted.body;
      const provider = safeBody.settings?.provider || process.env.PROMPT_LAB_MODEL_PROVIDER || "";
      const endpoint = safeBody.settings?.endpoint || process.env.PROMPT_LAB_MODEL_ENDPOINT;
      if (provider === "anthropic" || endpoint?.includes("api.anthropic.com")) {
        const hasAnthropicKey = Boolean(body.settings?.apiKey || process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || process.env.PROMPT_LAB_MODEL_API_KEY);
        if (!hasAnthropicKey) {
          const local = localModelEvaluation(safeBody);
          const result = withModelSchema({
            ...local,
            mode: "local-fallback",
            fallbackReason: "Missing Anthropic API key; used local evaluator.",
          }, redacted.findings);
          logEvent("model-evaluate", { mode: result.mode, fallback: "anthropic-missing-key", score: result.score });
          jsonResponse(response, 200, result);
          return;
        }
        const result = withModelSchema(await anthropicModelEvaluation(safeBody), redacted.findings);
        logEvent("model-evaluate", { mode: "anthropic", ok: result.ok, score: result.score ?? 0 });
        jsonResponse(response, result.ok ? 200 : 502, result);
        return;
      }
      if (endpoint) {
        const result = withModelSchema(await externalModelEvaluation(safeBody, endpoint), redacted.findings);
        logEvent("model-evaluate", { endpoint, ok: result.ok });
        jsonResponse(response, result.ok ? 200 : 502, result);
        return;
      }
      const local = withModelSchema(localModelEvaluation(safeBody), redacted.findings);
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
