import { countWords } from "./promptEngine";
import { type CorpusReviewRow, type LearnerProofItem, type LearningProfile, type TargetExportPreset } from "./learnerProduct";
import {
  type CorpusHealthDecision,
  type EvalHistoryRecord,
  type LearnerProofVaultItem,
  type ProjectProofRunRecord,
  type ProjectSnapshot,
} from "./LearnerWorkflowPanels";

export type GeneratedPromptLike = {
  id: string;
  title: string;
  prompt: string;
  score: number;
  source: string;
  createdAt: string;
};

export type WorkflowMilestone = {
  id: string;
  label: string;
  status: "ready" | "active" | "watch";
  detail: string;
  target: "compose" | "review" | "export";
};

export type ResultGalleryItem = {
  id: string;
  title: string;
  kind: "generated" | "proof" | "screenshot" | "run";
  score: number;
  proof: number;
  status: "gold" | "watch" | "weak";
  detail: string;
  prompt?: string;
  screenshotUrl?: string;
  createdAt?: string;
};

export type CoverageGap = {
  id: string;
  label: string;
  score: number;
  status: "covered" | "thin" | "missing";
  detail: string;
  action: string;
};

export type ExportStudioGroup = {
  id: string;
  label: string;
  detail: string;
  presets: TargetExportPreset[];
};

export type TimelineItem = {
  id: string;
  label: string;
  detail: string;
  kind: "prompt" | "proof" | "export" | "corpus" | "sync" | "profile";
  at: string;
};

export type TasteProfileVersion = {
  id: string;
  label: string;
  profileId: string;
  profileLabel: string;
  createdAt: string;
  score: number;
  promptScore: number;
  proofScore: number;
  seedPrompt: string;
  rules: string[];
};

export type CiProofCard = {
  id: string;
  label: string;
  ready: boolean;
  detail: string;
  href?: string;
};

export type MobileOperatorAction = {
  id: string;
  label: string;
  detail: string;
  target: "compose" | "review" | "export";
  ready: boolean;
};

export function buildWorkflowMilestones({
  corpusDecision,
  exportReadyCount,
  exportTargetCount,
  latestGenerated,
  latestProofRun,
  proofItems,
  sourcePrompt,
}: {
  corpusDecision?: CorpusHealthDecision;
  exportReadyCount: number;
  exportTargetCount: number;
  latestGenerated?: GeneratedPromptLike;
  latestProofRun?: ProjectProofRunRecord;
  proofItems: number;
  sourcePrompt: string;
}): WorkflowMilestone[] {
  const sourceReady = countWords(sourcePrompt) >= 20;
  return [
    {
      id: "paste",
      label: "Paste",
      status: sourceReady ? "ready" : "active",
      detail: sourceReady ? `${countWords(sourcePrompt)} words loaded.` : "Start with one strong website prompt or structured brief.",
      target: "compose",
    },
    {
      id: "learn",
      label: "Learn",
      status: corpusDecision ? "ready" : "active",
      detail: corpusDecision ? `Current source is labeled ${corpusDecision.label}.` : "Label the source gold, watch, or quarantine.",
      target: "compose",
    },
    {
      id: "generate",
      label: "Generate",
      status: latestGenerated ? "ready" : "active",
      detail: latestGenerated ? `${latestGenerated.score}/100 generated prompt saved.` : "Generate a prompt from learned taste.",
      target: "compose",
    },
    {
      id: "prove",
      label: "Prove",
      status: latestProofRun || proofItems ? "ready" : "active",
      detail: latestProofRun ? `${latestProofRun.score}/100 proof run is queued.` : `${proofItems} proof item(s) attached.`,
      target: "review",
    },
    {
      id: "export",
      label: "Export",
      status: exportReadyCount >= Math.min(6, exportTargetCount) ? "ready" : "watch",
      detail: `${exportReadyCount}/${exportTargetCount} target handoffs ready.`,
      target: "export",
    },
  ];
}

