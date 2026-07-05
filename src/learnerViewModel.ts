import { type DnaScoreExplanation, type Evaluation, type PromptBattle } from "./promptEngine";
import {
  type CorpusNeighbor,
  type CorpusReviewRow,
  type LearnerBriefInput,
  type LearnerExportPack,
  type LearnerProofItem,
  type LearnerSession,
  type LearningProfile,
  type TargetExportPreset,
} from "./learnerProduct";
import { type HoldoutBenchmarkReport, type ProjectSpacesReport } from "./productEvolution";

export type LearnerDiagnosis = {
  strengths: string[];
  gaps: string[];
  rewriteMoves: string[];
  confidence: {
    label: "High" | "Medium" | "Needs proof";
    score: number;
    detail: string;
  };
  closestGold: string[];
};

export type LearnerProofPlan = {
  status: "proved" | "partial" | "missing";
  headline: string;
  nextAction: string;
  items: { label: string; ready: boolean; detail: string }[];
};

export type LearnerCorpusSafety = {
  label: "clean" | "review" | "quarantine";
  detail: string;
  counts: {
    website: number;
    maybe: number;
    quarantine: number;
  };
  actions: string[];
};

export type LearnerRegressionSummary = {
  label: "ready" | "thin" | "blocked";
  score: number;
  detail: string;
  rows: string[];
};

export type LearnerProofAction = {
  status: "ready" | "started" | "missing";
  score: number;
  title: string;
  cta: string;
  detail: string;
  missing: string[];
  ready: string[];
};

export type LearnerBattleSummary = {
  status: "ready" | "thin";
  winnerTitle: string;
  winnerScore: number;
  cta: string;
  why: string[];
  variants: { title: string; score: number; intent: string; trait: string }[];
};

export type LearnerIngestionSummary = {
  status: "clean" | "review" | "blocked";
  headline: string;
  detail: string;
  rows: { title: string; label: "Website prompt" | "Maybe useful" | "Quarantine"; score: number; reason: string }[];
  actions: string[];
};

export type LearnerStyleProfileCard = {
  id: string;
  label: string;
  active: boolean;
  examples: number;
  score: number;
  emphasis: string;
  exportVoice: string;
  rules: string[];
};

export type LearnerExportTargetMatrix = {
  readyCount: number;
  rows: { target: string; useFor: string; include: string; avoid: string; ready: boolean }[];
};

export type LearnerOperatingLoop = {
  score: number;
  currentAction: string;
  steps: { id: "paste" | "score" | "improve" | "battle" | "prove" | "export"; label: string; status: "ready" | "active" | "next"; detail: string; target: "compose" | "review" | "export" }[];
};

export type LearnedStyleGenerator = {
  ready: boolean;
  headline: string;
  detail: string;
  prompt: string;
  ingredients: { label: string; detail: string }[];
};

export type LearnerProjectSystem = {
  score: number;
  status: ProjectSpacesReport["status"];
  headline: string;
  detail: string;
  rows: { label: string; count: number; status: "clean" | "review" | "blocked"; detail: string }[];
  policy: string[];
};

export type TrainFocusSummary = {
  score: number;
  headline: string;
  groups: { label: string; status: "ready" | "watch" | "blocked"; detail: string; target: string }[];
  advancedCount: number;
};

