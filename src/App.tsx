import { useEffect, useMemo, useState, type ChangeEvent, type Dispatch, type DragEvent, type ReactNode, type SetStateAction } from "react";
import {
  Archive,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Check,
  Clipboard,
  Copy,
  Download,
  FileText,
  Gauge,
  Hammer,
  Lightbulb,
  ListChecks,
  PackageOpen,
  Plus,
  Search,
  Save,
  Sparkles,
  Shuffle,
  SlidersHorizontal,
  Tags,
  Trophy,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import {
  analyzeArchetypeClusters,
  analyzeCorpus,
  analyzeCorpusHealth,
  analyzePrompt,
  auditPromptImportBatch,
  auditVisualPrompt,
  buildCodexSkill,
  buildCorpusCleaningReport,
  buildEvaluationHistoryReport,
  buildExportPresets,
  buildFailureMemory,
  buildLocalEmbeddingIndex,
  buildOutcomeSummary,
  buildPromptPacks,
  buildPromptLineage,
  buildPromptMemoryExport,
  buildPromptBattle,
  buildGoldReviewReport,
  buildGeneratorPresets,
  buildExperimentLeaderboard,
  buildBuildFeedbackReport,
  buildCodexBuildPack,
  buildLearnedGeneratorVariants,
  buildGuidedPromptWizardReport,
  buildHostedSyncReport,
  buildArchetypePromptPacks,
  buildLeakageGuardReport,
  buildPatternDashboard,
  buildProjectExportPack,
  buildPromptCoachReport,
  buildQualityGateReport,
  buildResultGallery,
  buildReusableMemoryPack,
  buildSourceSafetyReport,
  buildVisualRegressionReport,
  answerLearnerQuestion,
  buildRecipePrompt,
  buildRubricNotes,
  buildPromptTournament,
  buildRunnerPlan,
  buildSkillInstallPlan,
  buildStyleGuide,
  buildPromptTemplates,
  calibrateDnaScores,
  categoryLabels,
  curatePromptCorpus,
  compareDatasetVersions,
  comparePromptImprovement,
  compilePromptFromBrief,
  composeInterviewPrompt,
  composeOutcomeAwarePrompt,
  createDatasetVersionSnapshot,
  createBuildQueueJob,
  createBuildRunHandoff,
  countWords,
  detectDuplicatePrompt,
  detectStyleDrift,
  diffPrompts,
  distillGoldenRecipes,
  dnaLabels,
  evaluatePrompt,
  extractReusablePatterns,
  explainDnaScore,
  explainPromptWin,
  exportCorpus,
  exportBuildQueue,
  importCorpus,
  improvePromptWithLearning,
  mixArchetypes,
  mutatePromptVariants,
  parsePromptBatch,
  rankPromptExamples,
  repairPromptFromFailure,
  rewritePrompt,
  searchSimilarPrompts,
  searchVectorPrompts,
  scorePromptDnaV2,
  scoreResultArtifact,
  scorePromptModel,
  scoreScreenshotIssues,
  scoreScreenshotSet,
  slugify,
  titleFromPrompt,
  type ArchetypeMixOptions,
  type ArchetypeCluster,
  type BuildRunRecord,
  type BuildFeedbackReport,
  type BuildRunnerPlan,
  type BuildQueueJob,
  type BuildStatus,
  type CategoryKey,
  type CompiledPrompt,
  type ComposeOptions,
  type CorpusHealth,
  type CorpusCleaningReport,
  type CorpusCurationReport,
  type DatasetVersion,
  type DatasetVersionComparison,
  type DnaCalibrationReport,
  type DnaKey,
  type DnaScoreExplanation,
  type DriftReport,
  type Evaluation,
  type EvaluationHistoryReport,
  type ExportPreset,
  type ExperimentLeaderboardReport,
  type FailureMemoryReport,
  type Feature,
  type InterviewBrief,
  type LocalEmbeddingIndex,
  type LearnerAnswerReport,
  type LearnedGeneratorInput,
  type LearnedGeneratorVariant,
  type LeakageGuardReport,
  type GuidedPromptWizardReport,
  type HostedSyncReport,
  type OutcomeRecord,
  type OutcomeRating,
  type OutcomeSummary,
  type PairwiseReviewRecord,
  type PatternDashboardReport,
  type PatternExtractionReport,
  type PromptPack,
  type PromptAnalysis,
  type PromptBattle,
  type PromptDiff,
  type PromptDnaV2,
  type PromptExample,
  type PromptCompilerInput,
  type PromptImportAudit,
  type PromptMutation,
  type PromptMemoryExport,
  type PromptLineageNode,
  type PromptProfile,
  type PromptRank,
  type PromptTournament,
  type SourceSafetyReport,
  type GoldenRecipe,
  type GeneratorPreset,
  type GoldReviewReport,
  type PromptTemplate,
  type PromptWinExplanationReport,
  type QualityGateReport,
  type QualityRubric,
  type RecipeOptions,
  type ResultScore,
  type ResultGalleryItem,
  type ReusableMemoryPack,
  type ScreenshotQaReport,
  type ScreenshotRecord,
  type SearchResult,
  type ScoreBreakdown,
  type SkillInstallPlan,
  type VectorSearchResult,
  type VisualRegressionReport,
  type VisualQaReport,
  type PromptCoachReport,
  type PromptImprovementComparison,
  type ProjectExportPack,
  type CodexBuildPack,
  type ScreenshotScoringReport,
} from "./promptEngine";
import {
  analyzeScreenshots,
  captureResult,
  evaluateWithModel,
  getApiBase,
  getApiToken,
  getApiCollections,
  getApiEvents,
  getApiHealth,
  getModelSettings,
  getTrainingSnapshot,
  importResult,
  installSkill,
  runQueue,
  runVisualQa,
  setApiBase,
  setApiToken,
  syncCollections,
  type ApiEvent,
  type ApiHealth,
} from "./promptApi";
import { readAllCollections, writeCollection } from "./promptDb";
import { seedPrompts } from "./seedPrompts";

const STORAGE_KEY = "prompt-atelier-user-prompts";
const HISTORY_KEY = "prompt-atelier-version-history";
const OUTCOME_KEY = "prompt-atelier-outcomes";
const SCREENSHOT_KEY = "prompt-atelier-screenshots";
const BUILD_RUN_KEY = "prompt-atelier-build-runs";
const QUEUE_KEY = "prompt-atelier-queue-jobs";
const LINEAGE_KEY = "prompt-atelier-lineage";
const DATASET_VERSION_KEY = "prompt-atelier-dataset-versions";
const CURATION_KEY = "prompt-atelier-curation-decisions";
const MODEL_BATCH_KEY = "prompt-atelier-model-batch-evaluations";
const PAIRWISE_REVIEW_KEY = "prompt-atelier-pairwise-reviews";
const BACKUP_KEY = "prompt-atelier-backup-snapshots";
const ONBOARDING_KEY = "prompt-atelier-onboarding-mode";
const WORKSPACE_KEY = "prompt-atelier-active-workspace";
const CLOSED_LOOP_KEY = "prompt-atelier-closed-loop-runs";
const BENCHMARK_KEY = "prompt-atelier-benchmark-runs";
const CLAUDE_HEALTH_KEY = "prompt-atelier-claude-health-checks";
const PROMPT_COMPARISON_KEY = "prompt-atelier-prompt-comparisons";
const SCREENSHOT_PROMPT_KEY = "prompt-atelier-screenshot-prompt-runs";
const WORKSPACE_PACK_KEY = "prompt-atelier-workspace-pack-runs";
const PROOF_LOOP_KEY = "prompt-atelier-proof-learning-runs";
const SCREENSHOT_JUDGE_KEY = "prompt-atelier-screenshot-judge-runs";
const MUTATION_TOURNAMENT_KEY = "prompt-atelier-mutation-tournament-runs";

const categoryOrder = Object.keys(categoryLabels) as CategoryKey[];
const dnaOrder = Object.keys(dnaLabels) as DnaKey[];

const defaultComposeOptions: ComposeOptions = {
  brief:
    "a polished landing page for a digital product that feels specific, premium, and ready for implementation",
  brandName: "Northstar",
  siteType: "single-page landing hero",
  visualSignature: "fullscreen cinematic video background with glass navigation and one precise interactive detail",
  archetype: "Cinematic Video Hero",
  mood: "premium, cinematic, implementation-first",
  outputFlavor: "Codex-build-ready",
  detailLevel: 8,
  creativity: 7,
  rigor: 8,
  includeAssets: true,
  includeMotion: true,
  includeQA: true,
};

const defaultMixOptions: ArchetypeMixOptions = {
  brandName: "Atelier Atlas",
  siteType: "single-page landing hero",
  archetypes: ["cinematic-video-hero", "liquid-glass-saas"],
  mood: "cinematic, exact, elegant, and implementation-ready",
  constraints: "no decorative blobs, no unlisted UI libraries, preserve exact copy, verify mobile and desktop",
  includeAssets: true,
};

const defaultRecipeOptions: RecipeOptions = {
  industry: "AI design tool",
  stack: "React + TypeScript + Vite + Tailwind CSS",
  layout: "full-viewport hero with a focused product proof surface",
  nav: "responsive navbar with logo, four links, primary CTA, and accessible mobile menu",
  motion: "staggered fade-up, subtle hover scale, and reduced-motion fallback",
  assets: "exact background video or product image URL with object-fit, focal point, z-index, and overlay policy",
  strictness: 8,
  brandName: "PromptForge",
  audience: "designers and builders who want high-fidelity website output",
};

const defaultRubric: QualityRubric = {
  cinematic: 8,
  buildability: 9,
  specificity: 9,
  motion: 8,
  restraint: 8,
  accessibility: 7,
};

const defaultInterviewBrief: InterviewBrief = {
  brandName: "Lumora",
  siteType: "full-screen landing hero",
  audience: "creative operators choosing a premium AI product",
  goal: "make the product feel specific, visually memorable, and build-ready",
  visualDirection: "cinematic first viewport, exact typography, real asset slots, restrained motion",
  assets: "background video URL, product UI screenshot, and logo SVG slots",
  stack: "React + TypeScript + Vite + Tailwind CSS + lucide-react",
  mustHaves: "responsive navbar\nhero headline and CTA\nexact fonts and colors\nmobile menu\nQA checklist",
  noGos: "no decorative blobs\nno generic stock imagery\nno unlisted UI libraries\nno vague marketing filler",
  tone: "premium, precise, cinematic, and practical",
};

const defaultCompilerInput: PromptCompilerInput = {
  roughIdea: "a cinematic website hero for an AI product that feels premium, exact, and easy to build",
  brandName: "SignalForge",
  siteType: "single-page landing hero",
  audience: "founders and builders comparing high-end AI tools",
  visualDirection: "fullscreen visual layer, precise typography, restrained glass controls, and one memorable proof surface",
  stack: "React + TypeScript + Vite + Tailwind CSS + lucide-react",
  assets: "use exact URLs when available; otherwise create named video, logo, and product screenshot slots",
  constraints: "no vague marketing filler, no unlisted UI libraries, no decorative blobs, verify mobile and desktop",
};

const defaultGeneratorInput: LearnedGeneratorInput = {
  brandName: "Northstar",
  industry: "AI design platform",
  audience: "founders, designers, and coding agents evaluating premium website prompts",
  goal: "generate a prompt that reliably builds into an inspectable, high-fidelity first viewport",
  stack: "React + TypeScript + Vite + Tailwind CSS + lucide-react",
  siteType: "single-page landing hero",
  vibe: "cinematic, exact, polished, restrained, product-specific",
  visualStyle: "cinematic video background, exact typography, product proof surface, restrained glass controls",
  assets: "exact CloudFront video URL, logo SVG, and desktop/mobile screenshot verification",
  constraints: "no decorative blobs, no placeholder assets, no unlisted UI libraries, no text overlap",
  outputTarget: "Codex build prompt",
  strictness: 9,
};

const ratingOptions = ["unrated", "great", "okay", "bad"] as const;
const statusOptions = ["unrated", "gold", "good", "experimental", "avoid"] as const;
const buildStatusOptions = ["planned", "running", "passed", "failed", "needs-review"] as const;

function readStoredPrompts() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PromptExample[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.text && item?.title) : [];
  } catch {
    return [];
  }
}

function readStoredHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PromptVersion[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.text && item?.title).slice(0, 80) : [];
  } catch {
    return [];
  }
}

function readStoredOutcomes() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(OUTCOME_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OutcomeRecord[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.promptId && item?.title) : [];
  } catch {
    return [];
  }
}

function readStoredScreenshots() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SCREENSHOT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScreenshotRecord[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.url && item?.promptId) : [];
  } catch {
    return [];
  }
}

function readStoredBuildRuns() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BUILD_RUN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BuildRunRecord[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.promptId && item?.promptText).slice(0, 80) : [];
  } catch {
    return [];
  }
}

function readStoredQueueJobs() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BuildQueueJob[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.promptId && item?.promptText).slice(0, 100) : [];
  } catch {
    return [];
  }
}

function readStoredLineage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LINEAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PromptLineageNode[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.title).slice(0, 160) : [];
  } catch {
    return [];
  }
}

function readStoredDatasetVersions() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DATASET_VERSION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DatasetVersion[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.label).slice(0, 20) : [];
  } catch {
    return [];
  }
}

function readStoredCurationDecisions(): Record<string, CurationDecision> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CURATION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, CurationDecision>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readStoredModelBatchEvaluations() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MODEL_BATCH_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ModelBatchEvaluation[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.promptId && item?.title).slice(0, 200) : [];
  } catch {
    return [];
  }
}

function readStoredPairwiseReviews() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PAIRWISE_REVIEW_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PairwiseReviewRecord[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.leftId && item?.rightId && item?.winnerId).slice(0, 200) : [];
  } catch {
    return [];
  }
}

function readStoredBackupSnapshots() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BACKUP_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TrainingBackupSnapshot[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.payload).slice(0, 8) : [];
  } catch {
    return [];
  }
}

function readStoredClosedLoopRuns() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CLOSED_LOOP_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ClosedLoopRun[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.winnerPrompt).slice(0, 40) : [];
  } catch {
    return [];
  }
}

function readStoredBenchmarkRuns() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BENCHMARK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BenchmarkRun[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && Array.isArray(item.rows)).slice(0, 20) : [];
  } catch {
    return [];
  }
}

function readStoredClaudeHealthChecks() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CLAUDE_HEALTH_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HostedClaudeHealthCheck[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.createdAt).slice(0, 20) : [];
  } catch {
    return [];
  }
}

function readStoredPromptComparisons() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROMPT_COMPARISON_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PromptComparisonRun[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.leftTitle && item?.rightTitle).slice(0, 40) : [];
  } catch {
    return [];
  }
}

function readStoredScreenshotPromptRuns() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SCREENSHOT_PROMPT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScreenshotPromptRun[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.prompt).slice(0, 40) : [];
  } catch {
    return [];
  }
}

function readStoredWorkspacePackRuns() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WORKSPACE_PACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WorkspacePackRun[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && Array.isArray(item.packs)).slice(0, 20) : [];
  } catch {
    return [];
  }
}

function readStoredProofLearningRuns() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROOF_LOOP_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProofLearningRun[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.promptId).slice(0, 40) : [];
  } catch {
    return [];
  }
}

function readStoredScreenshotJudgeRuns() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SCREENSHOT_JUDGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScreenshotJudgeRun[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.promptId).slice(0, 40) : [];
  } catch {
    return [];
  }
}

function readStoredMutationTournamentRuns() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MUTATION_TOURNAMENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MutationTournamentRun[];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.winnerTitle).slice(0, 40) : [];
  } catch {
    return [];
  }
}

function readStoredOnboardingMode(): OnboardingMode {
  if (typeof window === "undefined") return "blank";
  const value = window.localStorage.getItem(ONBOARDING_KEY);
  return value === "demo" || value === "blank" || value === "upload" || value === "trained" ? value : "blank";
}

function readStoredWorkspace(): WorkspaceKey {
  if (typeof window === "undefined") return "all";
  const value = window.localStorage.getItem(WORKSPACE_KEY);
  return isWorkspaceKey(value) ? value : "all";
}

function isWorkspaceKey(value: unknown): value is WorkspaceKey {
  return typeof value === "string" && workspacePresets.some((workspace) => workspace.key === value);
}

function downloadText(filename: string, text: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function scoreTone(score: number) {
  if (score >= 72) return "strong";
  if (score >= 42) return "mixed";
  return "weak";
}

function addPercent(score: number) {
  return `${Math.max(0, Math.min(100, Math.round(score)))}%`;
}

function normalizeDnaScore(score: number) {
  return Math.min(100, Math.round(55 + score * 0.625));
}

function makePrompt(text: string): PromptExample {
  const normalized = text.trim();
  const idBase = slugify(titleFromPrompt(normalized, "user prompt"));
  return {
    id: `user-${idBase || "prompt"}-${Date.now()}`,
    title: titleFromPrompt(normalized, "User prompt"),
    text: normalized,
    source: "user",
    createdAt: new Date().toISOString(),
  };
}

type TabKey = "learn" | "compose" | "critic" | "templates" | "lab" | "train";

type PromptVersion = {
  id: string;
  kind:
    | "generated"
    | "rewrite"
    | "template"
    | "pack"
    | "recipe"
    | "mix"
    | "style-guide"
    | "interview"
    | "merged"
    | "skill"
    | "mutation"
    | "improved"
    | "compiled"
    | "tournament"
    | "build-run";
  title: string;
  text: string;
  createdAt: string;
  score?: number;
};

type ScoreWeights = Record<string, number>;
type CurationDecision = "learn" | "quarantine" | "review";
type OnboardingMode = "demo" | "blank" | "upload" | "trained";
type WorkspaceKey = "all" | "hero" | "saas" | "agency" | "dashboard" | "auth-commerce";

const workspacePresets: {
  key: WorkspaceKey;
  label: string;
  description: string;
  query: string[];
}[] = [
  { key: "all", label: "All prompts", description: "Use the entire curated website corpus.", query: [] },
  { key: "hero", label: "Hero systems", description: "Video, liquid glass, cinematic, and first-viewport prompts.", query: ["hero", "video", "cinematic", "liquid glass", "fullscreen"] },
  { key: "saas", label: "SaaS/product", description: "SaaS, product, dashboard, analytics, and conversion surfaces.", query: ["saas", "product", "dashboard", "analytics", "workflow"] },
  { key: "agency", label: "Agency/portfolio", description: "Creative studio, portfolio, case-study, and editorial prompts.", query: ["agency", "portfolio", "studio", "creative", "case"] },
  { key: "dashboard", label: "Dashboard/tools", description: "Operational interfaces, data products, and tool surfaces.", query: ["dashboard", "data", "tool", "workflow", "automation"] },
  { key: "auth-commerce", label: "Auth/commerce", description: "Signup, commerce, product, form, and conversion prompts.", query: ["signup", "login", "commerce", "product", "form"] },
];

type ClosedLoopRun = {
  id: string;
  createdAt: string;
  sourceTitle: string;
  originalScore: number;
  improvedScore: number;
  winnerTitle: string;
  winnerPrompt: string;
  modelMode: string;
  findings: string[];
  recommendations: string[];
};

type BenchmarkBrief = {
  id: string;
  title: string;
  brandName: string;
  siteType: string;
  audience: string;
  goal: string;
  visualDirection: string;
  stack: string;
  assets: string;
  constraints: string;
};

type BenchmarkRun = {
  id: string;
  createdAt: string;
  suite: string;
  count: number;
  averageScore: number;
  modelMode: string;
  rows: {
    briefId: string;
    title: string;
    promptTitle: string;
    score: number;
    readiness: string;
    findings: string[];
  }[];
};

type HostedClaudeHealthCheck = {
  id: string;
  createdAt: string;
  apiOnline: boolean;
  tokenValid: boolean;
  claudeConfigured: boolean;
  sqliteWritable: boolean;
  modelRouteWorking: boolean;
  modelMode: string;
  modelScore: number;
  apiBase: string;
  sqlitePath: string;
  detail: string[];
};

type PromptComparisonRun = {
  id: string;
  createdAt: string;
  leftId: string;
  rightId: string;
  leftTitle: string;
  rightTitle: string;
  winnerId: string;
  winnerTitle: string;
  modelMode: string;
  score: number;
  findings: string[];
  recommendations: string[];
  hybridPrompt: string;
};

type ScreenshotPromptRun = {
  id: string;
  createdAt: string;
  title: string;
  screenshotTitle: string;
  screenshotKind: "uploaded" | "url" | "notes";
  prompt: string;
  score: number;
  modelMode: string;
  notes: string[];
  imagePreviewUrl?: string;
};

type WorkspacePackRun = {
  id: string;
  createdAt: string;
  title: string;
  packs: {
    key: string;
    label: string;
    count: number;
    markdown: string;
    json: string;
  }[];
};

type ProofLearningRun = {
  id: string;
  createdAt: string;
  promptId: string;
  title: string;
  queueJobId: string;
  buildRunId?: string;
  phase: "queued" | "scored" | "learned";
  promptScore: number;
  resultScore: number;
  visualScore: number;
  dnaScore: number;
  learnedStatus: OutcomeRecord["status"] | "queued";
  screenshotCount: number;
  notes: string[];
};

type ScreenshotJudgeRun = {
  id: string;
  createdAt: string;
  promptId: string;
  title: string;
  modelMode: string;
  score: number;
  verdict: string;
  findings: string[];
  fixes: string[];
  promptPatch: string;
};

type MutationTournamentRun = {
  id: string;
  createdAt: string;
  sourceTitle: string;
  winnerTitle: string;
  winnerPrompt: string;
  winnerScore: number;
  modelMode: string;
  variants: {
    id: string;
    title: string;
    score: number;
    intent: string;
  }[];
  notes: string[];
};

const benchmarkBriefs: BenchmarkBrief[] = [
  {
    id: "cinematic-saas-hero",
    title: "Cinematic SaaS Hero",
    brandName: "Northstar",
    siteType: "single-page SaaS hero",
    audience: "founders evaluating premium software",
    goal: "prove the product is credible in the first viewport",
    visualDirection: "cinematic video background, restrained glass controls, clear product promise",
    stack: "React + TypeScript + Vite + Tailwind CSS",
    assets: "exact looping video URL, logo wordmark, desktop and mobile screenshot QA",
    constraints: "no placeholder assets, no decorative blobs, no text overlap",
  },
  {
    id: "ai-dashboard",
    title: "AI Dashboard Surface",
    brandName: "Metricflow",
    siteType: "analytics dashboard landing page",
    audience: "operations leaders and data teams",
    goal: "show product depth without marketing fluff",
    visualDirection: "dense but calm dashboard proof, neutral palette, readable metrics",
    stack: "React + TypeScript + Tailwind CSS + lucide-react",
    assets: "mock dashboard panels, charts, exact empty/loading/error states",
    constraints: "no oversized hero-only marketing page; prioritize scanability",
  },
  {
    id: "agency-portfolio",
    title: "Agency Portfolio Hero",
    brandName: "Atelier",
    siteType: "creative studio portfolio",
    audience: "brand teams looking for a design partner",
    goal: "feel editorial, premium, and implementation-ready",
    visualDirection: "full-screen video, expressive serif headline, mobile menu, case-study cues",
    stack: "React + TypeScript + Vite + Tailwind CSS",
    assets: "exact video URL, project thumbnails, accessible navigation states",
    constraints: "no generic agency copy; visible first-screen signal of craft",
  },
  {
    id: "signup-flow",
    title: "Conversion Signup Flow",
    brandName: "Aurora",
    siteType: "two-column registration interface",
    audience: "new users onboarding into a premium app",
    goal: "make signup feel trustworthy and fast",
    visualDirection: "video-supported left rail, clean form right rail, progress steps",
    stack: "React + TypeScript + Tailwind CSS + motion/react",
    assets: "background video, social icons, password visibility toggle",
    constraints: "no external auth wiring; form states must fit on mobile",
  },
  {
    id: "commerce-product",
    title: "Commerce Product Hero",
    brandName: "CozyPaws",
    siteType: "pet commerce hero",
    audience: "mobile shoppers comparing product quality",
    goal: "sell the product with proof, not a landing-page brochure",
    visualDirection: "warm product photography, compact cards, offer and rating proof",
    stack: "React + TypeScript + Vite + Tailwind CSS",
    assets: "product image URL, price/rating chips, responsive cart CTA",
    constraints: "avoid one-note beige palette and generic stock placeholders",
  },
  {
    id: "fintech-trust",
    title: "Fintech Trust Hero",
    brandName: "Harbor",
    siteType: "stablecoin product landing page",
    audience: "finance operators and technical buyers",
    goal: "communicate trust, compliance, and product clarity",
    visualDirection: "quiet fintech layout, proof badges, card/account visual",
    stack: "React + TypeScript + Tailwind CSS",
    assets: "logo, product mock, compliance badges, motion states",
    constraints: "no hype crypto language; accessibility and contrast required",
  },
  {
    id: "wellness-video",
    title: "Wellness Video Hero",
    brandName: "Aurai",
    siteType: "AI wellness companion hero",
    audience: "people seeking calm support",
    goal: "feel personal, private, and safe",
    visualDirection: "fullscreen video without dark overlay, glass email capture, feature pills",
    stack: "React + TypeScript + Tailwind CSS + lucide-react",
    assets: "exact video URL, custom SVG logo, email form states",
    constraints: "no clinical overclaiming; protect mobile readability",
  },
  {
    id: "education-platform",
    title: "Education Platform Hero",
    brandName: "DesignPro",
    siteType: "product design education landing page",
    audience: "emerging designers choosing a cohort",
    goal: "make the program feel selective and career-ready",
    visualDirection: "dark video hero, shiny headline treatment, cohort proof stats",
    stack: "React + TypeScript + Tailwind CSS + Framer Motion",
    assets: "exact video URL, animated gradient headline, application CTA",
    constraints: "motion must be purposeful and responsive",
  },
  {
    id: "feature-section",
    title: "Core Feature Cards",
    brandName: "Viktor",
    siteType: "three-card marketing feature section",
    audience: "builders evaluating an image-generation tool",
    goal: "show concrete product capabilities in one section",
    visualDirection: "gradient cards, exact SVG/image assets, no animation",
    stack: "React + TypeScript + plain CSS or Tailwind CSS",
    assets: "network SVG, folder SVG, cursor icon, search icon",
    constraints: "static component, no hover behavior, exact card dimensions",
  },
  {
    id: "error-page",
    title: "404 Hero Page",
    brandName: "Wayfinder",
    siteType: "full-viewport error page",
    audience: "users who hit a missing route",
    goal: "recover gracefully with a polished empty state",
    visualDirection: "minimal full-screen layout, useful navigation, subtle motion",
    stack: "React + TypeScript + Tailwind CSS",
    assets: "brand mark, background visual, home/search actions",
    constraints: "100vh no scroll, accessible focus states, no dead CTAs",
  },
];

function topFeatureLabels(features: Feature[] | undefined, fallback: string[], limit = 6) {
  const labels = (features ?? []).map((feature) => feature.label).filter(Boolean).slice(0, limit);
  return labels.length ? labels : fallback;
}

function buildPromptQualityRecipeText(profile: PromptProfile, health: CorpusHealth, patternExtraction: PatternExtractionReport) {
  const stacks = topFeatureLabels(profile.features.stack, ["React + TypeScript + Vite + Tailwind CSS"]);
  const assets = topFeatureLabels(profile.features.assets, ["exact video/image URL", "logo asset", "desktop/mobile screenshots"]);
  const typography = topFeatureLabels(profile.features.typography, ["Inter", "Instrument Serif"]);
  const colors = topFeatureLabels(profile.features.color, ["hex/HSL tokens", "foreground/background variables"]);
  const layout = topFeatureLabels(profile.features.layout, ["layer order", "z-index", "responsive grid"]);
  const motion = topFeatureLabels(profile.features.motion, ["staggered reveal", "requestAnimationFrame loop"]);
  const patterns = patternExtraction.blocks.slice(0, 4).map((block) => `- ${block.label}: ${block.promptPatch}`);
  return [
    "# Great Website Prompt Recipe",
    "",
    "## Stack",
    `Use an exact build target and dependency boundary. Current corpus defaults: ${stacks.join(", ")}.`,
    "",
    "## Fonts",
    `Name import method, weights, CSS variables/Tailwind extension, and UI usage. Frequent signals: ${typography.join(", ")}.`,
    "",
    "## Color System",
    `Use real values and tokens for background, foreground, muted text, borders, surfaces, and hovers. Frequent signals: ${colors.join(", ")}.`,
    "",
    "## Assets",
    `Use exact URLs or named generated asset slots. Include object-fit, focal point, preload/lazy behavior, and overlay rules. Frequent signals: ${assets.join(", ")}.`,
    "",
    "## Layout",
    `Describe section anatomy, layer order, z-index, spacing, max widths, alignment, and responsive breakpoints. Frequent signals: ${layout.join(", ")}.`,
    "",
    "## Navigation And Controls",
    "Specify desktop nav, mobile menu, CTA states, focus states, aria labels, disabled/loading states, and icon library.",
    "",
    "## Motion",
    `Describe timing, delays, easing, state machines, cleanup, and reduced-motion behavior. Frequent signals: ${motion.join(", ")}.`,
    "",
    "## Constraints",
    "State no-go rules explicitly: no generic stock, no unlisted libraries, no decorative filler, no text overlap, no missing mobile behavior.",
    "",
    "## QA",
    "Require desktop and mobile screenshots, console/network checks, media-render checks, text-fit/overflow checks, and a build command.",
    "",
    "## Learned Pattern Patches",
    patterns.length ? patterns.join("\n") : "- Add gold labels and screenshots to strengthen recipe patches.",
    "",
    "## Current Corpus Gaps To Cover",
    health.gaps.map((gap) => `- ${gap}`).join("\n") || "- Keep balancing archetypes and visual systems.",
  ].join("\n");
}

function buildCorpusQualityCards(examples: PromptExample[], clusters: ArchetypeCluster[], profile: PromptProfile, screenshots: ScreenshotRecord[]) {
  const lowerCorpus = examples.map((example) => `${example.title}\n${example.text}`.toLowerCase()).join("\n");
  const count = (pattern: RegExp) => (lowerCorpus.match(pattern) || []).length;
  const videoHeroes = count(/\b(video background|fullscreen video|looping background video|<video)\b/g);
  const plainCss = count(/\bplain css|no tailwind|vanilla css|css only\b/g);
  const accessibility = count(/\baria-|accessibility|focus state|keyboard|reduced-motion|alt text\b/g);
  const qa = profile.categoryScores.qa;
  const paletteMap = new Map<string, number>();
  const layoutMap = new Map<string, number>();
  for (const example of examples) {
    const analysis = analyzePrompt(example.text);
    for (const color of analysis.colors.slice(0, 8)) paletteMap.set(color, (paletteMap.get(color) ?? 0) + 1);
    for (const tag of analysis.tags) {
      if (/hero|dashboard|signup|portfolio|feature|commerce|marquee|mobile menu|liquid glass|video background/i.test(tag)) {
        layoutMap.set(tag, (layoutMap.get(tag) ?? 0) + 1);
      }
    }
  }
  const topPalette = [...paletteMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topLayouts = [...layoutMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return [
    {
      label: "Similar video heroes",
      score: videoHeroes > examples.length * 0.55 ? 44 : 78,
      status: videoHeroes > examples.length * 0.55 ? "rebalance" : "healthy",
      detail: `${videoHeroes} video-heavy signal(s) across ${examples.length} prompt(s). Add still-image, dashboard, product UI, and static feature examples.`,
    },
    {
      label: "Plain CSS coverage",
      score: plainCss >= 3 ? 82 : 38,
      status: plainCss >= 3 ? "healthy" : "thin",
      detail: `${plainCss} plain/no-Tailwind signal(s). Add a few HTML/CSS or plain-CSS React examples for stylistic range.`,
    },
    {
      label: "QA coverage",
      score: qa,
      status: qa >= 65 ? "healthy" : "thin",
      detail: `Prompt QA category is ${qa}/100. Require build, screenshots, media, console, overflow, and mobile checks more often.`,
    },
    {
      label: "Accessibility language",
      score: accessibility >= examples.length * 0.4 ? 78 : 46,
      status: accessibility >= examples.length * 0.4 ? "healthy" : "thin",
      detail: `${accessibility} accessibility signal(s). Add aria labels, focus states, keyboard behavior, alt text, and reduced-motion instructions.`,
    },
    {
      label: "Overused palettes",
      score: topPalette[0]?.[1] && topPalette[0][1] > examples.length * 0.35 ? 48 : 78,
      status: topPalette.length ? "watch" : "unknown",
      detail: topPalette.length ? topPalette.map(([label, total]) => `${label}: ${total}`).join(", ") : "No dominant explicit palette tokens detected.",
    },
    {
      label: "Layout concentration",
      score: clusters[0]?.count && clusters[0].count > examples.length * 0.55 ? 48 : 76,
      status: clusters[0]?.label ?? "unknown",
      detail: topLayouts.length ? topLayouts.map(([label, total]) => `${label}: ${total}`).join(", ") : "No dominant layout tags detected.",
    },
    {
      label: "Screenshot evidence",
      score: screenshots.length >= Math.min(8, examples.length) ? 82 : 44,
      status: screenshots.length ? "started" : "missing",
      detail: `${screenshots.length} saved screenshot(s). Add desktop/mobile captures to make result learning less speculative.`,
    },
  ];
}

function buildWorkspacePackSnapshot(examples: PromptExample[], outcomes: OutcomeRecord[]) {
  const outcomeMap = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const packSpecs: { key: string; label: string; terms: string[] }[] = [
    { key: "hero", label: "Hero systems", terms: ["hero", "video", "fullscreen", "cinematic", "liquid glass"] },
    { key: "saas", label: "SaaS", terms: ["saas", "product", "platform", "dashboard", "analytics"] },
    { key: "agency", label: "Agency", terms: ["agency", "portfolio", "studio", "creative", "case"] },
    { key: "dashboard", label: "Dashboard", terms: ["dashboard", "data", "analytics", "metrics", "workflow"] },
    { key: "auth", label: "Auth", terms: ["signup", "sign up", "login", "registration", "form"] },
    { key: "ecommerce", label: "Ecommerce", terms: ["commerce", "product", "shop", "cart", "rating", "price"] },
    { key: "feature-section", label: "Feature section", terms: ["feature", "cards", "section", "grid", "marketing"] },
  ];
  return packSpecs.map((spec) => {
    const matches = examples
      .map((example) => {
        const analysis = analyzePrompt(example.text);
        const haystack = `${example.title} ${example.text} ${analysis.tags.join(" ")} ${analysis.archetypes.map((item) => item.label).join(" ")}`.toLowerCase();
        const score = spec.terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
        const outcomeBoost = outcomeMap.get(example.id)?.status === "gold" ? 2 : outcomeMap.get(example.id)?.status === "good" ? 1 : 0;
        return { example, score: score + outcomeBoost };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.example);
    const markdown = [
      `# ${spec.label} Prompt Pack`,
      "",
      `Use these ${matches.length} prompt(s) as the taste reference for ${spec.label.toLowerCase()} builds.`,
      "",
      ...matches.map((example, index) => [`## ${index + 1}. ${example.title}`, "", example.text].join("\n")),
    ].join("\n\n");
    return {
      key: spec.key,
      label: spec.label,
      count: matches.length,
      markdown,
      json: JSON.stringify({ key: spec.key, label: spec.label, prompts: matches }, null, 2),
    };
  });
}

function formatPromptForTarget(prompt: PromptExample | undefined, target: string, memory: PromptMemoryExport, packs: PromptPack[]) {
  const source = prompt?.text || packs[0]?.prompts[0] || memory.markdown;
  if (target === "JSON training dataset") {
    return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), prompt, memory: memory.markdown }, null, 2);
  }
  if (target === "JSONL training data") {
    const rows = [
      {
        messages: [
          { role: "system", content: "Write high-fidelity, build-ready website prompts with exact stack, assets, layout, motion, responsive rules, constraints, and verification." },
          { role: "user", content: prompt ? `Create a prompt like ${prompt.title}.` : "Create a high-quality website prompt." },
          { role: "assistant", content: source },
        ],
        metadata: { source: prompt?.source ?? "memory", title: prompt?.title ?? "memory", exportedAt: new Date().toISOString() },
      },
    ];
    return rows.map((row) => JSON.stringify(row)).join("\n");
  }
  const headers: Record<string, string> = {
    "Codex prompt": "Use this as a Codex implementation task. Build the app, verify locally, attach desktop/mobile screenshots, and report exact files changed.",
    "Claude prompt": "Use this with Claude. Preserve exact implementation details, ask only blocking questions, and return an improved build prompt plus missing-proof checklist.",
    "v0 prompt": "Use this with v0. Return clean React/Tailwind components and preserve asset/layout constraints. Do not add unrelated sections.",
    "Cursor task": "Use this as a Cursor task. Edit the existing app, keep changes scoped, and run lint/build/browser proof.",
    "Markdown prompt pack": "Use this as a portable prompt pack entry with learned memory and acceptance gates.",
  };
  const memoryBlock = memory.sections.slice(0, 4).map((section) => [`## ${section.title}`, ...section.items.slice(0, 6).map((item) => `- ${item}`)].join("\n")).join("\n\n");
  return [
    `# ${target}`,
    "",
    headers[target] ?? "Use this prompt.",
    "",
    "## Source Prompt",
    source,
    "",
    "## Acceptance Gates",
    "- Preserve exact stack, asset URLs, typography, colors, layout, and interaction constraints.",
    "- Verify desktop and mobile screenshots, console health, no horizontal overflow, text fit, and media readiness.",
    "- Report any deviation from the prompt instead of silently improvising.",
    "",
    "## Learned Prompt Memory",
    memoryBlock || "No learned memory exported yet.",
  ].join("\n");
}

function buildGoldenChallengeBoard(runs: BenchmarkRun[]) {
  const latest = runs[0];
  return benchmarkBriefs.map((brief) => {
    const rowHistory = runs.map((run) => run.rows.find((row) => row.briefId === brief.id)).filter(Boolean) as BenchmarkRun["rows"];
    const latestRow = latest?.rows.find((row) => row.briefId === brief.id);
    const bestScore = rowHistory.length ? Math.max(...rowHistory.map((row) => row.score)) : 0;
    const latestScore = latestRow?.score ?? 0;
    return {
      id: brief.id,
      title: brief.title,
      goal: brief.goal,
      siteType: brief.siteType,
      latestScore,
      bestScore,
      status: latestScore >= 82 ? "gold" : latestScore >= 70 ? "good" : latestScore ? "needs work" : "not run",
      finding: latestRow?.findings[0] ?? brief.constraints,
    };
  });
}

type QualityGraderV2 = {
  score: number;
  verdict: "proof-ready" | "nearly-ready" | "needs-detail" | "blocked";
  dimensions: {
    key: string;
    label: string;
    score: number;
    evidence: string[];
    fix: string;
  }[];
  penalties: string[];
  nextActions: string[];
};

function buildQualityGraderV2(
  prompt: PromptExample | undefined,
  dnaV2: PromptDnaV2,
  resultScore: ResultScore,
  screenshotQa: ScreenshotQaReport,
): QualityGraderV2 {
  const text = prompt?.text ?? "";
  const lower = text.toLowerCase();
  const evaluation = evaluatePrompt(text);
  const analysis = analyzePrompt(text);
  const vagueTerms = ["beautiful", "modern", "clean", "premium", "sleek", "nice", "stunning"].filter((term) => lower.includes(term));
  const evidenceFor = (terms: string[], fallback: string) => terms.filter((term) => lower.includes(term)).slice(0, 6).length ? terms.filter((term) => lower.includes(term)).slice(0, 6) : [fallback];
  const urlCount = (text.match(/https?:\/\/\S+/g) || []).length;
  const exactness = Math.min(100, Math.round((evaluation.categoryScores.constraints + evaluation.categoryScores.layout + evaluation.categoryScores.color) / 3 + Math.min(18, urlCount * 3)));
  const dimensions = [
    {
      key: "exactness",
      label: "Exactness",
      score: exactness,
      evidence: [
        `${countWords(text)} words`,
        `${urlCount} exact URL(s)`,
        `${analysis.colors.length} color value(s)`,
        ...evidenceFor(["exact", "specific", "must", "do not", "no ", "only"], "Few explicit boundaries detected."),
      ],
      fix: "Replace taste words with exact copy, asset URLs, dimensions, states, and no-go rules.",
    },
    {
      key: "visual",
      label: "Visual specificity",
      score: Math.round((evaluation.categoryScores.layout + evaluation.categoryScores.typography + evaluation.categoryScores.color) / 3),
      evidence: [...analysis.archetypes.slice(0, 2).map((item) => item.label), ...analysis.fonts.slice(0, 3), ...analysis.colors.slice(0, 3)],
      fix: "Name the first-viewport composition, typography roles, colors, and visual signature.",
    },
    {
      key: "implementation",
      label: "Implementation readiness",
      score: Math.round((evaluation.categoryScores.stack + evaluation.categoryScores.state + evaluation.categoryScores.qa) / 3),
      evidence: analysis.stack.length ? analysis.stack.slice(0, 6) : ["No explicit stack or library boundary detected."],
      fix: "Declare framework, dependency boundaries, file structure, interactions, and verification commands.",
    },
    {
      key: "assets",
      label: "Asset clarity",
      score: dnaV2.dimensions.find((item) => item.key === "exactAssets")?.score ?? evaluation.categoryScores.assets,
      evidence: urlCount ? (text.match(/https?:\/\/\S+/g) || []).slice(0, 5) : ["No exact media URL or local asset slot detected."],
      fix: "Add exact image/video/SVG URLs, local asset names, object-fit, focal point, loading, and fallback rules.",
    },
    {
      key: "responsive",
      label: "Responsive behavior",
      score: Math.round((evaluation.categoryScores.responsive + screenshotQa.score) / 2),
      evidence: evidenceFor(["mobile", "desktop", "tablet", "sm:", "md:", "lg:", "breakpoint", "responsive"], "No mobile/desktop behavior found."),
      fix: "Lock mobile navigation, wrapping, breakpoints, stable dimensions, and viewport screenshot checks.",
    },
    {
      key: "proof",
      label: "Proof instructions",
      score: Math.round((evaluation.categoryScores.qa + resultScore.score + screenshotQa.score) / 3),
      evidence: evidenceFor(["screenshot", "verify", "lint", "build", "console", "overflow", "text overlap", "qa"], "No explicit proof or QA ladder found."),
      fix: "Require lint/build, browser console checks, desktop/mobile screenshots, media readiness, and no-overflow proof.",
    },
  ].map((dimension) => ({ ...dimension, score: Math.max(0, Math.min(100, dimension.score)), evidence: dimension.evidence.filter(Boolean).slice(0, 6) }));
  const antiVaguePenalty = Math.min(12, vagueTerms.length * 3);
  const score = Math.max(0, Math.round(dimensions.reduce((sum, item) => sum + item.score, 0) / dimensions.length - antiVaguePenalty));
  const verdict = score >= 86 ? "proof-ready" : score >= 74 ? "nearly-ready" : score >= 56 ? "needs-detail" : "blocked";
  const weak = dimensions.filter((item) => item.score < 72).sort((a, b) => a.score - b.score);
  return {
    score,
    verdict,
    dimensions,
    penalties: [
      vagueTerms.length ? `Vague taste terms detected: ${vagueTerms.join(", ")}.` : "",
      urlCount === 0 ? "No exact URL or local asset slot detected." : "",
      evaluation.categoryScores.qa < 60 ? "QA/proof ladder is too thin for reliable build learning." : "",
    ].filter(Boolean),
    nextActions: weak.slice(0, 4).map((item) => item.fix),
  };
}

type ProjectBoundaryReport = {
  activeLabel: string;
  mode: "global" | "isolated";
  inScopeCount: number;
  outOfScopeCount: number;
  reviewedCount: number;
  quarantineCount: number;
  sourceCounts: Record<string, number>;
  warnings: string[];
  outOfScope: PromptExample[];
};

function buildProjectBoundaryReport(
  activeWorkspace: WorkspaceKey,
  activeWorkspacePreset: (typeof workspacePresets)[number],
  examples: PromptExample[],
  workspaceExamples: PromptExample[],
  curationReport: CorpusCurationReport,
): ProjectBoundaryReport {
  const workspaceIds = new Set(workspaceExamples.map((example) => example.id));
  const outOfScope = activeWorkspace === "all" ? [] : examples.filter((example) => !workspaceIds.has(example.id));
  const sourceCounts = examples.reduce<Record<string, number>>((counts, example) => {
    counts[example.source] = (counts[example.source] || 0) + 1;
    return counts;
  }, {});
  const warnings = [
    activeWorkspace === "all" ? "Global workspace mixes every prompt source. Use an isolated workspace before model calibration." : "",
    outOfScope.length ? `${outOfScope.length} prompt(s) do not match ${activeWorkspacePreset.label}. Keep them out of this training pass.` : "",
    curationReport.counts.quarantine ? `${curationReport.counts.quarantine} prompt(s) already marked quarantine.` : "",
  ].filter(Boolean);
  return {
    activeLabel: activeWorkspacePreset.label,
    mode: activeWorkspace === "all" ? "global" : "isolated",
    inScopeCount: workspaceExamples.length,
    outOfScopeCount: outOfScope.length,
    reviewedCount: curationReport.counts.review,
    quarantineCount: curationReport.counts.quarantine,
    sourceCounts,
    warnings,
    outOfScope: outOfScope.slice(0, 8),
  };
}

type BenchmarkRegressionReport = {
  latestAverage: number;
  previousAverage: number;
  delta: number;
  improved: number;
  regressed: number;
  rows: {
    title: string;
    latest: number;
    previous: number;
    delta: number;
    finding: string;
  }[];
};

function buildBenchmarkRegressionReport(runs: BenchmarkRun[]): BenchmarkRegressionReport {
  const latest = runs[0];
  const previous = runs[1];
  const rows = benchmarkBriefs.map((brief) => {
    const latestRow = latest?.rows.find((row) => row.briefId === brief.id);
    const previousRow = previous?.rows.find((row) => row.briefId === brief.id);
    const latestScore = latestRow?.score ?? 0;
    const previousScore = previousRow?.score ?? 0;
    return {
      title: brief.title,
      latest: latestScore,
      previous: previousScore,
      delta: latestScore - previousScore,
      finding: latestRow?.findings[0] ?? brief.constraints,
    };
  });
  return {
    latestAverage: latest?.averageScore ?? 0,
    previousAverage: previous?.averageScore ?? 0,
    delta: (latest?.averageScore ?? 0) - (previous?.averageScore ?? 0),
    improved: rows.filter((row) => row.delta > 0).length,
    regressed: rows.filter((row) => row.delta < 0).length,
    rows,
  };
}

type PromptEvolutionStep = {
  label: string;
  title: string;
  score: number;
  detail: string;
};

function buildPromptEvolutionSteps({
  selectedPrompt,
  closedLoopRuns,
  screenshotJudgeRuns,
  mutationTournamentRuns,
  proofLearningRuns,
  benchmarkRuns,
  history,
}: {
  selectedPrompt?: PromptExample;
  closedLoopRuns: ClosedLoopRun[];
  screenshotJudgeRuns: ScreenshotJudgeRun[];
  mutationTournamentRuns: MutationTournamentRun[];
  proofLearningRuns: ProofLearningRun[];
  benchmarkRuns: BenchmarkRun[];
  history: PromptVersion[];
}): PromptEvolutionStep[] {
  const sourceScore = selectedPrompt ? evaluatePrompt(selectedPrompt.text).score : 0;
  const latestJudge = screenshotJudgeRuns.find((run) => !selectedPrompt || run.promptId === selectedPrompt.id) ?? screenshotJudgeRuns[0];
  const latestProof = proofLearningRuns.find((run) => !selectedPrompt || run.promptId === selectedPrompt.id) ?? proofLearningRuns[0];
  const latestClosedLoop = closedLoopRuns[0];
  const latestTournament = mutationTournamentRuns[0];
  const latestVersion = history[0];
  const latestBenchmark = benchmarkRuns[0];
  return [
    {
      label: "Original",
      title: selectedPrompt?.title ?? "No prompt selected",
      score: sourceScore,
      detail: selectedPrompt ? `${countWords(selectedPrompt.text)} words in source prompt.` : "Select a prompt to see its evolution.",
    },
    {
      label: "Mutation",
      title: latestTournament?.winnerTitle ?? "No tournament winner yet",
      score: latestTournament?.winnerScore ?? 0,
      detail: latestTournament ? latestTournament.notes.join(" ") : "Run a mutation tournament before spending build time.",
    },
    {
      label: "Screenshot judge",
      title: latestJudge?.verdict ?? "No judge run yet",
      score: latestJudge?.score ?? 0,
      detail: latestJudge?.fixes[0] ?? "Attach screenshots or run the screenshot judge to generate repair patches.",
    },
    {
      label: "Closed-loop",
      title: latestClosedLoop?.winnerTitle ?? latestVersion?.title ?? "No saved winner yet",
      score: latestClosedLoop?.improvedScore ?? latestVersion?.score ?? 0,
      detail: latestClosedLoop ? `${latestClosedLoop.originalScore} -> ${latestClosedLoop.improvedScore}.` : "Save generated, improved, or tournament winners to build an evolution trail.",
    },
    {
      label: "Proof",
      title: latestProof?.learnedStatus ?? "No proof run yet",
      score: latestProof ? Math.round((latestProof.promptScore + latestProof.resultScore + latestProof.visualScore + latestProof.dnaScore) / 4) : 0,
      detail: latestProof?.notes[0] ?? "Run proof now to tie prompt quality to build evidence.",
    },
    {
      label: "Benchmark",
      title: latestBenchmark?.suite ?? "No benchmark run yet",
      score: latestBenchmark?.averageScore ?? 0,
      detail: latestBenchmark ? `${latestBenchmark.count} challenge(s), ${latestBenchmark.modelMode}.` : "Run the canonical suite to detect regressions.",
    },
  ];
}

type ModelBatchEvaluation = {
  id: string;
  promptId: string;
  title: string;
  score: number;
  readiness: string;
  mode: string;
  findings: string[];
  createdAt: string;
};

type TrainingBackupSnapshot = {
  id: string;
  label: string;
  createdAt: string;
  summary: string;
  payload: Partial<StoredCollections>;
};

type StoredCollections = {
  userPrompts: PromptExample[];
  history: PromptVersion[];
  outcomes: OutcomeRecord[];
  screenshots: ScreenshotRecord[];
  buildRuns: BuildRunRecord[];
  queueJobs: BuildQueueJob[];
  lineage: PromptLineageNode[];
  datasetVersions: DatasetVersion[];
  curationDecisions: Record<string, CurationDecision>;
  modelBatchEvaluations: ModelBatchEvaluation[];
  pairwiseReviews: PairwiseReviewRecord[];
  backupSnapshots: TrainingBackupSnapshot[];
  activeWorkspace: WorkspaceKey;
  closedLoopRuns: ClosedLoopRun[];
  benchmarkRuns: BenchmarkRun[];
  claudeHealthChecks: HostedClaudeHealthCheck[];
  promptComparisons: PromptComparisonRun[];
  screenshotPromptRuns: ScreenshotPromptRun[];
  workspacePackRuns: WorkspacePackRun[];
  proofLearningRuns: ProofLearningRun[];
  screenshotJudgeRuns: ScreenshotJudgeRun[];
  mutationTournamentRuns: MutationTournamentRun[];
};

export default function App() {
  const [userPrompts, setUserPrompts] = useState<PromptExample[]>(() => readStoredPrompts());
  const [draftPrompt, setDraftPrompt] = useState("");
  const [selectedId, setSelectedId] = useState(seedPrompts[0]?.id ?? "");
  const [tab, setTab] = useState<TabKey>("learn");
  const [composeOptions, setComposeOptions] = useState<ComposeOptions>(defaultComposeOptions);
  const [evaluationText, setEvaluationText] = useState("");
  const [copied, setCopied] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [importNotice, setImportNotice] = useState("");
  const [history, setHistory] = useState<PromptVersion[]>(() => readStoredHistory());
  const [mixOptions, setMixOptions] = useState<ArchetypeMixOptions>(defaultMixOptions);
  const [recipeOptions, setRecipeOptions] = useState<RecipeOptions>(defaultRecipeOptions);
  const [rubric, setRubric] = useState<QualityRubric>(defaultRubric);
  const [attachmentExamples, setAttachmentExamples] = useState<PromptExample[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeRecord[]>(() => readStoredOutcomes());
  const [screenshots, setScreenshots] = useState<ScreenshotRecord[]>(() => readStoredScreenshots());
  const [buildRuns, setBuildRuns] = useState<BuildRunRecord[]>(() => readStoredBuildRuns());
  const [queueJobs, setQueueJobs] = useState<BuildQueueJob[]>(() => readStoredQueueJobs());
  const [lineageNodes, setLineageNodes] = useState<PromptLineageNode[]>(() => readStoredLineage());
  const [curationDecisions, setCurationDecisions] = useState<Record<string, CurationDecision>>(() => readStoredCurationDecisions());
  const [modelBatchEvaluations, setModelBatchEvaluations] = useState<ModelBatchEvaluation[]>(() => readStoredModelBatchEvaluations());
  const [pairwiseReviews, setPairwiseReviews] = useState<PairwiseReviewRecord[]>(() => readStoredPairwiseReviews());
  const [backupSnapshots, setBackupSnapshots] = useState<TrainingBackupSnapshot[]>(() => readStoredBackupSnapshots());
  const [onboardingMode, setOnboardingMode] = useState<OnboardingMode>(() => readStoredOnboardingMode());
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceKey>(() => readStoredWorkspace());
  const [closedLoopRuns, setClosedLoopRuns] = useState<ClosedLoopRun[]>(() => readStoredClosedLoopRuns());
  const [benchmarkRuns, setBenchmarkRuns] = useState<BenchmarkRun[]>(() => readStoredBenchmarkRuns());
  const [claudeHealthChecks, setClaudeHealthChecks] = useState<HostedClaudeHealthCheck[]>(() => readStoredClaudeHealthChecks());
  const [promptComparisons, setPromptComparisons] = useState<PromptComparisonRun[]>(() => readStoredPromptComparisons());
  const [screenshotPromptRuns, setScreenshotPromptRuns] = useState<ScreenshotPromptRun[]>(() => readStoredScreenshotPromptRuns());
  const [workspacePackRuns, setWorkspacePackRuns] = useState<WorkspacePackRun[]>(() => readStoredWorkspacePackRuns());
  const [proofLearningRuns, setProofLearningRuns] = useState<ProofLearningRun[]>(() => readStoredProofLearningRuns());
  const [screenshotJudgeRuns, setScreenshotJudgeRuns] = useState<ScreenshotJudgeRun[]>(() => readStoredScreenshotJudgeRuns());
  const [mutationTournamentRuns, setMutationTournamentRuns] = useState<MutationTournamentRun[]>(() => readStoredMutationTournamentRuns());
  const [dbReady, setDbReady] = useState(false);
  const [dbStatus, setDbStatus] = useState("Loading IndexedDB");
  const [apiHealth, setApiHealth] = useState<ApiHealth | undefined>();
  const [apiNotice, setApiNotice] = useState("API not checked");
  const [apiBaseDraft, setApiBaseDraft] = useState(() => getApiBase());
  const [apiTokenDraft, setApiTokenDraft] = useState(() => getApiToken());
  const [modelEvaluation, setModelEvaluation] = useState<Record<string, unknown> | undefined>();
  const [modelNotice, setModelNotice] = useState("Model endpoint not checked");
  const [modelSettings, setModelSettings] = useState({
    provider: "anthropic",
    endpoint: "https://api.anthropic.com/v1/messages",
    apiKey: "",
    model: "claude-sonnet-5",
    temperature: 0.2,
    agentCommand: "",
    buildCommand: "",
  });
  const [modelEnvStatus, setModelEnvStatus] = useState<Record<string, boolean> | undefined>();
  const [visualAnalysisResult, setVisualAnalysisResult] = useState<Record<string, unknown> | undefined>();
  const [datasetVersions, setDatasetVersions] = useState<DatasetVersion[]>(() => readStoredDatasetVersions());
  const [autoBattleResult, setAutoBattleResult] = useState<Record<string, unknown> | undefined>();
  const [wizardIdea, setWizardIdea] = useState("a premium AI product website hero that should become a gold-standard prompt");
  const [resultImportText, setResultImportText] = useState("");
  const [snapshotImportText, setSnapshotImportText] = useState("");
  const [activeTrainStage, setActiveTrainStage] = useState("Compile");
  const [scoreWeights, setScoreWeights] = useState<ScoreWeights>({
    originality: 18,
    buildability: 24,
    visualTaste: 22,
    exactness: 18,
    mobile: 10,
    outcomes: 28,
  });
  const [semanticQuery, setSemanticQuery] = useState("");
  const [vectorQuery, setVectorQuery] = useState("");
  const [diffLeftId, setDiffLeftId] = useState(seedPrompts[0]?.id ?? "");
  const [diffRightId, setDiffRightId] = useState(seedPrompts[1]?.id ?? seedPrompts[0]?.id ?? "");
  const [qaText, setQaText] = useState("");
  const [interviewBrief, setInterviewBrief] = useState<InterviewBrief>(defaultInterviewBrief);
  const [mutationSource, setMutationSource] = useState("");
  const [improveText, setImproveText] = useState("");
  const [compilerInput, setCompilerInput] = useState<PromptCompilerInput>(defaultCompilerInput);
  const [coachInput, setCoachInput] = useState("");
  const [coachResult, setCoachResult] = useState<Record<string, unknown> | undefined>();
  const [generatorInput, setGeneratorInput] = useState<LearnedGeneratorInput>(defaultGeneratorInput);
  const [learnerQuestion, setLearnerQuestion] = useState("What makes my best website prompts work?");
  const [apiEvents, setApiEvents] = useState<ApiEvent[]>([]);

  const examples = useMemo(() => [...seedPrompts, ...attachmentExamples, ...userPrompts], [attachmentExamples, userPrompts]);
  const activeWorkspacePreset = workspacePresets.find((workspace) => workspace.key === activeWorkspace) ?? workspacePresets[0];
  const workspaceExamples = useMemo(() => {
    if (!activeWorkspacePreset.query.length) return examples;
    const query = activeWorkspacePreset.query.map((item) => item.toLowerCase());
    return examples.filter((example) => {
      const analysis = analyzePrompt(example.text);
      const haystack = `${example.title} ${example.text} ${analysis.tags.join(" ")} ${analysis.archetypes.map((match) => match.label).join(" ")}`.toLowerCase();
      return query.some((term) => haystack.includes(term));
    });
  }, [activeWorkspacePreset, examples]);
  const curationReport = useMemo(() => curatePromptCorpus(workspaceExamples, curationDecisions), [curationDecisions, workspaceExamples]);
  const fullCorpusCurationReport = useMemo(() => curatePromptCorpus(examples, curationDecisions), [curationDecisions, examples]);
  const sourceSafety = useMemo(() => buildSourceSafetyReport(examples, fullCorpusCurationReport), [examples, fullCorpusCurationReport]);
  const leakageGuard = useMemo(() => buildLeakageGuardReport(examples), [examples]);
  const learningExamples = useMemo(() => {
    const learnSet = new Set(curationReport.learnIds);
    const filtered = examples.filter((example) => learnSet.has(example.id));
    return filtered.length ? filtered : examples;
  }, [curationReport.learnIds, examples]);
  const profile = useMemo(() => analyzeCorpus(learningExamples), [learningExamples]);
  const dnaScore = normalizeDnaScore(profile.detailScore);
  const clusters = useMemo(() => analyzeArchetypeClusters(learningExamples), [learningExamples]);
  const health = useMemo(() => analyzeCorpusHealth(learningExamples, clusters, profile), [clusters, learningExamples, profile]);
  const outcomeSummary = useMemo(() => buildOutcomeSummary(outcomes, examples), [examples, outcomes]);
  const templates = useMemo(() => buildPromptTemplates(profile), [profile]);
  const promptPacks = useMemo(() => buildPromptPacks(profile, clusters), [clusters, profile]);
  const styleGuide = useMemo(() => buildStyleGuide(profile, clusters, health), [clusters, health, profile]);
  const codexSkill = useMemo(() => buildCodexSkill(profile, clusters, health, outcomes), [clusters, health, outcomes, profile]);
  const analyzedExamples = useMemo(
    () => examples.map((example) => ({ example, analysis: analyzePrompt(example.text) })),
    [examples],
  );
  const allTags = useMemo(
    () =>
      Array.from(new Set(analyzedExamples.flatMap((item) => item.analysis.tags)))
        .sort((a, b) => a.localeCompare(b))
        .slice(0, 30),
    [analyzedExamples],
  );
  const filteredExamples = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return analyzedExamples.filter(({ analysis, example }) => {
      const matchesTag = !activeTag || analysis.tags.includes(activeTag);
      const matchesQuery =
        !query ||
        `${example.title} ${example.text} ${analysis.tags.join(" ")} ${analysis.archetypes
          .map((match) => match.label)
          .join(" ")}`
          .toLowerCase()
          .includes(query);
      return matchesTag && matchesQuery;
    });
  }, [activeTag, analyzedExamples, searchQuery]);
  const draftAnalysis = useMemo(
    () => (draftPrompt.trim() ? analyzePrompt(draftPrompt, examples) : undefined),
    [draftPrompt, examples],
  );
  const draftBatchCandidates = useMemo(
    () => (draftPrompt.trim() ? parsePromptBatch(draftPrompt, "draft paste").slice(0, 24) : []),
    [draftPrompt],
  );
  const draftImportAudit = useMemo(
    () => auditPromptImportBatch(draftBatchCandidates, examples),
    [draftBatchCandidates, examples],
  );
  const selectedPrompt = examples.find((example) => example.id === selectedId) ?? examples[0];
  const selectedAnalysis = useMemo(
    () => (selectedPrompt ? analyzePrompt(selectedPrompt.text, examples.filter((item) => item.id !== selectedPrompt.id)) : undefined),
    [examples, selectedPrompt],
  );
  const generatedPrompt = useMemo(
    () => composeOutcomeAwarePrompt(profile, composeOptions, outcomes, learningExamples),
    [composeOptions, learningExamples, outcomes, profile],
  );
  const evaluationSource = evaluationText.trim() || generatedPrompt;
  const evaluation = useMemo(() => evaluatePrompt(evaluationSource), [evaluationSource]);
  const rewrittenPrompt = useMemo(() => rewritePrompt(evaluationSource, profile), [evaluationSource, profile]);
  const mixedPrompt = useMemo(() => mixArchetypes(profile, clusters, mixOptions, rubric), [clusters, mixOptions, profile, rubric]);
  const recipePrompt = useMemo(() => buildRecipePrompt(profile, recipeOptions, rubric), [profile, recipeOptions, rubric]);
  const rubricNotes = useMemo(() => buildRubricNotes(rubric), [rubric]);
  const semanticResults = useMemo(() => searchSimilarPrompts(semanticQuery, learningExamples, outcomes), [learningExamples, outcomes, semanticQuery]);
  const diffLeft = examples.find((example) => example.id === diffLeftId) ?? examples[0];
  const diffRight = examples.find((example) => example.id === diffRightId) ?? examples[1] ?? examples[0];
  const promptDiff = useMemo(
    () => (diffLeft && diffRight ? diffPrompts(diffLeft, diffRight) : undefined),
    [diffLeft, diffRight],
  );
  const qaSource = qaText.trim() || generatedPrompt;
  const visualQa = useMemo(() => auditVisualPrompt(qaSource), [qaSource]);
  const driftReport = useMemo(() => detectStyleDrift(qaSource, profile, health, outcomes), [health, outcomes, profile, qaSource]);
  const interviewPrompt = useMemo(
    () => composeInterviewPrompt(profile, interviewBrief, outcomes),
    [interviewBrief, outcomes, profile],
  );
  const selectedScreenshot = useMemo(
    () => screenshots.find((screenshot) => screenshot.promptId === selectedPrompt?.id),
    [screenshots, selectedPrompt],
  );
  const selectedBuildRun = useMemo(
    () => buildRuns.find((run) => run.promptId === selectedPrompt?.id),
    [buildRuns, selectedPrompt],
  );
  const resultScore = useMemo(
    () => scoreResultArtifact(selectedPrompt, selectedScreenshot, selectedBuildRun),
    [selectedBuildRun, selectedPrompt, selectedScreenshot],
  );
  const selectedScreenshots = useMemo(
    () => screenshots.filter((screenshot) => screenshot.promptId === selectedPrompt?.id),
    [screenshots, selectedPrompt],
  );
  const runnerPlan = useMemo(
    () => buildRunnerPlan(selectedPrompt, selectedBuildRun),
    [selectedBuildRun, selectedPrompt],
  );
  const screenshotQa = useMemo(
    () => scoreScreenshotSet(selectedPrompt, selectedScreenshots, selectedBuildRun),
    [selectedBuildRun, selectedPrompt, selectedScreenshots],
  );
  const dnaExplanation = useMemo(
    () => explainDnaScore(selectedPrompt, resultScore, screenshotQa),
    [resultScore, screenshotQa, selectedPrompt],
  );
  const buildFeedback = useMemo(
    () => buildBuildFeedbackReport(selectedPrompt, resultScore, screenshotQa),
    [resultScore, screenshotQa, selectedPrompt],
  );
  const dnaCalibration = useMemo(
    () => calibrateDnaScores(learningExamples, outcomes, buildRuns, screenshots),
    [buildRuns, learningExamples, outcomes, screenshots],
  );
  const corpusCleaning = useMemo(
    () => buildCorpusCleaningReport(learningExamples, outcomes),
    [learningExamples, outcomes],
  );
  const failureMemory = useMemo(
    () => buildFailureMemory(outcomes, buildRuns, screenshots),
    [buildRuns, outcomes, screenshots],
  );
  const mutationSourceText = mutationSource.trim() || selectedPrompt?.text || generatedPrompt;
  const promptMutations = useMemo(
    () => mutatePromptVariants(mutationSourceText, profile, outcomes),
    [mutationSourceText, outcomes, profile],
  );
  const improvedPrompt = useMemo(
    () => improvePromptWithLearning(improveText.trim() || selectedPrompt?.text || generatedPrompt, profile, outcomes, resultScore),
    [generatedPrompt, improveText, outcomes, profile, resultScore, selectedPrompt],
  );
  const compiledPrompt = useMemo(
    () => compilePromptFromBrief(compilerInput, profile, outcomes, resultScore),
    [compilerInput, outcomes, profile, resultScore],
  );
  const tournament = useMemo(
    () => buildPromptTournament(mutationSourceText, profile, outcomes, resultScore),
    [mutationSourceText, outcomes, profile, resultScore],
  );
  const leaderboard = useMemo(() => rankPromptExamples(learningExamples, outcomes), [learningExamples, outcomes]);
  const localIndex = useMemo(() => buildLocalEmbeddingIndex(learningExamples, outcomes), [learningExamples, outcomes]);
  const vectorResults = useMemo(() => searchVectorPrompts(vectorQuery, learningExamples, outcomes), [learningExamples, outcomes, vectorQuery]);
  const skillInstallPlan = useMemo(() => buildSkillInstallPlan(codexSkill), [codexSkill]);
  const scoreBreakdown = useMemo(
    () => scorePromptModel(selectedPrompt, resultScore, screenshotQa, dnaCalibration, failureMemory, scoreWeights),
    [dnaCalibration, failureMemory, resultScore, screenshotQa, scoreWeights, selectedPrompt],
  );
  const dnaV2 = useMemo(() => scorePromptDnaV2(selectedPrompt, resultScore, screenshotQa), [resultScore, screenshotQa, selectedPrompt]);
  const goldenRecipes = useMemo(() => distillGoldenRecipes(learningExamples, outcomes, clusters), [clusters, learningExamples, outcomes]);
  const promptBattle = useMemo(
    () => buildPromptBattle(mutationSourceText, profile, outcomes, resultScore),
    [mutationSourceText, outcomes, profile, resultScore],
  );
  const repairedPrompt = useMemo(
    () => repairPromptFromFailure(improveText.trim() || selectedPrompt?.text || generatedPrompt, profile, failureMemory, resultScore, outcomes),
    [failureMemory, generatedPrompt, improveText, outcomes, profile, resultScore, selectedPrompt],
  );
  const wizardCompiled = useMemo(
    () =>
      compilePromptFromBrief(
        {
          ...compilerInput,
          roughIdea: wizardIdea,
        },
        profile,
        outcomes,
        resultScore,
      ),
    [compilerInput, outcomes, profile, resultScore, wizardIdea],
  );
  const wizardBattle = useMemo(
    () => buildPromptBattle(wizardCompiled.prompt, profile, outcomes, resultScore),
    [outcomes, profile, resultScore, wizardCompiled],
  );
  const promptMemory = useMemo(
    () =>
      buildPromptMemoryExport({
        clusters,
        examples: learningExamples,
        failureMemory,
        health,
        index: localIndex,
        outcomes,
        profile,
        scoreWeights,
      }),
    [clusters, failureMemory, health, learningExamples, localIndex, outcomes, profile, scoreWeights],
  );
  const goldReview = useMemo(
    () =>
      buildGoldReviewReport({
        buildRuns,
        examples,
        leftId: diffLeftId,
        outcomes,
        rightId: diffRightId,
        screenshots,
      }),
    [buildRuns, diffLeftId, diffRightId, examples, outcomes, screenshots],
  );
  const winExplanation = useMemo(
    () => explainPromptWin(diffLeft, diffRight, outcomes, buildRuns, screenshots),
    [buildRuns, diffLeft, diffRight, outcomes, screenshots],
  );
  const qualityGate = useMemo(
    () => buildQualityGateReport(selectedPrompt, resultScore, screenshotQa),
    [resultScore, screenshotQa, selectedPrompt],
  );
  const datasetComparison = useMemo(() => compareDatasetVersions(datasetVersions), [datasetVersions]);
  const generatorPresets = useMemo(
    () => buildGeneratorPresets(profile, clusters, outcomes, resultScore),
    [clusters, outcomes, profile, resultScore],
  );
  const resultGallery = useMemo(
    () => buildResultGallery(examples, buildRuns, screenshots),
    [buildRuns, examples, screenshots],
  );
  const reusableMemoryPack = useMemo(
    () =>
      buildReusableMemoryPack({
        failureMemory,
        generatorPresets,
        goldenRecipes,
        promptMemory,
        qualityGate,
      }),
    [failureMemory, generatorPresets, goldenRecipes, promptMemory, qualityGate],
  );
  const patternDashboard = useMemo(
    () => buildPatternDashboard(learningExamples, outcomes, buildRuns),
    [buildRuns, learningExamples, outcomes],
  );
  const experimentLeaderboard = useMemo(
    () => buildExperimentLeaderboard(learningExamples, outcomes, buildRuns, pairwiseReviews),
    [buildRuns, learningExamples, outcomes, pairwiseReviews],
  );
  const visualRegression = useMemo(
    () => buildVisualRegressionReport(buildRuns, screenshots),
    [buildRuns, screenshots],
  );
  const learnedGeneratorVariants = useMemo(
    () => buildLearnedGeneratorVariants(generatorInput, profile, generatorPresets, outcomes),
    [generatorInput, generatorPresets, outcomes, profile],
  );
  const promptCoach = useMemo(
    () => buildPromptCoachReport(coachInput.trim() || selectedPrompt?.text || generatedPrompt, profile, outcomes),
    [coachInput, generatedPrompt, outcomes, profile, selectedPrompt],
  );
  const projectExportPack = useMemo(
    () =>
      buildProjectExportPack({
        curation: curationReport,
        modelEvaluations: modelBatchEvaluations,
        prompt: selectedPrompt,
        promptMemory,
        qualityGate,
        visualRegression,
      }),
    [curationReport, modelBatchEvaluations, promptMemory, qualityGate, selectedPrompt, visualRegression],
  );
  const derivedLineage = useMemo(
    () => buildPromptLineage(selectedPrompt, history, buildRuns, outcomes, screenshots),
    [buildRuns, history, outcomes, screenshots, selectedPrompt],
  );
  const selectedLineage = useMemo(() => {
    const promptNodes = lineageNodes.filter((node) => !selectedPrompt || node.promptId === selectedPrompt.id);
    const byId = new Map([...derivedLineage, ...promptNodes].map((node) => [node.id, node]));
    return Array.from(byId.values()).sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  }, [derivedLineage, lineageNodes, selectedPrompt]);
  const queueExport = useMemo(() => exportBuildQueue(queueJobs), [queueJobs]);
  const codexBuildPack = useMemo(
    () =>
      buildCodexBuildPack({
        prompt: selectedPrompt,
        promptMemory,
        qualityGate,
        queueExport,
        visualRegression,
      }),
    [promptMemory, qualityGate, queueExport, selectedPrompt, visualRegression],
  );
  const exportPresets = useMemo(
    () => buildExportPresets({ codexBuildPack, prompt: selectedPrompt, promptMemory, qualityGate, visualRegression }),
    [codexBuildPack, promptMemory, qualityGate, selectedPrompt, visualRegression],
  );
  const evaluationHistory = useMemo(
    () => buildEvaluationHistoryReport({ buildRuns, modelEvaluations: modelBatchEvaluations, outcomes, pairwiseReviews, screenshots }),
    [buildRuns, modelBatchEvaluations, outcomes, pairwiseReviews, screenshots],
  );
  const guidedWizard = useMemo(
    () => buildGuidedPromptWizardReport(generatorInput, profile, generatorPresets, outcomes),
    [generatorInput, generatorPresets, outcomes, profile],
  );
  const patternExtraction = useMemo(
    () => extractReusablePatterns(learningExamples, outcomes, clusters),
    [clusters, learningExamples, outcomes],
  );
  const promptQualityRecipe = useMemo(
    () => buildPromptQualityRecipeText(profile, health, patternExtraction),
    [health, patternExtraction, profile],
  );
  const corpusQualityCards = useMemo(
    () => buildCorpusQualityCards(learningExamples, clusters, profile, screenshots),
    [clusters, learningExamples, profile, screenshots],
  );
  const workspacePackSnapshot = useMemo(
    () => buildWorkspacePackSnapshot(learningExamples, outcomes),
    [learningExamples, outcomes],
  );
  const goldenChallengeBoard = useMemo(() => buildGoldenChallengeBoard(benchmarkRuns), [benchmarkRuns]);
  const qualityGraderV2 = useMemo(
    () => buildQualityGraderV2(selectedPrompt, dnaV2, resultScore, screenshotQa),
    [dnaV2, resultScore, screenshotQa, selectedPrompt],
  );
  const projectBoundaryReport = useMemo(
    () => buildProjectBoundaryReport(activeWorkspace, activeWorkspacePreset, examples, workspaceExamples, curationReport),
    [activeWorkspace, activeWorkspacePreset, curationReport, examples, workspaceExamples],
  );
  const benchmarkRegression = useMemo(() => buildBenchmarkRegressionReport(benchmarkRuns), [benchmarkRuns]);
  const promptEvolutionSteps = useMemo(
    () =>
      buildPromptEvolutionSteps({
        selectedPrompt,
        closedLoopRuns,
        screenshotJudgeRuns,
        mutationTournamentRuns,
        proofLearningRuns,
        benchmarkRuns,
        history,
      }),
    [benchmarkRuns, closedLoopRuns, history, mutationTournamentRuns, proofLearningRuns, screenshotJudgeRuns, selectedPrompt],
  );
  const rewriteComparison = useMemo(
    () => comparePromptImprovement(coachInput.trim() || selectedPrompt?.text || generatedPrompt, profile, outcomes, resultScore),
    [coachInput, generatedPrompt, outcomes, profile, resultScore, selectedPrompt],
  );
  const archetypePromptPacks = useMemo(
    () => buildArchetypePromptPacks(learningExamples, outcomes, clusters),
    [clusters, learningExamples, outcomes],
  );
  const hostedSyncReport = useMemo(
    () =>
      buildHostedSyncReport({
        apiOnline: Boolean(apiHealth?.ok),
        authRequired: apiHealth?.authRequired,
        apiBase: apiBaseDraft || getApiBase(),
        counts: {
          prompts: examples.length,
          labels: outcomes.length,
          runs: buildRuns.length,
          screenshots: screenshots.length,
          events: apiEvents.length,
        },
      }),
    [
      apiBaseDraft,
      apiEvents.length,
      apiHealth?.authRequired,
      apiHealth?.ok,
      buildRuns.length,
      examples.length,
      outcomes.length,
      screenshots.length,
    ],
  );
  const learnerAnswer = useMemo(
    () => answerLearnerQuestion(learnerQuestion, profile, patternExtraction, archetypePromptPacks),
    [archetypePromptPacks, learnerQuestion, patternExtraction, profile],
  );

  useEffect(() => {
    let cancelled = false;

    const fallback: StoredCollections = {
      userPrompts,
      history,
      outcomes,
      screenshots,
      buildRuns,
      queueJobs,
      lineage: lineageNodes,
      datasetVersions,
      curationDecisions,
      modelBatchEvaluations,
      pairwiseReviews,
      backupSnapshots,
      activeWorkspace,
      closedLoopRuns,
      benchmarkRuns,
      claudeHealthChecks,
      promptComparisons,
      screenshotPromptRuns,
      workspacePackRuns,
      proofLearningRuns,
      screenshotJudgeRuns,
      mutationTournamentRuns,
    };

    const applyCollections = (stored: Partial<Record<keyof StoredCollections, unknown>>) => {
      if (cancelled) return;
      if (Array.isArray(stored.userPrompts)) setUserPrompts(stored.userPrompts as PromptExample[]);
      if (Array.isArray(stored.history)) setHistory(stored.history as PromptVersion[]);
      if (Array.isArray(stored.outcomes)) setOutcomes(stored.outcomes as OutcomeRecord[]);
      if (Array.isArray(stored.screenshots)) setScreenshots(stored.screenshots as ScreenshotRecord[]);
      if (Array.isArray(stored.buildRuns)) setBuildRuns(stored.buildRuns as BuildRunRecord[]);
      if (Array.isArray(stored.queueJobs)) setQueueJobs(stored.queueJobs as BuildQueueJob[]);
      if (Array.isArray(stored.lineage)) setLineageNodes(stored.lineage as PromptLineageNode[]);
      if (Array.isArray(stored.datasetVersions)) setDatasetVersions((stored.datasetVersions as DatasetVersion[]).slice(0, 20));
      if (stored.curationDecisions && typeof stored.curationDecisions === "object" && !Array.isArray(stored.curationDecisions)) {
        setCurationDecisions(stored.curationDecisions as Record<string, CurationDecision>);
      }
      if (Array.isArray(stored.modelBatchEvaluations)) setModelBatchEvaluations((stored.modelBatchEvaluations as ModelBatchEvaluation[]).slice(0, 200));
      if (Array.isArray(stored.pairwiseReviews)) setPairwiseReviews((stored.pairwiseReviews as PairwiseReviewRecord[]).slice(0, 200));
      if (Array.isArray(stored.backupSnapshots)) setBackupSnapshots((stored.backupSnapshots as TrainingBackupSnapshot[]).slice(0, 8));
      if (isWorkspaceKey(stored.activeWorkspace)) setActiveWorkspace(stored.activeWorkspace);
      if (Array.isArray(stored.closedLoopRuns)) setClosedLoopRuns((stored.closedLoopRuns as ClosedLoopRun[]).slice(0, 40));
      if (Array.isArray(stored.benchmarkRuns)) setBenchmarkRuns((stored.benchmarkRuns as BenchmarkRun[]).slice(0, 20));
      if (Array.isArray(stored.claudeHealthChecks)) setClaudeHealthChecks((stored.claudeHealthChecks as HostedClaudeHealthCheck[]).slice(0, 20));
      if (Array.isArray(stored.promptComparisons)) setPromptComparisons((stored.promptComparisons as PromptComparisonRun[]).slice(0, 40));
      if (Array.isArray(stored.screenshotPromptRuns)) setScreenshotPromptRuns((stored.screenshotPromptRuns as ScreenshotPromptRun[]).slice(0, 40));
      if (Array.isArray(stored.workspacePackRuns)) setWorkspacePackRuns((stored.workspacePackRuns as WorkspacePackRun[]).slice(0, 20));
      if (Array.isArray(stored.proofLearningRuns)) setProofLearningRuns((stored.proofLearningRuns as ProofLearningRun[]).slice(0, 40));
      if (Array.isArray(stored.screenshotJudgeRuns)) setScreenshotJudgeRuns((stored.screenshotJudgeRuns as ScreenshotJudgeRun[]).slice(0, 40));
      if (Array.isArray(stored.mutationTournamentRuns)) setMutationTournamentRuns((stored.mutationTournamentRuns as MutationTournamentRun[]).slice(0, 40));
    };

    async function hydrate() {
      try {
        const [healthResult, collectionResult] = await Promise.all([getApiHealth(), getApiCollections()]);
        if (cancelled) return;
        setApiHealth(healthResult);
        const hasSqliteData = Object.values(collectionResult.collections).some((value) => {
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === "string") return value.length > 0;
          return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
        });
        if (hasSqliteData) {
          applyCollections(collectionResult.collections as Partial<Record<keyof StoredCollections, unknown>>);
          setDbReady(true);
          setDbStatus("SQLite source of truth ready");
          setApiNotice(`Loaded from SQLite: ${healthResult.sqlitePath}`);
          return;
        }
        setApiNotice("SQLite online but empty; using browser fallback until first autosync.");
      } catch (error) {
        if (!cancelled) setApiNotice(`API offline; using browser fallback. ${error instanceof Error ? error.message : ""}`.trim());
      }

      const stored = await readAllCollections(fallback);
      applyCollections(stored);
      if (cancelled) return;
      setDbReady(true);
      setDbStatus("IndexedDB fallback ready");
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}attachment-prompts.json`)
      .then((response) => (response.ok ? response.json() : undefined))
      .then((payload: { prompts?: PromptExample[] } | undefined) => {
        if (cancelled || !Array.isArray(payload?.prompts)) return;
        setAttachmentExamples(payload.prompts.filter((prompt) => prompt?.text && prompt?.title));
      })
      .catch(() => {
        if (!cancelled) setAttachmentExamples([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userPrompts));
    void writeCollection("userPrompts", userPrompts);
  }, [dbReady, userPrompts]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    void writeCollection("history", history);
  }, [dbReady, history]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(OUTCOME_KEY, JSON.stringify(outcomes));
    void writeCollection("outcomes", outcomes);
  }, [dbReady, outcomes]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(SCREENSHOT_KEY, JSON.stringify(screenshots));
    void writeCollection("screenshots", screenshots);
  }, [dbReady, screenshots]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(BUILD_RUN_KEY, JSON.stringify(buildRuns));
    void writeCollection("buildRuns", buildRuns);
  }, [buildRuns, dbReady]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queueJobs));
    void writeCollection("queueJobs", queueJobs);
  }, [dbReady, queueJobs]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(LINEAGE_KEY, JSON.stringify(lineageNodes));
    void writeCollection("lineage", lineageNodes);
  }, [dbReady, lineageNodes]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(DATASET_VERSION_KEY, JSON.stringify(datasetVersions));
    void writeCollection("datasetVersions", datasetVersions);
  }, [datasetVersions, dbReady]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(CURATION_KEY, JSON.stringify(curationDecisions));
    void writeCollection("curationDecisions", curationDecisions);
  }, [curationDecisions, dbReady]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(MODEL_BATCH_KEY, JSON.stringify(modelBatchEvaluations));
    void writeCollection("modelBatchEvaluations", modelBatchEvaluations);
  }, [dbReady, modelBatchEvaluations]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(PAIRWISE_REVIEW_KEY, JSON.stringify(pairwiseReviews));
    void writeCollection("pairwiseReviews", pairwiseReviews);
  }, [dbReady, pairwiseReviews]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(BACKUP_KEY, JSON.stringify(backupSnapshots));
    void writeCollection("backupSnapshots", backupSnapshots);
  }, [backupSnapshots, dbReady]);

  useEffect(() => {
    window.localStorage.setItem(ONBOARDING_KEY, onboardingMode);
  }, [onboardingMode]);

  useEffect(() => {
    window.localStorage.setItem(WORKSPACE_KEY, activeWorkspace);
    if (dbReady) void writeCollection("activeWorkspace", activeWorkspace);
  }, [activeWorkspace, dbReady]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(CLOSED_LOOP_KEY, JSON.stringify(closedLoopRuns));
    void writeCollection("closedLoopRuns", closedLoopRuns);
  }, [closedLoopRuns, dbReady]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(BENCHMARK_KEY, JSON.stringify(benchmarkRuns));
    void writeCollection("benchmarkRuns", benchmarkRuns);
  }, [benchmarkRuns, dbReady]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(CLAUDE_HEALTH_KEY, JSON.stringify(claudeHealthChecks));
    void writeCollection("claudeHealthChecks", claudeHealthChecks);
  }, [claudeHealthChecks, dbReady]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(PROMPT_COMPARISON_KEY, JSON.stringify(promptComparisons));
    void writeCollection("promptComparisons", promptComparisons);
  }, [dbReady, promptComparisons]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(SCREENSHOT_PROMPT_KEY, JSON.stringify(screenshotPromptRuns));
    void writeCollection("screenshotPromptRuns", screenshotPromptRuns);
  }, [dbReady, screenshotPromptRuns]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(WORKSPACE_PACK_KEY, JSON.stringify(workspacePackRuns));
    void writeCollection("workspacePackRuns", workspacePackRuns);
  }, [dbReady, workspacePackRuns]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(PROOF_LOOP_KEY, JSON.stringify(proofLearningRuns));
    void writeCollection("proofLearningRuns", proofLearningRuns);
  }, [dbReady, proofLearningRuns]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(SCREENSHOT_JUDGE_KEY, JSON.stringify(screenshotJudgeRuns));
    void writeCollection("screenshotJudgeRuns", screenshotJudgeRuns);
  }, [dbReady, screenshotJudgeRuns]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(MUTATION_TOURNAMENT_KEY, JSON.stringify(mutationTournamentRuns));
    void writeCollection("mutationTournamentRuns", mutationTournamentRuns);
  }, [dbReady, mutationTournamentRuns]);

  useEffect(() => {
    if (!dbReady || !apiHealth?.ok) return;
    const timer = window.setTimeout(() => {
      void syncCollections({
        userPrompts,
        history,
        outcomes,
        screenshots,
        buildRuns,
        queueJobs,
        lineage: lineageNodes,
        datasetVersions,
        curationDecisions,
        modelBatchEvaluations,
        pairwiseReviews,
        backupSnapshots,
        activeWorkspace,
        closedLoopRuns,
        benchmarkRuns,
        claudeHealthChecks,
        promptComparisons,
        screenshotPromptRuns,
        workspacePackRuns,
        proofLearningRuns,
        screenshotJudgeRuns,
        mutationTournamentRuns,
      })
        .then(() => setDbStatus("SQLite autosaved"))
        .catch(() => setDbStatus("IndexedDB fallback ready; SQLite autosync failed"));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [activeWorkspace, apiHealth?.ok, backupSnapshots, benchmarkRuns, buildRuns, claudeHealthChecks, closedLoopRuns, curationDecisions, datasetVersions, dbReady, history, lineageNodes, modelBatchEvaluations, mutationTournamentRuns, outcomes, pairwiseReviews, promptComparisons, proofLearningRuns, queueJobs, screenshotJudgeRuns, screenshotPromptRuns, screenshots, userPrompts, workspacePackRuns]);

  useEffect(() => {
    if (!selectedPrompt && examples[0]) setSelectedId(examples[0].id);
  }, [examples, selectedPrompt]);

  useEffect(() => {
    void getModelSettings()
      .then((settings) => setModelEnvStatus(settings as Record<string, boolean>))
      .catch(() => setModelEnvStatus(undefined));
  }, []);

  function addLineageNode(node: PromptLineageNode) {
    setLineageNodes((current) => [node, ...current.filter((item) => item.id !== node.id)].slice(0, 160));
  }

  function addDraftPrompt() {
    if (!draftPrompt.trim()) return;
    const duplicate = detectDuplicatePrompt(draftPrompt, examples);
    if (duplicate.kind === "exact") {
      setImportNotice(`Skipped exact duplicate: ${duplicate.match?.title ?? "already in corpus"}`);
      return;
    }
    const prompt = makePrompt(draftPrompt);
    setUserPrompts((current) => [prompt, ...current]);
    setSelectedId(prompt.id);
    setImportNotice(duplicate.kind === "near" ? `Added, but it is close to: ${duplicate.match?.title}` : "Added prompt to corpus.");
    addLineageNode({
      id: `lineage-added-${prompt.id}`,
      parentId: null,
      promptId: prompt.id,
      kind: "source",
      title: prompt.title,
      score: evaluatePrompt(prompt.text).score,
      status: "added",
      detail: "Prompt added to the persistent corpus.",
      createdAt: prompt.createdAt,
    });
    setDraftPrompt("");
  }

  function addPromptCandidates(candidates: ReturnType<typeof parsePromptBatch>, label = "batch") {
    const imported: PromptExample[] = [];
    const skipped: string[] = [];
    const comparisonPool = [...examples];
    const now = Date.now();

    for (const [index, candidate] of candidates.entries()) {
      const duplicate = detectDuplicatePrompt(candidate.text, [...comparisonPool, ...imported]);
      if (duplicate.kind === "exact") {
        skipped.push(candidate.title);
        continue;
      }
      const prompt: PromptExample = {
        id: `user-${slugify(candidate.title) || "prompt"}-${now}-${index}`,
        title: candidate.title,
        text: candidate.text,
        source: "user",
        createdAt: new Date(now + index).toISOString(),
      };
      imported.push(prompt);
    }

    if (!imported.length) {
      setImportNotice(`No new prompts found in ${label}. ${skipped.length ? `Skipped ${skipped.length} duplicate(s).` : ""}`.trim());
      return;
    }

    setUserPrompts((current) => [...imported, ...current]);
    setSelectedId(imported[0].id);
    for (const prompt of imported.slice(0, 12)) {
      addLineageNode({
        id: `lineage-bulk-${prompt.id}`,
        parentId: null,
        promptId: prompt.id,
        kind: "source",
        title: prompt.title,
        score: evaluatePrompt(prompt.text).score,
        status: "bulk-imported",
        detail: `Imported from ${label}.`,
        createdAt: prompt.createdAt,
      });
    }
    setImportNotice(`Imported ${imported.length} prompt(s) from ${label}. Skipped ${skipped.length} duplicate(s).`);
  }

  function addDraftPromptBatch() {
    if (!draftBatchCandidates.length) return;
    addPromptCandidates(draftBatchCandidates, "draft batch");
    setDraftPrompt("");
  }

  function addCuratedDraftBatch() {
    const safeIds = new Set(
      draftImportAudit.items
        .filter((item) => item.duplicate.kind !== "exact" && (item.decision === "gold" || item.decision === "learn"))
        .map((item) => item.candidate.id),
    );
    const candidates = draftBatchCandidates.filter((candidate) => safeIds.has(candidate.id));
    if (!candidates.length) {
      setImportNotice("No curated import candidates are ready. Review duplicates or add more exact build details first.");
      return;
    }
    addPromptCandidates(candidates, "curated draft batch");
    setDraftPrompt("");
  }

  async function importPromptFiles(files: FileList | null | undefined) {
    if (!files?.length) return;
    const candidates = (
      await Promise.all(
        Array.from(files).map(async (file) => {
          const text = await file.text();
          return parsePromptBatch(text, file.name);
        }),
      )
    ).flat();
    addPromptCandidates(candidates, `${files.length} file(s)`);
  }

  async function importJsonFile(file: File | undefined) {
    if (!file) return;
    try {
      const imported = importCorpus(await file.text());
      const unique = imported.filter((prompt) => detectDuplicatePrompt(prompt.text, examples).kind !== "exact");
      setUserPrompts((current) => [...unique, ...current]);
      if (unique[0]) setSelectedId(unique[0].id);
      setImportNotice(`Imported ${unique.length} prompts. Skipped ${imported.length - unique.length} duplicates.`);
    } catch {
      setImportNotice("Could not import that JSON corpus.");
    }
  }

  function exportJson() {
    downloadText(`prompt-atelier-corpus-${examples.length}.json`, exportCorpus(examples), "application/json");
  }

  function removePrompt(id: string) {
    setUserPrompts((current) => current.filter((prompt) => prompt.id !== id));
    if (selectedId === id) setSelectedId(seedPrompts[0]?.id ?? "");
  }

  function saveVersion(kind: PromptVersion["kind"], title: string, text: string, score?: number) {
    const normalized = text.trim();
    if (!normalized) return;
    const version: PromptVersion = {
      id: `${kind}-${Date.now()}`,
      kind,
      title,
      text: normalized,
      score,
      createdAt: new Date().toISOString(),
    };
    setHistory((current) => [version, ...current].slice(0, 80));
    if (selectedPrompt) {
      addLineageNode({
        id: `lineage-version-${version.id}`,
        parentId: `lineage-source-${selectedPrompt.id}`,
        promptId: selectedPrompt.id,
        kind:
          kind === "mutation"
            ? "mutation"
            : kind === "compiled"
              ? "compiled"
              : kind === "tournament"
                ? "tournament"
                : kind === "build-run"
                  ? "build"
                  : "improved",
        title,
        score: score ?? evaluatePrompt(normalized).score,
        status: kind,
        detail: `${countWords(normalized)} words saved from ${kind}.`,
        createdAt: version.createdAt,
      });
    }
    setCopied(`saved-${kind}`);
    window.setTimeout(() => setCopied(""), 1200);
  }

  function removeVersion(id: string) {
    setHistory((current) => current.filter((version) => version.id !== id));
  }

  function updateOutcome(prompt: PromptExample, patch: Partial<Pick<OutcomeRecord, "rating" | "status" | "notes">>) {
    const now = new Date().toISOString();
    setOutcomes((current) => {
      const existing = current.find((outcome) => outcome.promptId === prompt.id);
      if (existing) {
        return current.map((outcome) =>
          outcome.promptId === prompt.id ? { ...outcome, ...patch, title: prompt.title, updatedAt: now } : outcome,
        );
      }
      return [
        {
          promptId: prompt.id,
          title: prompt.title,
          rating: patch.rating ?? "unrated",
          status: patch.status ?? "unrated",
          notes: patch.notes ?? "",
          createdAt: now,
          updatedAt: now,
        },
        ...current,
      ];
    });
    addLineageNode({
      id: `lineage-outcome-${prompt.id}-${now}`,
      parentId: `lineage-source-${prompt.id}`,
      promptId: prompt.id,
      kind: "outcome",
      title: prompt.title,
      score: patch.rating === "great" || patch.status === "gold" ? 92 : patch.rating === "bad" || patch.status === "avoid" ? 24 : 58,
      status: `${patch.rating ?? "same"}/${patch.status ?? "same"}`,
      detail: patch.notes ?? "Outcome updated.",
      createdAt: now,
    });
  }

  function addScreenshot(record: Omit<ScreenshotRecord, "id" | "createdAt">) {
    const normalized = record.url.trim();
    if (!normalized) return;
    setScreenshots((current) => [
      {
        ...record,
        url: normalized,
        id: `screenshot-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    addLineageNode({
      id: `lineage-screenshot-${Date.now()}`,
      parentId: `lineage-source-${record.promptId}`,
      promptId: record.promptId,
      kind: "screenshot",
      title: record.title,
      score: record.rating === "great" ? 88 : record.rating === "okay" ? 64 : record.rating === "bad" ? 26 : 52,
      status: record.rating,
      detail: record.notes || normalized,
      createdAt: new Date().toISOString(),
    });
  }

  function removeScreenshot(id: string) {
    setScreenshots((current) => current.filter((screenshot) => screenshot.id !== id));
  }

  function addBuildRun(prompt: PromptExample, fields: Omit<BuildRunRecord, "id" | "promptId" | "promptTitle" | "promptText" | "score" | "failureCategories" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const draftRun: BuildRunRecord = {
      ...fields,
      id: `build-${Date.now()}`,
      promptId: prompt.id,
      promptTitle: prompt.title,
      promptText: prompt.text,
      score: 0,
      failureCategories: [],
      createdAt: now,
      updatedAt: now,
    };
    const scored = scoreResultArtifact(prompt, undefined, draftRun);
    const run = {
      ...draftRun,
      score: scored.score,
      failureCategories: scored.failureCategories,
    };
    setBuildRuns((current) => [run, ...current].slice(0, 80));
    addLineageNode({
      id: `lineage-run-${run.id}`,
      parentId: `lineage-source-${prompt.id}`,
      promptId: prompt.id,
      kind: "build",
      title: prompt.title,
      score: run.score,
      status: run.status,
      detail: run.resultUrl || run.folderPath || run.notes || "Build run recorded.",
      createdAt: run.createdAt,
    });
  }

  function removeBuildRun(id: string) {
    setBuildRuns((current) => current.filter((run) => run.id !== id));
  }

  function queueTournamentFinalists() {
    if (!selectedPrompt) return;
    const jobs = tournament.finalists.map((variant) => createBuildQueueJob(selectedPrompt, variant, selectedBuildRun?.resultUrl || "http://127.0.0.1:5173"));
    setQueueJobs((current) => [...jobs, ...current].slice(0, 80));
    for (const job of jobs) {
      addLineageNode({
        id: `lineage-queue-${job.id}`,
        parentId: `lineage-source-${selectedPrompt.id}`,
        promptId: selectedPrompt.id,
        kind: "tournament",
        title: job.variantTitle,
        score: job.score,
        status: job.status,
        detail: `Queued for autonomous run in ${job.runFolder}.`,
        createdAt: job.createdAt,
      });
    }
    setCopied("queued-tournament");
    window.setTimeout(() => setCopied(""), 1200);
  }

  function queueBattleVariants(battle: PromptBattle, label = "battle") {
    if (!selectedPrompt) return;
    const jobs = battle.variants.map((variant) => createBuildQueueJob(selectedPrompt, variant, selectedBuildRun?.resultUrl || "http://127.0.0.1:5173"));
    setQueueJobs((current) => [...jobs, ...current].slice(0, 120));
    for (const job of jobs) {
      addLineageNode({
        id: `lineage-${label}-${job.id}`,
        parentId: `lineage-source-${selectedPrompt.id}`,
        promptId: selectedPrompt.id,
        kind: "tournament",
        title: job.variantTitle,
        score: job.score,
        status: "battle-queued",
        detail: `Queued by ${label} in ${job.runFolder}.`,
        createdAt: job.createdAt,
      });
    }
    setApiNotice(`Queued ${jobs.length} ${label} variant(s).`);
  }

  function runOneClickLearningLoop() {
    const variant = guidedWizard.variants[0] ?? learnedGeneratorVariants[0];
    if (!variant) {
      setApiNotice("No generated variant is available yet. Complete the guided prompt workflow first.");
      return;
    }
    const now = Date.now();
    const createdAt = new Date(now).toISOString();
    const prompt: PromptExample = {
      id: `loop-${slugify(variant.title) || "prompt"}-${now}`,
      title: variant.title,
      text: variant.prompt,
      source: "user",
      createdAt,
    };
    const job = createBuildQueueJob(
      prompt,
      { title: variant.title, prompt: variant.prompt, score: variant.score },
      selectedBuildRun?.resultUrl || "http://127.0.0.1:5173",
    );
    const draftRun: BuildRunRecord = {
      id: `loop-run-${now}`,
      promptId: prompt.id,
      promptTitle: prompt.title,
      promptText: prompt.text,
      status: "needs-review",
      resultUrl: "",
      folderPath: job.runFolder,
      screenshotUrl: "",
      filesChanged: "Generated by one-click learning loop.",
      errors: "",
      notes: "One-click loop generated the prompt, queued a build job, scored the prompt locally, and labeled it experimental. Run the queue and attach screenshots before promoting to gold.",
      score: 0,
      failureCategories: [],
      createdAt,
      updatedAt: createdAt,
    };
    const scored = scoreResultArtifact(prompt, undefined, draftRun);
    const run = { ...draftRun, score: scored.score, failureCategories: scored.failureCategories };
    const historyVersion: PromptVersion = {
      id: `generated-${now}`,
      kind: "generated",
      title: prompt.title,
      text: prompt.text,
      score: variant.score,
      createdAt,
    };
    const outcome: OutcomeRecord = {
      promptId: prompt.id,
      title: prompt.title,
      rating: run.score >= 75 ? "okay" : "unrated",
      status: run.score >= 75 ? "good" : "experimental",
      notes: `One-click loop local score ${run.score}/100. Build queue job ${job.id} is ready; attach screenshot proof before gold promotion.`,
      createdAt,
      updatedAt: createdAt,
    };
    const lineageBatch: PromptLineageNode[] = [
      {
        id: `lineage-loop-source-${prompt.id}`,
        parentId: null,
        promptId: prompt.id,
        kind: "source",
        title: prompt.title,
        score: variant.score,
        status: "generated",
        detail: "Created by one-click learning loop.",
        createdAt,
      },
      {
        id: `lineage-loop-queue-${job.id}`,
        parentId: `lineage-loop-source-${prompt.id}`,
        promptId: prompt.id,
        kind: "tournament",
        title: job.variantTitle,
        score: job.score,
        status: "queued",
        detail: `Queued in ${job.runFolder}.`,
        createdAt,
      },
      {
        id: `lineage-loop-run-${run.id}`,
        parentId: `lineage-loop-queue-${job.id}`,
        promptId: prompt.id,
        kind: "build",
        title: run.promptTitle,
        score: run.score,
        status: run.status,
        detail: run.notes,
        createdAt,
      },
    ];
    setUserPrompts((current) => [prompt, ...current]);
    setSelectedId(prompt.id);
    setHistory((current) => [historyVersion, ...current].slice(0, 80));
    setQueueJobs((current) => [job, ...current].slice(0, 120));
    setBuildRuns((current) => [run, ...current].slice(0, 80));
    setOutcomes((current) => [outcome, ...current].slice(0, 160));
    setLineageNodes((current) => [...lineageBatch, ...current].slice(0, 160));
    setApiNotice(`One-click loop created ${prompt.title}, queued one run, scored ${run.score}/100, and labeled it ${run.score >= 75 ? "good" : "experimental"}.`);
  }

  function createDatasetVersion() {
    const version = createDatasetVersionSnapshot({
      buildRuns,
      examples: learningExamples,
      label: `v${datasetVersions.length + 1}`,
      outcomes,
      score: scoreBreakdown,
      screenshots,
    });
    setDatasetVersions((current) => [version, ...current].slice(0, 20));
    setApiNotice(`Created dataset version ${version.label}.`);
  }

  function applyCurationRecommendations() {
    const next = Object.fromEntries(
      curationReport.items
        .filter((item) => item.recommendation !== "learn")
        .map((item) => [item.promptId, item.recommendation]),
    ) as Record<string, CurationDecision>;
    setCurationDecisions((current) => ({ ...current, ...next }));
    setApiNotice(`Applied ${Object.keys(next).length} curation recommendation(s).`);
  }

  function setPromptCurationDecision(promptId: string, decision: CurationDecision) {
    setCurationDecisions((current) => ({ ...current, [promptId]: decision }));
  }

  function saveApiBase() {
    setApiBase(apiBaseDraft);
    setApiToken(apiTokenDraft);
    setApiNotice(`API base set to ${getApiBase()}${apiTokenDraft.trim() ? " with bearer token." : "."}`);
  }

  function modelSettingsPayload() {
    return {
      provider: modelSettings.provider,
      endpoint: modelSettings.endpoint,
      apiKey: modelSettings.apiKey,
      model: modelSettings.model,
      temperature: modelSettings.temperature,
    };
  }

  function modelNumber(result: Record<string, unknown> | undefined, key: string, fallback = 0) {
    const value = result?.[key];
    const numeric = typeof value === "number" ? value : typeof value === "string" ? Number(value) : fallback;
    return Number.isFinite(numeric) ? Math.max(0, Math.min(100, Math.round(numeric))) : fallback;
  }

  function modelStringArray(result: Record<string, unknown> | undefined, key: string, fallback: string[] = []) {
    const value = result?.[key];
    return Array.isArray(value) ? value.map(String).filter(Boolean).slice(0, 8) : fallback;
  }

  function modelString(result: Record<string, unknown> | undefined, key: string, fallback = "") {
    const value = result?.[key];
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  async function runModelBatchCalibration() {
    const batch = learningExamples.slice(0, Math.min(learningExamples.length, 60));
    if (!batch.length) {
      setModelNotice("No curated website prompts are available for batch evaluation.");
      return;
    }
    setModelNotice(`Running ${modelSettings.provider === "anthropic" ? "Claude" : modelSettings.provider || "model"} corpus audit for ${batch.length} prompt(s)...`);
    const results: ModelBatchEvaluation[] = [];
    for (const prompt of batch) {
      try {
        const result = await evaluateWithModel({
          prompt: prompt.text,
          memory: promptMemory.markdown,
          context: {
            selectedTitle: prompt.title,
            internalScore: evaluatePrompt(prompt.text).score,
            curation: curationReport.items.find((item) => item.promptId === prompt.id),
          },
          settings: modelSettingsPayload(),
        });
        results.push({
          id: `model-batch-${prompt.id}-${Date.now()}`,
          promptId: prompt.id,
          title: prompt.title,
          score: Number(result.score || 0),
          readiness: String(result.readiness || "needs-review"),
          mode: String(result.mode || "local"),
          findings: Array.isArray(result.findings) ? result.findings.map(String).slice(0, 4) : [],
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        results.push({
          id: `model-batch-${prompt.id}-${Date.now()}`,
          promptId: prompt.id,
          title: prompt.title,
          score: 0,
          readiness: "error",
          mode: modelSettings.provider || "external",
          findings: [error instanceof Error ? error.message : String(error)],
          createdAt: new Date().toISOString(),
        });
      }
    }
    setModelBatchEvaluations((current) => [...results, ...current].slice(0, 200));
    const average = Math.round(results.reduce((sum, item) => sum + item.score, 0) / Math.max(1, results.length));
    setModelNotice(`Batch calibration complete: ${results.length} prompt(s), ${average} average model score.`);
  }

  async function runClosedLoopTrainer() {
    const variant = guidedWizard.variants[0] ?? learnedGeneratorVariants[0];
    if (!variant) {
      setModelNotice("Closed-loop trainer needs a generated variant first.");
      return;
    }
    const createdAt = new Date().toISOString();
    const localRewrite = comparePromptImprovement(variant.prompt, profile, outcomes, resultScore);
    setModelNotice(`Running closed-loop trainer with ${modelSettings.provider === "anthropic" ? "Claude" : modelSettings.provider || "model"}...`);

    let originalResult: Record<string, unknown> | undefined;
    let improvedResult: Record<string, unknown> | undefined;
    try {
      originalResult = await evaluateWithModel({
        prompt: variant.prompt,
        memory: promptMemory.markdown,
        context: {
          task: "Closed-loop trainer pass 1. Score this prompt and return diagnosis, questions, recommendations, and a rewrittenPrompt that would build a better website prompt.",
          sourceTitle: variant.title,
          localScore: variant.score,
          currentFailures: resultScore.failureCategories,
        },
        settings: modelSettingsPayload(),
      });
      const improvedPrompt = modelString(originalResult, "rewrittenPrompt", localRewrite.improvedPrompt);
      improvedResult = await evaluateWithModel({
        prompt: improvedPrompt,
        memory: promptMemory.markdown,
        context: {
          task: "Closed-loop trainer pass 2. Score this rewritten website prompt and explain whether it is stronger than the original.",
          originalTitle: variant.title,
          originalScore: modelNumber(originalResult, "score", variant.score),
          localRewriteDelta: localRewrite.delta,
        },
        settings: modelSettingsPayload(),
      });
    } catch (error) {
      originalResult = {
        mode: "local-closed-loop",
        score: localRewrite.originalScore,
        findings: localRewrite.missingBefore,
        recommendations: localRewrite.changes,
        rewrittenPrompt: localRewrite.improvedPrompt,
        error: error instanceof Error ? error.message : String(error),
      };
      improvedResult = {
        mode: "local-closed-loop",
        score: localRewrite.improvedScore,
        findings: localRewrite.changes,
        recommendations: ["Local rewrite used because model evaluation was unavailable."],
      };
    }

    const originalScore = modelNumber(originalResult, "score", localRewrite.originalScore);
    const improvedPrompt = modelString(originalResult, "rewrittenPrompt", localRewrite.improvedPrompt);
    const improvedScore = modelNumber(improvedResult, "score", evaluatePrompt(improvedPrompt).score);
    const winnerPrompt = improvedScore >= originalScore ? improvedPrompt : variant.prompt;
    const winnerScore = Math.max(originalScore, improvedScore);
    const prompt: PromptExample = {
      id: `closed-loop-${slugify(variant.title) || "prompt"}-${Date.now()}`,
      title: `${variant.title} refined`,
      text: winnerPrompt,
      source: "user",
      createdAt,
    };
    const historyVersion: PromptVersion = {
      id: `closed-loop-version-${Date.now()}`,
      kind: "improved",
      title: prompt.title,
      text: prompt.text,
      score: winnerScore,
      createdAt,
    };
    const run: ClosedLoopRun = {
      id: `closed-loop-run-${Date.now()}`,
      createdAt,
      sourceTitle: variant.title,
      originalScore,
      improvedScore,
      winnerTitle: prompt.title,
      winnerPrompt,
      modelMode: modelString(improvedResult, "mode", modelString(originalResult, "mode", "local")),
      findings: [...modelStringArray(originalResult, "findings"), ...modelStringArray(improvedResult, "findings")].slice(0, 8),
      recommendations: [...modelStringArray(originalResult, "recommendations"), ...modelStringArray(improvedResult, "recommendations")].slice(0, 8),
    };
    const batchRows: ModelBatchEvaluation[] = [
      {
        id: `model-closed-loop-original-${Date.now()}`,
        promptId: prompt.id,
        title: `${variant.title} original`,
        score: originalScore,
        readiness: modelString(originalResult, "readiness", "needs-review"),
        mode: modelString(originalResult, "mode", "local"),
        findings: modelStringArray(originalResult, "findings"),
        createdAt,
      },
      {
        id: `model-closed-loop-improved-${Date.now()}`,
        promptId: prompt.id,
        title: `${variant.title} improved`,
        score: improvedScore,
        readiness: modelString(improvedResult, "readiness", "needs-review"),
        mode: modelString(improvedResult, "mode", "local"),
        findings: modelStringArray(improvedResult, "findings"),
        createdAt,
      },
    ];

    setClosedLoopRuns((current) => [run, ...current].slice(0, 40));
    setUserPrompts((current) => [prompt, ...current]);
    setSelectedId(prompt.id);
    setHistory((current) => [historyVersion, ...current].slice(0, 80));
    setModelBatchEvaluations((current) => [...batchRows, ...current].slice(0, 200));
    const closedLoopRating: OutcomeRating = winnerScore >= 82 ? "great" : winnerScore >= 70 ? "okay" : "unrated";
    const closedLoopStatus: OutcomeRecord["status"] = winnerScore >= 82 ? "gold" : winnerScore >= 70 ? "good" : "experimental";
    setOutcomes((current) => [
      {
        promptId: prompt.id,
        title: prompt.title,
        rating: closedLoopRating,
        status: closedLoopStatus,
        notes: `Closed-loop trainer winner. Original ${originalScore}/100, improved ${improvedScore}/100 using ${run.modelMode}.`,
        createdAt,
        updatedAt: createdAt,
      },
      ...current,
    ].slice(0, 160));
    addLineageNode({
      id: `lineage-closed-loop-${prompt.id}-${Date.now()}`,
      parentId: null,
      promptId: prompt.id,
      kind: "outcome",
      title: prompt.title,
      score: winnerScore,
      status: "closed-loop",
      detail: `Closed-loop trainer compared ${originalScore} to ${improvedScore}.`,
      createdAt,
    });
    setImproveText(winnerPrompt);
    setActiveTrainStage("Analyze");
    setModelNotice(`Closed-loop trainer saved ${prompt.title}: ${originalScore} -> ${improvedScore} (${run.modelMode}).`);
  }

  async function runBenchmarkSuite() {
    setModelNotice(`Running benchmark suite across ${benchmarkBriefs.length} canonical website briefs...`);
    const rows: BenchmarkRun["rows"] = [];
    const batchRows: ModelBatchEvaluation[] = [];
    for (const brief of benchmarkBriefs) {
      const compiled = compilePromptFromBrief(
        {
          roughIdea: `${brief.title}: ${brief.goal}`,
          brandName: brief.brandName,
          siteType: brief.siteType,
          audience: brief.audience,
          visualDirection: brief.visualDirection,
          stack: brief.stack,
          assets: brief.assets,
          constraints: brief.constraints,
        },
        profile,
        outcomes,
        resultScore,
      );
      let result: Record<string, unknown>;
      try {
        result = await evaluateWithModel({
          prompt: compiled.prompt,
          memory: promptMemory.markdown,
          context: {
            task: "Benchmark this generated website prompt against the Prompt Atelier quality bar.",
            benchmarkBrief: brief,
            localScore: compiled.score,
          },
          settings: modelSettingsPayload(),
        });
      } catch (error) {
        result = {
          mode: "local-benchmark",
          score: compiled.score,
          readiness: "local-fallback",
          findings: compiled.assumptions.length ? compiled.assumptions : ["Local compiler prompt scored without model access."],
          recommendations: [error instanceof Error ? error.message : String(error)],
        };
      }
      const score = modelNumber(result, "score", compiled.score);
      const row = {
        briefId: brief.id,
        title: brief.title,
        promptTitle: `${brief.brandName} ${brief.siteType}`,
        score,
        readiness: modelString(result, "readiness", "needs-review"),
        findings: modelStringArray(result, "findings").slice(0, 4),
      };
      rows.push(row);
      batchRows.push({
        id: `model-benchmark-${brief.id}-${Date.now()}`,
        promptId: `benchmark-${brief.id}`,
        title: brief.title,
        score,
        readiness: row.readiness,
        mode: modelString(result, "mode", "local"),
        findings: row.findings,
        createdAt: new Date().toISOString(),
      });
    }
    const averageScore = Math.round(rows.reduce((sum, row) => sum + row.score, 0) / Math.max(1, rows.length));
    const benchmarkRun: BenchmarkRun = {
      id: `benchmark-run-${Date.now()}`,
      createdAt: new Date().toISOString(),
      suite: "Prompt Atelier canonical website briefs",
      count: rows.length,
      averageScore,
      modelMode: batchRows.find((row) => row.mode)?.mode || "local",
      rows,
    };
    setBenchmarkRuns((current) => [benchmarkRun, ...current].slice(0, 20));
    setModelBatchEvaluations((current) => [...batchRows, ...current].slice(0, 200));
    setModelNotice(`Benchmark suite complete: ${rows.length} briefs, ${averageScore} average score.`);
  }

  function runCorpusHygieneSweep() {
    const next: Record<string, CurationDecision> = {};
    for (const item of curationReport.items) {
      if (item.recommendation !== "learn") next[item.promptId] = item.recommendation;
    }
    for (const finding of leakageGuard.findings) {
      next[finding.promptId] = finding.severity === "block" ? "quarantine" : "review";
    }
    for (const duplicate of corpusCleaning.exactDuplicates) {
      for (const match of duplicate.matches) next[match.id] = "quarantine";
    }
    for (const duplicate of corpusCleaning.nearDuplicates) {
      for (const match of duplicate.matches) next[match.id] = next[match.id] === "quarantine" ? "quarantine" : "review";
    }
    for (const weak of corpusCleaning.weakPrompts) next[weak.example.id] = "review";
    setCurationDecisions((current) => ({ ...current, ...next }));
    setApiNotice(`Corpus hygiene sweep applied ${Object.keys(next).length} review/quarantine decision(s).`);
  }

  function applyResultLearningPatch() {
    setImproveText(repairedPrompt);
    setCoachInput(repairedPrompt);
    setActiveTrainStage("Improve");
    setApiNotice("Loaded result-based repair prompt into Improve and Claude coach.");
  }

  async function runHostedClaudeHealthCheck() {
    const createdAt = new Date().toISOString();
    const detail: string[] = [];
    let healthResult: ApiHealth | undefined;
    let envResult: Record<string, boolean> | undefined;
    let sqliteWritable = false;
    let modelRouteWorking = false;
    let modelMode = "unavailable";
    let modelScore = 0;
    try {
      healthResult = await getApiHealth();
      setApiHealth(healthResult);
      detail.push(`API online at ${getApiBase()}.`);
    } catch (error) {
      detail.push(`API health failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    try {
      envResult = await getModelSettings();
      setModelEnvStatus(envResult);
      detail.push(envResult.anthropicApiKeyConfigured ? "Claude key is configured on the API host." : "Claude key is not configured on the API host.");
    } catch (error) {
      detail.push(`Model settings failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    try {
      await syncCollections({
        healthChecks: [{ id: `health-${Date.now()}`, createdAt, kind: "claude-health" }],
      });
      sqliteWritable = true;
      detail.push("SQLite write probe succeeded.");
    } catch (error) {
      detail.push(`SQLite write probe failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    try {
      const result = await evaluateWithModel({
        prompt: "Health-check this website prompt evaluator route. Return JSON.",
        memory: promptMemory.markdown.slice(0, 1800),
        context: { task: "Hosted Claude health check. Score route readiness." },
        settings: modelSettingsPayload(),
      });
      modelRouteWorking = true;
      modelMode = modelString(result, "mode", "unknown");
      modelScore = modelNumber(result, "score", 0);
      detail.push(`Model route returned ${modelMode} with score ${modelScore}.`);
    } catch (error) {
      detail.push(`Model route failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    const check: HostedClaudeHealthCheck = {
      id: `claude-health-${Date.now()}`,
      createdAt,
      apiOnline: Boolean(healthResult?.ok),
      tokenValid: Boolean(healthResult?.ok),
      claudeConfigured: Boolean(envResult?.anthropicApiKeyConfigured),
      sqliteWritable,
      modelRouteWorking,
      modelMode,
      modelScore,
      apiBase: getApiBase(),
      sqlitePath: healthResult?.sqlitePath ?? "",
      detail,
    };
    setClaudeHealthChecks((current) => [check, ...current].slice(0, 20));
    setModelNotice(modelRouteWorking ? `Hosted health check passed through ${modelMode}.` : "Hosted health check needs attention.");
  }

  async function runPromptComparison(left: PromptExample | undefined, right: PromptExample | undefined) {
    if (!left || !right || left.id === right.id) {
      setModelNotice("Choose two different prompts for comparison.");
      return;
    }
    const leftScore = evaluatePrompt(left.text).score;
    const rightScore = evaluatePrompt(right.text).score;
    const localWinner = leftScore >= rightScore ? left : right;
    let result: Record<string, unknown> | undefined;
    try {
      result = await evaluateWithModel({
        prompt: [
          "Compare these two website prompts for buildability, visual specificity, responsive behavior, accessibility, and QA readiness.",
          "",
          `PROMPT A: ${left.title}`,
          left.text,
          "",
          `PROMPT B: ${right.title}`,
          right.text,
        ].join("\n"),
        memory: promptMemory.markdown,
        context: {
          task: "A/B compare prompts. Return winner as A or B, findings, recommendations, and hybridPrompt that would beat both.",
          leftTitle: left.title,
          rightTitle: right.title,
          leftScore,
          rightScore,
        },
        settings: modelSettingsPayload(),
      });
    } catch (error) {
      result = {
        mode: "local-comparison",
        score: Math.max(leftScore, rightScore),
        winner: localWinner.id === left.id ? "A" : "B",
        findings: [`Local score ${left.title}: ${leftScore}`, `Local score ${right.title}: ${rightScore}`],
        recommendations: [error instanceof Error ? error.message : String(error)],
        hybridPrompt: comparePromptImprovement(localWinner.text, profile, outcomes, resultScore).improvedPrompt,
      };
    }
    const winnerToken = modelString(result, "winner", localWinner.id === left.id ? "A" : "B").toLowerCase();
    const winner = winnerToken.includes("b") || winnerToken.includes(right.title.toLowerCase()) ? right : left;
    const hybridPrompt = modelString(result, "hybridPrompt", modelString(result, "rewrittenPrompt", comparePromptImprovement(winner.text, profile, outcomes, resultScore).improvedPrompt));
    const run: PromptComparisonRun = {
      id: `prompt-comparison-${Date.now()}`,
      createdAt: new Date().toISOString(),
      leftId: left.id,
      rightId: right.id,
      leftTitle: left.title,
      rightTitle: right.title,
      winnerId: winner.id,
      winnerTitle: winner.title,
      modelMode: modelString(result, "mode", "local"),
      score: modelNumber(result, "score", Math.max(leftScore, rightScore)),
      findings: modelStringArray(result, "findings"),
      recommendations: modelStringArray(result, "recommendations"),
      hybridPrompt,
    };
    setPromptComparisons((current) => [run, ...current].slice(0, 40));
    setImproveText(hybridPrompt);
    setModelNotice(`A/B comparison picked ${winner.title} using ${run.modelMode}.`);
  }

  async function generatePromptFromScreenshot(input: { title: string; url: string; notes: string; siteType: string }) {
    const imageDataUrl = input.url.startsWith("data:image/") ? input.url : undefined;
    const localPrompt = [
      `Create a high-fidelity website recreation prompt from the screenshot "${input.title || "uploaded screenshot"}".`,
      "",
      "Stack: React + TypeScript + Vite + Tailwind CSS + lucide-react unless the screenshot notes require otherwise.",
      `Site type: ${input.siteType || generatorInput.siteType}.`,
      `Visual evidence: ${input.notes || "Infer layout, typography, spacing, colors, assets, and interaction states from the screenshot."}`,
      "",
      "Include exact sections for fonts/global CSS, colors, asset handling, layout/layer order, navigation, main content, motion/state mechanics, responsive rules, constraints, accessibility, and QA.",
      "No generic stock imagery, no decorative filler, no unlisted UI libraries, no text overlap, and no missing mobile behavior.",
    ].join("\n");
    let result: Record<string, unknown> | undefined;
    try {
      result = await evaluateWithModel({
        prompt: localPrompt,
        memory: promptMemory.markdown,
        imageDataUrl,
        context: {
          task: "Generate a build-ready website prompt from this screenshot. Put the final prompt in rewrittenPrompt.",
          screenshotTitle: input.title,
          screenshotNotes: input.notes,
          siteType: input.siteType,
          hasImage: Boolean(imageDataUrl),
        },
        settings: modelSettingsPayload(),
      });
    } catch (error) {
      result = {
        mode: "local-screenshot-prompt",
        score: evaluatePrompt(localPrompt).score,
        rewrittenPrompt: localPrompt,
        findings: [error instanceof Error ? error.message : String(error)],
        recommendations: ["Add more screenshot notes or configure Claude vision on the API host."],
      };
    }
    const prompt = modelString(result, "rewrittenPrompt", localPrompt);
    const run: ScreenshotPromptRun = {
      id: `screenshot-prompt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: input.title || "Screenshot prompt",
      screenshotTitle: input.title || "Screenshot",
      screenshotKind: imageDataUrl ? "uploaded" : input.url.trim() ? "url" : "notes",
      prompt,
      score: modelNumber(result, "score", evaluatePrompt(prompt).score),
      modelMode: modelString(result, "mode", "local"),
      notes: [...modelStringArray(result, "findings"), ...modelStringArray(result, "recommendations")].slice(0, 8),
      imagePreviewUrl: input.url,
    };
    setScreenshotPromptRuns((current) => [run, ...current].slice(0, 40));
    setImproveText(prompt);
    setModelNotice(`Generated screenshot prompt with ${run.modelMode}.`);
    return run;
  }

  function saveWorkspacePackRun() {
    const run: WorkspacePackRun = {
      id: `workspace-packs-${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: `Workspace packs ${workspacePackRuns.length + 1}`,
      packs: workspacePackSnapshot,
    };
    setWorkspacePackRuns((current) => [run, ...current].slice(0, 20));
    setApiNotice(`Saved ${run.packs.length} workspace prompt pack(s).`);
  }

  function runProofLearningLoop() {
    if (!selectedPrompt) {
      setApiNotice("Select a prompt before running the proof loop.");
      return;
    }
    const createdAt = new Date().toISOString();
    const promptScore = evaluatePrompt(selectedPrompt.text).score;
    const proofScore = Math.round((promptScore + resultScore.score + screenshotQa.score + dnaV2.overall) / 4);
    const hasEvidence = Boolean(selectedBuildRun || selectedScreenshots.length);
    const job = createBuildQueueJob(selectedPrompt, undefined, selectedBuildRun?.resultUrl || "http://127.0.0.1:5173");
    const learnedStatus: ProofLearningRun["learnedStatus"] = hasEvidence
      ? proofScore >= 82
        ? "gold"
        : proofScore >= 70
          ? "good"
          : proofScore >= 52
            ? "experimental"
            : "avoid"
      : "queued";
    const notes = [
      hasEvidence ? "Existing build/screenshot evidence was scored into the learning signal." : "Queued a build proof job; import queue-result.json or attach screenshots to finish learning.",
      `Prompt ${promptScore}/100, result ${resultScore.score}/100, screenshot ${screenshotQa.score}/100, DNA ${dnaV2.overall}/100.`,
      ...buildFeedback.nextActions.slice(0, 4),
    ];
    const run: ProofLearningRun = {
      id: `proof-loop-${Date.now()}`,
      createdAt,
      promptId: selectedPrompt.id,
      title: selectedPrompt.title,
      queueJobId: job.id,
      buildRunId: selectedBuildRun?.id,
      phase: hasEvidence ? "learned" : "queued",
      promptScore,
      resultScore: resultScore.score,
      visualScore: screenshotQa.score,
      dnaScore: dnaV2.overall,
      learnedStatus,
      screenshotCount: selectedScreenshots.length,
      notes,
    };
    setQueueJobs((current) => [job, ...current.filter((item) => item.id !== job.id)].slice(0, 140));
    setProofLearningRuns((current) => [run, ...current].slice(0, 40));
    if (hasEvidence && learnedStatus !== "queued") {
      updateOutcome(selectedPrompt, {
        rating: learnedStatus === "gold" ? "great" : learnedStatus === "avoid" ? "bad" : "okay",
        status: learnedStatus,
        notes: `Proof loop learned from build evidence. ${notes.join(" ")}`,
      });
    }
    addLineageNode({
      id: `lineage-proof-loop-${run.id}`,
      parentId: `lineage-source-${selectedPrompt.id}`,
      promptId: selectedPrompt.id,
      kind: hasEvidence ? "outcome" : "build",
      title: selectedPrompt.title,
      score: proofScore,
      status: run.phase,
      detail: notes.join(" "),
      createdAt,
    });
    setActiveTrainStage(hasEvidence ? "Analyze" : "Run");
    setApiNotice(hasEvidence ? `Proof loop learned ${selectedPrompt.title} as ${learnedStatus}.` : `Queued proof loop job ${job.id}.`);
  }

  async function runScreenshotJudge() {
    if (!selectedPrompt) {
      setModelNotice("Select a prompt before running screenshot judge.");
      return;
    }
    const screenshotEvidence = selectedScreenshots.map((screenshot) => ({
      title: screenshot.title,
      url: screenshot.url.startsWith("data:image/") ? "[uploaded data URL]" : screenshot.url,
      rating: screenshot.rating,
      notes: screenshot.notes,
    }));
    const localPatch = [
      "Screenshot judge repair patch:",
      ...buildFeedback.nextActions.map((item) => `- ${item}`),
      ...screenshotQa.notes.map((item) => `- ${item}`),
    ].join("\n");
    let result: Record<string, unknown>;
    try {
      result = await evaluateWithModel({
        prompt: selectedPrompt.text,
        memory: promptMemory.markdown,
        imageDataUrl: selectedScreenshots.find((screenshot) => screenshot.url.startsWith("data:image/"))?.url,
        context: {
          task: "Judge whether the screenshot/build output proves this website prompt. Return score, readiness, findings, recommendations, and rewrittenPrompt as the exact repair patch.",
          buildRun: selectedBuildRun,
          screenshotEvidence,
          resultScore,
          screenshotQa,
        },
        settings: modelSettingsPayload(),
      });
    } catch (error) {
      result = {
        mode: "local-screenshot-judge",
        score: buildFeedback.score,
        readiness: buildFeedback.status,
        findings: buildFeedback.summary,
        recommendations: [error instanceof Error ? error.message : String(error), ...buildFeedback.nextActions],
        rewrittenPrompt: localPatch,
      };
    }
    const promptPatch = modelString(result, "rewrittenPrompt", localPatch);
    const run: ScreenshotJudgeRun = {
      id: `screenshot-judge-${Date.now()}`,
      createdAt: new Date().toISOString(),
      promptId: selectedPrompt.id,
      title: selectedPrompt.title,
      modelMode: modelString(result, "mode", "local"),
      score: modelNumber(result, "score", buildFeedback.score),
      verdict: modelString(result, "readiness", buildFeedback.status),
      findings: modelStringArray(result, "findings").slice(0, 8),
      fixes: modelStringArray(result, "recommendations").slice(0, 8),
      promptPatch,
    };
    setScreenshotJudgeRuns((current) => [run, ...current].slice(0, 40));
    setImproveText(promptPatch);
    setModelNotice(`Screenshot judge returned ${run.score}/100 via ${run.modelMode}.`);
  }

  async function runMutationTournament() {
    if (!selectedPrompt && !mutationSourceText.trim()) {
      setModelNotice("Mutation tournament needs a source prompt.");
      return;
    }
    setModelNotice("Running mutation tournament...");
    const variants = promptMutations.slice(0, 6);
    const rows: MutationTournamentRun["variants"] = [];
    let modelMode = "local";
    for (const variant of variants) {
      try {
        const result = await evaluateWithModel({
          prompt: variant.prompt,
          memory: promptMemory.markdown,
          context: {
            task: "Score this mutation tournament variant. Return score, findings, recommendations, and readiness.",
            variantTitle: variant.title,
            intent: variant.intent,
            currentResultScore: resultScore.score,
          },
          settings: modelSettingsPayload(),
        });
        modelMode = modelString(result, "mode", modelMode);
        rows.push({
          id: variant.id,
          title: variant.title,
          score: modelNumber(result, "score", variant.score),
          intent: modelStringArray(result, "findings")[0] ?? variant.intent,
        });
      } catch {
        rows.push({ id: variant.id, title: variant.title, score: variant.score, intent: variant.intent });
      }
    }
    const ranked = rows.length ? [...rows].sort((a, b) => b.score - a.score) : [];
    const winnerRow = ranked[0] ?? { id: "none", title: "No mutation", score: 0, intent: "No variants generated." };
    const winnerVariant = variants.find((variant) => variant.id === winnerRow.id) ?? promptBattle.winner;
    const run: MutationTournamentRun = {
      id: `mutation-tournament-${Date.now()}`,
      createdAt: new Date().toISOString(),
      sourceTitle: selectedPrompt?.title ?? "Manual source",
      winnerTitle: winnerRow.title,
      winnerPrompt: winnerVariant?.prompt ?? "",
      winnerScore: winnerRow.score,
      modelMode,
      variants: rows,
      notes: [
        "Tournament scoring compares mutated prompts before spending a build run.",
        "Save the winner, then run the proof loop to verify it with screenshots.",
      ],
    };
    setMutationTournamentRuns((current) => [run, ...current].slice(0, 40));
    if (run.winnerPrompt) {
      const version: PromptVersion = {
        id: `tournament-winner-${Date.now()}`,
        kind: "tournament",
        title: run.winnerTitle,
        text: run.winnerPrompt,
        score: run.winnerScore,
        createdAt: run.createdAt,
      };
      setHistory((current) => [version, ...current].slice(0, 80));
      setImproveText(run.winnerPrompt);
    }
    setModelNotice(`Mutation tournament winner: ${run.winnerTitle} (${run.winnerScore}/100).`);
  }

  function addPairwiseReview(left: PromptExample | undefined, right: PromptExample | undefined, winnerId: string, reason: string) {
    if (!left || !right || !winnerId) return;
    const winner = winnerId === left.id ? left : right;
    const loser = winnerId === left.id ? right : left;
    const now = new Date().toISOString();
    const review: PairwiseReviewRecord = {
      id: `pairwise-${Date.now()}`,
      leftId: left.id,
      rightId: right.id,
      winnerId: winner.id,
      loserId: loser.id,
      reason,
      createdAt: now,
    };
    setPairwiseReviews((current) => [review, ...current].slice(0, 200));
    updateOutcome(winner, {
      rating: "great",
      status: "gold",
      notes: `Pairwise winner over ${loser.title}. ${reason}`,
    });
    updateOutcome(loser, {
      rating: "bad",
      status: "avoid",
      notes: `Pairwise loser against ${winner.title}. ${reason}`,
    });
    setApiNotice(`Recorded pairwise winner: ${winner.title}.`);
  }

  async function runPromptCoach() {
    const source = coachInput.trim() || selectedPrompt?.text || generatedPrompt;
    try {
      const result = await evaluateWithModel({
        prompt: source,
        memory: promptMemory.markdown,
        context: {
          task: "Coach this website prompt. Return JSON with score, diagnosis, questions, and rewrittenPrompt.",
          localCoach: promptCoach,
        },
        settings: {
          provider: modelSettings.provider,
          endpoint: modelSettings.endpoint,
          apiKey: modelSettings.apiKey,
          model: modelSettings.model,
          temperature: modelSettings.temperature,
        },
      });
      setCoachResult(result);
      setModelNotice(`Prompt coach complete: ${String(result.mode || "local")}.`);
    } catch (error) {
      setCoachResult({ ...promptCoach, mode: "local-coach", error: error instanceof Error ? error.message : String(error) });
      setModelNotice("Prompt coach used local fallback.");
    }
  }

  function exportProjectPack() {
    downloadText(`prompt-atelier-project-pack-${Date.now()}.md`, projectExportPack.markdown, "text/markdown");
    downloadText(`prompt-atelier-project-pack-${Date.now()}.json`, projectExportPack.json, "application/json");
    setApiNotice("Exported project pack as markdown and JSON.");
  }

  function exportCodexBuildPack() {
    downloadText(`codex-build-pack-${Date.now()}.md`, codexBuildPack.markdown, "text/markdown");
    downloadText(`codex-build-pack-${Date.now()}.json`, codexBuildPack.json, "application/json");
    setApiNotice("Exported Codex build pack with task, queue, prompt, memory, and QA gates.");
  }

  function exportPreset(preset: ExportPreset) {
    downloadText(preset.filename, preset.content, "text/markdown");
    setApiNotice(`Exported ${preset.title} for ${preset.target}.`);
  }

  function applyGeneratorVariant(variant: LearnedGeneratorVariant) {
    setWizardIdea(variant.bestFor);
    setCompilerInput((current) => ({
      ...current,
      brandName: generatorInput.brandName,
      siteType: generatorInput.siteType,
      visualDirection: generatorInput.visualStyle,
      stack: generatorInput.stack,
      assets: generatorInput.assets,
      constraints: generatorInput.constraints,
      roughIdea: variant.bestFor,
    }));
    setImproveText(variant.prompt);
    setApiNotice(`Loaded ${variant.title} into the wizard and improvement editor.`);
  }

  function createBackupSnapshot(label = `backup-${backupSnapshots.length + 1}`) {
    const payload: Partial<StoredCollections> = {
      userPrompts,
      history,
      outcomes,
      screenshots,
      buildRuns,
      queueJobs,
      lineage: lineageNodes,
      datasetVersions,
      curationDecisions,
      modelBatchEvaluations,
      pairwiseReviews,
      activeWorkspace,
      closedLoopRuns,
      benchmarkRuns,
      claudeHealthChecks,
      promptComparisons,
      screenshotPromptRuns,
      workspacePackRuns,
    };
    const backup: TrainingBackupSnapshot = {
      id: `backup-${Date.now()}`,
      label,
      createdAt: new Date().toISOString(),
      summary: `${learningExamples.length} prompts, ${outcomes.length} labels, ${buildRuns.length} runs, ${screenshots.length} screenshots`,
      payload,
    };
    setBackupSnapshots((current) => [backup, ...current].slice(0, 8));
    setApiNotice(`Created restore point ${label}.`);
  }

  function restoreBackupSnapshot(id: string) {
    const backup = backupSnapshots.find((item) => item.id === id);
    if (!backup) return;
    const collections = backup.payload;
    if (Array.isArray(collections.userPrompts)) setUserPrompts(collections.userPrompts);
    if (Array.isArray(collections.history)) setHistory(collections.history);
    if (Array.isArray(collections.outcomes)) setOutcomes(collections.outcomes);
    if (Array.isArray(collections.screenshots)) setScreenshots(collections.screenshots);
    if (Array.isArray(collections.buildRuns)) setBuildRuns(collections.buildRuns);
    if (Array.isArray(collections.queueJobs)) setQueueJobs(collections.queueJobs);
    if (Array.isArray(collections.lineage)) setLineageNodes(collections.lineage);
    if (Array.isArray(collections.datasetVersions)) setDatasetVersions(collections.datasetVersions);
    if (collections.curationDecisions) setCurationDecisions(collections.curationDecisions);
    if (Array.isArray(collections.modelBatchEvaluations)) setModelBatchEvaluations(collections.modelBatchEvaluations);
    if (Array.isArray(collections.pairwiseReviews)) setPairwiseReviews(collections.pairwiseReviews);
    if (Array.isArray(collections.closedLoopRuns)) setClosedLoopRuns(collections.closedLoopRuns);
    if (Array.isArray(collections.benchmarkRuns)) setBenchmarkRuns(collections.benchmarkRuns);
    if (Array.isArray(collections.claudeHealthChecks)) setClaudeHealthChecks(collections.claudeHealthChecks);
    if (Array.isArray(collections.promptComparisons)) setPromptComparisons(collections.promptComparisons);
    if (Array.isArray(collections.screenshotPromptRuns)) setScreenshotPromptRuns(collections.screenshotPromptRuns);
    if (Array.isArray(collections.workspacePackRuns)) setWorkspacePackRuns(collections.workspacePackRuns);
    if (Array.isArray(collections.proofLearningRuns)) setProofLearningRuns(collections.proofLearningRuns);
    if (Array.isArray(collections.screenshotJudgeRuns)) setScreenshotJudgeRuns(collections.screenshotJudgeRuns);
    if (Array.isArray(collections.mutationTournamentRuns)) setMutationTournamentRuns(collections.mutationTournamentRuns);
    if (isWorkspaceKey(collections.activeWorkspace)) setActiveWorkspace(collections.activeWorkspace);
    setApiNotice(`Restored ${backup.label}.`);
  }

  function exportBackupSnapshot(id?: string) {
    const backup = backupSnapshots.find((item) => item.id === id) ?? backupSnapshots[0];
    if (!backup) return;
    downloadText(`${slugify(backup.label) || "prompt-atelier-backup"}.json`, JSON.stringify(backup, null, 2), "application/json");
  }

  function bulkPromoteLeaderboard() {
    const topIds = new Set(experimentLeaderboard.items.slice(0, 5).map((item) => item.promptId));
    const now = new Date().toISOString();
    const promoted = learningExamples.filter((example) => topIds.has(example.id));
    setOutcomes((current) => {
      const rest = current.filter((item) => !topIds.has(item.promptId));
      return [
        ...promoted.map((example) => ({
          promptId: example.id,
          title: example.title,
          rating: "great" as OutcomeRating,
          status: "gold" as const,
          notes: "Bulk promoted from experiment leaderboard.",
          createdAt: now,
          updatedAt: now,
        })),
        ...rest,
      ].slice(0, 160);
    });
    setApiNotice(`Promoted ${promoted.length} leaderboard prompt(s) to gold.`);
  }

  function quarantineWeakCorpus() {
    const weak = curationReport.items.filter((item) => item.recommendation === "quarantine" || item.confidence < 45).slice(0, 20);
    setCurationDecisions((current) => ({
      ...current,
      ...Object.fromEntries(weak.map((item) => [item.promptId, "quarantine" as CurationDecision])),
    }));
    setApiNotice(`Quarantined ${weak.length} weak corpus item(s).`);
  }

  function chooseOnboardingMode(mode: OnboardingMode) {
    setOnboardingMode(mode);
    if (mode === "demo") loadDemoMode();
    if (mode === "upload") setTab("learn");
    if (mode === "blank") setTab("compose");
  }

  async function refreshApiEvents() {
    try {
      const result = await getApiEvents(40);
      setApiEvents(result.events);
      setApiNotice(`Loaded ${result.events.length} API event(s).`);
    } catch (error) {
      setApiEvents([]);
      setApiNotice(`API events unavailable: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function loadDemoMode() {
    const demoPrompts = learningExamples.slice(0, 5);
    const now = new Date().toISOString();
    const demoOutcomes = demoPrompts.map((prompt, index) => ({
      promptId: prompt.id,
      title: prompt.title,
      rating: index < 3 ? "great" : "okay",
      status: index < 3 ? "gold" : "good",
      notes: index < 3 ? "Demo gold label: strong exact website prompt." : "Demo good label: useful but needs result proof.",
      createdAt: now,
      updatedAt: now,
    })) satisfies OutcomeRecord[];
    const demoRuns = demoPrompts.slice(0, 3).map((prompt, index) => {
      const run: BuildRunRecord = {
        id: `demo-run-${prompt.id}`,
        promptId: prompt.id,
        promptTitle: prompt.title,
        promptText: prompt.text,
        status: "passed",
        resultUrl: "https://zakiefer.github.io/prompt-atelier/",
        folderPath: "demo",
        screenshotUrl: "",
        filesChanged: "demo",
        errors: "",
        notes: "Demo proof row for public hosted mode.",
        score: 82 + index * 4,
        failureCategories: [],
        createdAt: now,
        updatedAt: now,
      };
      return run;
    });
    const demoScreenshots = demoPrompts.slice(0, 3).map((prompt, index) => ({
      id: `demo-shot-${prompt.id}`,
      promptId: prompt.id,
      title: `${prompt.title} demo screenshot`,
      url: `demo://screenshot-${index + 1}`,
      notes: "Demo screenshot placeholder for public mode.",
      rating: "great",
      createdAt: now,
    })) satisfies ScreenshotRecord[];
    setOutcomes((current) => [...demoOutcomes, ...current.filter((item) => !demoOutcomes.some((demo) => demo.promptId === item.promptId))].slice(0, 120));
    setBuildRuns((current) => [...demoRuns, ...current.filter((item) => !demoRuns.some((demo) => demo.id === item.id))].slice(0, 120));
    setScreenshots((current) => [...demoScreenshots, ...current.filter((item) => !demoScreenshots.some((demo) => demo.id === item.id))].slice(0, 120));
    setModelBatchEvaluations((current) => [
      ...demoPrompts.slice(0, 5).map((prompt, index) => ({
        id: `demo-model-${prompt.id}`,
        promptId: prompt.id,
        title: prompt.title,
        score: 76 + index * 3,
        readiness: index < 3 ? "excellent" : "ready",
        mode: "demo",
        findings: ["Demo calibration row for public mode."],
        createdAt: now,
      })),
      ...current,
    ].slice(0, 200));
    const demoVersion = createDatasetVersionSnapshot({
      buildRuns: [...demoRuns, ...buildRuns],
      examples: learningExamples,
      label: `demo-${datasetVersions.length + 1}`,
      outcomes: [...demoOutcomes, ...outcomes],
      score: scoreBreakdown,
      screenshots: [...demoScreenshots, ...screenshots],
    });
    setDatasetVersions((current) => [demoVersion, ...current].slice(0, 20));
    setApiNotice("Loaded demo labels, runs, screenshots, and model rows for public mode.");
  }

  function applyGoldReview() {
    const winner = examples.find((example) => example.id === goldReview.winnerId);
    const loser = examples.find((example) => example.id === goldReview.loserId);
    if (winner) {
      updateOutcome(winner, {
        rating: "great",
        status: "gold",
        notes: `Gold review winner. ${goldReview.learningUpdates.join(" ")}`,
      });
    }
    if (loser) {
      updateOutcome(loser, {
        rating: "bad",
        status: "avoid",
        notes: `Gold review loser. Compare against ${winner?.title ?? "winner"} before reusing this pattern.`,
      });
    }
    setApiNotice(winner ? `Marked ${winner.title} gold${loser ? ` and ${loser.title} avoid` : ""}.` : "No review winner selected.");
  }

  function applyGeneratorPreset(preset: GeneratorPreset) {
    setWizardIdea(preset.bestFor);
    setCompilerInput((current) => ({
      ...current,
      roughIdea: preset.bestFor,
      brandName: preset.title.replace(/[^A-Za-z0-9]+/g, " ").trim() || current.brandName,
      siteType: preset.archetype.includes("Section") ? "marketing section" : "single-page landing hero",
      visualDirection: preset.signals.join(", ") || current.visualDirection,
    }));
    setActiveTrainStage("Wizard");
    setApiNotice(`Loaded ${preset.title} into the one-click wizard.`);
  }

  function applyProviderPreset(kind: "local" | "anthropic" | "openai-compatible" | "codex-agent" | "scaffold-build") {
    setModelSettings((current) => {
      if (kind === "local") {
        return { ...current, provider: "local", endpoint: "", apiKey: "", model: "local-fallback", temperature: 0.2 };
      }
      if (kind === "anthropic") {
        return {
          ...current,
          provider: "anthropic",
          endpoint: current.endpoint || "https://api.anthropic.com/v1/messages",
          model: current.model === "local-fallback" ? "claude-sonnet-5" : current.model,
          temperature: 0.2,
        };
      }
      if (kind === "openai-compatible") {
        return {
          ...current,
          provider: "openai-compatible",
          endpoint: current.endpoint || "http://127.0.0.1:8788/evaluate",
          model: current.model === "local-fallback" ? "gpt-5" : current.model,
          temperature: 0.2,
        };
      }
      if (kind === "codex-agent") {
        return {
          ...current,
          agentCommand: current.agentCommand || "codex exec --full-auto --prompt-file codex-task.md",
        };
      }
      return {
        ...current,
        buildCommand: current.buildCommand || "npm run build",
      };
    });
    setApiNotice(`Applied ${kind} provider preset.`);
  }

  function exportReusableMemoryPack() {
    downloadText("website-prompt-memory-pack.md", reusableMemoryPack.markdown, "text/markdown");
    downloadText("website-prompt-memory-pack.json", reusableMemoryPack.json, "application/json");
    setApiNotice("Exported reusable memory pack as markdown and JSON.");
  }

  async function runAutonomousBattle() {
    if (!selectedPrompt) return;
    const jobs = promptBattle.variants.map((variant) =>
      createBuildQueueJob(selectedPrompt, variant, selectedBuildRun?.resultUrl || "http://127.0.0.1:5173"),
    );
    setQueueJobs((current) => [...jobs, ...current].slice(0, 140));
    try {
      const result = await runQueue(
        { jobs },
        "",
        {
          agentCommand: modelSettings.agentCommand,
          buildCommand: modelSettings.buildCommand || "npm run build",
          capture: Boolean(selectedBuildRun?.resultUrl),
          install: true,
          scaffold: true,
        },
      );
      const parsed = result.parsed as { results?: (Partial<BuildRunRecord> & { variantTitle?: string; runFolder?: string })[] } | null;
      const normalizedRuns = (parsed?.results ?? []).map((raw) => {
        const now = new Date().toISOString();
        const rawStatus = String(raw.status || "");
        const run: BuildRunRecord = {
          id: raw.id || `auto-battle-${Date.now()}`,
          promptId: raw.promptId || selectedPrompt.id,
          promptTitle: raw.promptTitle || raw.variantTitle || selectedPrompt.title,
          promptText: raw.promptText || selectedPrompt.text,
          status: rawStatus === "passed" || rawStatus === "failed" || rawStatus === "needs-review" ? rawStatus : rawStatus === "completed" ? "passed" : "needs-review",
          resultUrl: raw.resultUrl || "",
          folderPath: raw.folderPath || raw.runFolder || "",
          screenshotUrl: raw.screenshotUrl || "",
          filesChanged: raw.filesChanged || "",
          errors: raw.errors || "",
          notes: raw.notes || "Autonomous battle scaffold/build result.",
          score: 0,
          failureCategories: [],
          createdAt: raw.createdAt || now,
          updatedAt: raw.updatedAt || now,
        };
        const scored = scoreResultArtifact(selectedPrompt, undefined, run);
        return { ...run, score: scored.score, failureCategories: scored.failureCategories };
      });
      if (normalizedRuns.length) {
        setBuildRuns((current) => [...normalizedRuns, ...current.filter((run) => !normalizedRuns.some((item) => item.id === run.id))].slice(0, 120));
        for (const run of normalizedRuns) {
          addLineageNode({
            id: `lineage-auto-battle-${run.id}`,
            parentId: `lineage-source-${selectedPrompt.id}`,
            promptId: selectedPrompt.id,
            kind: "build",
            title: run.promptTitle,
            score: run.score,
            status: run.status,
            detail: run.folderPath || run.resultUrl || "Autonomous battle run.",
            createdAt: run.updatedAt,
          });
        }
      }
      const winner = [...normalizedRuns].sort((a, b) => b.score - a.score)[0];
      setAutoBattleResult({
        ok: result.ok,
        processed: normalizedRuns.length,
        winner: winner?.promptTitle ?? promptBattle.winner.title,
        winnerScore: winner?.score ?? promptBattle.winner.score,
        results: normalizedRuns.map((run) => ({ title: run.promptTitle, score: run.score, status: run.status })),
      });
      setApiNotice(result.ok ? `Autonomous battle processed ${normalizedRuns.length || jobs.length} variant(s).` : result.stderr || "Autonomous battle failed.");
    } catch (error) {
      setAutoBattleResult({ ok: false, error: error instanceof Error ? error.message : String(error) });
      setApiNotice(`Autonomous battle failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function removeQueueJob(id: string) {
    setQueueJobs((current) => current.filter((job) => job.id !== id));
  }

  function exportQueue() {
    downloadText("prompt-lab-queue.json", queueExport, "application/json");
  }

  async function checkApi() {
    try {
      const health = await getApiHealth();
      setApiHealth(health);
      setApiNotice(`API online: ${health.sqlitePath}`);
    } catch (error) {
      setApiHealth(undefined);
      setApiNotice(`API offline. Start it with npm run api. ${error instanceof Error ? error.message : ""}`.trim());
    }
  }

  async function syncToApi() {
    try {
      const payload = {
        userPrompts,
        history,
        outcomes,
        screenshots,
        buildRuns,
        queueJobs,
        lineage: lineageNodes,
        datasetVersions,
        curationDecisions,
        modelBatchEvaluations,
        pairwiseReviews,
        backupSnapshots,
        activeWorkspace,
        closedLoopRuns,
        benchmarkRuns,
        claudeHealthChecks,
        promptComparisons,
        screenshotPromptRuns,
        workspacePackRuns,
        proofLearningRuns,
        screenshotJudgeRuns,
        mutationTournamentRuns,
      };
      await syncCollections(payload);
      setApiNotice("Synced browser state to SQLite.");
      void checkApi();
    } catch (error) {
      setApiNotice(`Sync failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function pullFromApi() {
    try {
      const result = await getApiCollections();
      const collections = result.collections as Partial<Record<keyof StoredCollections, unknown>>;
      const restored: string[] = [];
      if (Array.isArray(collections.userPrompts)) {
        setUserPrompts(collections.userPrompts as PromptExample[]);
        restored.push("prompts");
      }
      if (Array.isArray(collections.history)) {
        setHistory(collections.history as PromptVersion[]);
        restored.push("history");
      }
      if (Array.isArray(collections.outcomes)) {
        setOutcomes(collections.outcomes as OutcomeRecord[]);
        restored.push("outcomes");
      }
      if (Array.isArray(collections.screenshots)) {
        setScreenshots(collections.screenshots as ScreenshotRecord[]);
        restored.push("screenshots");
      }
      if (Array.isArray(collections.buildRuns)) {
        setBuildRuns(collections.buildRuns as BuildRunRecord[]);
        restored.push("runs");
      }
      if (Array.isArray(collections.queueJobs)) {
        setQueueJobs(collections.queueJobs as BuildQueueJob[]);
        restored.push("queue");
      }
      if (Array.isArray(collections.lineage)) {
        setLineageNodes(collections.lineage as PromptLineageNode[]);
        restored.push("lineage");
      }
      if (Array.isArray(collections.datasetVersions)) {
        setDatasetVersions((collections.datasetVersions as DatasetVersion[]).slice(0, 20));
        restored.push("versions");
      }
      if (collections.curationDecisions && typeof collections.curationDecisions === "object" && !Array.isArray(collections.curationDecisions)) {
        setCurationDecisions(collections.curationDecisions as Record<string, CurationDecision>);
        restored.push("curation");
      }
      if (Array.isArray(collections.modelBatchEvaluations)) {
        setModelBatchEvaluations((collections.modelBatchEvaluations as ModelBatchEvaluation[]).slice(0, 200));
        restored.push("model rows");
      }
      if (Array.isArray(collections.pairwiseReviews)) {
        setPairwiseReviews((collections.pairwiseReviews as PairwiseReviewRecord[]).slice(0, 200));
        restored.push("pairwise reviews");
      }
      if (Array.isArray(collections.backupSnapshots)) {
        setBackupSnapshots((collections.backupSnapshots as TrainingBackupSnapshot[]).slice(0, 8));
        restored.push("backups");
      }
      if (Array.isArray(collections.closedLoopRuns)) {
        setClosedLoopRuns((collections.closedLoopRuns as ClosedLoopRun[]).slice(0, 40));
        restored.push("closed-loop runs");
      }
      if (Array.isArray(collections.benchmarkRuns)) {
        setBenchmarkRuns((collections.benchmarkRuns as BenchmarkRun[]).slice(0, 20));
        restored.push("benchmark runs");
      }
      if (Array.isArray(collections.claudeHealthChecks)) {
        setClaudeHealthChecks((collections.claudeHealthChecks as HostedClaudeHealthCheck[]).slice(0, 20));
        restored.push("Claude health");
      }
      if (Array.isArray(collections.promptComparisons)) {
        setPromptComparisons((collections.promptComparisons as PromptComparisonRun[]).slice(0, 40));
        restored.push("prompt comparisons");
      }
      if (Array.isArray(collections.screenshotPromptRuns)) {
        setScreenshotPromptRuns((collections.screenshotPromptRuns as ScreenshotPromptRun[]).slice(0, 40));
        restored.push("screenshot prompts");
      }
      if (Array.isArray(collections.workspacePackRuns)) {
        setWorkspacePackRuns((collections.workspacePackRuns as WorkspacePackRun[]).slice(0, 20));
        restored.push("workspace packs");
      }
      if (Array.isArray(collections.proofLearningRuns)) {
        setProofLearningRuns((collections.proofLearningRuns as ProofLearningRun[]).slice(0, 40));
        restored.push("proof loops");
      }
      if (Array.isArray(collections.screenshotJudgeRuns)) {
        setScreenshotJudgeRuns((collections.screenshotJudgeRuns as ScreenshotJudgeRun[]).slice(0, 40));
        restored.push("screenshot judges");
      }
      if (Array.isArray(collections.mutationTournamentRuns)) {
        setMutationTournamentRuns((collections.mutationTournamentRuns as MutationTournamentRun[]).slice(0, 40));
        restored.push("mutation tournaments");
      }
      if (isWorkspaceKey(collections.activeWorkspace)) {
        setActiveWorkspace(collections.activeWorkspace);
        restored.push("workspace");
      }
      setDbReady(true);
      setDbStatus("SQLite source of truth ready");
      setApiNotice(restored.length ? `Pulled ${restored.join(", ")} from API.` : "API is online but has no stored collections yet.");
      void checkApi();
    } catch (error) {
      setApiNotice(`API pull failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function exportTrainingSnapshot() {
    try {
      const snapshot = await getTrainingSnapshot();
      downloadText(`prompt-atelier-training-snapshot-${Date.now()}.json`, JSON.stringify(snapshot, null, 2), "application/json");
      setApiNotice("Downloaded full training snapshot from SQLite.");
    } catch (error) {
      const fallback = {
        version: 1,
        exportedAt: new Date().toISOString(),
        source: "browser-fallback",
        collections: { userPrompts, history, outcomes, screenshots, buildRuns, queueJobs, lineage: lineageNodes, datasetVersions, curationDecisions, modelBatchEvaluations, pairwiseReviews, backupSnapshots, activeWorkspace, closedLoopRuns, benchmarkRuns, claudeHealthChecks, promptComparisons, screenshotPromptRuns, workspacePackRuns, proofLearningRuns, screenshotJudgeRuns, mutationTournamentRuns },
        skill: codexSkill,
        promptMemory,
        scoring: { scoreWeights, scoreBreakdown },
        failureMemory,
        corpusCleaning,
        localIndex,
      };
      downloadText(`prompt-atelier-training-snapshot-${Date.now()}.json`, JSON.stringify(fallback, null, 2), "application/json");
      setApiNotice(`API snapshot unavailable; downloaded browser fallback. ${error instanceof Error ? error.message : ""}`.trim());
    }
  }

  async function importTrainingSnapshotText() {
    try {
      const parsed = JSON.parse(snapshotImportText) as { collections?: Partial<StoredCollections>; scoring?: { scoreWeights?: ScoreWeights } } & Partial<StoredCollections>;
      const collections = parsed.collections ?? parsed;
      const restored: string[] = [];

      if (Array.isArray(collections.userPrompts)) {
        setUserPrompts(collections.userPrompts as PromptExample[]);
        restored.push("prompts");
      }
      if (Array.isArray(collections.history)) {
        setHistory(collections.history as PromptVersion[]);
        restored.push("history");
      }
      if (Array.isArray(collections.outcomes)) {
        setOutcomes(collections.outcomes as OutcomeRecord[]);
        restored.push("outcomes");
      }
      if (Array.isArray(collections.screenshots)) {
        setScreenshots(collections.screenshots as ScreenshotRecord[]);
        restored.push("screenshots");
      }
      if (Array.isArray(collections.buildRuns)) {
        setBuildRuns(collections.buildRuns as BuildRunRecord[]);
        restored.push("runs");
      }
      if (Array.isArray(collections.queueJobs)) {
        setQueueJobs(collections.queueJobs as BuildQueueJob[]);
        restored.push("queue");
      }
      if (Array.isArray(collections.lineage)) {
        setLineageNodes(collections.lineage as PromptLineageNode[]);
        restored.push("lineage");
      }
      if (Array.isArray(collections.datasetVersions)) {
        setDatasetVersions((collections.datasetVersions as DatasetVersion[]).slice(0, 20));
        restored.push("dataset versions");
      }
      if (collections.curationDecisions && typeof collections.curationDecisions === "object" && !Array.isArray(collections.curationDecisions)) {
        setCurationDecisions(collections.curationDecisions as Record<string, CurationDecision>);
        restored.push("curation");
      }
      if (Array.isArray(collections.modelBatchEvaluations)) {
        setModelBatchEvaluations((collections.modelBatchEvaluations as ModelBatchEvaluation[]).slice(0, 200));
        restored.push("model batch history");
      }
      if (Array.isArray(collections.pairwiseReviews)) {
        setPairwiseReviews((collections.pairwiseReviews as PairwiseReviewRecord[]).slice(0, 200));
        restored.push("pairwise labels");
      }
      if (Array.isArray(collections.backupSnapshots)) {
        setBackupSnapshots((collections.backupSnapshots as TrainingBackupSnapshot[]).slice(0, 8));
        restored.push("backups");
      }
      if (Array.isArray(collections.closedLoopRuns)) {
        setClosedLoopRuns((collections.closedLoopRuns as ClosedLoopRun[]).slice(0, 40));
        restored.push("closed-loop runs");
      }
      if (Array.isArray(collections.benchmarkRuns)) {
        setBenchmarkRuns((collections.benchmarkRuns as BenchmarkRun[]).slice(0, 20));
        restored.push("benchmark runs");
      }
      if (Array.isArray(collections.claudeHealthChecks)) {
        setClaudeHealthChecks((collections.claudeHealthChecks as HostedClaudeHealthCheck[]).slice(0, 20));
        restored.push("Claude health");
      }
      if (Array.isArray(collections.promptComparisons)) {
        setPromptComparisons((collections.promptComparisons as PromptComparisonRun[]).slice(0, 40));
        restored.push("prompt comparisons");
      }
      if (Array.isArray(collections.screenshotPromptRuns)) {
        setScreenshotPromptRuns((collections.screenshotPromptRuns as ScreenshotPromptRun[]).slice(0, 40));
        restored.push("screenshot prompts");
      }
      if (Array.isArray(collections.workspacePackRuns)) {
        setWorkspacePackRuns((collections.workspacePackRuns as WorkspacePackRun[]).slice(0, 20));
        restored.push("workspace packs");
      }
      if (Array.isArray(collections.proofLearningRuns)) {
        setProofLearningRuns((collections.proofLearningRuns as ProofLearningRun[]).slice(0, 40));
        restored.push("proof loops");
      }
      if (Array.isArray(collections.screenshotJudgeRuns)) {
        setScreenshotJudgeRuns((collections.screenshotJudgeRuns as ScreenshotJudgeRun[]).slice(0, 40));
        restored.push("screenshot judges");
      }
      if (Array.isArray(collections.mutationTournamentRuns)) {
        setMutationTournamentRuns((collections.mutationTournamentRuns as MutationTournamentRun[]).slice(0, 40));
        restored.push("mutation tournaments");
      }
      if (isWorkspaceKey(collections.activeWorkspace)) {
        setActiveWorkspace(collections.activeWorkspace);
        restored.push("workspace");
      }
      if (parsed.scoring?.scoreWeights && typeof parsed.scoring.scoreWeights === "object") {
        setScoreWeights(parsed.scoring.scoreWeights);
        restored.push("weights");
      }

      if (!restored.length) {
        setApiNotice("Snapshot import found no supported collections.");
        return;
      }
      if (apiHealth?.ok) {
        await syncCollections({
          userPrompts: collections.userPrompts ?? userPrompts,
          history: collections.history ?? history,
          outcomes: collections.outcomes ?? outcomes,
          screenshots: collections.screenshots ?? screenshots,
          buildRuns: collections.buildRuns ?? buildRuns,
          queueJobs: collections.queueJobs ?? queueJobs,
          lineage: collections.lineage ?? lineageNodes,
          datasetVersions: collections.datasetVersions ?? datasetVersions,
          curationDecisions: collections.curationDecisions ?? curationDecisions,
          modelBatchEvaluations: collections.modelBatchEvaluations ?? modelBatchEvaluations,
          pairwiseReviews: collections.pairwiseReviews ?? pairwiseReviews,
          backupSnapshots: collections.backupSnapshots ?? backupSnapshots,
          activeWorkspace: isWorkspaceKey(collections.activeWorkspace) ? collections.activeWorkspace : activeWorkspace,
          closedLoopRuns: collections.closedLoopRuns ?? closedLoopRuns,
          benchmarkRuns: collections.benchmarkRuns ?? benchmarkRuns,
          claudeHealthChecks: collections.claudeHealthChecks ?? claudeHealthChecks,
          promptComparisons: collections.promptComparisons ?? promptComparisons,
          screenshotPromptRuns: collections.screenshotPromptRuns ?? screenshotPromptRuns,
          workspacePackRuns: collections.workspacePackRuns ?? workspacePackRuns,
          proofLearningRuns: collections.proofLearningRuns ?? proofLearningRuns,
          screenshotJudgeRuns: collections.screenshotJudgeRuns ?? screenshotJudgeRuns,
          mutationTournamentRuns: collections.mutationTournamentRuns ?? mutationTournamentRuns,
        });
      }
      setSnapshotImportText("");
      setApiNotice(`Restored snapshot collections: ${restored.join(", ")}.`);
    } catch (error) {
      setApiNotice(`Snapshot restore failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function installSkillFromApi() {
    try {
      const result = await installSkill(codexSkill);
      setApiHealth((current) => (current ? { ...current, skill: result.skill } : current));
      setApiNotice(`Installed skill to ${result.skill.path}`);
    } catch (error) {
      setApiNotice(`Skill install failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function runQueueViaApi() {
    try {
      const result = await runQueue(JSON.parse(queueExport), "", {
        agentCommand: modelSettings.agentCommand,
        buildCommand: modelSettings.buildCommand,
        install: true,
        scaffold: true,
      });
      setApiNotice(result.ok ? "API processed queue and scaffolded build folders. Import queue-result.json outputs to train." : result.stderr || "Queue run failed.");
    } catch (error) {
      setApiNotice(`Queue run failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function captureSelectedResult() {
    if (!selectedPrompt) return;
    const url = selectedBuildRun?.resultUrl || "http://127.0.0.1:5173";
    try {
      const out = selectedBuildRun?.folderPath ? `${selectedBuildRun.folderPath}/screenshots` : "output/playwright/prompt-atelier-selected";
      const result = await captureResult(url, out);
      const parsed = result.parsed as
        | {
            desktop?: { path?: string };
            mobile?: { path?: string };
            notes?: string[];
            score?: number;
          }
        | null;
      const rating: OutcomeRating = parsed?.score && parsed.score >= 75 ? "great" : "okay";
      if (parsed?.desktop?.path) {
        addScreenshot({
          promptId: selectedPrompt.id,
          title: `${selectedPrompt.title} desktop capture`,
          url: parsed.desktop.path,
          notes: parsed.notes?.join(" ") || `Captured from ${url}`,
          rating,
        });
      }
      if (parsed?.mobile?.path) {
        addScreenshot({
          promptId: selectedPrompt.id,
          title: `${selectedPrompt.title} mobile capture`,
          url: parsed.mobile.path,
          notes: parsed.notes?.join(" ") || `Captured from ${url}`,
          rating,
        });
      }
      setApiNotice(result.ok ? `Captured screenshots from ${url}.` : result.stderr || "Capture failed.");
    } catch (error) {
      setApiNotice(`Capture failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function analyzeSelectedVisuals() {
    const files = [
      selectedBuildRun?.screenshotUrl,
      ...selectedScreenshots.map((screenshot) => screenshot.url),
    ].filter(Boolean) as string[];
    if (!files.length) {
      setApiNotice("No screenshot paths available for visual analysis.");
      return;
    }
    try {
      const result = await analyzeScreenshots(files.slice(0, 4));
      setVisualAnalysisResult((result.parsed as Record<string, unknown>) ?? { stdout: result.stdout });
      setApiNotice(result.ok ? "Pixel-level screenshot analysis complete." : result.stderr || "Visual analysis failed.");
    } catch (error) {
      setApiNotice(`Visual analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function runAutomatedVisualQa() {
    if (!selectedPrompt) return;
    const url = selectedBuildRun?.resultUrl || "http://127.0.0.1:5173";
    const out = selectedBuildRun?.folderPath ? `${selectedBuildRun.folderPath}/visual-qa` : "output/visual-qa/selected";
    try {
      const result = await runVisualQa(url, out);
      const parsed = result.parsed as
        | {
            ok?: boolean;
            score?: number;
            status?: string;
            outDir?: string;
            failedChecks?: string[];
            notes?: string[];
            results?: { label?: string; screenshotPath?: string; score?: number }[];
          }
        | null;
      setVisualAnalysisResult((parsed as Record<string, unknown>) ?? { stdout: result.stdout });
      const score = Number(parsed?.score || 0);
      const notes = parsed?.notes?.join(" ") || parsed?.failedChecks?.join(" ") || "Automated visual QA completed.";
      addBuildRun(selectedPrompt, {
        status: parsed?.ok ? "passed" : "needs-review",
        resultUrl: url,
        folderPath: parsed?.outDir || out,
        screenshotUrl: parsed?.results?.find((item) => item.label === "desktop")?.screenshotPath || "",
        filesChanged: "Automated visual QA evidence",
        errors: parsed?.failedChecks?.join("\n") || "",
        notes: `${notes} Score ${score}.`,
      });
      for (const item of parsed?.results || []) {
        if (!item.screenshotPath) continue;
        addScreenshot({
          promptId: selectedPrompt.id,
          title: `${selectedPrompt.title} ${item.label || "visual"} QA`,
          url: item.screenshotPath,
          notes: `Automated visual QA ${item.label || "viewport"} score ${item.score ?? "n/a"}. ${notes}`,
          rating: score >= 78 ? "great" : score >= 52 ? "okay" : "bad",
        });
      }
      setApiNotice(result.ok ? `Automated visual QA complete for ${url}.` : result.stderr || "Automated visual QA failed.");
    } catch (error) {
      setApiNotice(`Automated visual QA failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function runOneClickBuildProof() {
    if (!selectedPrompt) {
      setApiNotice("Select a prompt before running one-click proof.");
      return;
    }
    const job = createBuildQueueJob(selectedPrompt, undefined, selectedBuildRun?.resultUrl || "");
    const queue = {
      version: 1,
      exportedAt: new Date().toISOString(),
      jobs: [job],
    };
    setQueueJobs((current) => [job, ...current.filter((item) => item.id !== job.id)].slice(0, 140));
    setApiNotice("Running one-click proof: scaffold, install, build, preview, and capture screenshots...");
    try {
      const result = await runQueue(queue, job.id, {
        buildCommand: modelSettings.buildCommand || "npm run build",
        capture: true,
        install: true,
        scaffold: true,
      });
      const parsed = result.parsed as
        | {
            results?: Array<Partial<BuildQueueJob> & {
              promptTitle?: string;
              promptText?: string;
              variantTitle?: string;
              screenshotUrl?: string;
              runFolder?: string;
              filesChanged?: string;
              errors?: string;
              notes?: string;
              status?: string;
              score?: number;
              resultUrl?: string;
              updatedAt?: string;
            }>;
          }
        | undefined;
      const first = parsed?.results?.[0];
      if (!first) {
        setApiNotice("One-click proof runner finished but did not return a queue result. Check API events.");
        return;
      }
      const normalized = await importResult<BuildRunRecord, ScreenshotRecord, PromptLineageNode>({
        ...first,
        promptId: selectedPrompt.id,
        promptTitle: selectedPrompt.title,
        promptText: selectedPrompt.text,
      });
      setBuildRuns((current) => [normalized.buildRun, ...current.filter((run) => run.id !== normalized.buildRun.id)].slice(0, 100));
      const screenshotsToAdd = normalized.screenshot ? [normalized.screenshot] : [];
      const mobilePath = first.runFolder ? `${first.runFolder}/screenshots/mobile.png` : "";
      if (mobilePath) {
        screenshotsToAdd.push({
          id: `screenshot-mobile-${Date.now()}`,
          promptId: selectedPrompt.id,
          title: `${selectedPrompt.title} mobile`,
          url: mobilePath,
          notes: `Mobile capture from one-click proof. ${first.notes || ""}`.trim(),
          rating: normalized.buildRun.status === "passed" ? "great" : "unrated",
          createdAt: normalized.buildRun.updatedAt,
        });
      }
      if (screenshotsToAdd.length) {
        setScreenshots((current) => [...screenshotsToAdd, ...current].slice(0, 100));
      }
      addLineageNode(normalized.lineage);
      const scored = scoreResultArtifact(selectedPrompt, screenshotsToAdd[0], normalized.buildRun);
      const proofScore = Math.round((evaluatePrompt(selectedPrompt.text).score + scored.score + dnaV2.overall) / 3);
      const learnedStatus: ProofLearningRun["learnedStatus"] = proofScore >= 82 ? "gold" : proofScore >= 70 ? "good" : proofScore >= 52 ? "experimental" : "avoid";
      const proofRun: ProofLearningRun = {
        id: `proof-loop-auto-${Date.now()}`,
        createdAt: new Date().toISOString(),
        promptId: selectedPrompt.id,
        title: selectedPrompt.title,
        queueJobId: job.id,
        buildRunId: normalized.buildRun.id,
        phase: "learned",
        promptScore: evaluatePrompt(selectedPrompt.text).score,
        resultScore: scored.score,
        visualScore: screenshotQa.score,
        dnaScore: dnaV2.overall,
        learnedStatus,
        screenshotCount: screenshotsToAdd.length,
        notes: [
          "One-click proof scaffolded, built, previewed, captured desktop/mobile screenshots, and imported the result.",
          ...scored.recommendations.slice(0, 4),
        ],
      };
      setProofLearningRuns((current) => [proofRun, ...current].slice(0, 40));
      updateOutcome(selectedPrompt, {
        rating: learnedStatus === "gold" ? "great" : learnedStatus === "avoid" ? "bad" : "okay",
        status: learnedStatus,
        notes: proofRun.notes.join(" "),
      });
      setActiveTrainStage("Analyze");
      setApiNotice(`One-click proof complete: ${learnedStatus}, ${screenshotsToAdd.length} screenshot(s), result ${scored.score}/100.`);
    } catch (error) {
      setApiNotice(`One-click proof failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function connectHostedBrain() {
    saveApiBase();
    try {
      const [health, settings] = await Promise.all([getApiHealth(), getModelSettings()]);
      setApiHealth(health);
      setModelEnvStatus(settings as Record<string, boolean>);
      setApiNotice(`Hosted brain connected: ${health.sqlitePath}${settings.anthropicApiKeyConfigured ? " with Claude key." : " with local fallback."}`);
    } catch (error) {
      setApiHealth(undefined);
      setApiNotice(`Hosted brain connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function quarantineOffProjectPrompts() {
    if (activeWorkspace === "all") {
      setApiNotice("Choose an isolated workspace before quarantining off-project prompts.");
      return;
    }
    const ids = projectBoundaryReport.outOfScope.map((prompt) => prompt.id);
    if (!ids.length) {
      setApiNotice(`${activeWorkspacePreset.label} has no visible off-project prompts to quarantine.`);
      return;
    }
    setCurationDecisions((current) => {
      const next = { ...current };
      for (const id of ids) next[id] = "quarantine";
      return next;
    });
    setApiNotice(`Marked ${ids.length} off-project prompt(s) as quarantine for ${activeWorkspacePreset.label}.`);
  }

  async function importResultJson() {
    try {
      const parsed = JSON.parse(resultImportText) as unknown;
      let normalized:
        | {
            buildRun: BuildRunRecord;
            screenshot: ScreenshotRecord | null;
            lineage: PromptLineageNode;
          }
        | undefined;
      try {
        normalized = await importResult<BuildRunRecord, ScreenshotRecord, PromptLineageNode>(parsed);
      } catch {
        normalized = undefined;
      }
      if (normalized?.buildRun) {
        setBuildRuns((current) => [normalized.buildRun, ...current.filter((run) => run.id !== normalized?.buildRun.id)].slice(0, 100));
        if (normalized.screenshot) setScreenshots((current) => [normalized!.screenshot!, ...current].slice(0, 100));
        addLineageNode(normalized.lineage);
        setApiNotice("Imported result through API and updated local state.");
      } else {
        const raw = parsed as Partial<BuildRunRecord> & { runFolder?: string; variantTitle?: string };
        const now = new Date().toISOString();
        const buildRun: BuildRunRecord = {
          id: raw.id || `import-${Date.now()}`,
          promptId: raw.promptId || selectedPrompt?.id || `imported-${Date.now()}`,
          promptTitle: raw.promptTitle || raw.variantTitle || selectedPrompt?.title || "Imported result",
          promptText: raw.promptText || selectedPrompt?.text || "",
          status: raw.status === "passed" || raw.status === "failed" || raw.status === "needs-review" ? raw.status : "needs-review",
          resultUrl: raw.resultUrl || "",
          folderPath: raw.folderPath || raw.runFolder || "",
          screenshotUrl: raw.screenshotUrl || "",
          filesChanged: raw.filesChanged || "",
          errors: raw.errors || "",
          notes: raw.notes || "Imported from queue-result.json.",
          score: Number(raw.score || 0),
          failureCategories: raw.failureCategories || [],
          createdAt: raw.createdAt || now,
          updatedAt: raw.updatedAt || now,
        };
        setBuildRuns((current) => [buildRun, ...current.filter((run) => run.id !== buildRun.id)].slice(0, 100));
        addLineageNode({
          id: `lineage-import-${buildRun.id}`,
          parentId: `lineage-source-${buildRun.promptId}`,
          promptId: buildRun.promptId,
          kind: "build",
          title: buildRun.promptTitle,
          score: buildRun.score,
          status: buildRun.status,
          detail: buildRun.resultUrl || buildRun.folderPath || "Imported build result.",
          createdAt: buildRun.updatedAt,
        });
        setApiNotice("Imported result locally.");
      }
      setResultImportText("");
    } catch (error) {
      setApiNotice(`Import failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function runModelEvaluation() {
    if (!selectedPrompt) return;
    try {
      const result = await evaluateWithModel({
        prompt: selectedPrompt.text,
        memory: promptMemory.markdown,
        context: {
          selectedTitle: selectedPrompt.title,
          scoreWeights,
          scoreBreakdown,
        },
        settings: {
          provider: modelSettings.provider,
          endpoint: modelSettings.endpoint,
          apiKey: modelSettings.apiKey,
          model: modelSettings.model,
          temperature: modelSettings.temperature,
        },
      });
      setModelEvaluation(result);
      setModelNotice(`Model evaluation complete: ${String(result.mode || "local")}`);
    } catch (error) {
      setModelNotice(`Model evaluation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function copyText(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1200);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">
          <Sparkles size={22} />
        </div>
        <div>
          <p className="eyebrow">Prompt learning workbench</p>
          <h1>Website prompt learner</h1>
        </div>
        <div className="topbar-actions" aria-label="Corpus metrics">
          <Metric value={formatNumber(profile.exampleCount)} label="Examples" />
          <Metric value={formatNumber(clusters.length)} label="Archetypes" />
          <Metric value={addPercent(dnaScore)} label="DNA score" />
        </div>
      </header>

      <main className="workspace">
        <aside className="panel left-panel">
          <div className="panel-header">
            <BookOpen size={18} />
            <h2>Training corpus</h2>
          </div>

          <div className="import-box">
            <textarea
              value={draftPrompt}
              onChange={(event) => setDraftPrompt(event.target.value)}
              placeholder="Paste another excellent website prompt here..."
            />
            {draftAnalysis ? <SmartIngestion analysis={draftAnalysis} /> : null}
            {draftBatchCandidates.length > 1 ? <BatchIngestionPreview audit={draftImportAudit} candidates={draftBatchCandidates} /> : null}
            <div className="import-actions">
              <label className="file-button">
                <Upload size={15} />
                Prompt
                <input
                  type="file"
                  accept=".txt,.md,text/plain"
                  multiple
                  onChange={(event) => {
                    void importPromptFiles(event.target.files);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              <label className="file-button">
                <Upload size={15} />
                JSON
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={(event) => {
                    void importJsonFile(event.target.files?.[0]);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              <button
                className="primary-button"
                type="button"
                onClick={addDraftPrompt}
                disabled={draftAnalysis?.duplicate.kind === "exact"}
              >
                <Plus size={15} />
                Add
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={addDraftPromptBatch}
                disabled={draftBatchCandidates.length < 2}
              >
                <PackageOpen size={15} />
                Add batch
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={addCuratedDraftBatch}
                disabled={draftImportAudit.importable < 1}
              >
                <Check size={15} />
                Add curated
              </button>
            </div>
            <div className="output-actions">
              <button className="ghost-button" type="button" onClick={exportJson}>
                <Download size={15} />
                Export corpus
              </button>
            </div>
            {importNotice ? <p className="selected-meta">{importNotice}</p> : null}
          </div>

          <div className="library-tools">
            <label className="search-field">
              <Search size={15} />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search prompts, effects, stacks..."
              />
            </label>
            <div className="tagbar">
              <button className={!activeTag ? "active" : ""} type="button" onClick={() => setActiveTag("")}>
                All
              </button>
              {allTags.slice(0, 12).map((tag) => (
                <button
                  className={activeTag === tag ? "active" : ""}
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="prompt-list" aria-label="Prompt examples">
            {filteredExamples.map(({ analysis, example }) => (
              <button
                className={`prompt-row ${example.id === selectedPrompt?.id ? "active" : ""}`}
                key={example.id}
                type="button"
                onClick={() => setSelectedId(example.id)}
              >
                <span className="source-dot" data-source={example.source} />
                <span>
                  <strong>{example.title}</strong>
                  <small>
                    {countWords(example.text)} words - {analysis.archetypes[0]?.label ?? "unclustered"}
                  </small>
                  <span className="row-tags">{analysis.tags.slice(0, 3).join(" / ")}</span>
                </span>
                {example.source === "user" ? (
                  <span
                    className="remove"
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      removePrompt(example.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.stopPropagation();
                        removePrompt(example.id);
                      }
                    }}
                    aria-label={`Remove ${example.title}`}
                  >
                    <Trash2 size={14} />
                  </span>
                ) : (
                  <span aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </aside>

        <section className="center-panel">
          <nav className="tabs" aria-label="Workspace tabs">
            <TabButton active={tab === "learn"} icon={<BarChart3 size={16} />} onClick={() => setTab("learn")}>
              Learn
            </TabButton>
            <TabButton active={tab === "compose"} icon={<Wand2 size={16} />} onClick={() => setTab("compose")}>
              Compose
            </TabButton>
            <TabButton active={tab === "critic"} icon={<Gauge size={16} />} onClick={() => setTab("critic")}>
              Critic
            </TabButton>
            <TabButton active={tab === "templates"} icon={<FileText size={16} />} onClick={() => setTab("templates")}>
              Templates
            </TabButton>
            <TabButton active={tab === "lab"} icon={<SlidersHorizontal size={16} />} onClick={() => setTab("lab")}>
              Lab
            </TabButton>
            <TabButton active={tab === "train"} icon={<Sparkles size={16} />} onClick={() => setTab("train")}>
              Train
            </TabButton>
          </nav>

          {tab === "learn" ? (
            <LearnView
              clusters={clusters}
              dnaScore={dnaScore}
              profile={profile}
              selectedAnalysis={selectedAnalysis}
              selectedPrompt={selectedPrompt}
            />
          ) : tab === "compose" ? (
            <ComposeView
              clusters={clusters}
              copied={copied === "generated"}
              generatedPrompt={generatedPrompt}
              onCopy={() => void copyText(generatedPrompt, "generated")}
              onSave={() => saveVersion("generated", `${composeOptions.brandName || "Generated"} prompt`, generatedPrompt, evaluatePrompt(generatedPrompt).score)}
              options={composeOptions}
              setOptions={setComposeOptions}
            />
          ) : tab === "critic" ? (
            <CriticView
              evaluation={evaluation}
              rewrittenPrompt={rewrittenPrompt}
              text={evaluationText}
              setText={setEvaluationText}
              onCopy={() => void copyText(rewrittenPrompt, "rewrite")}
              onSave={() => saveVersion("rewrite", "Critic rewrite", rewrittenPrompt, evaluatePrompt(rewrittenPrompt).score)}
              copied={copied === "rewrite"}
            />
          ) : tab === "templates" ? (
            <TemplatesView
              copied={copied}
              onCopy={(template) => void copyText(template.prompt, template.id)}
              onSave={(template) => saveVersion("template", template.title, template.prompt, evaluatePrompt(template.prompt).score)}
              templates={templates}
            />
          ) : tab === "lab" ? (
            <LabView
              clusters={clusters}
              copied={copied}
              health={health}
              history={history}
              mixedPrompt={mixedPrompt}
              mixOptions={mixOptions}
              onCopy={(value, key) => void copyText(value, key)}
              onDownload={downloadText}
              onRemoveVersion={removeVersion}
              onSave={saveVersion}
              packs={promptPacks}
              recipeOptions={recipeOptions}
              recipePrompt={recipePrompt}
              rubric={rubric}
              rubricNotes={rubricNotes}
              setMixOptions={setMixOptions}
              setRecipeOptions={setRecipeOptions}
              setRubric={setRubric}
              styleGuide={styleGuide}
            />
          ) : (
            <TrainView
              activeTrainStage={activeTrainStage}
              activeWorkspace={activeWorkspace}
              activeWorkspacePreset={activeWorkspacePreset}
              autoBattleResult={autoBattleResult}
              apiHealth={apiHealth}
              apiNotice={apiNotice}
              apiBaseDraft={apiBaseDraft}
              apiEvents={apiEvents}
              apiTokenDraft={apiTokenDraft}
              backupSnapshots={backupSnapshots}
              benchmarkRuns={benchmarkRuns}
              buildFeedback={buildFeedback}
              buildRuns={buildRuns}
              closedLoopRuns={closedLoopRuns}
              codexBuildPack={codexBuildPack}
              claudeHealthChecks={claudeHealthChecks}
              codexSkill={codexSkill}
              coachInput={coachInput}
              coachResult={coachResult}
              compiledPrompt={compiledPrompt}
              compilerInput={compilerInput}
              copied={copied}
              corpusCleaning={corpusCleaning}
              corpusQualityCards={corpusQualityCards}
              curationDecisions={curationDecisions}
              curationReport={curationReport}
              dbStatus={dbStatus}
              dnaCalibration={dnaCalibration}
              dnaExplanation={dnaExplanation}
              datasetVersions={datasetVersions}
              datasetComparison={datasetComparison}
              dnaV2={dnaV2}
              diffLeftId={diffLeftId}
              diffRightId={diffRightId}
              examples={examples}
              evaluationHistory={evaluationHistory}
              exportPresets={exportPresets}
              failureMemory={failureMemory}
              improvedPrompt={improvedPrompt}
              improveText={improveText}
              interviewBrief={interviewBrief}
              interviewPrompt={interviewPrompt}
              goldenRecipes={goldenRecipes}
              goldenChallengeBoard={goldenChallengeBoard}
              goldReview={goldReview}
              guidedWizard={guidedWizard}
              qualityGraderV2={qualityGraderV2}
              generatorPresets={generatorPresets}
              generatorInput={generatorInput}
              hostedSyncReport={hostedSyncReport}
              learnerAnswer={learnerAnswer}
              learnerQuestion={learnerQuestion}
              learnedGeneratorVariants={learnedGeneratorVariants}
              leakageGuard={leakageGuard}
              experimentLeaderboard={experimentLeaderboard}
              leaderboard={leaderboard}
              learningExamples={learningExamples}
              localIndex={localIndex}
              modelBatchEvaluations={modelBatchEvaluations}
              modelEvaluation={modelEvaluation}
              modelEnvStatus={modelEnvStatus}
              modelNotice={modelNotice}
              modelSettings={modelSettings}
              mutationSource={mutationSource}
              mutations={promptMutations}
              onAddBuildRun={addBuildRun}
              onAddPairwiseReview={addPairwiseReview}
              onAddScreenshot={addScreenshot}
              onApplyCurationRecommendations={applyCurationRecommendations}
              onCaptureSelectedResult={captureSelectedResult}
              onApplyResultLearningPatch={applyResultLearningPatch}
              onCheckApi={checkApi}
              onConnectHostedBrain={connectHostedBrain}
              onCreateDatasetVersion={createDatasetVersion}
              onApplyGoldReview={applyGoldReview}
              onApplyGeneratorPreset={applyGeneratorPreset}
              onApplyGeneratorVariant={applyGeneratorVariant}
              onApplyProviderPreset={applyProviderPreset}
              onBulkPromoteLeaderboard={bulkPromoteLeaderboard}
              onChooseOnboardingMode={chooseOnboardingMode}
              onCopy={(value, key) => void copyText(value, key)}
              onCreateBackupSnapshot={createBackupSnapshot}
              onDownload={downloadText}
              onExportBackupSnapshot={exportBackupSnapshot}
              onExportCodexBuildPack={exportCodexBuildPack}
              onExportPreset={exportPreset}
              onExportQueue={exportQueue}
              onExportMemoryPack={exportReusableMemoryPack}
              onExportProjectPack={exportProjectPack}
              onExportTrainingSnapshot={exportTrainingSnapshot}
              onImportTrainingSnapshot={importTrainingSnapshotText}
              onImportResultJson={importResultJson}
              onInstallSkill={installSkillFromApi}
              onLoadDemoMode={loadDemoMode}
              onModelEvaluate={runModelEvaluation}
              onOneClickLearningLoop={runOneClickLearningLoop}
              onRunOneClickBuildProof={runOneClickBuildProof}
              onPullFromApi={pullFromApi}
              onQueueBattle={() => queueBattleVariants(promptBattle, "prompt battle")}
              onRunAutonomousBattle={runAutonomousBattle}
              onRunAutomatedVisualQa={runAutomatedVisualQa}
              onRunBenchmarkSuite={runBenchmarkSuite}
              onRunClosedLoopTrainer={runClosedLoopTrainer}
              onRunCorpusHygieneSweep={runCorpusHygieneSweep}
              onRunHostedClaudeHealthCheck={runHostedClaudeHealthCheck}
              onRunProofLearningLoop={runProofLearningLoop}
              onRunModelBatchCalibration={runModelBatchCalibration}
              onRunPromptComparison={runPromptComparison}
              onRunScreenshotJudge={runScreenshotJudge}
              onRunMutationTournament={runMutationTournament}
              onGeneratePromptFromScreenshot={generatePromptFromScreenshot}
              onSaveWorkspacePackRun={saveWorkspacePackRun}
              onRunPromptCoach={runPromptCoach}
              onQueueTournament={queueTournamentFinalists}
              onQueueWizard={() => queueBattleVariants(wizardBattle, "one-click wizard")}
              onQuarantineOffProjectPrompts={quarantineOffProjectPrompts}
              onQuarantineWeakCorpus={quarantineWeakCorpus}
              onRefreshApiEvents={refreshApiEvents}
              onRemoveBuildRun={removeBuildRun}
              onRemoveQueueJob={removeQueueJob}
              onRemoveScreenshot={removeScreenshot}
              onRunQueueViaApi={runQueueViaApi}
              onSave={saveVersion}
              onSaveApiBase={saveApiBase}
              onSelectPrompt={setSelectedId}
              onSetPromptCurationDecision={setPromptCurationDecision}
              onRestoreBackupSnapshot={restoreBackupSnapshot}
              onSyncToApi={syncToApi}
              onUpdateOutcome={updateOutcome}
              outcomeSummary={outcomeSummary}
              outcomes={outcomes}
              onboardingMode={onboardingMode}
              pairwiseReviews={pairwiseReviews}
              patternExtraction={patternExtraction}
              patternDashboard={patternDashboard}
              projectBoundaryReport={projectBoundaryReport}
              promptComparisons={promptComparisons}
              proofLearningRuns={proofLearningRuns}
              promptBattle={promptBattle}
              promptCoach={promptCoach}
              promptMemory={promptMemory}
              promptQualityRecipe={promptQualityRecipe}
              promptDiff={promptDiff}
              projectExportPack={projectExportPack}
              qualityGate={qualityGate}
              qaText={qaText}
              queueExport={queueExport}
              queueJobs={queueJobs}
              resultImportText={resultImportText}
              rewriteComparison={rewriteComparison}
              benchmarkRegression={benchmarkRegression}
              snapshotImportText={snapshotImportText}
              resultScore={resultScore}
              runnerPlan={runnerPlan}
              screenshotQa={screenshotQa}
              screenshotJudgeRuns={screenshotJudgeRuns}
              screenshotPromptRuns={screenshotPromptRuns}
              scoreBreakdown={scoreBreakdown}
              scoreWeights={scoreWeights}
              screenshots={screenshots}
              searchResults={semanticResults}
              selectedPrompt={selectedPrompt}
              promptEvolutionSteps={promptEvolutionSteps}
              selectedLineage={selectedLineage}
              semanticQuery={semanticQuery}
              sourceSafety={sourceSafety}
              setApiBaseDraft={setApiBaseDraft}
              setApiTokenDraft={setApiTokenDraft}
              setActiveTrainStage={setActiveTrainStage}
              setActiveWorkspace={setActiveWorkspace}
              setCoachInput={setCoachInput}
              setCompilerInput={setCompilerInput}
              setDiffLeftId={setDiffLeftId}
              setDiffRightId={setDiffRightId}
              setGeneratorInput={setGeneratorInput}
              setImproveText={setImproveText}
              setInterviewBrief={setInterviewBrief}
              setLearnerQuestion={setLearnerQuestion}
              setModelSettings={setModelSettings}
              setMutationSource={setMutationSource}
              setQaText={setQaText}
              setSemanticQuery={setSemanticQuery}
              setResultImportText={setResultImportText}
              setSnapshotImportText={setSnapshotImportText}
              setScoreWeights={setScoreWeights}
              setVectorQuery={setVectorQuery}
              skillInstallPlan={skillInstallPlan}
              tournament={tournament}
              vectorQuery={vectorQuery}
              vectorResults={vectorResults}
              visualQa={visualQa}
              visualRegression={visualRegression}
              visualAnalysisResult={visualAnalysisResult}
              archetypePromptPacks={archetypePromptPacks}
              onAnalyzeSelectedVisuals={analyzeSelectedVisuals}
              repairedPrompt={repairedPrompt}
              resultGallery={resultGallery}
              reusableMemoryPack={reusableMemoryPack}
              setWizardIdea={setWizardIdea}
              wizardBattle={wizardBattle}
              wizardCompiled={wizardCompiled}
              wizardIdea={wizardIdea}
              driftReport={driftReport}
              winExplanation={winExplanation}
              workspaceExamples={workspaceExamples}
              mutationTournamentRuns={mutationTournamentRuns}
              workspacePackRuns={workspacePackRuns}
              workspacePackSnapshot={workspacePackSnapshot}
            />
          )}
        </section>

        <aside className="panel right-panel">
          <div className="panel-header">
            <Lightbulb size={18} />
            <h2>Learned rules</h2>
          </div>
          <div className="rule-list">
            {profile.learnedRules.map((rule, index) => (
              <div className="rule" key={rule}>
                <span>{index + 1}</span>
                <p>{rule}</p>
              </div>
            ))}
          </div>
          <div className="mini-card">
            <h3>Active archetypes</h3>
            <div className="cluster-list compact">
              {clusters.slice(0, 5).map((cluster) => (
                <ClusterCard cluster={cluster} key={cluster.key} />
              ))}
            </div>
          </div>
          <div className="mini-card">
            <h3>Signature phrases</h3>
            <FeaturePills features={profile.signaturePhrases} empty="No signature phrases learned yet." />
          </div>
        </aside>
      </main>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function TabButton({
  active,
  children,
  icon,
  onClick,
}: {
  active: boolean;
  children: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button className={`tab ${active ? "active" : ""}`} type="button" onClick={onClick}>
      {icon}
      {children}
    </button>
  );
}

function SmartIngestion({ analysis }: { analysis: PromptAnalysis }) {
  const duplicateLabel =
    analysis.duplicate.kind === "exact"
      ? `Exact duplicate of ${analysis.duplicate.match?.title ?? "an existing prompt"}`
      : analysis.duplicate.kind === "near"
        ? `Near ${Math.round(analysis.duplicate.score * 100)}% match: ${analysis.duplicate.match?.title}`
        : "Distinct prompt";

  return (
    <div className="analysis-card">
      <div>
        <strong>{analysis.title}</strong>
        <span>{analysis.wordCount} words / {analysis.assetCount} assets / {analysis.archetypes[0]?.label ?? "unclustered"}</span>
      </div>
      <p data-tone={analysis.duplicate.kind}>{duplicateLabel}</p>
      <div className="chips">
        {analysis.tags.slice(0, 6).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function BatchIngestionPreview({ audit, candidates }: { audit: PromptImportAudit; candidates: ReturnType<typeof parsePromptBatch> }) {
  const buckets: PromptImportAudit["items"][number]["decision"][] = ["gold", "learn", "review", "quarantine"];
  return (
    <div className="analysis-card batch-preview">
      <div>
        <strong>{candidates.length} prompt candidates detected</strong>
        <span>
          Average score {audit.averageScore} / {audit.importable} importable / {audit.goldCandidates} gold / {audit.nearDuplicates} near duplicate(s)
        </span>
      </div>
      <div className="mini-stat-row">
        <span>{audit.importable} learn-ready</span>
        <span>{audit.reviewCandidates} review</span>
        <span>{audit.quarantineCandidates} quarantine</span>
        {audit.topClusters.slice(0, 3).map((cluster) => (
          <span key={cluster.label}>{cluster.label}: {cluster.count}</span>
        ))}
      </div>
      <div className="batch-recommendations">
        {audit.recommendations.slice(0, 3).map((recommendation) => (
          <span key={recommendation}>{recommendation}</span>
        ))}
      </div>
      <div className="batch-candidate-list">
        {buckets.flatMap((bucket) =>
          audit.items
            .filter((item) => item.decision === bucket)
            .slice(0, 3)
            .map((item) => (
              <article data-decision={item.decision} key={item.candidate.id}>
                <strong>{item.candidate.title}</strong>
                <span>{item.decision} / {item.candidate.score} score / {item.cluster}</span>
                <small>{item.reasons.slice(0, 4).join(" / ")}</small>
              </article>
            )),
        )}
      </div>
    </div>
  );
}

function LearnView({
  clusters,
  dnaScore,
  profile,
  selectedAnalysis,
  selectedPrompt,
}: {
  clusters: ArchetypeCluster[];
  dnaScore: number;
  profile: PromptProfile;
  selectedAnalysis?: PromptAnalysis;
  selectedPrompt?: PromptExample;
}) {
  return (
    <div className="learn-grid">
      <section className="panel hero-panel">
        <div>
          <p className="eyebrow">Pattern model</p>
          <h2>Learning what makes website prompts executable.</h2>
          <p>
            The corpus is now fingerprinted for duplicate risk, tags, archetypes, DNA dimensions, technical
            coverage, reusable templates, and rewrite guidance.
          </p>
        </div>
        <ScoreRing score={dnaScore} label="DNA score" />
      </section>

      <section className="insight-grid">
        <div className="panel category-panel">
          <div className="panel-header">
            <BarChart3 size={18} />
            <h2>Prompt DNA</h2>
          </div>
          {selectedAnalysis ? <DnaList dna={selectedAnalysis.dna} /> : null}
        </div>
        <div className="panel category-panel">
          <div className="panel-header">
            <Tags size={18} />
            <h2>Selected fingerprint</h2>
          </div>
          {selectedAnalysis ? (
            <>
              <div className="chips">
                {selectedAnalysis.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <p className="selected-meta">
                {selectedAnalysis.stack.join(" + ") || "No explicit stack"} / {selectedAnalysis.fonts.join(" + ") || "No explicit fonts"}
              </p>
            </>
          ) : null}
        </div>
      </section>

      <section className="panel category-panel">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Category coverage</h2>
        </div>
        <ScoreList scores={profile.categoryScores} />
      </section>

      <section className="panel category-panel">
        <div className="panel-header">
          <Sparkles size={18} />
          <h2>Archetype clustering</h2>
        </div>
        <div className="cluster-list">
          {clusters.map((cluster) => (
            <ClusterCard cluster={cluster} key={cluster.key} />
          ))}
        </div>
      </section>

      <section className="feature-grid">
        {categoryOrder.slice(0, 8).map((key) => (
          <div className="panel feature-card" key={key}>
            <h3>{categoryLabels[key]}</h3>
            <FeaturePills features={profile.features[key]} empty="Still learning this signal." />
          </div>
        ))}
      </section>

      <section className="panel selected-panel">
        <h3>Selected example</h3>
        {selectedPrompt ? (
          <>
            <p className="selected-meta">
              {selectedPrompt.title} - {countWords(selectedPrompt.text)} words - {selectedPrompt.source}
            </p>
            <pre>{selectedPrompt.text}</pre>
          </>
        ) : (
          <p className="selected-meta">No prompt selected.</p>
        )}
      </section>
    </div>
  );
}

function ComposeView({
  clusters,
  copied,
  generatedPrompt,
  onCopy,
  onSave,
  options,
  setOptions,
}: {
  clusters: ArchetypeCluster[];
  copied: boolean;
  generatedPrompt: string;
  onCopy: () => void;
  onSave: () => void;
  options: ComposeOptions;
  setOptions: Dispatch<SetStateAction<ComposeOptions>>;
}) {
  function update<K extends keyof ComposeOptions>(key: K, value: ComposeOptions[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="compose-grid">
      <section className="panel form-panel">
        <div className="panel-header">
          <Wand2 size={18} />
          <h2>Prompt brief</h2>
        </div>
        <Field label="Brand name">
          <input value={options.brandName} onChange={(event) => update("brandName", event.target.value)} />
        </Field>
        <Field label="Site type">
          <input value={options.siteType} onChange={(event) => update("siteType", event.target.value)} />
        </Field>
        <Field label="Archetype">
          <select value={options.archetype} onChange={(event) => update("archetype", event.target.value)}>
            {[options.archetype, ...clusters.map((cluster) => cluster.label)]
              .filter((value, index, array) => value && array.indexOf(value) === index)
              .map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </Field>
        <Field label="Mood">
          <input value={options.mood} onChange={(event) => update("mood", event.target.value)} />
        </Field>
        <Field label="Output flavor">
          <input value={options.outputFlavor} onChange={(event) => update("outputFlavor", event.target.value)} />
        </Field>
        <Field label="Visual signature">
          <textarea
            value={options.visualSignature}
            onChange={(event) => update("visualSignature", event.target.value)}
          />
        </Field>
        <Field label="Brief">
          <textarea value={options.brief} onChange={(event) => update("brief", event.target.value)} />
        </Field>

        <SliderField label="Detail" value={options.detailLevel} onChange={(value) => update("detailLevel", value)} />
        <SliderField label="Creativity" value={options.creativity} onChange={(value) => update("creativity", value)} />
        <SliderField label="Rigor" value={options.rigor} onChange={(value) => update("rigor", value)} />

        <div className="toggle-grid">
          <Toggle checked={options.includeAssets} label="Assets" onChange={(checked) => update("includeAssets", checked)} />
          <Toggle checked={options.includeMotion} label="Motion" onChange={(checked) => update("includeMotion", checked)} />
          <Toggle checked={options.includeQA} label="QA" onChange={(checked) => update("includeQA", checked)} />
        </div>
      </section>

      <section className="panel output-panel">
        <div className="output-header">
          <div className="panel-header">
            <FileText size={18} />
            <h2>Generated prompt</h2>
          </div>
          <button className="icon-button" type="button" onClick={onCopy} aria-label="Copy generated prompt">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button className="ghost-button compact-button" type="button" onClick={onSave}>
            <Save size={15} />
            Save
          </button>
        </div>
        <textarea className="generated-output" readOnly value={generatedPrompt} />
      </section>
    </div>
  );
}

function CriticView({
  copied,
  evaluation,
  onCopy,
  onSave,
  rewrittenPrompt,
  setText,
  text,
}: {
  copied: boolean;
  evaluation: Evaluation;
  onCopy: () => void;
  onSave: () => void;
  rewrittenPrompt: string;
  setText: (value: string) => void;
  text: string;
}) {
  return (
    <div className="evaluate-grid">
      <section className="panel evaluator-panel">
        <div className="panel-header">
          <Clipboard size={18} />
          <h2>Prompt to critique</h2>
        </div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste a draft prompt here, or leave blank to critique the generated prompt."
        />
      </section>

      <section className="panel evaluation-panel">
        <div className="evaluation-top">
          <ScoreRing score={evaluation.score} label="Prompt score" />
          <p>
            Critic mode finds vague spots, missing implementation details, and the strongest next rewrite based on
            the learned corpus.
          </p>
        </div>
        <ScoreList compact scores={evaluation.categoryScores} />
        <div className="feedback-columns">
          <FeedbackList title="What works" items={evaluation.findings} empty="No strong signals yet." />
          <FeedbackList title="Upgrade next" items={evaluation.upgrades} empty="No major gaps detected." />
        </div>
        <div className="output-header rewrite-header">
          <h3>Rewritten stronger version</h3>
          <div className="button-row">
            <button className="icon-button" type="button" onClick={onCopy} aria-label="Copy rewritten prompt">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button className="ghost-button compact-button" type="button" onClick={onSave}>
              <Save size={15} />
              Save
            </button>
          </div>
        </div>
        <textarea className="generated-output rewrite-output" readOnly value={rewrittenPrompt} />
      </section>
    </div>
  );
}

function TemplatesView({
  copied,
  onCopy,
  onSave,
  templates,
}: {
  copied: string;
  onCopy: (template: PromptTemplate) => void;
  onSave: (template: PromptTemplate) => void;
  templates: PromptTemplate[];
}) {
  return (
    <div className="learn-grid">
      <section className="panel hero-panel">
        <div>
          <p className="eyebrow">Golden templates</p>
          <h2>Reusable prompt skeletons distilled from the corpus.</h2>
          <p>Use these as starting points when you want consistent high-fidelity output without pasting a giant prompt from scratch.</p>
        </div>
      </section>
      <section className="template-grid">
        {templates.map((template) => (
          <article className="panel template-card" key={template.id}>
            <div className="output-header">
              <div>
                <h3>{template.title}</h3>
                <p>{template.bestFor}</p>
              </div>
              <button className="icon-button" type="button" onClick={() => onCopy(template)} aria-label={`Copy ${template.title}`}>
                {copied === template.id ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button className="ghost-button compact-button" type="button" onClick={() => onSave(template)}>
                <Save size={15} />
                Save
              </button>
            </div>
            <pre>{template.prompt}</pre>
          </article>
        ))}
      </section>
    </div>
  );
}

function packToText(pack: PromptPack) {
  return [`# ${pack.title}`, pack.description, ...pack.prompts.map((prompt, index) => `## Prompt ${index + 1}\n\n${prompt}`)].join(
    "\n\n",
  );
}

function LabView({
  clusters,
  copied,
  health,
  history,
  mixedPrompt,
  mixOptions,
  onCopy,
  onDownload,
  onRemoveVersion,
  onSave,
  packs,
  recipeOptions,
  recipePrompt,
  rubric,
  rubricNotes,
  setMixOptions,
  setRecipeOptions,
  setRubric,
  styleGuide,
}: {
  clusters: ArchetypeCluster[];
  copied: string;
  health: CorpusHealth;
  history: PromptVersion[];
  mixedPrompt: string;
  mixOptions: ArchetypeMixOptions;
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  onRemoveVersion: (id: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  packs: PromptPack[];
  recipeOptions: RecipeOptions;
  recipePrompt: string;
  rubric: QualityRubric;
  rubricNotes: string[];
  setMixOptions: Dispatch<SetStateAction<ArchetypeMixOptions>>;
  setRecipeOptions: Dispatch<SetStateAction<RecipeOptions>>;
  setRubric: Dispatch<SetStateAction<QualityRubric>>;
  styleGuide: string;
}) {
  function updateMix<K extends keyof ArchetypeMixOptions>(key: K, value: ArchetypeMixOptions[K]) {
    setMixOptions((current) => ({ ...current, [key]: value }));
  }

  function updateRecipe<K extends keyof RecipeOptions>(key: K, value: RecipeOptions[K]) {
    setRecipeOptions((current) => ({ ...current, [key]: value }));
  }

  function toggleArchetype(key: string) {
    setMixOptions((current) => ({
      ...current,
      archetypes: current.archetypes.includes(key)
        ? current.archetypes.filter((value) => value !== key)
        : [...current.archetypes, key].slice(-3),
    }));
  }

  function updateRubric<K extends keyof QualityRubric>(key: K, value: number) {
    setRubric((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="lab-grid">
      <section className="panel hero-panel lab-hero">
        <div>
          <p className="eyebrow">Prompt lab</p>
          <h2>Turn the corpus into reusable taste systems.</h2>
          <p>
            Mix archetypes, build recipe prompts, tune a quality rubric, export prompt packs, and save versions for
            comparison.
          </p>
        </div>
      </section>

      <section className="lab-columns">
        <div className="panel lab-panel">
          <div className="panel-header">
            <Shuffle size={18} />
            <h2>Archetype mixer</h2>
          </div>
          <Field label="Brand name">
            <input value={mixOptions.brandName} onChange={(event) => updateMix("brandName", event.target.value)} />
          </Field>
          <Field label="Site type">
            <input value={mixOptions.siteType} onChange={(event) => updateMix("siteType", event.target.value)} />
          </Field>
          <Field label="Mood">
            <input value={mixOptions.mood} onChange={(event) => updateMix("mood", event.target.value)} />
          </Field>
          <Field label="Constraints">
            <textarea value={mixOptions.constraints} onChange={(event) => updateMix("constraints", event.target.value)} />
          </Field>
          <div className="choice-grid">
            {clusters.slice(0, 8).map((cluster) => (
              <button
                className={`choice-card ${mixOptions.archetypes.includes(cluster.key) ? "active" : ""}`}
                key={cluster.key}
                type="button"
                onClick={() => toggleArchetype(cluster.key)}
              >
                <strong>{cluster.label}</strong>
                <span>{cluster.count} examples</span>
              </button>
            ))}
          </div>
          <div className="toggle-grid one-line">
            <Toggle checked={mixOptions.includeAssets} label="Include asset rules" onChange={(checked) => updateMix("includeAssets", checked)} />
          </div>
          <div className="output-header">
            <h3>Mixed prompt</h3>
            <div className="button-row">
              <button className="icon-button" type="button" onClick={() => onCopy(mixedPrompt, "mixed")} aria-label="Copy mixed prompt">
                {copied === "mixed" ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button className="ghost-button compact-button" type="button" onClick={() => onSave("mix", `${mixOptions.brandName} archetype mix`, mixedPrompt, evaluatePrompt(mixedPrompt).score)}>
                <Save size={15} />
                Save
              </button>
            </div>
          </div>
          <textarea className="generated-output small-output" readOnly value={mixedPrompt} />
        </div>

        <div className="panel lab-panel">
          <div className="panel-header">
            <ListChecks size={18} />
            <h2>Recipe builder</h2>
          </div>
          <div className="two-field-grid">
            <Field label="Brand">
              <input value={recipeOptions.brandName} onChange={(event) => updateRecipe("brandName", event.target.value)} />
            </Field>
            <Field label="Industry">
              <input value={recipeOptions.industry} onChange={(event) => updateRecipe("industry", event.target.value)} />
            </Field>
          </div>
          <Field label="Audience">
            <input value={recipeOptions.audience} onChange={(event) => updateRecipe("audience", event.target.value)} />
          </Field>
          <Field label="Stack">
            <input value={recipeOptions.stack} onChange={(event) => updateRecipe("stack", event.target.value)} />
          </Field>
          <Field label="Layout">
            <textarea value={recipeOptions.layout} onChange={(event) => updateRecipe("layout", event.target.value)} />
          </Field>
          <Field label="Navigation">
            <textarea value={recipeOptions.nav} onChange={(event) => updateRecipe("nav", event.target.value)} />
          </Field>
          <Field label="Motion">
            <textarea value={recipeOptions.motion} onChange={(event) => updateRecipe("motion", event.target.value)} />
          </Field>
          <Field label="Assets">
            <textarea value={recipeOptions.assets} onChange={(event) => updateRecipe("assets", event.target.value)} />
          </Field>
          <SliderField label="Strictness" value={recipeOptions.strictness} onChange={(value) => updateRecipe("strictness", value)} />
          <div className="output-header">
            <h3>Recipe prompt</h3>
            <div className="button-row">
              <button className="icon-button" type="button" onClick={() => onCopy(recipePrompt, "recipe")} aria-label="Copy recipe prompt">
                {copied === "recipe" ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button className="ghost-button compact-button" type="button" onClick={() => onSave("recipe", `${recipeOptions.brandName} recipe`, recipePrompt, evaluatePrompt(recipePrompt).score)}>
                <Save size={15} />
                Save
              </button>
            </div>
          </div>
          <textarea className="generated-output small-output" readOnly value={recipePrompt} />
        </div>
      </section>

      <section className="lab-columns">
        <div className="panel lab-panel">
          <div className="panel-header">
            <Gauge size={18} />
            <h2>Quality rubric editor</h2>
          </div>
          <div className="rubric-grid">
            {(Object.keys(rubric) as (keyof QualityRubric)[]).map((key) => (
              <SliderField
                key={key}
                label={key.replace(/([A-Z])/g, " $1")}
                value={rubric[key]}
                onChange={(value) => updateRubric(key, value)}
              />
            ))}
          </div>
          <div className="feedback-list">
            <h3>Rubric instructions</h3>
            {rubricNotes.map((note) => (
              <p key={note}>
                <Check size={14} />
                {note}
              </p>
            ))}
          </div>
        </div>

        <HealthPanel health={health} />
      </section>

      <section className="lab-columns">
        <PromptPackPanel
          copied={copied}
          onCopy={onCopy}
          onDownload={onDownload}
          onSave={onSave}
          packs={packs}
        />

        <section className="panel lab-panel">
          <div className="panel-header">
            <Archive size={18} />
            <h2>Taste rules export</h2>
          </div>
          <p className="selected-meta">A portable style guide you can paste into future prompt-writing sessions.</p>
          <div className="button-row">
            <button className="ghost-button compact-button" type="button" onClick={() => onCopy(styleGuide, "style-guide")}>
              {copied === "style-guide" ? <Check size={15} /> : <Copy size={15} />}
              Copy guide
            </button>
            <button className="primary-button compact-button" type="button" onClick={() => onDownload("PROMPT_STYLE_GUIDE.md", styleGuide, "text/markdown")}>
              <Download size={15} />
              Download
            </button>
            <button className="ghost-button compact-button" type="button" onClick={() => onSave("style-guide", "Prompt Atelier style guide", styleGuide)}>
              <Save size={15} />
              Save
            </button>
          </div>
          <textarea className="generated-output style-guide-output" readOnly value={styleGuide} />
        </section>
      </section>

      <PromptHistoryPanel
        history={history}
        onCopy={onCopy}
        onDownload={onDownload}
        onRemove={onRemoveVersion}
      />
    </div>
  );
}

function HealthPanel({ health }: { health: CorpusHealth }) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <BarChart3 size={18} />
        <h2>Corpus health dashboard</h2>
      </div>
      <div className="health-grid">
        <div className="health-card">
          <h3>Strengths</h3>
          {health.strengths.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <div className="health-card">
          <h3>Gaps</h3>
          {health.gaps.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <div className="health-card wide">
          <h3>Recommendations</h3>
          {health.recommendations.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
      <div className="feature-list health-balance">
        {health.balance.slice(0, 14).map((feature) => (
          <span key={feature.label}>
            {feature.label}
            <small>{feature.count}</small>
          </span>
        ))}
      </div>
    </section>
  );
}

function PromptPackPanel({
  copied,
  onCopy,
  onDownload,
  onSave,
  packs,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  packs: PromptPack[];
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <PackageOpen size={18} />
        <h2>Prompt packs</h2>
      </div>
      <div className="pack-list">
        {packs.map((pack) => {
          const text = packToText(pack);
          return (
            <article className="pack-card" key={pack.id}>
              <div>
                <strong>{pack.title}</strong>
                <span>{pack.prompts.length} prompts</span>
              </div>
              <p>{pack.description}</p>
              <div className="button-row">
                <button className="ghost-button compact-button" type="button" onClick={() => onCopy(text, pack.id)}>
                  {copied === pack.id ? <Check size={15} /> : <Copy size={15} />}
                  Copy
                </button>
                <button className="ghost-button compact-button" type="button" onClick={() => onDownload(`${pack.id}.md`, text, "text/markdown")}>
                  <Download size={15} />
                  Export
                </button>
                <button className="primary-button compact-button" type="button" onClick={() => onSave("pack", pack.title, text)}>
                  <Save size={15} />
                  Save
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PromptHistoryPanel({
  history,
  onCopy,
  onDownload,
  onRemove,
}: {
  history: PromptVersion[];
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  onRemove: (id: string) => void;
}) {
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");
  const left = history.find((version) => version.id === leftId) ?? history[0];
  const right = history.find((version) => version.id === rightId) ?? history[1];
  const exportText = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), history }, null, 2);

  return (
    <section className="panel lab-panel history-panel">
      <div className="output-header">
        <div className="panel-header">
          <Save size={18} />
          <h2>Version history</h2>
        </div>
        <button
          className="ghost-button compact-button"
          type="button"
          onClick={() => onDownload("prompt-atelier-version-history.json", exportText, "application/json")}
          disabled={!history.length}
        >
          <Download size={15} />
          Export history
        </button>
      </div>
      {history.length ? (
        <>
          <div className="history-list">
            {history.slice(0, 12).map((version) => (
              <article className="history-card" key={version.id}>
                <div>
                  <strong>{version.title}</strong>
                  <span>
                    {version.kind} / {new Date(version.createdAt).toLocaleString()} {version.score ? `/ ${version.score}` : ""}
                  </span>
                </div>
                <div className="button-row">
                  <button className="icon-button" type="button" onClick={() => onCopy(version.text, version.id)} aria-label={`Copy ${version.title}`}>
                    <Copy size={15} />
                  </button>
                  <button className="icon-button danger" type="button" onClick={() => onRemove(version.id)} aria-label={`Remove ${version.title}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="compare-controls">
            <Field label="Compare left">
              <select value={left?.id ?? ""} onChange={(event) => setLeftId(event.target.value)}>
                {history.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Compare right">
              <select value={right?.id ?? ""} onChange={(event) => setRightId(event.target.value)}>
                {history.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.title}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="compare-grid">
            <pre>{left?.text ?? "Save a version first."}</pre>
            <pre>{right?.text ?? "Save a second version to compare."}</pre>
          </div>
        </>
      ) : (
        <p className="selected-meta">No saved versions yet. Save generated prompts, rewrites, packs, or the style guide.</p>
      )}
    </section>
  );
}

function TrainView({
  activeTrainStage,
  activeWorkspace,
  activeWorkspacePreset,
  autoBattleResult,
  apiHealth,
  apiNotice,
  apiBaseDraft,
  apiEvents,
  apiTokenDraft,
  backupSnapshots,
  benchmarkRuns,
  buildFeedback,
  buildRuns,
  claudeHealthChecks,
  codexBuildPack,
  closedLoopRuns,
  codexSkill,
  coachInput,
  coachResult,
  compiledPrompt,
  compilerInput,
  copied,
  corpusCleaning,
  corpusQualityCards,
  curationDecisions,
  curationReport,
  dbStatus,
  dnaCalibration,
  dnaExplanation,
  datasetVersions,
  datasetComparison,
  dnaV2,
  diffLeftId,
  diffRightId,
  driftReport,
  examples,
  evaluationHistory,
  exportPresets,
  failureMemory,
  improvedPrompt,
  improveText,
  interviewBrief,
  interviewPrompt,
  goldenRecipes,
  goldenChallengeBoard,
  goldReview,
  guidedWizard,
  qualityGraderV2,
  generatorPresets,
  generatorInput,
  hostedSyncReport,
  learnerAnswer,
  learnerQuestion,
  learnedGeneratorVariants,
  leakageGuard,
  experimentLeaderboard,
  leaderboard,
  learningExamples,
  localIndex,
  modelBatchEvaluations,
  modelEvaluation,
  modelEnvStatus,
  modelNotice,
  modelSettings,
  mutationSource,
  mutations,
  onAddBuildRun,
  onAddPairwiseReview,
  onAddScreenshot,
  onApplyCurationRecommendations,
  onApplyResultLearningPatch,
  onApplyGeneratorPreset,
  onApplyGeneratorVariant,
  onApplyGoldReview,
  onApplyProviderPreset,
  onAnalyzeSelectedVisuals,
  onBulkPromoteLeaderboard,
  onCaptureSelectedResult,
  onCheckApi,
  onConnectHostedBrain,
  onChooseOnboardingMode,
  onCreateBackupSnapshot,
  onCreateDatasetVersion,
  onCopy,
  onDownload,
  onExportBackupSnapshot,
  onExportCodexBuildPack,
  onExportPreset,
  onExportMemoryPack,
  onExportProjectPack,
  onExportQueue,
  onExportTrainingSnapshot,
  onImportTrainingSnapshot,
  onImportResultJson,
  onInstallSkill,
  onLoadDemoMode,
  onModelEvaluate,
  onOneClickLearningLoop,
  onRunOneClickBuildProof,
  onPullFromApi,
  onQueueBattle,
  onQuarantineWeakCorpus,
  onRefreshApiEvents,
  onRunAutonomousBattle,
  onRunAutomatedVisualQa,
  onRunBenchmarkSuite,
  onRunClosedLoopTrainer,
  onRunCorpusHygieneSweep,
  onRunHostedClaudeHealthCheck,
  onRunProofLearningLoop,
  onRunModelBatchCalibration,
  onRunPromptComparison,
  onRunScreenshotJudge,
  onRunMutationTournament,
  onGeneratePromptFromScreenshot,
  onSaveWorkspacePackRun,
  onRunPromptCoach,
  onQueueTournament,
  onQueueWizard,
  onQuarantineOffProjectPrompts,
  onRemoveBuildRun,
  onRemoveQueueJob,
  onRemoveScreenshot,
  onRunQueueViaApi,
  onSave,
  onSaveApiBase,
  onSelectPrompt,
  onSetPromptCurationDecision,
  onRestoreBackupSnapshot,
  onSyncToApi,
  onUpdateOutcome,
  outcomeSummary,
  outcomes,
  onboardingMode,
  pairwiseReviews,
  patternExtraction,
  patternDashboard,
  projectBoundaryReport,
  promptComparisons,
  proofLearningRuns,
  promptBattle,
  promptCoach,
  promptMemory,
  promptQualityRecipe,
  promptDiff,
  projectExportPack,
  qualityGate,
  qaText,
  queueExport,
  queueJobs,
  resultImportText,
  rewriteComparison,
  benchmarkRegression,
  snapshotImportText,
  resultScore,
  runnerPlan,
  screenshotQa,
  screenshotJudgeRuns,
  screenshotPromptRuns,
  scoreBreakdown,
  scoreWeights,
  screenshots,
  searchResults,
  selectedPrompt,
  promptEvolutionSteps,
  selectedLineage,
  semanticQuery,
  sourceSafety,
  setApiBaseDraft,
  setApiTokenDraft,
  setActiveTrainStage,
  setActiveWorkspace,
  setCoachInput,
  setCompilerInput,
  setDiffLeftId,
  setDiffRightId,
  setGeneratorInput,
  setImproveText,
  setInterviewBrief,
  setLearnerQuestion,
  setModelSettings,
  setMutationSource,
  setQaText,
  setResultImportText,
  setSnapshotImportText,
  setScoreWeights,
  setSemanticQuery,
  setVectorQuery,
  skillInstallPlan,
  tournament,
  vectorQuery,
  vectorResults,
  visualQa,
  visualRegression,
  visualAnalysisResult,
  archetypePromptPacks,
  repairedPrompt,
  resultGallery,
  reusableMemoryPack,
  setWizardIdea,
  wizardBattle,
  wizardCompiled,
  wizardIdea,
  winExplanation,
  workspaceExamples,
  mutationTournamentRuns,
  workspacePackRuns,
  workspacePackSnapshot,
}: {
  activeTrainStage: string;
  activeWorkspace: WorkspaceKey;
  activeWorkspacePreset: (typeof workspacePresets)[number];
  autoBattleResult?: Record<string, unknown>;
  apiHealth?: ApiHealth;
  apiNotice: string;
  apiBaseDraft: string;
  apiEvents: ApiEvent[];
  apiTokenDraft: string;
  backupSnapshots: TrainingBackupSnapshot[];
  benchmarkRuns: BenchmarkRun[];
  buildFeedback: BuildFeedbackReport;
  buildRuns: BuildRunRecord[];
  claudeHealthChecks: HostedClaudeHealthCheck[];
  codexBuildPack: CodexBuildPack;
  closedLoopRuns: ClosedLoopRun[];
  codexSkill: string;
  coachInput: string;
  coachResult?: Record<string, unknown>;
  compiledPrompt: CompiledPrompt;
  compilerInput: PromptCompilerInput;
  copied: string;
  corpusCleaning: CorpusCleaningReport;
  corpusQualityCards: ReturnType<typeof buildCorpusQualityCards>;
  curationDecisions: Record<string, CurationDecision>;
  curationReport: CorpusCurationReport;
  dbStatus: string;
  dnaCalibration: DnaCalibrationReport;
  dnaExplanation: DnaScoreExplanation;
  datasetVersions: DatasetVersion[];
  datasetComparison: DatasetVersionComparison;
  dnaV2: PromptDnaV2;
  diffLeftId: string;
  diffRightId: string;
  driftReport: DriftReport;
  examples: PromptExample[];
  evaluationHistory: EvaluationHistoryReport;
  exportPresets: ExportPreset[];
  failureMemory: FailureMemoryReport;
  improvedPrompt: string;
  improveText: string;
  interviewBrief: InterviewBrief;
  interviewPrompt: string;
  goldenRecipes: GoldenRecipe[];
  goldenChallengeBoard: ReturnType<typeof buildGoldenChallengeBoard>;
  goldReview: GoldReviewReport;
  guidedWizard: GuidedPromptWizardReport;
  qualityGraderV2: QualityGraderV2;
  generatorPresets: GeneratorPreset[];
  generatorInput: LearnedGeneratorInput;
  hostedSyncReport: HostedSyncReport;
  learnerAnswer: LearnerAnswerReport;
  learnerQuestion: string;
  learnedGeneratorVariants: LearnedGeneratorVariant[];
  leakageGuard: LeakageGuardReport;
  experimentLeaderboard: ExperimentLeaderboardReport;
  leaderboard: PromptRank[];
  learningExamples: PromptExample[];
  localIndex: LocalEmbeddingIndex;
  modelBatchEvaluations: ModelBatchEvaluation[];
  modelEvaluation?: Record<string, unknown>;
  modelEnvStatus?: Record<string, boolean>;
  modelNotice: string;
  modelSettings: {
    provider: string;
    endpoint: string;
    apiKey: string;
    model: string;
    temperature: number;
    agentCommand: string;
    buildCommand: string;
  };
  mutationSource: string;
  mutations: PromptMutation[];
  onAddBuildRun: (prompt: PromptExample, fields: Omit<BuildRunRecord, "id" | "promptId" | "promptTitle" | "promptText" | "score" | "failureCategories" | "createdAt" | "updatedAt">) => void;
  onAddPairwiseReview: (left: PromptExample | undefined, right: PromptExample | undefined, winnerId: string, reason: string) => void;
  onAddScreenshot: (record: Omit<ScreenshotRecord, "id" | "createdAt">) => void;
  onApplyCurationRecommendations: () => void;
  onApplyResultLearningPatch: () => void;
  onApplyGeneratorPreset: (preset: GeneratorPreset) => void;
  onApplyGeneratorVariant: (variant: LearnedGeneratorVariant) => void;
  onApplyGoldReview: () => void;
  onApplyProviderPreset: (kind: "local" | "anthropic" | "openai-compatible" | "codex-agent" | "scaffold-build") => void;
  onAnalyzeSelectedVisuals: () => void;
  onBulkPromoteLeaderboard: () => void;
  onCaptureSelectedResult: () => void;
  onCheckApi: () => void;
  onConnectHostedBrain: () => void;
  onChooseOnboardingMode: (mode: OnboardingMode) => void;
  onCreateBackupSnapshot: (label?: string) => void;
  onCreateDatasetVersion: () => void;
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  onExportBackupSnapshot: (id?: string) => void;
  onExportCodexBuildPack: () => void;
  onExportPreset: (preset: ExportPreset) => void;
  onExportMemoryPack: () => void;
  onExportProjectPack: () => void;
  onExportQueue: () => void;
  onExportTrainingSnapshot: () => void;
  onImportTrainingSnapshot: () => void;
  onImportResultJson: () => void;
  onInstallSkill: () => void;
  onLoadDemoMode: () => void;
  onModelEvaluate: () => void;
  onOneClickLearningLoop: () => void;
  onRunOneClickBuildProof: () => void;
  onPullFromApi: () => void;
  onQueueBattle: () => void;
  onQuarantineWeakCorpus: () => void;
  onRefreshApiEvents: () => void;
  onRunAutonomousBattle: () => void;
  onRunAutomatedVisualQa: () => void;
  onRunBenchmarkSuite: () => void;
  onRunClosedLoopTrainer: () => void;
  onRunCorpusHygieneSweep: () => void;
  onRunHostedClaudeHealthCheck: () => void;
  onRunProofLearningLoop: () => void;
  onRunModelBatchCalibration: () => void;
  onRunPromptComparison: (left: PromptExample | undefined, right: PromptExample | undefined) => void;
  onRunScreenshotJudge: () => void;
  onRunMutationTournament: () => void;
  onGeneratePromptFromScreenshot: (input: { title: string; url: string; notes: string; siteType: string }) => Promise<ScreenshotPromptRun>;
  onSaveWorkspacePackRun: () => void;
  onRunPromptCoach: () => void;
  onQueueTournament: () => void;
  onQueueWizard: () => void;
  onQuarantineOffProjectPrompts: () => void;
  onRemoveBuildRun: (id: string) => void;
  onRemoveQueueJob: (id: string) => void;
  onRemoveScreenshot: (id: string) => void;
  onRunQueueViaApi: () => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  onSaveApiBase: () => void;
  onSelectPrompt: (id: string) => void;
  onSetPromptCurationDecision: (promptId: string, decision: CurationDecision) => void;
  onRestoreBackupSnapshot: (id: string) => void;
  onSyncToApi: () => void;
  onUpdateOutcome: (prompt: PromptExample, patch: Partial<Pick<OutcomeRecord, "rating" | "status" | "notes">>) => void;
  outcomeSummary: OutcomeSummary;
  outcomes: OutcomeRecord[];
  onboardingMode: OnboardingMode;
  pairwiseReviews: PairwiseReviewRecord[];
  patternExtraction: PatternExtractionReport;
  patternDashboard: PatternDashboardReport;
  projectBoundaryReport: ProjectBoundaryReport;
  promptComparisons: PromptComparisonRun[];
  proofLearningRuns: ProofLearningRun[];
  promptBattle: PromptBattle;
  promptCoach: PromptCoachReport;
  promptMemory: PromptMemoryExport;
  promptQualityRecipe: string;
  promptDiff?: PromptDiff;
  projectExportPack: ProjectExportPack;
  qualityGate: QualityGateReport;
  qaText: string;
  queueExport: string;
  queueJobs: BuildQueueJob[];
  resultImportText: string;
  rewriteComparison: PromptImprovementComparison;
  benchmarkRegression: BenchmarkRegressionReport;
  snapshotImportText: string;
  resultScore: ResultScore;
  runnerPlan?: BuildRunnerPlan;
  screenshotQa: ScreenshotQaReport;
  screenshotJudgeRuns: ScreenshotJudgeRun[];
  screenshotPromptRuns: ScreenshotPromptRun[];
  scoreBreakdown: ScoreBreakdown;
  scoreWeights: ScoreWeights;
  screenshots: ScreenshotRecord[];
  searchResults: SearchResult[];
  selectedPrompt?: PromptExample;
  promptEvolutionSteps: PromptEvolutionStep[];
  selectedLineage: PromptLineageNode[];
  semanticQuery: string;
  sourceSafety: SourceSafetyReport;
  setApiBaseDraft: (value: string) => void;
  setApiTokenDraft: (value: string) => void;
  setActiveTrainStage: (stage: string) => void;
  setActiveWorkspace: (workspace: WorkspaceKey) => void;
  setCoachInput: (value: string) => void;
  setCompilerInput: Dispatch<SetStateAction<PromptCompilerInput>>;
  setDiffLeftId: (id: string) => void;
  setDiffRightId: (id: string) => void;
  setGeneratorInput: Dispatch<SetStateAction<LearnedGeneratorInput>>;
  setImproveText: (value: string) => void;
  setInterviewBrief: Dispatch<SetStateAction<InterviewBrief>>;
  setLearnerQuestion: (value: string) => void;
  setModelSettings: Dispatch<
    SetStateAction<{
      provider: string;
      endpoint: string;
      apiKey: string;
      model: string;
      temperature: number;
      agentCommand: string;
      buildCommand: string;
    }>
  >;
  setMutationSource: (value: string) => void;
  setQaText: (value: string) => void;
  setResultImportText: (value: string) => void;
  setSnapshotImportText: (value: string) => void;
  setScoreWeights: Dispatch<SetStateAction<ScoreWeights>>;
  setSemanticQuery: (value: string) => void;
  setVectorQuery: (value: string) => void;
  skillInstallPlan: SkillInstallPlan;
  tournament: PromptTournament;
  vectorQuery: string;
  vectorResults: VectorSearchResult[];
  visualQa: VisualQaReport;
  visualRegression: VisualRegressionReport;
  visualAnalysisResult?: Record<string, unknown>;
  archetypePromptPacks: PromptPack[];
  repairedPrompt: string;
  resultGallery: ResultGalleryItem[];
  reusableMemoryPack: ReusableMemoryPack;
  setWizardIdea: (value: string) => void;
  wizardBattle: PromptBattle;
  wizardCompiled: CompiledPrompt;
  wizardIdea: string;
  winExplanation: PromptWinExplanationReport;
  workspaceExamples: PromptExample[];
  mutationTournamentRuns: MutationTournamentRun[];
  workspacePackRuns: WorkspacePackRun[];
  workspacePackSnapshot: WorkspacePackRun["packs"];
}) {
  const [sectionQuery, setSectionQuery] = useState("");
  const trainSections = [
    { id: "workflow", label: "Workflow" },
    { id: "api", label: "API" },
    { id: "workspace", label: "Workspaces" },
    { id: "generate", label: "Generate" },
    { id: "patterns", label: "Patterns" },
    { id: "improve", label: "Improve" },
    { id: "screenshots", label: "Screenshots" },
    { id: "packs", label: "Packs" },
    { id: "sync", label: "Sync" },
    { id: "queue", label: "Queue" },
    { id: "lineage", label: "Lineage" },
  ].filter((item) => item.label.toLowerCase().includes(sectionQuery.trim().toLowerCase()));

  function scrollToTrainSection(id: string) {
    document.querySelector(`[data-train-section="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateBrief<K extends keyof InterviewBrief>(key: K, value: InterviewBrief[K]) {
    setInterviewBrief((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="train-grid">
      <section className="panel hero-panel train-hero" data-train-section="workflow">
        <div>
          <p className="eyebrow">Outcome training</p>
          <h2>Closed-loop prompt learning command center.</h2>
          <p>
            Run prompts, capture screenshots, calibrate DNA against actual results, clean the corpus, remember failures,
            compile rough ideas, and tournament-test variants.
          </p>
        </div>
        <div className="outcome-scoreboard">
          <Metric value={formatNumber(dnaCalibration.calibratedScore)} label="Calibrated DNA" />
          <Metric value={formatNumber(outcomeSummary.counts.gold)} label="Gold" />
          <Metric value={formatNumber(outcomeSummary.counts.great)} label="Great" />
          <Metric value={formatNumber(outcomeSummary.counts.avoid)} label="Avoid" />
        </div>
      </section>

      <TrainSectionNavigator
        query={sectionQuery}
        sections={trainSections}
        setQuery={setSectionQuery}
        onSelect={scrollToTrainSection}
      />

      <TrainCommandCenter
        corpusCleaning={corpusCleaning}
        curationReport={curationReport}
        dbStatus={dbStatus}
        dnaCalibration={dnaCalibration}
        failureMemory={failureMemory}
        queueJobs={queueJobs}
        resultScore={resultScore}
        screenshotQa={screenshotQa}
        scoreBreakdown={scoreBreakdown}
      />

      <TrainModeLauncherPanel
        benchmarkRuns={benchmarkRuns}
        closedLoopRuns={closedLoopRuns}
        curationReport={curationReport}
        learningExamples={learningExamples}
        modelBatchEvaluations={modelBatchEvaluations}
        onSelect={scrollToTrainSection}
        outcomes={outcomes}
        queueJobs={queueJobs}
      />

      <StartHereProofLoopPanel
        buildFeedback={buildFeedback}
        onRunBenchmarkSuite={onRunBenchmarkSuite}
        onRunMutationTournament={onRunMutationTournament}
        onRunOneClickBuildProof={onRunOneClickBuildProof}
        onRunProofLearningLoop={onRunProofLearningLoop}
        onRunScreenshotJudge={onRunScreenshotJudge}
        proofLearningRuns={proofLearningRuns}
        selectedPrompt={selectedPrompt}
        screenshotJudgeRuns={screenshotJudgeRuns}
      />

      <PromptEvolutionTimelinePanel steps={promptEvolutionSteps} />

      <section className="train-columns">
        <GoldenBenchmarkBoardPanel
          board={goldenChallengeBoard}
          benchmarkRuns={benchmarkRuns}
          onRunBenchmarkSuite={onRunBenchmarkSuite}
        />
        <BenchmarkRegressionPanel report={benchmarkRegression} />
      </section>

      <section className="train-columns">
        <ProductionHardeningPanel
          apiHealth={apiHealth}
          backupSnapshots={backupSnapshots}
          datasetVersions={datasetVersions}
          modelEnvStatus={modelEnvStatus}
          proofLearningRuns={proofLearningRuns}
          screenshotJudgeRuns={screenshotJudgeRuns}
        />
        <ConnectHostedBrainPanel
          apiBaseDraft={apiBaseDraft}
          apiHealth={apiHealth}
          apiNotice={apiNotice}
          apiTokenDraft={apiTokenDraft}
          modelEnvStatus={modelEnvStatus}
          onCheckApi={onCheckApi}
          onConnectHostedBrain={onConnectHostedBrain}
          onSaveApiBase={onSaveApiBase}
          setApiBaseDraft={setApiBaseDraft}
          setApiTokenDraft={setApiTokenDraft}
        />
      </section>

      <BackendApiPanel
        apiBaseDraft={apiBaseDraft}
        apiHealth={apiHealth}
        apiNotice={apiNotice}
        apiTokenDraft={apiTokenDraft}
        onCaptureSelectedResult={onCaptureSelectedResult}
        onCheckApi={onCheckApi}
        onInstallSkill={onInstallSkill}
        onRunQueueViaApi={onRunQueueViaApi}
        onSaveApiBase={onSaveApiBase}
        onSyncToApi={onSyncToApi}
        queueJobs={queueJobs}
        setApiBaseDraft={setApiBaseDraft}
        setApiTokenDraft={setApiTokenDraft}
      />

      <HostedApiDeployPanel copied={copied} onCopy={onCopy} />

      <HostedClaudeSetupPanel
        copied={copied}
        modelEnvStatus={modelEnvStatus}
        modelNotice={modelNotice}
        modelSettings={modelSettings}
        onApplyProviderPreset={onApplyProviderPreset}
        onCopy={onCopy}
      />

      <ClaudeHealthDeepCheckPanel
        apiHealth={apiHealth}
        checks={claudeHealthChecks}
        modelEnvStatus={modelEnvStatus}
        onRunHostedClaudeHealthCheck={onRunHostedClaudeHealthCheck}
      />

      <ProjectWorkspacePanel
        activeWorkspace={activeWorkspace}
        activeWorkspacePreset={activeWorkspacePreset}
        learningExamples={learningExamples}
        setActiveWorkspace={setActiveWorkspace}
        workspaceExamples={workspaceExamples}
      />

      <ProjectBoundaryGuardPanel
        activeWorkspace={activeWorkspace}
        onQuarantineOffProjectPrompts={onQuarantineOffProjectPrompts}
        projectBoundaryReport={projectBoundaryReport}
        setActiveWorkspace={setActiveWorkspace}
      />

      <TrainingSetCuratorV2Panel
        curationReport={curationReport}
        onSelectPrompt={onSelectPrompt}
        onSetPromptCurationDecision={onSetPromptCurationDecision}
        projectBoundaryReport={projectBoundaryReport}
      />

      <OneClickLearningLoopPanel
        guidedWizard={guidedWizard}
        onOneClickLearningLoop={onOneClickLearningLoop}
        queueJobs={queueJobs}
        resultScore={resultScore}
        selectedPrompt={selectedPrompt}
      />

      <SimplePromptFrontDoorPanel
        copied={copied}
        generatorInput={generatorInput}
        guidedWizard={guidedWizard}
        onApplyGeneratorVariant={onApplyGeneratorVariant}
        onCopy={onCopy}
        onRunClosedLoopTrainer={onRunClosedLoopTrainer}
        onSave={onSave}
        setGeneratorInput={setGeneratorInput}
      />

      <GreatPromptWizardPanel
        copied={copied}
        generatorInput={generatorInput}
        guidedWizard={guidedWizard}
        onApplyGeneratorVariant={onApplyGeneratorVariant}
        onCopy={onCopy}
        onRunClosedLoopTrainer={onRunClosedLoopTrainer}
        onSave={onSave}
        setGeneratorInput={setGeneratorInput}
      />

      <section className="train-columns">
        <ClosedLoopTrainerPanel
          closedLoopRuns={closedLoopRuns}
          guidedWizard={guidedWizard}
          modelSettings={modelSettings}
          onRunClosedLoopTrainer={onRunClosedLoopTrainer}
        />
        <BenchmarkSuitePanel
          benchmarkRuns={benchmarkRuns}
          onRunBenchmarkSuite={onRunBenchmarkSuite}
        />
      </section>

      <section className="train-columns">
        <PromptQualityRecipePanel
          copied={copied}
          onCopy={onCopy}
          onDownload={onDownload}
          onSave={onSave}
          promptQualityRecipe={promptQualityRecipe}
        />
        <CorpusQualityDashboardPanel cards={corpusQualityCards} />
      </section>

      <section className="train-columns">
        <ReviewQueuePanel
          curationReport={curationReport}
          leaderboard={leaderboard}
          onSetPromptCurationDecision={onSetPromptCurationDecision}
          onUpdateOutcome={onUpdateOutcome}
          outcomes={outcomes}
        />
        <CorpusHygieneSweepPanel
          corpusCleaning={corpusCleaning}
          curationReport={curationReport}
          leakageGuard={leakageGuard}
          onRunCorpusHygieneSweep={onRunCorpusHygieneSweep}
        />
      </section>

      <ResultLearningPanel
        buildFeedback={buildFeedback}
        copied={copied}
        onApplyResultLearningPatch={onApplyResultLearningPatch}
        onCopy={onCopy}
        onSave={onSave}
        repairedPrompt={repairedPrompt}
        resultScore={resultScore}
      />

      <section className="train-columns">
        <PromptComparisonClaudePanel
          copied={copied}
          diffLeftId={diffLeftId}
          diffRightId={diffRightId}
          examples={learningExamples}
          onCopy={onCopy}
          onRunPromptComparison={onRunPromptComparison}
          promptComparisons={promptComparisons}
          setDiffLeftId={setDiffLeftId}
          setDiffRightId={setDiffRightId}
        />
        <ScreenshotPromptGeneratorPanel
          copied={copied}
          onCopy={onCopy}
          onGeneratePromptFromScreenshot={onGeneratePromptFromScreenshot}
          onSave={onSave}
          runs={screenshotPromptRuns}
        />
      </section>

      <SecurityOpsPanel
        apiEvents={apiEvents}
        apiHealth={apiHealth}
        apiNotice={apiNotice}
        onRefreshApiEvents={onRefreshApiEvents}
      />

      <StageNavPanel activeStage={activeTrainStage} setActiveStage={setActiveTrainStage} />

      <ProductOnboardingPanel
        mode={onboardingMode}
        onChooseMode={onChooseOnboardingMode}
        onCreateBackupSnapshot={onCreateBackupSnapshot}
        onExportCodexBuildPack={onExportCodexBuildPack}
        onSyncToApi={onSyncToApi}
      />

      <FirstRunWizardPanel
        apiHealth={apiHealth}
        curationReport={curationReport}
        datasetVersions={datasetVersions}
        learningExamples={learningExamples}
        modelEnvStatus={modelEnvStatus}
        onApplyCurationRecommendations={onApplyCurationRecommendations}
        onCreateDatasetVersion={onCreateDatasetVersion}
        onExportMemoryPack={onExportMemoryPack}
        onLoadDemoMode={onLoadDemoMode}
        onRunModelBatchCalibration={onRunModelBatchCalibration}
      />

      <GuidedPromptWizardPanel
        copied={copied}
        generatorInput={generatorInput}
        guidedWizard={guidedWizard}
        onApplyGeneratorVariant={onApplyGeneratorVariant}
        onCopy={onCopy}
        onSave={onSave}
        setGeneratorInput={setGeneratorInput}
      />

      <section className="train-columns">
        <PatternExtractionPanel copied={copied} onCopy={onCopy} patternExtraction={patternExtraction} />
        <AskLearnerPanel
          answer={learnerAnswer}
          copied={copied}
          onCopy={onCopy}
          question={learnerQuestion}
          setQuestion={setLearnerQuestion}
        />
      </section>

      <section className="train-columns">
        <PromptImprovementStudioPanel
          coachInput={coachInput}
          copied={copied}
          onCopy={onCopy}
          onSave={onSave}
          rewriteComparison={rewriteComparison}
          setCoachInput={setCoachInput}
        />
        <ScreenshotScoringStudioPanel
          onAddScreenshot={onAddScreenshot}
          onUpdateOutcome={onUpdateOutcome}
          selectedPrompt={selectedPrompt}
        />
      </section>

      <ArchetypePromptPackPanel
        copied={copied}
        onCopy={onCopy}
        onDownload={onDownload}
        packs={archetypePromptPacks}
      />

      <WorkspacePromptPacksPanel
        copied={copied}
        onCopy={onCopy}
        onDownload={onDownload}
        onSaveWorkspacePackRun={onSaveWorkspacePackRun}
        packs={workspacePackSnapshot}
        runs={workspacePackRuns}
      />

      <ExportFormatStudioPanel
        copied={copied}
        onCopy={onCopy}
        onDownload={onDownload}
        onSave={onSave}
        packs={archetypePromptPacks}
        promptMemory={promptMemory}
        selectedPrompt={selectedPrompt}
      />

      <section className="train-columns">
        <SourceSafetyDashboard
          leakageGuard={leakageGuard}
          onSelectPrompt={onSelectPrompt}
          sourceSafety={sourceSafety}
        />
        <LeakageGuardPanel leakageGuard={leakageGuard} onSelectPrompt={onSelectPrompt} />
      </section>

      <section className="train-columns">
        <GoldAvoidCurationPanel
          leaderboard={leaderboard}
          onSelectPrompt={onSelectPrompt}
          onUpdateOutcome={onUpdateOutcome}
          outcomes={outcomes}
        />
        <DnaScoreExplainerPanel dnaExplanation={dnaExplanation} selectedPrompt={selectedPrompt} />
      </section>

      <QualityGraderV2Panel grader={qualityGraderV2} />

      <section className="train-columns">
        <PromptGeneratorBattleModePanel
          copied={copied}
          onApplyGeneratorVariant={onApplyGeneratorVariant}
          onCopy={onCopy}
          onQueueBattle={onQueueBattle}
          onSave={onSave}
          promptBattle={promptBattle}
          variants={learnedGeneratorVariants}
        />
        <BuildFeedbackLoopPanel
          buildFeedback={buildFeedback}
          onQueueBattle={onQueueBattle}
          onUpdateOutcome={onUpdateOutcome}
          selectedPrompt={selectedPrompt}
        />
      </section>

      <PersistenceStatusPanel
        apiEvents={apiEvents}
        apiHealth={apiHealth}
        apiNotice={apiNotice}
        buildRuns={buildRuns}
        dbStatus={dbStatus}
        examples={examples}
        hostedSyncReport={hostedSyncReport}
        onCheckApi={onCheckApi}
        onPullFromApi={onPullFromApi}
        onSyncToApi={onSyncToApi}
        outcomes={outcomes}
        screenshots={screenshots}
      />

      <section className="train-columns">
        <CorpusCurationPanel
          curationDecisions={curationDecisions}
          curationReport={curationReport}
          onApplyCurationRecommendations={onApplyCurationRecommendations}
          onSetPromptCurationDecision={onSetPromptCurationDecision}
        />
        <ModelBatchCalibrationPanel
          evaluations={modelBatchEvaluations}
          modelNotice={modelNotice}
          onRunModelBatchCalibration={onRunModelBatchCalibration}
        />
      </section>

      <section className="train-columns">
        <PairwiseLabelingPanel
          examples={learningExamples}
          onAddPairwiseReview={onAddPairwiseReview}
          pairwiseReviews={pairwiseReviews}
        />
        <PatternDashboardPanel patternDashboard={patternDashboard} />
      </section>

      <section className="train-columns">
        <VisualEvidenceDashboardPanel
          buildRuns={buildRuns}
          screenshots={screenshots}
          visualAnalysisResult={visualAnalysisResult}
          visualRegression={visualRegression}
        />
        <AutomatedVisualQaPanel
          onRunAutomatedVisualQa={onRunAutomatedVisualQa}
          selectedPrompt={selectedPrompt}
          visualAnalysisResult={visualAnalysisResult}
          visualRegression={visualRegression}
        />
      </section>

      <section className="train-columns">
        <ProjectExportPackPanel
          onExportProjectPack={onExportProjectPack}
          projectExportPack={projectExportPack}
        />
        <ExportPresetPanel
          exportPresets={exportPresets}
          onCopy={onCopy}
          onExportPreset={onExportPreset}
        />
      </section>

      <CodexBuildPackPanel
        codexBuildPack={codexBuildPack}
        copied={copied}
        onCopy={onCopy}
        onExportCodexBuildPack={onExportCodexBuildPack}
      />

      <PromptCoachPanel
        coachInput={coachInput}
        coachResult={coachResult}
        onRunPromptCoach={onRunPromptCoach}
        promptCoach={promptCoach}
        setCoachInput={setCoachInput}
      />

      <section className="train-columns">
        <QualityGatePanel copied={copied} onCopy={onCopy} qualityGate={qualityGate} />
        <GoldReviewPanel goldReview={goldReview} onApplyGoldReview={onApplyGoldReview} />
      </section>

      <section className="train-columns">
        <AutonomousBattlePanel
          autoBattleResult={autoBattleResult}
          onQueueBattle={onQueueBattle}
          onRunAutonomousBattle={onRunAutonomousBattle}
          promptBattle={promptBattle}
        />
        <MutationTournamentHistoryPanel
          mutationTournamentRuns={mutationTournamentRuns}
          onRunMutationTournament={onRunMutationTournament}
        />
      </section>

      <PromptWinInsightPanel winExplanation={winExplanation} />

      <ExperimentLeaderboardPanel
        experimentLeaderboard={experimentLeaderboard}
        onBulkPromoteLeaderboard={onBulkPromoteLeaderboard}
        onSelectPrompt={onSelectPrompt}
      />

      <EvaluationHistoryPanel evaluationHistory={evaluationHistory} />

      <LearnedGeneratorWorkspacePanel
        generatorInput={generatorInput}
        variants={learnedGeneratorVariants}
        onApplyGeneratorVariant={onApplyGeneratorVariant}
        onCopy={onCopy}
        onSave={onSave}
        setGeneratorInput={setGeneratorInput}
      />

      <section className="train-columns">
        <GeneratorPresetPanel
          copied={copied}
          generatorPresets={generatorPresets}
          onApplyGeneratorPreset={onApplyGeneratorPreset}
          onCopy={onCopy}
          onSave={onSave}
        />
        <DatasetToolPanel
          curationReport={curationReport}
          datasetComparison={datasetComparison}
          onBulkPromoteLeaderboard={onBulkPromoteLeaderboard}
          onCreateDatasetVersion={onCreateDatasetVersion}
          onQuarantineWeakCorpus={onQuarantineWeakCorpus}
        />
      </section>

      <section className="train-columns">
        <ResultGalleryPanel resultGallery={resultGallery} />
        <ReusableMemoryPackPanel
          copied={copied}
          onCopy={onCopy}
          onExportMemoryPack={onExportMemoryPack}
          reusableMemoryPack={reusableMemoryPack}
        />
      </section>

      <OneClickWizardPanel
        copied={copied}
        onCopy={onCopy}
        onQueueWizard={onQueueWizard}
        onSave={onSave}
        setWizardIdea={setWizardIdea}
        wizardBattle={wizardBattle}
        wizardCompiled={wizardCompiled}
        wizardIdea={wizardIdea}
      />

      <section className="train-columns">
        <DnaV2Panel dnaV2={dnaV2} />
        <GoldenRecipesPanel goldenRecipes={goldenRecipes} />
      </section>

      <section className="train-columns">
        <PromptBattlePanel copied={copied} onCopy={onCopy} onQueueBattle={onQueueBattle} onSave={onSave} promptBattle={promptBattle} />
        <FailureRepairPanel copied={copied} onCopy={onCopy} onSave={onSave} repairedPrompt={repairedPrompt} />
      </section>

      <section className="train-columns">
        <DatasetVersionPanel
          datasetVersions={datasetVersions}
          onCopy={onCopy}
          onCreateDatasetVersion={onCreateDatasetVersion}
          copied={copied}
        />
        <ModelProviderSettingsPanel
          modelEnvStatus={modelEnvStatus}
          modelSettings={modelSettings}
          onApplyProviderPreset={onApplyProviderPreset}
          setModelSettings={setModelSettings}
        />
      </section>

      <VisualAnalyzerPanel
        onAnalyzeSelectedVisuals={onAnalyzeSelectedVisuals}
        visualAnalysisResult={visualAnalysisResult}
      />

      <section className="train-columns">
        <ResultImporterPanel
          onImportResultJson={onImportResultJson}
          resultImportText={resultImportText}
          setResultImportText={setResultImportText}
        />
        <TrainingSnapshotPanel
          copied={copied}
          onCopy={onCopy}
          onExportTrainingSnapshot={onExportTrainingSnapshot}
          onImportTrainingSnapshot={onImportTrainingSnapshot}
          queueExport={queueExport}
          scoreWeights={scoreWeights}
          setSnapshotImportText={setSnapshotImportText}
          snapshotImportText={snapshotImportText}
        />
      </section>

      <BackupRestorePanel
        backupSnapshots={backupSnapshots}
        onCreateBackupSnapshot={onCreateBackupSnapshot}
        onExportBackupSnapshot={onExportBackupSnapshot}
        onRestoreBackupSnapshot={onRestoreBackupSnapshot}
      />

      <section className="train-columns">
        <PromptMemoryPanel copied={copied} onCopy={onCopy} onDownload={onDownload} promptMemory={promptMemory} />
        <ModelIntegrationPanel
          modelEvaluation={modelEvaluation}
          modelNotice={modelNotice}
          onModelEvaluate={onModelEvaluate}
          selectedPrompt={selectedPrompt}
        />
      </section>

      <section className="train-columns">
        <PromptResultComparisonPanel
          buildRuns={buildRuns}
          diffLeftId={diffLeftId}
          diffRightId={diffRightId}
          examples={examples}
          screenshots={screenshots}
          scoreWeights={scoreWeights}
          setDiffLeftId={setDiffLeftId}
          setDiffRightId={setDiffRightId}
        />
      </section>

      <section className="train-columns">
        <VisualComparisonPanel buildRuns={buildRuns} screenshots={screenshots} selectedPrompt={selectedPrompt} />
        <RunTimelinePanel buildRuns={buildRuns} lineage={selectedLineage} queueJobs={queueJobs} screenshots={screenshots} />
      </section>

      <section className="train-columns">
        <ScoringWeightPanel scoreWeights={scoreWeights} setScoreWeights={setScoreWeights} />
        <PromptLineagePanel lineage={selectedLineage} />
      </section>

      <section className="train-columns">
        <BuildQueuePanel
          copied={copied}
          onCopy={onCopy}
          onExportQueue={onExportQueue}
          onQueueTournament={onQueueTournament}
          onRemoveQueueJob={onRemoveQueueJob}
          queueExport={queueExport}
          queueJobs={queueJobs}
        />
        <ScoreModelPanel scoreBreakdown={scoreBreakdown} />
      </section>

      <section className="train-columns">
        <VectorSearchPanel
          onSelectPrompt={onSelectPrompt}
          query={vectorQuery}
          results={vectorResults}
          setQuery={setVectorQuery}
        />
      </section>

      <section className="train-columns">
        <BuildRunPanel
          buildRuns={buildRuns}
          copied={copied}
          onAddBuildRun={onAddBuildRun}
          onCopy={onCopy}
          onDownload={onDownload}
          onRemoveBuildRun={onRemoveBuildRun}
          onSave={onSave}
          runnerPlan={runnerPlan}
          selectedPrompt={selectedPrompt}
        />
        <ScreenshotQaPanel copied={copied} onCopy={onCopy} screenshotQa={screenshotQa} />
      </section>

      <section className="train-columns">
        <ResultScorePanel resultScore={resultScore} />
        <DnaCalibrationPanel dnaCalibration={dnaCalibration} onSelectPrompt={onSelectPrompt} />
      </section>

      <section className="train-columns">
        <CorpusCleaningPanel corpusCleaning={corpusCleaning} onSelectPrompt={onSelectPrompt} />
        <FailureMemoryPanel copied={copied} failureMemory={failureMemory} onCopy={onCopy} />
      </section>

      <section className="train-columns">
        <PromptCompilerPanel
          compiledPrompt={compiledPrompt}
          compilerInput={compilerInput}
          copied={copied}
          onCopy={onCopy}
          onSave={onSave}
          setCompilerInput={setCompilerInput}
        />
        <TournamentPanel copied={copied} onCopy={onCopy} onSave={onSave} tournament={tournament} />
      </section>

      <section className="train-columns">
        <OutcomePanel
          outcomes={outcomes}
          outcomeSummary={outcomeSummary}
          selectedPrompt={selectedPrompt}
          onUpdateOutcome={onUpdateOutcome}
        />
        <ScreenshotPanel
          onAddScreenshot={onAddScreenshot}
          onRemoveScreenshot={onRemoveScreenshot}
          screenshots={screenshots}
          selectedPrompt={selectedPrompt}
        />
      </section>

      <section className="train-columns">
        <SemanticSearchPanel
          onSelectPrompt={onSelectPrompt}
          query={semanticQuery}
          results={searchResults}
          setQuery={setSemanticQuery}
        />
        <PromptDiffPanel
          copied={copied}
          diff={promptDiff}
          examples={examples}
          leftId={diffLeftId}
          onCopy={onCopy}
          onSave={onSave}
          rightId={diffRightId}
          setLeftId={setDiffLeftId}
          setRightId={setDiffRightId}
        />
      </section>

      <section className="train-columns">
        <VisualQaPanel driftReport={driftReport} qaText={qaText} setQaText={setQaText} visualQa={visualQa} />
        <InterviewPanel
          brief={interviewBrief}
          copied={copied}
          onCopy={onCopy}
          onSave={onSave}
          prompt={interviewPrompt}
          updateBrief={updateBrief}
        />
      </section>

      <section className="train-columns">
        <MutationLabPanel
          copied={copied}
          mutations={mutations}
          mutationSource={mutationSource}
          onCopy={onCopy}
          onSave={onSave}
          setMutationSource={setMutationSource}
        />
        <ImprovePanel
          copied={copied}
          improvedPrompt={improvedPrompt}
          improveText={improveText}
          onCopy={onCopy}
          onSave={onSave}
          setImproveText={setImproveText}
        />
      </section>

      <section className="train-columns">
        <LeaderboardPanel leaderboard={leaderboard} onSelectPrompt={onSelectPrompt} />
        <SkillInstallPanel copied={copied} onCopy={onCopy} plan={skillInstallPlan} />
      </section>

      <section className="train-columns">
        <LocalIndexPanel localIndex={localIndex} />
        <GuidedWorkflowPanel />
      </section>

      <section className="panel lab-panel">
        <div className="output-header">
          <div className="panel-header">
            <Archive size={18} />
            <h2>Export as Codex skill</h2>
          </div>
          <div className="button-row">
            <button className="ghost-button compact-button" type="button" onClick={() => onCopy(codexSkill, "codex-skill")}>
              {copied === "codex-skill" ? <Check size={15} /> : <Copy size={15} />}
              Copy
            </button>
            <button className="primary-button compact-button" type="button" onClick={() => onDownload("website-prompt-atelier-SKILL.md", codexSkill, "text/markdown")}>
              <Download size={15} />
              Download
            </button>
            <button className="ghost-button compact-button" type="button" onClick={() => onSave("skill", "Website Prompt Atelier skill", codexSkill)}>
              <Save size={15} />
              Save
            </button>
          </div>
        </div>
        <textarea className="generated-output style-guide-output" readOnly value={codexSkill} />
      </section>
    </div>
  );
}

function TrainSectionNavigator({
  onSelect,
  query,
  sections,
  setQuery,
}: {
  onSelect: (id: string) => void;
  query: string;
  sections: { id: string; label: string }[];
  setQuery: (value: string) => void;
}) {
  return (
    <section className="panel train-section-nav" aria-label="Train section navigator">
      <label className="search-field">
        <Search size={15} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Jump to workflow, API, screenshots..." />
      </label>
      <div className="train-section-buttons">
        {sections.map((section) => (
          <button key={section.id} type="button" onClick={() => onSelect(section.id)}>
            {section.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function ProjectWorkspacePanel({
  activeWorkspace,
  activeWorkspacePreset,
  learningExamples,
  setActiveWorkspace,
  workspaceExamples,
}: {
  activeWorkspace: WorkspaceKey;
  activeWorkspacePreset: (typeof workspacePresets)[number];
  learningExamples: PromptExample[];
  setActiveWorkspace: (workspace: WorkspaceKey) => void;
  workspaceExamples: PromptExample[];
}) {
  return (
    <section className="panel lab-panel" data-train-section="workspace">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Project workspaces</h2>
        </div>
        <div className="workspace-pill">{activeWorkspacePreset.label}</div>
      </div>
      <p className="selected-meta">
        Separate training taste by project type. The active workspace feeds curation, pattern extraction, scoring, generator presets, and exports.
      </p>
      <div className="workspace-grid">
        {workspacePresets.map((workspace) => (
          <button
            className={workspace.key === activeWorkspace ? "active" : ""}
            key={workspace.key}
            type="button"
            onClick={() => setActiveWorkspace(workspace.key)}
          >
            <strong>{workspace.label}</strong>
            <span>{workspace.description}</span>
          </button>
        ))}
      </div>
      <div className="source-safety-grid">
        <article className="index-card">
          <strong>{workspaceExamples.length}</strong>
          <span>workspace prompts</span>
        </article>
        <article className="index-card">
          <strong>{learningExamples.length}</strong>
          <span>learning prompts</span>
        </article>
        <article className="index-card wide-index-card">
          <h3>Workspace query</h3>
          <p>{activeWorkspacePreset.query.join(", ") || "No filter; full corpus."}</p>
        </article>
      </div>
    </section>
  );
}

function ProjectBoundaryGuardPanel({
  activeWorkspace,
  onQuarantineOffProjectPrompts,
  projectBoundaryReport,
  setActiveWorkspace,
}: {
  activeWorkspace: WorkspaceKey;
  onQuarantineOffProjectPrompts: () => void;
  projectBoundaryReport: ProjectBoundaryReport;
  setActiveWorkspace: (workspace: WorkspaceKey) => void;
}) {
  return (
    <section className="panel lab-panel project-boundary-panel" data-train-section="workspace">
      <div className="output-header">
        <div className="panel-header">
          <AlertTriangle size={18} />
          <h2>Project isolation guard</h2>
        </div>
        <span className="workspace-pill">{projectBoundaryReport.mode}</span>
      </div>
      <div className="source-safety-grid">
        <article className="index-card">
          <strong>{projectBoundaryReport.inScopeCount}</strong>
          <span>in scope</span>
        </article>
        <article className="index-card">
          <strong>{projectBoundaryReport.outOfScopeCount}</strong>
          <span>off project</span>
        </article>
        <article className="index-card">
          <strong>{projectBoundaryReport.quarantineCount}</strong>
          <span>quarantine</span>
        </article>
        <article className="index-card wide-index-card">
          <h3>Sources</h3>
          <p>{Object.entries(projectBoundaryReport.sourceCounts).map(([source, count]) => `${source}: ${count}`).join(" / ")}</p>
        </article>
      </div>
      <FeedbackList title="Boundary warnings" items={projectBoundaryReport.warnings} empty="No active boundary warnings." />
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={() => setActiveWorkspace(activeWorkspace === "all" ? "hero" : activeWorkspace)}>
          Use isolated workspace
        </button>
        <button className="ghost-button compact-button" type="button" onClick={onQuarantineOffProjectPrompts} disabled={activeWorkspace === "all" || !projectBoundaryReport.outOfScope.length}>
          Quarantine visible mismatches
        </button>
      </div>
      <div className="version-list compact-list">
        {projectBoundaryReport.outOfScope.map((prompt) => (
          <article className="version-card" key={prompt.id}>
            <strong>{prompt.title}</strong>
            <p>{countWords(prompt.text)} words / {prompt.source}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrainingSetCuratorV2Panel({
  curationReport,
  onSelectPrompt,
  onSetPromptCurationDecision,
  projectBoundaryReport,
}: {
  curationReport: CorpusCurationReport;
  onSelectPrompt: (id: string) => void;
  onSetPromptCurationDecision: (promptId: string, decision: CurationDecision) => void;
  projectBoundaryReport: ProjectBoundaryReport;
}) {
  const queue = curationReport.items
    .filter((item) => item.recommendation !== "learn" || projectBoundaryReport.outOfScope.some((prompt) => prompt.id === item.promptId))
    .slice(0, 8);
  return (
    <section className="panel lab-panel training-set-curator-panel">
      <div className="panel-header">
        <ListChecks size={18} />
        <h2>Training set curator</h2>
      </div>
      <p className="selected-meta">
        Review gold/good/duplicate/off-project/too-vague candidates before they influence the learner.
      </p>
      <div className="version-list compact-list">
        {queue.map((item) => {
          const offProject = projectBoundaryReport.outOfScope.some((prompt) => prompt.id === item.promptId);
          return (
            <article className="version-card" key={item.promptId}>
              <div className="dna-v2-topline">
                <strong>{item.title}</strong>
                <span data-tone={scoreTone(item.confidence)}>{item.confidence}</span>
              </div>
              <p>{offProject ? "Off-project risk. " : ""}{item.reasons[0] ?? item.category}</p>
              <small>{item.category} / recommended {item.recommendation}</small>
              <div className="button-row">
                <button className="primary-button compact-button" type="button" onClick={() => onSetPromptCurationDecision(item.promptId, "learn")}>Learn</button>
                <button className="ghost-button compact-button" type="button" onClick={() => onSetPromptCurationDecision(item.promptId, "review")}>Review</button>
                <button className="ghost-button compact-button" type="button" onClick={() => onSetPromptCurationDecision(item.promptId, "quarantine")}>Quarantine</button>
                <button className="ghost-button compact-button" type="button" onClick={() => onSelectPrompt(item.promptId)}>Open</button>
              </div>
            </article>
          );
        })}
        {!queue.length ? <p className="selected-meta">No curation risks in the current workspace.</p> : null}
      </div>
    </section>
  );
}

function OneClickLearningLoopPanel({
  guidedWizard,
  onOneClickLearningLoop,
  queueJobs,
  resultScore,
  selectedPrompt,
}: {
  guidedWizard: GuidedPromptWizardReport;
  onOneClickLearningLoop: () => void;
  queueJobs: BuildQueueJob[];
  resultScore: ResultScore;
  selectedPrompt?: PromptExample;
}) {
  const variant = guidedWizard.variants[0];
  return (
    <section className="panel lab-panel" data-train-section="generate">
      <div className="output-header">
        <div className="panel-header">
          <Shuffle size={18} />
          <h2>One-click generate, score, and label</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onOneClickLearningLoop} disabled={!variant}>
          <Sparkles size={15} />
          Run loop
        </button>
      </div>
      <div className="command-center-grid">
        <article className="command-center-card">
          <strong>1. Generate</strong>
          <span data-tone={variant ? "strong" : "weak"}>{variant ? variant.score : 0}</span>
          <p>{variant?.title ?? "Complete the guided prompt workflow first."}</p>
        </article>
        <article className="command-center-card">
          <strong>2. Queue</strong>
          <span data-tone={queueJobs.length ? "strong" : "mixed"}>{queueJobs.length}</span>
          <p>Creates a queued run job so the prompt can move to the runner.</p>
        </article>
        <article className="command-center-card">
          <strong>3. Score</strong>
          <span data-tone={scoreTone(resultScore.score)}>{resultScore.score}</span>
          <p>Stores a local score row while waiting for visual proof.</p>
        </article>
        <article className="command-center-card">
          <strong>4. Label</strong>
          <span data-tone={selectedPrompt ? "mixed" : "weak"}>{selectedPrompt ? "ok" : "--"}</span>
          <p>Labels generated prompts as good or experimental until screenshots prove gold.</p>
        </article>
      </div>
    </section>
  );
}

function TrainModeLauncherPanel({
  benchmarkRuns,
  closedLoopRuns,
  curationReport,
  learningExamples,
  modelBatchEvaluations,
  onSelect,
  outcomes,
  queueJobs,
}: {
  benchmarkRuns: BenchmarkRun[];
  closedLoopRuns: ClosedLoopRun[];
  curationReport: CorpusCurationReport;
  learningExamples: PromptExample[];
  modelBatchEvaluations: ModelBatchEvaluation[];
  onSelect: (id: string) => void;
  outcomes: OutcomeRecord[];
  queueJobs: BuildQueueJob[];
}) {
  const modes = [
    { id: "generate", title: "Generate", value: learningExamples.length, detail: "Create, refine, and save build-ready website prompts." },
    { id: "patterns", title: "Patterns", value: outcomes.filter((outcome) => outcome.status === "gold").length, detail: "Mine gold/good examples for reusable prompt DNA." },
    { id: "sync", title: "Sync", value: modelBatchEvaluations.length, detail: "Use Claude and SQLite to keep the corpus portable." },
    { id: "queue", title: "Run", value: queueJobs.length, detail: "Queue prompts for implementation and visual proof." },
    { id: "improve", title: "Review", value: curationReport.counts.review + curationReport.counts.quarantine, detail: "Promote, quarantine, or repair examples from evidence." },
    { id: "packs", title: "Export", value: closedLoopRuns.length + benchmarkRuns.length, detail: "Ship memory packs, benchmarks, and build packs." },
  ];
  return (
    <section className="panel lab-panel mode-launcher-panel">
      <div className="output-header">
        <div className="panel-header">
          <SlidersHorizontal size={18} />
          <h2>Train modes</h2>
        </div>
        <span className="selected-meta">Less hunting, more doing.</span>
      </div>
      <div className="mode-launcher-grid">
        {modes.map((mode) => (
          <button type="button" className="mode-launcher-card" key={mode.id} onClick={() => onSelect(mode.id)}>
            <strong>{mode.title}</strong>
            <span>{mode.value}</span>
            <p>{mode.detail}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function StartHereProofLoopPanel({
  buildFeedback,
  onRunBenchmarkSuite,
  onRunMutationTournament,
  onRunOneClickBuildProof,
  onRunProofLearningLoop,
  onRunScreenshotJudge,
  proofLearningRuns,
  screenshotJudgeRuns,
  selectedPrompt,
}: {
  buildFeedback: BuildFeedbackReport;
  onRunBenchmarkSuite: () => void;
  onRunMutationTournament: () => void;
  onRunOneClickBuildProof: () => void;
  onRunProofLearningLoop: () => void;
  onRunScreenshotJudge: () => void;
  proofLearningRuns: ProofLearningRun[];
  screenshotJudgeRuns: ScreenshotJudgeRun[];
  selectedPrompt?: PromptExample;
}) {
  const latestProof = proofLearningRuns[0];
  const latestJudge = screenshotJudgeRuns[0];
  const steps = [
    { label: "1. Build proof", detail: latestProof ? `${latestProof.phase} / ${latestProof.learnedStatus}` : "Scaffold, build, preview, capture, and import proof.", action: onRunOneClickBuildProof, cta: "Run proof now" },
    { label: "2. Judge", detail: latestJudge ? `${latestJudge.score}/100 ${latestJudge.verdict}` : "Ask Claude/local judge to repair from screenshots.", action: onRunScreenshotJudge, cta: "Run screenshot judge" },
    { label: "3. Mutate", detail: "Run a mutation tournament before spending another build.", action: onRunMutationTournament, cta: "Run tournament" },
    { label: "4. Benchmark", detail: "Refresh canonical challenges to see if the learner improved.", action: onRunBenchmarkSuite, cta: "Run benchmark" },
  ];
  return (
    <section className="panel lab-panel start-here-panel" data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <Sparkles size={18} />
          <h2>Start here: prove and improve</h2>
        </div>
        <ScoreRing score={buildFeedback.score} label="proof" />
      </div>
      <p className="selected-meta">
        {selectedPrompt ? `Selected: ${selectedPrompt.title}.` : "Select or generate a prompt first."} This path turns a prompt into a queued build, judges the result, mutates the wording, and tracks benchmark movement.
      </p>
      <div className="proof-loop-grid">
        {steps.map((step) => (
          <article className="proof-loop-card" key={step.label}>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
            <button className="ghost-button compact-button" type="button" onClick={step.action} disabled={!selectedPrompt && step.label !== "4. Benchmark"}>
              {step.cta}
            </button>
          </article>
        ))}
      </div>
      <button className="ghost-button compact-button" type="button" onClick={onRunProofLearningLoop} disabled={!selectedPrompt}>
        Record existing evidence only
      </button>
      <FeedbackList title="Current proof actions" items={buildFeedback.nextActions} empty="No proof actions yet." />
    </section>
  );
}

function PromptEvolutionTimelinePanel({ steps }: { steps: PromptEvolutionStep[] }) {
  return (
    <section className="panel lab-panel prompt-evolution-panel">
      <div className="panel-header">
        <Archive size={18} />
        <h2>Before / after prompt evolution</h2>
      </div>
      <div className="evolution-track">
        {steps.map((step) => (
          <article className="evolution-step" key={step.label}>
            <span>{step.label}</span>
            <strong>{step.title}</strong>
            <em data-tone={scoreTone(step.score)}>{step.score || "--"}</em>
            <p>{step.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function GoldenBenchmarkBoardPanel({
  benchmarkRuns,
  board,
  onRunBenchmarkSuite,
}: {
  benchmarkRuns: BenchmarkRun[];
  board: ReturnType<typeof buildGoldenChallengeBoard>;
  onRunBenchmarkSuite: () => void;
}) {
  const latest = benchmarkRuns[0];
  return (
    <section className="panel lab-panel benchmark-board-panel" data-train-section="patterns">
      <div className="output-header">
        <div className="panel-header">
          <Trophy size={18} />
          <h2>Golden benchmark board</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunBenchmarkSuite}>
          <Sparkles size={15} />
          Run suite
        </button>
      </div>
      <p className="selected-meta">
        {latest ? `${latest.count} challenge(s), ${latest.averageScore} average, ${latest.modelMode}.` : "Run the canonical challenges to get a product-level improvement scoreboard."}
      </p>
      <div className="benchmark-board-grid">
        {board.map((item) => (
          <article className="version-card" key={item.id}>
            <div className="dna-v2-topline">
              <strong>{item.title}</strong>
              <span data-tone={scoreTone(item.latestScore)}>{item.latestScore || "--"}</span>
            </div>
            <small>{item.status} / best {item.bestScore || "--"}</small>
            <p>{item.finding}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BenchmarkRegressionPanel({ report }: { report: BenchmarkRegressionReport }) {
  return (
    <section className="panel lab-panel benchmark-regression-panel">
      <div className="panel-header">
        <BarChart3 size={18} />
        <h2>Regression benchmark suite</h2>
      </div>
      <div className="outcome-scoreboard compact-scoreboard">
        <Metric value={formatNumber(report.latestAverage)} label="Latest" />
        <Metric value={formatNumber(report.previousAverage)} label="Previous" />
        <Metric value={`${report.delta > 0 ? "+" : ""}${report.delta}`} label="Delta" />
        <Metric value={formatNumber(report.regressed)} label="Regressed" />
      </div>
      <div className="version-list compact-list">
        {report.rows.slice(0, 4).map((row) => (
          <article className="version-card" key={row.title}>
            <div className="dna-v2-topline">
              <strong>{row.title}</strong>
              <span data-tone={scoreTone(row.delta >= 0 ? 80 : 40)}>{row.delta > 0 ? `+${row.delta}` : row.delta}</span>
            </div>
            <p>{row.finding}</p>
            <small>
              {row.previous || "--"} {"->"} {row.latest || "--"}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductionHardeningPanel({
  apiHealth,
  backupSnapshots,
  datasetVersions,
  modelEnvStatus,
  proofLearningRuns,
  screenshotJudgeRuns,
}: {
  apiHealth?: ApiHealth;
  backupSnapshots: TrainingBackupSnapshot[];
  datasetVersions: DatasetVersion[];
  modelEnvStatus?: Record<string, boolean>;
  proofLearningRuns: ProofLearningRun[];
  screenshotJudgeRuns: ScreenshotJudgeRun[];
}) {
  const checks = [
    { label: "Hosted API", ready: Boolean(apiHealth?.ok), detail: apiHealth?.ok ? "Reachable" : "Run Check API before trusting sync." },
    { label: "Token posture", ready: Boolean(apiHealth?.authRequired), detail: apiHealth?.authRequired ? "Bearer auth enabled" : "Set PROMPT_LAB_API_TOKEN for hosted use." },
    { label: "Claude key", ready: Boolean(modelEnvStatus?.anthropicApiKeyConfigured), detail: modelEnvStatus?.anthropicApiKeyConfigured ? "Server key detected" : "Local fallback is active." },
    { label: "Restore points", ready: backupSnapshots.length > 0, detail: `${backupSnapshots.length} backup snapshot(s).` },
    { label: "Dataset versions", ready: datasetVersions.length > 0, detail: `${datasetVersions.length} dataset version(s).` },
    { label: "Proof history", ready: proofLearningRuns.length > 0 && screenshotJudgeRuns.length > 0, detail: `${proofLearningRuns.length} proof loop(s), ${screenshotJudgeRuns.length} judge run(s).` },
  ];
  return (
    <section className="panel lab-panel production-hardening-panel" data-train-section="sync">
      <div className="panel-header">
        <ListChecks size={18} />
        <h2>Production hardening</h2>
      </div>
      <div className="hardening-grid">
        {checks.map((check) => (
          <article className="sync-check-card" data-ready={check.ready} key={check.label}>
            <strong>{check.ready ? "Ready" : "Watch"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ConnectHostedBrainPanel({
  apiBaseDraft,
  apiHealth,
  apiNotice,
  apiTokenDraft,
  modelEnvStatus,
  onCheckApi,
  onConnectHostedBrain,
  onSaveApiBase,
  setApiBaseDraft,
  setApiTokenDraft,
}: {
  apiBaseDraft: string;
  apiHealth?: ApiHealth;
  apiNotice: string;
  apiTokenDraft: string;
  modelEnvStatus?: Record<string, boolean>;
  onCheckApi: () => void;
  onConnectHostedBrain: () => void;
  onSaveApiBase: () => void;
  setApiBaseDraft: (value: string) => void;
  setApiTokenDraft: (value: string) => void;
}) {
  const rows = [
    { label: "API", ready: Boolean(apiHealth?.ok), detail: apiHealth?.sqlitePath || "Not connected" },
    { label: "Token", ready: Boolean(apiHealth?.authRequired), detail: apiHealth?.authRequired ? "Bearer auth required" : "Optional locally; required for hosted" },
    { label: "Claude", ready: Boolean(modelEnvStatus?.anthropicApiKeyConfigured), detail: modelEnvStatus?.anthropicApiKeyConfigured ? "Server key present" : "Local evaluator fallback" },
    { label: "Collections", ready: Boolean(apiHealth?.collections?.length), detail: `${apiHealth?.collections?.length ?? 0} durable collection(s)` },
  ];
  return (
    <section className="panel lab-panel hosted-brain-panel" data-train-section="api">
      <div className="panel-header">
        <Sparkles size={18} />
        <h2>Connect hosted brain</h2>
      </div>
      <div className="two-field-grid">
        <Field label="API URL">
          <input value={apiBaseDraft} onChange={(event) => setApiBaseDraft(event.target.value)} placeholder="https://your-api.example.com" />
        </Field>
        <Field label="Bearer token">
          <input type="password" value={apiTokenDraft} onChange={(event) => setApiTokenDraft(event.target.value)} placeholder="Server token, never model key" />
        </Field>
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onConnectHostedBrain}>
          <Check size={15} />
          Save + check
        </button>
        <button className="ghost-button compact-button" type="button" onClick={onSaveApiBase}>Save only</button>
        <button className="ghost-button compact-button" type="button" onClick={onCheckApi}>Check API</button>
      </div>
      <div className="hardening-grid">
        {rows.map((row) => (
          <article className="sync-check-card" data-ready={row.ready} key={row.label}>
            <strong>{row.ready ? "Ready" : "Watch"}</strong>
            <span>{row.label}</span>
            <p>{row.detail}</p>
          </article>
        ))}
      </div>
      <p className="selected-meta">{apiNotice}</p>
    </section>
  );
}

function SimplePromptFrontDoorPanel({
  copied,
  generatorInput,
  guidedWizard,
  onApplyGeneratorVariant,
  onCopy,
  onRunClosedLoopTrainer,
  onSave,
  setGeneratorInput,
}: {
  copied: string;
  generatorInput: LearnedGeneratorInput;
  guidedWizard: GuidedPromptWizardReport;
  onApplyGeneratorVariant: (variant: LearnedGeneratorVariant) => void;
  onCopy: (value: string, key: string) => void;
  onRunClosedLoopTrainer: () => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  setGeneratorInput: Dispatch<SetStateAction<LearnedGeneratorInput>>;
}) {
  const best = guidedWizard.variants[0];
  function update<K extends keyof LearnedGeneratorInput>(key: K, value: LearnedGeneratorInput[K]) {
    setGeneratorInput((current) => ({ ...current, [key]: value }));
  }
  return (
    <section className="panel lab-panel simple-front-door-panel" data-train-section="generate">
      <div className="output-header">
        <div className="panel-header">
          <Wand2 size={18} />
          <h2>Generate a great website prompt</h2>
        </div>
        <ScoreRing score={guidedWizard.readiness} label="brief" />
      </div>
      <div className="simple-front-door-grid">
        <div className="simple-brief-fields">
          <div className="two-field-grid">
            <Field label="Brand">
              <input value={generatorInput.brandName} onChange={(event) => update("brandName", event.target.value)} />
            </Field>
            <Field label="Website type">
              <input value={generatorInput.siteType} onChange={(event) => update("siteType", event.target.value)} />
            </Field>
          </div>
          <Field label="Visual signature">
            <textarea value={generatorInput.visualStyle} onChange={(event) => update("visualStyle", event.target.value)} />
          </Field>
          <Field label="Assets and no-go rules">
            <textarea
              value={`${generatorInput.assets}\n\n${generatorInput.constraints}`}
              onChange={(event) => {
                const [assets, ...constraints] = event.target.value.split(/\n\s*\n/);
                setGeneratorInput((current) => ({
                  ...current,
                  assets: assets ?? "",
                  constraints: constraints.join("\n\n") || current.constraints,
                }));
              }}
            />
          </Field>
        </div>
        <article className="simple-prompt-preview">
          <div className="dna-v2-topline">
            <strong>{best?.title ?? "No variant yet"}</strong>
            <span data-tone={scoreTone(best?.score ?? 0)}>{best?.score ?? 0}</span>
          </div>
          <p>{best?.bestFor ?? "Fill in the brief to generate a prompt candidate."}</p>
          <textarea className="generated-output mini-output" readOnly value={best?.prompt ?? ""} />
          <div className="button-row">
            <button className="ghost-button compact-button" type="button" disabled={!best} onClick={() => best && onApplyGeneratorVariant(best)}>
              Use
            </button>
            <button className="ghost-button compact-button" type="button" disabled={!best} onClick={() => best && onCopy(best.prompt, "simple-front-door")}>
              {copied === "simple-front-door" ? <Check size={15} /> : <Copy size={15} />}
              Copy
            </button>
            <button className="ghost-button compact-button" type="button" disabled={!best} onClick={() => best && onSave("generated", best.title, best.prompt, best.score)}>
              <Save size={15} />
              Save
            </button>
            <button className="primary-button compact-button" type="button" disabled={!best} onClick={onRunClosedLoopTrainer}>
              <Sparkles size={15} />
              Refine with Claude
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function ClosedLoopTrainerPanel({
  closedLoopRuns,
  guidedWizard,
  modelSettings,
  onRunClosedLoopTrainer,
}: {
  closedLoopRuns: ClosedLoopRun[];
  guidedWizard: GuidedPromptWizardReport;
  modelSettings: { provider: string; model: string };
  onRunClosedLoopTrainer: () => void;
}) {
  const latest = closedLoopRuns[0];
  const candidate = guidedWizard.variants[0];
  const latestScore = typeof latest?.improvedScore === "number" ? latest.improvedScore : candidate?.score ?? 0;
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Sparkles size={18} />
          <h2>Closed-loop prompt trainer</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunClosedLoopTrainer} disabled={!candidate}>
          Run trainer
        </button>
      </div>
      <div className="gate-summary">
        <ScoreRing score={latestScore} label="latest" />
        <div>
          <strong>{latest?.winnerTitle ?? latest?.sourceTitle ?? candidate?.title ?? "No generated prompt yet"}</strong>
          <p className="selected-meta">
            Uses {modelSettings.provider || "local"} {modelSettings.model ? `/${modelSettings.model}` : ""} to score, rewrite, score again, and save the winner.
          </p>
        </div>
      </div>
      <div className="version-list compact-list">
        {closedLoopRuns.slice(0, 5).map((run) => (
          <article className="version-card" key={run.id}>
            <div className="dna-v2-topline">
              <strong>{run.winnerTitle ?? run.sourceTitle ?? "Closed-loop run"}</strong>
              <span data-tone={scoreTone(run.improvedScore ?? 0)}>{`${run.originalScore ?? "--"} -> ${run.improvedScore ?? "--"}`}</span>
            </div>
            <p>{run.recommendations?.[0] ?? run.findings?.[0] ?? "Winner saved back into the training corpus."}</p>
            <small>{run.modelMode ?? "unknown mode"}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function BenchmarkSuitePanel({
  benchmarkRuns,
  onRunBenchmarkSuite,
}: {
  benchmarkRuns: BenchmarkRun[];
  onRunBenchmarkSuite: () => void;
}) {
  const latest = benchmarkRuns[0];
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Benchmark prompt suite</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunBenchmarkSuite}>
          Run suite
        </button>
      </div>
      <div className="backend-grid">
        <article className="index-card">
          <strong>{benchmarkBriefs.length}</strong>
          <span>briefs</span>
        </article>
        <article className="index-card">
          <strong>{latest?.averageScore ?? "--"}</strong>
          <span>avg score</span>
        </article>
        <article className="index-card wide-index-card">
          <h3>Coverage</h3>
          <p>Hero, SaaS, dashboard, agency, signup, commerce, fintech, wellness, education, features, and 404 recovery.</p>
        </article>
      </div>
      <div className="version-list compact-list">
        {(latest?.rows ?? benchmarkBriefs.map((brief) => ({
          briefId: brief.id,
          title: brief.title,
          promptTitle: brief.siteType,
          score: 0,
          readiness: "pending",
          findings: [brief.goal],
        }))).slice(0, 10).map((row) => (
          <article className="version-card" key={row.briefId}>
            <div className="dna-v2-topline">
              <strong>{row.title}</strong>
              <span data-tone={scoreTone(row.score)}>{row.score || "pending"}</span>
            </div>
            <p>{row.findings[0] ?? row.promptTitle}</p>
            <small>{row.readiness}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewQueuePanel({
  curationReport,
  leaderboard,
  onSetPromptCurationDecision,
  onUpdateOutcome,
  outcomes,
}: {
  curationReport: CorpusCurationReport;
  leaderboard: PromptRank[];
  onSetPromptCurationDecision: (promptId: string, decision: CurationDecision) => void;
  onUpdateOutcome: (prompt: PromptExample, patch: Partial<Pick<OutcomeRecord, "rating" | "status" | "notes">>) => void;
  outcomes: OutcomeRecord[];
}) {
  const outcomeMap = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const curationMap = new Map(curationReport.items.map((item) => [item.promptId, item]));
  const candidates = leaderboard
    .filter((rank) => {
      const outcome = outcomeMap.get(rank.example.id);
      const curation = curationMap.get(rank.example.id);
      return !outcome || outcome.status === "experimental" || outcome.status === "unrated" || curation?.recommendation !== "learn";
    })
    .slice(0, 8);
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <ListChecks size={18} />
        <h2>Gold / good / avoid review queue</h2>
      </div>
      <div className="version-list compact-list">
        {candidates.map((candidate) => {
          const prompt = candidate.example;
          const curation = curationMap.get(prompt.id);
          return (
            <article className="version-card" key={prompt.id}>
              <div className="dna-v2-topline">
                <strong>{prompt.title}</strong>
                <span data-tone={scoreTone(candidate.score)}>{candidate.score}</span>
              </div>
              <p>{curation?.reasons[0] ?? candidate.reasons[0]}</p>
              <div className="button-row">
                <button className="primary-button compact-button" type="button" onClick={() => onUpdateOutcome(prompt, { rating: "great", status: "gold", notes: "Promoted from review queue." })}>Gold</button>
                <button className="ghost-button compact-button" type="button" onClick={() => onUpdateOutcome(prompt, { rating: "okay", status: "good", notes: "Marked good from review queue." })}>Good</button>
                <button className="ghost-button compact-button" type="button" onClick={() => onUpdateOutcome(prompt, { rating: "bad", status: "avoid", notes: "Marked avoid from review queue." })}>Avoid</button>
                <button className="ghost-button compact-button" type="button" onClick={() => onSetPromptCurationDecision(prompt.id, "review")}>Review</button>
              </div>
            </article>
          );
        })}
        {!candidates.length ? <p className="selected-meta">No review candidates. Nice, the corpus is behaving for the moment.</p> : null}
      </div>
    </section>
  );
}

function CorpusHygieneSweepPanel({
  corpusCleaning,
  curationReport,
  leakageGuard,
  onRunCorpusHygieneSweep,
}: {
  corpusCleaning: CorpusCleaningReport;
  curationReport: CorpusCurationReport;
  leakageGuard: LeakageGuardReport;
  onRunCorpusHygieneSweep: () => void;
}) {
  const flagged = curationReport.counts.review + curationReport.counts.quarantine + corpusCleaning.weakPrompts.length + leakageGuard.findings.length;
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Corpus hygiene sweep</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunCorpusHygieneSweep}>
          Apply sweep
        </button>
      </div>
      <div className="backend-grid">
        <article className="index-card"><strong>{corpusCleaning.exactDuplicates.length}</strong><span>exact duplicate groups</span></article>
        <article className="index-card"><strong>{corpusCleaning.nearDuplicates.length}</strong><span>near duplicate groups</span></article>
        <article className="index-card"><strong>{flagged}</strong><span>flagged items</span></article>
      </div>
      <FeedbackList title="Sweep plan" items={[...corpusCleaning.recommendations, ...leakageGuard.recommendations].slice(0, 6)} empty="Corpus hygiene is clean." />
    </section>
  );
}

function ResultLearningPanel({
  buildFeedback,
  copied,
  onApplyResultLearningPatch,
  onCopy,
  onSave,
  repairedPrompt,
  resultScore,
}: {
  buildFeedback: BuildFeedbackReport;
  copied: string;
  onApplyResultLearningPatch: () => void;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  repairedPrompt: string;
  resultScore: ResultScore;
}) {
  return (
    <section className="panel lab-panel" data-train-section="improve">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Result-based learning</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(repairedPrompt, "result-learning-repair")}>
            {copied === "result-learning-repair" ? <Check size={15} /> : <Copy size={15} />}
            Copy repair
          </button>
          <button className="primary-button compact-button" type="button" onClick={onApplyResultLearningPatch}>
            Apply repair
          </button>
        </div>
      </div>
      <div className="gate-summary">
        <ScoreRing score={resultScore.score || buildFeedback.score} label="result" />
        <FeedbackList title="What the next prompt should learn" items={[...resultScore.recommendations, ...buildFeedback.nextActions].slice(0, 6)} empty="No result feedback yet." />
      </div>
      <textarea className="generated-output mini-output" readOnly value={repairedPrompt} />
      <button className="ghost-button compact-button" type="button" onClick={() => onSave("improved", "Result repair prompt", repairedPrompt, evaluatePrompt(repairedPrompt).score)}>
        <Save size={15} />
        Save repair
      </button>
    </section>
  );
}

function HostedClaudeSetupPanel({
  copied,
  modelEnvStatus,
  modelNotice,
  modelSettings,
  onApplyProviderPreset,
  onCopy,
}: {
  copied: string;
  modelEnvStatus?: Record<string, boolean>;
  modelNotice: string;
  modelSettings: { provider: string; model: string; endpoint: string };
  onApplyProviderPreset: (kind: "local" | "anthropic" | "openai-compatible" | "codex-agent" | "scaffold-build") => void;
  onCopy: (value: string, key: string) => void;
}) {
  const env = [
    "PROMPT_LAB_MODEL_PROVIDER=anthropic",
    "PROMPT_LAB_MODEL_NAME=claude-sonnet-5",
    "ANTHROPIC_API_KEY=<set on the API host only>",
  ].join("\n");
  return (
    <section className="panel lab-panel hosted-claude-panel" data-train-section="api">
      <div className="output-header">
        <div className="panel-header">
          <Sparkles size={18} />
          <h2>Hosted Claude setup</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("anthropic")}>Use Claude</button>
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(env, "hosted-claude-env")}>
            {copied === "hosted-claude-env" ? <Check size={15} /> : <Copy size={15} />}
            Copy env
          </button>
        </div>
      </div>
      <div className="backend-grid">
        <article className="index-card">
          <strong>{modelSettings.provider || "local"}</strong>
          <span>provider</span>
        </article>
        <article className="index-card">
          <strong>{modelEnvStatus?.anthropicApiKeyConfigured ? "Ready" : "Needs key"}</strong>
          <span>server key</span>
        </article>
        <article className="index-card wide-index-card">
          <h3>{modelSettings.model || "claude-sonnet-5"}</h3>
          <p>{modelNotice || modelSettings.endpoint}</p>
        </article>
      </div>
      <pre className="prompt-patch-box">{env}</pre>
      <p className="selected-meta">Keep the API key on the Node API host. GitHub Pages should only know the hosted API URL and token.</p>
    </section>
  );
}

function ClaudeHealthDeepCheckPanel({
  apiHealth,
  checks,
  modelEnvStatus,
  onRunHostedClaudeHealthCheck,
}: {
  apiHealth?: ApiHealth;
  checks: HostedClaudeHealthCheck[];
  modelEnvStatus?: Record<string, boolean>;
  onRunHostedClaudeHealthCheck: () => void;
}) {
  const latest = checks[0];
  const statusItems = [
    { label: "API", ok: Boolean(apiHealth?.ok ?? latest?.apiOnline), value: apiHealth?.ok || latest?.apiOnline ? "Online" : "Unchecked" },
    { label: "Token", ok: Boolean(latest?.tokenValid ?? apiHealth?.authRequired !== undefined), value: latest?.tokenValid ? "Accepted" : apiHealth?.authRequired ? "Required" : "Open" },
    { label: "Claude key", ok: Boolean(modelEnvStatus?.anthropicApiKeyConfigured ?? latest?.claudeConfigured), value: modelEnvStatus?.anthropicApiKeyConfigured || latest?.claudeConfigured ? "Ready" : "Missing" },
    { label: "SQLite", ok: Boolean(latest?.sqliteWritable ?? apiHealth?.sqlitePath), value: latest?.sqlitePath ? "Writable" : apiHealth?.sqlitePath ? "Detected" : "Unknown" },
  ];
  return (
    <section className="panel lab-panel hosted-readiness-panel" data-train-section="api">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Hosted Claude readiness</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunHostedClaudeHealthCheck}>
          <Sparkles size={15} />
          Run deep check
        </button>
      </div>
      <div className="backend-grid readiness-grid">
        {statusItems.map((item) => (
          <article className="index-card" key={item.label} data-tone={item.ok ? "good" : "watch"}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
        <article className="index-card wide-index-card">
          <h3>{latest ? `${latest.modelMode} / ${latest.modelScore}` : "No deep check yet"}</h3>
          <p>{latest?.detail.join(" ") || "Runs API health, model settings, sync write, and model evaluation as one hosted smoke test."}</p>
        </article>
      </div>
      <div className="version-list compact-list">
        {checks.slice(0, 4).map((check) => (
          <article className="version-card" key={check.id}>
            <div className="dna-v2-topline">
              <strong>{new Date(check.createdAt).toLocaleString()}</strong>
              <span data-tone={check.modelRouteWorking ? "good" : "watch"}>{check.modelScore}</span>
            </div>
            <p>{check.detail.join(" ")}</p>
            <small>{check.apiBase || check.sqlitePath}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function GreatPromptWizardPanel({
  copied,
  generatorInput,
  guidedWizard,
  onApplyGeneratorVariant,
  onCopy,
  onRunClosedLoopTrainer,
  onSave,
  setGeneratorInput,
}: {
  copied: string;
  generatorInput: LearnedGeneratorInput;
  guidedWizard: GuidedPromptWizardReport;
  onApplyGeneratorVariant: (variant: LearnedGeneratorVariant) => void;
  onCopy: (value: string, key: string) => void;
  onRunClosedLoopTrainer: () => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  setGeneratorInput: Dispatch<SetStateAction<LearnedGeneratorInput>>;
}) {
  const best = guidedWizard.variants[0];
  function update<K extends keyof LearnedGeneratorInput>(key: K, value: LearnedGeneratorInput[K]) {
    setGeneratorInput((current) => ({ ...current, [key]: value }));
  }
  return (
    <section className="panel lab-panel great-prompt-wizard-panel" data-train-section="generate">
      <div className="output-header">
        <div className="panel-header">
          <Wand2 size={18} />
          <h2>Great Prompt wizard</h2>
        </div>
        <ScoreRing score={guidedWizard.readiness} label="ready" />
      </div>
      <div className="wizard-brief-grid">
        <div className="simple-brief-fields">
          <div className="two-field-grid">
            <Field label="Brand">
              <input value={generatorInput.brandName} onChange={(event) => update("brandName", event.target.value)} />
            </Field>
            <Field label="Site type">
              <input value={generatorInput.siteType} onChange={(event) => update("siteType", event.target.value)} />
            </Field>
          </div>
          <Field label="Audience">
            <input value={generatorInput.audience} onChange={(event) => update("audience", event.target.value)} />
          </Field>
          <Field label="Visual direction">
            <textarea value={generatorInput.visualStyle} onChange={(event) => update("visualStyle", event.target.value)} />
          </Field>
          <Field label="Assets">
            <textarea value={generatorInput.assets} onChange={(event) => update("assets", event.target.value)} />
          </Field>
          <Field label="No-go rules">
            <textarea value={generatorInput.constraints} onChange={(event) => update("constraints", event.target.value)} />
          </Field>
        </div>
        <article className="simple-prompt-preview">
          <div className="dna-v2-topline">
            <strong>{best?.title ?? "Draft a sharper brief"}</strong>
            <span data-tone={scoreTone(best?.score ?? 0)}>{best?.score ?? 0}</span>
          </div>
          <p>{best?.bestFor ?? "The wizard turns your brief into a build-ready website prompt and can send the best draft through the closed-loop trainer."}</p>
          <FeedbackList title="Wizard guardrails" items={guidedWizard.nextActions} empty="No recommendations yet." />
          <textarea className="generated-output mini-output" readOnly value={best?.prompt ?? ""} />
          <div className="button-row">
            <button className="ghost-button compact-button" type="button" disabled={!best} onClick={() => best && onApplyGeneratorVariant(best)}>
              Use
            </button>
            <button className="ghost-button compact-button" type="button" disabled={!best} onClick={() => best && onCopy(best.prompt, "great-prompt-wizard")}>
              {copied === "great-prompt-wizard" ? <Check size={15} /> : <Copy size={15} />}
              Copy
            </button>
            <button className="ghost-button compact-button" type="button" disabled={!best} onClick={() => best && onSave("generated", best.title, best.prompt, best.score)}>
              <Save size={15} />
              Save
            </button>
            <button className="primary-button compact-button" type="button" disabled={!best} onClick={onRunClosedLoopTrainer}>
              <Sparkles size={15} />
              Claude refine
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function PromptQualityRecipePanel({
  copied,
  onCopy,
  onDownload,
  onSave,
  promptQualityRecipe,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  promptQualityRecipe: string;
}) {
  return (
    <section className="panel lab-panel prompt-recipe-panel" data-train-section="patterns">
      <div className="output-header">
        <div className="panel-header">
          <BookOpen size={18} />
          <h2>Prompt quality recipe</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(promptQualityRecipe, "prompt-quality-recipe")}>
            {copied === "prompt-quality-recipe" ? <Check size={15} /> : <Copy size={15} />}
            Copy
          </button>
          <button className="ghost-button compact-button" type="button" onClick={() => onDownload("great-website-prompt-recipe.md", promptQualityRecipe, "text/markdown")}>
            <Download size={15} />
            Export
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onSave("recipe", "Great Website Prompt Recipe", promptQualityRecipe, evaluatePrompt(promptQualityRecipe).score)}>
            <Save size={15} />
            Save
          </button>
        </div>
      </div>
      <textarea className="generated-output style-guide-output" readOnly value={promptQualityRecipe} />
    </section>
  );
}

function CorpusQualityDashboardPanel({ cards }: { cards: ReturnType<typeof buildCorpusQualityCards> }) {
  return (
    <section className="panel lab-panel corpus-quality-panel" data-train-section="patterns">
      <div className="panel-header">
        <BarChart3 size={18} />
        <h2>Corpus quality dashboard</h2>
      </div>
      <div className="quality-card-grid">
        {cards.map((card) => (
          <article className="index-card quality-card" key={card.label} data-tone={card.score >= 70 ? "good" : card.score >= 50 ? "watch" : "bad"}>
            <div className="dna-v2-topline">
              <strong>{card.label}</strong>
              <span>{card.score}</span>
            </div>
            <small>{card.status}</small>
            <p>{card.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromptComparisonClaudePanel({
  copied,
  diffLeftId,
  diffRightId,
  examples,
  onCopy,
  onRunPromptComparison,
  promptComparisons,
  setDiffLeftId,
  setDiffRightId,
}: {
  copied: string;
  diffLeftId: string;
  diffRightId: string;
  examples: PromptExample[];
  onCopy: (value: string, key: string) => void;
  onRunPromptComparison: (left: PromptExample | undefined, right: PromptExample | undefined) => void;
  promptComparisons: PromptComparisonRun[];
  setDiffLeftId: (id: string) => void;
  setDiffRightId: (id: string) => void;
}) {
  const left = examples.find((example) => example.id === diffLeftId) ?? examples[0];
  const right = examples.find((example) => example.id === diffRightId) ?? examples[1] ?? examples[0];
  const latest = promptComparisons[0];
  return (
    <section className="panel lab-panel prompt-comparison-panel" data-train-section="improve">
      <div className="output-header">
        <div className="panel-header">
          <Shuffle size={18} />
          <h2>Claude A/B prompt comparison</h2>
        </div>
        <button className="primary-button compact-button" type="button" disabled={!left || !right} onClick={() => onRunPromptComparison(left, right)}>
          <Sparkles size={15} />
          Compare
        </button>
      </div>
      <div className="compare-selectors">
        <Field label="Prompt A">
          <select value={left?.id ?? ""} onChange={(event) => setDiffLeftId(event.target.value)}>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>{example.title}</option>
            ))}
          </select>
        </Field>
        <Field label="Prompt B">
          <select value={right?.id ?? ""} onChange={(event) => setDiffRightId(event.target.value)}>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>{example.title}</option>
            ))}
          </select>
        </Field>
      </div>
      {latest ? (
        <article className="version-card comparison-result-card">
          <div className="dna-v2-topline">
            <strong>{latest.winnerTitle || "Hybrid result"}</strong>
            <span data-tone={scoreTone(latest.score)}>{latest.score}</span>
          </div>
          <p>{latest.findings[0] ?? `${latest.leftTitle} vs ${latest.rightTitle}`}</p>
          <textarea className="generated-output mini-output" readOnly value={latest.hybridPrompt} />
          <div className="button-row">
            <button className="ghost-button compact-button" type="button" onClick={() => onCopy(latest.hybridPrompt, `comparison-${latest.id}`)}>
              {copied === `comparison-${latest.id}` ? <Check size={15} /> : <Copy size={15} />}
              Copy hybrid
            </button>
          </div>
        </article>
      ) : (
        <p className="selected-meta">Pick two corpus prompts and ask the hosted model to choose a winner, diagnose why, and produce a hybrid prompt.</p>
      )}
    </section>
  );
}

function ScreenshotPromptGeneratorPanel({
  copied,
  onCopy,
  onGeneratePromptFromScreenshot,
  onSave,
  runs,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onGeneratePromptFromScreenshot: (input: { title: string; url: string; notes: string; siteType: string }) => Promise<ScreenshotPromptRun>;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  runs: ScreenshotPromptRun[];
}) {
  const [title, setTitle] = useState("Screenshot recreation");
  const [siteType, setSiteType] = useState("single-page website hero");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState<ScreenshotPromptRun | undefined>(runs[0]);
  const latest = current ?? runs[0];

  async function runGenerator() {
    setRunning(true);
    try {
      const run = await onGeneratePromptFromScreenshot({ title, siteType, url, notes });
      setCurrent(run);
    } finally {
      setRunning(false);
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  return (
    <section className="panel lab-panel screenshot-prompt-generator-panel" data-train-section="screenshots">
      <div className="output-header">
        <div className="panel-header">
          <Upload size={18} />
          <h2>Generate prompt from screenshot</h2>
        </div>
        <button className="primary-button compact-button" type="button" disabled={running} onClick={() => void runGenerator()}>
          <Sparkles size={15} />
          {running ? "Generating..." : "Generate"}
        </button>
      </div>
      <div className="two-field-grid">
        <Field label="Title">
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field label="Site type">
          <input value={siteType} onChange={(event) => setSiteType(event.target.value)} />
        </Field>
      </div>
      <Field label="Screenshot URL or uploaded image">
        <input value={url.startsWith("data:") ? "Uploaded image data URL" : url} onChange={(event) => setUrl(event.target.value)} placeholder="https://... or upload below" />
      </Field>
      <input className="file-input" accept="image/png,image/jpeg,image/webp,image/gif" type="file" onChange={handleFile} />
      <Field label="Notes">
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Describe what must be preserved: layout, typography, imagery, interactions, no-go rules." />
      </Field>
      {latest ? (
        <article className="version-card">
          <div className="dna-v2-topline">
            <strong>{latest.title}</strong>
            <span data-tone={scoreTone(latest.score)}>{latest.score}</span>
          </div>
          <p>{latest.notes[0] ?? latest.modelMode}</p>
          {latest.imagePreviewUrl ? <img className="screenshot-prompt-preview" src={latest.imagePreviewUrl} alt="" /> : null}
          <textarea className="generated-output mini-output" readOnly value={latest.prompt} />
          <div className="button-row">
            <button className="ghost-button compact-button" type="button" onClick={() => onCopy(latest.prompt, `screenshot-prompt-${latest.id}`)}>
              {copied === `screenshot-prompt-${latest.id}` ? <Check size={15} /> : <Copy size={15} />}
              Copy
            </button>
            <button className="ghost-button compact-button" type="button" onClick={() => onSave("generated", latest.title, latest.prompt, latest.score)}>
              <Save size={15} />
              Save
            </button>
          </div>
        </article>
      ) : (
        <p className="selected-meta">Paste a screenshot URL, upload an image, or write notes. Claude will use the image when the API host has a key.</p>
      )}
    </section>
  );
}

function WorkspacePromptPacksPanel({
  copied,
  onCopy,
  onDownload,
  onSaveWorkspacePackRun,
  packs,
  runs,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  onSaveWorkspacePackRun: () => void;
  packs: WorkspacePackRun["packs"];
  runs: WorkspacePackRun[];
}) {
  return (
    <section className="panel lab-panel workspace-packs-panel" data-train-section="packs">
      <div className="output-header">
        <div className="panel-header">
          <PackageOpen size={18} />
          <h2>Workspace prompt packs</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onSaveWorkspacePackRun}>
          <Save size={15} />
          Save packs
        </button>
      </div>
      <div className="workspace-pack-grid">
        {packs.map((pack) => (
          <article className="version-card" key={pack.key}>
            <div className="dna-v2-topline">
              <strong>{pack.label}</strong>
              <span>{pack.count}</span>
            </div>
            <p>{pack.count ? `Best ${pack.label.toLowerCase()} examples distilled into a portable pack.` : "Needs more examples before this pack is useful."}</p>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(pack.markdown, `workspace-pack-${pack.key}`)}>
                {copied === `workspace-pack-${pack.key}` ? <Check size={15} /> : <Copy size={15} />}
                Copy
              </button>
              <button className="ghost-button compact-button" type="button" onClick={() => onDownload(`${pack.key}-prompt-pack.md`, pack.markdown, "text/markdown")}>
                <Download size={15} />
                MD
              </button>
              <button className="ghost-button compact-button" type="button" onClick={() => onDownload(`${pack.key}-prompt-pack.json`, pack.json, "application/json")}>
                <Download size={15} />
                JSON
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="selected-meta">{runs[0] ? `Last saved ${new Date(runs[0].createdAt).toLocaleString()} with ${runs[0].packs.length} packs.` : "No saved pack snapshot yet."}</p>
    </section>
  );
}

function ExportFormatStudioPanel({
  copied,
  onCopy,
  onDownload,
  onSave,
  packs,
  promptMemory,
  selectedPrompt,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  packs: PromptPack[];
  promptMemory: PromptMemoryExport;
  selectedPrompt?: PromptExample;
}) {
  const targets = ["Codex prompt", "Claude prompt", "v0 prompt", "Cursor task", "JSON training dataset", "JSONL training data", "Markdown prompt pack"];
  const [target, setTarget] = useState(targets[0]);
  const formatted = formatPromptForTarget(selectedPrompt, target, promptMemory, packs);
  const extension = target === "JSON training dataset" ? "json" : target === "JSONL training data" ? "jsonl" : "md";
  const mime = extension === "json" ? "application/json" : extension === "jsonl" ? "application/x-ndjson" : "text/markdown";
  return (
    <section className="panel lab-panel export-format-panel" data-train-section="packs">
      <div className="output-header">
        <div className="panel-header">
          <Download size={18} />
          <h2>Export format studio</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(formatted, `export-format-${target}`)}>
            {copied === `export-format-${target}` ? <Check size={15} /> : <Copy size={15} />}
            Copy
          </button>
          <button className="ghost-button compact-button" type="button" onClick={() => onDownload(`${slugify(target)}.${extension}`, formatted, mime)}>
            <Download size={15} />
            Export
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onSave(target === "JSON training dataset" ? "pack" : "compiled", target, formatted, evaluatePrompt(formatted).score)}>
            <Save size={15} />
            Save
          </button>
        </div>
      </div>
      <div className="format-chip-row">
        {targets.map((item) => (
          <button className={item === target ? "tag-chip active" : "tag-chip"} key={item} type="button" onClick={() => setTarget(item)}>
            {item}
          </button>
        ))}
      </div>
      <textarea className="generated-output style-guide-output" readOnly value={formatted} />
    </section>
  );
}

function GuidedPromptWizardPanel({
  copied,
  generatorInput,
  guidedWizard,
  onApplyGeneratorVariant,
  onCopy,
  onSave,
  setGeneratorInput,
}: {
  copied: string;
  generatorInput: LearnedGeneratorInput;
  guidedWizard: GuidedPromptWizardReport;
  onApplyGeneratorVariant: (variant: LearnedGeneratorVariant) => void;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  setGeneratorInput: Dispatch<SetStateAction<LearnedGeneratorInput>>;
}) {
  function update<K extends keyof LearnedGeneratorInput>(key: K, value: LearnedGeneratorInput[K]) {
    setGeneratorInput((current) => ({ ...current, [key]: value }));
  }

  const fields: { key: keyof LearnedGeneratorInput; label: string; multiline?: boolean }[] = [
    { key: "brandName", label: "Brand" },
    { key: "siteType", label: "Website type" },
    { key: "audience", label: "Audience" },
    { key: "goal", label: "Goal", multiline: true },
    { key: "stack", label: "Stack" },
    { key: "visualStyle", label: "Signature mechanic", multiline: true },
    { key: "assets", label: "Assets", multiline: true },
    { key: "constraints", label: "No-go rules", multiline: true },
  ];

  return (
    <section className="panel lab-panel guided-wizard-panel" data-testid="guided-prompt-wizard" data-train-section="generate">
      <div className="output-header">
        <div className="panel-header">
          <Wand2 size={18} />
          <h2>Real prompt generation workflow</h2>
        </div>
        <ScoreRing score={guidedWizard.readiness} label="Ready" />
      </div>
      <div className="wizard-form-grid">
        {fields.map((field) => (
          <Field label={field.label} key={field.key}>
            {field.multiline ? (
              <textarea
                value={String(generatorInput[field.key] ?? "")}
                onChange={(event) => update(field.key, event.target.value as never)}
              />
            ) : (
              <input
                value={String(generatorInput[field.key] ?? "")}
                onChange={(event) => update(field.key, event.target.value as never)}
              />
            )}
          </Field>
        ))}
      </div>
      <Field label={`Strictness ${generatorInput.strictness}/10`}>
        <input type="range" min="1" max="10" value={generatorInput.strictness} onChange={(event) => update("strictness", Number(event.target.value))} />
      </Field>
      <div className="wizard-question-grid">
        {guidedWizard.questions.map((question) => (
          <article className="wizard-question-card" data-ready={question.answered} key={question.key}>
            <strong>{question.answered ? "Done" : "Needed"}</strong>
            <span>{question.label}</span>
            <p>{question.hint}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Next actions" items={guidedWizard.nextActions} empty="Wizard is ready." />
      <div className="preset-grid">
        {guidedWizard.variants.map((variant) => (
          <article className="preset-card" key={variant.id}>
            <div className="dna-v2-topline">
              <strong>{variant.title}</strong>
              <span data-tone={scoreTone(variant.score)}>{variant.score}</span>
            </div>
            <p>{variant.bestFor}</p>
            <small>{variant.signals.slice(0, 5).join(", ")}</small>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onApplyGeneratorVariant(variant)}>
                Use
              </button>
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(variant.prompt, `guided-${variant.id}`)}>
                {copied === `guided-${variant.id}` ? <Check size={15} /> : <Copy size={15} />}
                Copy
              </button>
              <button className="primary-button compact-button" type="button" onClick={() => onSave("generated", variant.title, variant.prompt, variant.score)}>
                <Save size={15} />
                Save
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PatternExtractionPanel({
  copied,
  onCopy,
  patternExtraction,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  patternExtraction: PatternExtractionReport;
}) {
  const markdown = patternExtraction.blocks
    .map((block) => `## ${block.label}\nScore: ${block.score}\nCategory: ${block.category}\nPatch: ${block.promptPatch}\nEvidence: ${block.evidence.join(", ")}`)
    .join("\n\n");
  return (
    <section className="panel lab-panel" data-testid="pattern-extraction-panel" data-train-section="patterns">
      <div className="output-header">
        <div className="panel-header">
          <BookOpen size={18} />
          <h2>Example-to-pattern extraction</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(markdown, "pattern-extraction")}>
          {copied === "pattern-extraction" ? <Check size={15} /> : <Copy size={15} />}
          Copy
        </button>
      </div>
      <FeedbackList title="Extraction summary" items={patternExtraction.summary} empty="No pattern summary yet." />
      <div className="pattern-block-grid">
        {patternExtraction.blocks.slice(0, 10).map((block) => (
          <article className="pattern-block-card" key={block.id}>
            <div className="dna-v2-topline">
              <strong>{block.label}</strong>
              <span data-tone={scoreTone(block.score)}>{block.score}</span>
            </div>
            <span>{block.category}</span>
            <p>{block.promptPatch}</p>
            <small>{block.evidence.slice(0, 3).join(" / ") || "No specific evidence row."}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromptImprovementStudioPanel({
  coachInput,
  copied,
  onCopy,
  onSave,
  rewriteComparison,
  setCoachInput,
}: {
  coachInput: string;
  copied: string;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  rewriteComparison: PromptImprovementComparison;
  setCoachInput: (value: string) => void;
}) {
  return (
    <section className="panel lab-panel" data-testid="prompt-improvement-studio" data-train-section="improve">
      <div className="output-header">
        <div className="panel-header">
          <Sparkles size={18} />
          <h2>Before/after prompt improvement</h2>
        </div>
        <div className="score-delta" data-positive={rewriteComparison.delta >= 0}>
          {rewriteComparison.originalScore} to {rewriteComparison.improvedScore}
          <strong>{rewriteComparison.delta >= 0 ? "+" : ""}{rewriteComparison.delta}</strong>
        </div>
      </div>
      <Field label="Prompt to improve">
        <textarea
          value={coachInput}
          onChange={(event) => setCoachInput(event.target.value)}
          placeholder="Paste a prompt here, or leave blank to improve the selected prompt."
        />
      </Field>
      <div className="two-field-grid">
        <FeedbackList title="Changed signals" items={rewriteComparison.changes} empty="No category changes yet." />
        <FeedbackList title="Missing before" items={rewriteComparison.missingBefore.slice(0, 6)} empty="Original prompt is already strong." />
      </div>
      <textarea className="generated-output style-guide-output" readOnly value={rewriteComparison.improvedPrompt} />
      <div className="button-row">
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(rewriteComparison.improvedPrompt, "rewrite-comparison")}>
          {copied === "rewrite-comparison" ? <Check size={15} /> : <Copy size={15} />}
          Copy improved
        </button>
        <button className="primary-button compact-button" type="button" onClick={() => onSave("improved", "Before-after improved prompt", rewriteComparison.improvedPrompt, rewriteComparison.improvedScore)}>
          <Save size={15} />
          Save improved
        </button>
      </div>
    </section>
  );
}

function ScreenshotScoringStudioPanel({
  onAddScreenshot,
  onUpdateOutcome,
  selectedPrompt,
}: {
  onAddScreenshot: (record: Omit<ScreenshotRecord, "id" | "createdAt">) => void;
  onUpdateOutcome: (prompt: PromptExample, patch: Partial<Pick<OutcomeRecord, "rating" | "status" | "notes">>) => void;
  selectedPrompt?: PromptExample;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<OutcomeRating>("unrated");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const issueOptions = ["bad-mobile", "missing-assets", "text-overlap", "weak-first-viewport", "runtime-error", "generic-design"];
  const issueNotes = [...selectedIssues, notes].filter(Boolean).join(". ");
  const report: ScreenshotScoringReport = scoreScreenshotIssues(selectedPrompt, issueNotes, rating);

  function toggleIssue(issue: string) {
    setSelectedIssues((current) => (current.includes(issue) ? current.filter((item) => item !== issue) : [...current, issue]));
  }

  function saveScreenshot() {
    if (!selectedPrompt || !url.trim()) return;
    onAddScreenshot({
      promptId: selectedPrompt.id,
      title: title.trim() || `${selectedPrompt.title} scored screenshot`,
      url,
      notes: `${issueNotes}\n\n${report.promptPatch}`.trim(),
      rating,
    });
    setTitle("");
    setUrl("");
    setNotes("");
    setRating("unrated");
    setSelectedIssues([]);
  }

  function promoteGold() {
    if (!selectedPrompt) return;
    onUpdateOutcome(selectedPrompt, {
      rating: "great",
      status: "gold",
      notes: `Screenshot scoring promoted this prompt. Score ${report.score}/100. ${report.summary.join(" ")}`,
    });
  }

  return (
    <section className="panel lab-panel" data-testid="screenshot-scoring-studio" data-train-section="screenshots">
      <div className="output-header">
        <div className="panel-header">
          <FileText size={18} />
          <h2>Result screenshot scoring</h2>
        </div>
        <ScoreRing score={report.score} label="Shot" />
      </div>
      <div className="two-field-grid">
        <Field label="Screenshot title">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Homepage desktop, 1440px" />
        </Field>
        <Field label="Rating">
          <select value={rating} onChange={(event) => setRating(event.target.value as OutcomeRating)}>
            {ratingOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Screenshot URL">
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://... or data:image/..." />
      </Field>
      <div className="issue-chip-grid" aria-label="Screenshot issue tags">
        {issueOptions.map((issue) => (
          <button className={selectedIssues.includes(issue) ? "active" : ""} key={issue} type="button" onClick={() => toggleIssue(issue)}>
            {issue}
          </button>
        ))}
      </div>
      <Field label="Visual notes">
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What did the screenshot prove or break?" />
      </Field>
      <FeedbackList title="Screenshot report" items={report.summary} empty="Add notes to score the result." />
      <pre className="prompt-patch-box">{report.promptPatch}</pre>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={saveScreenshot} disabled={!selectedPrompt || !url.trim()}>
          <Plus size={15} />
          Save screenshot
        </button>
        <button className="ghost-button compact-button" type="button" onClick={promoteGold} disabled={!selectedPrompt || report.score < 80}>
          <Trophy size={15} />
          Mark gold
        </button>
      </div>
    </section>
  );
}

function ArchetypePromptPackPanel({
  copied,
  onCopy,
  onDownload,
  packs,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  packs: PromptPack[];
}) {
  const [target, setTarget] = useState("Codex");
  const targetDirectives: Record<string, string> = {
    Codex: "Use this prompt pack with Codex. Build the requested UI, verify desktop/mobile render, run lint/build, and report exact files changed.",
    v0: "Use this prompt pack with v0. Keep the output as implementation-ready React components with explicit assets, responsive behavior, and no extra sections.",
    Claude: "Use this prompt pack with Claude. Preserve exact implementation details, ask only blocking questions, and return a clean build prompt.",
    Lovable: "Use this prompt pack with Lovable. Emphasize app structure, reusable components, Supabase only if explicitly requested, and visible first-screen quality.",
    "Plain spec": "Use this as a platform-neutral implementation spec. Keep stack, assets, layout, motion, responsive, constraints, and QA sections intact.",
  };
  function formatPack(pack: PromptPack) {
    return [
      `# ${pack.title}`,
      "",
      `Target: ${target}`,
      targetDirectives[target],
      "",
      pack.description,
      "",
      pack.prompts.join("\n\n---\n\n"),
    ].join("\n");
  }
  const bundle = packs.map(formatPack).join("\n\n====\n\n");
  return (
    <section className="panel lab-panel" data-testid="archetype-prompt-pack-panel" data-train-section="packs">
      <div className="output-header">
        <div className="panel-header">
          <PackageOpen size={18} />
          <h2>Prompt pack export</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(bundle, "archetype-packs")}>
            {copied === "archetype-packs" ? <Check size={15} /> : <Copy size={15} />}
            Copy all
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onDownload("website-archetype-prompt-packs.md", bundle, "text/markdown")}>
            <Download size={15} />
            Export packs
          </button>
        </div>
      </div>
      <div className="target-selector-row">
        {Object.keys(targetDirectives).map((item) => (
          <button className={target === item ? "active" : ""} key={item} type="button" onClick={() => setTarget(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="prompt-pack-export-grid">
        {packs.slice(0, 6).map((pack) => {
          const text = formatPack(pack);
          return (
            <article className="prompt-pack-card" key={pack.id}>
              <div className="dna-v2-topline">
                <strong>{pack.title}</strong>
                <span>{pack.prompts.length} prompts</span>
              </div>
              <p>{pack.description}</p>
              <div className="button-row">
                <button className="ghost-button compact-button" type="button" onClick={() => onCopy(text, pack.id)}>
                  {copied === pack.id ? <Check size={15} /> : <Copy size={15} />}
                  Copy
                </button>
                <button className="ghost-button compact-button" type="button" onClick={() => onDownload(`${pack.id}.md`, text, "text/markdown")}>
                  <Download size={15} />
                  Download
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AskLearnerPanel({
  answer,
  copied,
  onCopy,
  question,
  setQuestion,
}: {
  answer: LearnerAnswerReport;
  copied: string;
  onCopy: (value: string, key: string) => void;
  question: string;
  setQuestion: (value: string) => void;
}) {
  const output = `${answer.answer}\n\nEvidence:\n- ${answer.evidence.join("\n- ")}\n\nSuggested patch:\n${answer.suggestedPromptPatch}`;
  return (
    <section className="panel lab-panel" data-testid="ask-learner-panel">
      <div className="output-header">
        <div className="panel-header">
          <Lightbulb size={18} />
          <h2>Ask the prompt learner</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(output, "learner-answer")}>
          {copied === "learner-answer" ? <Check size={15} /> : <Copy size={15} />}
          Copy answer
        </button>
      </div>
      <Field label="Question">
        <textarea value={question} onChange={(event) => setQuestion(event.target.value)} />
      </Field>
      <div className="learner-answer-box">
        <strong>{answer.answer}</strong>
        <FeedbackList title="Evidence" items={answer.evidence} empty="No evidence available yet." />
        <pre className="prompt-patch-box">{answer.suggestedPromptPatch}</pre>
      </div>
    </section>
  );
}

function SourceSafetyDashboard({
  leakageGuard,
  onSelectPrompt,
  sourceSafety,
}: {
  leakageGuard: LeakageGuardReport;
  onSelectPrompt: (id: string) => void;
  sourceSafety: SourceSafetyReport;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <AlertTriangle size={18} />
        <h2>Source safety dashboard</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={sourceSafety.score} label={leakageGuard.status === "blocked" ? "Blocked" : "Sources"} />
        <FeedbackList title="Source recommendations" items={sourceSafety.recommendations} empty="Sources are clean." />
      </div>
      <div className="source-safety-grid">
        {sourceSafety.sourceBreakdown.map((item) => (
          <article className="index-card" key={item.source}>
            <strong>{item.total}</strong>
            <span>{item.source}</span>
            <p>{item.learn} learn / {item.review} review / {item.quarantine} quarantine</p>
          </article>
        ))}
      </div>
      <div className="version-list compact-list">
        {sourceSafety.unsafeItems.slice(0, 6).map((item) => (
          <button className="version-card prompt-audit-card" key={item.promptId} type="button" onClick={() => onSelectPrompt(item.promptId)}>
            <div className="dna-v2-topline">
              <strong>{item.title}</strong>
              <span data-tone={item.unsafeHits.length ? "weak" : item.recommendation === "learn" ? "strong" : "mixed"}>
                {item.unsafeHits.length ? "blocked" : item.recommendation}
              </span>
            </div>
            <span>{item.source} / {item.category}</span>
            <p>{[...item.unsafeHits, ...item.reasons].slice(0, 2).join(" / ")}</p>
          </button>
        ))}
        {!sourceSafety.unsafeItems.length ? <p className="selected-meta">No unsafe or quarantined source items are currently visible.</p> : null}
      </div>
    </section>
  );
}

function LeakageGuardPanel({
  leakageGuard,
  onSelectPrompt,
}: {
  leakageGuard: LeakageGuardReport;
  onSelectPrompt: (id: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <AlertTriangle size={18} />
        <h2>Leakage guard</h2>
      </div>
      <div className="gate-summary">
        <ScoreRing score={leakageGuard.score} label={leakageGuard.status} />
        <div>
          <strong>{leakageGuard.blockers} blocker(s), {leakageGuard.warnings} warning(s)</strong>
          <p>{leakageGuard.checked} prompt(s) checked for unrelated repo-operation text and likely secrets.</p>
        </div>
      </div>
      <FeedbackList title="Guard recommendations" items={leakageGuard.recommendations} empty="No leakage recommendations." />
      <div className="version-list compact-list">
        {leakageGuard.findings.slice(0, 6).map((finding) => (
          <button className="version-card prompt-audit-card" key={finding.promptId} type="button" onClick={() => onSelectPrompt(finding.promptId)}>
            <div className="dna-v2-topline">
              <strong>{finding.title}</strong>
              <span data-tone={finding.severity === "block" ? "weak" : "mixed"}>{finding.severity}</span>
            </div>
            <span>{finding.source} / {finding.matches.join(", ")}</span>
            <p>{finding.recommendation}</p>
          </button>
        ))}
        {!leakageGuard.findings.length ? <p className="selected-meta">Clean: no protected project names, operational task text, or obvious API keys detected.</p> : null}
      </div>
    </section>
  );
}

function GoldAvoidCurationPanel({
  leaderboard,
  onSelectPrompt,
  onUpdateOutcome,
  outcomes,
}: {
  leaderboard: PromptRank[];
  onSelectPrompt: (id: string) => void;
  onUpdateOutcome: (prompt: PromptExample, patch: Partial<Pick<OutcomeRecord, "rating" | "status" | "notes">>) => void;
  outcomes: OutcomeRecord[];
}) {
  const outcomeMap = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const candidates = leaderboard.slice(0, 8);
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Trophy size={18} />
        <h2>Gold / avoid curation</h2>
      </div>
      <p className="selected-meta">Fast-label the examples that should steer generation or be kept away from future recipes.</p>
      <div className="leaderboard-list compact-list">
        {candidates.map((rank) => {
          const outcome = outcomeMap.get(rank.example.id);
          return (
            <article className="leaderboard-card" key={rank.example.id}>
              <span className="rank-badge">{rank.score}</span>
              <div>
                <button className="link-button" type="button" onClick={() => onSelectPrompt(rank.example.id)}>
                  <strong>{rank.example.title}</strong>
                </button>
                <p>{rank.reasons.slice(0, 3).join(" / ")}</p>
                <small>{outcome ? `${outcome.status} / ${outcome.rating}` : "unrated"}</small>
              </div>
              <div className="button-row vertical-actions">
                <button
                  className="ghost-button compact-button"
                  type="button"
                  onClick={() => onUpdateOutcome(rank.example, { rating: "great", status: "gold", notes: "Promoted from gold/avoid curation." })}
                >
                  Gold
                </button>
                <button
                  className="ghost-button compact-button"
                  type="button"
                  onClick={() => onUpdateOutcome(rank.example, { rating: "bad", status: "avoid", notes: "Marked avoid from gold/avoid curation." })}
                >
                  Avoid
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DnaScoreExplainerPanel({
  dnaExplanation,
  selectedPrompt,
}: {
  dnaExplanation: DnaScoreExplanation;
  selectedPrompt?: PromptExample;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Gauge size={18} />
        <h2>Why this DNA score?</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={dnaExplanation.overall} label="DNA" />
        <div>
          <strong>{selectedPrompt?.title ?? "No prompt selected"}</strong>
          <FeedbackList title="Score explanation" items={dnaExplanation.summary} empty="Select a prompt to explain." />
        </div>
      </div>
      <div className="gate-check-grid">
        {dnaExplanation.dimensions.map((dimension) => (
          <article className="gate-check-card" key={dimension.key}>
            <div className="dna-v2-topline">
              <strong>{dimension.label}</strong>
              <span data-tone={scoreTone(dimension.score)}>{dimension.score}</span>
            </div>
            <p>{dimension.why}</p>
            <small>{dimension.evidence.slice(0, 3).join(" / ")}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function QualityGraderV2Panel({ grader }: { grader: QualityGraderV2 }) {
  return (
    <section className="panel lab-panel quality-grader-v2-panel">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Prompt quality grader v2</h2>
        </div>
        <ScoreRing score={grader.score} label={grader.verdict} />
      </div>
      <div className="gate-check-grid">
        {grader.dimensions.map((dimension) => (
          <article className="gate-check-card" key={dimension.key}>
            <div className="dna-v2-topline">
              <strong>{dimension.label}</strong>
              <span data-tone={scoreTone(dimension.score)}>{dimension.score}</span>
            </div>
            <p>{dimension.fix}</p>
            <small>{dimension.evidence.slice(0, 4).join(" / ")}</small>
          </article>
        ))}
      </div>
      <section className="train-columns nested-train-columns">
        <FeedbackList title="Anti-vague penalties" items={grader.penalties} empty="No grader penalties detected." />
        <FeedbackList title="Next best fixes" items={grader.nextActions} empty="This prompt is proof-ready." />
      </section>
    </section>
  );
}

function PromptGeneratorBattleModePanel({
  copied,
  onApplyGeneratorVariant,
  onCopy,
  onQueueBattle,
  onSave,
  promptBattle,
  variants,
}: {
  copied: string;
  onApplyGeneratorVariant: (variant: LearnedGeneratorVariant) => void;
  onCopy: (value: string, key: string) => void;
  onQueueBattle: () => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  promptBattle: PromptBattle;
  variants: LearnedGeneratorVariant[];
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Shuffle size={18} />
          <h2>Prompt generator battle mode</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onQueueBattle}>
          <Plus size={15} />
          Queue battle
        </button>
      </div>
      <div className="winner-card">
        <span>Current winner</span>
        <strong>{promptBattle.winner.title}</strong>
        <p>{promptBattle.explanation.join(" ")}</p>
      </div>
      <div className="preset-grid">
        {variants.slice(0, 4).map((variant) => (
          <article className="preset-card" key={variant.id}>
            <div className="dna-v2-topline">
              <strong>{variant.title}</strong>
              <span data-tone={scoreTone(variant.score)}>{variant.score}</span>
            </div>
            <p>{variant.bestFor}</p>
            <small>{variant.signals.slice(0, 4).join(", ")}</small>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onApplyGeneratorVariant(variant)}>Use</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(variant.prompt, `battle-${variant.id}`)}>
                {copied === `battle-${variant.id}` ? <Check size={15} /> : <Copy size={15} />}
                Copy
              </button>
              <button className="primary-button compact-button" type="button" onClick={() => onSave("generated", variant.title, variant.prompt, variant.score)}>Save</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BuildFeedbackLoopPanel({
  buildFeedback,
  onQueueBattle,
  onUpdateOutcome,
  selectedPrompt,
}: {
  buildFeedback: BuildFeedbackReport;
  onQueueBattle: () => void;
  onUpdateOutcome: (prompt: PromptExample, patch: Partial<Pick<OutcomeRecord, "rating" | "status" | "notes">>) => void;
  selectedPrompt?: PromptExample;
}) {
  const canPromote = buildFeedback.status === "ready-to-promote" && Boolean(selectedPrompt);
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>Build result feedback loop</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={onQueueBattle}>Run battle</button>
          <button
            className="primary-button compact-button"
            type="button"
            disabled={!canPromote}
            onClick={() => selectedPrompt && onUpdateOutcome(selectedPrompt, { rating: "great", status: "gold", notes: "Promoted from build feedback loop." })}
          >
            Promote gold
          </button>
        </div>
      </div>
      <div className="gate-summary">
        <ScoreRing score={buildFeedback.score} label={buildFeedback.status.replace(/-/g, " ")} />
        <FeedbackList title="Feedback summary" items={buildFeedback.summary} empty="No build feedback yet." />
      </div>
      <div className="gate-check-grid">
        {buildFeedback.checks.slice(0, 8).map((check) => (
          <article className="gate-check-card" key={check.label}>
            <div className="dna-v2-topline">
              <strong>{check.label}</strong>
              <span data-tone={scoreTone(check.score)}>{check.score}</span>
            </div>
            <p>{check.notes.slice(0, 2).join(" ")}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Next actions" items={buildFeedback.nextActions} empty="No next actions." />
    </section>
  );
}

function PersistenceStatusPanel({
  apiEvents,
  apiHealth,
  apiNotice,
  buildRuns,
  dbStatus,
  examples,
  hostedSyncReport,
  onCheckApi,
  onPullFromApi,
  onSyncToApi,
  outcomes,
  screenshots,
}: {
  apiEvents: ApiEvent[];
  apiHealth?: ApiHealth;
  apiNotice: string;
  buildRuns: BuildRunRecord[];
  dbStatus: string;
  examples: PromptExample[];
  hostedSyncReport: HostedSyncReport;
  onCheckApi: () => void;
  onPullFromApi: () => void;
  onSyncToApi: () => void;
  outcomes: OutcomeRecord[];
  screenshots: ScreenshotRecord[];
}) {
  const cards = [
    { label: "Prompts", value: examples.length },
    { label: "Labels", value: outcomes.length },
    { label: "Runs", value: buildRuns.length },
    { label: "Screenshots", value: screenshots.length },
    { label: "API events", value: apiEvents.length },
  ];
  return (
    <section className="panel lab-panel" data-train-section="sync">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Hosted API and persistence readiness</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={onCheckApi}>Check API</button>
          <button className="ghost-button compact-button" type="button" onClick={onPullFromApi}>Pull API</button>
          <button className="primary-button compact-button" type="button" onClick={onSyncToApi}>Push API</button>
        </div>
      </div>
      <div className="backend-grid">
        <article className="index-card">
          <strong>{apiHealth?.ok ? "Online" : "Browser-only"}</strong>
          <span>API</span>
        </article>
        <article className="index-card">
          <strong>{apiHealth?.authRequired ? "Token" : apiHealth?.ok ? "Open" : "Local"}</strong>
          <span>Auth</span>
        </article>
        <article className="index-card wide-index-card">
          <h3>Persistence</h3>
          <p>{apiHealth?.sqlitePath || dbStatus}</p>
        </article>
      </div>
      <div className="gate-summary sync-summary">
        <ScoreRing score={hostedSyncReport.score} label={hostedSyncReport.mode} />
        <FeedbackList title="Sync summary" items={hostedSyncReport.summary} empty="No sync summary yet." />
      </div>
      <div className="sync-check-grid">
        {hostedSyncReport.checks.map((check) => (
          <article className="sync-check-card" data-ready={check.ready} key={check.label}>
            <strong>{check.ready ? "Ready" : "Open"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>
      <div className="source-safety-grid">
        {cards.map((card) => (
          <article className="index-card" key={card.label}>
            <strong>{formatNumber(card.value)}</strong>
            <span>{card.label}</span>
          </article>
        ))}
      </div>
      <p className="selected-meta">{apiNotice}</p>
    </section>
  );
}

function TrainCommandCenter({
  corpusCleaning,
  curationReport,
  dbStatus,
  dnaCalibration,
  failureMemory,
  queueJobs,
  resultScore,
  screenshotQa,
  scoreBreakdown,
}: {
  corpusCleaning: CorpusCleaningReport;
  curationReport: CorpusCurationReport;
  dbStatus: string;
  dnaCalibration: DnaCalibrationReport;
  failureMemory: FailureMemoryReport;
  queueJobs: BuildQueueJob[];
  resultScore: ResultScore;
  screenshotQa: ScreenshotQaReport;
  scoreBreakdown: ScoreBreakdown;
}) {
  const steps = [
    {
      title: "1. Run",
      value: queueJobs.length ? Math.min(100, 55 + queueJobs.length * 10) : resultScore.score,
      detail: queueJobs.length ? `${queueJobs.length} queued build job(s) ready.` : "Create a run folder, build from the prompt, and record the URL.",
    },
    {
      title: "2. Capture",
      value: screenshotQa.score,
      detail: "Save desktop/mobile screenshots and visual notes.",
    },
    {
      title: "3. Score",
      value: scoreBreakdown.finalScore,
      detail: "Blend prompt quality, predicted build, actual result, taste, and failure risk.",
    },
    {
      title: "4. Clean",
      value: Math.max(0, Math.round((curationReport.counts.learn / Math.max(1, curationReport.items.length)) * 100) - corpusCleaning.nearDuplicates.length * 2),
      detail: `${curationReport.counts.learn} learning prompt(s), ${curationReport.counts.quarantine} quarantined.`,
    },
  ];

  return (
    <section className="panel lab-panel command-center-panel">
      <div className="panel-header">
        <ListChecks size={18} />
        <h2>Closed-loop workflow</h2>
      </div>
      <div className="command-center-grid">
        {steps.map((step) => (
          <article className="command-center-card" key={step.title}>
            <strong>{step.title}</strong>
            <span data-tone={scoreTone(step.value)}>{step.value}</span>
            <p>{step.detail}</p>
          </article>
        ))}
      </div>
      <div className="workflow-strip">
        <span>{dbStatus}</span>
        <span>{failureMemory.categories.length || 0} remembered failure types</span>
        <span>{dnaCalibration.rows.length} rated calibration rows</span>
        <span>{curationReport.counts.review} curation review item(s)</span>
      </div>
    </section>
  );
}

function BackendApiPanel({
  apiBaseDraft,
  apiHealth,
  apiNotice,
  apiTokenDraft,
  onCheckApi,
  onCaptureSelectedResult,
  onInstallSkill,
  onRunQueueViaApi,
  onSaveApiBase,
  onSyncToApi,
  queueJobs,
  setApiBaseDraft,
  setApiTokenDraft,
}: {
  apiBaseDraft: string;
  apiHealth?: ApiHealth;
  apiNotice: string;
  apiTokenDraft: string;
  onCheckApi: () => void;
  onCaptureSelectedResult: () => void;
  onInstallSkill: () => void;
  onRunQueueViaApi: () => void;
  onSaveApiBase: () => void;
  onSyncToApi: () => void;
  queueJobs: BuildQueueJob[];
  setApiBaseDraft: (value: string) => void;
  setApiTokenDraft: (value: string) => void;
}) {
  return (
    <section className="panel lab-panel backend-panel" data-train-section="api">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Local backend API + SQLite</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={onCheckApi}>Check API</button>
          <button className="ghost-button compact-button" type="button" onClick={onSyncToApi}>Sync SQLite</button>
          <button className="ghost-button compact-button" type="button" onClick={onRunQueueViaApi} disabled={!queueJobs.length}>Run queue</button>
          <button className="ghost-button compact-button" type="button" onClick={onCaptureSelectedResult}>Capture URL</button>
          <button className="primary-button compact-button" type="button" onClick={onInstallSkill}>Install skill</button>
        </div>
      </div>
      <div className="backend-grid">
        <article className="index-card">
          <strong>{apiHealth?.ok ? "Online" : "Offline"}</strong>
          <span>API status</span>
        </article>
        <article className="index-card">
          <strong>{apiHealth?.authRequired ? "Token" : "Open"}</strong>
          <span>Auth mode</span>
        </article>
        <article className="index-card wide-index-card">
          <h3>SQLite</h3>
          <p>{apiHealth?.sqlitePath || "Start with npm run api"}</p>
        </article>
      </div>
      <p className="selected-meta">{apiNotice}</p>
      <div className="api-base-row">
        <Field label="API base">
          <input value={apiBaseDraft} onChange={(event) => setApiBaseDraft(event.target.value)} placeholder="http://127.0.0.1:8787 or hosted API URL" />
        </Field>
        <Field label="API token">
          <input type="password" value={apiTokenDraft} onChange={(event) => setApiTokenDraft(event.target.value)} placeholder="Optional hosted API token" />
        </Field>
        <button className="ghost-button compact-button" type="button" onClick={onSaveApiBase}>Save API base</button>
      </div>
      <div className="command-box">
        <code>PROMPT_LAB_API_TOKEN=... npm run api</code>
      </div>
    </section>
  );
}

function HostedApiDeployPanel({
  copied,
  onCopy,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
}) {
  const renderEnv = [
    "PROMPT_LAB_API_HOST=0.0.0.0",
    "PROMPT_LAB_API_TOKEN=<generated secret>",
    "PROMPT_LAB_DATA_DIR=/var/data/prompt-atelier",
    "PROMPT_LAB_ALLOWED_ORIGIN=https://zakiefer.github.io",
    "PROMPT_LAB_RATE_LIMIT=240",
  ].join("\n");
  const setup = [
    "1. Create a Render Blueprint from this repo.",
    "2. Render uses render.yaml + Dockerfile.api.",
    "3. Copy the generated PROMPT_LAB_API_TOKEN.",
    "4. Paste the Render service URL and token into API base/token.",
    "5. Check API, then Push API.",
  ];
  return (
    <section className="panel lab-panel hosted-api-panel" data-train-section="api">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Hosted API deploy option</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(renderEnv, "hosted-api-env")}>
          {copied === "hosted-api-env" ? <Check size={15} /> : <Copy size={15} />}
          Copy env
        </button>
      </div>
      <p className="selected-meta">Use the included Render blueprint for token-protected cross-browser sync with persistent SQLite storage.</p>
      <div className="hosted-api-grid">
        <article className="index-card wide-index-card">
          <h3>Files added</h3>
          <p>render.yaml, Dockerfile.api, docs/hosted-api.md</p>
        </article>
        <article className="index-card wide-index-card">
          <h3>Health route</h3>
          <p>/api/health</p>
        </article>
      </div>
      <FeedbackList title="Deploy flow" items={setup} empty="No deploy steps." />
      <pre className="prompt-patch-box">{renderEnv}</pre>
    </section>
  );
}

function StageNavPanel({
  activeStage,
  setActiveStage,
}: {
  activeStage: string;
  setActiveStage: (stage: string) => void;
}) {
  const stages = ["Wizard", "Compile", "Battle", "Run", "Analyze", "Version", "Export Skill"];
  return (
    <section className="panel lab-panel stage-panel">
      <div className="panel-header">
        <ListChecks size={18} />
        <h2>Guided product workflow</h2>
      </div>
      <div className="stage-nav">
        {stages.map((stage) => (
          <button className={activeStage === stage ? "active" : ""} key={stage} type="button" onClick={() => setActiveStage(stage)}>
            {stage}
          </button>
        ))}
      </div>
      <p className="selected-meta">
        Current stage: {activeStage}. Advanced panels stay available below, but this strip is the product path through the lab.
      </p>
    </section>
  );
}

function SecurityOpsPanel({
  apiEvents,
  apiHealth,
  apiNotice,
  onRefreshApiEvents,
}: {
  apiEvents: ApiEvent[];
  apiHealth?: ApiHealth;
  apiNotice: string;
  onRefreshApiEvents: () => void;
}) {
  const ops = [
    { label: "Auth", value: apiHealth?.authRequired ? "Token required" : "Open/local" },
    { label: "CORS", value: apiHealth?.allowedOrigin || "not checked" },
    { label: "Rate limit", value: apiHealth?.rateLimitPerMinute ? `${apiHealth.rateLimitPerMinute}/min` : "default" },
    { label: "Data dir", value: apiHealth?.dataDir || "browser fallback" },
  ];

  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <AlertTriangle size={18} />
          <h2>Security and ops</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={onRefreshApiEvents}>Refresh events</button>
      </div>
      <div className="backend-grid">
        {ops.map((item) => (
          <article className="index-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>
      <p className="selected-meta">{apiNotice}</p>
      <div className="version-list compact-list">
        {apiEvents.length ? apiEvents.slice(0, 8).map((event) => (
          <article className="version-card" key={event.id}>
            <strong>{event.kind}</strong>
            <span>{new Date(event.createdAt).toLocaleString()}</span>
            <p>{typeof event.detail === "string" ? event.detail : JSON.stringify(event.detail)}</p>
          </article>
        )) : <p className="selected-meta">Connect a token-protected API and refresh events to see sync, queue, capture, and unauthorized access history.</p>}
      </div>
    </section>
  );
}

function ProductOnboardingPanel({
  mode,
  onChooseMode,
  onCreateBackupSnapshot,
  onExportCodexBuildPack,
  onSyncToApi,
}: {
  mode: OnboardingMode;
  onChooseMode: (mode: OnboardingMode) => void;
  onCreateBackupSnapshot: (label?: string) => void;
  onExportCodexBuildPack: () => void;
  onSyncToApi: () => void;
}) {
  const modes: { key: OnboardingMode; title: string; body: string }[] = [
    { key: "demo", title: "Use demo set", body: "Load labels, model rows, runs, screenshots, and a dataset version." },
    { key: "upload", title: "Upload prompts", body: "Jump to ingestion and import your own high-signal prompt corpus." },
    { key: "blank", title: "Start blank", body: "Begin with the composer and generate a first prompt from scratch." },
  ];
  const steps = ["Choose a corpus path", "Curate and label winners", "Run visual evidence", "Export a Codex build pack"];

  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>Guided onboarding</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCreateBackupSnapshot("pre-onboarding-backup")}>Backup</button>
          <button className="ghost-button compact-button" type="button" onClick={onSyncToApi}>Sync</button>
          <button className="primary-button compact-button" type="button" onClick={onExportCodexBuildPack}>Build pack</button>
        </div>
      </div>
      <div className="preset-grid">
        {modes.map((item) => (
          <button className="preset-card" data-active={mode === item.key} key={item.key} type="button" onClick={() => onChooseMode(item.key)}>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </button>
        ))}
      </div>
      <div className="guided-steps">
        {steps.map((step, index) => (
          <article className="guided-step" key={step}>
            <span>{index + 1}</span>
            <p>{step}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CodexBuildPackPanel({
  codexBuildPack,
  copied,
  onCopy,
  onExportCodexBuildPack,
}: {
  codexBuildPack: CodexBuildPack;
  copied: string;
  onCopy: (value: string, key: string) => void;
  onExportCodexBuildPack: () => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <PackageOpen size={18} />
          <h2>Export-to-Codex build pack</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(codexBuildPack.markdown, "codex-build-pack")}>
            {copied === "codex-build-pack" ? <Check size={15} /> : <Copy size={15} />}
            Copy task
          </button>
          <button className="primary-button compact-button" type="button" onClick={onExportCodexBuildPack}>
            <Download size={15} />
            Export
          </button>
        </div>
      </div>
      <div className="memory-pack-grid">
        {codexBuildPack.files.map((file) => (
          <article className="index-card" key={file.path}>
            <strong>{file.path}</strong>
            <span>{formatNumber(file.content.length)} chars</span>
          </article>
        ))}
      </div>
      <textarea className="generated-output mini-output" readOnly value={codexBuildPack.commands.join("\n")} />
    </section>
  );
}

function ExperimentLeaderboardPanel({
  experimentLeaderboard,
  onBulkPromoteLeaderboard,
  onSelectPrompt,
}: {
  experimentLeaderboard: ExperimentLeaderboardReport;
  onBulkPromoteLeaderboard: () => void;
  onSelectPrompt: (id: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Trophy size={18} />
          <h2>Experiment leaderboard</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onBulkPromoteLeaderboard}>Promote top 5</button>
      </div>
      <FeedbackList title="Experiment summary" items={experimentLeaderboard.summary} empty="No experiment data yet." />
      <div className="leaderboard-list compact-list">
        {experimentLeaderboard.items.slice(0, 10).map((item, index) => (
          <button className="leaderboard-card" key={item.promptId} type="button" onClick={() => onSelectPrompt(item.promptId)}>
            <span className="rank-badge">{index + 1}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.reasons.join(" / ")}</p>
              <small>Wins {item.wins} / Losses {item.losses} / Prompt {item.promptScore} / Result {item.resultScore || "pending"}</small>
            </div>
            <em>{item.score}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

function EvaluationHistoryPanel({ evaluationHistory }: { evaluationHistory: EvaluationHistoryReport }) {
  const trendCards = [
    { label: "Gold rate", value: `${evaluationHistory.trends.goldRate}%` },
    { label: "Build pass", value: `${evaluationHistory.trends.passRate}%` },
    { label: "Avg build", value: String(evaluationHistory.trends.averageBuildScore) },
    { label: "Avg model", value: String(evaluationHistory.trends.averageModelScore) },
    { label: "Visual great", value: `${evaluationHistory.trends.visualGreatRate}%` },
  ];
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <BarChart3 size={18} />
        <h2>Evaluation history</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={evaluationHistory.score} label="History" />
        <FeedbackList title="Trend summary" items={evaluationHistory.summary} empty="No evaluation history yet." />
      </div>
      <div className="env-status-grid">
        {trendCards.map((card) => (
          <span data-ready={card.value !== "0" && card.value !== "0%"} key={card.label}>{card.label}: {card.value}</span>
        ))}
      </div>
      <div className="version-list compact-list">
        {evaluationHistory.items.slice(0, 12).map((item) => (
          <article className="version-card" key={item.id}>
            <div className="dna-v2-topline">
              <strong>{item.title}</strong>
              <span data-tone={scoreTone(item.score)}>{item.score}</span>
            </div>
            <span>{item.kind} / {item.status} / {new Date(item.createdAt).toLocaleDateString()}</span>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function LearnedGeneratorWorkspacePanel({
  generatorInput,
  onApplyGeneratorVariant,
  onCopy,
  onSave,
  setGeneratorInput,
  variants,
}: {
  generatorInput: LearnedGeneratorInput;
  onApplyGeneratorVariant: (variant: LearnedGeneratorVariant) => void;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  setGeneratorInput: Dispatch<SetStateAction<LearnedGeneratorInput>>;
  variants: LearnedGeneratorVariant[];
}) {
  function update<K extends keyof LearnedGeneratorInput>(key: K, value: LearnedGeneratorInput[K]) {
    setGeneratorInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Wand2 size={18} />
        <h2>Learned prompt generator</h2>
      </div>
      <div className="two-field-grid">
        <Field label="Brand">
          <input value={generatorInput.brandName} onChange={(event) => update("brandName", event.target.value)} />
        </Field>
        <Field label="Industry">
          <input value={generatorInput.industry} onChange={(event) => update("industry", event.target.value)} />
        </Field>
      </div>
      <div className="two-field-grid">
        <Field label="Stack">
          <input value={generatorInput.stack} onChange={(event) => update("stack", event.target.value)} />
        </Field>
        <Field label="Site type">
          <input value={generatorInput.siteType} onChange={(event) => update("siteType", event.target.value)} />
        </Field>
      </div>
      <div className="two-field-grid">
        <Field label="Audience">
          <input value={generatorInput.audience || ""} onChange={(event) => update("audience", event.target.value)} />
        </Field>
        <Field label="Output target">
          <select value={generatorInput.outputTarget || "Codex build prompt"} onChange={(event) => update("outputTarget", event.target.value)}>
            <option>Codex build prompt</option>
            <option>v0 prompt</option>
            <option>Claude artifact prompt</option>
            <option>Lovable prompt</option>
            <option>Raw implementation spec</option>
          </select>
        </Field>
      </div>
      <Field label="Conversion goal">
        <textarea value={generatorInput.goal || ""} onChange={(event) => update("goal", event.target.value)} />
      </Field>
      <Field label="Vibe">
        <input value={generatorInput.vibe || ""} onChange={(event) => update("vibe", event.target.value)} />
      </Field>
      <Field label="Visual style">
        <textarea value={generatorInput.visualStyle} onChange={(event) => update("visualStyle", event.target.value)} />
      </Field>
      <Field label="Assets">
        <textarea value={generatorInput.assets} onChange={(event) => update("assets", event.target.value)} />
      </Field>
      <Field label="Constraints">
        <textarea value={generatorInput.constraints} onChange={(event) => update("constraints", event.target.value)} />
      </Field>
      <Field label={`Strictness ${generatorInput.strictness}/10`}>
        <input type="range" min="1" max="10" value={generatorInput.strictness} onChange={(event) => update("strictness", Number(event.target.value))} />
      </Field>
      <div className="preset-grid">
        {variants.map((variant) => (
          <article className="preset-card" key={variant.id}>
            <div className="dna-v2-topline">
              <strong>{variant.title}</strong>
              <span data-tone={scoreTone(variant.score)}>{variant.score}</span>
            </div>
            <p>{variant.bestFor}</p>
            <small>{variant.signals.slice(0, 5).join(", ")}</small>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onApplyGeneratorVariant(variant)}>Use</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(variant.prompt, variant.id)}>Copy</button>
              <button className="primary-button compact-button" type="button" onClick={() => onSave("generated", variant.title, variant.prompt, variant.score)}>Save</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DatasetToolPanel({
  curationReport,
  datasetComparison,
  onBulkPromoteLeaderboard,
  onCreateDatasetVersion,
  onQuarantineWeakCorpus,
}: {
  curationReport: CorpusCurationReport;
  datasetComparison: DatasetVersionComparison;
  onBulkPromoteLeaderboard: () => void;
  onCreateDatasetVersion: () => void;
  onQuarantineWeakCorpus: () => void;
}) {
  const entries = Object.entries(datasetComparison.deltas).filter(([, value]) => value !== 0).slice(0, 8);
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Dataset tools</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={onQuarantineWeakCorpus}>Quarantine weak</button>
          <button className="ghost-button compact-button" type="button" onClick={onBulkPromoteLeaderboard}>Promote winners</button>
          <button className="primary-button compact-button" type="button" onClick={onCreateDatasetVersion}>Snapshot</button>
        </div>
      </div>
      <div className="env-status-grid">
        <span data-ready>{curationReport.counts.learn} learn</span>
        <span data-ready={curationReport.counts.quarantine === 0}>{curationReport.counts.quarantine} quarantine</span>
        <span data-ready={curationReport.counts.review === 0}>{curationReport.counts.review} review</span>
      </div>
      <div className="compare-version-grid">
        <article className="index-card">
          <strong>{datasetComparison.current?.label ?? "none"}</strong>
          <span>current</span>
        </article>
        <article className="index-card">
          <strong>{datasetComparison.baseline?.label ?? "none"}</strong>
          <span>baseline</span>
        </article>
      </div>
      <div className="delta-list">
        {entries.length ? entries.map(([key, value]) => (
          <span data-positive={value > 0} key={key}>{key}: {value > 0 ? "+" : ""}{value}</span>
        )) : <p className="selected-meta">Create at least two dataset versions to compare deltas.</p>}
      </div>
      <FeedbackList title="Version notes" items={datasetComparison.notes} empty="No version notes yet." />
    </section>
  );
}

function BackupRestorePanel({
  backupSnapshots,
  onCreateBackupSnapshot,
  onExportBackupSnapshot,
  onRestoreBackupSnapshot,
}: {
  backupSnapshots: TrainingBackupSnapshot[];
  onCreateBackupSnapshot: (label?: string) => void;
  onExportBackupSnapshot: (id?: string) => void;
  onRestoreBackupSnapshot: (id: string) => void;
}) {
  const [label, setLabel] = useState(`restore-point-${backupSnapshots.length + 1}`);
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Backups and restore points</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onExportBackupSnapshot()} disabled={!backupSnapshots.length}>Export latest</button>
          <button className="primary-button compact-button" type="button" onClick={() => onCreateBackupSnapshot(label)}>Create backup</button>
        </div>
      </div>
      <Field label="Backup label">
        <input value={label} onChange={(event) => setLabel(event.target.value)} />
      </Field>
      <div className="version-list compact-list">
        {backupSnapshots.length ? backupSnapshots.map((backup) => (
          <article className="version-card" key={backup.id}>
            <strong>{backup.label}</strong>
            <span>{new Date(backup.createdAt).toLocaleString()}</span>
            <p>{backup.summary}</p>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onRestoreBackupSnapshot(backup.id)}>Restore</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onExportBackupSnapshot(backup.id)}>Export</button>
            </div>
          </article>
        )) : <p className="selected-meta">Create a restore point before bulk labels, imports, or model calibration.</p>}
      </div>
    </section>
  );
}

function QualityGatePanel({
  copied,
  onCopy,
  qualityGate,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  qualityGate: QualityGateReport;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>Ready-to-build quality gate</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(qualityGate.nextPromptPatch, "quality-gate-patch")}>
          {copied === "quality-gate-patch" ? <Check size={15} /> : <Copy size={15} />}
          Copy patch
        </button>
      </div>
      <div className="gate-summary">
        <ScoreRing score={qualityGate.score} label={qualityGate.ready ? "Ready" : "Blocked"} />
        <div>
          <strong>{qualityGate.ready ? "Prompt is ready to run" : `${qualityGate.blocking.length || qualityGate.missing.length} issue(s) before build`}</strong>
          <p>{qualityGate.ready ? "The prompt clears stack, assets, layout, responsive, constraints, and QA checks." : qualityGate.missing.slice(0, 2).join(" ")}</p>
        </div>
      </div>
      <div className="gate-check-grid">
        {qualityGate.checks.map((check) => (
          <article className="gate-check-card" data-pass={check.passed} key={check.key}>
            <div className="dna-v2-topline">
              <strong>{check.label}</strong>
              <span data-tone={scoreTone(check.score)}>{check.score}</span>
            </div>
            <p>{check.evidence.slice(0, 3).join(" / ") || check.fix}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function GoldReviewPanel({
  goldReview,
  onApplyGoldReview,
}: {
  goldReview: GoldReviewReport;
  onApplyGoldReview: () => void;
}) {
  const candidates = [goldReview.left, goldReview.right].filter(Boolean) as NonNullable<GoldReviewReport["left"]>[];
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Trophy size={18} />
          <h2>Gold vs bad reviewer</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onApplyGoldReview} disabled={!goldReview.winnerId}>
          <Check size={15} />
          Apply labels
        </button>
      </div>
      <div className="review-grid">
        {candidates.map((candidate) => (
          <article className="review-card" data-winner={candidate.id === goldReview.winnerId} key={candidate.id}>
            <span>{candidate.id === goldReview.winnerId ? "recommended gold" : "candidate"}</span>
            <strong>{candidate.title}</strong>
            <em>{candidate.score}</em>
            <p>{candidate.evidence.join(" / ")}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Learning updates" items={goldReview.learningUpdates} empty="Select two prompts to generate label updates." />
    </section>
  );
}

function AutonomousBattlePanel({
  autoBattleResult,
  onQueueBattle,
  onRunAutonomousBattle,
  promptBattle,
}: {
  autoBattleResult?: Record<string, unknown>;
  onQueueBattle: () => void;
  onRunAutonomousBattle: () => void;
  promptBattle: PromptBattle;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Shuffle size={18} />
          <h2>Autonomous battle runner</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={onQueueBattle}>
            <Plus size={15} />
            Queue
          </button>
          <button className="primary-button compact-button" type="button" onClick={onRunAutonomousBattle}>
            <Hammer size={15} />
            Run now
          </button>
        </div>
      </div>
      <div className="winner-card">
        <span>{promptBattle.variants.length} variants</span>
        <strong>{String(autoBattleResult?.winner ?? promptBattle.winner.title)}</strong>
        <p>{autoBattleResult ? `Processed ${String(autoBattleResult.processed ?? 0)} run(s), winner score ${String(autoBattleResult.winnerScore ?? promptBattle.winner.score)}.` : promptBattle.explanation.join(" ")}</p>
      </div>
      <textarea className="generated-output mini-output" readOnly value={autoBattleResult ? JSON.stringify(autoBattleResult, null, 2) : promptBattle.queuePlan.join("\n")} />
    </section>
  );
}

function MutationTournamentHistoryPanel({
  mutationTournamentRuns,
  onRunMutationTournament,
}: {
  mutationTournamentRuns: MutationTournamentRun[];
  onRunMutationTournament: () => void;
}) {
  const latest = mutationTournamentRuns[0];
  return (
    <section className="panel lab-panel mutation-tournament-panel">
      <div className="output-header">
        <div className="panel-header">
          <Trophy size={18} />
          <h2>Mutation tournament history</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunMutationTournament}>
          <Shuffle size={15} />
          Run mutation tournament
        </button>
      </div>
      {latest ? (
        <div className="winner-card">
          <span>{latest.modelMode}</span>
          <strong>{latest.winnerTitle}</strong>
          <em>{latest.winnerScore}</em>
          <p>{latest.notes.join(" ")}</p>
        </div>
      ) : (
        <p className="selected-meta">Run mutations through a lightweight tournament, save the winner, then prove it with screenshots.</p>
      )}
      <div className="version-list compact-list">
        {mutationTournamentRuns.slice(0, 4).map((run) => (
          <article className="version-card" key={run.id}>
            <div className="dna-v2-topline">
              <strong>{run.sourceTitle}</strong>
              <span data-tone={scoreTone(run.winnerScore)}>{run.winnerScore}</span>
            </div>
            <p>{run.winnerTitle}</p>
            <small>{run.variants.map((variant) => `${variant.title}: ${variant.score}`).join(" / ")}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromptWinInsightPanel({ winExplanation }: { winExplanation: PromptWinExplanationReport }) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Lightbulb size={18} />
        <h2>Prompt diff intelligence</h2>
      </div>
      <FeedbackList title="Summary" items={winExplanation.summary} empty="Select two prompts to compare." />
      <div className="signal-list">
        {winExplanation.likelyWinningSignals.slice(0, 6).map((signal) => (
          <article className="signal-card" data-side={signal.side} key={signal.id}>
            <span>{signal.side}</span>
            <strong>{signal.label}</strong>
            <p>{signal.detail}</p>
          </article>
        ))}
      </div>
      <p className="selected-meta">{winExplanation.nextExperiment}</p>
    </section>
  );
}

function GeneratorPresetPanel({
  copied,
  generatorPresets,
  onApplyGeneratorPreset,
  onCopy,
  onSave,
}: {
  copied: string;
  generatorPresets: GeneratorPreset[];
  onApplyGeneratorPreset: (preset: GeneratorPreset) => void;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Tags size={18} />
        <h2>Learned generator presets</h2>
      </div>
      <div className="preset-grid">
        {generatorPresets.slice(0, 6).map((preset) => (
          <article className="preset-card" key={preset.id}>
            <div className="dna-v2-topline">
              <strong>{preset.title}</strong>
              <span data-tone={scoreTone(preset.score)}>{preset.score}</span>
            </div>
            <p>{preset.bestFor}</p>
            <small>{preset.signals.slice(0, 4).join(", ")}</small>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onApplyGeneratorPreset(preset)}>Use</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(preset.prompt, `preset-${preset.id}`)}>
                {copied === `preset-${preset.id}` ? <Check size={15} /> : <Copy size={15} />}
                Copy
              </button>
              <button className="primary-button compact-button" type="button" onClick={() => onSave("template", `${preset.title} preset`, preset.prompt, preset.score)}>Save</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResultGalleryPanel({ resultGallery }: { resultGallery: ResultGalleryItem[] }) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <FileText size={18} />
        <h2>Result gallery</h2>
      </div>
      <div className="result-gallery-grid">
        {resultGallery.length ? resultGallery.slice(0, 6).map((item) => (
          <article className="gallery-card" key={item.id}>
            {item.image && /^(https?:|data:|\/)/.test(item.image) ? <img src={item.image} alt={item.title} /> : <div className="empty-shot">No screenshot</div>}
            <strong>{item.title}</strong>
            <span>{item.status} / {item.score}</span>
            <p>{item.notes || item.resultUrl || "No notes yet."}</p>
          </article>
        )) : <p className="selected-meta">Capture screenshots or import queue results to build a visual memory gallery.</p>}
      </div>
    </section>
  );
}

function ReusableMemoryPackPanel({
  copied,
  onCopy,
  onExportMemoryPack,
  reusableMemoryPack,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onExportMemoryPack: () => void;
  reusableMemoryPack: ReusableMemoryPack;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Reusable memory pack</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(reusableMemoryPack.markdown, "memory-pack-md")}>
            {copied === "memory-pack-md" ? <Check size={15} /> : <Copy size={15} />}
            Copy MD
          </button>
          <button className="primary-button compact-button" type="button" onClick={onExportMemoryPack}>
            <Download size={15} />
            Export
          </button>
        </div>
      </div>
      <div className="memory-pack-grid">
        {reusableMemoryPack.sections.map((section) => (
          <article className="index-card" key={section.title}>
            <strong>{section.count}</strong>
            <span>{section.title}</span>
          </article>
        ))}
      </div>
      <textarea className="generated-output mini-output" readOnly value={reusableMemoryPack.markdown} />
    </section>
  );
}

function FirstRunWizardPanel({
  apiHealth,
  curationReport,
  datasetVersions,
  learningExamples,
  modelEnvStatus,
  onApplyCurationRecommendations,
  onCreateDatasetVersion,
  onExportMemoryPack,
  onLoadDemoMode,
  onRunModelBatchCalibration,
}: {
  apiHealth?: ApiHealth;
  curationReport: CorpusCurationReport;
  datasetVersions: DatasetVersion[];
  learningExamples: PromptExample[];
  modelEnvStatus?: Record<string, boolean>;
  onApplyCurationRecommendations: () => void;
  onCreateDatasetVersion: () => void;
  onExportMemoryPack: () => void;
  onLoadDemoMode: () => void;
  onRunModelBatchCalibration: () => void;
}) {
  const steps = [
    { label: "Corpus loaded", ready: learningExamples.length > 0, action: `${learningExamples.length} learning prompts` },
    { label: "Curated", ready: curationReport.counts.quarantine > 0 || curationReport.counts.review === 0, action: `${curationReport.counts.review} review` },
    { label: "Versioned", ready: datasetVersions.length > 0, action: datasetVersions[0]?.label ?? "none" },
    { label: "API online", ready: Boolean(apiHealth?.ok), action: apiHealth?.ok ? "connected" : "local fallback" },
    { label: "Model ready", ready: Boolean(modelEnvStatus?.anthropicApiKeyConfigured || modelEnvStatus?.apiKeyConfigured), action: modelEnvStatus?.anthropicApiKeyConfigured ? "Claude" : "optional" },
  ];

  return (
    <section className="panel lab-panel wizard-panel">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>First-run launch checklist</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={onApplyCurationRecommendations}>Curate</button>
          <button className="ghost-button compact-button" type="button" onClick={onCreateDatasetVersion}>Version</button>
          <button className="ghost-button compact-button" type="button" onClick={onLoadDemoMode}>Demo</button>
          <button className="ghost-button compact-button" type="button" onClick={onRunModelBatchCalibration}>Calibrate</button>
          <button className="primary-button compact-button" type="button" onClick={onExportMemoryPack}>Export memory</button>
        </div>
      </div>
      <div className="wizard-meta-grid">
        {steps.map((step) => (
          <article className="index-card" key={step.label}>
            <strong>{step.ready ? "Ready" : "Todo"}</strong>
            <span>{step.label}</span>
            <p>{step.action}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CorpusCurationPanel({
  curationDecisions,
  curationReport,
  onApplyCurationRecommendations,
  onSetPromptCurationDecision,
}: {
  curationDecisions: Record<string, CurationDecision>;
  curationReport: CorpusCurationReport;
  onApplyCurationRecommendations: () => void;
  onSetPromptCurationDecision: (promptId: string, decision: CurationDecision) => void;
}) {
  const reviewItems = curationReport.items
    .filter((item) => item.recommendation !== "learn" || item.category !== "website-prompt")
    .slice(0, 12);

  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Corpus curation</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onApplyCurationRecommendations}>
          <Check size={15} />
          Apply recommendations
        </button>
      </div>
      <div className="env-status-grid">
        <span data-ready>{curationReport.counts.learn} learn</span>
        <span data-ready={curationReport.counts.quarantine === 0}>{curationReport.counts.quarantine} quarantine</span>
        <span data-ready={curationReport.counts.review === 0}>{curationReport.counts.review} review</span>
        <span>{curationReport.counts["repo-task"]} repo-task</span>
      </div>
      <div className="version-list compact-list">
        {reviewItems.map((item) => (
          <article className="version-card" key={item.promptId}>
            <strong>{item.title}</strong>
            <span>{item.category} / {item.confidence}% confidence</span>
            <p>{item.reasons[0]}</p>
            <select
              value={curationDecisions[item.promptId] || item.recommendation}
              onChange={(event) => onSetPromptCurationDecision(item.promptId, event.target.value as CurationDecision)}
            >
              <option value="learn">learn</option>
              <option value="review">review</option>
              <option value="quarantine">quarantine</option>
            </select>
          </article>
        ))}
      </div>
      <FeedbackList title="Curation notes" items={curationReport.notes} empty="Corpus looks clean." />
    </section>
  );
}

function ModelBatchCalibrationPanel({
  evaluations,
  modelNotice,
  onRunModelBatchCalibration,
}: {
  evaluations: ModelBatchEvaluation[];
  modelNotice: string;
  onRunModelBatchCalibration: () => void;
}) {
  const latest = evaluations.slice(0, 12);
  const average = latest.length ? Math.round(latest.reduce((sum, item) => sum + item.score, 0) / latest.length) : 0;

  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Sparkles size={18} />
          <h2>Claude batch calibration</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunModelBatchCalibration}>
          <Sparkles size={15} />
          Run batch
        </button>
      </div>
      <div className="backend-grid">
        <article className="index-card">
          <strong>{latest.length}</strong>
          <span>latest rows</span>
        </article>
        <article className="index-card">
          <strong>{average}</strong>
          <span>avg model score</span>
        </article>
        <article className="index-card wide-index-card">
          <h3>Status</h3>
          <p>{modelNotice}</p>
        </article>
      </div>
      <div className="version-list compact-list">
        {latest.map((item) => (
          <article className="version-card" key={item.id}>
            <strong>{item.title}</strong>
            <span>{item.mode} / {item.score} / {item.readiness}</span>
            <p>{item.findings[0] || "No findings returned."}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PairwiseLabelingPanel({
  examples,
  onAddPairwiseReview,
  pairwiseReviews,
}: {
  examples: PromptExample[];
  onAddPairwiseReview: (left: PromptExample | undefined, right: PromptExample | undefined, winnerId: string, reason: string) => void;
  pairwiseReviews: PairwiseReviewRecord[];
}) {
  const [leftId, setLeftId] = useState(examples[0]?.id ?? "");
  const [rightId, setRightId] = useState(examples[1]?.id ?? examples[0]?.id ?? "");
  const [reason, setReason] = useState("More exact visual direction, assets, responsive rules, and verification detail.");
  const left = examples.find((example) => example.id === leftId) ?? examples[0];
  const right = examples.find((example) => example.id === rightId) ?? examples.find((example) => example.id !== left?.id);
  const latest = pairwiseReviews.slice(0, 8);

  useEffect(() => {
    if (!leftId && examples[0]) setLeftId(examples[0].id);
    if (!rightId && examples[1]) setRightId(examples[1].id);
  }, [examples, leftId, rightId]);

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Trophy size={18} />
        <h2>Ground-truth pairwise labels</h2>
      </div>
      <div className="two-field-grid">
        <Field label="Left prompt">
          <select value={left?.id ?? ""} onChange={(event) => setLeftId(event.target.value)}>
            {examples.map((example) => <option key={example.id} value={example.id}>{example.title}</option>)}
          </select>
        </Field>
        <Field label="Right prompt">
          <select value={right?.id ?? ""} onChange={(event) => setRightId(event.target.value)}>
            {examples.map((example) => <option key={example.id} value={example.id}>{example.title}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Why it won">
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} />
      </Field>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" disabled={!left || !right || left.id === right.id} onClick={() => onAddPairwiseReview(left, right, left?.id ?? "", reason)}>
          Left wins
        </button>
        <button className="ghost-button compact-button" type="button" disabled={!left || !right || left.id === right.id} onClick={() => onAddPairwiseReview(left, right, right?.id ?? "", reason)}>
          Right wins
        </button>
      </div>
      <div className="version-list compact-list">
        {latest.length ? latest.map((review) => (
          <article className="version-card" key={review.id}>
            <strong>{review.winnerId}</strong>
            <span>beat {review.loserId}</span>
            <p>{review.reason}</p>
          </article>
        )) : <p className="selected-meta">Compare two prompts to create gold and avoid labels automatically.</p>}
      </div>
    </section>
  );
}

function PatternDashboardPanel({ patternDashboard }: { patternDashboard: PatternDashboardReport }) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <BarChart3 size={18} />
        <h2>Prompt pattern dashboard</h2>
      </div>
      <FeedbackList title="Pattern summary" items={patternDashboard.summary} empty="Add labels to reveal winning patterns." />
      <div className="version-list compact-list">
        {patternDashboard.items.slice(0, 8).map((item) => (
          <article className="version-card" key={item.label}>
            <div className="dna-v2-topline">
              <strong>{item.label}</strong>
              <span data-tone={scoreTone(item.winRate)}>{item.winRate}%</span>
            </div>
            <p>{item.prompts} prompts / {item.gold} gold / {item.avoid} avoid</p>
            <small>Prompt {item.averagePromptScore} / result {item.averageResultScore || "pending"}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function VisualEvidenceDashboardPanel({
  buildRuns,
  screenshots,
  visualAnalysisResult,
  visualRegression,
}: {
  buildRuns: BuildRunRecord[];
  screenshots: ScreenshotRecord[];
  visualAnalysisResult?: Record<string, unknown>;
  visualRegression: VisualRegressionReport;
}) {
  const missingScreenshots = buildRuns.filter((run) => !run.screenshotUrl).length;
  const failedRuns = buildRuns.filter((run) => run.status === "failed").length;
  const analysisSummary = visualAnalysisResult ? JSON.stringify(visualAnalysisResult, null, 2).slice(0, 800) : "Run pixel visual analyzer to populate screenshot diagnostics.";

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Gauge size={18} />
        <h2>Visual QA dashboard</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={visualRegression.score} label="Regression" />
        <div>
          <strong>Evidence health</strong>
          <p className="selected-meta">{visualRegression.notes[0]}</p>
        </div>
      </div>
      <div className="qa-grid">
        <article className="qa-card">
          <strong>{screenshots.length}</strong>
          <span>screenshots</span>
          <p>Desktop/mobile evidence imported or captured.</p>
        </article>
        <article className="qa-card">
          <strong>{missingScreenshots}</strong>
          <span>missing screenshots</span>
          <p>Runs that need a capture before being trusted.</p>
        </article>
        <article className="qa-card">
          <strong>{failedRuns}</strong>
          <span>failed runs</span>
          <p>Failures that should feed repair memory.</p>
        </article>
      </div>
      <div className="gate-check-grid">
        {visualRegression.checks.map((check) => (
          <article className="gate-check-card" data-pass={check.passed} key={check.label}>
            <strong>{check.label}</strong>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>
      <textarea className="generated-output mini-output" readOnly value={analysisSummary} />
    </section>
  );
}

function AutomatedVisualQaPanel({
  onRunAutomatedVisualQa,
  selectedPrompt,
  visualAnalysisResult,
  visualRegression,
}: {
  onRunAutomatedVisualQa: () => void;
  selectedPrompt?: PromptExample;
  visualAnalysisResult?: Record<string, unknown>;
  visualRegression: VisualRegressionReport;
}) {
  const latestScore = typeof visualAnalysisResult?.score === "number" ? Number(visualAnalysisResult.score) : visualRegression.score;
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Automated visual QA</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunAutomatedVisualQa} disabled={!selectedPrompt}>
          Run QA
        </button>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={latestScore} label="Auto QA" />
        <div>
          <strong>{selectedPrompt?.title || "No prompt selected"}</strong>
          <p className="selected-meta">Checks desktop/mobile screenshots, blank render, console errors, failed requests, media readiness, text clipping, overlap, and horizontal overflow.</p>
        </div>
      </div>
      <FeedbackList
        title="Automation notes"
        items={Array.isArray(visualAnalysisResult?.notes) ? visualAnalysisResult.notes.map(String) : visualRegression.notes}
        empty="Run automated visual QA against the selected result URL."
      />
    </section>
  );
}

function ProjectExportPackPanel({
  onExportProjectPack,
  projectExportPack,
}: {
  onExportProjectPack: () => void;
  projectExportPack: ProjectExportPack;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <PackageOpen size={18} />
          <h2>Project export pack</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onExportProjectPack}>
          <Download size={15} />
          Export pack
        </button>
      </div>
      <div className="memory-pack-grid">
        {projectExportPack.sections.map((section) => (
          <article className="index-card" key={section.title}>
            <strong>{section.count}</strong>
            <span>{section.title}</span>
          </article>
        ))}
      </div>
      <textarea className="generated-output mini-output" readOnly value={projectExportPack.markdown} />
    </section>
  );
}

function ExportPresetPanel({
  exportPresets,
  onCopy,
  onExportPreset,
}: {
  exportPresets: ExportPreset[];
  onCopy: (value: string, key: string) => void;
  onExportPreset: (preset: ExportPreset) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Download size={18} />
        <h2>Export presets</h2>
      </div>
      <div className="version-list compact-list">
        {exportPresets.map((preset) => (
          <article className="version-card" key={preset.id}>
            <strong>{preset.title}</strong>
            <span>{preset.target} / {preset.filename}</span>
            <p>{preset.summary}</p>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(preset.content, `export-${preset.id}`)}>Copy</button>
              <button className="primary-button compact-button" type="button" onClick={() => onExportPreset(preset)}>Export</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromptCoachPanel({
  coachInput,
  coachResult,
  onRunPromptCoach,
  promptCoach,
  setCoachInput,
}: {
  coachInput: string;
  coachResult?: Record<string, unknown>;
  onRunPromptCoach: () => void;
  promptCoach: PromptCoachReport;
  setCoachInput: (value: string) => void;
}) {
  const output = coachResult ? JSON.stringify(coachResult, null, 2) : promptCoach.rewrittenPrompt;
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Sparkles size={18} />
          <h2>Claude prompt coach</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunPromptCoach}>
          <Sparkles size={15} />
          Coach prompt
        </button>
      </div>
      <div className="coach-output-grid">
        <div>
          <Field label="Prompt to coach">
            <textarea value={coachInput} onChange={(event) => setCoachInput(event.target.value)} placeholder="Paste a website prompt, or leave empty to coach the selected/generated prompt." />
          </Field>
          <FeedbackList title="Coach diagnosis" items={promptCoach.diagnosis} empty="No diagnosis yet." />
          <FeedbackList title="Follow-up questions" items={promptCoach.questions} empty="No questions yet." />
        </div>
        <div>
          <div className="qa-score-row">
            <ScoreRing score={promptCoach.score} label="Coach" />
          </div>
          <textarea className="generated-output style-guide-output" readOnly value={output} />
        </div>
      </div>
    </section>
  );
}

function OneClickWizardPanel({
  copied,
  onCopy,
  onQueueWizard,
  onSave,
  setWizardIdea,
  wizardBattle,
  wizardCompiled,
  wizardIdea,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onQueueWizard: () => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  setWizardIdea: (value: string) => void;
  wizardBattle: PromptBattle;
  wizardCompiled: CompiledPrompt;
  wizardIdea: string;
}) {
  return (
    <section className="panel lab-panel wizard-panel">
      <div className="output-header">
        <div className="panel-header">
          <Wand2 size={18} />
          <h2>One-click great prompt flow</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(wizardCompiled.prompt, "wizard-prompt")}>
            {copied === "wizard-prompt" ? <Check size={15} /> : <Copy size={15} />}
            Copy
          </button>
          <button className="ghost-button compact-button" type="button" onClick={() => onSave("compiled", "One-click compiled prompt", wizardCompiled.prompt, wizardCompiled.score)}>
            <Save size={15} />
            Save
          </button>
          <button className="primary-button compact-button" type="button" onClick={onQueueWizard}>
            <Shuffle size={15} />
            Queue battle
          </button>
        </div>
      </div>
      <div className="wizard-grid">
        <div>
          <Field label="Rough website idea">
            <textarea value={wizardIdea} onChange={(event) => setWizardIdea(event.target.value)} />
          </Field>
          <div className="wizard-meta-grid">
            <article className="index-card">
              <strong>{wizardCompiled.score}</strong>
              <span>compiled score</span>
            </article>
            <article className="index-card">
              <strong>{wizardBattle.winner?.score ?? 0}</strong>
              <span>battle winner</span>
            </article>
          </div>
          <FeedbackList title="Compiler assumptions" items={wizardCompiled.assumptions} empty="No assumptions were needed." />
        </div>
        <div>
          <div className="winner-card">
            <span>Recommended variant</span>
            <strong>{wizardBattle.winner?.title ?? "No winner yet"}</strong>
            <p>{wizardBattle.explanation.join(" / ") || "The wizard will generate a battle winner after the idea is compiled."}</p>
          </div>
          <textarea className="generated-output mini-output" readOnly value={wizardCompiled.prompt} />
        </div>
      </div>
    </section>
  );
}

function DnaV2Panel({ dnaV2 }: { dnaV2: PromptDnaV2 }) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Gauge size={18} />
        <h2>Prompt DNA v2</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={dnaV2.overall} label="DNA v2" />
      </div>
      <div className="dna-v2-list">
        {dnaV2.dimensions.map((dimension) => (
          <article className="dna-v2-card" key={dimension.key}>
            <div className="dna-v2-topline">
              <strong>{dimension.label}</strong>
              <span data-tone={scoreTone(dimension.score)}>{dimension.score}</span>
            </div>
            <div className="bar">
              <i data-tone={scoreTone(dimension.score)} style={{ width: `${dimension.score}%` }} />
            </div>
            <p>{dimension.evidence.slice(0, 2).join(" / ") || "No strong evidence yet."}</p>
            <small>{dimension.fix}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function GoldenRecipesPanel({ goldenRecipes }: { goldenRecipes: GoldenRecipe[] }) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Trophy size={18} />
        <h2>Golden prompt recipes</h2>
      </div>
      <div className="recipe-list">
        {goldenRecipes.length ? (
          goldenRecipes.map((recipe) => (
            <article className="recipe-card" key={recipe.archetype}>
              <div className="dna-v2-topline">
                <strong>{recipe.archetype}</strong>
                <span data-tone={scoreTone(recipe.score)}>{recipe.score}</span>
              </div>
              <p>{recipe.recipe.slice(0, 4).join(" / ")}</p>
              <small>Examples: {recipe.examples.join(", ")}</small>
              {recipe.avoid.length ? <em>Avoid: {recipe.avoid.join(", ")}</em> : null}
            </article>
          ))
        ) : (
          <p className="selected-meta">Mark more prompts as gold to distill reusable recipes.</p>
        )}
      </div>
    </section>
  );
}

function PromptBattlePanel({
  copied,
  onCopy,
  onQueueBattle,
  onSave,
  promptBattle,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onQueueBattle: () => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  promptBattle: PromptBattle;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Shuffle size={18} />
          <h2>Prompt battle mode</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={onQueueBattle}>
            <Plus size={15} />
            Queue all
          </button>
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(promptBattle.winner.prompt, "battle-winner")}>
            {copied === "battle-winner" ? <Check size={15} /> : <Copy size={15} />}
            Copy winner
          </button>
          <button
            className="primary-button compact-button"
            type="button"
            onClick={() => onSave("tournament", promptBattle.winner.title, promptBattle.winner.prompt, promptBattle.winner.score)}
          >
            <Save size={15} />
            Save winner
          </button>
        </div>
      </div>
      <div className="winner-card">
        <span>Battle winner</span>
        <strong>{promptBattle.winner.title}</strong>
        <p>{promptBattle.explanation.join(" / ")}</p>
      </div>
      <div className="battle-list">
        {promptBattle.variants.map((variant) => (
          <article className="battle-card" key={variant.id}>
            <div className="dna-v2-topline">
              <strong>{variant.title}</strong>
              <span data-tone={scoreTone(variant.score)}>{variant.score}</span>
            </div>
            <p>{variant.intent}</p>
            <small>{promptBattle.queuePlan.find((item) => item.includes(variant.title)) ?? "Queue and compare this variant visually."}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function FailureRepairPanel({
  copied,
  onCopy,
  onSave,
  repairedPrompt,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  repairedPrompt: string;
}) {
  const score = evaluatePrompt(repairedPrompt).score;
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Failure memory auto-repair</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(repairedPrompt, "repair-prompt")}>
            {copied === "repair-prompt" ? <Check size={15} /> : <Copy size={15} />}
            Copy
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onSave("improved", "Failure-memory repaired prompt", repairedPrompt, score)}>
            <Save size={15} />
            Save
          </button>
        </div>
      </div>
      <p className="selected-meta">Injects safeguards learned from failed build runs, weak screenshots, and avoid-tagged outcomes.</p>
      <textarea className="generated-output style-guide-output" readOnly value={repairedPrompt} />
    </section>
  );
}

function DatasetVersionPanel({
  copied,
  datasetVersions,
  onCopy,
  onCreateDatasetVersion,
}: {
  copied: string;
  datasetVersions: DatasetVersion[];
  onCopy: (value: string, key: string) => void;
  onCreateDatasetVersion: () => void;
}) {
  const latestJson = JSON.stringify(datasetVersions[0] ?? {}, null, 2);
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Dataset versioning</h2>
        </div>
        <div className="button-row">
          <button className="primary-button compact-button" type="button" onClick={onCreateDatasetVersion}>
            <Plus size={15} />
            Create version
          </button>
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(latestJson, "dataset-version")} disabled={!datasetVersions.length}>
            {copied === "dataset-version" ? <Check size={15} /> : <Copy size={15} />}
            Copy latest
          </button>
        </div>
      </div>
      <div className="version-list">
        {datasetVersions.length ? (
          datasetVersions.map((version) => (
            <article className="version-card" key={version.id}>
              <strong>{version.label}</strong>
              <span>{version.scores.final} score / {version.counts.examples} prompts</span>
              <p>
                {version.counts.outcomes} outcomes, {version.counts.screenshots} screenshots, {version.counts.buildRuns} runs
              </p>
              <small>{new Date(version.createdAt).toLocaleString()}</small>
            </article>
          ))
        ) : (
          <p className="selected-meta">Create a snapshot before a major training batch so score changes are traceable.</p>
        )}
      </div>
    </section>
  );
}

function ModelProviderSettingsPanel({
  modelEnvStatus,
  modelSettings,
  onApplyProviderPreset,
  setModelSettings,
}: {
  modelEnvStatus?: Record<string, boolean>;
  modelSettings: {
    provider: string;
    endpoint: string;
    apiKey: string;
    model: string;
    temperature: number;
    agentCommand: string;
    buildCommand: string;
  };
  onApplyProviderPreset: (kind: "local" | "anthropic" | "openai-compatible" | "codex-agent" | "scaffold-build") => void;
  setModelSettings: Dispatch<
    SetStateAction<{
      provider: string;
      endpoint: string;
      apiKey: string;
      model: string;
      temperature: number;
      agentCommand: string;
      buildCommand: string;
    }>
  >;
}) {
  const statuses = [
    ["provider", modelSettings.provider],
    ["endpoint", Boolean(modelSettings.endpoint || modelEnvStatus?.endpointConfigured)],
    ["api key", Boolean(modelSettings.apiKey || modelEnvStatus?.apiKeyConfigured || modelEnvStatus?.anthropicApiKeyConfigured)],
    ["agent", Boolean(modelSettings.agentCommand || modelEnvStatus?.agentCommandConfigured)],
    ["build", Boolean(modelSettings.buildCommand || modelEnvStatus?.buildCommandConfigured)],
  ] as const;

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Sparkles size={18} />
        <h2>External model provider settings</h2>
      </div>
      <div className="env-status-grid">
        {statuses.map(([label, ready]) => (
          <span data-ready={ready} key={label}>
            {label}: {ready ? "ready" : "local"}
          </span>
        ))}
      </div>
      <div className="provider-preset-row">
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("local")}>Local fallback</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("anthropic")}>Claude native</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("openai-compatible")}>OpenAI-compatible</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("codex-agent")}>Codex agent</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("scaffold-build")}>Scaffold build</button>
      </div>
      <Field label="Provider">
        <select
          value={modelSettings.provider}
          onChange={(event) => setModelSettings((current) => ({ ...current, provider: event.target.value }))}
        >
          <option value="local">Local fallback</option>
          <option value="anthropic">Claude native</option>
          <option value="openai-compatible">OpenAI-compatible</option>
          <option value="custom">Custom JSON endpoint</option>
        </select>
      </Field>
      <Field label="Model endpoint">
        <input
          value={modelSettings.endpoint}
          onChange={(event) => setModelSettings((current) => ({ ...current, endpoint: event.target.value }))}
          placeholder="https://api.example.com/evaluate"
        />
      </Field>
      <div className="two-field-grid">
        <Field label="API key">
          <input
            type="password"
            value={modelSettings.apiKey}
            onChange={(event) => setModelSettings((current) => ({ ...current, apiKey: event.target.value }))}
            placeholder="Optional; stored only in browser state"
          />
        </Field>
        <Field label="Model">
          <input
            value={modelSettings.model}
            onChange={(event) => setModelSettings((current) => ({ ...current, model: event.target.value }))}
            placeholder="gpt-5"
          />
        </Field>
      </div>
      <Field label="Temperature">
        <input
          max={1}
          min={0}
          step={0.05}
          type="number"
          value={modelSettings.temperature}
          onChange={(event) => setModelSettings((current) => ({ ...current, temperature: Number(event.target.value) }))}
        />
      </Field>
      <Field label="Agent command for queue runner">
        <input
          value={modelSettings.agentCommand}
          onChange={(event) => setModelSettings((current) => ({ ...current, agentCommand: event.target.value }))}
          placeholder="codex exec --full-auto --prompt-file codex-task.md"
        />
      </Field>
      <Field label="Build command override">
        <input
          value={modelSettings.buildCommand}
          onChange={(event) => setModelSettings((current) => ({ ...current, buildCommand: event.target.value }))}
          placeholder="npm run build"
        />
      </Field>
    </section>
  );
}

function VisualAnalyzerPanel({
  onAnalyzeSelectedVisuals,
  visualAnalysisResult,
}: {
  onAnalyzeSelectedVisuals: () => void;
  visualAnalysisResult?: Record<string, unknown>;
}) {
  const output = visualAnalysisResult
    ? JSON.stringify(visualAnalysisResult, null, 2)
    : "Capture or import screenshots, then run pixel analysis to catch blank, low-contrast, or low-detail renders.";

  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <FileText size={18} />
          <h2>Pixel visual analyzer</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onAnalyzeSelectedVisuals}>
          <Gauge size={15} />
          Analyze selected screenshots
        </button>
      </div>
      <textarea className="generated-output mini-output" readOnly value={output} />
    </section>
  );
}

function ResultImporterPanel({
  onImportResultJson,
  resultImportText,
  setResultImportText,
}: {
  onImportResultJson: () => void;
  resultImportText: string;
  setResultImportText: (value: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Download size={18} />
        <h2>Automatic result importer</h2>
      </div>
      <Field label="queue-result.json">
        <textarea
          value={resultImportText}
          onChange={(event) => setResultImportText(event.target.value)}
          placeholder="Paste queue-result.json here to create a build run, screenshot, lineage node, and failure memory."
        />
      </Field>
      <button className="primary-button wide-button" type="button" onClick={onImportResultJson} disabled={!resultImportText.trim()}>
        <Upload size={15} />
        Import result
      </button>
    </section>
  );
}

function TrainingSnapshotPanel({
  copied,
  onCopy,
  onExportTrainingSnapshot,
  onImportTrainingSnapshot,
  queueExport,
  scoreWeights,
  setSnapshotImportText,
  snapshotImportText,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onExportTrainingSnapshot: () => void;
  onImportTrainingSnapshot: () => void;
  queueExport: string;
  scoreWeights: Record<string, number>;
  setSnapshotImportText: (value: string) => void;
  snapshotImportText: string;
}) {
  const weightsText = JSON.stringify(scoreWeights, null, 2);
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Archive size={18} />
        <h2>Training snapshot export</h2>
      </div>
      <p className="selected-meta">Exports corpus, outcomes, runs, lineage, scoring weights, failure memory, and installed skill content when API is online.</p>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onExportTrainingSnapshot}>
          <Download size={15} />
          Export snapshot
        </button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(queueExport, "snapshot-queue")}>
          {copied === "snapshot-queue" ? <Check size={15} /> : <Copy size={15} />}
          Copy queue
        </button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(weightsText, "score-weights")}>
          {copied === "score-weights" ? <Check size={15} /> : <Copy size={15} />}
          Copy weights
        </button>
      </div>
      <Field label="Restore snapshot JSON">
        <textarea
          value={snapshotImportText}
          onChange={(event) => setSnapshotImportText(event.target.value)}
          placeholder="Paste a Prompt Atelier training snapshot to restore prompts, outcomes, runs, lineage, dataset versions, and scoring weights."
        />
      </Field>
      <button className="ghost-button wide-button" type="button" onClick={onImportTrainingSnapshot} disabled={!snapshotImportText.trim()}>
        <Upload size={15} />
        Restore snapshot
      </button>
      <textarea className="generated-output mini-output" readOnly value={weightsText} />
    </section>
  );
}

function PromptMemoryPanel({
  copied,
  onCopy,
  onDownload,
  promptMemory,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  promptMemory: PromptMemoryExport;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <BookOpen size={18} />
          <h2>Prompt memory compiler</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(promptMemory.markdown, "prompt-memory-md")}>
            {copied === "prompt-memory-md" ? <Check size={15} /> : <Copy size={15} />}
            Copy MD
          </button>
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(promptMemory.json, "prompt-memory-json")}>
            {copied === "prompt-memory-json" ? <Check size={15} /> : <Copy size={15} />}
            Copy JSON
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onDownload("website-prompt-memory.md", promptMemory.markdown, "text/markdown")}>
            <Download size={15} />
            Download
          </button>
        </div>
      </div>
      <div className="memory-section-grid">
        {promptMemory.sections.slice(0, 6).map((section) => (
          <article className="index-card wide-index-card" key={section.title}>
            <h3>{section.title}</h3>
            <p>{section.items.slice(0, 4).join(" / ") || "No signal learned yet."}</p>
          </article>
        ))}
      </div>
      <textarea className="generated-output mini-output" readOnly value={promptMemory.markdown} />
    </section>
  );
}

function ModelIntegrationPanel({
  modelEvaluation,
  modelNotice,
  onModelEvaluate,
  selectedPrompt,
}: {
  modelEvaluation?: Record<string, unknown>;
  modelNotice: string;
  onModelEvaluate: () => void;
  selectedPrompt?: PromptExample;
}) {
  const resultText = modelEvaluation ? JSON.stringify(modelEvaluation, null, 2) : "No model evaluation yet.";
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Sparkles size={18} />
        <h2>Model integration</h2>
      </div>
      <p className="selected-meta">
        Sends the selected prompt plus compiled memory to the local API. Set <code>PROMPT_LAB_MODEL_ENDPOINT</code> for an external evaluator; otherwise it uses a local fallback.
      </p>
      <button className="primary-button wide-button" type="button" onClick={onModelEvaluate} disabled={!selectedPrompt}>
        <Sparkles size={15} />
        Evaluate selected prompt
      </button>
      <p className="selected-meta">{modelNotice}</p>
      <textarea className="generated-output mini-output" readOnly value={resultText} />
    </section>
  );
}

function PromptResultComparisonPanel({
  buildRuns,
  diffLeftId,
  diffRightId,
  examples,
  screenshots,
  scoreWeights,
  setDiffLeftId,
  setDiffRightId,
}: {
  buildRuns: BuildRunRecord[];
  diffLeftId: string;
  diffRightId: string;
  examples: PromptExample[];
  screenshots: ScreenshotRecord[];
  scoreWeights: ScoreWeights;
  setDiffLeftId: (id: string) => void;
  setDiffRightId: (id: string) => void;
}) {
  const left = examples.find((example) => example.id === diffLeftId) ?? examples[0];
  const right = examples.find((example) => example.id === diffRightId) ?? examples[1] ?? examples[0];
  const cards = [left, right].filter(Boolean).map((example) => {
    const shot = screenshots.find((item) => item.promptId === example.id);
    const run = buildRuns.find((item) => item.promptId === example.id);
    const promptScore = evaluatePrompt(example.text).score;
    const visualScore = auditVisualPrompt(example.text).score;
    const resultScore = scoreResultArtifact(example, shot, run).score;
    const weightedTotal =
      (promptScore * (scoreWeights.exactness ?? 18) +
        visualScore * (scoreWeights.visualTaste ?? 22) +
        resultScore * (scoreWeights.outcomes ?? 28) +
        (shot ? 86 : 42) * (scoreWeights.mobile ?? 10)) /
      Math.max(1, (scoreWeights.exactness ?? 18) + (scoreWeights.visualTaste ?? 22) + (scoreWeights.outcomes ?? 28) + (scoreWeights.mobile ?? 10));
    return {
      example,
      run,
      score: Math.round(weightedTotal),
      shot,
      promptScore,
      resultScore,
      visualScore,
    };
  });

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <FileText size={18} />
        <h2>Prompt/result comparison</h2>
      </div>
      <div className="compare-selectors">
        <Field label="Prompt A">
          <select value={left?.id ?? ""} onChange={(event) => setDiffLeftId(event.target.value)}>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>{example.title}</option>
            ))}
          </select>
        </Field>
        <Field label="Prompt B">
          <select value={right?.id ?? ""} onChange={(event) => setDiffRightId(event.target.value)}>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>{example.title}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="comparison-grid result-comparison-grid">
        {cards.map((card) => (
          <article className="comparison-card" key={card.example.id}>
            {card.shot?.url && /^(https?:|data:|\/)/.test(card.shot.url) ? <img src={card.shot.url} alt={card.shot.title} /> : <div className="empty-shot">No screenshot yet</div>}
            <strong>{card.example.title}</strong>
            <span>{card.score} weighted / {card.resultScore} result</span>
            <p>Prompt {card.promptScore} / Visual {card.visualScore} / {card.run?.status ?? "not run"}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function VisualComparisonPanel({
  buildRuns,
  screenshots,
  selectedPrompt,
}: {
  buildRuns: BuildRunRecord[];
  screenshots: ScreenshotRecord[];
  selectedPrompt?: PromptExample;
}) {
  const promptScreenshots = screenshots.filter((item) => !selectedPrompt || item.promptId === selectedPrompt.id).slice(0, 4);
  const promptRuns = buildRuns.filter((run) => !selectedPrompt || run.promptId === selectedPrompt.id).slice(0, 4);
  const cards = promptScreenshots.length
    ? promptScreenshots.map((shot) => ({ title: shot.title, image: shot.url, meta: shot.rating, detail: shot.notes }))
    : promptRuns.map((run) => ({ title: run.promptTitle, image: run.screenshotUrl, meta: `${run.score} score`, detail: run.notes || run.resultUrl }));

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <FileText size={18} />
        <h2>Visual comparison gallery</h2>
      </div>
      <div className="comparison-grid">
        {cards.length ? (
          cards.map((card) => (
            <article className="comparison-card" key={`${card.title}-${card.image}`}>
              {card.image && /^(https?:|data:|\/)/.test(card.image) ? <img src={card.image} alt={card.title} /> : <div className="empty-shot">No renderable image</div>}
              <strong>{card.title}</strong>
              <span>{card.meta}</span>
              <p>{card.detail || "No notes yet."}</p>
            </article>
          ))
        ) : (
          <p className="selected-meta">Import queue results or add screenshots to compare finalist outputs.</p>
        )}
      </div>
    </section>
  );
}

function RunTimelinePanel({
  buildRuns,
  lineage,
  queueJobs,
  screenshots,
}: {
  buildRuns: BuildRunRecord[];
  lineage: PromptLineageNode[];
  queueJobs: BuildQueueJob[];
  screenshots: ScreenshotRecord[];
}) {
  const events = [
    ...queueJobs.map((job) => ({ time: job.updatedAt, title: job.variantTitle, status: job.status, detail: job.runFolder })),
    ...buildRuns.map((run) => ({ time: run.updatedAt, title: run.promptTitle, status: run.status, detail: run.resultUrl || run.folderPath })),
    ...screenshots.map((shot) => ({ time: shot.createdAt, title: shot.title, status: shot.rating, detail: shot.notes })),
    ...lineage.map((node) => ({ time: node.createdAt, title: node.title, status: node.kind, detail: node.detail })),
  ]
    .sort((a, b) => Date.parse(b.time) - Date.parse(a.time))
    .slice(0, 10);

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <ListChecks size={18} />
        <h2>Run timeline</h2>
      </div>
      <div className="timeline-list">
        {events.length ? (
          events.map((event) => (
            <article className="timeline-card" key={`${event.time}-${event.title}-${event.status}`}>
              <span>{event.status}</span>
              <div>
                <strong>{event.title}</strong>
                <p>{event.detail || "No detail."}</p>
                <small>{new Date(event.time).toLocaleString()}</small>
              </div>
            </article>
          ))
        ) : (
          <p className="selected-meta">The run timeline will fill as jobs are queued, built, captured, scored, and trained.</p>
        )}
      </div>
    </section>
  );
}

function ScoringWeightPanel({
  scoreWeights,
  setScoreWeights,
}: {
  scoreWeights: ScoreWeights;
  setScoreWeights: Dispatch<SetStateAction<ScoreWeights>>;
}) {
  function update(key: string, value: number) {
    setScoreWeights((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <SlidersHorizontal size={18} />
        <h2>Scoring weight editor</h2>
      </div>
      {Object.entries(scoreWeights).map(([key, value]) => (
        <label className="slider-field" key={key}>
          <span>
            {key}
            <strong>{value}</strong>
          </span>
          <input min={0} max={40} type="range" value={value} onChange={(event) => update(key, Number(event.target.value))} />
        </label>
      ))}
      <p className="selected-meta">Weights are stored in exported training snapshots and can guide future scoring model tuning.</p>
    </section>
  );
}

function BuildQueuePanel({
  copied,
  onCopy,
  onExportQueue,
  onQueueTournament,
  onRemoveQueueJob,
  queueExport,
  queueJobs,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onExportQueue: () => void;
  onQueueTournament: () => void;
  onRemoveQueueJob: (id: string) => void;
  queueExport: string;
  queueJobs: BuildQueueJob[];
}) {
  return (
    <section className="panel lab-panel" data-train-section="queue">
      <div className="panel-header">
        <Hammer size={18} />
        <h2>Autonomous run queue</h2>
      </div>
      <p className="selected-meta">Queue tournament finalists, export the queue, then process it with the local runner.</p>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onQueueTournament}>
          <Plus size={15} />
          Run Tournament
        </button>
        <button className="ghost-button compact-button" type="button" onClick={onExportQueue} disabled={!queueJobs.length}>
          <Download size={15} />
          Export queue
        </button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(queueExport, "queue-json")} disabled={!queueJobs.length}>
          {copied === "queue-json" ? <Check size={15} /> : <Copy size={15} />}
          Copy JSON
        </button>
      </div>
      <div className="command-box">
        <code>npm run run:queue -- --queue prompt-lab-queue.json --scaffold</code>
      </div>
      <div className="queue-list">
        {queueJobs.length ? (
          queueJobs.slice(0, 8).map((job) => (
            <article className="queue-card" key={job.id}>
              <div>
                <strong>{job.variantTitle}</strong>
                <span>{job.status} / {job.score} score</span>
              </div>
              <p>{job.runFolder}</p>
              <button className="icon-button danger" type="button" onClick={() => onRemoveQueueJob(job.id)} aria-label={`Remove ${job.variantTitle}`}>
                <Trash2 size={14} />
              </button>
            </article>
          ))
        ) : (
          <p className="selected-meta">No queued jobs yet. Use Run Tournament to queue the top two finalists.</p>
        )}
      </div>
    </section>
  );
}

function PromptLineagePanel({ lineage }: { lineage: PromptLineageNode[] }) {
  return (
    <section className="panel lab-panel" data-train-section="lineage">
      <div className="panel-header">
        <Archive size={18} />
        <h2>Prompt lineage tree</h2>
      </div>
      <div className="lineage-list">
        {lineage.length ? (
          lineage.map((node) => (
            <article className="lineage-card" data-kind={node.kind} key={node.id}>
              <span>{node.kind}</span>
              <div>
                <strong>{node.title}</strong>
                <p>{node.detail}</p>
                <small>{node.status} / {node.score} score</small>
              </div>
            </article>
          ))
        ) : (
          <p className="selected-meta">No lineage yet. Save a version, queue a tournament, or record a build result.</p>
        )}
      </div>
    </section>
  );
}

function ScoreModelPanel({ scoreBreakdown }: { scoreBreakdown: ScoreBreakdown }) {
  const rows = [
    ["Prompt quality", scoreBreakdown.promptQuality],
    ["Predicted build", scoreBreakdown.predictedBuild],
    ["Actual result", scoreBreakdown.actualResult],
    ["Visual taste", scoreBreakdown.visualTaste],
    ["Failure risk", scoreBreakdown.failureRisk],
  ] as const;

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Gauge size={18} />
        <h2>Five-part scoring model</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={scoreBreakdown.finalScore} label="Final score" />
      </div>
      <div className="score-list compact">
        {rows.map(([label, score]) => (
          <div className="score-row" key={label}>
            <span>{label}</span>
            <div className="bar">
              <i data-tone={scoreTone(label === "Failure risk" ? 100 - score : score)} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
            </div>
            <strong>{score}</strong>
          </div>
        ))}
      </div>
      <FeedbackList title="Score notes" items={scoreBreakdown.notes} empty="No scoring notes." />
    </section>
  );
}

function VectorSearchPanel({
  onSelectPrompt,
  query,
  results,
  setQuery,
}: {
  onSelectPrompt: (id: string) => void;
  query: string;
  results: VectorSearchResult[];
  setQuery: (value: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Search size={18} />
        <h2>Vector prompt search</h2>
      </div>
      <Field label="Embedding-style query">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Example: premium video hero with exact responsive rules, result screenshots, and failure-proof assets"
        />
      </Field>
      <div className="search-results">
        {results.length ? (
          results.map((result) => (
            <button className="result-card" key={result.example.id} type="button" onClick={() => onSelectPrompt(result.example.id)}>
              <strong>{result.example.title}</strong>
              <span>{result.score}% vector match</span>
              <p>{result.reasons.join(" / ") || "Dense local vector overlap"}</p>
            </button>
          ))
        ) : (
          <p className="selected-meta">Type an intent to search the local hashed embedding index.</p>
        )}
      </div>
    </section>
  );
}

function BuildRunPanel({
  buildRuns,
  copied,
  onAddBuildRun,
  onCopy,
  onDownload,
  onRemoveBuildRun,
  onSave,
  runnerPlan,
  selectedPrompt,
}: {
  buildRuns: BuildRunRecord[];
  copied: string;
  onAddBuildRun: (prompt: PromptExample, fields: Omit<BuildRunRecord, "id" | "promptId" | "promptTitle" | "promptText" | "score" | "failureCategories" | "createdAt" | "updatedAt">) => void;
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  onRemoveBuildRun: (id: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  runnerPlan?: BuildRunnerPlan;
  selectedPrompt?: PromptExample;
}) {
  const [status, setStatus] = useState<BuildStatus>("planned");
  const [resultUrl, setResultUrl] = useState("");
  const [folderPath, setFolderPath] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [filesChanged, setFilesChanged] = useState("");
  const [errors, setErrors] = useState("");
  const [notes, setNotes] = useState("");
  const handoff = selectedPrompt
    ? createBuildRunHandoff(selectedPrompt, { status, resultUrl, folderPath, screenshotUrl, filesChanged, errors, notes })
    : "";
  const command = selectedPrompt
    ? `npm run run:prompt -- --prompt-file ./prompt.md --title "${selectedPrompt.title.replace(/"/g, "'")}"`
    : "Select a prompt first";
  const visibleRuns = selectedPrompt
    ? buildRuns.filter((run) => run.promptId === selectedPrompt.id).slice(0, 5)
    : buildRuns.slice(0, 5);

  function addRun() {
    if (!selectedPrompt) return;
    onAddBuildRun(selectedPrompt, {
      status,
      resultUrl,
      folderPath,
      screenshotUrl,
      filesChanged,
      errors,
      notes,
    });
    setResultUrl("");
    setFolderPath("");
    setScreenshotUrl("");
    setFilesChanged("");
    setErrors("");
    setNotes("");
    setStatus("planned");
  }

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Hammer size={18} />
        <h2>Prompt-to-result build runs</h2>
      </div>
      <p className="selected-meta">{selectedPrompt ? selectedPrompt.title : "Select a prompt to create a build run."}</p>
      <div className="command-box">
        <code>{command}</code>
      </div>
      {runnerPlan ? (
        <div className="automation-steps">
          {runnerPlan.commands.map((item, index) => (
            <article className="automation-step" key={item.label}>
              <span>{index + 1}</span>
              <div>
                <strong>{item.label}</strong>
                <code>{item.command}</code>
              </div>
              <button className="icon-button" type="button" onClick={() => onCopy(item.command, `runner-${index}`)} aria-label={`Copy ${item.label}`}>
                {copied === `runner-${index}` ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </article>
          ))}
        </div>
      ) : null}
      <div className="button-row">
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(runnerPlan?.handoff ?? handoff, "build-handoff")} disabled={!selectedPrompt}>
          {copied === "build-handoff" ? <Check size={15} /> : <Copy size={15} />}
          Copy handoff
        </button>
        <button className="ghost-button compact-button" type="button" onClick={() => onDownload("prompt-build-run.md", runnerPlan?.handoff ?? handoff, "text/markdown")} disabled={!selectedPrompt}>
          <Download size={15} />
          Download handoff
        </button>
        <button className="ghost-button compact-button" type="button" onClick={() => onSave("build-run", "Prompt build run handoff", handoff)} disabled={!selectedPrompt}>
          <Save size={15} />
          Save
        </button>
      </div>
      <div className="two-field-grid">
        <Field label="Status">
          <select value={status} onChange={(event) => setStatus(event.target.value as BuildStatus)}>
            {buildStatusOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Result URL">
          <input value={resultUrl} onChange={(event) => setResultUrl(event.target.value)} placeholder="http://127.0.0.1:3000" />
        </Field>
      </div>
      <Field label="Folder path">
        <input value={folderPath} onChange={(event) => setFolderPath(event.target.value)} placeholder="/Users/program/Documents/Prompts/prompt-runs/..." />
      </Field>
      <Field label="Screenshot URL/path">
        <input value={screenshotUrl} onChange={(event) => setScreenshotUrl(event.target.value)} placeholder="screenshot path or image URL" />
      </Field>
      <Field label="Files changed">
        <textarea value={filesChanged} onChange={(event) => setFilesChanged(event.target.value)} placeholder="src/App.tsx, src/styles.css..." />
      </Field>
      <Field label="Errors">
        <textarea value={errors} onChange={(event) => setErrors(event.target.value)} placeholder="Console, build, TypeScript, or visual issues." />
      </Field>
      <Field label="Notes">
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What did the prompt/result teach us?" />
      </Field>
      <button className="primary-button wide-button" type="button" onClick={addRun} disabled={!selectedPrompt}>
        <Plus size={15} />
        Record build run
      </button>
      <div className="run-list">
        {visibleRuns.length ? (
          visibleRuns.map((run) => (
            <article className="run-card" key={run.id}>
              <div>
                <strong>{run.promptTitle}</strong>
                <span>
                  {run.status} / {run.score} score
                </span>
              </div>
              <p>{run.resultUrl || run.folderPath || "No URL/folder recorded yet."}</p>
              {run.failureCategories.length ? <p>Failures: {run.failureCategories.join(", ")}</p> : null}
              <button className="icon-button danger" type="button" onClick={() => onRemoveBuildRun(run.id)} aria-label={`Remove ${run.promptTitle}`}>
                <Trash2 size={14} />
              </button>
            </article>
          ))
        ) : (
          <p className="selected-meta">No build runs recorded for this prompt yet.</p>
        )}
      </div>
    </section>
  );
}

function ResultScorePanel({ resultScore }: { resultScore: ResultScore }) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Gauge size={18} />
        <h2>Automatic result scoring</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={resultScore.score} label="Result score" />
      </div>
      <div className="qa-grid">
        {resultScore.checks.map((check) => (
          <article className="qa-card" key={check.label}>
            <strong>{check.label}</strong>
            <span>{check.score}</span>
            <p>{check.notes[0]}</p>
          </article>
        ))}
      </div>
      <div className="feedback-list">
        <h3>
          <AlertTriangle size={15} />
          Failure taxonomy
        </h3>
        {resultScore.failureCategories.length ? (
          resultScore.failureCategories.map((item) => (
            <p key={item}>
              <AlertTriangle size={14} />
              {item}
            </p>
          ))
        ) : (
          <em>No failure categories detected.</em>
        )}
      </div>
      <FeedbackList title="Next scoring actions" items={resultScore.recommendations} empty="No scoring actions needed." />
    </section>
  );
}

function ScreenshotQaPanel({
  copied,
  onCopy,
  screenshotQa,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  screenshotQa: ScreenshotQaReport;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <FileText size={18} />
        <h2>Screenshot capture and visual scoring</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={screenshotQa.score} label="Capture QA" />
      </div>
      <div className="automation-steps">
        {screenshotQa.captureCommands.map((command, index) => (
          <article className="automation-step" key={command}>
            <span>{index + 1}</span>
            <div>
              <strong>{index === 0 ? "Default capture" : "Explicit viewports"}</strong>
              <code>{command}</code>
            </div>
            <button className="icon-button" type="button" onClick={() => onCopy(command, `capture-${index}`)} aria-label="Copy capture command">
              {copied === `capture-${index}` ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </article>
        ))}
      </div>
      <div className="qa-grid">
        {screenshotQa.items.map((item) => (
          <article className="qa-card" key={item.label}>
            <strong>{item.label}</strong>
            <span>{item.score}</span>
            <p>{item.notes[0]}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Capture notes" items={screenshotQa.notes} empty="No screenshot notes." />
    </section>
  );
}

function DnaCalibrationPanel({
  dnaCalibration,
  onSelectPrompt,
}: {
  dnaCalibration: DnaCalibrationReport;
  onSelectPrompt: (id: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Gauge size={18} />
        <h2>Prompt DNA calibration</h2>
      </div>
      <div className="index-grid">
        <article className="index-card">
          <strong>{dnaCalibration.predictedAverage || 0}</strong>
          <span>predicted avg</span>
        </article>
        <article className="index-card">
          <strong>{dnaCalibration.actualAverage || 0}</strong>
          <span>actual avg</span>
        </article>
        <article className="index-card">
          <strong>{dnaCalibration.correlation}</strong>
          <span>correlation</span>
        </article>
        <article className="index-card">
          <strong>{dnaCalibration.calibratedScore || 0}</strong>
          <span>calibrated DNA</span>
        </article>
      </div>
      <FeedbackList title="Calibration insights" items={dnaCalibration.insights} empty="No calibration insights yet." />
      <div className="leaderboard-list compact-list">
        {dnaCalibration.rows.slice(0, 6).map((row) => (
          <button className="leaderboard-card" key={row.promptId} type="button" onClick={() => onSelectPrompt(row.promptId)}>
            <span className="rank-badge">{row.delta >= 0 ? "+" : "-"}</span>
            <div>
              <strong>{row.title}</strong>
              <p>
                Predicted {row.predicted} / Actual {row.actual}
              </p>
            </div>
            <em>{row.delta >= 0 ? `+${row.delta}` : row.delta}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

function CorpusCleaningPanel({
  corpusCleaning,
  onSelectPrompt,
}: {
  corpusCleaning: CorpusCleaningReport;
  onSelectPrompt: (id: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Archive size={18} />
        <h2>Corpus cleaning dashboard</h2>
      </div>
      <div className="index-grid">
        <article className="index-card">
          <strong>{corpusCleaning.exactDuplicates.length}</strong>
          <span>exact duplicate groups</span>
        </article>
        <article className="index-card">
          <strong>{corpusCleaning.nearDuplicates.length}</strong>
          <span>near duplicate groups</span>
        </article>
        <article className="index-card">
          <strong>{corpusCleaning.weakPrompts.length}</strong>
          <span>weak/quarantine</span>
        </article>
        <article className="index-card">
          <strong>{corpusCleaning.archetypeBalance.filter((item) => item.status === "dominant").length}</strong>
          <span>dominant archetypes</span>
        </article>
      </div>
      <FeedbackList title="Cleaning recommendations" items={corpusCleaning.recommendations} empty="Corpus looks clean." />
      <div className="cleaning-list">
        {corpusCleaning.weakPrompts.slice(0, 6).map((item) => (
          <button className="result-card" key={item.example.id} type="button" onClick={() => onSelectPrompt(item.example.id)}>
            <strong>{item.example.title}</strong>
            <span>{item.score} evaluator score</span>
            <p>{item.reasons.join(" / ")}</p>
          </button>
        ))}
      </div>
      <div className="feature-list balance-list">
        {corpusCleaning.archetypeBalance.slice(0, 10).map((item) => (
          <span data-status={item.status} key={item.label}>
            {item.label}
            <small>{item.count}</small>
          </span>
        ))}
      </div>
    </section>
  );
}

function FailureMemoryPanel({
  copied,
  failureMemory,
  onCopy,
}: {
  copied: string;
  failureMemory: FailureMemoryReport;
  onCopy: (value: string, key: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <AlertTriangle size={18} />
        <h2>Result failure memory</h2>
      </div>
      <div className="button-row">
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(failureMemory.promptPatch, "failure-patch")}>
          {copied === "failure-patch" ? <Check size={15} /> : <Copy size={15} />}
          Copy patch
        </button>
      </div>
      <div className="failure-list">
        {failureMemory.categories.length ? (
          failureMemory.categories.map((item) => (
            <article className="failure-card" key={item.category}>
              <div>
                <strong>{item.category}</strong>
                <span>{item.count} hits / severity {item.severity}</span>
              </div>
              <p>{item.fix}</p>
              {item.prompts.length ? <small>{item.prompts.join(" / ")}</small> : null}
            </article>
          ))
        ) : (
          <p className="selected-meta">No recorded failures yet. The default memory still guards common website build risks.</p>
        )}
      </div>
      <FeedbackList title="Avoid rules" items={failureMemory.avoidRules} empty="No avoid rules yet." />
    </section>
  );
}

function PromptCompilerPanel({
  compiledPrompt,
  compilerInput,
  copied,
  onCopy,
  onSave,
  setCompilerInput,
}: {
  compiledPrompt: CompiledPrompt;
  compilerInput: PromptCompilerInput;
  copied: string;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  setCompilerInput: Dispatch<SetStateAction<PromptCompilerInput>>;
}) {
  function update<K extends keyof PromptCompilerInput>(key: K, value: PromptCompilerInput[K]) {
    setCompilerInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Wand2 size={18} />
        <h2>Prompt compiler</h2>
      </div>
      <Field label="Rough idea">
        <textarea value={compilerInput.roughIdea} onChange={(event) => update("roughIdea", event.target.value)} />
      </Field>
      <div className="two-field-grid">
        <Field label="Brand">
          <input value={compilerInput.brandName} onChange={(event) => update("brandName", event.target.value)} />
        </Field>
        <Field label="Site type">
          <input value={compilerInput.siteType} onChange={(event) => update("siteType", event.target.value)} />
        </Field>
      </div>
      <Field label="Audience">
        <input value={compilerInput.audience} onChange={(event) => update("audience", event.target.value)} />
      </Field>
      <Field label="Visual direction">
        <textarea value={compilerInput.visualDirection} onChange={(event) => update("visualDirection", event.target.value)} />
      </Field>
      <div className="two-field-grid">
        <Field label="Stack">
          <textarea value={compilerInput.stack} onChange={(event) => update("stack", event.target.value)} />
        </Field>
        <Field label="Assets">
          <textarea value={compilerInput.assets} onChange={(event) => update("assets", event.target.value)} />
        </Field>
      </div>
      <Field label="Constraints">
        <textarea value={compilerInput.constraints} onChange={(event) => update("constraints", event.target.value)} />
      </Field>
      <div className="output-header">
        <div>
          <h3>Compiled build prompt</h3>
          <p className="selected-meta">{compiledPrompt.score} score / {compiledPrompt.sections.length} sections</p>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(compiledPrompt.prompt, "compiled")}>
            {copied === "compiled" ? <Check size={15} /> : <Copy size={15} />}
            Copy
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onSave("compiled", `${compilerInput.brandName || "Compiled"} prompt`, compiledPrompt.prompt, compiledPrompt.score)}>
            <Save size={15} />
            Save
          </button>
        </div>
      </div>
      <FeedbackList title="Compiler assumptions" items={compiledPrompt.assumptions} empty="No assumptions; the brief is explicit." />
      <textarea className="generated-output small-output" readOnly value={compiledPrompt.prompt} />
    </section>
  );
}

function TournamentPanel({
  copied,
  onCopy,
  onSave,
  tournament,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  tournament: PromptTournament;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Trophy size={18} />
        <h2>A/B prompt tournament</h2>
      </div>
      <article className="winner-card">
        <span>Recommended winner</span>
        <strong>{tournament.recommendation.title}</strong>
        <p>{tournament.recommendation.intent}</p>
        <em>{tournament.recommendation.score}</em>
      </article>
      <div className="button-row">
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(tournament.recommendation.prompt, "tournament-winner")}>
          {copied === "tournament-winner" ? <Check size={15} /> : <Copy size={15} />}
          Copy winner
        </button>
        <button
          className="primary-button compact-button"
          type="button"
          onClick={() => onSave("tournament", tournament.recommendation.title, tournament.recommendation.prompt, tournament.recommendation.score)}
        >
          <Save size={15} />
          Save winner
        </button>
      </div>
      <div className="mutation-list">
        {tournament.finalists.map((variant) => (
          <article className="mutation-card" key={variant.id}>
            <div className="output-header">
              <div>
                <strong>{variant.title}</strong>
                <span>{variant.intent}</span>
              </div>
              <div className="diff-score">
                <strong>{variant.score}</strong>
                <span>score</span>
              </div>
            </div>
            <textarea className="generated-output small-output" readOnly value={variant.prompt} />
          </article>
        ))}
      </div>
      <FeedbackList title="Tournament notes" items={tournament.scoringNotes} empty="No tournament notes." />
    </section>
  );
}

function OutcomePanel({
  outcomes,
  outcomeSummary,
  onUpdateOutcome,
  selectedPrompt,
}: {
  outcomes: OutcomeRecord[];
  outcomeSummary: OutcomeSummary;
  onUpdateOutcome: (prompt: PromptExample, patch: Partial<Pick<OutcomeRecord, "rating" | "status" | "notes">>) => void;
  selectedPrompt?: PromptExample;
}) {
  const selectedOutcome = outcomes.find((outcome) => outcome.promptId === selectedPrompt?.id);

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Sparkles size={18} />
        <h2>Outcome tracking and gold set</h2>
      </div>
      {selectedPrompt ? (
        <>
          <p className="selected-meta">{selectedPrompt.title}</p>
          <div className="two-field-grid">
            <Field label="Built result">
              <select
                value={selectedOutcome?.rating ?? "unrated"}
                onChange={(event) => onUpdateOutcome(selectedPrompt, { rating: event.target.value as OutcomeRecord["rating"] })}
              >
                {ratingOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Training status">
              <select
                value={selectedOutcome?.status ?? "unrated"}
                onChange={(event) => onUpdateOutcome(selectedPrompt, { status: event.target.value as OutcomeRecord["status"] })}
              >
                {statusOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Outcome notes">
            <textarea
              value={selectedOutcome?.notes ?? ""}
              onChange={(event) => onUpdateOutcome(selectedPrompt, { notes: event.target.value })}
              placeholder="What did the built result get right or wrong?"
            />
          </Field>
        </>
      ) : (
        <p className="selected-meta">Select a prompt to rate it.</p>
      )}
      <div className="health-grid compact-health">
        <div className="health-card">
          <h3>Successful signals</h3>
          {(outcomeSummary.goldSignals.length ? outcomeSummary.goldSignals : ["No gold signals yet."]).map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <div className="health-card">
          <h3>Avoid signals</h3>
          {(outcomeSummary.avoidSignals.length ? outcomeSummary.avoidSignals : ["No avoid signals yet."]).map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScreenshotPanel({
  onAddScreenshot,
  onRemoveScreenshot,
  screenshots,
  selectedPrompt,
}: {
  onAddScreenshot: (record: Omit<ScreenshotRecord, "id" | "createdAt">) => void;
  onRemoveScreenshot: (id: string) => void;
  screenshots: ScreenshotRecord[];
  selectedPrompt?: PromptExample;
}) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<ScreenshotRecord["rating"]>("unrated");
  const [dragActive, setDragActive] = useState(false);
  const visible = screenshots.filter((screenshot) => !selectedPrompt || screenshot.promptId === selectedPrompt.id).slice(0, 8);

  function loadScreenshotFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setUrl(reader.result);
        setTitle((current) => current || file.name.replace(/\.[^.]+$/, ""));
        setNotes((current) => current || `Uploaded screenshot file: ${file.name}`);
      }
    });
    reader.readAsDataURL(file);
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    loadScreenshotFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    loadScreenshotFile(event.dataTransfer.files?.[0]);
  }

  function add() {
    if (!selectedPrompt || !url.trim()) return;
    onAddScreenshot({
      promptId: selectedPrompt.id,
      title: title.trim() || selectedPrompt.title,
      url,
      notes,
      rating,
    });
    setUrl("");
    setTitle("");
    setNotes("");
    setRating("unrated");
  }

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <FileText size={18} />
        <h2>Result screenshot library</h2>
      </div>
      <Field label="Image URL or data URL">
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://... or data:image/..." />
      </Field>
      <div
        className="screenshot-dropzone"
        data-active={dragActive}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <Upload size={18} />
        <div>
          <strong>Drop a screenshot here</strong>
          <span>PNG, JPG, or WebP is converted into a local data URL.</span>
        </div>
        <label className="ghost-button compact-button">
          Browse
          <input accept="image/*" type="file" onChange={handleFileInput} />
        </label>
      </div>
      <div className="two-field-grid">
        <Field label="Title">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Homepage desktop result" />
        </Field>
        <Field label="Rating">
          <select value={rating} onChange={(event) => setRating(event.target.value as ScreenshotRecord["rating"])}>
            {ratingOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Notes">
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What should the prompt learn from this result?" />
      </Field>
      <button className="primary-button wide-button" type="button" onClick={add} disabled={!selectedPrompt || !url.trim()}>
        <Plus size={15} />
        Add result screenshot
      </button>
      <div className="screenshot-grid">
        {visible.length ? (
          visible.map((screenshot) => (
            <article className="screenshot-card" key={screenshot.id}>
              <img src={screenshot.url} alt={screenshot.title} />
              <div>
                <strong>{screenshot.title}</strong>
                <span>{screenshot.rating}</span>
              </div>
              {screenshot.notes ? <p>{screenshot.notes}</p> : null}
              <button className="icon-button danger" type="button" onClick={() => onRemoveScreenshot(screenshot.id)} aria-label={`Remove ${screenshot.title}`}>
                <Trash2 size={14} />
              </button>
            </article>
          ))
        ) : (
          <p className="selected-meta">No screenshots saved for this prompt yet.</p>
        )}
      </div>
    </section>
  );
}

function SemanticSearchPanel({
  onSelectPrompt,
  query,
  results,
  setQuery,
}: {
  onSelectPrompt: (id: string) => void;
  query: string;
  results: SearchResult[];
  setQuery: (value: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Search size={18} />
        <h2>Semantic similarity search</h2>
      </div>
      <Field label="Search intent">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Example: dark liquid-glass SaaS hero with video, mobile menu, exact motion, and no decorative blobs"
        />
      </Field>
      <div className="search-results">
        {results.length ? (
          results.map((result) => (
            <button className="result-card" key={result.example.id} type="button" onClick={() => onSelectPrompt(result.example.id)}>
              <strong>{result.example.title}</strong>
              <span>{result.score}% match</span>
              <p>{result.reasons.join(" / ") || "Semantic overlap"}</p>
            </button>
          ))
        ) : (
          <p className="selected-meta">Type a design intent to find close prompts.</p>
        )}
      </div>
    </section>
  );
}

function PromptDiffPanel({
  copied,
  diff,
  examples,
  leftId,
  onCopy,
  onSave,
  rightId,
  setLeftId,
  setRightId,
}: {
  copied: string;
  diff?: PromptDiff;
  examples: PromptExample[];
  leftId: string;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  rightId: string;
  setLeftId: (id: string) => void;
  setRightId: (id: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Clipboard size={18} />
        <h2>Prompt diff and merge</h2>
      </div>
      <div className="two-field-grid">
        <Field label="Left prompt">
          <select value={leftId} onChange={(event) => setLeftId(event.target.value)}>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>
                {example.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Right prompt">
          <select value={rightId} onChange={(event) => setRightId(event.target.value)}>
            {examples.map((example) => (
              <option key={example.id} value={example.id}>
                {example.title}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {diff ? (
        <>
          <div className="diff-score">
            <strong>{diff.similarity}%</strong>
            <span>similar</span>
          </div>
          <div className="diff-list">
            {diff.categories.slice(0, 8).map((category) => (
              <article className="diff-card" key={category.key}>
                <strong>{category.label}</strong>
                <p>Shared: {category.shared.slice(0, 5).join(", ") || "none"}</p>
                <p>Left only: {category.leftOnly.slice(0, 4).join(", ") || "none"}</p>
                <p>Right only: {category.rightOnly.slice(0, 4).join(", ") || "none"}</p>
              </article>
            ))}
          </div>
          <div className="output-header">
            <h3>Merged prompt</h3>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(diff.mergedPrompt, "merged")}>
                {copied === "merged" ? <Check size={15} /> : <Copy size={15} />}
                Copy
              </button>
              <button className="primary-button compact-button" type="button" onClick={() => onSave("merged", "Merged prompt", diff.mergedPrompt, evaluatePrompt(diff.mergedPrompt).score)}>
                <Save size={15} />
                Save
              </button>
            </div>
          </div>
          <textarea className="generated-output small-output" readOnly value={diff.mergedPrompt} />
        </>
      ) : (
        <p className="selected-meta">Choose two prompts to compare.</p>
      )}
    </section>
  );
}

function VisualQaPanel({
  driftReport,
  qaText,
  setQaText,
  visualQa,
}: {
  driftReport: DriftReport;
  qaText: string;
  setQaText: (value: string) => void;
  visualQa: VisualQaReport;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Gauge size={18} />
        <h2>Visual QA and drift detector</h2>
      </div>
      <Field label="Prompt to audit">
        <textarea value={qaText} onChange={(event) => setQaText(event.target.value)} placeholder="Leave blank to audit the generated prompt." />
      </Field>
      <div className="qa-score-row">
        <ScoreRing score={visualQa.score} label="Visual QA" />
        <ScoreRing score={driftReport.score} label="Taste fit" />
      </div>
      <div className="qa-grid">
        {visualQa.items.map((item) => (
          <article className="qa-card" key={item.label}>
            <strong>{item.label}</strong>
            <span>{item.score}</span>
            <p>{item.notes[0]}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Drift warnings" items={driftReport.warnings} empty="No drift warnings." />
      <FeedbackList title="Corrective rules" items={driftReport.correctiveRules} empty="No corrective rules needed." />
    </section>
  );
}

function InterviewPanel({
  brief,
  copied,
  onCopy,
  onSave,
  prompt,
  updateBrief,
}: {
  brief: InterviewBrief;
  copied: string;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  prompt: string;
  updateBrief: <K extends keyof InterviewBrief>(key: K, value: InterviewBrief[K]) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Wand2 size={18} />
        <h2>Brief-to-prompt interview</h2>
      </div>
      <div className="two-field-grid">
        <Field label="Brand">
          <input value={brief.brandName} onChange={(event) => updateBrief("brandName", event.target.value)} />
        </Field>
        <Field label="Site type">
          <input value={brief.siteType} onChange={(event) => updateBrief("siteType", event.target.value)} />
        </Field>
      </div>
      <Field label="Audience">
        <input value={brief.audience} onChange={(event) => updateBrief("audience", event.target.value)} />
      </Field>
      <Field label="Goal">
        <textarea value={brief.goal} onChange={(event) => updateBrief("goal", event.target.value)} />
      </Field>
      <Field label="Visual direction">
        <textarea value={brief.visualDirection} onChange={(event) => updateBrief("visualDirection", event.target.value)} />
      </Field>
      <Field label="Assets">
        <textarea value={brief.assets} onChange={(event) => updateBrief("assets", event.target.value)} />
      </Field>
      <Field label="Stack">
        <input value={brief.stack} onChange={(event) => updateBrief("stack", event.target.value)} />
      </Field>
      <div className="two-field-grid">
        <Field label="Must-haves">
          <textarea value={brief.mustHaves} onChange={(event) => updateBrief("mustHaves", event.target.value)} />
        </Field>
        <Field label="No-go rules">
          <textarea value={brief.noGos} onChange={(event) => updateBrief("noGos", event.target.value)} />
        </Field>
      </div>
      <Field label="Tone">
        <input value={brief.tone} onChange={(event) => updateBrief("tone", event.target.value)} />
      </Field>
      <div className="output-header">
        <h3>Interview-generated prompt</h3>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(prompt, "interview")}>
            {copied === "interview" ? <Check size={15} /> : <Copy size={15} />}
            Copy
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onSave("interview", `${brief.brandName} interview prompt`, prompt, evaluatePrompt(prompt).score)}>
            <Save size={15} />
            Save
          </button>
        </div>
      </div>
      <textarea className="generated-output small-output" readOnly value={prompt} />
    </section>
  );
}

function MutationLabPanel({
  copied,
  mutationSource,
  mutations,
  onCopy,
  onSave,
  setMutationSource,
}: {
  copied: string;
  mutationSource: string;
  mutations: PromptMutation[];
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  setMutationSource: (value: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Shuffle size={18} />
        <h2>Prompt mutation lab</h2>
      </div>
      <Field label="Source prompt override">
        <textarea
          value={mutationSource}
          onChange={(event) => setMutationSource(event.target.value)}
          placeholder="Leave blank to mutate the currently generated prompt."
        />
      </Field>
      <div className="mutation-list">
        {mutations.map((mutation) => (
          <article className="mutation-card" key={mutation.id}>
            <div className="output-header">
              <div>
                <strong>{mutation.title}</strong>
                <span>{mutation.intent}</span>
              </div>
              <div className="diff-score">
                <strong>{mutation.score}</strong>
                <span>DNA</span>
              </div>
            </div>
            <p>{mutation.intent}</p>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(mutation.prompt, mutation.id)}>
                {copied === mutation.id ? <Check size={15} /> : <Copy size={15} />}
                Copy
              </button>
              <button
                className="primary-button compact-button"
                type="button"
                onClick={() => onSave("mutation", mutation.title, mutation.prompt, mutation.score)}
              >
                <Save size={15} />
                Save
              </button>
            </div>
            <textarea className="generated-output small-output" readOnly value={mutation.prompt} />
          </article>
        ))}
      </div>
    </section>
  );
}

function ImprovePanel({
  copied,
  improvedPrompt,
  improveText,
  onCopy,
  onSave,
  setImproveText,
}: {
  copied: string;
  improvedPrompt: string;
  improveText: string;
  onCopy: (value: string, key: string) => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  setImproveText: (value: string) => void;
}) {
  const score = evaluatePrompt(improvedPrompt).score;
  const source = improveText.trim();
  const lower = source.toLowerCase();
  const missingQuestions = [
    /react|vite|typescript|tailwind|css|next/.test(lower) ? "" : "What exact stack and dependency boundaries should the build use?",
    /font|typeface|google fonts|font-family/.test(lower) ? "" : "Which fonts, weights, and text roles should be specified?",
    /#[0-9a-f]{3,8}|hsl|rgba|color|foreground|background/i.test(source) ? "" : "What color tokens and exact values define the visual system?",
    /url|video|image|asset|svg|mp4|webm/.test(lower) ? "" : "What exact media/assets or fallback slots should be used?",
    /mobile|responsive|sm:|md:|lg:|breakpoint|clamp/.test(lower) ? "" : "What mobile and desktop behaviors must be locked?",
    /verify|test|screenshot|qa|accessibility|aria/.test(lower) ? "" : "How should the output be verified visually and functionally?",
  ].filter(Boolean);

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Wand2 size={18} />
        <h2>Weak prompt repair</h2>
      </div>
      <Field label="Prompt to improve">
        <textarea
          value={improveText}
          onChange={(event) => setImproveText(event.target.value)}
          placeholder="Leave blank to improve the currently generated prompt with learned gold and avoid signals."
        />
      </Field>
      <FeedbackList
        title="Missing questions before build"
        items={missingQuestions}
        empty="This prompt already answers the main implementation questions."
      />
      <div className="output-header">
        <div>
          <h3>Outcome-aware rewrite</h3>
          <p className="selected-meta">Applies gold signals, avoid rules, result scoring, and visual QA constraints.</p>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(improvedPrompt, "improved-prompt")}>
            {copied === "improved-prompt" ? <Check size={15} /> : <Copy size={15} />}
            Copy
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onSave("improved", "Outcome-aware improved prompt", improvedPrompt, score)}>
            <Save size={15} />
            Save
          </button>
        </div>
      </div>
      <textarea className="generated-output style-guide-output" readOnly value={improvedPrompt} />
    </section>
  );
}

function LeaderboardPanel({
  leaderboard,
  onSelectPrompt,
}: {
  leaderboard: PromptRank[];
  onSelectPrompt: (id: string) => void;
}) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <Trophy size={18} />
        <h2>Prompt DNA leaderboard</h2>
      </div>
      <div className="leaderboard-list">
        {leaderboard.slice(0, 10).map((rank, index) => (
          <button className="leaderboard-card" key={rank.example.id} type="button" onClick={() => onSelectPrompt(rank.example.id)}>
            <span className="rank-badge">{index + 1}</span>
            <div>
              <strong>{rank.example.title}</strong>
              <p>{rank.reasons.join(" / ")}</p>
              <small>
                DNA {rank.dnaScore} / Originality {rank.originality} / Outcome {rank.outcomeBoost >= 0 ? "+" : ""}
                {rank.outcomeBoost}
              </small>
            </div>
            <em>{rank.score}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

function LocalIndexPanel({ localIndex }: { localIndex: LocalEmbeddingIndex }) {
  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <BookOpen size={18} />
        <h2>Local intent index</h2>
      </div>
      <div className="index-grid">
        <article className="index-card">
          <strong>{formatNumber(localIndex.promptCount)}</strong>
          <span>indexed prompts</span>
        </article>
        <article className="index-card">
          <strong>{formatNumber(localIndex.weightedPromptCount)}</strong>
          <span>weighted examples</span>
        </article>
      </div>
      <FeaturePills
        empty="No common local terms found."
        features={localIndex.topTerms}
      />
      <div className="index-grid">
        <article className="index-card wide-index-card">
          <h3>Gold vocabulary</h3>
          <p>{localIndex.goldTerms.map((term) => term.label).join(", ") || "Mark outcomes as gold to build this vocabulary."}</p>
        </article>
        <article className="index-card wide-index-card">
          <h3>Avoid vocabulary</h3>
          <p>{localIndex.avoidTerms.map((term) => term.label).join(", ") || "Mark weak outcomes as avoid to build this vocabulary."}</p>
        </article>
      </div>
      <FeedbackList title="Index notes" items={localIndex.notes} empty="No index notes yet." />
    </section>
  );
}

function SkillInstallPanel({
  copied,
  onCopy,
  plan,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  plan: SkillInstallPlan;
}) {
  const commandText = plan.commands.join("\n");

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <PackageOpen size={18} />
        <h2>Codex skill install status</h2>
      </div>
      <div className="winner-card">
        <span>{plan.status}</span>
        <strong>{plan.targetPath}</strong>
        <p>Export the latest skill after training, then install it locally so future Codex threads inherit this prompt taste.</p>
      </div>
      <div className="button-row">
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(commandText, "skill-install-plan")}>
          {copied === "skill-install-plan" ? <Check size={15} /> : <Copy size={15} />}
          Copy commands
        </button>
      </div>
      <div className="automation-steps">
        {plan.commands.map((command, index) => (
          <article className="automation-step" key={command}>
            <span>{index + 1}</span>
            <div>
              <strong>{index === 0 ? "Export" : index === 1 ? "Install" : "Verify"}</strong>
              <code>{command}</code>
            </div>
          </article>
        ))}
      </div>
      <FeedbackList title="Install checklist" items={plan.checklist} empty="No checklist." />
    </section>
  );
}

function GuidedWorkflowPanel() {
  const steps = [
    "Import a batch of great prompts or compile one from a rough idea.",
    "Run model evaluation and tournament scoring against the prompt memory.",
    "Queue finalists and use Run queue to scaffold agent-ready Vite folders.",
    "Capture desktop/mobile screenshots and import queue-result.json evidence.",
    "Compare prompt/result pairs, then mark the winner gold and weak patterns avoid.",
    "Export the prompt memory and install the updated Codex skill.",
  ];

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <ListChecks size={18} />
        <h2>Guided train loop</h2>
      </div>
      <div className="guided-steps">
        {steps.map((step, index) => (
          <article className="guided-step" key={step}>
            <span>{index + 1}</span>
            <p>{step}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScoreRing({ label, score }: { label: string; score: number }) {
  return (
    <div className="score-ring" data-tone={scoreTone(score)}>
      <strong>{score}</strong>
      <span>{label}</span>
    </div>
  );
}

function DnaList({ dna }: { dna: Record<DnaKey, number> }) {
  return (
    <div className="score-list compact">
      {dnaOrder.map((key) => {
        const score = dna[key];
        return (
          <div className="score-row" key={key}>
            <span>{dnaLabels[key]}</span>
            <div className="bar">
              <i data-tone={scoreTone(score)} style={{ width: `${score}%` }} />
            </div>
            <strong>{score}</strong>
          </div>
        );
      })}
    </div>
  );
}

function ScoreList({ compact = false, scores }: { compact?: boolean; scores: Record<CategoryKey, number> }) {
  return (
    <div className={`score-list ${compact ? "compact" : ""}`}>
      {categoryOrder.map((key) => {
        const score = scores[key];
        const tone = scoreTone(score);
        return (
          <div className="score-row" key={key}>
            <span>{categoryLabels[key]}</span>
            <div className="bar">
              <i data-tone={tone} style={{ width: `${score}%` }} />
            </div>
            <strong>{score}</strong>
          </div>
        );
      })}
    </div>
  );
}

function ClusterCard({ cluster }: { cluster: ArchetypeCluster }) {
  return (
    <article className="cluster-card">
      <div>
        <strong>{cluster.label}</strong>
        <span>{cluster.count} prompts / {cluster.score}% match</span>
      </div>
      <p>{cluster.signals.slice(0, 5).join(" / ")}</p>
    </article>
  );
}

function FeaturePills({ empty, features }: { empty: string; features: Feature[] }) {
  if (!features.length) return <em>{empty}</em>;
  return (
    <div className="feature-list">
      {features.slice(0, 10).map((feature) => (
        <span key={feature.label}>
          {feature.label}
          <small>{feature.count}</small>
        </span>
      ))}
    </div>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function SliderField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="slider-field">
      <span>
        {label}
        <strong>{value}</strong>
      </span>
      <input
        min={1}
        max={10}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function FeedbackList({ empty, items, title }: { empty: string; items: string[]; title: string }) {
  return (
    <div className="feedback-list">
      <h3>{title}</h3>
      {items.length ? (
        items.map((item) => (
          <p key={item}>
            <Check size={14} />
            {item}
          </p>
        ))
      ) : (
        <em>{empty}</em>
      )}
    </div>
  );
}
