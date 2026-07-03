import type { PromptExample } from "./promptEngine";
import { slugify, titleFromPrompt } from "./promptEngine";

const modules = import.meta.glob("./prompts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const seedPrompts: PromptExample[] = Object.entries(modules)
  .filter(([, text]) => text.trim().length > 0)
  .map(([path, text]) => {
    const fileName = path.split("/").pop()?.replace(/\.md$/, "") ?? "prompt";
    return {
      id: `seed-${slugify(fileName)}`,
      title: titleFromPrompt(text, fileName),
      text,
      source: "seed" as const,
      createdAt: "2026-07-02T00:00:00.000Z",
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));