export function buildLearnerDiagnosis({
  dnaExplanation,
  evaluation,
  neighbors,
  proofGallery,
}: {
  dnaExplanation: DnaScoreExplanation;
  evaluation: Evaluation;
  neighbors: CorpusNeighbor[];
  proofGallery: LearnerProofItem[];
}): LearnerDiagnosis {
  const sortedDimensions = [...dnaExplanation.dimensions].sort((a, b) => b.score - a.score);
  const weakDimensions = [...dnaExplanation.dimensions].sort((a, b) => a.score - b.score);
  const strengths = sortedDimensions
    .filter((dimension) => dimension.score >= 70)
    .slice(0, 3)
    .map((dimension) => `${dimension.label}: ${dimension.evidence[0] || dimension.why}`);
  const gaps = weakDimensions
    .slice(0, 3)
    .map((dimension) => `${dimension.label}: ${dimension.why}`);
  const rewriteMoves = (evaluation.upgrades.length ? evaluation.upgrades : gaps)
    .slice(0, 3)
    .map((move) => move.replace(/\.$/, ""));
  const proofSignals = proofGallery.filter((item) => item.kind === "screenshot" || item.kind === "outcome").length;
  const proofScore = proofSignals ? Math.min(100, 62 + proofSignals * 12) : 42;
  const confidenceScore = Math.round((dnaExplanation.overall + evaluation.score + proofScore) / 3);
  const confidence =
    confidenceScore >= 78 && proofSignals
      ? { label: "High" as const, score: confidenceScore, detail: "Prompt text and proof signals agree." }
      : confidenceScore >= 62
        ? { label: "Medium" as const, score: confidenceScore, detail: proofSignals ? "Good structure with partial proof." : "Good structure, but still needs screenshot or outcome proof." }
        : { label: "Needs proof" as const, score: confidenceScore, detail: "Add stronger specs and result evidence before promoting this prompt." };
  return {
    strengths: strengths.length ? strengths : ["Strongest sections are still emerging from the current prompt."],
    gaps,
    rewriteMoves,
    confidence,
    closestGold: neighbors.slice(0, 3).map((neighbor) => `${neighbor.title} (${neighbor.score}/100)`),
  };
}

export function buildLearnerProofPlan({
  proofGallery,
}: {
  proofGallery: LearnerProofItem[];
}): LearnerProofPlan {
  const screenshotCount = proofGallery.filter((item) => item.kind === "screenshot").length;
  const outcomeCount = proofGallery.filter((item) => item.kind === "outcome").length;
  const sessionCount = proofGallery.filter((item) => item.kind === "session").length;
  const hasVisualProof = screenshotCount > 0;
  const hasOutcomeProof = outcomeCount > 0;
  const hasSessionProof = sessionCount > 0;
  const status = hasVisualProof && hasOutcomeProof ? "proved" : hasVisualProof || hasOutcomeProof || hasSessionProof ? "partial" : "missing";
  return {
    status,
    headline:
      status === "proved"
        ? "Proof loop is connected"
        : status === "partial"
          ? "Proof is started"
          : "Proof is missing",
    nextAction:
      status === "proved"
        ? "Use this evidence in the export pack and regression board."
        : hasVisualProof
          ? "Add outcome feedback so the learner knows whether the build actually worked."
          : "Attach desktop/mobile screenshots or run a proof capture before marking this prompt gold.",
    items: [
      { label: "Saved session", ready: hasSessionProof, detail: hasSessionProof ? `${sessionCount} saved session proof item(s).` : "Save a learner session after review." },
      { label: "Screenshot proof", ready: hasVisualProof, detail: hasVisualProof ? `${screenshotCount} screenshot proof item(s).` : "Attach or capture desktop/mobile screenshots." },
      { label: "Outcome feedback", ready: hasOutcomeProof, detail: hasOutcomeProof ? `${outcomeCount} outcome proof item(s).` : "Record whether the generated result was great, okay, or bad." },
    ],
  };
}

export function buildLearnerProofAction({
  improvedPrompt,
  proofGallery,
}: {
  improvedPrompt: string;
  proofGallery: LearnerProofItem[];
}): LearnerProofAction {
  const hasSession = proofGallery.some((item) => item.kind === "session");
  const hasScreenshot = proofGallery.some((item) => item.kind === "screenshot");
  const hasOutcome = proofGallery.some((item) => item.kind === "outcome");
  const promptMentionsProof = /screenshot|desktop|mobile|verify|test|qa|proof|build/i.test(improvedPrompt);
  const ready = [
    hasSession ? "Saved learner session" : "",
    hasScreenshot ? "Screenshot evidence" : "",
    hasOutcome ? "Outcome feedback" : "",
    promptMentionsProof ? "Prompt asks for verification" : "",
  ].filter(Boolean);
  const missing = [
    hasSession ? "" : "Save a learner session",
    hasScreenshot ? "" : "Attach desktop/mobile screenshots",
    hasOutcome ? "" : "Record whether the build result was great, okay, or bad",
  ].filter(Boolean);
  const score = Math.min(100, ready.length * 24 + (promptMentionsProof ? 4 : 0));
  const status = hasScreenshot && hasOutcome ? "ready" : ready.length ? "started" : "missing";
  return {
    status,
    score,
    title: status === "ready" ? "Proof is strong enough to learn from" : status === "started" ? "Proof run is started" : "Proof is the next move",
    cta: status === "ready" ? "Use proof in export" : hasScreenshot ? "Add outcome feedback" : "Run proof now",
    detail:
      status === "ready"
        ? "Screenshot evidence and result feedback are both connected to this prompt."
        : status === "started"
          ? "The learner has partial evidence. Finish the missing proof before promoting the prompt."
          : "Static prompt strength is not enough. Add visual or outcome proof before trusting this as training signal.",
    missing,
    ready,
  };
}

