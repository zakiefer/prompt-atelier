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
const outDir = resolve(args.get("out") || "output/training-dataset-v2");
mkdirSync(outDir, { recursive: true });

function headers(extra = {}) {
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function loadApiCollections() {
  if (!apiUrl) return {};
  const response = await fetch(`${apiUrl}/api/collections`, { headers: headers() });
  if (!response.ok) throw new Error(`GET /api/collections failed with HTTP ${response.status}`);
  const body = await response.json();
  return body.collections || {};
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
    .map((file) => {
      const text = readFileSync(join("src/prompts", file), "utf8").trim();
      return {
        id: `local-${slugify(file.replace(/\.md$/, ""))}`,
        title: titleFromText(text, file),
        text,
        source: "seed",
      };
    });
}

let collections = {};
let source = "local";
try {
  collections = await loadApiCollections();
  source = apiUrl ? "api" : "local";
} catch (error) {
  collections = { loadError: error instanceof Error ? error.message : String(error) };
}

const prompts = (Array.isArray(collections.userPrompts) && collections.userPrompts.length ? collections.userPrompts : readLocalPrompts())
  .filter((prompt) => String(prompt?.text || "").trim());
const promptById = new Map(prompts.map((prompt) => [prompt.id, prompt]));
const outcomes = Array.isArray(collections.outcomes) ? collections.outcomes : [];
const pairwiseReviews = Array.isArray(collections.pairwiseReviews) ? collections.pairwiseReviews : [];
const closedLoopRuns = Array.isArray(collections.closedLoopRuns) ? collections.closedLoopRuns : [];

const system = "Write high-fidelity, build-ready website prompts with exact stack, assets, layout, responsive rules, interaction states, safety constraints, and verification proof.";
const outcomeById = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));

const supervisedRows = prompts.map((prompt) => {
  const outcome = outcomeById.get(prompt.id);
  return {
    messages: [
      { role: "system", content: system },
      { role: "user", content: `Create a production-ready website prompt like "${prompt.title}".` },
      { role: "assistant", content: prompt.text },
    ],
    metadata: {
      id: prompt.id,
      title: prompt.title,
      source: prompt.source || "unknown",
      rating: outcome?.rating || "unrated",
      status: outcome?.status || "unrated",
      notes: outcome?.notes || "",
    },
  };
});

const preferenceRows = pairwiseReviews
  .map((review) => {
    const chosen = promptById.get(review.winnerId);
    const rejected = promptById.get(review.loserId);
    if (!chosen || !rejected) return null;
    return {
      input: `Choose the stronger website prompt for high-fidelity implementation. Reason: ${review.reason || "pairwise preference"}`,
      chosen: chosen.text,
      rejected: rejected.text,
      metadata: {
        reviewId: review.id,
        winnerId: review.winnerId,
        loserId: review.loserId,
        createdAt: review.createdAt,
      },
    };
  })
  .filter(Boolean);

const repairRows = closedLoopRuns
  .filter((run) => String(run?.winnerPrompt || "").trim())
  .map((run) => ({
    messages: [
      { role: "system", content: "Repair weak website prompts into stronger, proof-ready prompts without changing the product intent." },
      {
        role: "user",
        content: [
          `Repair prompt: ${run.sourceTitle || run.winnerTitle || "website prompt"}`,
          `Original score: ${run.originalScore ?? "unknown"}`,
          `Findings: ${(run.findings || []).join("; ")}`,
          `Recommendations: ${(run.recommendations || []).join("; ")}`,
        ].join("\n"),
      },
      { role: "assistant", content: run.winnerPrompt },
    ],
    metadata: {
      id: run.id,
      modelMode: run.modelMode || "unknown",
      originalScore: run.originalScore,
      improvedScore: run.improvedScore,
      createdAt: run.createdAt,
    },
  }));

const failureRows = outcomes
  .filter((outcome) => outcome.status === "avoid" || outcome.rating === "bad")
  .map((outcome) => {
    const prompt = promptById.get(outcome.promptId);
    return {
      promptId: outcome.promptId,
      title: outcome.title,
      prompt: prompt?.text || "",
      avoidReason: outcome.notes || "Avoid label",
      rating: outcome.rating,
      status: outcome.status,
    };
  });

function writeJsonl(filename, rows) {
  const path = join(outDir, filename);
  writeFileSync(path, rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : ""));
  return path;
}

const files = {
  supervised: writeJsonl("supervised.jsonl", supervisedRows),
  preferences: writeJsonl("preferences.jsonl", preferenceRows),
  repairs: writeJsonl("repairs.jsonl", repairRows),
  failures: writeJsonl("failures.jsonl", failureRows),
};

const manifest = {
  version: 2,
  exportedAt: new Date().toISOString(),
  source,
  apiUrl,
  counts: {
    prompts: prompts.length,
    supervised: supervisedRows.length,
    preferences: preferenceRows.length,
    repairs: repairRows.length,
    failures: failureRows.length,
  },
  files,
  notes: [
    "supervised.jsonl trains the assistant to write excellent website prompts.",
    "preferences.jsonl captures chosen/rejected prompt pairs for preference tuning.",
    "repairs.jsonl captures closed-loop prompt repair examples.",
    "failures.jsonl preserves avoid labels and failure notes for negative memory.",
  ],
};
const manifestPath = join(outDir, "manifest.json");
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ ok: true, manifestPath, ...manifest }, null, 2));