export function buildResultGalleryItems({
  generatedPrompts,
  proofGallery,
  proofRuns,
  proofVault,
}: {
  generatedPrompts: GeneratedPromptLike[];
  proofGallery: LearnerProofItem[];
  proofRuns: ProjectProofRunRecord[];
  proofVault: LearnerProofVaultItem[];
}): ResultGalleryItem[] {
  const generated = generatedPrompts.slice(0, 6).map((item) => ({
    id: `generated-${item.id}`,
    title: item.title,
    kind: "generated" as const,
    score: item.score,
    proof: 35,
    status: item.score >= 90 ? "gold" as const : "watch" as const,
    detail: `${item.source} / ${countWords(item.prompt)} words`,
    prompt: item.prompt,
    createdAt: item.createdAt,
  }));
  const vault = proofVault.slice(0, 6).map((item) => ({
    id: `vault-${item.id}`,
    title: item.title,
    kind: "screenshot" as const,
    score: item.rating === "great" ? 96 : item.rating === "okay" ? 76 : item.rating === "bad" ? 35 : 55,
    proof: item.screenshotUrl ? 100 : 60,
    status: item.rating === "great" ? "gold" as const : item.rating === "bad" ? "weak" as const : "watch" as const,
    detail: item.screenshotNotes || item.notes,
    screenshotUrl: item.screenshotUrl,
    createdAt: item.createdAt,
  }));
  const gallery = proofGallery.slice(0, 6).map((item) => ({
    id: `proof-${item.id}`,
    title: item.title,
    kind: "proof" as const,
    score: item.score,
    proof: item.score,
    status: item.score >= 88 ? "gold" as const : item.score >= 62 ? "watch" as const : "weak" as const,
    detail: `${item.kind} / ${item.meta} / ${item.detail}`,
    screenshotUrl: item.url,
  }));
  const runs = proofRuns.slice(0, 4).map((item) => ({
    id: `run-${item.id}`,
    title: item.title,
    kind: "run" as const,
    score: item.score,
    proof: item.score,
    status: item.score >= 85 ? "gold" as const : item.score >= 55 ? "watch" as const : "weak" as const,
    detail: `${item.commands.length} command(s), ${item.checks.filter((check) => check.ready).length}/${item.checks.length} check(s) ready.`,
    createdAt: item.createdAt,
  }));
  return [...generated, ...vault, ...gallery, ...runs]
    .sort((a, b) => b.score + b.proof - (a.score + a.proof))
    .slice(0, 12);
}

export function buildVisualRepairPrompt({
  activeProfile,
  gaps,
  latestResult,
  sourcePrompt,
}: {
  activeProfile: LearningProfile;
  gaps: string[];
  latestResult?: ResultGalleryItem;
  sourcePrompt: string;
}) {
  const repairs = [
    latestResult?.status === "weak" ? "Fix the weakest proof item before promotion." : "",
    ...gaps.slice(0, 4),
    "Verify desktop and mobile first viewports.",
    "Check text wrapping, media rendering, interaction states, console health, and horizontal overflow.",
  ].filter(Boolean);
  const prompt = [
    "Repair this website build prompt using the proven Prompt Atelier style.",
    "",
    "SOURCE PROMPT",
    sourcePrompt || "No source prompt loaded yet.",
    "",
    "REPAIR TARGETS",
    repairs.map((item) => `- ${item}`).join("\n"),
    "",
    `TASTE PROFILE: ${activeProfile.label}`,
    activeProfile.rules.slice(0, 6).map((rule) => `- ${rule}`).join("\n"),
    "",
    "Return a complete replacement prompt with exact stack, assets, layout, motion/state mechanics, responsive behavior, constraints, and QA acceptance gates.",
  ].join("\n");
  return {
    ready: Boolean(sourcePrompt.trim()),
    title: latestResult ? `Repair from ${latestResult.title}` : "Repair prompt from current gaps",
    repairs,
    prompt,
  };
}