export function buildLearnerBattleSummary(battle: PromptBattle): LearnerBattleSummary {
  const variants = battle.variants.slice(0, 4).map((variant) => ({
    title: variant.title,
    score: variant.score,
    intent: variant.intent,
    trait: /asset|video|image/i.test(variant.prompt)
      ? "asset specificity"
      : /responsive|mobile|desktop/i.test(variant.prompt)
        ? "responsive rules"
        : /verify|test|screenshot|qa/i.test(variant.prompt)
          ? "proof instructions"
          : "implementation clarity",
  }));
  const winner = battle.winner || battle.variants[0];
  return {
    status: variants.length >= 2 ? "ready" : "thin",
    winnerTitle: winner?.title || "No battle winner yet",
    winnerScore: winner?.score || 0,
    cta: variants.length >= 2 ? "Save winning variant" : "Add more constraints first",
    why: battle.explanation.length ? battle.explanation.slice(0, 4) : ["The battle needs at least two viable prompt variants."],
    variants,
  };
}

export function buildLearnerIngestionSummary(rows: CorpusReviewRow[]): LearnerIngestionSummary {
  const visibleRows = rows.slice(0, 6).map((row) => ({
    title: row.title,
    label: row.decision === "quarantine" ? "Quarantine" as const : row.decision === "review" ? "Maybe useful" as const : "Website prompt" as const,
    score: row.score,
    reason: row.reasons[0] || row.duplicate || row.cluster,
  }));
  const quarantine = visibleRows.filter((row) => row.label === "Quarantine").length;
  const maybe = visibleRows.filter((row) => row.label === "Maybe useful").length;
  const website = visibleRows.filter((row) => row.label === "Website prompt").length;
  const status = quarantine ? "blocked" : maybe ? "review" : "clean";
  return {
    status,
    headline: status === "clean" ? "Corpus is safe to learn from" : status === "review" ? "Review maybe-useful prompts" : "Keep quarantined text out",
    detail:
      status === "clean"
        ? `${website} visible website prompt candidate(s) can feed style learning.`
        : status === "review"
          ? `${maybe} visible row(s) need a gold, bad, or quarantine decision before export.`
          : `${quarantine} visible row(s) look off-project or risky and should stay out of memory.`,
    rows: visibleRows,
    actions: [
      website ? "Promote proven website prompts to gold." : "Add clean website prompts before training.",
      maybe ? "Decide whether maybe-useful prompts are gold or bad." : "No maybe-useful rows are blocking the next export.",
      quarantine ? "Leave quarantined project text out of prompt memory." : "Corpus guard is not showing visible quarantine blockers.",
    ],
  };
}

export function buildLearnerStyleProfileCards({
  activeProfile,
  profiles,
}: {
  activeProfile: LearningProfile;
  profiles: LearningProfile[];
}): LearnerStyleProfileCard[] {
  return profiles.slice(0, 8).map((profile) => {
    const strongestRule = profile.rules[0] || "Use exact implementation details.";
    return {
      id: profile.id,
      label: profile.label,
      active: profile.id === activeProfile.id,
      examples: profile.examples,
      score: profile.score,
      emphasis: strongestRule,
      exportVoice:
        profile.score >= 80
          ? "Confident and specific."
          : profile.examples >= 10
            ? "Useful, but ask for proof."
            : "Treat as a starter profile.",
      rules: profile.rules.slice(0, 4),
    };
  });
}

