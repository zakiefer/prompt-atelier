import {
  analyzePrompt,
  type ArchetypeCluster,
  type CompiledPrompt,
  type DnaScoreExplanation,
  type PromptDiff,
  type PromptExample,
  type PromptProfile,
  type ProjectExportPack,
  type ScreenshotRecord,
} from "./promptEngine";
import { type LearningMemoryV2Report, type SavedProjectSpaceInput } from "./productEvolution";

export type LearningProfilePreset = {
  key: string;
  label: string;
  description: string;
  query: string[];
};

export type SavedProjectSpaceWithDate = SavedProjectSpaceInput & {
  createdAt: string;
};

export type LearningProfile = {
  id: string;
  label: string;
  description: string;
  query: string[];
  examples: number;
  score: number;
  rules: string[];
};

export type LearnerExportPack = {
  markdown: string;
  json: string;
  files: { label: string; filename: string; ready: boolean; detail: string }[];
  scorecard: { label: string; score: number; detail: string }[];
};

function normalizeDnaScore(score: number) {
  return Math.min(100, Math.round(55 + score * 0.625));
}

function countQueryMatches(examples: PromptExample[], query: string[]) {
  if (!query.length) return examples.length;
  const terms = query.map((item) => item.toLowerCase()).filter(Boolean);
  return examples.filter((example) => {
    const analysis = analyzePrompt(example.text);
    const haystack = `${example.title} ${example.text} ${analysis.tags.join(" ")} ${analysis.archetypes.map((match) => match.label).join(" ")}`.toLowerCase();
    return terms.some((term) => haystack.includes(term));
  }).length;
}

export function buildLearningProfiles({
  clusters,
  examples,
  presets,
  profile,
  savedSpaces,
}: {
  clusters: ArchetypeCluster[];
  examples: PromptExample[];
  presets: LearningProfilePreset[];
  profile: PromptProfile;
  savedSpaces: SavedProjectSpaceWithDate[];
}): LearningProfile[] {
  const topRules = profile.learnedRules.slice(0, 4);
  const presetProfiles = presets.map((preset) => {
    const examplesMatching = countQueryMatches(examples, preset.query);
    return {
      id: preset.key,
      label: preset.label,
      description: preset.description,
      query: preset.query,
      examples: examplesMatching,
      score: preset.key === "all" ? normalizeDnaScore(profile.detailScore) : Math.min(100, 58 + examplesMatching * 7),
      rules: topRules,
    };
  });
  const archetypeProfiles = clusters.slice(0, 5).map((cluster) => ({
    id: `archetype-${cluster.key}`,
    label: cluster.label,
    description: `${cluster.count} prompt(s) sharing ${cluster.signals.slice(0, 3).join(", ") || "a visible pattern"}.`,
    query: [cluster.label, ...cluster.signals.slice(0, 4)],
    examples: cluster.count,
    score: cluster.score,
    rules: cluster.signals.slice(0, 4),
  }));
  const savedProfiles = savedSpaces.slice(0, 6).map((space) => {
    const examplesMatching = countQueryMatches(examples, space.query);
    return {
      id: `saved-${space.id}`,
      label: space.label,
      description: `Saved project space from ${new Date(space.createdAt).toLocaleDateString()}.`,
      query: space.query,
      examples: examplesMatching,
      score: Math.min(100, 62 + examplesMatching * 8),
      rules: space.query.length ? space.query.map((item) => `Prioritize ${item}.`) : topRules,
    };
  });
  return [...presetProfiles, ...archetypeProfiles, ...savedProfiles].filter((profileItem, index, all) => all.findIndex((item) => item.id === profileItem.id) === index);
}