export function buildCoverageIntelligence({
  corpusRows,
  sourcePrompt,
  targetPresets,
}: {
  corpusRows: CorpusReviewRow[];
  sourcePrompt: string;
  targetPresets: TargetExportPreset[];
}): CoverageGap[] {
  const corpusText = `${sourcePrompt}\n${corpusRows.map((row) => `${row.title} ${row.cluster} ${row.reasons.join(" ")} ${row.text}`).join("\n")}`.toLowerCase();
  const targetIds = new Set(targetPresets.map((preset) => preset.id));
  const checks = [
    {
      id: "dashboards",
      label: "Dashboard surfaces",
      terms: ["dashboard", "analytics", "table", "chart", "empty state"],
      action: "Add or label dashboard prompts with charts, tables, empty states, and dense responsive UI.",
    },
    {
      id: "auth",
      label: "Signup and auth",
      terms: ["signup", "sign up", "login", "password", "validation"],
      action: "Add registration flows with validation, password states, and mobile form behavior.",
    },
    {
      id: "plain-css",
      label: "Plain CSS range",
      terms: ["plain css", "no tailwind", "vanilla css"],
      action: "Add no-Tailwind examples so the learner can write outside the default stack.",
    },
    {
      id: "accessibility",
      label: "Accessibility proof",
      terms: ["aria", "focus", "keyboard", "reduced-motion", "screen reader"],
      action: "Require keyboard focus, aria labels, reduced motion, and contrast checks more often.",
    },
    {
      id: "target-exports",
      label: "Target exports",
      terms: ["codex", "claude", "v0", "lovable", "cursor", "jsonl"],
      action: "Keep target-specific export language distinct instead of renaming one generic prompt.",
      overrideScore: Math.min(100, targetIds.size * 11),
    },
  ];
  return checks.map((check) => {
    const hits = check.terms.filter((term) => corpusText.includes(term)).length;
    const score = check.overrideScore ?? Math.min(100, Math.round((hits / check.terms.length) * 100));
    return {
      id: check.id,
      label: check.label,
      score,
      status: score >= 70 ? "covered" as const : score >= 35 ? "thin" as const : "missing" as const,
      detail: `${hits}/${check.terms.length} signal(s) present in the active corpus and prompt.`,
      action: check.action,
    };
  });
}

export function buildExportStudioGroups(presets: TargetExportPreset[]): ExportStudioGroup[] {
  const groups: ExportStudioGroup[] = [
    { id: "builders", label: "Builders", detail: "Execution prompts for agents that will change code.", presets: [] },
    { id: "critique", label: "Critique", detail: "Review prompts for model critique, ambiguity checks, and repair.", presets: [] },
    { id: "data", label: "Training data", detail: "Structured rows for import, evaluation, and future tuning.", presets: [] },
  ];
  for (const preset of presets) {
    const group = preset.id === "jsonl" || preset.id === "json" || preset.id === "markdown"
      ? groups[2]
      : preset.id === "claude" || preset.id === "gpt"
        ? groups[1]
        : groups[0];
    group.presets.push(preset);
  }
  return groups;
}

export function buildProjectTimeline({
  corpusDecision,
  evalHistory,
  generatedPrompts,
  projectHistory,
  proofRuns,
  proofVault,
}: {
  corpusDecision?: CorpusHealthDecision;
  evalHistory: EvalHistoryRecord[];
  generatedPrompts: GeneratedPromptLike[];
  projectHistory: ProjectSnapshot[];
  proofRuns: ProjectProofRunRecord[];
  proofVault: LearnerProofVaultItem[];
}): TimelineItem[] {
  const items: TimelineItem[] = [
    ...generatedPrompts.slice(0, 8).map((item) => ({
      id: `generated-${item.id}`,
      label: item.title,
      detail: `${item.score}/100 generated prompt / ${countWords(item.prompt)} words`,
      kind: "prompt" as const,
      at: item.createdAt,
    })),
    ...proofRuns.slice(0, 8).map((item) => ({
      id: `proof-run-${item.id}`,
      label: item.title,
      detail: `${item.score}/100 / ${item.commands.length} command(s)`,
      kind: "proof" as const,
      at: item.createdAt,
    })),
    ...evalHistory.slice(0, 8).map((item) => ({
      id: `eval-${item.id}`,
      label: item.label,
      detail: `${item.promptScore}/100 prompt, ${item.proofScore}/100 proof / ${item.detail}`,
      kind: "sync" as const,
      at: item.createdAt,
    })),
    ...projectHistory.slice(0, 6).map((item) => ({
      id: `project-${item.id}`,
      label: item.label,
      detail: `${item.exportReadyCount ?? 0}/${item.exportPresetCount ?? 0} exports / ${item.proofArtifacts.length} proof item(s)`,
      kind: "export" as const,
      at: item.savedAt,
    })),
    ...proofVault.slice(0, 6).map((item) => ({
      id: `vault-${item.id}`,
      label: item.title,
      detail: `${item.rating} / ${item.screenshotNotes || item.notes}`,
      kind: "proof" as const,
      at: item.createdAt,
    })),
    ...(corpusDecision ? [{
      id: `corpus-${corpusDecision.id}`,
      label: `Corpus marked ${corpusDecision.label}`,
      detail: corpusDecision.detail,
      kind: "corpus" as const,
      at: corpusDecision.createdAt,
    }] : []),
  ];
  return items
    .filter((item) => item.at)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 18);
}

