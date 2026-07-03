import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const scannedFiles = [];
const promptDir = join(process.cwd(), "src", "prompts");
if (existsSync(promptDir)) {
  for (const file of readdirSync(promptDir).filter((name) => name.endsWith(".md")).sort()) {
    scannedFiles.push(join(promptDir, file));
  }
}

const attachmentJson = join(process.cwd(), "public", "attachment-prompts.json");
if (existsSync(attachmentJson)) scannedFiles.push(attachmentJson);

const patterns = [
  {
    label: "Kapital Next operational task",
    pattern: /\b(?:kapital-next|review-read-manifest|next-auth\.session-token|fresh sibling clone|merge lane|launchctl)\b/i,
  },
  {
    label: "Helios repository reference",
    pattern: /\b(?:jkiefer89\/helios|helios echart|helios frontend)\b/i,
  },
  {
    label: "Operational task phrasing",
    pattern: /\b(?:you are firing|hotfix #\d+|staged diff|pull request instructions|commit instructions)\b/i,
  },
  {
    label: "Likely secret token",
    pattern: /\b(?:sk-ant-api\d{2}-[A-Za-z0-9_-]{16,}|sk-(?:proj|live|test)-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16})\b/,
  },
];

const findings = [];
for (const file of scannedFiles) {
  const text = readFileSync(file, "utf8");
  for (const { label, pattern } of patterns) {
    const match = text.match(pattern);
    if (match) {
      const index = match.index ?? 0;
      const snippet = text.slice(Math.max(0, index - 60), index + 120).replace(/\s+/g, " ").trim();
      findings.push({ file, label, snippet });
    }
  }
}

if (findings.length) {
  console.error("Corpus safety check failed:");
  for (const finding of findings) {
    console.error(`- ${finding.label} in ${finding.file}`);
    console.error(`  ${finding.snippet}`);
  }
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, scanned: scannedFiles.length }, null, 2));