export function buildLearnerExportTargetMatrix({
  pack,
  presets,
}: {
  pack: LearnerExportPack;
  presets: TargetExportPreset[];
}): LearnerExportTargetMatrix {
  const presetIds = new Set(presets.map((preset) => preset.id));
  const proofReady = pack.files.some((file) => /proof/i.test(file.label) && file.ready);
  const rows = [
    { target: "Codex", useFor: "Implementation", include: "Exact files, stack, UI states, and verification ladder.", avoid: "Loose mood-board language.", ready: presetIds.has("codex") },
    { target: "Claude", useFor: "Critique and rewrite", include: "Ambiguities, success criteria, edge cases, and rewrite reasons.", avoid: "Only final prompt text.", ready: presetIds.has("claude") },
    { target: "v0", useFor: "Fast UI generation", include: "Concise layout, components, tokens, and responsive rules.", avoid: "Long training history.", ready: presetIds.has("v0") },
    { target: "Lovable", useFor: "App-builder handoff", include: "Screen behavior, data assumptions, empty states, and responsive acceptance checks.", avoid: "Long model critique preambles.", ready: presetIds.has("lovable") },
    { target: "Cursor", useFor: "Repo edits", include: "Files to touch, invariants, tests, and scoped refactor notes.", avoid: "Visual direction without code boundaries.", ready: presetIds.has("cursor") },
    { target: "Bolt", useFor: "Fast scaffold", include: "Dependency boundaries, first screen, asset handling, and no-go rules.", avoid: "Multi-app architecture unless requested.", ready: presetIds.has("bolt") },
    { target: "JSON", useFor: "Structured import", include: "Profile, scorecard, proof status, target files, and labels.", avoid: "Unreviewed quarantine rows.", ready: presetIds.has("json") || Boolean(pack.json) },
    { target: "Markdown", useFor: "Human handoff", include: "Final prompt, rationale, proof, and verification checklist.", avoid: "Private logs or provider keys.", ready: presetIds.has("markdown") || Boolean(pack.markdown) },
    { target: "Memory", useFor: "Reusable project context", include: "Patterns, avoid rules, profile voice, and proof summary.", avoid: "One-off prompt clutter.", ready: pack.files.some((file) => /memory/i.test(file.label) && file.ready) || proofReady },
  ];
  return {
    readyCount: rows.filter((row) => row.ready).length,
    rows,
  };
}

export function buildLearnerOperatingLoop({
  battleReady,
  evaluation,
  exportReadyCount,
  improvedPrompt,
  proofAction,
  source,
}: {
  battleReady: boolean;
  evaluation: Evaluation;
  exportReadyCount: number;
  improvedPrompt: string;
  proofAction: LearnerProofAction;
  source: string;
}): LearnerOperatingLoop {
  const rawSteps = [
    { id: "paste" as const, label: "Paste", ready: Boolean(source.trim()), detail: "Start with one excellent website prompt or a generated brief.", target: "compose" as const },
    { id: "score" as const, label: "Score", ready: evaluation.score >= 20, detail: `${evaluation.score}/100 prompt strength with category gaps.`, target: "compose" as const },
    { id: "improve" as const, label: "Improve", ready: improvedPrompt.trim().length > Math.max(40, source.trim().length), detail: "Create a stronger prompt from learned patterns.", target: "compose" as const },
    { id: "battle" as const, label: "Battle", ready: battleReady, detail: battleReady ? "A winner is ready to save." : "Compare variants after the prompt has enough constraints.", target: "review" as const },
    { id: "prove" as const, label: "Prove", ready: proofAction.status === "ready", detail: proofAction.detail, target: "review" as const },
    { id: "export" as const, label: "Export", ready: exportReadyCount >= 6, detail: `${exportReadyCount} target package(s) are ready.`, target: "export" as const },
  ];
  const firstOpenIndex = rawSteps.findIndex((step) => !step.ready);
  const steps = rawSteps.map((step, index) => ({
    ...step,
    status: step.ready ? "ready" as const : index === firstOpenIndex ? "active" as const : "next" as const,
  }));
  return {
    score: Math.round((rawSteps.filter((step) => step.ready).length / rawSteps.length) * 100),
    currentAction: steps.find((step) => step.status === "active")?.detail || "Export this prompt and proof package.",
    steps,
  };
}