export function buildCompilerHouseFormatText(compiled: CompiledPrompt) {
  const sectionList = [
    "Stack",
    "Fonts and Global CSS",
    "Color System",
    "Assets and Media",
    "Layout and Layer Order",
    "Navigation and Controls",
    "Hero and Section Copy",
    "Motion and State",
    "Responsive Behavior",
    "Constraints and QA",
  ];
  return [
    "HOUSE-FORMAT COMPILED WEBSITE PROMPT",
    "",
    ...sectionList.map((section) => `## ${section}\n${compiled.sections.includes(section.split(" ")[0]) ? "Covered by the compiled prompt below." : "Add explicit implementation-ready details for this section."}`),
    "",
    "## Compiled Prompt",
    compiled.prompt,
  ].join("\n\n");
}

export function buildLearnerExportPack({
  activeProfile,
  diff,
  dnaExplanation,
  improvedPrompt,
  learnerSource,
  learningMemory,
  projectExportPack,
  screenshots,
}: {
  activeProfile: LearningProfile;
  diff?: PromptDiff;
  dnaExplanation: DnaScoreExplanation;
  improvedPrompt: string;
  learnerSource: string;
  learningMemory: LearningMemoryV2Report;
  projectExportPack: ProjectExportPack;
  screenshots: ScreenshotRecord[];
}): LearnerExportPack {
  const scorecard = [
    { label: "DNA", score: dnaExplanation.overall, detail: dnaExplanation.summary[0] || "DNA score blends static prompt traits with proof evidence." },
    { label: "Memory", score: learningMemory.score, detail: `${learningMemory.rules.length} rule(s), ${learningMemory.rules.filter((rule) => rule.decision === "pinned").length} pinned.` },
    { label: "Diff", score: diff?.similarity ?? 0, detail: diff ? `${diff.categories.filter((category) => category.rightOnly.length).length} section(s) gained explicit signals.` : "No diff available." },
  ];
  const scoreMarkdown = scorecard.map((item) => `- ${item.label}: ${item.score}/100 - ${item.detail}`).join("\n");
  const proofMarkdown = screenshots.length
    ? screenshots.slice(0, 8).map((screenshot) => `- ${screenshot.title}: ${screenshot.url} (${screenshot.rating})`).join("\n")
    : "- No screenshot proof saved yet.";
  const markdown = `# Prompt Learner Export Pack

## Profile
${activeProfile.label}: ${activeProfile.description}

## Original Prompt
${learnerSource || "No source prompt pasted."}

## Improved Prompt
${improvedPrompt}

## Scorecard
${scoreMarkdown}

## Memory Patch
${learningMemory.memoryPatch}

## Screenshot Proof References
${proofMarkdown}

## Project Pack Preview
${projectExportPack.markdown.slice(0, 2500)}
`;
  const json = JSON.stringify(
    {
      version: 2,
      exportedAt: new Date().toISOString(),
      activeProfile,
      sourcePrompt: learnerSource,
      improvedPrompt,
      scorecard,
      memoryPatch: learningMemory.memoryPatch,
      diff: diff ? { similarity: diff.similarity, summary: diff.summary, categories: diff.categories } : undefined,
      screenshotProof: screenshots.map((screenshot) => ({ title: screenshot.title, url: screenshot.url, rating: screenshot.rating, notes: screenshot.notes })),
      projectPack: JSON.parse(projectExportPack.json) as unknown,
    },
    null,
    2,
  );
  return {
    markdown,
    json,
    scorecard,
    files: [
      { label: "Prompt markdown", filename: "improved-website-prompt.md", ready: Boolean(improvedPrompt.trim()), detail: "Improved prompt in readable Markdown." },
      { label: "JSON training record", filename: "prompt-learner-record.json", ready: Boolean(json), detail: "Structured source, result, DNA, memory, and proof fields." },
      { label: "Scorecard", filename: "prompt-scorecard.md", ready: scorecard.some((item) => item.score > 0), detail: `${scorecard.length} scorecard dimension(s).` },
      { label: "Memory patch", filename: "learning-memory-v2.patch.md", ready: Boolean(learningMemory.memoryPatch), detail: `${learningMemory.rules.length} memory rule(s).` },
      { label: "Screenshot proof refs", filename: "screenshot-proof.md", ready: screenshots.length > 0, detail: `${screenshots.length} screenshot reference(s).` },
    ],
  };
}
