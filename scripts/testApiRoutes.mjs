import { spawn } from "node:child_process";

const port = 8792;
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["scripts/promptLabApi.mjs"], {
  cwd: process.cwd(),
  env: { ...process.env, PROMPT_LAB_API_PORT: String(port) },
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
  if (!health.ok || !health.collections.includes("datasetVersions")) throw new Error("Health route missing expected collections.");

  const sync = await fetch(`${base}/api/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collections: { datasetVersions: [{ id: "test", label: "test", createdAt: new Date().toISOString(), counts: {}, scores: {}, notes: [] }] } }),
  });
  if (!sync.ok) throw new Error(`Collection sync failed: ${sync.status}`);

  const evaluate = await fetch(`${base}/api/model/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Build a React Tailwind hero with exact assets and responsive QA.", memory: "Great prompts are exact." }),
  });
  const evaluation = await evaluate.json();
  if (!evaluate.ok || evaluation.mode !== "local-fallback") throw new Error("Local model fallback route failed.");

  const snapshot = await fetch(`${base}/api/snapshot`);
  const payload = await snapshot.json();
  if (!snapshot.ok || !payload.collections?.datasetVersions?.length) throw new Error("Snapshot route did not include synced dataset versions.");

  console.log(JSON.stringify({ ok: true, port, collections: health.collections.length, modelMode: evaluation.mode }, null, 2));
} finally {
  child.kill("SIGTERM");
}