export function buildLearnedStyleGenerator({
  activeProfile,
  briefInput,
  diagnosis,
  improvedPrompt,
  proofAction,
  sourcePrompt,
}: {
  activeProfile: LearningProfile;
  briefInput: LearnerBriefInput;
  diagnosis: LearnerDiagnosis;
  improvedPrompt: string;
  proofAction: LearnerProofAction;
  sourcePrompt: string;
}): LearnedStyleGenerator {
  const source = sourcePrompt.trim() || improvedPrompt.trim();
  const primaryRule = activeProfile.rules[0] || "Use exact implementation-ready website instructions.";
  const strongestSignal = diagnosis.strengths[0] || "Specific stack, media, layout, motion, responsive behavior, and QA.";
  const missingSignal = diagnosis.gaps[0] || "No major missing ingredient detected.";
  const proofLine = proofAction.status === "ready"
    ? "Include proof capture, result feedback, and export packaging as required verification."
    : "Require desktop/mobile screenshots, console check, interaction proof, lint, and build before signoff.";
  const prompt = [
    `Build a high-fidelity ${briefInput.siteType.trim() || activeProfile.label} for ${briefInput.brandName.trim() || "the brand"} using ${briefInput.stack.trim() || "React + TypeScript + Vite + Tailwind CSS"}.`,
    "",
    "Use the learned house style:",
    `- Profile: ${activeProfile.label} (${activeProfile.score}/100, ${activeProfile.examples} examples).`,
    `- Core rule: ${primaryRule}`,
    `- Strongest signal to preserve: ${strongestSignal}`,
    `- Gap to fix before export: ${missingSignal}`,
    "",
    "Implementation requirements:",
    `- Audience: ${briefInput.audience.trim() || "design-conscious builders"}.`,
    `- Visual signature: ${briefInput.visualSignature.trim() || activeProfile.description}.`,
    `- Assets/media: ${briefInput.assets.trim() || "Use exact asset URLs, focal positions, object-fit, and fallbacks."}`,
    `- Motion/state: ${briefInput.motion.trim() || "Describe timing, cleanup, reduced-motion behavior, and interaction state."}`,
    `- Constraints: ${briefInput.constraints.trim() || "No placeholder assets, decorative filler, unrelated sections, or provider keys."}`,
    `- QA: ${briefInput.qa.trim() || proofLine}`,
    "",
    "Reference tone from the current prompt:",
    source ? source.slice(0, 1200) : "No source prompt pasted yet; use the active learning profile only.",
    "",
    "Return one implementation-ready prompt with headings for stack, fonts, colors, media, layout, navigation, content, motion, responsive behavior, constraints, and verification.",
  ].join("\n");
  return {
    ready: Boolean(source || activeProfile.examples),
    headline: `${activeProfile.label} generator`,
    detail: "Creates a fresh prompt from the active profile, current brief, known gaps, and proof expectations.",
    prompt,
    ingredients: [
      { label: "Profile", detail: `${activeProfile.examples} examples / ${activeProfile.score}%` },
      { label: "Preserve", detail: strongestSignal },
      { label: "Fix", detail: missingSignal },
      { label: "Proof", detail: proofAction.missing[0] || "Proof package is ready." },
    ],
  };
}

export function buildLearnerProjectSystem({
  activeProfile,
  projectSpaces,
  savedSessions,
}: {
  activeProfile: LearningProfile;
  projectSpaces: ProjectSpacesReport;
  savedSessions: LearnerSession[];
}): LearnerProjectSystem {
  const rows = projectSpaces.spaces.slice(0, 4).map((space) => ({
    label: space.label,
    count: space.count,
    status: space.isolation,
    detail: space.detail,
  }));
  return {
    score: projectSpaces.score,
    status: projectSpaces.status,
    headline: projectSpaces.status === "ready" ? "Project memory is separated" : projectSpaces.status === "blocked" ? "Project memory needs cleanup" : "Project memory needs review",
    detail: `${activeProfile.label} is active with ${savedSessions.length} saved learner run(s). Keep imports, sessions, proof, and reusable memory in separate spaces.`,
    rows,
    policy: projectSpaces.activePolicy.slice(0, 3),
  };
}

