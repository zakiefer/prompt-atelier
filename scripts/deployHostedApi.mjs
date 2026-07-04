#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (!arg.startsWith("--")) continue;
  const key = arg.slice(2);
  const value = process.argv[index + 1] && !process.argv[index + 1].startsWith("--") ? process.argv[++index] : "true";
  args.set(key, value);
}

const outDir = resolve(args.get("out") || "output/hosted-api-deploy");
const apiUrl = (args.get("url") || process.env.PROMPT_LAB_API_URL || "").replace(/\/+$/, "");
const deployHook = args.get("render-hook") || process.env.RENDER_DEPLOY_HOOK_URL || "";
const token = args.get("token") || process.env.PROMPT_LAB_API_TOKEN || "";
const requireDeploy = args.get("require-deploy") === "true";

mkdirSync(outDir, { recursive: true });

function check(label, ready, detail, fix = "") {
  return { label, ready: Boolean(ready), detail, fix };
}

async function readJson(url, init = {}) {
  const response = await fetch(url, init);
  const text = await response.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text.slice(0, 500) };
  }
  return { ok: response.ok, status: response.status, body };
}

const renderYaml = existsSync("render.yaml") ? readFileSync("render.yaml", "utf8") : "";
const dockerfile = existsSync("Dockerfile.api") ? readFileSync("Dockerfile.api", "utf8") : "";
const packageJson = existsSync("package.json") ? JSON.parse(readFileSync("package.json", "utf8")) : {};

const checks = [
  check("render blueprint", renderYaml.includes("prompt-atelier-api") && renderYaml.includes("Dockerfile.api"), "render.yaml points at the API Dockerfile.", "Add a Render Blueprint service."),
  check("persistent disk", /disk:\s*\n[\s\S]*mountPath:\s*\/var\/data/.test(renderYaml), "Blueprint has a persistent /var/data disk.", "Mount persistent storage for SQLite."),
  check("api dockerfile", dockerfile.includes("CMD [\"npm\", \"run\", \"api\"]"), "Dockerfile.api starts the API server.", "Use npm run api as the Docker command."),
  check("api script", Boolean(packageJson.scripts?.api), "package.json exposes npm run api.", "Add an api script."),
  check("secret placeholder", renderYaml.includes("ANTHROPIC_API_KEY") && renderYaml.includes("sync: false"), "Claude key is server-side only.", "Keep ANTHROPIC_API_KEY out of browser builds."),
];

let deploy = { attempted: false, ok: false, status: 0, detail: "No deploy hook configured." };
if (deployHook) {
  deploy.attempted = true;
  try {
    const result = await readJson(deployHook, { method: "POST" });
    deploy = { attempted: true, ok: result.ok, status: result.status, detail: result.body?.message || result.body?.deploy?.id || `HTTP ${result.status}` };
  } catch (error) {
    deploy = { attempted: true, ok: false, status: 0, detail: error instanceof Error ? error.message : String(error) };
  }
}

let health = { attempted: false, ok: false, status: 0, detail: "No PROMPT_LAB_API_URL supplied." };
if (apiUrl) {
  try {
    const result = await readJson(`${apiUrl}/api/health`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    health = {
      attempted: true,
      ok: result.ok && Boolean(result.body?.ok),
      status: result.status,
      detail: result.ok ? `authRequired=${Boolean(result.body?.authRequired)} sqlite=${Boolean(result.body?.sqlitePath)} worker=${Boolean(result.body?.worker?.enabled)}` : `HTTP ${result.status}`,
    };
  } catch (error) {
    health = { attempted: true, ok: false, status: 0, detail: error instanceof Error ? error.message : String(error) };
  }
}

const blueprintReady = checks.every((item) => item.ready);
const ok = blueprintReady && (!requireDeploy || deploy.ok || health.ok);
const report = {
  ok,
  checkedAt: new Date().toISOString(),
  apiUrl,
  deploy,
  health,
  checks,
  nextActions: [
    ...checks.filter((item) => !item.ready).map((item) => item.fix),
    !deployHook ? "Create a Render service from render.yaml or set RENDER_DEPLOY_HOOK_URL for scripted deploys." : "",
    !apiUrl ? "Set PROMPT_LAB_API_URL after the hosted API is created, then rerun this script." : "",
    apiUrl && !health.ok ? "Fix hosted API health before enabling proof worker traffic." : "",
  ].filter(Boolean),
};

const outputPath = join(outDir, "hosted-api-deploy-report.json");
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, outputPath }, null, 2));
process.exit(ok ? 0 : requireDeploy ? 1 : 0);
