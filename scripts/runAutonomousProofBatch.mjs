#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (!arg.startsWith("--")) continue;
  const key = arg.slice(2);
  const value = process.argv[index + 1] && !process.argv[index + 1].startsWith("--") ? process.argv[++index] : "true";
  args.set(key, value);
}

const apiUrl = (args.get("url") || process.env.PROMPT_LAB_API_URL || "http://127.0.0.1:8787").replace(/\/+$/, "");
const token = args.get("token") || process.env.PROMPT_LAB_API_TOKEN || "";
const outDir = resolve(args.get("out") || "output/autonomous-proof-batch");
const limit = Math.max(1, Math.min(20, Number(args.get("limit") || 3)));
const buildCommand = args.get("build") || process.env.PROMPT_LAB_BUILD_COMMAND || "npm run build";
const agentCommand = args.get("agent") || process.env.PROMPT_LAB_AGENT_COMMAND || "";
const install = args.get("install") !== "false";
const capture = args.get("capture") !== "false";

mkdirSync(outDir, { recursive: true });

function headers(extra = {}) {
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function readJson(path, init = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: headers(init.headers || {}),
  });
  const text = await response.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text.slice(0, 500) };
  }
  return { ok: response.ok, status: response.status, body };
}

function slugify(input) {
  return String(input || "prompt").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

function titleFromText(text, fallback) {
  const first = String(text || "").split(/\n+/).find((line) => line.trim()) || fallback;
  return first.replace(/^#+\s*/, "").slice(0, 90);
}

function readLocalPrompts() {
  if (!existsSync("src/prompts")) return [];
  return readdirSync("src/prompts")
    .filter((file) => file.endsWith(".md"))
    .sort()
    .slice(0, limit)
    .map((file) => {
      const text = readFileSync(join("src/prompts", file), "utf8").trim();
      return {
        id: `local-${slugify(file.replace(/\.md$/, ""))}`,
        title: titleFromText(text, file),
        text,
      };
    });
}

let collections = {};
let source = "local";
try {
  const response = await readJson("/api/collections");
  if (response.ok && response.body?.collections) {
    collections = response.body.collections;
    source = "api";
  }
} catch {
  collections = {};
}

const prompts = (Array.isArray(collections.userPrompts) && collections.userPrompts.length ? collections.userPrompts : readLocalPrompts())
  .filter((prompt) => String(prompt?.text || "").trim())
  .slice(0, limit);
const memory = Array.isArray(collections.outcomes)
  ? `Outcome labels available: ${collections.outcomes.length}. Use exact assets, responsive proof, screenshots, and repair loops.`
  : "Use exact assets, responsive proof, screenshots, and repair loops.";

const results = [];
for (const prompt of prompts) {
  const payload = {
    promptId: prompt.id,
    title: prompt.title,
    prompt: prompt.text,
    memory,
    buildCommand,
    agentCommand,
    install,
    capture,
    context: {
      mode: "autonomous-proof-batch",
      source,
      requestedAt: new Date().toISOString(),
    },
  };
  const startedAt = new Date().toISOString();
  const response = await readJson("/api/closed-loop/prove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  results.push({
    promptId: prompt.id,
    title: prompt.title,
    startedAt,
    ok: response.ok && Boolean(response.body?.ok),
    status: response.status,
    jobId: response.body?.job?.id || "",
    proofRunId: response.body?.proofRun?.id || "",
    score: response.body?.proofRun?.resultScore || response.body?.run?.improvedScore || 0,
    learnedStatus: response.body?.proofRun?.learnedStatus || "",
    detail: response.ok ? "Proof worker accepted the prompt." : response.body?.error || response.body?.raw || `HTTP ${response.status}`,
  });
}

const report = {
  ok: results.length > 0 && results.every((result) => result.ok),
  source,
  apiUrl,
  checkedAt: new Date().toISOString(),
  requested: prompts.length,
  completed: results.filter((result) => result.ok).length,
  results,
  nextActions: results
    .filter((result) => !result.ok)
    .map((result) => result.status === 403 ? "Enable PROMPT_LAB_WORKER_ENABLED only on a trusted API worker host." : `${result.title}: ${result.detail}`)
    .slice(0, 8),
};

const outputPath = join(outDir, "autonomous-proof-batch-report.json");
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, outputPath }, null, 2));
process.exit(report.ok ? 0 : args.get("allow-fail") === "true" ? 0 : 1);