export function buildTrainFocusSummary({
  advancedCount,
  battleReady,
  corpusSafety,
  exportReady,
  proofAction,
  regressionSummary,
}: {
  advancedCount: number;
  battleReady: boolean;
  corpusSafety: LearnerCorpusSafety;
  exportReady: number;
  proofAction: LearnerProofAction;
  regressionSummary: LearnerRegressionSummary;
}): TrainFocusSummary {
  const groups = [
    { label: "Corpus", status: corpusSafety.label === "quarantine" ? "blocked" as const : corpusSafety.label === "review" ? "watch" as const : "ready" as const, detail: corpusSafety.detail, target: "dataset" },
    { label: "Proof", status: proofAction.status === "ready" ? "ready" as const : proofAction.status === "started" ? "watch" as const : "blocked" as const, detail: proofAction.detail, target: "proof" },
    { label: "Battle", status: battleReady ? "ready" as const : "watch" as const, detail: battleReady ? "Prompt variants are ready to compare." : "Add stronger constraints before trusting a winner.", target: "battle-autopilot" },
    { label: "Regression", status: regressionSummary.label === "ready" ? "ready" as const : regressionSummary.label === "blocked" ? "blocked" as const : "watch" as const, detail: regressionSummary.detail, target: "holdout" },
    { label: "Exports", status: exportReady >= 4 ? "ready" as const : "watch" as const, detail: `${exportReady} learner export file(s) are ready.`, target: "packs" },
  ];
  return {
    score: Math.round((groups.filter((group) => group.status === "ready").length / groups.length) * 100),
    headline: "Train is now a short operating cockpit.",
    groups,
    advancedCount,
  };
}

export function buildLearnerCorpusSafety(rows: CorpusReviewRow[]): LearnerCorpusSafety {
  const website = rows.filter((row) => row.decision === "gold" || row.decision === "learn").length;
  const maybe = rows.filter((row) => row.decision === "review").length;
  const quarantine = rows.filter((row) => row.decision === "quarantine").length;
  const label = quarantine > 0 ? "quarantine" : maybe > 0 ? "review" : "clean";
  return {
    label,
    detail:
      label === "clean"
        ? "Visible candidates look safe for website-prompt learning."
        : label === "review"
          ? "Some candidates need a human gold/bad decision before training."
          : "Quarantined candidates should stay out of prompt memory and exports.",
    counts: { website, maybe, quarantine },
    actions: [
      quarantine ? "Keep repo tasks, deploy logs, and likely secrets quarantined." : "Continue importing only high-fidelity website prompts.",
      maybe ? "Review maybe-useful rows before running training export." : "No maybe-useful rows are blocking the learner.",
      website ? "Promote clean website prompts to gold when proof exists." : "Add at least one safe website prompt candidate before batch training.",
    ],
  };
}

export function buildLearnerRegressionSummary(report: HoldoutBenchmarkReport): LearnerRegressionSummary {
  return {
    label: report.status,
    score: report.score,
    detail:
      report.status === "ready"
        ? `${report.lockedCount}/${report.rows.length} holdouts are locked for regression checks.`
        : report.status === "blocked"
          ? "A blocking quality gate is failing; do not promote memory changes yet."
          : `${report.lockedCount}/${report.rows.length} holdouts are locked; keep this report-only until coverage improves.`,
    rows: report.rows.slice(0, 3).map((row) => `${row.title}: ${row.locked ? "locked" : row.missingTraits.slice(0, 2).join(", ") || "needs coverage"}`),
  };
}

export function buildExportDifferentiators(pack: LearnerExportPack): string[] {
  const ready = pack.files.filter((file) => file.ready).length;
  return [
    `Codex: build contract, constraints, and verification ladder.`,
    `Claude: design critique, ambiguity review, and success criteria.`,
    `v0: concise UI-generation prompt with exact composition.`,
    `GPT: rewrite context plus learner memory, scorecard, and proof fields.`,
    `${ready}/${pack.files.length} export files are ready now.`,
  ];
}
