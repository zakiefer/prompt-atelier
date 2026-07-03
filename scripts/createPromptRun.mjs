import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 56);
}

const promptFile = argValue("--prompt-file");
if (!promptFile) {
  console.error("Usage: npm run run:prompt -- --prompt-file ./prompt.md [--title \"Run title\"] [--url http://127.0.0.1:5173]");
  process.exit(1);
}

const promptPath = resolve(promptFile);
if (!existsSync(promptPath)) {
  console.error(`Prompt file not found: ${promptPath}`);
  process.exit(1);
}

const promptText = readFileSync(promptPath, "utf8").trim();
const title = argValue("--title") || basename(promptPath).replace(/\.[^.]+$/, "");
const resultUrl = argValue("--url") || "";
const runId = `run-${new Date().toISOString().replace(/[:.]/g, "-")}-${slugify(title) || "prompt"}`;
const runDir = join(process.cwd(), "prompt-runs", runId);

mkdirSync(runDir, { recursive: true });
writeFileSync(join(runDir, "prompt.md"), `${promptText}\n`);
writeFileSync(
  join(runDir, "codex-task.md"),
  `# Build This Prompt

Build the website exactly from \`prompt.md\`.

## Required Proof

- Local or deployed URL
- Desktop screenshot
- Mobile screenshot
- Files changed
- Console/build/type errors, if any
- Notes on visual issues

## Prompt

${promptText}
`,
);
writeFileSync(
  join(runDir, "result.json"),
  JSON.stringify(
    {
      id: runId,
      title,
      promptFile: join(runDir, "prompt.md"),
      status: "planned",
      resultUrl,
      folderPath: runDir,
      screenshotUrl: "",
      filesChanged: "",
      errors: "",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);
writeFileSync(
  join(runDir, "README.md"),
  `# ${title}

Prompt-run folder created by Prompt Atelier.

1. Give \`codex-task.md\` to Codex.
2. Build in this folder or a child project.
3. Fill \`result.json\`.
4. Paste the result URL, screenshot, errors, and notes into the Prompt Atelier Train tab.
`,
);

console.log(`Created prompt run: ${runDir}`);
