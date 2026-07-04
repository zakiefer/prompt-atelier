import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const port = 8792;
const base = `http://127.0.0.1:${port}`;
const dataDir = mkdtempSync(join(tmpdir(), "prompt-atelier-api-test-"));
const child = spawn(process.execPath, ["scripts/promptLabApi.mjs"], {
  cwd: process.cwd(),
  env: { ...process.env, PROMPT_LAB_API_PORT: String(port), PROMPT_LAB_API_TOKEN: "test-token", PROMPT_LAB_DATA_DIR: dataDir },
  stdio: ["ignore", "pipe", "pipe"],
});

let output = "";
child.stdout.on("data", (chunk) => {
  output += chunk.toString();
});
child.stderr.on("data", (chunk) => {
  output += chunk.toString();
});

async function waitForHealth() {
  const started = Date.now();
  while (Date.now() - started < 8000) {
    try {
      const response = await fetch(`${base}/api/health`);
      if (response.ok) return response.json();
    } catch {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 200));
    }
  }
  throw new Error(`API did not become healthy.\n${output}`);
}

try {
  const health = await waitForHealth();
  const expectedCollections = ["datasetVersions", "pairwiseReviews", "backupSnapshots", "activeWorkspace", "closedLoopRuns", "benchmarkRuns"];
  if (!health.ok || !expectedCollections.every((collection) => health.collections.includes(collection))) throw new Error("Health route missing expected collections.");
  if (!health.authRequired) throw new Error("Health route should report authRequired when token is configured.");
  if (!health.rateLimitPerMinute) throw new Error("Health route should expose rate limit metadata.");

  const rejected = await fetch(`${base}/api/snapshot`);
  if (rejected.status !== 401) throw new Error(`Expected unauthorized snapshot without token, received ${rejected.status}.`);

  const sync = await fetch(`${base}/api/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
    body: JSON.stringify({
      collections: {
        datasetVersions: [{ id: "test", label: "test", createdAt: new Date().toISOString(), counts: {}, scores: {}, notes: [] }],
        pairwiseReviews: [{ id: "pairwise-test" }],
        backupSnapshots: [{ id: "backup-test", payload: {} }],
        activeWorkspace: "hero",
        closedLoopRuns: [{
          id: "closed-loop-test",
          createdAt: new Date().toISOString(),
          sourceTitle: "Fixture",
          originalScore: 62,
          improvedScore: 78,
          winnerTitle: "Fixture refined",
          winnerPrompt: "Build a great hero.",
          modelMode: "local-fallback",
          findings: ["fixture"],
          recommendations: ["fixture"],
        }],
        benchmarkRuns: [{ id: "benchmark-test", rows: [] }],
      },
    }),
  });
  if (!sync.ok) throw new Error(`Collection sync failed: ${sync.status}`);

  const evaluate = await fetch(`${base}/api/model/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
    body: JSON.stringify({ prompt: "Build a React Tailwind hero with exact assets and responsive QA.", memory: "Great prompts are exact." }),
  });
  const evaluation = await evaluate.json();
  if (!evaluate.ok || evaluation.mode !== "local-fallback") throw new Error("Local model fallback route failed.");

  const authedSnapshot = await fetch(`${base}/api/snapshot`, { headers: { "x-prompt-lab-token": "test-token" } });
  const payload = await authedSnapshot.json();
  if (
    !authedSnapshot.ok ||
    !payload.collections?.datasetVersions?.length ||
    !payload.collections?.pairwiseReviews?.length ||
    !payload.collections?.backupSnapshots?.length ||
    !payload.collections?.closedLoopRuns?.length ||
    !payload.collections?.benchmarkRuns?.length ||
    payload.collections?.activeWorkspace !== "hero"
  ) throw new Error("Snapshot route did not include synced collections.");

  const events = await fetch(`${base}/api/events?limit=5`, { headers: { Authorization: "Bearer test-token" } });
  const eventPayload = await events.json();
  if (!events.ok || !Array.isArray(eventPayload.events)) throw new Error("Events route did not return API events.");

  const missingVisualQaUrl = await fetch(`${base}/api/visual/qa`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
    body: JSON.stringify({}),
  });
  if (missingVisualQaUrl.status !== 400) throw new Error(`Expected visual QA route to validate URL, received ${missingVisualQaUrl.status}.`);

  console.log(JSON.stringify({ ok: true, port, collections: health.collections.length, modelMode: evaluation.mode }, null, 2));
} finally {
  child.kill("SIGTERM");
  rmSync(dataDir, { recursive: true, force: true });
}
