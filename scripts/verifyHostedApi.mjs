#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const prefix = `--${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(`--${name}`);
  if (index >= 0) return args[index + 1] || fallback;
  return fallback;
}

const baseUrl = (readArg("url", process.env.PROMPT_LAB_API_URL || "http://127.0.0.1:8787") || "").replace(/\/+$/, "");
const token = readArg("token", process.env.PROMPT_LAB_API_TOKEN || "");
const outDir = readArg("out", "");
const shouldEvaluate = args.includes("--evaluate") || process.env.PROMPT_LAB_VERIFY_EVALUATE === "1";

function headers(extra = {}) {
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function readJson(path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: headers(init.headers || {}),
  });
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text.slice(0, 500) };
  }
  return { ok: response.ok, status: response.status, body };
}

function check(label, ready, detail, fix = "") {
  return { label, ready: Boolean(ready), detail, fix };
}

const failures = [];
const checks = [];

try {
  const health = await readJson("/api/health");
  checks.push(check("health route", health.ok && health.body?.ok, `HTTP ${health.status}`));
  checks.push(check("bearer auth", Boolean(health.body?.authRequired), health.body?.authRequired ? "API reports authRequired=true." : "API reports no bearer auth.", "Set PROMPT_LAB_API_TOKEN on the hosted API."));
  checks.push(check("sqlite storage", Boolean(health.body?.sqlitePath), health.body?.sqlitePath ? "SQLite path is configured." : "SQLite path missing.", "Set PROMPT_LAB_DATA_DIR to persistent storage."));
  checks.push(check("worker allowlist", Array.isArray(health.body?.worker?.allowedBuildCommands) && health.body.worker.allowedBuildCommands.length > 0, `${health.body?.worker?.allowedBuildCommands?.length || 0} allowed command(s).`, "Set PROMPT_LAB_ALLOWED_BUILD_COMMANDS."));
  checks.push(check("worker enabled", Boolean(health.body?.worker?.enabled), health.body?.worker?.enabled ? "Worker is enabled." : "Worker is disabled.", "Enable only on a trusted host with sandbox checks."));

  const settings = await readJson("/api/model/settings");
  checks.push(check("model settings route", settings.ok, `HTTP ${settings.status}`));
  checks.push(check("server Claude key", Boolean(settings.body?.anthropicApiKeyConfigured), settings.body?.anthropicApiKeyConfigured ? "Claude key is configured server-side." : "Claude key is not configured server-side.", "Keep any live Claude key on the API host; local fallback works when it is absent."));
  checks.push(check("model route", Boolean(settings.body?.anthropicConfigured || settings.body?.endpointConfigured || settings.body?.agentCommandConfigured), "At least one model route should be configured for hosted judging.", "Configure Claude, an OpenAI-compatible endpoint, or an agent command."));

  if (shouldEvaluate) {
    const evaluation = await readJson("/api/model/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Build a responsive website hero with exact assets, typography, states, constraints, and verification proof.",
        memory: "Verification must include build, screenshots, console health, and responsive proof.",
      }),
    });
    checks.push(check("model evaluate route", evaluation.ok, evaluation.ok ? `mode=${evaluation.body?.mode || "unknown"} score=${evaluation.body?.score ?? "n/a"}` : `HTTP ${evaluation.status}`, "Check server-side model configuration and auth token."));
  }
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
}

const blocking = checks.filter((item) => !item.ready && ["health route", "bearer auth", "sqlite storage", "model settings route"].includes(item.label));
const ready = failures.length === 0 && blocking.length === 0;
const result = {
  ok: ready,
  url: baseUrl,
  checkedAt: new Date().toISOString(),
  checks,
  failures,
  nextActions: [...blocking.map((item) => item.fix).filter(Boolean), ...failures.map((item) => `Resolve verifier error: ${item}`)].slice(0, 8),
};

let outputPath = "";
if (outDir) {
  const resolved = resolve(outDir);
  mkdirSync(resolved, { recursive: true });
  outputPath = join(resolved, "hosted-api-verify-report.json");
  writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
}

console.log(JSON.stringify({ ...result, outputPath }, null, 2));
process.exit(ready ? 0 : 1);
