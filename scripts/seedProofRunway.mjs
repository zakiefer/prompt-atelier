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

const apiUrl = (args.get("url") || process.env.PROMPT_LAB_API_URL || "").replace(/\/+$/, "");
const token = args.get("token") || process.env.PROMPT_LAB_API_TOKEN || "";
const outDir = resolve(args.get("out") || "output/proof-seed-runway");
const limit = Math.max(1, Math.min(30, Number(args.get("limit") || 5)));
const shouldSync = apiUrl && args.get("sync") !== "false";
const shouldRun = apiUrl && args.get("run") === "true";
const allowFail = args.get("allow-fail") === "true";

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

function scorePrompt(text) {
  const signals = [
    /\b(?:react|vite|typescript|tailwind|css|lucide|motion|framer|gsap)\b/i,
    /\b(?:video|image|font|svg|asset|https?:\/\/)\b/i,
    /\b(?:mobile|desktop|responsive|breakpoint|sm:|md:|lg:)\b/i,
    /\b(?:hover|active|transition|animation|keyframes|toggle|menu)\b/i,
    /\b(?:verify|screenshot|playwright|build|test|qa|proof)\b/i,
  ];
  const present = signals.filter((pattern) => pattern.test(text)).length;
  const lengthBonus = Math.min(30, Math.round(String(text || "").split(/\s+/).length / 30));
  return Math.max(20, Math.min(100, 40 + present * 8 + lengthBonus));
}

function readLocalPrompts() {
  if (!existsSync("src/prompts")) return [];
  return readdirSync("src/prompts")
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const text = readFileSync(join("src/prompts", file), "utf8").trim();
      return {
        id: `local-${slugify(file.replace(/\.md$/, ""))}`,
        title: titleFromText(text, file),
        text,
        source: "seed",
        createdAt: new Date().toISOString(),
      };
    });
}

let collections = {};
let source = "local";
let collectionsStatus = { attempted: false, ok: false, status: 0, detail: "No API URL supplied." };
if (apiUrl) {
  try {
    const response = await readJson("/api/collections");
    collectionsStatus = {
      attempted: true,
      ok: response.ok,
      status: response.status,
      detail: response.ok ? "Loaded hosted collections." : response.body?.error || response.body?.raw || `HTTP ${response.status}`,
    };
    if (response.ok && response.body?.collections) {
      collections = response.body.collections;
      source = "api";
    }
  } catch (error) {
    collectionsStatus = { attempted: true, ok: false, status: 0, detail: error instanceof Error ? error.message : String(error) };
  }
}

const prompts = (Array.isArray(collections.userPrompts) && collections.userPrompts.length ? collections.userPrompts : readLocalPrompts())
  .filter((prompt) => String(prompt?.text || "").trim())
  .slice(0, limit);

const createdAt = new Date().toISOString();
const queueJobs = prompts.map((prompt, index) => {
  const slug = slugify(prompt.title || prompt.id || `prompt-${index + 1}`);
  const score = scorePrompt(prompt.text);
  return {
    id: `proof-seed-${slug}-${Date.now()}-${index + 1}`,
    promptId: prompt.id,
    promptTitle: prompt.title || titleFromText(prompt.text, `Prompt ${index + 1}`),
    promptText: prompt.text,
    variantTitle: `${prompt.title || "Prompt"} proof seed`,
    status: "queued",
    runFolder: `prompt-runs/proof-seed-${slug}`,
    resultUrl: "http://127.0.0.1:4173",
    score,
    commands: [
      { label: "Build", command: process.env.PROMPT_LAB_BUILD_COMMAND || "npm run build" },
      { label: "Capture", command: "npm run capture:result -- --url http://127.0.0.1:4173" },
    ],
    notes: [
      "Seeded by proof:seed for later hosted worker execution.",
      "Run with --run against a trusted API worker to execute immediately.",
    ],
    createdAt,
    updatedAt: createdAt,
  };
});

let sync = { attempted: false, ok: false, status: 0, detail: apiUrl ? "Pass --sync false to skip sync; default sync will run when API is reachable." : "Offline mode wrote local queue only." };
if (shouldSync && !shouldRun) {
  const existing = Array.isArray(collections.queueJobs) ? collections.queueJobs : [];
  const merged = [
    ...queueJobs,
    ...existing.filter((job) => !queueJobs.some((item) => item.id === job?.id)),
  ].slice(0, 180);
  const response = await readJson("/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: "queueJobs", value: merged }),
  });
  sync = {
    attempted: true,
    ok: response.ok,
    status: response.status,
    detail: response.ok ? `${queueJobs.length} proof seed job(s) synced to queueJobs.` : response.body?.error || response.body?.raw || `HTTP ${response.status}`,
  };
}

const runResults = [];
if (shouldRun) {
  for (const prompt of prompts) {
    const response = await readJson("/api/closed-loop/prove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptId: prompt.id,
        title: prompt.title,
        prompt: prompt.text,
        memory: "Proof seed run: build, capture, score, and return a proof learning result.",
        buildCommand: process.env.PROMPT_LAB_BUILD_COMMAND || "npm run build",
        capture: true,
        install: true,
        context: { mode: "proof-seed-run", source },
      }),
    });
    runResults.push({
      promptId: prompt.id,
      title: prompt.title,
      ok: response.ok && Boolean(response.body?.ok),
      status: response.status,
      detail: response.ok ? "Proof worker accepted the seed prompt." : response.body?.error || response.body?.raw || `HTTP ${response.status}`,
      proofRunId: response.body?.proofRun?.id || "",
      jobId: response.body?.job?.id || "",
    });
  }
}

const queuePath = join(outDir, "proof-seed-queue.json");
writeFileSync(queuePath, `${JSON.stringify({ jobs: queueJobs }, null, 2)}\n`);

const report = {
  ok: prompts.length > 0 && (!shouldRun || runResults.every((result) => result.ok)) && (!sync.attempted || sync.ok),
  mode: shouldRun ? "run" : shouldSync ? "sync" : "offline",
  source,
  apiUrl,
  checkedAt: new Date().toISOString(),
  collections: collectionsStatus,
  requested: prompts.length,
  queued: queueJobs.length,
  sync,
  runResults,
  files: { queue: queuePath },
  nextActions: [
    prompts.length ? "" : "Add or sync prompts before seeding proof jobs.",
    shouldRun && runResults.some((result) => !result.ok) ? "Enable the hosted proof worker only on trusted infrastructure before running proof jobs." : "",
    !apiUrl ? "Set PROMPT_LAB_API_URL and PROMPT_LAB_API_TOKEN to sync this queue to the hosted API." : "",
  ].filter(Boolean),
};

const reportPath = join(outDir, "proof-seed-runway-report.json");
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, outputPath: reportPath }, null, 2));
process.exit(report.ok || allowFail ? 0 : 1);
