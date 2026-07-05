import { countWords, type OutcomeRating } from "./promptEngine";
import { type ResultGalleryItem, type GeneratedPromptLike } from "./learnerWorkflowNext";
import {
  type CorpusHealthDecision,
  type EvalHistoryRecord,
  type LearnerProofVaultItem,
  type ProjectProofRunRecord,
  type ProjectSnapshot,
  type ProofChecklistItem,
} from "./LearnerWorkflowPanels";

export type GalleryFilter = "all" | "gold" | "watch" | "weak" | "generated" | "proof";

export type GalleryFilterOption = {
  id: GalleryFilter;
  label: string;
  count: number;
};

export type FirstRunStep = {
  id: string;
  label: string;
  detail: string;
  status: "ready" | "active" | "watch";
  cta: string;
};

export type FirstRunGuide = {
  score: number;
  headline: string;
  detail: string;
  steps: FirstRunStep[];
};

export type SurfaceNavCard = {
  id: "create" | "prove" | "train";
  label: string;
  detail: string;
  metric: string;
  status: "ready" | "active" | "watch";
  target: "compose" | "review" | "export";
};

export type ProjectBundle = {
  id: string;
  title: string;
  createdAt: string;
  profileId: string;
  profileLabel: string;
  sourcePrompt: string;
  improvedPrompt: string;
  generatedPrompt?: string;
  projectSnapshot?: ProjectSnapshot;
  proofArtifacts: LearnerProofVaultItem[];
  proofRuns: ProjectProofRunRecord[];
  evalHistory: EvalHistoryRecord[];
  targetExports: string[];
  notes: string[];
};

export type ProjectBundleImportResult =
  | { ok: true; bundle: ProjectBundle }
  | { ok: false; error: string };

export type ProofRepairDraft = {
  ready: boolean;
  headline: string;
  detail: string;
  prompt: string;
  targets: string[];
  source: string;
};

export type RegressionTrendRow = {
  id: string;
  label: string;
  promptScore: number;
  proofScore: number;
  exportReadyCount: number;
  delta: number;
  status: "up" | "flat" | "down";
  detail: string;
};

export type RegressionTrendSummary = {
  average: number;
  latestDelta: number;
  status: "improving" | "steady" | "watch";
  rows: RegressionTrendRow[];
};

export type AccessibilityCheck = {
  id: string;
  label: string;
  ready: boolean;
  detail: string;
  patch: string;
};

export type AccessibilityQaReport = {
  score: number;
  headline: string;
  checks: AccessibilityCheck[];
  lastRunAt?: string;
};

export type EmptyStateCard = {
  id: string;
  label: string;
  detail: string;
  cta: string;
  ready: boolean;
  target: "compose" | "review" | "export";
};