export function createTasteProfileVersion({
  activeProfile,
  promptScore,
  proofScore,
  seedPrompt,
}: {
  activeProfile: LearningProfile;
  promptScore: number;
  proofScore: number;
  seedPrompt: string;
}): TasteProfileVersion {
  return {
    id: `taste-${Date.now()}`,
    label: `${activeProfile.label} v${new Date().toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}`,
    profileId: activeProfile.id,
    profileLabel: activeProfile.label,
    createdAt: new Date().toISOString(),
    score: Math.round((activeProfile.score + promptScore + proofScore) / 3),
    promptScore,
    proofScore,
    seedPrompt,
    rules: activeProfile.rules.slice(0, 8),
  };
}

export function buildCiProofCards(buildStatus: {
  commit?: string;
  deployedAt?: string;
  lastSmoke?: string;
  pagesUrl?: string;
  runAttempt?: string;
  runId?: string;
  workflow?: string;
}): CiProofCard[] {
  return [
    {
      id: "commit",
      label: "Commit proof",
      ready: Boolean(buildStatus.commit),
      detail: buildStatus.commit ? `${buildStatus.commit.slice(0, 7)} is the current build commit.` : "Commit metadata appears after CI or local build injection.",
    },
    {
      id: "actions",
      label: "Actions run",
      ready: Boolean(buildStatus.runId),
      detail: buildStatus.runId ? `${buildStatus.workflow || "workflow"} #${buildStatus.runId}${buildStatus.runAttempt ? `.${buildStatus.runAttempt}` : ""}` : "No GitHub Actions run id in this build.",
      href: buildStatus.runId ? `https://github.com/zakiefer/prompt-atelier/actions/runs/${buildStatus.runId}` : undefined,
    },
    {
      id: "pages",
      label: "Hosted app",
      ready: Boolean(buildStatus.pagesUrl),
      detail: buildStatus.pagesUrl || "Pages URL is not configured in this build.",
      href: buildStatus.pagesUrl,
    },
    {
      id: "smoke",
      label: "Latest smoke",
      ready: /passed|ok|local|pending/i.test(buildStatus.lastSmoke || ""),
      detail: buildStatus.lastSmoke || "Smoke metadata has not been written yet.",
    },
  ];
}

export function buildMobileOperatorActions({
  exportReadyCount,
  generatedCount,
  proofCount,
  promptReady,
}: {
  exportReadyCount: number;
  generatedCount: number;
  proofCount: number;
  promptReady: boolean;
}): MobileOperatorAction[] {
  return [
    {
      id: "compose",
      label: generatedCount ? "Refine generated prompt" : "Start prompt",
      detail: promptReady ? `${generatedCount} generated prompt(s) saved.` : "Paste or generate the first prompt.",
      target: "compose",
      ready: promptReady,
    },
    {
      id: "review",
      label: proofCount ? "Review proof" : "Add proof",
      detail: proofCount ? `${proofCount} proof item(s) attached.` : "Capture screenshot notes or run proof package.",
      target: "review",
      ready: proofCount > 0,
    },
    {
      id: "export",
      label: "Export package",
      detail: `${exportReadyCount} target handoff(s) ready.`,
      target: "export",
      ready: exportReadyCount >= 4,
    },
  ];
}
