#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
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
const outDir = resolve(args.get("out") || "output/result-gallery");
const shouldSync = args.get("sync") === "true";
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

const collectionsResponse = await readJson("/api/collections");
const collections = collectionsResponse.ok ? collectionsResponse.body.collections || {} : {};
const buildRuns = Array.isArray(collections.buildRuns) ? collections.buildRuns : [];
const screenshots = Array.isArray(collections.screenshots) ? collections.screenshots : [];
const proofArtifacts = Array.isArray(collections.proofArtifacts) ? collections.proofArtifacts : [];
const prompts = new Map((Array.isArray(collections.userPrompts) ? collections.userPrompts : []).map((prompt) => [prompt.id, prompt]));

function scoreFromRun(run) {
  if (Number.isFinite(Number(run.score))) return Number(run.score);
  if (run.status === "passed" || run.status === "completed") return 84;
  if (run.status === "failed") return 24;
  return 50;
}

const screenshotItems = screenshots.map((screenshot) => {
  const run = buildRuns.find((item) => item.promptId === screenshot.promptId);
  const prompt = prompts.get(screenshot.promptId);
  return {
    id: screenshot.id,
    promptId: screenshot.promptId,
    title: screenshot.title || prompt?.title || run?.promptTitle || "Screenshot proof",
    image: screenshot.url,
    resultUrl: run?.resultUrl || "",
    score: scoreFromRun(run || {}),
    status: screenshot.rating || run?.status || "proof",
    notes: screenshot.notes || run?.notes || "",
    createdAt: screenshot.createdAt || run?.updatedAt || new Date().toISOString(),
    source: "screenshot",
  };
});

const buildItems = buildRuns
  .filter((run) => run.screenshotUrl && !screenshotItems.some((item) => item.image === run.screenshotUrl))
  .map((run) => ({
    id: run.id,
    promptId: run.promptId,
    title: run.promptTitle,
    image: run.screenshotUrl,
    resultUrl: run.resultUrl || "",
    score: scoreFromRun(run),
    status: run.status || "build",
    notes: run.notes || run.errors || "",
    createdAt: run.updatedAt || run.createdAt || new Date().toISOString(),
    source: "buildRun",
  }));

const artifactItems = proofArtifacts
  .filter((artifact) => artifact.url || artifact.path)
  .map((artifact) => ({
    id: artifact.id,
    promptId: artifact.promptId || "",
    title: artifact.title || "Proof artifact",
    image: artifact.url || artifact.path,
    resultUrl: artifact.resultUrl || "",
    score: Number(artifact.score || 0),
    status: artifact.kind || "artifact",
    notes: artifact.viewport ? `${artifact.viewport} proof artifact` : "Proof artifact",
    createdAt: artifact.createdAt || new Date().toISOString(),
    source: "proofArtifact",
  }));

const gallery = [...screenshotItems, ...buildItems, ...artifactItems]
  .filter((item, index, list) => item.image && list.findIndex((other) => other.id === item.id || other.image === item.image) === index)
  .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  .slice(0, 80);

const derivedArtifacts = gallery.map((item) => ({
  id: `gallery-${item.id}`,
  promptId: item.promptId,
  title: item.title,
  kind: item.source,
  viewport: item.notes?.includes("mobile") ? "mobile" : item.notes?.includes("desktop") ? "desktop" : "",
  path: item.image.startsWith("http") || item.image.startsWith("data:") ? "" : item.image,
  url: item.image.startsWith("http") || item.image.startsWith("data:") ? item.image : "",
  resultUrl: item.resultUrl,
  score: item.score,
  createdAt: item.createdAt,
}));

let sync = { attempted: false, ok: false, status: 0, detail: "Pass --sync to write derived proofArtifacts back to the API." };
if (shouldSync) {
  const mergedArtifacts = [
    ...derivedArtifacts,
    ...proofArtifacts.filter((artifact) => !derivedArtifacts.some((item) => item.id === artifact.id)),
  ].slice(0, 160);
  const response = await readJson("/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: "proofArtifacts", value: mergedArtifacts }),
  });
  sync = {
    attempted: true,
    ok: response.ok,
    status: response.status,
    detail: response.ok ? `${mergedArtifacts.length} proof artifact(s) synced.` : response.body?.error || response.body?.raw || `HTTP ${response.status}`,
  };
}

const report = {
  ok: collectionsResponse.ok,
  apiUrl,
  checkedAt: new Date().toISOString(),
  counts: {
    buildRuns: buildRuns.length,
    screenshots: screenshots.length,
    proofArtifacts: proofArtifacts.length,
    gallery: gallery.length,
    derivedArtifacts: derivedArtifacts.length,
  },
  gallery,
  derivedArtifacts,
  sync,
  nextActions: [
    gallery.length < 10 ? "Run more proof batches or import screenshots to reach 10+ gallery items." : "",
    !sync.ok ? sync.detail : "",
  ].filter(Boolean),
};

const outputPath = join(outDir, "gallery.json");
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, outputPath }, null, 2));
process.exit(report.ok ? 0 : 1);
