import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const port = 8792;
const base = `http://127.0.0.1:${port}`;
const dataDir = mkdtempSync(join(tmpdir(), "prompt-atelier-api-test-"));
const child = spawn(process.execPath, ["scripts/promptLabApi.mjs"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    ANTHROPIC_API_KEY: "",
    CLAUDE_API_KEY: "",
    PROMPT_LAB_MODEL_API_KEY: "",
    PROMPT_LAB_API_PORT: String(port),
    PROMPT_LAB_API_TOKEN: "test-token",
    PROMPT_LAB_DATA_DIR: dataDir,
  },
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
  const expectedCollections = [
    "datasetVersions",
    "pairwiseReviews",
    "backupSnapshots",
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
  ];
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
        claudeHealthChecks: [{
          id: "claude-health-test",
          createdAt: new Date().toISOString(),
          apiOnline: true,
          tokenValid: true,
          claudeConfigured: false,
          sqliteWritable: true,
          modelRouteWorking: true,
          modelMode: "local-fallback",
          modelScore: 72,
          apiBase: base,
          sqlitePath: "fixture.sqlite",
          detail: ["fixture"],
        }],
        promptComparisons: [{
          id: "comparison-test",
          createdAt: new Date().toISOString(),
          leftId: "left",
          rightId: "right",
          leftTitle: "Left",
          rightTitle: "Right",
          winnerId: "left",
          winnerTitle: "Left",
          modelMode: "local-fallback",
          score: 77,
          findings: ["fixture"],
          recommendations: ["fixture"],
          hybridPrompt: "Build a precise hybrid prompt.",
        }],
        screenshotPromptRuns: [{
          id: "screenshot-prompt-test",
          createdAt: new Date().toISOString(),
          title: "Screenshot prompt",
          screenshotTitle: "Screenshot prompt",
          screenshotKind: "notes",
          prompt: "Build a screenshot recreation prompt.",
          score: 74,
          modelMode: "local-fallback",
          notes: ["fixture"],
        }],
        workspacePackRuns: [{
          id: "workspace-pack-test",
          createdAt: new Date().toISOString(),
          title: "Workspace packs",
          packs: [],
        }],
        proofLearningRuns: [{
          id: "proof-loop-test",
          createdAt: new Date().toISOString(),
          promptId: "prompt-test",
          title: "Proof loop",
          queueJobId: "queue-test",
          phase: "queued",
          promptScore: 70,
          resultScore: 0,
          visualScore: 0,
          dnaScore: 72,
          learnedStatus: "queued",
          screenshotCount: 0,
          notes: ["fixture"],
        }],
        screenshotJudgeRuns: [{
          id: "screenshot-judge-test",
          createdAt: new Date().toISOString(),
          promptId: "prompt-test",
          title: "Screenshot judge",
          modelMode: "local-fallback",
          score: 71,
          verdict: "needs-proof",
          findings: ["fixture"],
          fixes: ["fixture"],
          promptPatch: "Add screenshot repair rules.",
        }],
        mutationTournamentRuns: [{
          id: "mutation-tournament-test",
          createdAt: new Date().toISOString(),
          sourceTitle: "Source",
          winnerTitle: "Winner",
          winnerPrompt: "Build the winner.",
          winnerScore: 81,
          modelMode: "local-fallback",
          variants: [{ id: "variant-a", title: "Variant A", score: 81, intent: "fixture" }],
          notes: ["fixture"],
        }],
        healthChecks: [{ id: "health-test", createdAt: new Date().toISOString(), kind: "fixture" }],
        userPrompts: [{
          id: "secret-prompt",
          title: "Secret prompt",
          text: "Build a hero but do not persist sk-ant-api03-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.",
          source: "user",
          createdAt: new Date().toISOString(),
        }],
      },
    }),
  });
  if (!sync.ok) throw new Error(`Collection sync failed: ${sync.status}`);
  const syncPayload = await sync.json();
  if (!syncPayload.redactions?.some((finding) => finding.kind === "anthropic-key")) {
    throw new Error("Collection sync should report server-side Anthropic key redaction.");
  }

  const evaluate = await fetch(`${base}/api/model/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
    body: JSON.stringify({ prompt: "Build a React Tailwind hero with exact assets and responsive QA. Never store sk-ant-api03-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.", memory: "Great prompts are exact." }),
  });
  const evaluation = await evaluate.json();
  if (!evaluate.ok || evaluation.mode !== "local-fallback") throw new Error("Local model fallback route failed.");
  if (evaluation.schemaVersion !== "prompt-atelier.model-evaluation.v1" || !evaluation.schema?.required?.includes("score")) {
    throw new Error("Model evaluation route should expose the stable schema contract.");
  }
  if (!evaluation.redactions?.some((finding) => finding.kind === "anthropic-key")) {
    throw new Error("Model evaluation route should report prompt redactions.");
  }

  const anthropicFallback = await fetch(`${base}/api/model/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
    body: JSON.stringify({
      prompt: "Build a React Tailwind hero with exact assets and responsive QA.",
      memory: "Great prompts are exact.",
      settings: { provider: "anthropic", endpoint: "https://api.anthropic.com/v1/messages", apiKey: "" },
    }),
  });
  const anthropicFallbackPayload = await anthropicFallback.json();
  if (!anthropicFallback.ok || anthropicFallbackPayload.mode !== "local-fallback" || !anthropicFallbackPayload.fallbackReason) {
    throw new Error("Anthropic missing-key fallback should return a clean local evaluator response.");
  }

  const authedSnapshot = await fetch(`${base}/api/snapshot`, { headers: { "x-prompt-lab-token": "test-token" } });
  const payload = await authedSnapshot.json();
  if (
    !authedSnapshot.ok ||
    !payload.collections?.datasetVersions?.length ||
    !payload.collections?.pairwiseReviews?.length ||
    !payload.collections?.backupSnapshots?.length ||
    !payload.collections?.closedLoopRuns?.length ||
    !payload.collections?.benchmarkRuns?.length ||
    !payload.collections?.claudeHealthChecks?.length ||
    !payload.collections?.promptComparisons?.length ||
    !payload.collections?.screenshotPromptRuns?.length ||
    !payload.collections?.workspacePackRuns?.length ||
    !payload.collections?.proofLearningRuns?.length ||
    !payload.collections?.screenshotJudgeRuns?.length ||
    !payload.collections?.mutationTournamentRuns?.length ||
    !payload.collections?.healthChecks?.length ||
    payload.collections?.activeWorkspace !== "hero" ||
    JSON.stringify(payload.collections).includes("sk-ant-api03-")
  ) throw new Error("Snapshot route did not include synced collections.");

  const queueRun = await fetch(`${base}/api/queue/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
    body: JSON.stringify({
      jobId: "api-test-job",
      queue: {
        jobs: [{
          id: "api-test-job",
          promptId: "prompt-test",
          promptTitle: "API test prompt",
          promptText: "Build a small hero.",
          variantTitle: "API test variant",
          status: "queued",
          runFolder: join(dataDir, "queue-run"),
          resultUrl: "",
          score: 0,
          commands: [],
          notes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
      },
    }),
  });
  const queuePayload = await queueRun.json();
  if (!queueRun.ok || queuePayload.progressStage !== "complete") throw new Error("Queue run should complete and report progress stage.");

  const events = await fetch(`${base}/api/events?limit=20`, { headers: { Authorization: "Bearer test-token" } });
  const eventPayload = await events.json();
  if (!events.ok || !Array.isArray(eventPayload.events)) throw new Error("Events route did not return API events.");
  if (!eventPayload.events.some((event) => event.kind === "queue-progress" && event.detail?.stage === "complete")) {
    throw new Error("Queue progress event should be durable in API events.");
  }

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
