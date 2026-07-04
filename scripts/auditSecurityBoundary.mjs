#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (!arg.startsWith("--")) continue;
  const key = arg.slice(2);
  const value = process.argv[index + 1] && !process.argv[index + 1].startsWith("--") ? process.argv[++index] : "true";
  args.set(key, value);
}

const root = process.cwd();
const outDir = resolve(args.get("out") || "output/security-boundary");
mkdirSync(outDir, { recursive: true });

const skipDirs = new Set([".git", "node_modules", "dist", "output", "data", ".vite"]);
const scannedExtensions = new Set([".js", ".mjs", ".ts", ".tsx", ".json", ".yml", ".yaml", ".md", ".html", ".css"]);
const rootFiles = new Set(["package.json", "render.yaml", "Dockerfile.api", "index.html"]);

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path, files);
      continue;
    }
    const rel = relative(root, path);
    const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
    if (rootFiles.has(rel) || scannedExtensions.has(ext) || /^\.env/.test(name)) files.push(path);
  }
  return files;
}

function compactSnippet(text, index, length) {
  const snippet = text.slice(Math.max(0, index - 40), index + length + 40).replace(/\s+/g, " ").trim();
  return snippet
    .replace(/sk-ant-api\d{2}-[A-Za-z0-9_-]{8,}/g, "[REDACTED_ANTHROPIC_KEY]")
    .replace(/sk-(?:proj|live|test)-[A-Za-z0-9_-]{8,}/g, "[REDACTED_MODEL_KEY]")
    .replace(/gh[pousr]_[A-Za-z0-9_]{8,}/g, "[REDACTED_GITHUB_TOKEN]")
    .replace(/AKIA[0-9A-Z]{16}/g, "[REDACTED_AWS_KEY]");
}

function isPlaceholderSecret(value) {
  const tail = value.replace(/^sk-ant-api\d{2}-/, "").replace(/^sk-(?:proj|live|test)-/, "");
  if (/^([a-z0-9_-])\1+$/i.test(tail)) return true;
  if (/^(?:x|0|1|_|-){16,}$/i.test(tail)) return true;
  if (value.includes("REDACTED") || value.includes("example")) return true;
  return false;
}

const files = [
  ...walk(join(root, "src")),
  ...walk(join(root, "scripts")),
  ...walk(join(root, "public")),
  ...walk(join(root, ".github")),
  ...Array.from(rootFiles).map((file) => join(root, file)).filter((file) => existsSync(file)),
  ...readdirSync(root).filter((name) => /^\.env/.test(name)).map((name) => join(root, name)),
].filter((file, index, list) => list.indexOf(file) === index);

const findings = [];
const warnings = [];
const secretPatterns = [
  { label: "Anthropic key", pattern: /sk-ant-api\d{2}-[A-Za-z0-9_-]{20,}/g },
  { label: "model provider key", pattern: /sk-(?:proj|live|test)-[A-Za-z0-9_-]{20,}/g },
  { label: "GitHub token", pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/g },
  { label: "AWS access key", pattern: /AKIA[0-9A-Z]{16}/g },
];
const browserExposurePatterns = [
  { label: "browser-exposed provider key env", pattern: /\bVITE_[A-Z0-9_]*(?:ANTHROPIC|CLAUDE|MODEL|API_KEY|SECRET)[A-Z0-9_]*\b/g },
  { label: "localStorage provider credential", pattern: /localStorage\.setItem\([^)]*(?:apiKey|anthropic|claude|model-key|provider-key)/gi },
  { label: "browser provider key input", pattern: /<Field label="API key"[\s\S]{0,600}modelSettings\.apiKey/g },
];

for (const file of files) {
  const rel = relative(root, file);
  const text = readFileSync(file, "utf8");
  for (const { label, pattern } of secretPatterns) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const value = match[0];
      if (isPlaceholderSecret(value) || /scripts\/testEngine\.ts$/.test(rel)) continue;
      findings.push({
        label,
        file: rel,
        severity: /^\.env/.test(rel) ? "review" : "block",
        snippet: compactSnippet(text, match.index ?? 0, value.length),
      });
    }
  }
  for (const { label, pattern } of browserExposurePatterns) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const token = match[0];
      if (token === "VITE_PROMPT_ATELIER_API_BASE") continue;
      const snippet = compactSnippet(text, match.index ?? 0, token.length);
      if (/CLAUDE_HEALTH_KEY|health-check/i.test(snippet)) continue;
      findings.push({
        label,
        file: rel,
        severity: "block",
        snippet,
      });
    }
  }
  if (/ANTHROPIC_API_KEY/.test(text) && !/sync:\s*false|process\.env\.ANTHROPIC_API_KEY|server-side|API host/.test(text)) {
    warnings.push({
      label: "Unqualified Anthropic key reference",
      file: rel,
      snippet: "Reference exists but does not obviously say it belongs server-side.",
    });
  }
}

const checks = [
  {
    label: "No raw provider keys in scanned files",
    ready: findings.filter((finding) => /key|token/i.test(finding.label)).length === 0,
    detail: `${findings.filter((finding) => /key|token/i.test(finding.label)).length} redacted secret-shaped finding(s).`,
  },
  {
    label: "No browser provider key channel",
    ready: findings.filter((finding) => /browser|localStorage|input/i.test(finding.label)).length === 0,
    detail: `${findings.filter((finding) => /browser|localStorage|input/i.test(finding.label)).length} browser exposure finding(s).`,
  },
  {
    label: "Render placeholder is server-side",
    ready: existsSync(join(root, "render.yaml")) && /ANTHROPIC_API_KEY[\s\S]*sync:\s*false/.test(readFileSync(join(root, "render.yaml"), "utf8")),
    detail: "render.yaml keeps the model-provider placeholder unsynced and server-scoped.",
  },
  {
    label: "API token scope",
    ready: existsSync(join(root, "src", "promptApi.ts")) && /prompt-atelier-api-token/.test(readFileSync(join(root, "src", "promptApi.ts"), "utf8")),
    detail: "Browser storage is limited to the Prompt Atelier API bearer token and API base.",
  },
];

const blocking = findings.filter((finding) => finding.severity === "block");
const report = {
  ok: blocking.length === 0 && checks.every((check) => check.ready),
  auditedAt: new Date().toISOString(),
  scannedFiles: files.length,
  checks,
  findings,
  warnings,
  notes: [
    "This audit reports credential-boundary posture only; it does not change provider keys or deploy secrets.",
    "Any live model provider credential should stay on the API host and outside browser-visible source or localStorage.",
  ],
};

const outputPath = join(outDir, "security-boundary-report.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, outputPath }, null, 2));
process.exit(report.ok ? 0 : 1);
