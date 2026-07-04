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
const outDir = resolve(args.get("out") || "output/regression-timeline");
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
        createdAt: "local",
      };
    });
}

function parseDate(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? time : 0;
}

let collections = {};
let source = "local";
let loadError = "";
try {
  collections = await loadApiCollections();
  source = apiUrl ? "api" : "local";
} catch (error) {
  loadError = error instanceof Error ? error.message : String(error);
}

const prompts = (Array.isArray(collections.userPrompts) && collections.userPrompts.length ? collections.userPrompts : readLocalPrompts())
  .filter((prompt) => String(prompt?.text || "").trim());
const promptById = new Map(prompts.map((prompt) => [prompt.id, prompt]));
const outcomes = Array.isArray(collections.outcomes) ? collections.outcomes : [];
const buildRuns = Array.isArray(collections.buildRuns) ? collections.buildRuns : [];
const screenshots = Array.isArray(collections.screenshots) ? collections.screenshots : [];
const pairwiseReviews = Array.isArray(collections.pairwiseReviews) ? collections.pairwiseReviews : [];
const modelEvaluations = Array.isArray(collections.modelEvaluationCache) ? collections.modelEvaluationCache : [];
const benchmarkRuns = Array.isArray(collections.benchmarkRuns) ? collections.benchmarkRuns : [];
const benchmarkV2Runs = Array.isArray(collections.benchmarkV2Runs) ? collections.benchmarkV2Runs : [];
const proofLearningRuns = Array.isArray(collections.proofLearningRuns) ? collections.proofLearningRuns : [];
const trainingRuns = Array.isArray(collections.trainingRuns) ? collections.trainingRuns : [];

const events = [
  ...outcomes.map((outcome) => ({
    id: `outcome-${outcome.promptId}-${outcome.updatedAt || outcome.createdAt || ""}`,
    kind: "outcome",
    title: outcome.title || promptById.get(outcome.promptId)?.title || outcome.promptId,
    status: outcome.status || outcome.rating || "unrated",
    score: outcome.rating === "great" || outcome.status === "gold" ? 90 : outcome.rating === "bad" || outcome.status === "avoid" ? 20 : 60,
    createdAt: outcome.updatedAt || outcome.createdAt || "",
    detail: outcome.notes || "Outcome label.",
  })),
  ...buildRuns.map((run) => ({
    id: run.id,
    kind: "build",
    title: run.promptTitle || promptById.get(run.promptId)?.title || run.promptId,
    status: run.status || "unknown",
    score: Number(run.score || 0),
    createdAt: run.updatedAt || run.createdAt || "",
    detail: run.notes || run.errors || run.resultUrl || "Build run.",
  })),
  ...screenshots.map((screenshot) => ({
    id: screenshot.id,
    kind: "screenshot",
    title: screenshot.title || promptById.get(screenshot.promptId)?.title || "Screenshot",
    status: screenshot.rating || "unrated",
    score: screenshot.rating === "great" ? 90 : screenshot.rating === "bad" ? 20 : 60,
    createdAt: screenshot.createdAt || "",
    detail: screenshot.notes || screenshot.url || "Screenshot evidence.",
  })),
  ...pairwiseReviews.map((review) => ({
    id: review.id,
    kind: "pairwise",
    title: `${promptById.get(review.winnerId)?.title || review.winnerId} beat ${promptById.get(review.loserId)?.title || review.loserId}`,
    status: "winner",
    score: 88,
    createdAt: review.createdAt || "",
    detail: review.reason || "Pairwise preference label.",
  })),
  ...modelEvaluations.map((evaluation) => ({
    id: evaluation.id,
    kind: "model",
    title: evaluation.title || evaluation.promptHash || "Model evaluation",
    status: evaluation.readiness || evaluation.provider || "model",
    score: Number(evaluation.score || 0),
    createdAt: evaluation.createdAt || "",
    detail: Array.isArray(evaluation.findings) ? evaluation.findings.join("; ") : "Cached model/local evaluation.",
  })),
  ...benchmarkRuns.map((run) => ({
    id: run.id,
    kind: "benchmark",
    title: run.title || "Benchmark run",
    status: run.mode || "benchmark",
    score: Number(run.averageScore || run.score || 0),
    createdAt: run.createdAt || "",
    detail: `${Array.isArray(run.rows) ? run.rows.length : 0} benchmark row(s).`,
  })),
  ...benchmarkV2Runs.map((run) => ({
    id: run.id,
    kind: "benchmark-v2",
    title: run.title || "Benchmark v2 run",
    status: run.status || "benchmark-v2",
    score: Number(run.score || run.averageScore || 0),
    createdAt: run.createdAt || "",
    detail: `${Array.isArray(run.rows) ? run.rows.length : 0} v2 row(s).`,
  })),
  ...proofLearningRuns.map((run) => ({
    id: run.id,
    kind: "proof",
    title: run.title || promptById.get(run.promptId)?.title || "Proof learning run",
    status: run.learnedStatus || run.phase || "proof",
    score: Number(run.resultScore || run.dnaScore || run.promptScore || 0),
    createdAt: run.createdAt || "",
    detail: Array.isArray(run.notes) ? run.notes.join(" ") : "Proof learning run.",
  })),
  ...trainingRuns.map((run) => ({
    id: run.id,
    kind: "training",
    title: run.title || run.source || "Training run",
    status: run.status || run.stage || "training",
    score: Number(run.scores?.final || 0),
    createdAt: run.updatedAt || run.createdAt || "",
    detail: Array.isArray(run.notes) ? run.notes.join(" ") : "Training run.",
  })),
].sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt));

const averageScore = events.length ? Math.round(events.reduce((sum, event) => sum + Number(event.score || 0), 0) / events.length) : 0;
const counts = events.reduce((acc, event) => {
  acc[event.kind] = (acc[event.kind] || 0) + 1;
  return acc;
}, {});
const report = {
  ok: true,
  source,
  apiUrl,
  exportedAt: new Date().toISOString(),
  loadError,
  counts: {
    prompts: prompts.length,
    events: events.length,
    ...counts,
  },
  averageScore,
  trends: {
    latestStatus: events[0]?.status || "empty",
    latestKind: events[0]?.kind || "empty",
    passLikeEvents: events.filter((event) => /pass|gold|great|winner|ready|complete|proof/i.test(event.status)).length,
    watchLikeEvents: events.filter((event) => /watch|review|unrated|unknown|queued/i.test(event.status)).length,
    failLikeEvents: events.filter((event) => /fail|bad|avoid|error/i.test(event.status)).length,
  },
  events,
};

const jsonPath = join(outDir, "regression-timeline.json");
const markdownPath = join(outDir, "regression-timeline.md");
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  markdownPath,
  [
    "# Prompt Atelier Regression Timeline",
    "",
    `Exported: ${report.exportedAt}`,
    `Source: ${source}${apiUrl ? ` (${apiUrl})` : ""}`,
    `Average score: ${averageScore}`,
    "",
    "## Counts",
    "",
    ...Object.entries(report.counts).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Latest Events",
    "",
    ...events.slice(0, 20).map((event) => `- ${event.createdAt || "unknown"} | ${event.kind} | ${event.status} | ${event.title} | ${event.detail}`),
    "",
  ].join("\n"),
);

console.log(JSON.stringify({ ok: true, jsonPath, markdownPath, counts: report.counts, averageScore }, null, 2));
