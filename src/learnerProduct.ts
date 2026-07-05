import {
  analyzePrompt,
  buildRecipePrompt,
  evaluatePrompt,
  searchSimilarPrompts,
  type ArchetypeCluster,
  type CompiledPrompt,
  type DnaScoreExplanation,
  type OutcomeRecord,
  type PromptDiff,
  type PromptExample,
  type PromptImportAudit,
  type PromptProfile,
  type ProjectExportPack,
  type RecipeOptions,
  type ScreenshotRecord,
  type SearchResult,
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

export type LearnerSession = {
  id: string;
  createdAt: string;
  title: string;
  profileId: string;
  profileLabel: string;
  sourcePrompt: string;
  improvedPrompt: string;
  reviewedPrompt: string;
  promptScore: number;
  dnaScore: number;
  acceptedDiffs: string[];
  rejectedDiffs: string[];
  benchmarkWinner: {
    title: string;
    score: number;
    prompt: string;
  };
  exportFilesReady: number;
};

export type CorpusNeighbor = {
  id: string;
  title: string;
  score: number;
  words: number;
  source: PromptExample["source"];
  reasons: string[];
  tags: string[];
  preview: string;
};

export type DnaRewrite = {
  key: string;
  label: string;
  score: number;
  why: string;
  rewrite: string;
  evidence: string[];
};

export type LearnerRecipe = {
  id: string;
  label: string;
  score: number;
  prompt: string;
  traits: string[];
};

export type LearnerSamplePrompt = {
  id: string;
  title: string;
  archetype: string;
  score: number;
  prompt: string;
  tags: string[];
};

export type TargetExportPreset = {
  id: "codex" | "claude" | "v0" | "lovable" | "cursor" | "bolt" | "raw" | "jsonl" | "json" | "markdown" | "gpt";
  label: string;
  filename: string;
  detail: string;
  content: string;
};

export type LearnerBriefInput = {
  brandName: string;
  siteType: string;
  audience: string;
  stack: string;
  visualSignature: string;
  assets: string;
  motion: string;
  constraints: string;
  qa: string;
};

export type CorpusReviewRow = {
  id: string;
  title: string;
  decision: "gold" | "learn" | "review" | "quarantine";
  score: number;
  cluster: string;
  duplicate: string;
  reasons: string[];
  text: string;
};

export type LearnerProofItem = {
  id: string;
  title: string;
  kind: "session" | "screenshot" | "outcome";
  score: number;
  detail: string;
  meta: string;
  url?: string;
};

export type LearnerInteractionChecklist = {
  label: string;
  ready: boolean;
  detail: string;
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

export function buildCorpusNeighbors(source: string, examples: PromptExample[], outcomes: OutcomeRecord[] = []): CorpusNeighbor[] {
  const query = source.trim();
  const fallback = examples
    .map((example) => {
      const analysis = analyzePrompt(example.text);
      return {
        example,
        score: evaluatePrompt(example.text).score,
        reasons: [analysis.archetypes[0] ? `Archetype: ${analysis.archetypes[0].label}` : "Strong corpus example"],
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const rows: (SearchResult | { example: PromptExample; score: number; reasons: string[] })[] = query ? searchSimilarPrompts(query, examples, outcomes).slice(0, 5) : fallback;
  return rows.map((row) => {
    const analysis = analyzePrompt(row.example.text);
    return {
      id: row.example.id,
      title: row.example.title,
      score: row.score,
      words: row.example.text.split(/\s+/).filter(Boolean).length,
      source: row.example.source,
      reasons: row.reasons.length ? row.reasons : [analysis.archetypes[0] ? `Archetype: ${analysis.archetypes[0].label}` : "Shared implementation structure"],
      tags: analysis.tags.slice(0, 5),
      preview: row.example.text.slice(0, 280),
    };
  });
}

function rewriteForDnaLabel(label: string, source: string, improvedPrompt: string) {
  const lower = label.toLowerCase();
  const base = improvedPrompt.trim() || source.trim();
  if (lower.includes("asset")) {
    return "Add an Assets and Media section with exact URLs, object-fit, focal position, looping/preload behavior, z-index, overlay rules, and fallback behavior.";
  }
  if (lower.includes("motion") || lower.includes("state")) {
    return "Add a Motion and State section naming refs, event listeners, timings, easing, delays, cleanup, hover/open/loading states, and prefers-reduced-motion behavior.";
  }
  if (lower.includes("responsive")) {
    return "Add mobile, tablet, desktop, and wide rules with concrete breakpoints, text wrapping expectations, fixed-format dimensions, and screenshot checks.";
  }
  if (lower.includes("constraint")) {
    return "Add no-go rules that ban unlisted libraries, generic stock imagery, decorative blobs, unwanted overlays, text overlap, and unrelated sections.";
  }
  if (lower.includes("technical") || lower.includes("build")) {
    return "Start with the exact stack, dependency boundaries, file placement, component structure, accessible controls, and verification commands.";
  }
  if (lower.includes("visual")) {
    return "Name the visual signature in the first paragraph, then lock typography, colors, spacing, layout layers, media treatment, and first-viewport composition.";
  }
  return base
    ? `Tighten this dimension by turning implied direction into exact implementation specs. Keep this source intent: ${base.slice(0, 180)}`
    : "Turn the weak dimension into explicit implementation rules with exact values, copy, states, and QA checks.";
}

export function buildDnaRewritePlan({
  dnaExplanation,
  improvedPrompt,
  source,
}: {
  dnaExplanation: DnaScoreExplanation;
  improvedPrompt: string;
  source: string;
}): DnaRewrite[] {
  return [...dnaExplanation.dimensions]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((dimension) => ({
      key: dimension.key,
      label: dimension.label,
      score: dimension.score,
      why: dimension.why,
      evidence: dimension.evidence.slice(0, 3),
      rewrite: rewriteForDnaLabel(dimension.label, source, improvedPrompt),
    }));
}

export function buildLearnerRecipes({
  clusters,
  profile,
}: {
  clusters: ArchetypeCluster[];
  profile: PromptProfile;
}): LearnerRecipe[] {
  const topClusters = clusters.slice(0, 6);
  const fallbacks = [
    { label: "Cinematic video hero", traits: ["fullscreen video", "exact focal point", "copy hierarchy"] },
    { label: "Liquid glass SaaS", traits: ["glass navbar", "dark palette", "CTA system"] },
    { label: "Dashboard hero", traits: ["metrics", "workflow proof", "dense UI"] },
  ];
  const recipeSource = topClusters.length
    ? topClusters.map((cluster) => ({ label: cluster.label, score: cluster.score, traits: cluster.signals.slice(0, 5) }))
    : fallbacks.map((item) => ({ ...item, score: 80 }));
  return recipeSource.map((item, index) => {
    const options: RecipeOptions = {
      brandName: item.label.replace(/[^a-z0-9]+/gi, " ").trim() || "Recipe Brand",
      industry: item.label,
      stack: "React + TypeScript + Vite + Tailwind CSS",
      audience: "builders who need a high-fidelity website prompt",
      layout: "first-viewport website experience with a clear visual signature",
      nav: "responsive navigation with desktop links, primary CTA, and mobile menu rules",
      motion: item.traits.find((trait) => /motion|video|scroll|animation|gsap|fade/i.test(trait)) || "staggered reveal with reduced-motion fallback",
      assets: item.traits.find((trait) => /video|image|asset|screenshot|logo/i.test(trait)) || "exact media URLs, object-fit, focal point, and fallback handling",
      strictness: 9,
    };
    return {
      id: `recipe-${index}-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      label: item.label,
      score: item.score,
      prompt: buildRecipePrompt(profile, options),
      traits: item.traits,
    };
  });
}

export function buildSamplePromptGallery(examples: PromptExample[]): LearnerSamplePrompt[] {
  return examples
    .map((example) => {
      const analysis = analyzePrompt(example.text);
      return {
        id: example.id,
        title: example.title,
        archetype: analysis.archetypes[0]?.label || "High-fidelity website prompt",
        score: evaluatePrompt(example.text).score,
        prompt: example.text,
        tags: analysis.tags.slice(0, 5),
      };
    })
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 8);
}

export function buildTargetExportPresets({
  activeProfile,
  compiledPrompt,
  improvedPrompt,
  learnerExportPack,
}: {
  activeProfile: LearningProfile;
  compiledPrompt: string;
  improvedPrompt: string;
  learnerExportPack: LearnerExportPack;
}): TargetExportPreset[] {
  const base = improvedPrompt.trim() || compiledPrompt.trim();
  return [
    {
      id: "codex",
      label: "Codex",
      filename: "codex-build-prompt.md",
      detail: "Implementation-first prompt with constraints and verification ladder.",
      content: `# Codex Build Prompt

Build the site exactly from this implementation prompt.

${compiledPrompt}

## Codex Execution Contract
- Make the real usable first screen, not a marketing placeholder.
- Use the existing stack requested by the prompt unless the prompt explicitly says otherwise.
- Verify desktop and mobile screenshots, text wrapping, media loading, no console errors, lint, and build.
- Report exact commands and caveats.
- Do not introduce provider keys, unrelated project material, decorative filler, or extra libraries.`,
    },
    {
      id: "claude",
      label: "Claude",
      filename: "claude-design-prompt.md",
      detail: "Design-review framing with explicit success criteria.",
      content: `You are a senior product designer reviewing a website build prompt for the "${activeProfile.label}" learning profile.

Review for taste, completeness, implementation ambiguity, mobile behavior, interaction states, and visual QA.

Prompt:
${base}

Return:
1. A tightened implementation prompt.
2. A short list of requirements you changed.
3. A short list of risks still worth checking in screenshots.

Do not add provider-key handling, unrelated product claims, or generic AI-themed copy.`,
    },
    {
      id: "v0",
      label: "v0",
      filename: "v0-website-prompt.md",
      detail: "Concise but exact UI-generation prompt.",
      content: `Create a polished, responsive React interface from this prompt.

${base}

Keep the first screen as the usable product experience. Use exact copy, responsive behavior, accessible controls, real media/assets when listed, and no placeholder sections. Prefer familiar controls and keep the visual style restrained.`,
    },
    {
      id: "lovable",
      label: "Lovable",
      filename: "lovable-app-prompt.md",
      detail: "App-builder handoff with states, data, and responsive behavior.",
      content: `Build this as a polished responsive web app.

${base}

Lovable execution notes:
- Make the first screen the actual usable experience.
- Include states for empty content, saved content, validation, loading, and success where the prompt implies data.
- Keep copy, controls, navigation, and responsive behavior code-native.
- Do not add unrelated marketing sections, provider-key inputs, or placeholder imagery.
- Verify desktop and mobile layout, interaction state changes, and console health.`,
    },
    {
      id: "cursor",
      label: "Cursor",
      filename: "cursor-implementation-ticket.md",
      detail: "Repo-edit ticket with scoped files and verification.",
      content: `Implement the following website prompt in the current repo.

${base}

Cursor constraints:
- Inspect existing components, styling tokens, scripts, and package manager before editing.
- Keep changes scoped to the smallest useful file set.
- Preserve unrelated user changes.
- Add or update focused tests only where behavior changes.
- Verify with lint, build/typecheck, and desktop/mobile rendered screenshots.
- Report exact files touched, commands run, and any intentional deviations.`,
    },
    {
      id: "bolt",
      label: "Bolt",
      filename: "bolt-fast-scaffold-prompt.md",
      detail: "Fast scaffold prompt with dependency and no-go rules.",
      content: `Create a clean scaffold for this website prompt.

${base}

Bolt constraints:
- Use only the dependencies named in the prompt unless a missing dependency is explicitly required.
- Build the real first screen immediately; no landing-page wrapper around a future app.
- Keep media assets real and visible, with object-fit/focal rules preserved.
- Include mobile behavior, focus states, and hover/tap states.
- No unrelated sections, decorative filler, fake provider keys, or placeholder assets.`,
    },
    {
      id: "raw",
      label: "Raw Spec",
      filename: "implementation-spec.md",
      detail: "Neutral implementation spec without tool-specific phrasing.",
      content: `# Raw Website Implementation Spec

## Source
${base}

## Required Output
- Build the exact website/interface described above.
- Preserve the requested stack, assets, fonts, colors, layout, responsive behavior, interaction states, motion, and constraints.
- Include accessibility labels, keyboard focus states, loading/empty states where relevant, and reduced-motion handling for animation.
- Verify desktop and mobile screenshots, no horizontal overflow, no text overlap, no console errors, and successful build/lint/typecheck.

## Non-goals
- Do not add unrelated sections, provider-key inputs, fake claims, placeholder assets, decorative filler, or unrequested libraries.`,
    },
    {
      id: "jsonl",
      label: "JSONL",
      filename: "website-prompt-finetune.jsonl",
      detail: "One supervised fine-tune row with source, target, quality, and proof metadata.",
      content: `${JSON.stringify({
        messages: [
          {
            role: "system",
            content: "Rewrite website prompts into precise, implementation-ready frontend build specs with stack, fonts, assets, layout, motion, responsive rules, constraints, and QA gates.",
          },
          {
            role: "user",
            content: learnerExportPack.markdown.slice(0, 4000),
          },
          {
            role: "assistant",
            content: base,
          },
        ],
        metadata: {
          profile: activeProfile.label,
          exportedAt: new Date().toISOString(),
          scorecard: learnerExportPack.scorecard,
          proofRequired: true,
        },
      })}\n`,
    },
    {
      id: "json",
      label: "JSON",
      filename: "learner-export.json",
      detail: "Structured export for machines and import pipelines.",
      content: learnerExportPack.json,
    },
    {
      id: "markdown",
      label: "Markdown",
      filename: "learner-export.md",
      detail: "Human-readable package with prompt, proof, and checklist.",
      content: learnerExportPack.markdown,
    },
    {
      id: "gpt",
      label: "GPT",
      filename: "gpt-prompt-rewrite.md",
      detail: "General assistant format with learned patterns and export context.",
      content: `Rewrite the following website prompt into a clear, implementation-ready spec.

Source prompt:
${base}

Use this learner context when helpful:
${learnerExportPack.markdown.slice(0, 1800)}

Return a single final prompt with headings for stack, fonts, colors, assets, layout, controls, motion, responsive behavior, constraints, and QA. Do not include analysis before the prompt.`,
    },
  ];
}

export function createEmptyLearnerBriefInput(activeProfile?: LearningProfile): LearnerBriefInput {
  return {
    brandName: "Atelier",
    siteType: activeProfile?.label || "cinematic website hero",
    audience: "design-conscious founders and builders",
    stack: "React + TypeScript + Vite + Tailwind CSS",
    visualSignature: activeProfile?.description || "fullscreen media-led first screen with restrained navigation and precise typography",
    assets: "Use exact image/video/logo URLs when provided; otherwise specify real asset requirements and fallback behavior.",
    motion: "Subtle reveal, hover, and menu state changes with reduced-motion fallback.",
    constraints: "No decorative blobs, no placeholder assets, no unrelated sections, no provider keys, no text overlap.",
    qa: "Verify desktop and mobile screenshots, media rendering, keyboard focus states, no horizontal overflow, lint, and build.",
  };
}

export function buildLearnerBriefPrompt(input: LearnerBriefInput, activeProfile: LearningProfile, profile: PromptProfile): string {
  const options: RecipeOptions = {
    brandName: input.brandName.trim() || "Website Brand",
    industry: input.siteType.trim() || activeProfile.label,
    stack: input.stack.trim() || "React + TypeScript + Vite + Tailwind CSS",
    audience: input.audience.trim() || "website visitors",
    layout: input.visualSignature.trim() || "single-page website experience with a clear visual signature",
    nav: "Responsive navigation with desktop links, primary CTA, mobile menu behavior, labels, aria states, hover/focus states, and active states.",
    motion: input.motion.trim() || "Subtle reveal and interaction states with reduced-motion fallback.",
    assets: input.assets.trim() || "State exact media, object-fit, focal points, preload/lazy behavior, and fallbacks.",
    strictness: 9,
  };
  return [
    buildRecipePrompt(profile, options),
    "",
    "## TARGET AUDIENCE",
    input.audience,
    "",
    "## VISUAL SIGNATURE",
    input.visualSignature,
    "",
    "## REQUIRED ASSETS",
    input.assets,
    "",
    "## MOTION AND STATE",
    input.motion,
    "",
    "## CONSTRAINTS",
    input.constraints,
    "",
    "## QA CHECKS",
    input.qa,
  ].join("\n");
}

export function buildCorpusReviewQueue(audit: PromptImportAudit): CorpusReviewRow[] {
  return audit.items.slice(0, 12).map((item) => ({
    id: item.candidate.id,
    title: item.candidate.title,
    decision: item.decision,
    score: item.candidate.score,
    cluster: item.cluster,
    duplicate:
      item.duplicate.kind === "exact"
        ? `Exact duplicate: ${item.duplicate.match?.title ?? "existing prompt"}`
        : item.duplicate.kind === "near"
          ? `Near duplicate: ${item.duplicate.match?.title ?? "existing prompt"}`
          : "Distinct candidate",
    reasons: item.reasons,
    text: item.candidate.text,
  }));
}

export function buildLearnerProofGallery({
  outcomes,
  screenshots,
  sessions,
}: {
  outcomes: OutcomeRecord[];
  screenshots: ScreenshotRecord[];
  sessions: LearnerSession[];
}): LearnerProofItem[] {
  const sessionItems = sessions.slice(0, 4).map((session) => ({
    id: session.id,
    title: session.title,
    kind: "session" as const,
    score: session.dnaScore,
    detail: `${session.acceptedDiffs.length} accepted diff(s), ${session.exportFilesReady} export file(s) ready.`,
    meta: `${session.profileLabel} / ${new Date(session.createdAt).toLocaleDateString()}`,
  }));
  const screenshotItems = screenshots.slice(0, 4).map((screenshot) => ({
    id: screenshot.id,
    title: screenshot.title,
    kind: "screenshot" as const,
    score: screenshot.rating === "great" ? 92 : screenshot.rating === "okay" ? 68 : screenshot.rating === "bad" ? 28 : 50,
    detail: screenshot.notes || "Screenshot proof saved.",
    meta: screenshot.rating,
    url: screenshot.url,
  }));
  const outcomeItems = outcomes.slice(0, 4).map((outcome) => ({
    id: `${outcome.promptId}-${outcome.updatedAt}`,
    title: outcome.title,
    kind: "outcome" as const,
    score: outcome.status === "gold" ? 94 : outcome.status === "good" ? 78 : outcome.status === "avoid" ? 24 : 52,
    detail: outcome.notes || "Outcome feedback saved.",
    meta: `${outcome.rating} / ${outcome.status}`,
  }));
  return [...sessionItems, ...screenshotItems, ...outcomeItems]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 10);
}

export function buildLearnerInteractionChecklist({
  acceptedDiffs,
  activeProfile,
  learnerExportPack,
  savedSessions,
}: {
  acceptedDiffs: string[];
  activeProfile: LearningProfile;
  learnerExportPack: LearnerExportPack;
  savedSessions: LearnerSession[];
}): LearnerInteractionChecklist[] {
  return [
    { label: "Profile switching", ready: Boolean(activeProfile.id), detail: `${activeProfile.label} is active.` },
    { label: "Diff decisions", ready: acceptedDiffs.length > 0, detail: acceptedDiffs.length ? `${acceptedDiffs.length} accepted section(s).` : "Accept at least one gained section." },
    { label: "Export pack", ready: learnerExportPack.files.filter((file) => file.ready).length >= 4, detail: `${learnerExportPack.files.filter((file) => file.ready).length}/${learnerExportPack.files.length} files ready.` },
    { label: "Session history", ready: savedSessions.length > 0, detail: savedSessions.length ? `${savedSessions.length} saved session(s).` : "Save one learner session." },
  ];
}

export function createLearnerSession({
  acceptedDiffs,
  activeProfile,
  benchmarkWinner,
  dnaScore,
  exportFilesReady,
  improvedPrompt,
  promptScore,
  rejectedDiffs,
  reviewedPrompt,
  sourcePrompt,
}: {
  acceptedDiffs: string[];
  activeProfile: LearningProfile;
  benchmarkWinner: { title: string; score: number; prompt: string };
  dnaScore: number;
  exportFilesReady: number;
  improvedPrompt: string;
  promptScore: number;
  rejectedDiffs: string[];
  reviewedPrompt: string;
  sourcePrompt: string;
}): LearnerSession {
  const title = sourcePrompt.trim().split(/\n+/)[0]?.slice(0, 90) || activeProfile.label || "Learner session";
  return {
    id: `learner-session-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title,
    profileId: activeProfile.id,
    profileLabel: activeProfile.label,
    sourcePrompt,
    improvedPrompt,
    reviewedPrompt,
    promptScore,
    dnaScore,
    acceptedDiffs,
    rejectedDiffs,
    benchmarkWinner,
    exportFilesReady,
  };
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
    { label: "Prompt strength", score: dnaExplanation.overall, detail: dnaExplanation.summary[0] || "Prompt strength blends static prompt traits with proof evidence." },
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
      { label: "JSON training record", filename: "prompt-learner-record.json", ready: Boolean(json), detail: "Structured source, result, quality, memory, and proof fields." },
      { label: "Scorecard", filename: "prompt-scorecard.md", ready: scorecard.some((item) => item.score > 0), detail: `${scorecard.length} scorecard dimension(s).` },
      { label: "Memory patch", filename: "learning-memory-v2.patch.md", ready: Boolean(learningMemory.memoryPatch), detail: `${learningMemory.rules.length} memory rule(s).` },
      { label: "Screenshot proof refs", filename: "screenshot-proof.md", ready: screenshots.length > 0, detail: `${screenshots.length} screenshot reference(s).` },
    ],
  };
}
