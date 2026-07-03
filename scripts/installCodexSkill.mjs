import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const skillFile = argValue("--file") || "website-prompt-atelier-SKILL.md";
const skillPath = resolve(skillFile);

if (!existsSync(skillPath)) {
  console.error(`Skill file not found: ${skillPath}`);
  console.error("Download or export website-prompt-atelier-SKILL.md from the Train tab, then run:");
  console.error("npm run install:skill -- --file ./website-prompt-atelier-SKILL.md");
  process.exit(1);
}

const targetDir = join(homedir(), ".codex", "skills", "website-prompt-atelier");
mkdirSync(targetDir, { recursive: true });
writeFileSync(join(targetDir, "SKILL.md"), readFileSync(skillPath, "utf8"));

console.log(`Installed Codex skill to ${join(targetDir, "SKILL.md")}`);