export type MobileConsoleAction = {
  id: string;
  label: string;
  detail: string;
  target: "compose" | "review" | "export";
  ready: boolean;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function includesAny(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

export function buildGalleryFilters(items: ResultGalleryItem[]): GalleryFilterOption[] {
  const proofCount = items.filter((item) => item.kind === "proof" || item.kind === "run" || item.kind === "screenshot").length;
  return [
    { id: "all", label: "All", count: items.length },
    { id: "gold", label: "Gold", count: items.filter((item) => item.status === "gold").length },
    { id: "watch", label: "Watch", count: items.filter((item) => item.status === "watch").length },
    { id: "weak", label: "Weak", count: items.filter((item) => item.status === "weak").length },
    { id: "generated", label: "Generated", count: items.filter((item) => item.kind === "generated").length },
    { id: "proof", label: "Proof", count: proofCount },
  ];
}

export function filterResultGalleryItems(items: ResultGalleryItem[], filter: GalleryFilter) {
  if (filter === "all") return items;
  if (filter === "generated") return items.filter((item) => item.kind === "generated");
  if (filter === "proof") return items.filter((item) => item.kind === "proof" || item.kind === "run" || item.kind === "screenshot");
  return items.filter((item) => item.status === filter);
}

export function buildFirstRunGuide({
  accessibilityScore,
  corpusDecision,
  exportReadyCount,
  exportTargetCount,
  latestGenerated,
  latestProofRun,
  projectBundleCount,
  sourcePrompt,
}: {
  accessibilityScore: number;
  corpusDecision?: CorpusHealthDecision;
  exportReadyCount: number;
  exportTargetCount: number;
  latestGenerated?: GeneratedPromptLike;
  latestProofRun?: ProjectProofRunRecord;
  projectBundleCount: number;
  sourcePrompt: string;
}): FirstRunGuide {
  const sourceReady = countWords(sourcePrompt) >= 35;
  const steps: FirstRunStep[] = [
    {
      id: "source",
      label: "Start",
      detail: sourceReady ? `${countWords(sourcePrompt)} source words are loaded.` : "Start from one excellent prompt or a structured brief.",
      status: sourceReady ? "ready" : "active",
      cta: sourceReady ? "Review source" : "Use starter",
    },
    {
      id: "generate",
      label: "Create",
      detail: latestGenerated ? `${latestGenerated.score}/100 generated prompt saved.` : "Generate one implementation-ready prompt before comparing variants.",
      status: latestGenerated ? "ready" : sourceReady ? "active" : "watch",
      cta: latestGenerated ? "Open prompt" : "Generate",
    },
    {
      id: "prove",
      label: "Prove",
      detail: latestProofRun ? `${latestProofRun.score}/100 proof run exists.` : "Create a proof-run record with build, screenshot, console, and acceptance gates.",
      status: latestProofRun ? "ready" : latestGenerated ? "active" : "watch",
      cta: latestProofRun ? "Review proof" : "Run proof",
    },
    {
      id: "train",
      label: "Train",
      detail: corpusDecision ? `Training label is ${corpusDecision.label}.` : "Label the prompt gold, watch, or quarantine before it influences memory.",
      status: corpusDecision ? "ready" : latestProofRun ? "active" : "watch",
      cta: corpusDecision ? "Inspect label" : "Label corpus",
    },
    {
      id: "ship",
      label: "Ship",
      detail: `${exportReadyCount}/${exportTargetCount} exports ready / ${projectBundleCount} portable bundle(s).`,
      status: exportReadyCount >= Math.min(6, exportTargetCount) && projectBundleCount > 0 ? "ready" : "active",
      cta: "Package",
    },
  ];
  const score = clampScore(
    steps.reduce((total, step) => total + (step.status === "ready" ? 18 : step.status === "active" ? 10 : 4), 0) + accessibilityScore * 0.1,
  );
  return {
    score,
    headline: sourceReady ? "Guided run is ready" : "Start with one excellent prompt",
    detail: sourceReady
      ? "The front door now keeps the first run simple: create, prove, train, and package."
      : "Use the starter path instead of exposing every lab control first.",
    steps,
  };
}

export function buildSurfaceNavCards({
  exportReadyCount,
  generatedCount,
  proofScore,
  proofItems,
  sourcePrompt,
  trainingScore,
}: {
  exportReadyCount: number;
  generatedCount: number;
  proofScore: number;
  proofItems: number;
  sourcePrompt: string;
  trainingScore: number;
}): SurfaceNavCard[] {
  return [
    {
      id: "create",
      label: "Create",
      detail: sourcePrompt ? "Draft and repair the website prompt from learned taste." : "Use the starter or paste a prompt.",
      metric: sourcePrompt ? `${countWords(sourcePrompt)} words` : "empty",
      status: sourcePrompt ? "ready" : "active",
      target: "compose",
    },
    {
      id: "prove",
      label: "Prove",
      detail: proofItems ? "Review screenshots, proof runs, and repair targets." : "Add proof before promoting any result.",
      metric: `${proofScore}/100`,
      status: proofScore >= 75 ? "ready" : proofItems ? "active" : "watch",
      target: "review",
    },
    {
      id: "train",
      label: "Train",
      detail: "Only promote examples that have result evidence and QA language.",
      metric: `${generatedCount}/${exportReadyCount}`,
      status: trainingScore >= 80 ? "ready" : "active",
      target: "export",
    },
  ];
}

export function createProjectBundle({
  evalHistory,
  generatedPrompt,
  improvedPrompt,
  profileId,
  profileLabel,
  projectSnapshot,
  proofArtifacts,
  proofRuns,
  sourcePrompt,
  targetExports,
}: {
  evalHistory: EvalHistoryRecord[];
  generatedPrompt?: string;
  improvedPrompt: string;
  profileId: string;
  profileLabel: string;
  projectSnapshot?: ProjectSnapshot;
  proofArtifacts: LearnerProofVaultItem[];
  proofRuns: ProjectProofRunRecord[];
  sourcePrompt: string;
  targetExports: string[];
}): ProjectBundle {
  const createdAt = new Date().toISOString();
  return {
    id: `project-bundle-${Date.now()}`,
    title: projectSnapshot?.label || `${profileLabel} portable prompt project`,
    createdAt,
    profileId,
    profileLabel,
    sourcePrompt,
    improvedPrompt,
    generatedPrompt,
    projectSnapshot,
    proofArtifacts: proofArtifacts.slice(0, 12),
    proofRuns: proofRuns.slice(0, 8),
    evalHistory: evalHistory.slice(0, 12),
    targetExports,
    notes: [
      "Portable bundle includes prompt source, generated prompt, proof artifacts, proof runs, eval history, and target export names.",
      "Importing this bundle restores the working source prompt and proof vault without touching API keys.",
    ],
  };
}

export function parseProjectBundle(raw: string): ProjectBundleImportResult {
  try {
    const parsed = JSON.parse(raw) as ProjectBundle;
    if (!parsed || typeof parsed !== "object" || typeof parsed.id !== "string") {
      return { ok: false, error: "Bundle JSON is missing an id." };
    }
    if (typeof parsed.sourcePrompt !== "string" && typeof parsed.improvedPrompt !== "string") {
      return { ok: false, error: "Bundle needs sourcePrompt or improvedPrompt text." };
    }
    return {
      ok: true,
      bundle: {
        ...parsed,
        proofArtifacts: Array.isArray(parsed.proofArtifacts) ? parsed.proofArtifacts.slice(0, 12) : [],
        proofRuns: Array.isArray(parsed.proofRuns) ? parsed.proofRuns.slice(0, 8) : [],
        evalHistory: Array.isArray(parsed.evalHistory) ? parsed.evalHistory.slice(0, 12) : [],
        targetExports: Array.isArray(parsed.targetExports) ? parsed.targetExports : [],
        notes: Array.isArray(parsed.notes) ? parsed.notes : [],
      },
    };
  } catch {
    return { ok: false, error: "Could not parse bundle JSON." };
  }
}

export function buildProofRepairDraft({
  currentPrompt,
  gaps,
  latestResult,
  proofRuns,
  proofVault,
}: {
  currentPrompt: string;
  gaps: string[];
  latestResult?: ResultGalleryItem;
  proofRuns: ProjectProofRunRecord[];
  proofVault: LearnerProofVaultItem[];
}): ProofRepairDraft {
  const latestVault = proofVault[0];
  const latestRun = proofRuns[0];
  const source = latestResult?.title || latestVault?.title || latestRun?.title || "current project";
  const proofTargets = [
    latestResult?.status === "weak" ? `Repair weak result: ${latestResult.title}` : "",
    latestResult ? `Result detail: ${latestResult.detail}` : "",
    latestVault?.notes ? `Proof note: ${latestVault.notes}` : "",
    latestVault?.screenshotNotes ? `Screenshot note: ${latestVault.screenshotNotes}` : "",
    latestRun ? `Proof run score: ${latestRun.score}/100` : "",
    ...gaps.slice(0, 4),
    "Keep the replacement prompt concise enough for builders to execute.",
    "Require desktop/mobile screenshot proof, console health, keyboard checks, and no horizontal overflow.",
  ].filter(Boolean);
  const ready = Boolean(currentPrompt.trim()) && (Boolean(latestResult) || Boolean(latestVault) || Boolean(latestRun) || gaps.length > 0);
  const prompt = [
    "Create a repaired website-build prompt from the proof evidence below.",
    "",
    `PROOF SOURCE: ${source}`,
    "",
    "CURRENT PROMPT",
    currentPrompt || "No current prompt loaded.",
    "",
    "REPAIR TARGETS",
    proofTargets.map((target) => `- ${target}`).join("\n"),
    "",
    "Return the complete replacement prompt. Preserve exact stack, assets, typography, layout, responsive behavior, interaction states, constraints, and QA gates. Remove vague styling language and call out any missing proof as an explicit acceptance gate.",
  ].join("\n");
  return {
    ready,
    headline: ready ? "Proof can repair the prompt" : "Proof repair is waiting for evidence",
    detail: ready
      ? "Build a replacement prompt from the weakest result, proof notes, and regression gaps."
      : "Save proof, run a proof package, or mark a weak gallery result first.",
    prompt,
    targets: proofTargets.slice(0, 8),
    source,
  };
}

export function buildRegressionTrendSummary({
  evalHistory,
  generatedPrompts,
  proofRuns,
}: {
  evalHistory: EvalHistoryRecord[];
  generatedPrompts: GeneratedPromptLike[];
  proofRuns: ProjectProofRunRecord[];
}): RegressionTrendSummary {
  const rows: RegressionTrendRow[] = evalHistory.slice(0, 10).map((item, index, list) => {
    const next = list[index + 1];
    const currentAverage = Math.round((item.promptScore + item.proofScore) / 2);
    const nextAverage = next ? Math.round((next.promptScore + next.proofScore) / 2) : currentAverage;
    const delta = currentAverage - nextAverage;
    return {
      id: item.id,
      label: item.label,
      promptScore: item.promptScore,
      proofScore: item.proofScore,
      exportReadyCount: item.exportReadyCount,
      delta,
      status: delta > 3 ? "up" : delta < -3 ? "down" : "flat",
      detail: item.detail,
    };
  });
  if (!rows.length) {
    const generated = generatedPrompts[0];
    const proof = proofRuns[0];
    rows.push({
      id: "regression-empty-baseline",
      label: generated?.title || proof?.title || "No regression history yet",
      promptScore: generated?.score || 0,
      proofScore: proof?.score || 0,
      exportReadyCount: 0,
      delta: 0,
      status: "flat",
      detail: "Generate a prompt, run proof, or sync a project to start trend history.",
    });
  }
  const average = clampScore(rows.reduce((total, row) => total + Math.round((row.promptScore + row.proofScore) / 2), 0) / Math.max(1, rows.length));
  const latestDelta = rows[0]?.delta || 0;
  return {
    average,
    latestDelta,
    status: latestDelta > 3 ? "improving" : latestDelta < -3 ? "watch" : "steady",
    rows,
  };
}

export function buildAccessibilityQaReport({
  lastRunAt,
  prompt,
  proofChecklist,
}: {
  lastRunAt?: string;
  prompt: string;
  proofChecklist: ProofChecklistItem[];
}): AccessibilityQaReport {
  const checks: AccessibilityCheck[] = [
    {
      id: "keyboard",
      label: "Keyboard path",
      ready: includesAny(prompt, ["keyboard", "tab order", "focus-visible", "focus state"]),
      detail: "Controls should be reachable by keyboard with visible focus.",
      patch: "Accessibility: verify keyboard tab order, visible focus states, and escape/close behavior for menus and dialogs.",
    },
    {
      id: "aria",
      label: "Accessible names",
      ready: includesAny(prompt, ["aria-label", "accessible name", "screen reader", "aria"]),
      detail: "Icon-only and custom controls need accessible names.",
      patch: "Accessibility: add aria-labels or visible text for icon-only controls, custom toggles, and media buttons.",
    },
    {
      id: "motion",
      label: "Reduced motion",
      ready: includesAny(prompt, ["reduced-motion", "prefers-reduced-motion", "cleanup", "cancel animation"]),
      detail: "Motion-heavy prompts should define reduced-motion and cleanup behavior.",
      patch: "Motion QA: respect prefers-reduced-motion, cancel animation frames/listeners on cleanup, and keep hover/tap states usable without motion.",
    },
    {
      id: "contrast",
      label: "Contrast and text fit",
      ready: includesAny(prompt, ["contrast", "text wrapping", "no overlap", "readable", "fits"]),
      detail: "Text must remain readable and avoid overlap on mobile and desktop.",
      patch: "Visual QA: check contrast, text wrapping, no clipped buttons, no overlapping content, and no horizontal overflow at mobile and desktop widths.",
    },
    {
      id: "proof",
      label: "Rendered proof",
      ready: proofChecklist.filter((item) => item.ready).length >= Math.ceil(proofChecklist.length / 2),
      detail: "Accessibility claims should be tied to screenshots or browser checks.",
      patch: "Verification: include desktop and mobile screenshots plus console health, keyboard focus, and first-viewport checks.",
    },
  ];
  const score = clampScore((checks.filter((check) => check.ready).length / checks.length) * 100);
  return {
    score,
    headline: score >= 80 ? "Accessibility gates are strong" : score >= 50 ? "Accessibility gates need proof" : "Accessibility is under-specified",
    checks,
    lastRunAt,
  };
}

export function buildEmptyStateCards({
  generatedCount,
  proofCount,
  resultCount,
  bundleCount,
}: {
  bundleCount: number;
  generatedCount: number;
  proofCount: number;
  resultCount: number;
}): EmptyStateCard[] {
  return [
    {
      id: "generated",
      label: "No generated prompt",
      detail: generatedCount ? `${generatedCount} generated prompt(s) saved.` : "Create one learned prompt before proof and export.",
      cta: generatedCount ? "Open create" : "Generate prompt",
      ready: generatedCount > 0,
      target: "compose",
    },
    {
      id: "proof",
      label: "No proof evidence",
      detail: proofCount ? `${proofCount} proof item(s) available.` : "Save screenshot notes or run the proof package.",
      cta: proofCount ? "Review proof" : "Add proof",
      ready: proofCount > 0,
      target: "review",
    },
    {
      id: "gallery",
      label: "No gallery result",
      detail: resultCount ? `${resultCount} gallery item(s) ready.` : "Gallery cards appear after generation, proof, or feedback.",
      cta: resultCount ? "Filter gallery" : "Create result",
      ready: resultCount > 0,
      target: "compose",
    },
    {
      id: "bundle",
      label: "No portable bundle",
      detail: bundleCount ? `${bundleCount} bundle(s) saved.` : "Export one restorable JSON bundle before handoff.",
      cta: bundleCount ? "Open bundle" : "Export bundle",
      ready: bundleCount > 0,
      target: "export",
    },
  ];
}

export function buildMobileCommandConsole({
  accessibilityScore,
  bundleCount,
  exportReadyCount,
  generatedCount,
  proofCount,
  promptReady,
}: {
  accessibilityScore: number;
  bundleCount: number;
  exportReadyCount: number;
  generatedCount: number;
  proofCount: number;
  promptReady: boolean;
}): MobileConsoleAction[] {
  return [
    {
      id: "create",
      label: promptReady ? "Edit prompt" : "Start guided",
      detail: generatedCount ? `${generatedCount} generated` : "Use starter or paste one prompt",
      target: "compose",
      ready: promptReady,
    },
    {
      id: "proof",
      label: proofCount ? "Proof review" : "Add proof",
      detail: proofCount ? `${proofCount} proof item(s)` : "Run or save proof",
      target: "review",
      ready: proofCount > 0,
    },
    {
      id: "accessibility",
      label: "QA gates",
      detail: `${accessibilityScore}/100 accessibility`,
      target: "review",
      ready: accessibilityScore >= 70,
    },
    {
      id: "bundle",
      label: "Package",
      detail: `${exportReadyCount} exports / ${bundleCount} bundle(s)`,
      target: "export",
      ready: exportReadyCount >= 4 && bundleCount > 0,
    },
  ];
}

export function ratingFromAccessibilityScore(score: number): OutcomeRating {
  if (score >= 80) return "great";
  if (score >= 55) return "okay";
  return "bad";
}
