import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const qualityFiles = [];
const contaminationFiles = [];

const promptDir = join(root, "src", "prompts");
if (existsSync(promptDir)) {
  for (const file of readdirSync(promptDir).filter((name) => name.endsWith(".md")).sort()) {
    qualityFiles.push(join(promptDir, file));
  }
}
contaminationFiles.push(...qualityFiles);

const attachmentJson = join(root, "public", "attachment-prompts.json");
if (existsSync(attachmentJson)) contaminationFiles.push(attachmentJson);

const contaminationPatterns = [
  {
    label: "likely secret token",
    pattern: /\b(?:sk-ant-api\d{2}-[A-Za-z0-9_-]{16,}|sk-(?:proj|live|test)-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16})\b/,
  },
  {
    label: "unrelated repository operation",
    pattern: /\b(?:kapital-next|review-read-manifest|next-auth\.session-token|fresh sibling clone|merge lane|launchctl|hotfix #\d+)\b/i,
  },
  {
    label: "agent operational transcript",
    pattern: /\b(?:you are firing|staged diff|pull request instructions|commit instructions|closure truth source)\b/i,
  },
];

const qualitySignals = [
  { key: "stack", label: "Implementation stack", pattern: /\b(?:react|vite|typescript|tailwind|framer|motion|gsap|lucide|three\.js|css)\b/i },
  { key: "assets", label: "Concrete assets", pattern: /\b(?:https?:\/\/|video|image|font|svg|source url|asset|background)\b/i },
  { key: "layout", label: "Layout contract", pattern: /\b(?:layout|container|section|grid|flex|position|absolute|relative|viewport|fullscreen|full-screen)\b/i },
  { key: "responsive", label: "Responsive behavior", pattern: /\b(?:responsive|mobile|desktop|breakpoint|sm:|md:|lg:|xl:)\b/i },
  { key: "typography", label: "Typography", pattern: /\b(?:font|headline|heading|letter-spacing|tracking|line-height|text-)\b/i },
  { key: "interaction", label: "Interaction states", pattern: /\b(?:hover|active|focus|transition|toggle|menu|animation|keyframes|motion)\b/i },
  { key: "constraints", label: "No-go constraints", pattern: /\b(?:do not|no |avoid|without|only|exact|strict|must)\b/i },
  { key: "proof", label: "Verification proof", pattern: /\b(?:build|test|screenshot|verify|console|playwright|visual qa|proof)\b/i },
];

function compactSnippet(text, index) {
  return text.slice(Math.max(0, index - 60), index + 120).replace(/\s+/g, " ").trim();
}

const contamination = [];
const rows = [];

for (const file of qualityFiles) {
  const text = readFileSync(file, "utf8");
  const signals = qualitySignals.map((signal) => ({
    key: signal.key,
    label: signal.label,
    present: signal.pattern.test(text),
  }));
  const present = signals.filter((signal) => signal.present).length;
  const score = Math.round((present / qualitySignals.length) * 100);
  rows.push({
    file: relative(root, file),
    score,
    present,
    missing: signals.filter((signal) => !signal.present).map((signal) => signal.key),
  });

}

for (const file of contaminationFiles) {
  const text = readFileSync(file, "utf8");
  for (const { label, pattern } of contaminationPatterns) {
    const match = text.match(pattern);
    if (!match) continue;
    contamination.push({
      file: relative(root, file),
      label,
      snippet: compactSnippet(text, match.index ?? 0),
    });
  }
}

const averageScore = rows.length
  ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length)
  : 0;
const thinRows = rows.filter((row) => row.score < 60);
const report = {
  ok: contamination.length === 0,
  scanned: contaminationFiles.length,
  scoredPrompts: qualityFiles.length,
  averageScore,
  thresholds: {
    contamination: "blocking",
    promptQualityBelow60: "report-only",
  },
  contamination,
  coverage: {
    strong: rows.filter((row) => row.score >= 80).length,
    watch: rows.filter((row) => row.score >= 60 && row.score < 80).length,
    thin: thinRows.length,
  },
  thinRows: thinRows.slice(0, 12),
};

if (contamination.length) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
