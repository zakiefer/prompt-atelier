import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function slugify(value) {
  return String(value || "prompt")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "prompt";
}

const root = process.cwd();
const sourcePath = join(root, "public", "attachment-prompts.json");
const outDir = join(root, "prompts");
const payload = JSON.parse(readFileSync(sourcePath, "utf8"));
const prompts = Array.isArray(payload.prompts) ? payload.prompts : [];

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

writeFileSync(
  join(outDir, "README.md"),
  `# Prompt Corpus Markdown Export

These files are generated from \`public/attachment-prompts.json\` with:

\`\`\`bash
npm run export:prompts
\`\`\`

The curated source corpus lives under \`src/prompts/\`. This folder is only a human-readable export of explicitly allowlisted attachment imports.

\`public/attachment-prompts.json\` is an optional generated import file. It must only contain explicitly allowlisted website prompts, never broad historical Codex attachments from unrelated projects.
`,
);

for (const [index, prompt] of prompts.entries()) {
  const number = String(index + 1).padStart(2, "0");
  const filename = `${number}-${slugify(prompt.title)}.md`;
  const body = [
    "---",
    `id: ${prompt.id}`,
    `title: ${JSON.stringify(prompt.title)}`,
    `source: ${prompt.source || "attachment"}`,
    `createdAt: ${prompt.createdAt || ""}`,
    "---",
    "",
    prompt.text?.trim() || "",
    "",
  ].join("\n");
  writeFileSync(join(outDir, filename), body);
}

console.log(JSON.stringify({ ok: true, count: prompts.length, outDir }, null, 2));
