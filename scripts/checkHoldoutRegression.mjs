#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (!arg.startsWith("--")) continue;
  const key = arg.slice(2);
  const value = process.argv[index + 1] && !process.argv[index + 1].startsWith("--") ? process.argv[++index] : "true";
  args.set(key, value);
}

const root = process.cwd();
const outDir = resolve(args.get("out") || "output/holdout-regression");
const failBelow = Math.max(0, Math.min(100, Number(args.get("fail-below") || 70)));
mkdirSync(outDir, { recursive: true });

const holdoutTraits = [
  { key: "stack", label: "Implementation stack", pattern: /\b(?:react|vite|typescript|tailwind|css|lucide|motion|framer|gsap|plain css)\b/i },
  { key: "fonts", label: "Fonts/global CSS", pattern: /\b(?:font|google fonts|@font-face|weights?|font-family|instrument|inter|geist)\b/i },
  { key: "assets", label: "Exact assets/media", pattern: /\b(?:https?:\/\/|video url|image|svg|asset|object-cover|playsInline|autoplay)\b/i },
  { key: "layout", label: "Layout/layer order", pattern: /\b(?:layout|section|hero|navbar|grid|flex|absolute|relative|z-|viewport|fullscreen|full-screen)\b/i },
  { key: "motion", label: "Motion/state", pattern: /\b(?:hover|active|transition|animation|keyframes|motion|gsap|requestAnimationFrame|toggle)\b/i },
  { key: "responsive", label: "Responsive behavior", pattern: /\b(?:responsive|mobile|desktop|breakpoint|sm:|md:|lg:|xl:|viewport)\b/i },
  { key: "constraints", label: "Constraints/no-go rules", pattern: /\b(?:do not|no |avoid|only|exact|must|required|strict)\b/i },
  { key: "proof", label: "QA/proof", pattern: /\b(?:verify|test|build|screenshot|playwright|console|qa|proof|accessibility)\b/i },
];

const contaminationPatterns = [
  { label: "likely provider key", pattern: /\b(?:sk-ant-api\d{2}-[A-Za-z0-9_-]{16,}|sk-(?:proj|live|test)-[A-Za-z0-9_-]{16,})\b/ },
  { label: "unrelated repo task", pattern: /\b(?:kapital-next|next-auth\.session-token|review-read-manifest|you are firing|hotfix #\d+)\b/i },
];

function scoreText(text) {
  const traits = holdoutTraits.map((trait) => ({ ...trait, present: trait.pattern.test(text) }));
  return {
    score: Math.round((traits.filter((trait) => trait.present).length / traits.length) * 100),
    missing: traits.filter((trait) => !trait.present).map((trait) => trait.key),
    present: traits.filter((trait) => trait.present).map((trait) => trait.key),
  };
}

function snippet(text, index) {
  return text.slice(Math.max(0, index - 80), index + 140).replace(/\s+/g, " ").trim();
}

const promptDir = join(root, "src", "prompts");
const files = existsSync(promptDir)
  ? readdirSync(promptDir).filter((file) => file.endsWith(".md")).sort().map((file) => join(promptDir, file))
  : [];

const rows = files.map((file) => {
  const text = readFileSync(file, "utf8");
  const scored = scoreText(text);
  const contamination = contaminationPatterns.flatMap(({ label, pattern }) => {
    const match = text.match(pattern);
    return match ? [{ label, snippet: snippet(text, match.index || 0) }] : [];
  });
  return {
    file: relative(root, file),
    title: text.split(/\n+/).find((line) => line.trim())?.replace(/^#+\s*/, "").slice(0, 100) || relative(root, file),
    score: scored.score,
    present: scored.present,
    missing: scored.missing,
    contamination,
    status: contamination.length ? "blocked" : scored.score >= failBelow ? "pass" : "watch",
  };
});

const averageScore = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length) : 0;
const blocked = rows.filter((row) => row.status === "blocked");
const regressions = rows.filter((row) => row.status === "watch");
const report = {
  ok: blocked.length === 0 && averageScore >= failBelow,
  checkedAt: new Date().toISOString(),
  threshold: failBelow,
  total: rows.length,
  averageScore,
  pass: rows.filter((row) => row.status === "pass").length,
  watch: regressions.length,
  blocked: blocked.length,
  rows,
  policy: [
    "Holdout regression is blocking only for contamination or average score below threshold.",
    "Thin rows are reported for prompt-quality repair but do not imply provider-key changes.",
    "Run after Learning Memory v2, template compiler, or public demo changes.",
  ],
};

const reportPath = join(outDir, "holdout-regression-report.json");
const markdownPath = join(outDir, "holdout-regression-report.md");
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(markdownPath, [
  "# Holdout Regression Report",
  "",
  `- Checked: ${report.checkedAt}`,
  `- Average score: ${averageScore}`,
  `- Pass/watch/blocked: ${report.pass}/${report.watch}/${report.blocked}`,
  "",
  "## Policy",
  ...report.policy.map((item) => `- ${item}`),
  "",
  "## Watch Rows",
  ...regressions.slice(0, 20).map((row) => `- ${row.file}: ${row.score} missing ${row.missing.join(", ") || "none"}`),
  "",
].join("\n"));

console.log(JSON.stringify({ ...report, files: { json: reportPath, markdown: markdownPath } }, null, 2));
process.exit(report.ok ? 0 : 1);
