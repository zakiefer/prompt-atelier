import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const repoRoot = process.cwd();
const attachmentsRoot = process.env.CODEX_ATTACHMENTS_DIR || "/Users/program/.codex/attachments";
const promptsDir = join(repoRoot, "src", "prompts");
const outputFile = join(repoRoot, "public", "attachment-prompts.json");

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleFromText(text, fallback) {
  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
  if (!firstLine) return fallback;
  const cleaned = firstLine.replace(/^#+\s*/, "").replace(/^build prompt:\s*/i, "");
  return cleaned.length > 74 ? `${cleaned.slice(0, 71).trim()}...` : cleaned;
}

function countWords(text) {
  return (text.match(/[A-Za-z0-9_'-]+/g) || []).length;
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " url ")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isLikelyWebsitePrompt(text) {
  const lower = text.toLowerCase();
  const promptSignals = [
    "react",
    "vite",
    "tailwind",
    "hero",
    "landing",
    "navbar",
    "fullscreen",
    "video background",
    "font",
    "lucide",
    "framer",
    "motion",
  ];
  return countWords(text) >= 80 && promptSignals.filter((signal) => lower.includes(signal)).length >= 3;
}

function readExistingPromptKeys() {
  if (!existsSync(promptsDir)) return new Set();
  return new Set(
    readdirSync(promptsDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => normalize(readFileSync(join(promptsDir, file), "utf8"))),
  );
}

function readAttachments() {
  if (!existsSync(attachmentsRoot)) return [];
  return readdirSync(attachmentsRoot)
    .map((dir) => {
      const path = join(attachmentsRoot, dir, "pasted-text.txt");
      if (!existsSync(path)) return undefined;
      const text = readFileSync(path, "utf8").trim();
      if (!isLikelyWebsitePrompt(text)) return undefined;
      return {
        sourceDir: dir,
        text,
      };
    })
    .filter(Boolean);
}

function makePayload(prompts) {
  const entries = prompts.map((prompt) => {
    const title = titleFromText(prompt.text, basename(prompt.sourceDir));
    const slug = slugify(title) || slugify(prompt.sourceDir);
    return {
      id: `attachment-${slug}-${prompt.sourceDir.slice(0, 8)}`,
      title,
      text: prompt.text,
      source: "attachment",
      createdAt: "2026-07-03T00:00:00.000Z",
    };
  });

  return JSON.stringify(
    {
      version: 1,
      generatedAt: new Date().toISOString(),
      prompts: entries,
    },
    null,
    2,
  );
}

const existingKeys = readExistingPromptKeys();
const seen = new Set(existingKeys);
const prompts = [];

for (const attachment of readAttachments()) {
  const key = normalize(attachment.text);
  if (!key || seen.has(key)) continue;
  seen.add(key);
  prompts.push(attachment);
}

mkdirSync(join(repoRoot, "public"), { recursive: true });
writeFileSync(outputFile, makePayload(prompts));

console.log(`Synced ${prompts.length} attachment prompt(s) to ${outputFile}`);
