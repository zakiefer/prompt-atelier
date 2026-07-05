import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties, type Dispatch, type DragEvent, type SetStateAction } from "react";
import {
  Activity,
  Archive,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Check,
  Clipboard,
  Copy,
  Download,
  FileJson,
  FileText,
  Gauge,
  Hammer,
  Laptop,
  Lightbulb,
  ListChecks,
  MonitorSmartphone,
  PackageOpen,
  Plus,
  Search,
  Save,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
  Swords,
  Tags,
  Trophy,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  analyzeArchetypeClusters,
  analyzeCorpus,
  analyzeCorpusHealth,
  analyzePrompt,
  auditPromptImportBatch,
  auditVisualPrompt,
  buildAllInRunwayReport,
  buildAutonomousProofLoopReport,
  buildAutonomousProofBatchProductReport,
  buildCodexSkill,
  buildBenchmarkExpansionReport,
  buildBenchmarkV2Report,
  buildBenchmarkLibraryReport,
  buildBenchmarkBattleReport,
  buildBestNextActionReport,
  buildBuildResultLearningReport,
  buildApiAdminHardeningReport,
  buildBeginnerPromptMakerReport,
  buildBulkImportPipelineReport,
  buildCalibrationDashboardReport,
  buildCalibrationProductReport,
  buildBriefBuilderProductReport,
  buildClaudeCalibrationProductReport,
  buildClaudeCalibrationSetReport,
  buildClosedLoopRunDetailReport,
  buildCorpusCleaningReport,
  buildCorpusCleanupModeReport,
  buildCorpusProvenanceFirewallReport,
  buildCorpusIntelligenceReport,
  buildDatasetBulkToolsReport,
  buildDatasetGovernanceReport,
  buildDatasetInboxReport,
  buildEvaluationArtifact,
  buildEvaluatorCalibrationWorkflowReport,
  buildEvaluationHistoryReport,
  buildExportPresets,
  buildFailureMemory,
  buildFailureMemoryAutopilotReport,
  buildGuidedProductRunReport,
  buildModelEvaluationCacheReport,
  buildLocalEmbeddingIndex,
  buildLocalModePolishReport,
  buildOutcomeSummary,
  buildPromptPacks,
  buildPromptLineage,
  buildPromptMemoryExport,
  buildPromptBattle,
  buildPromptBattleAutopilotReport,
  buildPromptProductOsReport,
  buildProductSprintReport,
  buildPromptCandidateTournament,
  buildPromptEditorGuidance,
  buildPromptQualityDnaReport,
  buildPromptRecipeDistillerReport,
  buildPromptSectionRegenerationReport,
  buildGoldReviewReport,
  buildGoldenDatasetV1LockReport,
  buildGeneratorPresets,
  buildExperimentLeaderboard,
  buildBuildFeedbackReport,
  buildCodexBuildPack,
  buildDatasetReviewQueueReport,
  buildLearnedGeneratorVariants,
  buildGuidedPromptWizardReport,
  buildGoldenBenchmarkHarnessReport,
  buildGeneratorBriefChecklistReport,
  buildGeneratorV3Report,
  buildGeneratorModeTestProductReport,
  buildHostedCiSmokeReport,
  buildHostedApiDeploymentProductReport,
  buildHostedBackendKitReport,
  buildHostedHardeningReport,
  buildHostedBuildWorkerReport,
  buildHostedReadinessProductReport,
  buildHostedSyncReport,
  buildImportWizardReport,
  buildArchetypePromptPacks,
  buildLeakageGuardReport,
  buildLearningExplanationReport,
  buildLearningMachineReport,
  buildNextProductLayerReport,
  buildPatternDashboard,
  buildProofSeedingRunwayReport,
  buildProjectExportPack,
  buildPreferenceReviewDeckReport,
  buildPreferenceTrainingReport,
  buildPromptMemoryDiffReport,
  buildPromptCoachReport,
  buildPromptToProofWorkflowReport,
  buildQueueProgressReport,
  buildQualityGateReport,
  buildResultGallery,
  buildResultFeedbackLoopReport,
  buildReusableMemoryPack,
  buildPublicDemoSimplificationReport,
  buildPublicDemoPolishReport,
  buildPublicProofChecklistReport,
  buildPreferenceDatasetV2ProductReport,
  buildSafeToTrainReport,
  buildGuidedTrainingStepperReport,
  buildModelJudgeComparisonReport,
  buildModelProviderRouterReport,
  buildOperatorModeReport,
  buildMeasuredQualitySprintReport,
  buildProofArtifactStorageReport,
  buildPromptCritiqueRepairReport,
  buildPromptGeneratorV2Report,
  buildProductCommandCenterReport,
  buildProviderPluginLayerReport,
  buildProofRunControllerReport,
  buildQualityRegressionGateReport,
  buildQueueObservabilityReport,
  buildSimpleModeReport,
  buildResultQualityDashboardReport,
  buildRegressionHistoryProductReport,
  buildRegressionTimelineReport,
  buildHostedWorkerOpsReport,
  buildSecurityBoundaryReport,
  buildSecurityCleanupProductReport,
  buildSourceSafetyReport,
  buildSpeedLabelingReport,
  buildTrainingRunSummary,
  buildTrainingExportReadinessReport,
  buildTemplateCompilerReport,
  buildResultGalleryHydrationProductReport,
  buildRegressionDashboardV2ProductReport,
  buildAccessibilityQaScoreReport,
  buildTrueClosedLoopReport,
  buildVisualProofComparisonReport,
  buildNarrativePolishReport,
  buildWorkerSandboxReport,
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
  type AllInRunwayReport,
  type AccessibilityQaScoreReport,
  type AutonomousProofLoopReport,
  type ArchetypeMixOptions,
  type ArchetypeCluster,
  type BenchmarkLibraryReport,
  type BenchmarkExpansionReport,
  type BenchmarkBattleReport,
  type BenchmarkV2Report,
  type BestNextActionReport,
  type BuildResultLearningReport,
  type ApiAdminHardeningReport,
  type BeginnerPromptMakerReport,
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
  type CorpusCleanupModeReport,
  type CorpusProvenanceFirewallReport,
  type CorpusIntelligenceReport,
  type CorpusCurationReport,
  type BulkImportPipelineReport,
  type BriefBuilderProductReport,
  type CalibrationProductReport,
  type ClaudeCalibrationProductReport,
  type DatasetGovernanceReport,
  type DatasetBulkToolsReport,
  type DatasetInboxReport,
  type DatasetReviewQueueReport,
  type DatasetVersion,
  type DatasetVersionComparison,
  type DnaCalibrationReport,
  type DnaScoreExplanation,
  type DriftReport,
  type Evaluation,
  type EvaluationArtifact,
  type EvaluationHistoryReport,
  type EvaluatorCalibrationWorkflowReport,
  type CalibrationDashboardReport,
  type ClaudeCalibrationSetReport,
  type ClosedLoopRunDetailReport,
  type ExportPreset,
  type ExperimentLeaderboardReport,
  type FailureMemoryReport,
  type FailureMemoryAutopilotReport,
  type Feature,
  type GoldenBenchmarkHarnessReport,
  type GuidedProductRunReport,
  type GeneratorBriefChecklistReport,
  type GeneratorV3Report,
  type HostedCiSmokeReport,
  type InterviewBrief,
  type ImportWizardReport,
  type LocalEmbeddingIndex,
  type LocalModePolishReport,
  type LearnerAnswerReport,
  type LearnedGeneratorInput,
  type LearnedGeneratorVariant,
  type LeakageGuardReport,
  type LearningExplanationReport,
  type LearningMachineReport,
  type NextProductLayerReport,
  type ProofSeedingRunwayReport,
  type GuidedPromptWizardReport,
  type HostedBackendKitReport,
  type HostedHardeningReport,
  type HostedBuildWorkerReport,
  type HostedReadinessProductReport,
  type HostedWorkerOpsReport,
  type HostedSyncReport,
  type ModelEvaluationCacheRecord,
  type ModelEvaluationCacheReport,
  type ModelJudgeComparisonReport,
  type ModelProviderRouterReport,
  type MeasuredQualitySprintReport,
  type OutcomeRecord,
  type OutcomeRating,
  type OutcomeSummary,
  type PairwiseReviewRecord,
  type PatternDashboardReport,
  type PatternExtractionReport,
  type PreferenceReviewDeckReport,
  type PreferenceTrainingReport,
  type PromptPack,
  type PromptBattle,
  type PromptBattleAutopilotReport,
  type PromptCandidateTournamentReport,
  type PromptEditorGuidanceReport,
  type PromptQualityDnaReport,
  type PromptRecipeDistillerReport,
  type PromptSectionRegenerationReport,
  type PromptDiff,
  type PromptDnaV2,
  type PromptExample,
  type PromptCompilerInput,
  type PromptMutation,
  type PromptMemoryExport,
  type PromptLineageNode,
  type ProofArtifactStorageReport,
  type ProductCommandCenterReport,
  type PromptProductOsReport,
  type ProductSprintReport,
  type PromptToProofWorkflowReport,
  type PromptCritiqueRepairReport,
  type PromptGeneratorV2Report,
  type PromptProfile,
  type PromptRank,
  type PromptTournament,
  type PublicDemoSimplificationReport,
  type PublicDemoPolishReport,
  type PublicProofChecklistReport,
  type ProviderPluginLayerReport,
  type SecurityBoundaryReport,
  type SecurityCleanupProductReport,
  type SourceSafetyReport,
  type GoldenRecipe,
  type GeneratorPreset,
  type GoldReviewReport,
  type GoldenDatasetV1LockReport,
  type PromptTemplate,
  type PromptWinExplanationReport,
  type QualityGateReport,
  type QualityRegressionGateReport,
  type RegressionHistoryProductReport,
  type RegressionTimelineReport,
  type QualityRubric,
  type RecipeOptions,
  type ResultScore,
  type ResultFeedbackLoopReport,
  type ResultGalleryItem,
  type ReusableMemoryPack,
  type SafeToTrainReport,
  type GuidedTrainingStepperReport,
  type OperatorModeReport,
  type ScreenshotQaReport,
  type ScreenshotRecord,
  type SearchResult,
  type ScoreBreakdown,
  type SkillInstallPlan,
  type VectorSearchResult,
  type NarrativePolishReport,
  type TemplateCompilerReport,
  type VisualRegressionReport,
  type VisualQaReport,
  type PromptCoachReport,
  type PromptImprovementComparison,
  type PromptMemoryDiffReport,
  type ProjectExportPack,
  type CodexBuildPack,
  type QueueProgressReport,
  type QueueObservabilityReport,
  type ProofRunControllerReport,
  type ScreenshotScoringReport,
  type SimpleModeReport,
  type SpeedLabelingReport,
  type ResultQualityDashboardReport,
  type TrainingRunRecord,
  type TrainingExportReadinessReport,
  type TrueClosedLoopReport,
  type VisualProofComparisonReport,
  type WorkerSandboxReport,
} from "./promptEngine";
import {
  buildHoldoutBenchmarkReport,
  buildLearningMemoryV2Report,
  buildModularArchitectureReport,
  buildProductEvolutionReport,
  buildProjectSpacesReport,
  buildPromptEditorStudioReport,
  buildPromptLearnerModeReport,
  buildPublicDemoExperienceReport,
  buildResultReviewerReport,
  type HoldoutBenchmarkReport,
  type LearningMemoryV2Report,
  type MemoryRuleDecision,
  type ModularArchitectureReport,
  type ProductEvolutionReport,
  type ProjectSpacesReport,
  type PromptEditorStudioReport,
  type PromptLearnerModeReport,
  type PublicDemoExperienceReport,
  type ResultReviewerReport,
  type SavedProjectSpaceInput,
} from "./productEvolution";
import {
  buildCorpusNeighbors,
  buildCorpusReviewQueue,
  buildCompilerHouseFormatText,
  buildDnaRewritePlan,
  buildLearnerExportPack,
  buildLearnerProofGallery,
  buildLearningProfiles,
  buildLearnerRecipes,
  buildSamplePromptGallery,
  buildTargetExportPresets,
  createLearnerSession,
  type CorpusReviewRow,
  type LearnerSession,
} from "./learnerProduct";
import { LearnView, PublicDemoRoute } from "./LearnerExperience";
import {
  createCorpusCandidatePrompt,
  createCorpusReviewLineageNode,
  createLearnerFeedbackPrompt,
  createLearnerFeedbackScreenshot,
  outcomeStatusForRating,
  type CorpusCandidateReviewAction,
} from "./learnerAppActions";
import { BatchIngestionPreview, DraftIngestionPreflight, Field, Metric, SliderField, SmartIngestion, TabButton, Toggle } from "./AppChrome";
import {
  analyzeScreenshots,
  analyzeCorpusViaApi,
  captureResult,
  createEvaluationArtifact,
  createTrainingRun,
  evaluateWithModel,
  evaluateWithModelCache,
  getApiBase,
  getApiToken,
  getApiCollections,
  getApiEvents,
  getApiHealth,
  getModelSettings,
  getTrainingSnapshot,
  importResult,
  installSkill,
  runClosedLoopProofViaApi,
  runClosedLoopViaApi,
  runQueue,
  runBenchmarkV2ViaApi,
  runVisualQa,
  setApiBase,
  setApiToken,
  syncCollections,
  updateQueueJob,
  type ApiEvent,
  type ApiHealth,
} from "./promptApi";
import { readAllCollections, writeCollection } from "./promptDb";
import { seedPrompts } from "./seedPrompts";
import { benchmarkBriefs } from "./appStatic";

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
const MEMORY_RULE_DECISIONS_KEY = "prompt-atelier-memory-rule-decisions";
const PROJECT_SPACES_KEY = "prompt-atelier-project-spaces";
const LEARNING_PROFILE_KEY = "prompt-atelier-active-learning-profile";
const LEARNER_SESSION_KEY = "prompt-atelier-learner-sessions";
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
const TRAINING_RUN_KEY = "prompt-atelier-training-runs";
const MODEL_EVALUATION_CACHE_KEY = "prompt-atelier-model-evaluation-cache";
const PROMPT_CANDIDATE_RUN_KEY = "prompt-atelier-prompt-candidate-runs";
const CORPUS_CLUSTER_RUN_KEY = "prompt-atelier-corpus-cluster-runs";
const BENCHMARK_V2_RUN_KEY = "prompt-atelier-benchmark-v2-runs";
const EVALUATION_ARTIFACT_KEY = "prompt-atelier-evaluation-artifacts";
const HOSTED_SETUP_CHECK_KEY = "prompt-atelier-hosted-setup-checks";
const PROOF_ARTIFACT_KEY = "prompt-atelier-proof-artifacts";

const categoryOrder = Object.keys(categoryLabels) as CategoryKey[];

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

function readStoredArray<T>(key: string, validate: (item: T) => boolean, limit: number) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed.filter(validate).slice(0, limit) : [];
  } catch {
    return [];
  }
}

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

function readStoredMemoryRuleDecisions(): Record<string, MemoryRuleDecision> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(MEMORY_RULE_DECISIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, MemoryRuleDecision>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readStoredProjectSpaces(): SavedProjectSpace[] {
  return readStoredArray<SavedProjectSpace>(
    PROJECT_SPACES_KEY,
    (item) => Boolean(item?.id && item?.label && Array.isArray(item?.query) && item?.createdAt),
    20,
  );
}

function readStoredLearnerSessions() {
  return readStoredArray<LearnerSession>(
    LEARNER_SESSION_KEY,
    (item) => Boolean(item?.id && item?.createdAt && item?.sourcePrompt && item?.improvedPrompt),
    60,
  );
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

function readStoredTrainingRuns() {
  return readStoredArray<TrainingRunRecord>(TRAINING_RUN_KEY, (item) => Boolean(item?.id && item?.createdAt), 100);
}

function readStoredModelEvaluationCache() {
  return readStoredArray<ModelEvaluationCacheRecord>(MODEL_EVALUATION_CACHE_KEY, (item) => Boolean(item?.id && item?.promptHash), 250);
}

function readStoredPromptCandidateRuns() {
  return readStoredArray<PromptCandidateRun>(PROMPT_CANDIDATE_RUN_KEY, (item) => Boolean(item?.id && item?.report?.winner), 80);
}

function readStoredCorpusClusterRuns() {
  return readStoredArray<CorpusClusterRun>(CORPUS_CLUSTER_RUN_KEY, (item) => Boolean(item?.id && item?.report), 80);
}

function readStoredBenchmarkV2Runs() {
  return readStoredArray<BenchmarkV2Run>(BENCHMARK_V2_RUN_KEY, (item) => Boolean(item?.id && item?.report), 80);
}

function readStoredEvaluationArtifacts() {
  return readStoredArray<EvaluationArtifact>(EVALUATION_ARTIFACT_KEY, (item) => Boolean(item?.id && item?.markdown), 120);
}

function readStoredHostedSetupChecks() {
  return readStoredArray<HostedSetupCheck>(HOSTED_SETUP_CHECK_KEY, (item) => Boolean(item?.id && item?.report), 80);
}

function readStoredProofArtifacts() {
  return readStoredArray<ProofArtifactRecord>(PROOF_ARTIFACT_KEY, (item) => Boolean(item?.id && item?.title), 160);
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

function readStoredLearningProfileId() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(LEARNING_PROFILE_KEY) || "";
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
type SavedProjectSpace = SavedProjectSpaceInput & {
  createdAt: string;
};

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
  if (target === "OpenAI fine-tune JSONL") {
    return JSON.stringify({
      messages: [
        { role: "system", content: "Write high-fidelity, build-ready website prompts with exact implementation details and proof gates." },
        { role: "user", content: `Create a website prompt like ${prompt?.title ?? "the learned corpus"}.` },
        { role: "assistant", content: source },
      ],
      metadata: { target: "openai-finetune", title: prompt?.title ?? "memory", exportedAt: new Date().toISOString() },
    });
  }
  if (target === "Claude project memory") {
    return [
      "# Claude Project Memory",
      "",
      "Use this when generating or grading website prompts.",
      "",
      "## Prompt strength",
      memory.markdown,
      "",
      "## Current Reference Prompt",
      source,
      "",
      "## Safety",
      "- Do not store or repeat API keys, bearer tokens, passwords, or unrelated project names.",
      "- Preserve exact asset URLs, stack, layout, motion, responsive behavior, and verification gates.",
    ].join("\n");
  }
  if (target === "Codex skill bundle") {
    return [
      "# Website Prompt Atelier",
      "",
      "Use this skill to write high-fidelity website prompts from rough ideas or curated corpus examples.",
      "",
      "## Steps",
      "1. Identify site type, audience, stack, assets, typography, colors, layout, interactions, responsive rules, and no-go constraints.",
      "2. Include desktop and mobile verification gates.",
      "3. Redact secrets and unrelated repo-operation text before training.",
      "",
      "## Memory",
      memory.markdown,
    ].join("\n");
  }
  if (target === "Model evaluation schema") {
    return JSON.stringify({
      schemaVersion: "prompt-atelier.model-evaluation.v1",
      required: ["score", "readiness", "findings", "recommendations"],
      fields: {
        score: "0-100 number",
        readiness: "blocked | needs-review | ready | excellent",
        findings: "string[]",
        recommendations: "string[]",
        rewrittenPrompt: "string",
      },
    }, null, 2);
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

type DraftContaminationReport = {
  status: "clean" | "review" | "block";
  score: number;
  warnings: string[];
  actions: string[];
};

function buildDraftContaminationReport(text: string): DraftContaminationReport {
  const normalized = text.trim();
  if (!normalized) return { status: "clean", score: 100, warnings: [], actions: [] };
  const lower = normalized.toLowerCase();
  const checks = [
    {
      severity: "block" as const,
      label: "Possible API key or secret detected.",
      matched: /(sk-ant-api\d+-[a-z0-9_-]{20,}|sk-[a-z0-9_-]{20,}|github_pat_[a-z0-9_]{20,}|ghp_[a-z0-9]{20,})/i.test(normalized),
      action: "Remove secrets before importing. Keys should only live on the API host.",
    },
    {
      severity: "review" as const,
      label: "Looks like repo or deployment work, not a website prompt.",
      matched: ["git push", "github actions", "pull request", "commit", "ci", "deploy pages", "render blueprint", "merge lane", "worktree"].some((term) => lower.includes(term)),
      action: "Paste only the reusable website prompt, or quarantine this item after import.",
    },
    {
      severity: "review" as const,
      label: "Looks like a log, traceback, or command transcript.",
      matched: ["error:", "stack trace", "traceback", "npm run", "process exited", "exit code", "stdout", "stderr"].some((term) => lower.includes(term)),
      action: "Summarize the design target instead of training on operational output.",
    },
    {
      severity: "review" as const,
      label: "Website intent is thin.",
      matched: !/(hero|landing|website|page|section|navbar|layout|responsive|tailwind|react|vite|video|font|cta)/i.test(normalized),
      action: "Add site type, stack, visual direction, layout, assets, responsive rules, and proof requirements.",
    },
  ].filter((check) => check.matched);
  const blocked = checks.some((check) => check.severity === "block");
  const score = Math.max(0, 100 - checks.filter((check) => check.severity === "block").length * 55 - checks.filter((check) => check.severity === "review").length * 18);
  return {
    status: blocked ? "block" : checks.length ? "review" : "clean",
    score,
    warnings: checks.map((check) => check.label),
    actions: checks.map((check) => check.action),
  };
}

type TrainModeReport = {
  id: string;
  label: string;
  score: number;
  detail: string;
  target: string;
}[];

function buildTrainModeReport({
  curationReport,
  guidedWizard,
  proofLearningRuns,
  benchmarkRegression,
  promptMemory,
  projectBoundaryReport,
}: {
  curationReport: CorpusCurationReport;
  guidedWizard: GuidedPromptWizardReport;
  proofLearningRuns: ProofLearningRun[];
  benchmarkRegression: BenchmarkRegressionReport;
  promptMemory: PromptMemoryExport;
  projectBoundaryReport: ProjectBoundaryReport;
}): TrainModeReport {
  return [
    {
      id: "ingest",
      label: "Ingest",
      score: curationReport.counts.learn,
      detail: `${curationReport.counts.learn} learning / ${curationReport.counts.review} review / ${curationReport.counts.quarantine} quarantine.`,
      target: "workspace",
    },
    {
      id: "curate",
      label: "Curate",
      score: Math.max(0, 100 - projectBoundaryReport.outOfScopeCount * 2 - curationReport.counts.review * 4),
      detail: `${projectBoundaryReport.mode} workspace with ${projectBoundaryReport.outOfScopeCount} off-project prompt(s).`,
      target: "workspace",
    },
    {
      id: "generate",
      label: "Generate",
      score: guidedWizard.variants[0]?.score ?? 0,
      detail: guidedWizard.variants[0] ? `${guidedWizard.variants[0].title} is the current best generated variant.` : "Complete the generator brief.",
      target: "generate",
    },
    {
      id: "prove",
      label: "Prove",
      score: proofLearningRuns[0] ? 100 : 0,
      detail: proofLearningRuns[0] ? `${proofLearningRuns[0].learnedStatus} proof from ${proofLearningRuns[0].screenshotCount} screenshot(s).` : "Run proof to tie prompts to build evidence.",
      target: "queue",
    },
    {
      id: "improve",
      label: "Improve",
      score: Math.max(0, Math.min(100, 72 + benchmarkRegression.delta)),
      detail: `${benchmarkRegression.delta >= 0 ? "+" : ""}${benchmarkRegression.delta} benchmark delta across ${benchmarkRegression.rows.length} briefs.`,
      target: "patterns",
    },
    {
      id: "export",
      label: "Export",
      score: promptMemory.sections.length,
      detail: `${promptMemory.sections.length} memory section(s) ready for packs and JSONL.`,
      target: "packs",
    },
  ];
}

type GoldenDatasetReport = {
  label: string;
  readyScore: number;
  goldCount: number;
  trainCount: number;
  testCount: number;
  rows: { id: string; title: string; split: "train" | "test"; score: number; status: string }[];
  jsonl: string;
  notes: string[];
};

function buildGoldenDatasetReport(examples: PromptExample[], outcomes: OutcomeRecord[], datasetVersions: DatasetVersion[]): GoldenDatasetReport {
  const outcomeById = new Map(outcomes.map((outcome) => [outcome.promptId, outcome]));
  const ranked = examples
    .map((example) => {
      const outcome = outcomeById.get(example.id);
      const baseScore = evaluatePrompt(example.text).score;
      const score = Math.min(100, baseScore + (outcome?.status === "gold" ? 16 : outcome?.status === "good" ? 8 : 0) + (outcome?.rating === "great" ? 10 : 0));
      return { example, outcome, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 24);
  const rows = ranked.map((item, index) => ({
    id: item.example.id,
    title: item.example.title,
    split: index % 5 === 0 ? "test" as const : "train" as const,
    score: item.score,
    status: item.outcome?.status ?? "candidate",
  }));
  const jsonl = ranked
    .map((item, index) =>
      JSON.stringify({
        messages: [
          { role: "system", content: "Write high-fidelity, build-ready website prompts with exact stack, assets, layout, motion, constraints, responsive behavior, and proof requirements." },
          { role: "user", content: `Create a ${index % 5 === 0 ? "test" : "training"} website prompt inspired by ${item.example.title}.` },
          { role: "assistant", content: item.example.text },
        ],
        metadata: {
          id: item.example.id,
          title: item.example.title,
          split: index % 5 === 0 ? "test" : "train",
          score: item.score,
          status: item.outcome?.status ?? "candidate",
        },
      }),
    )
    .join("\n");
  const locked = datasetVersions.some((version) => version.label.toLowerCase() === "golden dataset v1");
  return {
    label: locked ? "Golden Dataset v1 locked" : "Golden Dataset v1 draft",
    readyScore: Math.min(100, Math.round((rows.length / 24) * 45 + rows.filter((row) => row.score >= 80).length * 3 + (locked ? 20 : 0))),
    goldCount: rows.filter((row) => row.status === "gold").length,
    trainCount: rows.filter((row) => row.split === "train").length,
    testCount: rows.filter((row) => row.split === "test").length,
    rows,
    jsonl,
    notes: [
      locked ? "Dataset version exists and can be exported as a stable training baseline." : "Lock the dataset before calibrating or exporting model training rows.",
      "Train/test split is deterministic so benchmark prompts are not silently mixed with training prompts.",
      "Rows favor gold/great outcomes first, then high-scoring curated prompt examples.",
    ],
  };
}

type ProofProgressReport = {
  status: "idle" | "queued" | "running" | "capturing" | "complete" | "failed";
  steps: { label: string; state: "todo" | "active" | "done" | "failed"; detail: string }[];
  latest?: BuildQueueJob;
};

function buildProofProgressReport(queueJobs: BuildQueueJob[], buildRuns: BuildRunRecord[], screenshots: ScreenshotRecord[], proofLearningRuns: ProofLearningRun[], selectedPrompt?: PromptExample): ProofProgressReport {
  const latest = queueJobs.find((job) => !selectedPrompt || job.promptId === selectedPrompt.id) ?? queueJobs[0];
  const run = buildRuns.find((item) => !selectedPrompt || item.promptId === selectedPrompt.id);
  const shotCount = screenshots.filter((item) => !selectedPrompt || item.promptId === selectedPrompt.id).length;
  const proof = proofLearningRuns.find((item) => !selectedPrompt || item.promptId === selectedPrompt.id);
  const queueDone = Boolean(latest);
  const buildDone = Boolean(run);
  const captureDone = shotCount > 0;
  const learnDone = Boolean(proof);
  const failed = latest?.status === "failed" || run?.status === "failed";
  const status: ProofProgressReport["status"] = failed ? "failed" : learnDone ? "complete" : captureDone ? "capturing" : buildDone ? "running" : queueDone ? "queued" : "idle";
  return {
    status,
    latest,
    steps: [
      { label: "Queue", state: queueDone ? "done" : "todo", detail: latest?.runFolder || "No proof job queued yet." },
      { label: "Build", state: failed ? "failed" : buildDone ? "done" : queueDone ? "active" : "todo", detail: run?.status || latest?.status || "Waiting for queue." },
      { label: "Capture", state: captureDone ? "done" : buildDone ? "active" : "todo", detail: captureDone ? `${shotCount} screenshot(s) attached.` : "Desktop/mobile screenshots pending." },
      { label: "Learn", state: learnDone ? "done" : captureDone ? "active" : "todo", detail: proof?.learnedStatus || "Proof has not been written into the ledger." },
    ],
  };
}

type EvolutionDiffReport = {
  fromTitle: string;
  toTitle: string;
  scoreDelta: number;
  addedSignals: string[];
  removedSignals: string[];
  summary: string[];
};

function buildEvolutionDiffReport(selectedPrompt: PromptExample | undefined, history: PromptVersion[], closedLoopRuns: ClosedLoopRun[]): EvolutionDiffReport {
  const target = closedLoopRuns[0]?.winnerPrompt || history[0]?.text || "";
  const fromText = selectedPrompt?.text || "";
  if (!fromText || !target) {
    return {
      fromTitle: selectedPrompt?.title ?? "No source prompt",
      toTitle: "No improved prompt yet",
      scoreDelta: 0,
      addedSignals: [],
      removedSignals: [],
      summary: ["Run a closed-loop trainer, mutation tournament, or save an improved prompt to compare evolution."],
    };
  }
  const diff = diffPrompts(
    { id: "from", title: selectedPrompt?.title ?? "Source prompt", text: fromText, source: "user", createdAt: "" },
    { id: "to", title: closedLoopRuns[0]?.winnerTitle || history[0]?.title || "Latest improved prompt", text: target, source: "user", createdAt: "" },
  );
  return {
    fromTitle: selectedPrompt?.title ?? "Source prompt",
    toTitle: closedLoopRuns[0]?.winnerTitle || history[0]?.title || "Latest improved prompt",
    scoreDelta: evaluatePrompt(target).score - evaluatePrompt(fromText).score,
    addedSignals: diff.categories.flatMap((category) => category.rightOnly.map((item) => `${category.label}: ${item}`)).slice(0, 8),
    removedSignals: diff.categories.flatMap((category) => category.leftOnly.map((item) => `${category.label}: ${item}`)).slice(0, 8),
    summary: diff.summary,
  };
}

type BenchmarkTrendReport = {
  points: { label: string; score: number; delta: number }[];
  bestScore: number;
  currentScore: number;
  trend: "up" | "flat" | "down" | "empty";
  notes: string[];
};

function buildBenchmarkTrendReport(runs: BenchmarkRun[]): BenchmarkTrendReport {
  const chronological = [...runs].reverse().slice(-8);
  const points = chronological.map((run, index) => {
    const previous = chronological[index - 1]?.averageScore ?? run.averageScore;
    return {
      label: `Run ${Math.max(1, runs.length - chronological.length + index + 1)}`,
      score: run.averageScore,
      delta: run.averageScore - previous,
    };
  });
  const currentScore = points[points.length - 1]?.score ?? 0;
  const bestScore = Math.max(0, ...points.map((point) => point.score));
  const firstScore = points[0]?.score ?? 0;
  return {
    points,
    bestScore,
    currentScore,
    trend: points.length < 2 ? "empty" : currentScore > firstScore ? "up" : currentScore < firstScore ? "down" : "flat",
    notes: points.length ? [`Best average ${bestScore}.`, `Latest average ${currentScore}.`, `${points.filter((point) => point.delta < 0).length} regression point(s) in the visible trend.`] : ["Run the benchmark suite to draw the first trend line."],
  };
}

type HostedBrainReadinessReport = {
  score: number;
  rows: { label: string; ready: boolean; detail: string }[];
  notes: string[];
};

function buildHostedBrainReadinessReport(apiHealth: ApiHealth | undefined, modelEnvStatus: Record<string, boolean> | undefined, claudeHealthChecks: HostedClaudeHealthCheck[]): HostedBrainReadinessReport {
  const latest = claudeHealthChecks[0];
  const rows = [
    { label: "API health", ready: Boolean(apiHealth?.ok || latest?.apiOnline), detail: apiHealth?.sqlitePath || latest?.sqlitePath || "Not checked" },
    { label: "Bearer auth", ready: Boolean(apiHealth?.authRequired || latest?.tokenValid), detail: apiHealth?.authRequired || latest?.tokenValid ? "Token path verified" : "Open local mode; require token before hosting" },
    { label: "SQLite writes", ready: Boolean(apiHealth?.sqlitePath || latest?.sqliteWritable), detail: latest?.sqliteWritable ? "Writable" : apiHealth?.sqlitePath ? "Path detected" : "Unchecked" },
    { label: "Claude key", ready: Boolean(modelEnvStatus?.anthropicApiKeyConfigured || latest?.claudeConfigured), detail: modelEnvStatus?.anthropicApiKeyConfigured || latest?.claudeConfigured ? "Configured on server" : "Local evaluator fallback" },
    { label: "Model route", ready: Boolean(latest?.modelRouteWorking), detail: latest ? `${latest.modelMode} / ${latest.modelScore}` : "Run deep health check" },
    { label: "Image judging", ready: Boolean(modelEnvStatus?.anthropicApiKeyConfigured || latest?.claudeConfigured), detail: "Available only when the model key is server-side" },
  ];
  const score = Math.round((rows.filter((row) => row.ready).length / rows.length) * 100);
  return {
    score,
    rows,
    notes: [
      score >= 80 ? "Hosted brain is ready for calibration and screenshot judging." : "Finish API/token/model checks before trusting hosted learning.",
      "Never paste model keys into the browser; keep them on the API host.",
    ],
  };
}

function buildOneClickExportPackText({
  goldenDataset,
  promptMemory,
  qualityGrader,
  benchmarkTrend,
  projectBoundaryReport,
  reusableMemoryPack,
  codexBuildPack,
}: {
  goldenDataset: GoldenDatasetReport;
  promptMemory: PromptMemoryExport;
  qualityGrader: QualityGraderV2;
  benchmarkTrend: BenchmarkTrendReport;
  projectBoundaryReport: ProjectBoundaryReport;
  reusableMemoryPack: ReusableMemoryPack;
  codexBuildPack: CodexBuildPack;
}) {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      contents: ["goldenDataset", "jsonl", "promptMemory", "qualityGrader", "benchmarkTrend", "projectBoundary", "reusableMemoryPack", "codexBuildPack"],
      goldenDataset: {
        label: goldenDataset.label,
        readyScore: goldenDataset.readyScore,
        trainCount: goldenDataset.trainCount,
        testCount: goldenDataset.testCount,
        rows: goldenDataset.rows,
        jsonl: goldenDataset.jsonl,
      },
      promptMemory,
      qualityGrader,
      benchmarkTrend,
      projectBoundary: projectBoundaryReport,
      reusableMemoryPack,
      codexBuildPack,
    },
    null,
    2,
  );
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

type PromptCandidateRun = {
  id: string;
  createdAt: string;
  source: "generator" | "mutation" | "api";
  report: PromptCandidateTournamentReport;
  notes: string[];
};

type CorpusClusterRun = {
  id: string;
  createdAt: string;
  count: number;
  report: CorpusIntelligenceReport;
  notes: string[];
};

type BenchmarkV2Run = {
  id: string;
  createdAt: string;
  count: number;
  score: number;
  report: BenchmarkV2Report;
  notes: string[];
};

type HostedSetupCheck = {
  id: string;
  createdAt: string;
  report: SafeToTrainReport;
  notes: string[];
};

type ProofArtifactRecord = {
  id: string;
  jobId?: string;
  promptId?: string;
  title: string;
  kind: string;
  viewport?: string;
  path?: string;
  url?: string;
  resultUrl?: string;
  score?: number;
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
  memoryRuleDecisions: Record<string, MemoryRuleDecision>;
  projectSpaces: SavedProjectSpace[];
  learnerSessions: LearnerSession[];
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
  trainingRuns: TrainingRunRecord[];
  modelEvaluationCache: ModelEvaluationCacheRecord[];
  promptCandidateRuns: PromptCandidateRun[];
  corpusClusterRuns: CorpusClusterRun[];
  benchmarkV2Runs: BenchmarkV2Run[];
  evaluationArtifacts: EvaluationArtifact[];
  hostedSetupChecks: HostedSetupCheck[];
  proofArtifacts: ProofArtifactRecord[];
};

export default function App() {
  const [userPrompts, setUserPrompts] = useState<PromptExample[]>(() => readStoredPrompts());
  const [draftPrompt, setDraftPrompt] = useState("");
  const [selectedId, setSelectedId] = useState(seedPrompts[0]?.id ?? "");
  const [tab, setTab] = useState<TabKey>(() => {
    if (typeof window === "undefined") return "learn";
    const requested = new URLSearchParams(window.location.search).get("tab") || window.location.hash.replace(/^#/, "");
    return ["learn", "compose", "critic", "templates", "lab", "train"].includes(requested) ? requested as TabKey : "learn";
  });
  const [openInspector, setOpenInspector] = useState<"corpus" | "rules" | null>(null);
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
  const [memoryRuleDecisions, setMemoryRuleDecisions] = useState<Record<string, MemoryRuleDecision>>(() => readStoredMemoryRuleDecisions());
  const [savedProjectSpaces, setSavedProjectSpaces] = useState<SavedProjectSpace[]>(() => readStoredProjectSpaces());
  const [learnerSessions, setLearnerSessions] = useState<LearnerSession[]>(() => readStoredLearnerSessions());
  const [modelBatchEvaluations, setModelBatchEvaluations] = useState<ModelBatchEvaluation[]>(() => readStoredModelBatchEvaluations());
  const [pairwiseReviews, setPairwiseReviews] = useState<PairwiseReviewRecord[]>(() => readStoredPairwiseReviews());
  const [backupSnapshots, setBackupSnapshots] = useState<TrainingBackupSnapshot[]>(() => readStoredBackupSnapshots());
  const [onboardingMode, setOnboardingMode] = useState<OnboardingMode>(() => readStoredOnboardingMode());
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceKey>(() => readStoredWorkspace());
  const [activeLearningProfileId, setActiveLearningProfileId] = useState(() => readStoredLearningProfileId());
  const [closedLoopRuns, setClosedLoopRuns] = useState<ClosedLoopRun[]>(() => readStoredClosedLoopRuns());
  const [benchmarkRuns, setBenchmarkRuns] = useState<BenchmarkRun[]>(() => readStoredBenchmarkRuns());
  const [claudeHealthChecks, setClaudeHealthChecks] = useState<HostedClaudeHealthCheck[]>(() => readStoredClaudeHealthChecks());
  const [promptComparisons, setPromptComparisons] = useState<PromptComparisonRun[]>(() => readStoredPromptComparisons());
  const [screenshotPromptRuns, setScreenshotPromptRuns] = useState<ScreenshotPromptRun[]>(() => readStoredScreenshotPromptRuns());
  const [workspacePackRuns, setWorkspacePackRuns] = useState<WorkspacePackRun[]>(() => readStoredWorkspacePackRuns());
  const [proofLearningRuns, setProofLearningRuns] = useState<ProofLearningRun[]>(() => readStoredProofLearningRuns());
  const [screenshotJudgeRuns, setScreenshotJudgeRuns] = useState<ScreenshotJudgeRun[]>(() => readStoredScreenshotJudgeRuns());
  const [mutationTournamentRuns, setMutationTournamentRuns] = useState<MutationTournamentRun[]>(() => readStoredMutationTournamentRuns());
  const [trainingRuns, setTrainingRuns] = useState<TrainingRunRecord[]>(() => readStoredTrainingRuns());
  const [modelEvaluationCache, setModelEvaluationCache] = useState<ModelEvaluationCacheRecord[]>(() => readStoredModelEvaluationCache());
  const [promptCandidateRuns, setPromptCandidateRuns] = useState<PromptCandidateRun[]>(() => readStoredPromptCandidateRuns());
  const [corpusClusterRuns, setCorpusClusterRuns] = useState<CorpusClusterRun[]>(() => readStoredCorpusClusterRuns());
  const [benchmarkV2Runs, setBenchmarkV2Runs] = useState<BenchmarkV2Run[]>(() => readStoredBenchmarkV2Runs());
  const [evaluationArtifacts, setEvaluationArtifacts] = useState<EvaluationArtifact[]>(() => readStoredEvaluationArtifacts());
  const [hostedSetupChecks, setHostedSetupChecks] = useState<HostedSetupCheck[]>(() => readStoredHostedSetupChecks());
  const [proofArtifacts, setProofArtifacts] = useState<ProofArtifactRecord[]>(() => readStoredProofArtifacts());
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
  const learningProfiles = useMemo(
    () => buildLearningProfiles({ clusters, examples: learningExamples, presets: workspacePresets, profile, savedSpaces: savedProjectSpaces }),
    [clusters, learningExamples, profile, savedProjectSpaces],
  );
  const activeLearningProfile = useMemo(
    () => learningProfiles.find((item) => item.id === activeLearningProfileId) ?? learningProfiles[0],
    [activeLearningProfileId, learningProfiles],
  );
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
  const learnerCorpusReviewRows = useMemo(() => buildCorpusReviewQueue(draftImportAudit), [draftImportAudit]);
  const draftContaminationReport = useMemo(() => buildDraftContaminationReport(draftPrompt), [draftPrompt]);
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
  const learnerSource = improveText.trim() || selectedPrompt?.text || generatedPrompt;
  const learnerEvaluation = useMemo(() => evaluatePrompt(learnerSource), [learnerSource]);
  const learnerSamples = useMemo(() => buildSamplePromptGallery(learningExamples), [learningExamples]);
  const learnerCorpusNeighbors = useMemo(
    () => buildCorpusNeighbors(learnerSource, learningExamples, outcomes),
    [learnerSource, learningExamples, outcomes],
  );
  const mutationSourceText = mutationSource.trim() || selectedPrompt?.text || generatedPrompt;
  const promptMutations = useMemo(
    () => mutatePromptVariants(mutationSourceText, profile, outcomes),
    [mutationSourceText, outcomes, profile],
  );
  const improvedPrompt = useMemo(
    () => improvePromptWithLearning(learnerSource, profile, outcomes, resultScore),
    [learnerSource, outcomes, profile, resultScore],
  );
  const learnerPromptDiff = useMemo(
    () => (learnerSource.trim() && improvedPrompt.trim() ? diffPrompts(learnerSource, improvedPrompt) : undefined),
    [improvedPrompt, learnerSource],
  );
  const learnerCompiledPrompt = useMemo(
    () =>
      compilePromptFromBrief(
        {
          roughIdea: learnerSource.slice(0, 1400),
          brandName: activeLearningProfile?.label || compilerInput.brandName,
          siteType: activeLearningProfile?.label || compilerInput.siteType,
          audience: compilerInput.audience,
          visualDirection: activeLearningProfile?.description || compilerInput.visualDirection,
          stack: compilerInput.stack,
          assets: "Preserve every exact URL, image, video, logo, and file path from the source prompt.",
          constraints: "Use the house format: stack, fonts, colors, assets, layout, motion, responsive behavior, constraints, and QA.",
        },
        profile,
        outcomes,
        resultScore,
      ),
    [activeLearningProfile, compilerInput, learnerSource, outcomes, profile, resultScore],
  );
  const learnerHousePrompt = useMemo(() => buildCompilerHouseFormatText(learnerCompiledPrompt), [learnerCompiledPrompt]);
  const learnerBattle = useMemo(
    () => buildPromptBattle(improvedPrompt, profile, outcomes, resultScore),
    [improvedPrompt, outcomes, profile, resultScore],
  );
  const learnerDnaRewrites = useMemo(
    () => buildDnaRewritePlan({ dnaExplanation, improvedPrompt, source: learnerSource }),
    [dnaExplanation, improvedPrompt, learnerSource],
  );
  const learnerRecipes = useMemo(() => buildLearnerRecipes({ clusters, profile }), [clusters, profile]);
  const learnerProofGallery = useMemo(
    () => buildLearnerProofGallery({ outcomes, screenshots, sessions: learnerSessions }),
    [learnerSessions, outcomes, screenshots],
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
  const trainModeReport = useMemo(
    () =>
      buildTrainModeReport({
        benchmarkRegression,
        curationReport,
        guidedWizard,
        projectBoundaryReport,
        promptMemory,
        proofLearningRuns,
      }),
    [benchmarkRegression, curationReport, guidedWizard, projectBoundaryReport, promptMemory, proofLearningRuns],
  );
  const goldenDataset = useMemo(
    () => buildGoldenDatasetReport(learningExamples, outcomes, datasetVersions),
    [datasetVersions, learningExamples, outcomes],
  );
  const proofProgress = useMemo(
    () => buildProofProgressReport(queueJobs, buildRuns, screenshots, proofLearningRuns, selectedPrompt),
    [buildRuns, proofLearningRuns, queueJobs, screenshots, selectedPrompt],
  );
  const queueProgress = useMemo(
    () => buildQueueProgressReport({ apiEvents, buildRuns, proofLearningRuns, queueJobs, screenshots, selectedPrompt }),
    [apiEvents, buildRuns, proofLearningRuns, queueJobs, screenshots, selectedPrompt],
  );
  const promptMemoryDiff = useMemo(
    () => buildPromptMemoryDiffReport({ current: promptMemory, datasetVersions }),
    [datasetVersions, promptMemory],
  );
  const evolutionDiff = useMemo(
    () => buildEvolutionDiffReport(selectedPrompt, history, closedLoopRuns),
    [closedLoopRuns, history, selectedPrompt],
  );
  const benchmarkTrend = useMemo(() => buildBenchmarkTrendReport(benchmarkRuns), [benchmarkRuns]);
  const hostedBrainReadiness = useMemo(
    () => buildHostedBrainReadinessReport(apiHealth, modelEnvStatus, claudeHealthChecks),
    [apiHealth, claudeHealthChecks, modelEnvStatus],
  );
  const trainingRunSummary = useMemo(() => buildTrainingRunSummary(trainingRuns), [trainingRuns]);
  const modelEvaluationCacheReport = useMemo(() => buildModelEvaluationCacheReport(modelEvaluationCache), [modelEvaluationCache]);
  const promptCandidateTournament = useMemo(
    () => buildPromptCandidateTournament({ candidates: learnedGeneratorVariants, examples: learningExamples, promptMemory }),
    [learnedGeneratorVariants, learningExamples, promptMemory],
  );
  const corpusIntelligence = useMemo(
    () => buildCorpusIntelligenceReport(learningExamples, outcomes),
    [learningExamples, outcomes],
  );
  const benchmarkV2Report = useMemo(
    () => buildBenchmarkV2Report({ examples: learningExamples, runs: benchmarkRuns }),
    [benchmarkRuns, learningExamples],
  );
  const safeToTrain = useMemo(
    () =>
      buildSafeToTrainReport({
        apiOnline: Boolean(apiHealth?.ok || claudeHealthChecks[0]?.apiOnline),
        authRequired: Boolean(apiHealth?.authRequired || claudeHealthChecks[0]?.tokenValid),
        sqliteWritable: Boolean(apiHealth?.sqlitePath || claudeHealthChecks[0]?.sqliteWritable),
        modelRouteWorking: Boolean(claudeHealthChecks[0]?.modelRouteWorking || modelEvaluation?.schemaVersion),
        redactionActive: true,
        queuePostureKnown: Boolean(queueJobs.length || queueProgress.status !== "idle"),
        snapshotWorks: Boolean(datasetVersions.length || backupSnapshots.length || trainingRuns.length),
      }),
    [apiHealth?.authRequired, apiHealth?.ok, apiHealth?.sqlitePath, backupSnapshots.length, claudeHealthChecks, datasetVersions.length, modelEvaluation, queueJobs.length, queueProgress.status, trainingRuns.length],
  );
  const latestEvaluationArtifact = evaluationArtifacts[0];
  const corpusProvenanceFirewall = useMemo(
    () => buildCorpusProvenanceFirewallReport({ examples, curation: fullCorpusCurationReport, leakage: leakageGuard }),
    [examples, fullCorpusCurationReport, leakageGuard],
  );
  const buildResultLearning = useMemo(
    () => buildBuildResultLearningReport({ queueProgress, resultScore, screenshotQa, visualRegression }),
    [queueProgress, resultScore, screenshotQa, visualRegression],
  );
  const promptQualityDna = useMemo(
    () => buildPromptQualityDnaReport({ dnaExplanation, qualityGate, resultScore, screenshotQa }),
    [dnaExplanation, qualityGate, resultScore, screenshotQa],
  );
  const recipeDistiller = useMemo(
    () => buildPromptRecipeDistillerReport({ goldenRecipes, patternExtraction, promptMemory }),
    [goldenRecipes, patternExtraction, promptMemory],
  );
  const modelJudgeComparison = useMemo(
    () => buildModelJudgeComparisonReport({ cacheReport: modelEvaluationCacheReport, qualityGate, resultScore }),
    [modelEvaluationCacheReport, qualityGate, resultScore],
  );
  const benchmarkLibrary = useMemo(
    () => buildBenchmarkLibraryReport({ corpusIntelligence }),
    [corpusIntelligence],
  );
  const promptEditorGuidance = useMemo(
    () => buildPromptEditorGuidance(selectedPrompt),
    [selectedPrompt],
  );
  const guidedTrainingStepper = useMemo(
    () =>
      buildGuidedTrainingStepperReport({
        benchmarkV2: benchmarkV2Report,
        corpusFirewall: corpusProvenanceFirewall,
        corpusIntelligence,
        evaluationArtifacts,
        modelCache: modelEvaluationCacheReport,
        queueProgress,
        safeToTrain,
        trainingSummary: trainingRunSummary,
      }),
    [benchmarkV2Report, corpusIntelligence, corpusProvenanceFirewall, evaluationArtifacts, modelEvaluationCacheReport, queueProgress, safeToTrain, trainingRunSummary],
  );
  const bestNextAction = useMemo(
    () =>
      buildBestNextActionReport({
        benchmarkLibrary,
        buildLearning: buildResultLearning,
        corpusFirewall: corpusProvenanceFirewall,
        modelComparison: modelJudgeComparison,
        promptDna: promptQualityDna,
        safeToTrain,
        stepper: guidedTrainingStepper,
      }),
    [benchmarkLibrary, buildResultLearning, corpusProvenanceFirewall, guidedTrainingStepper, modelJudgeComparison, promptQualityDna, safeToTrain],
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
  const importWizard = useMemo(
    () => buildImportWizardReport({ audit: draftImportAudit, contamination: draftContaminationReport }),
    [draftContaminationReport, draftImportAudit],
  );
  const speedLabeling = useMemo(
    () => buildSpeedLabelingReport({ buildRuns, examples: learningExamples, outcomes, screenshots }),
    [buildRuns, learningExamples, outcomes, screenshots],
  );
  const benchmarkBattle = useMemo(
    () => buildBenchmarkBattleReport({ examples: learningExamples, promptMemory }),
    [learningExamples, promptMemory],
  );
  const calibrationDashboard = useMemo(
    () => buildCalibrationDashboardReport({ evaluationHistory, modelComparison: modelJudgeComparison, modelCache: modelEvaluationCacheReport, resultScore }),
    [evaluationHistory, modelEvaluationCacheReport, modelJudgeComparison, resultScore],
  );
  const hostedHardening = useMemo(
    () => buildHostedHardeningReport({ eventCount: apiEvents.length, hasBackups: Boolean(backupSnapshots.length), hostedSyncScore: hostedSyncReport.score, safeToTrain }),
    [apiEvents.length, backupSnapshots.length, hostedSyncReport.score, safeToTrain],
  );
  const trueClosedLoop = useMemo(
    () =>
      buildTrueClosedLoopReport({
        benchmarkLibrary,
        buildLearning: buildResultLearning,
        candidateTournament: promptCandidateTournament,
        evaluationArtifacts,
        modelComparison: modelJudgeComparison,
        promptDna: promptQualityDna,
        selectedPrompt,
      }),
    [benchmarkLibrary, buildResultLearning, evaluationArtifacts, modelJudgeComparison, promptCandidateTournament, promptQualityDna, selectedPrompt],
  );
  const promptSectionRegeneration = useMemo(
    () => buildPromptSectionRegenerationReport({ editorGuidance: promptEditorGuidance, prompt: selectedPrompt, recipeDistiller }),
    [promptEditorGuidance, recipeDistiller, selectedPrompt],
  );
  const operatorMode = useMemo(
    () => buildOperatorModeReport({ bestNextAction, buildLearning: buildResultLearning, importWizard, mode: onboardingMode, stepper: guidedTrainingStepper }),
    [bestNextAction, buildResultLearning, guidedTrainingStepper, importWizard, onboardingMode],
  );
  const hostedBuildWorker = useMemo(
    () =>
      buildHostedBuildWorkerReport({
        apiOnline: Boolean(apiHealth?.ok),
        authRequired: Boolean(apiHealth?.authRequired),
        hasBuildCommand: Boolean(modelSettings.buildCommand || "npm run build"),
        queueStatus: queueProgress.status,
        trueClosedLoop,
      }),
    [apiHealth?.authRequired, apiHealth?.ok, modelSettings.buildCommand, queueProgress.status, trueClosedLoop],
  );
  const claudeCalibrationSet = useMemo(
    () => buildClaudeCalibrationSetReport({ modelCache: modelEvaluationCacheReport }),
    [modelEvaluationCacheReport],
  );
  const bulkImportPipeline = useMemo(
    () => buildBulkImportPipelineReport({ audit: draftImportAudit, contamination: draftContaminationReport }),
    [draftContaminationReport, draftImportAudit],
  );
  const closedLoopRunDetail = useMemo(
    () => buildClosedLoopRunDetailReport({ runs: closedLoopRuns, buildRuns, screenshots }),
    [buildRuns, closedLoopRuns, screenshots],
  );
  const goldenDatasetV1Lock = useMemo(
    () =>
      buildGoldenDatasetV1LockReport({
        goldCount: goldenDataset.goldCount,
        trainCount: goldenDataset.trainCount,
        testCount: goldenDataset.testCount,
        versions: datasetVersions,
      }),
    [datasetVersions, goldenDataset.goldCount, goldenDataset.testCount, goldenDataset.trainCount],
  );
  const beginnerPromptMaker = useMemo(
    () => buildBeginnerPromptMakerReport({ input: generatorInput, promptMemory }),
    [generatorInput, promptMemory],
  );
  const failureMemoryAutopilot = useMemo(
    () => buildFailureMemoryAutopilotReport({ buildLearning: buildResultLearning, failureMemory, resultScore }),
    [buildResultLearning, failureMemory, resultScore],
  );
  const visualProofComparison = useMemo(
    () => buildVisualProofComparisonReport({ buildRuns, screenshots }),
    [buildRuns, screenshots],
  );
  const modelProviderRouter = useMemo(
    () => buildModelProviderRouterReport({ cache: modelEvaluationCacheReport, settings: modelSettings }),
    [modelEvaluationCacheReport, modelSettings],
  );
  const apiAdminHardening = useMemo(
    () =>
      buildApiAdminHardeningReport({
        backupCount: backupSnapshots.length,
        eventCount: apiEvents.length,
        health: apiHealth,
        hostedHardening,
      }),
    [apiEvents.length, apiHealth, backupSnapshots.length, hostedHardening],
  );
  const workerSandbox = useMemo(
    () =>
      buildWorkerSandboxReport({
        apiAdmin: apiAdminHardening,
        configuredBuildCommand: modelSettings.buildCommand || "npm run build",
        health: apiHealth,
        hostedWorker: hostedBuildWorker,
      }),
    [apiAdminHardening, apiHealth, hostedBuildWorker, modelSettings.buildCommand],
  );
  const proofArtifactStorage = useMemo(
    () => buildProofArtifactStorageReport({ buildRuns, proofArtifacts, screenshots }),
    [buildRuns, proofArtifacts, screenshots],
  );
  const queueObservability = useMemo(
    () => buildQueueObservabilityReport({ apiEvents, proofLearningRuns, queueProgress }),
    [apiEvents, proofLearningRuns, queueProgress],
  );
  const simpleModeCleanup = useMemo(
    () => buildSimpleModeReport({ beginnerPromptMaker, hostedBuildWorker, operatorMode, trueClosedLoop }),
    [beginnerPromptMaker, hostedBuildWorker, operatorMode, trueClosedLoop],
  );
  const datasetGovernance = useMemo(
    () => buildDatasetGovernanceReport({ comparison: datasetComparison, goldenDataset, versions: datasetVersions }),
    [datasetComparison, datasetVersions, goldenDataset],
  );
  const providerPluginLayer = useMemo(
    () => buildProviderPluginLayerReport({ cache: modelEvaluationCacheReport, router: modelProviderRouter }),
    [modelEvaluationCacheReport, modelProviderRouter],
  );
  const evaluatorCalibrationWorkflow = useMemo(
    () => buildEvaluatorCalibrationWorkflowReport({ calibrationDashboard, calibrationSet: claudeCalibrationSet }),
    [calibrationDashboard, claudeCalibrationSet],
  );
  const goldenBenchmarkHarness = useMemo(
    () => buildGoldenBenchmarkHarnessReport(learningExamples),
    [learningExamples],
  );
  const promptGeneratorV2 = useMemo(
    () =>
      buildPromptGeneratorV2Report({
        benchmarkHarness: goldenBenchmarkHarness,
        input: generatorInput,
        promptMemory,
        variants: learnedGeneratorVariants,
      }),
    [generatorInput, goldenBenchmarkHarness, learnedGeneratorVariants, promptMemory],
  );
  const promptCritiqueRepair = useMemo(
    () => buildPromptCritiqueRepairReport({ benchmarkHarness: goldenBenchmarkHarness, prompt: selectedPrompt?.text || promptGeneratorV2.compiledPrompt || generatedPrompt }),
    [generatedPrompt, goldenBenchmarkHarness, promptGeneratorV2.compiledPrompt, selectedPrompt],
  );
  const resultQualityDashboard = useMemo(
    () =>
      buildResultQualityDashboardReport({
        buildRuns,
        generatedPrompt: promptGeneratorV2.compiledPrompt,
        modelCache: modelEvaluationCacheReport,
        proofLearningRuns,
        screenshotJudgeRuns,
        screenshots,
        sourcePrompt: selectedPrompt?.text || generatedPrompt,
      }),
    [buildRuns, generatedPrompt, modelEvaluationCacheReport, promptGeneratorV2.compiledPrompt, proofLearningRuns, screenshotJudgeRuns, screenshots, selectedPrompt],
  );
  const datasetReviewQueue = useMemo(
    () => buildDatasetReviewQueueReport({ curation: fullCorpusCurationReport, examples, outcomes }),
    [examples, fullCorpusCurationReport, outcomes],
  );
  const hostedWorkerOps = useMemo(
    () => buildHostedWorkerOpsReport({ apiEvents, proofArtifacts, queueJobs }),
    [apiEvents, proofArtifacts, queueJobs],
  );
  const measuredQualitySprint = useMemo(
    () =>
      buildMeasuredQualitySprintReport({
        benchmark: goldenBenchmarkHarness,
        critique: promptCritiqueRepair,
        datasetReview: datasetReviewQueue,
        generator: promptGeneratorV2,
        ops: hostedWorkerOps,
        resultQuality: resultQualityDashboard,
        simpleMode: simpleModeCleanup,
      }),
    [datasetReviewQueue, goldenBenchmarkHarness, hostedWorkerOps, promptCritiqueRepair, promptGeneratorV2, resultQualityDashboard, simpleModeCleanup],
  );
  const datasetInbox = useMemo(
    () => buildDatasetInboxReport({ curation: fullCorpusCurationReport, examples, outcomes }),
    [examples, fullCorpusCurationReport, outcomes],
  );
  const proofRunController = useMemo(
    () =>
      buildProofRunControllerReport({
        generatedPrompt: promptGeneratorV2.compiledPrompt,
        hostedWorker: hostedWorkerOps,
        proofLearningRuns,
        queueJobs,
        resultQuality: resultQualityDashboard,
        screenshotJudgeRuns,
        screenshots,
        selectedPrompt,
      }),
    [hostedWorkerOps, promptGeneratorV2.compiledPrompt, proofLearningRuns, queueJobs, resultQualityDashboard, screenshotJudgeRuns, screenshots, selectedPrompt],
  );
  const calibrationProduct = useMemo(
    () =>
      buildCalibrationProductReport({
        calibrationDashboard,
        modelComparison: modelJudgeComparison,
        resultQuality: resultQualityDashboard,
      }),
    [calibrationDashboard, modelJudgeComparison, resultQualityDashboard],
  );
  const hostedReadinessProduct = useMemo(
    () =>
      buildHostedReadinessProductReport({
        apiOnline: Boolean(apiHealth?.ok),
        authRequired: Boolean(apiHealth?.authRequired),
        backupCount: backupSnapshots.length,
        buildCommands: apiHealth?.worker?.allowedBuildCommands || [],
        claudeConfigured: Boolean(modelEnvStatus?.anthropicApiKeyConfigured),
        queueSandboxed: workerSandbox.readiness === "locked",
        sqliteWritable: Boolean(apiHealth?.sqlitePath),
        workerEnabled: Boolean(apiHealth?.worker?.enabled),
      }),
    [apiHealth, backupSnapshots.length, modelEnvStatus?.anthropicApiKeyConfigured, workerSandbox.readiness],
  );
  const qualityRegressionGate = useMemo(
    () =>
      buildQualityRegressionGateReport({
        benchmark: goldenBenchmarkHarness,
        corpusSafetyClean: leakageGuard.status === "clean",
        generator: promptGeneratorV2,
        leakage: leakageGuard,
      }),
    [goldenBenchmarkHarness, leakageGuard, promptGeneratorV2],
  );
  const accessibilityQaScore = useMemo(
    () =>
      buildAccessibilityQaScoreReport({
        generator: promptGeneratorV2,
        qualityGate: qualityRegressionGate,
        screenshotQa,
        visualQa,
      }),
    [promptGeneratorV2, qualityRegressionGate, screenshotQa, visualQa],
  );
  const learnerAnswer = useMemo(
    () => answerLearnerQuestion(learnerQuestion, profile, patternExtraction, archetypePromptPacks),
    [archetypePromptPacks, learnerQuestion, patternExtraction, profile],
  );
  const oneClickExportPack = useMemo(
    () =>
      buildOneClickExportPackText({
        benchmarkTrend,
        codexBuildPack,
        goldenDataset,
        projectBoundaryReport,
        promptMemory,
        qualityGrader: qualityGraderV2,
        reusableMemoryPack,
      }),
    [benchmarkTrend, codexBuildPack, goldenDataset, projectBoundaryReport, promptMemory, qualityGraderV2, reusableMemoryPack],
  );
  const productCommandCenter = useMemo(
    () =>
      buildProductCommandCenterReport({
        calibration: calibrationProduct,
        curation: fullCorpusCurationReport,
        exportsReady: Boolean(latestEvaluationArtifact || evaluationArtifacts.length || oneClickExportPack),
        generator: promptGeneratorV2,
        hosted: hostedReadinessProduct,
        proof: proofRunController,
      }),
    [
      calibrationProduct,
      evaluationArtifacts.length,
      fullCorpusCurationReport,
      hostedReadinessProduct,
      latestEvaluationArtifact,
      oneClickExportPack,
      promptGeneratorV2,
      proofRunController,
    ],
  );
  const hostedBackendKit = useMemo(
    () =>
      buildHostedBackendKitReport({
        admin: apiAdminHardening,
        backupCount: backupSnapshots.length,
        hardening: hostedHardening,
        hosted: hostedReadinessProduct,
        router: modelProviderRouter,
        setupCheckCount: hostedSetupChecks.length,
      }),
    [apiAdminHardening, backupSnapshots.length, hostedHardening, hostedReadinessProduct, hostedSetupChecks.length, modelProviderRouter],
  );
  const promptToProofWorkflow = useMemo(
    () =>
      buildPromptToProofWorkflowReport({
        generator: promptGeneratorV2,
        proof: proofRunController,
        queueJobCount: queueJobs.length,
        resultQuality: resultQualityDashboard,
        selectedPromptTitle: selectedPrompt?.title,
      }),
    [promptGeneratorV2, proofRunController, queueJobs.length, resultQualityDashboard, selectedPrompt?.title],
  );
  const datasetBulkTools = useMemo(() => buildDatasetBulkToolsReport({ inbox: datasetInbox }), [datasetInbox]);
  const preferenceTraining = useMemo(
    () => buildPreferenceTrainingReport({ examples: learningExamples, outcomes, pairwiseReviews }),
    [learningExamples, outcomes, pairwiseReviews],
  );
  const claudeCalibrationProduct = useMemo(
    () =>
      buildClaudeCalibrationProductReport({
        calibration: calibrationProduct,
        hosted: hostedReadinessProduct,
        modelCache: modelEvaluationCacheReport,
        router: modelProviderRouter,
      }),
    [calibrationProduct, hostedReadinessProduct, modelEvaluationCacheReport, modelProviderRouter],
  );
  const briefBuilderProduct = useMemo(
    () => buildBriefBuilderProductReport({ generator: promptGeneratorV2, generatorInput }),
    [generatorInput, promptGeneratorV2],
  );
  const regressionHistoryProduct = useMemo(
    () =>
      buildRegressionHistoryProductReport({
        benchmarkRunCount: benchmarkRuns.length,
        benchmarkV2RunCount: benchmarkV2Runs.length,
        evaluationHistory,
        qualityGate: qualityRegressionGate,
      }),
    [benchmarkRuns.length, benchmarkV2Runs.length, evaluationHistory, qualityRegressionGate],
  );
  const securityCleanupProduct = useMemo(
    () =>
      buildSecurityCleanupProductReport({
        firewall: corpusProvenanceFirewall,
        hosted: hostedReadinessProduct,
        leakage: leakageGuard,
        qualityGate: qualityRegressionGate,
        sourceSafety,
      }),
    [corpusProvenanceFirewall, hostedReadinessProduct, leakageGuard, qualityRegressionGate, sourceSafety],
  );
  const narrativePolish = useMemo(
    () =>
      buildNarrativePolishReport({
        commandCenter: productCommandCenter,
        corpusCount: learningExamples.length,
        generator: promptGeneratorV2,
        proof: promptToProofWorkflow,
      }),
    [learningExamples.length, productCommandCenter, promptGeneratorV2, promptToProofWorkflow],
  );
  const allInRunway = useMemo(
    () =>
      buildAllInRunwayReport({
        briefBuilder: briefBuilderProduct,
        claudeCalibration: claudeCalibrationProduct,
        datasetBulk: datasetBulkTools,
        hostedBackend: hostedBackendKit,
        narrative: narrativePolish,
        preferenceTraining,
        promptToProof: promptToProofWorkflow,
        publicDemoReady: learningExamples.length >= 5 && Boolean(oneClickExportPack),
        regressionHistory: regressionHistoryProduct,
        securityCleanup: securityCleanupProduct,
      }),
    [
      briefBuilderProduct,
      claudeCalibrationProduct,
      datasetBulkTools,
      hostedBackendKit,
      learningExamples.length,
      narrativePolish,
      oneClickExportPack,
      preferenceTraining,
      promptToProofWorkflow,
      regressionHistoryProduct,
      securityCleanupProduct,
    ],
  );
  const autonomousProofLoop = useMemo(
    () =>
      buildAutonomousProofLoopReport({
        hostedWorker: hostedWorkerOps,
        promptToProof: promptToProofWorkflow,
        proofArtifacts: proofArtifactStorage,
        proofController: proofRunController,
        queueJobCount: queueJobs.length,
        resultQuality: resultQualityDashboard,
        screenshotCount: screenshots.length,
      }),
    [hostedWorkerOps, promptToProofWorkflow, proofArtifactStorage, proofRunController, queueJobs.length, resultQualityDashboard, screenshots.length],
  );
  const generatorV3 = useMemo(
    () =>
      buildGeneratorV3Report({
        benchmark: goldenBenchmarkHarness,
        briefBuilder: briefBuilderProduct,
        generator: promptGeneratorV2,
        preferenceTraining,
        promptMemory,
      }),
    [briefBuilderProduct, goldenBenchmarkHarness, preferenceTraining, promptGeneratorV2, promptMemory],
  );
  const benchmarkExpansion = useMemo(
    () => buildBenchmarkExpansionReport(goldenBenchmarkHarness),
    [goldenBenchmarkHarness],
  );
  const learningExplanation = useMemo(
    () =>
      buildLearningExplanationReport({
        promptCoach,
        promptMemoryDiff,
        promptQualityDna,
        selectedPrompt,
        winExplanation,
      }),
    [promptCoach, promptMemoryDiff, promptQualityDna, selectedPrompt, winExplanation],
  );
  const publicDemoPolish = useMemo(
    () =>
      buildPublicDemoPolishReport({
        allInRunway,
        exportPresetCount: exportPresets.length,
        learningExampleCount: learningExamples.length,
        narrative: narrativePolish,
        resultGalleryCount: resultGallery.length,
      }),
    [allInRunway, exportPresets.length, learningExamples.length, narrativePolish, resultGallery.length],
  );
  const hostedCiSmoke = useMemo(
    () =>
      buildHostedCiSmokeReport({
        expectedHeadings: [
          "Product evolution roadmap",
          "Prompt Learner mode",
          "Learning Memory v2",
          "Side-by-side result reviewer",
          "Holdout benchmark regression",
          "Prompt editor studio",
          "Project spaces",
          "Modular architecture cleanup",
          "Public demo experience",
          "Next product sprint",
          "Prompt Atelier Product OS",
          "Accessibility and QA scoring",
          "One guided training run",
          "Corpus cleanup mode",
          "Prompt battle autopilot",
          "Prompt template compiler",
          "Real result feedback loop",
          "Public demo simplification",
          "No-key local mode polish",
          "All-in product runway",
          "Learning machine control plane",
          "Next product layer",
          "Proof seeding runway",
          "Autonomous proof loop",
          "Prompt generator v3",
          "Preference review deck",
          "Training export readiness",
          "Public proof checklist",
          "Credential boundary audit",
        ],
        hasWorkflow: true,
        publicUrl: "https://zakiefer.github.io/prompt-atelier/",
      }),
    [],
  );
  const trainingExportReadiness = useMemo(
    () =>
      buildTrainingExportReadinessReport({
        exportPresets,
        oneClickExportPack,
        projectExportPack,
        reusableMemoryPack,
      }),
    [exportPresets, oneClickExportPack, projectExportPack, reusableMemoryPack],
  );
  const learningMachine = useMemo(
    () =>
      buildLearningMachineReport({
        autonomousProof: autonomousProofLoop,
        benchmarkExpansion,
        explanations: learningExplanation,
        exports: trainingExportReadiness,
        generatorV3,
        hostedBackend: hostedBackendKit,
        hostedCi: hostedCiSmoke,
        preferenceTraining,
        publicDemo: publicDemoPolish,
        resultGalleryCount: resultGallery.length,
      }),
    [
      autonomousProofLoop,
      benchmarkExpansion,
      generatorV3,
      hostedBackendKit,
      hostedCiSmoke,
      learningExplanation,
      preferenceTraining,
      publicDemoPolish,
      resultGallery.length,
      trainingExportReadiness,
    ],
  );
  const hostedApiDeploymentProduct = useMemo(
    () => buildHostedApiDeploymentProductReport({ hostedBackend: hostedBackendKit, hostedCi: hostedCiSmoke }),
    [hostedBackendKit, hostedCiSmoke],
  );
  const autonomousProofBatchProduct = useMemo(
    () =>
      buildAutonomousProofBatchProductReport({
        autonomousProof: autonomousProofLoop,
        generatorV3,
        hostedWorker: hostedWorkerOps,
        promptToProof: promptToProofWorkflow,
      }),
    [autonomousProofLoop, generatorV3, hostedWorkerOps, promptToProofWorkflow],
  );
  const preferenceDatasetV2Product = useMemo(
    () =>
      buildPreferenceDatasetV2ProductReport({
        closedLoopRunCount: closedLoopRuns.length,
        exampleCount: learningExamples.length,
        outcomeCount: outcomes.length,
        pairwiseCount: pairwiseReviews.length,
      }),
    [closedLoopRuns.length, learningExamples.length, outcomes.length, pairwiseReviews.length],
  );
  const generatorModeTestProduct = useMemo(
    () =>
      buildGeneratorModeTestProductReport({
        benchmarkExpansion,
        generatorV3,
        proofRunCount: proofLearningRuns.length,
      }),
    [benchmarkExpansion, generatorV3, proofLearningRuns.length],
  );
  const resultGalleryHydrationProduct = useMemo(
    () =>
      buildResultGalleryHydrationProductReport({
        buildRunCount: buildRuns.length,
        proofArtifactCount: proofArtifacts.length,
        resultGalleryCount: resultGallery.length,
        screenshotCount: screenshots.length,
      }),
    [buildRuns.length, proofArtifacts.length, resultGallery.length, screenshots.length],
  );
  const regressionDashboardV2Product = useMemo(
    () =>
      buildRegressionDashboardV2ProductReport({
        benchmarkRunCount: benchmarkRuns.length,
        benchmarkV2RunCount: benchmarkV2Runs.length,
        evaluationEventCount: evaluationHistory.items.length,
        modelCacheCount: modelEvaluationCache.length,
        trainingRunCount: trainingRuns.length,
      }),
    [benchmarkRuns.length, benchmarkV2Runs.length, evaluationHistory.items.length, modelEvaluationCache.length, trainingRuns.length],
  );
  const nextProductLayer = useMemo(
    () =>
      buildNextProductLayerReport({
        autonomousProofBatch: autonomousProofBatchProduct,
        galleryHydration: resultGalleryHydrationProduct,
        generatorModeTest: generatorModeTestProduct,
        hostedDeployment: hostedApiDeploymentProduct,
        preferenceDataset: preferenceDatasetV2Product,
        regressionDashboard: regressionDashboardV2Product,
        trainingExports: trainingExportReadiness,
      }),
    [
      autonomousProofBatchProduct,
      generatorModeTestProduct,
      hostedApiDeploymentProduct,
      preferenceDatasetV2Product,
      regressionDashboardV2Product,
      resultGalleryHydrationProduct,
      trainingExportReadiness,
    ],
  );
  const productOs = useMemo(
    () =>
      buildPromptProductOsReport({
        accessibilityQa: accessibilityQaScore,
        commandCenter: productCommandCenter,
        datasetInbox,
        generator: generatorV3,
        learningExplanation,
        publicDemo: publicDemoPolish,
        regressionDashboard: regressionDashboardV2Product,
        resultGallery: resultGalleryHydrationProduct,
        trainingExports: trainingExportReadiness,
      }),
    [
      accessibilityQaScore,
      datasetInbox,
      generatorV3,
      learningExplanation,
      productCommandCenter,
      publicDemoPolish,
      regressionDashboardV2Product,
      resultGalleryHydrationProduct,
      trainingExportReadiness,
    ],
  );
  const resultFeedbackLoop = useMemo(
    () =>
      buildResultFeedbackLoopReport({
        accessibilityQa: accessibilityQaScore,
        buildLearning: buildResultLearning,
        proofStorage: proofArtifactStorage,
        resultGallery: resultGalleryHydrationProduct,
        resultQuality: resultQualityDashboard,
        screenshotQa,
        visualProof: visualProofComparison,
      }),
    [
      accessibilityQaScore,
      buildResultLearning,
      proofArtifactStorage,
      resultGalleryHydrationProduct,
      resultQualityDashboard,
      screenshotQa,
      visualProofComparison,
    ],
  );
  const guidedProductRun = useMemo(
    () =>
      buildGuidedProductRunReport({
        commandCenter: productCommandCenter,
        datasetInbox,
        generator: generatorV3,
        proof: proofRunController,
        resultFeedback: resultFeedbackLoop,
        trainingExports: trainingExportReadiness,
        trainingSummary: trainingRunSummary,
      }),
    [datasetInbox, generatorV3, productCommandCenter, proofRunController, resultFeedbackLoop, trainingExportReadiness, trainingRunSummary],
  );
  const corpusCleanupMode = useMemo(
    () =>
      buildCorpusCleanupModeReport({
        cleaning: corpusCleaning,
        datasetInbox,
        leakage: leakageGuard,
        sourceSafety,
      }),
    [corpusCleaning, datasetInbox, leakageGuard, sourceSafety],
  );
  const promptBattleAutopilot = useMemo(
    () =>
      buildPromptBattleAutopilotReport({
        accessibilityQa: accessibilityQaScore,
        candidateTournament: promptCandidateTournament,
        generator: generatorV3,
        promptBattle,
        resultFeedback: resultFeedbackLoop,
      }),
    [accessibilityQaScore, generatorV3, promptBattle, promptCandidateTournament, resultFeedbackLoop],
  );
  const templateCompiler = useMemo(
    () =>
      buildTemplateCompilerReport({
        accessibilityQa: accessibilityQaScore,
        generator: generatorV3,
        qualityGate: qualityRegressionGate,
        templates,
      }),
    [accessibilityQaScore, generatorV3, qualityRegressionGate, templates],
  );
  const localModePolish = useMemo(
    () =>
      buildLocalModePolishReport({
        apiOnline: Boolean(apiHealth?.ok),
        hasServerModelRoute: Boolean(modelEnvStatus?.anthropicApiKeyConfigured || modelEnvStatus?.endpointConfigured || modelEnvStatus?.agentCommandConfigured),
        hosted: hostedReadinessProduct,
        localFallbackActive: !(modelEnvStatus?.anthropicApiKeyConfigured || modelEnvStatus?.apiKeyConfigured),
        providerRouter: modelProviderRouter,
      }),
    [
      apiHealth?.ok,
      hostedReadinessProduct,
      modelEnvStatus?.agentCommandConfigured,
      modelEnvStatus?.anthropicApiKeyConfigured,
      modelEnvStatus?.apiKeyConfigured,
      modelEnvStatus?.endpointConfigured,
      modelProviderRouter,
    ],
  );
  const publicDemoSimplification = useMemo(
    () =>
      buildPublicDemoSimplificationReport({
        hostedCi: hostedCiSmoke,
        localMode: localModePolish,
        productOs,
        publicDemo: publicDemoPolish,
        resultFeedback: resultFeedbackLoop,
      }),
    [hostedCiSmoke, localModePolish, productOs, publicDemoPolish, resultFeedbackLoop],
  );
  const productSprint = useMemo(
    () =>
      buildProductSprintReport({
        battleAutopilot: promptBattleAutopilot,
        cleanupMode: corpusCleanupMode,
        guidedRun: guidedProductRun,
        localMode: localModePolish,
        publicDemo: publicDemoSimplification,
        resultFeedback: resultFeedbackLoop,
        templateCompiler,
    }),
    [corpusCleanupMode, guidedProductRun, localModePolish, promptBattleAutopilot, publicDemoSimplification, resultFeedbackLoop, templateCompiler],
  );
  const promptLearnerMode = useMemo(
    () =>
      buildPromptLearnerModeReport({
        guidedRun: guidedProductRun,
        localMode: localModePolish,
        productOs,
        productSprint,
        publicDemo: publicDemoSimplification,
        resultFeedback: resultFeedbackLoop,
      }),
    [guidedProductRun, localModePolish, productOs, productSprint, publicDemoSimplification, resultFeedbackLoop],
  );
  const learningMemoryV2 = useMemo(
    () =>
      buildLearningMemoryV2Report({
        buildRuns,
        examples: learningExamples,
        outcomes,
        ruleDecisions: memoryRuleDecisions,
        promptQualityDna,
        screenshots,
        templateCompiler,
      }),
    [buildRuns, learningExamples, memoryRuleDecisions, outcomes, promptQualityDna, screenshots, templateCompiler],
  );
  const learnerExportPack = useMemo(
    () =>
      buildLearnerExportPack({
        activeProfile: activeLearningProfile,
        diff: learnerPromptDiff,
        dnaExplanation,
        improvedPrompt,
        learnerSource,
        learningMemory: learningMemoryV2,
        projectExportPack,
        screenshots: selectedScreenshots,
      }),
    [activeLearningProfile, dnaExplanation, improvedPrompt, learnerPromptDiff, learnerSource, learningMemoryV2, projectExportPack, selectedScreenshots],
  );
  const learnerTargetExportPresets = useMemo(
    () =>
      buildTargetExportPresets({
        activeProfile: activeLearningProfile,
        compiledPrompt: learnerHousePrompt,
        improvedPrompt,
        learnerExportPack,
      }),
    [activeLearningProfile, improvedPrompt, learnerExportPack, learnerHousePrompt],
  );
  const resultReviewer = useMemo(
    () =>
      buildResultReviewerReport({
        buildRuns,
        promptQualityDna,
        resultFeedback: resultFeedbackLoop,
        screenshots,
      }),
    [buildRuns, promptQualityDna, resultFeedbackLoop, screenshots],
  );
  const holdoutBenchmark = useMemo(
    () =>
      buildHoldoutBenchmarkReport({
        benchmarkLibrary,
        benchmarkV2: benchmarkV2Report,
        learningMemory: learningMemoryV2,
        qualityGate: qualityRegressionGate,
      }),
    [benchmarkLibrary, benchmarkV2Report, learningMemoryV2, qualityRegressionGate],
  );
  const promptEditorStudio = useMemo(
    () =>
      buildPromptEditorStudioReport({
        editorGuidance: promptEditorGuidance,
        qualityGate: qualityRegressionGate,
        templateCompiler,
      }),
    [promptEditorGuidance, qualityRegressionGate, templateCompiler],
  );
  const projectSpaces = useMemo(
    () =>
      buildProjectSpacesReport({
        cleanupMode: corpusCleanupMode,
        examples: learningExamples,
        savedSpaces: savedProjectSpaces,
      }),
    [corpusCleanupMode, learningExamples, savedProjectSpaces],
  );
  const modularArchitecture = useMemo(
    () =>
      buildModularArchitectureReport({
        moduleNames: ["promptEngine", "productEvolution", "App panels", "engine tests", "README"],
        productReportCount: 9,
      }),
    [],
  );
  const publicDemoExperience = useMemo(
    () =>
      buildPublicDemoExperienceReport({
        learnerMode: promptLearnerMode,
        localMode: localModePolish,
        publicDemo: publicDemoSimplification,
        resultReviewer,
      }),
    [localModePolish, promptLearnerMode, publicDemoSimplification, resultReviewer],
  );
  const productEvolution = useMemo(
    () =>
      buildProductEvolutionReport({
        architecture: modularArchitecture,
        editorStudio: promptEditorStudio,
        holdout: holdoutBenchmark,
        learnerMode: promptLearnerMode,
        memoryV2: learningMemoryV2,
        projectSpaces,
        publicExperience: publicDemoExperience,
        resultReviewer,
      }),
    [
      holdoutBenchmark,
      learningMemoryV2,
      modularArchitecture,
      promptEditorStudio,
      projectSpaces,
      promptLearnerMode,
      publicDemoExperience,
      resultReviewer,
    ],
  );
  const proofSeedingRunway = useMemo(
    () =>
      buildProofSeedingRunwayReport({
        exampleCount: learningExamples.length,
        hostedWorker: hostedWorkerOps,
        promptToProof: promptToProofWorkflow,
        proofRunCount: proofLearningRuns.length,
        queueJobCount: queueJobs.length,
        resultGalleryCount: resultGallery.length,
      }),
    [hostedWorkerOps, learningExamples.length, promptToProofWorkflow, proofLearningRuns.length, queueJobs.length, resultGallery.length],
  );
  const preferenceReviewDeck = useMemo(
    () => buildPreferenceReviewDeckReport({ examples: learningExamples, outcomes, pairwiseReviews }),
    [learningExamples, outcomes, pairwiseReviews],
  );
  const generatorBriefChecklist = useMemo(
    () => buildGeneratorBriefChecklistReport({ briefBuilder: briefBuilderProduct, generator: promptGeneratorV2 }),
    [briefBuilderProduct, promptGeneratorV2],
  );
  const publicProofChecklist = useMemo(
    () =>
      buildPublicProofChecklistReport({
        hostedCi: hostedCiSmoke,
        proofRunCount: proofLearningRuns.length,
        publicDemo: publicDemoPolish,
        resultGalleryCount: resultGallery.length,
        trainingExports: trainingExportReadiness,
      }),
    [hostedCiSmoke, proofLearningRuns.length, publicDemoPolish, resultGallery.length, trainingExportReadiness],
  );
  const regressionTimeline = useMemo(
    () =>
      buildRegressionTimelineReport({
        benchmarkRunCount: benchmarkRuns.length,
        benchmarkV2RunCount: benchmarkV2Runs.length,
        evaluationHistory,
        modelCacheCount: modelEvaluationCache.length,
        proofRunCount: proofLearningRuns.length,
        trainingRunCount: trainingRuns.length,
      }),
    [benchmarkRuns.length, benchmarkV2Runs.length, evaluationHistory, modelEvaluationCache.length, proofLearningRuns.length, trainingRuns.length],
  );
  const securityBoundary = useMemo(
    () =>
      buildSecurityBoundaryReport({
        hosted: hostedReadinessProduct,
        leakage: leakageGuard,
        securityCleanup: securityCleanupProduct,
        sourceSafety,
      }),
    [hostedReadinessProduct, leakageGuard, securityCleanupProduct, sourceSafety],
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
      memoryRuleDecisions,
      projectSpaces: savedProjectSpaces,
      learnerSessions,
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
      trainingRuns,
      modelEvaluationCache,
      promptCandidateRuns,
      corpusClusterRuns,
      benchmarkV2Runs,
      evaluationArtifacts,
      hostedSetupChecks,
      proofArtifacts,
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
      if (stored.memoryRuleDecisions && typeof stored.memoryRuleDecisions === "object" && !Array.isArray(stored.memoryRuleDecisions)) {
        setMemoryRuleDecisions(stored.memoryRuleDecisions as Record<string, MemoryRuleDecision>);
      }
      if (Array.isArray(stored.projectSpaces)) setSavedProjectSpaces((stored.projectSpaces as SavedProjectSpace[]).slice(0, 20));
      if (Array.isArray(stored.learnerSessions)) setLearnerSessions((stored.learnerSessions as LearnerSession[]).slice(0, 60));
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
      if (Array.isArray(stored.trainingRuns)) setTrainingRuns((stored.trainingRuns as TrainingRunRecord[]).slice(0, 100));
      if (Array.isArray(stored.modelEvaluationCache)) setModelEvaluationCache((stored.modelEvaluationCache as ModelEvaluationCacheRecord[]).slice(0, 250));
      if (Array.isArray(stored.promptCandidateRuns)) setPromptCandidateRuns((stored.promptCandidateRuns as PromptCandidateRun[]).slice(0, 80));
      if (Array.isArray(stored.corpusClusterRuns)) setCorpusClusterRuns((stored.corpusClusterRuns as CorpusClusterRun[]).slice(0, 80));
      if (Array.isArray(stored.benchmarkV2Runs)) setBenchmarkV2Runs((stored.benchmarkV2Runs as BenchmarkV2Run[]).slice(0, 80));
      if (Array.isArray(stored.evaluationArtifacts)) setEvaluationArtifacts((stored.evaluationArtifacts as EvaluationArtifact[]).slice(0, 120));
      if (Array.isArray(stored.hostedSetupChecks)) setHostedSetupChecks((stored.hostedSetupChecks as HostedSetupCheck[]).slice(0, 80));
      if (Array.isArray(stored.proofArtifacts)) setProofArtifacts((stored.proofArtifacts as ProofArtifactRecord[]).slice(0, 160));
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
    window.localStorage.setItem(MEMORY_RULE_DECISIONS_KEY, JSON.stringify(memoryRuleDecisions));
    void writeCollection("memoryRuleDecisions", memoryRuleDecisions);
  }, [dbReady, memoryRuleDecisions]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(PROJECT_SPACES_KEY, JSON.stringify(savedProjectSpaces));
    void writeCollection("projectSpaces", savedProjectSpaces);
  }, [dbReady, savedProjectSpaces]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(LEARNER_SESSION_KEY, JSON.stringify(learnerSessions));
    void writeCollection("learnerSessions", learnerSessions);
  }, [dbReady, learnerSessions]);

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
    window.localStorage.setItem(LEARNING_PROFILE_KEY, activeLearningProfile?.id || activeLearningProfileId);
  }, [activeLearningProfile?.id, activeLearningProfileId]);

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
    if (!dbReady) return;
    window.localStorage.setItem(TRAINING_RUN_KEY, JSON.stringify(trainingRuns));
    void writeCollection("trainingRuns", trainingRuns);
  }, [dbReady, trainingRuns]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(MODEL_EVALUATION_CACHE_KEY, JSON.stringify(modelEvaluationCache));
    void writeCollection("modelEvaluationCache", modelEvaluationCache);
  }, [dbReady, modelEvaluationCache]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(PROMPT_CANDIDATE_RUN_KEY, JSON.stringify(promptCandidateRuns));
    void writeCollection("promptCandidateRuns", promptCandidateRuns);
  }, [dbReady, promptCandidateRuns]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(CORPUS_CLUSTER_RUN_KEY, JSON.stringify(corpusClusterRuns));
    void writeCollection("corpusClusterRuns", corpusClusterRuns);
  }, [corpusClusterRuns, dbReady]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(BENCHMARK_V2_RUN_KEY, JSON.stringify(benchmarkV2Runs));
    void writeCollection("benchmarkV2Runs", benchmarkV2Runs);
  }, [benchmarkV2Runs, dbReady]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(EVALUATION_ARTIFACT_KEY, JSON.stringify(evaluationArtifacts));
    void writeCollection("evaluationArtifacts", evaluationArtifacts);
  }, [dbReady, evaluationArtifacts]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(HOSTED_SETUP_CHECK_KEY, JSON.stringify(hostedSetupChecks));
    void writeCollection("hostedSetupChecks", hostedSetupChecks);
  }, [dbReady, hostedSetupChecks]);

  useEffect(() => {
    if (!dbReady) return;
    window.localStorage.setItem(PROOF_ARTIFACT_KEY, JSON.stringify(proofArtifacts));
    void writeCollection("proofArtifacts", proofArtifacts);
  }, [dbReady, proofArtifacts]);

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
        memoryRuleDecisions,
        projectSpaces: savedProjectSpaces,
        learnerSessions,
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
        trainingRuns,
        modelEvaluationCache,
        promptCandidateRuns,
        corpusClusterRuns,
        benchmarkV2Runs,
        evaluationArtifacts,
        hostedSetupChecks,
        proofArtifacts,
      })
        .then(() => setDbStatus("SQLite autosaved"))
        .catch(() => setDbStatus("IndexedDB fallback ready; SQLite autosync failed"));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [activeWorkspace, apiHealth?.ok, backupSnapshots, benchmarkRuns, benchmarkV2Runs, buildRuns, claudeHealthChecks, closedLoopRuns, corpusClusterRuns, curationDecisions, datasetVersions, dbReady, evaluationArtifacts, history, hostedSetupChecks, learnerSessions, lineageNodes, memoryRuleDecisions, modelBatchEvaluations, modelEvaluationCache, mutationTournamentRuns, outcomes, pairwiseReviews, promptCandidateRuns, promptComparisons, proofArtifacts, proofLearningRuns, queueJobs, savedProjectSpaces, screenshotJudgeRuns, screenshotPromptRuns, screenshots, trainingRuns, userPrompts, workspacePackRuns]);

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

  function reviewLearnerCorpusCandidate(row: CorpusReviewRow, action: CorpusCandidateReviewAction, notes: string) {
    if (action === "quarantine") {
      setImportNotice(`Quarantined candidate for review: ${row.title}. ${notes}`.trim());
      return;
    }
    if (action === "merge") {
      setDraftPrompt((current) => [current.trim(), `MERGE NOTE: ${row.title}\n${notes || row.duplicate}`].filter(Boolean).join("\n\n"));
      setImportNotice(`Added merge note for ${row.title}.`);
      return;
    }
    const duplicate = detectDuplicatePrompt(row.text, examples);
    if (duplicate.kind === "exact") {
      setImportNotice(`Skipped exact duplicate: ${duplicate.match?.title ?? row.title}`);
      return;
    }
    const prompt = createCorpusCandidatePrompt(row);
    setUserPrompts((current) => [prompt, ...current]);
    setSelectedId(prompt.id);
    addLineageNode(createCorpusReviewLineageNode(prompt, row, action, notes));
    if (action === "gold" || action === "bad") {
      updateOutcome(prompt, {
        rating: action === "gold" ? "great" : "bad",
        status: action === "gold" ? "gold" : "avoid",
        notes: notes || `Marked ${action} from learner corpus review queue. ${row.reasons.join(" ")}`,
      });
    }
    setImportNotice(`${action === "gold" ? "Imported and marked gold" : action === "bad" ? "Imported and marked bad" : "Imported"}: ${prompt.title}.`);
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

  function setMemoryRuleDecision(ruleId: string, decision: MemoryRuleDecision) {
    setMemoryRuleDecisions((current) => ({ ...current, [ruleId]: decision }));
    setApiNotice(`Learning Memory v2 rule ${decision}: ${ruleId.replace(/-/g, " ")}.`);
  }

  function saveActiveProjectSpace() {
    const preset = activeWorkspacePreset;
    const id = `space-${preset.key}`;
    const space: SavedProjectSpace = {
      id,
      label: preset.label,
      query: preset.query,
      createdAt: new Date().toISOString(),
    };
    setSavedProjectSpaces((current) => [space, ...current.filter((item) => item.id !== id)].slice(0, 20));
    setApiNotice(`Saved project space: ${preset.label}.`);
  }

  function applyResultReviewAction(row: ResultReviewerReport["rows"][number], action: "promote" | "repair" | "exclude") {
    const prompt = examples.find((example) => example.id === row.promptId);
    if (!prompt) {
      setApiNotice("Could not find the prompt behind that review row.");
      return;
    }
    setSelectedId(prompt.id);
    if (action === "promote") {
      updateOutcome(prompt, {
        rating: "great",
        status: "gold",
        notes: `Promoted from side-by-side result reviewer. Build ${row.buildScore}, visual ${row.visualScore}. ${row.action}`,
      });
      setApiNotice(`Promoted ${row.title} to gold from result reviewer.`);
      return;
    }
    if (action === "exclude") {
      updateOutcome(prompt, {
        rating: "bad",
        status: "avoid",
        notes: `Excluded from learning by result reviewer. Build ${row.buildScore}, visual ${row.visualScore}. ${row.action}`,
      });
      setApiNotice(`Excluded ${row.title} from learning.`);
      return;
    }
    const repairPatch = [
      `RESULT REVIEW REPAIR PATCH: ${row.title}`,
      `- Build score: ${row.buildScore}`,
      `- Visual score: ${row.visualScore}`,
      `- Delta: ${row.delta}`,
      `- Reviewer action: ${row.action}`,
      "",
      "Rewrite the prompt to preserve its strongest exact assets, then fix the visual/build gaps before promotion.",
      "",
      prompt.text,
    ].join("\n");
    setImproveText(repairPatch);
    saveVersion("improved", `Reviewer repair - ${row.title}`, repairPatch, evaluatePrompt(repairPatch).score);
    setApiNotice(`Saved reviewer repair patch for ${row.title}.`);
  }

  function saveEditorSectionPatch(card: PromptEditorStudioReport["cards"][number]) {
    const base = selectedPrompt?.text || generatedPrompt;
    const patch = [
      `PROMPT EDITOR SECTION PATCH: ${card.label}`,
      card.rewriteHint,
      "",
      "Apply this section-level repair without replacing unrelated prompt sections.",
      "",
      base,
    ].join("\n");
    saveVersion("compiled", `Editor section - ${card.label}`, patch, evaluatePrompt(patch).score);
    setApiNotice(`Saved ${card.label} editor section patch.`);
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

  function lockGoldenDatasetV1() {
    const version = createDatasetVersionSnapshot({
      buildRuns,
      examples: goldenDataset.rows
        .map((row) => learningExamples.find((example) => example.id === row.id))
        .filter(Boolean) as PromptExample[],
      label: "Golden Dataset v1",
      outcomes,
      score: scoreBreakdown,
      screenshots,
    });
    const lockedVersion: DatasetVersion = {
      ...version,
      label: "Golden Dataset v1",
      notes: [...version.notes, `${goldenDataset.trainCount} train / ${goldenDataset.testCount} test split.`, `${goldenDataset.goldCount} gold-labeled row(s).`],
    };
    setDatasetVersions((current) => [lockedVersion, ...current.filter((item) => item.label.toLowerCase() !== "golden dataset v1")].slice(0, 20));
    setApiNotice(`Locked Golden Dataset v1 with ${goldenDataset.rows.length} row(s).`);
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

  function handleDatasetInboxDecision(promptId: string, action: DatasetInboxReport["rows"][number]["recommendation"]) {
    const prompt = examples.find((item) => item.id === promptId);
    if (!prompt) {
      setApiNotice("Dataset inbox row is no longer available.");
      return;
    }
    if (action === "gold") {
      setCurationDecisions((current) => ({ ...current, [promptId]: "learn" }));
      updateOutcome(prompt, {
        rating: "great",
        status: "gold",
        notes: "Promoted to gold from the Dataset Inbox after product review.",
      });
      setApiNotice(`Promoted ${prompt.title} to gold training material.`);
      return;
    }
    if (action === "remove") {
      if (prompt.source === "user") {
        removePrompt(promptId);
        setApiNotice(`Removed ${prompt.title} from the user corpus.`);
      } else {
        setCurationDecisions((current) => ({ ...current, [promptId]: "quarantine" }));
        setApiNotice(`Quarantined ${prompt.title}; seed examples cannot be deleted from the app.`);
      }
      return;
    }
    setCurationDecisions((current) => ({ ...current, [promptId]: action }));
    setApiNotice(`${prompt.title} marked ${action} from the Dataset Inbox.`);
  }

  function handleBulkDatasetInboxDecision(action: DatasetInboxReport["rows"][number]["recommendation"]) {
    const rows = datasetInbox.rows.filter((row) => row.recommendation === action);
    if (!rows.length) {
      setApiNotice(`No Dataset Inbox row(s) currently recommend ${action}.`);
      return;
    }
    const rowIds = new Set(rows.map((row) => row.promptId));
    const rowPrompts = examples.filter((prompt) => rowIds.has(prompt.id));
    if (action === "remove") {
      const userIds = new Set(rowPrompts.filter((prompt) => prompt.source === "user").map((prompt) => prompt.id));
      const quarantineIds = rowPrompts.filter((prompt) => prompt.source !== "user").map((prompt) => prompt.id);
      if (userIds.size) {
        setUserPrompts((current) => current.filter((prompt) => !userIds.has(prompt.id)));
      }
      if (quarantineIds.length) {
        setCurationDecisions((current) => ({
          ...current,
          ...Object.fromEntries(quarantineIds.map((promptId) => [promptId, "quarantine" as const])),
        }));
      }
      setApiNotice(`Bulk remove handled ${rows.length} row(s): ${userIds.size} deleted, ${quarantineIds.length} quarantined.`);
      return;
    }
    if (action === "gold") {
      setCurationDecisions((current) => ({
        ...current,
        ...Object.fromEntries(rows.map((row) => [row.promptId, "learn" as const])),
      }));
      const now = new Date().toISOString();
      setOutcomes((current) => {
        const byId = new Map(current.map((outcome) => [outcome.promptId, outcome]));
        for (const prompt of rowPrompts) {
          byId.set(prompt.id, {
            promptId: prompt.id,
            title: prompt.title,
            rating: "great",
            status: "gold",
            notes: "Bulk promoted to gold from Dataset Inbox.",
            createdAt: byId.get(prompt.id)?.createdAt || now,
            updatedAt: now,
          });
        }
        return Array.from(byId.values());
      });
      setApiNotice(`Bulk promoted ${rows.length} row(s) to gold training material.`);
      return;
    }
    setCurationDecisions((current) => ({
      ...current,
      ...Object.fromEntries(rows.map((row) => [row.promptId, action])),
    }));
    setApiNotice(`Bulk marked ${rows.length} Dataset Inbox row(s) as ${action}.`);
  }

  function addRecommendedPreferenceLabel() {
    const candidate = preferenceTraining.candidates[0];
    if (!candidate) {
      setApiNotice("No preference pair is ready yet. Add at least two prompts and labels first.");
      return;
    }
    const left = examples.find((prompt) => prompt.id === candidate.leftId);
    const right = examples.find((prompt) => prompt.id === candidate.rightId);
    addPairwiseReview(left, right, candidate.recommendedWinnerId, candidate.reason);
    setApiNotice("Added the recommended pairwise preference label.");
  }

  function addPreferenceDeckLabel(pair: PreferenceReviewDeckReport["pairs"][number], winnerId = pair.recommendedWinnerId) {
    const left = examples.find((prompt) => prompt.id === pair.leftId);
    const right = examples.find((prompt) => prompt.id === pair.rightId);
    addPairwiseReview(left, right, winnerId, pair.reason);
    setApiNotice(`Added preference deck label for ${pair.leftTitle} vs ${pair.rightTitle}.`);
  }

  function applyBriefBuilderPatch() {
    const patch = briefBuilderProduct.suggestedPatch;
    if (!Object.keys(patch).length) {
      setApiNotice("Brief builder is already complete.");
      return;
    }
    setGeneratorInput((current) => ({ ...current, ...patch }));
    setApiNotice(`Filled ${Object.keys(patch).length} missing brief field(s).`);
  }

  function runSecurityCleanup() {
    const quarantineIds = new Set<string>();
    for (const finding of leakageGuard.findings) quarantineIds.add(finding.promptId);
    for (const item of sourceSafety.unsafeItems) quarantineIds.add(item.promptId);
    for (const row of corpusProvenanceFirewall.rows) {
      if (row.decision === "quarantine") quarantineIds.add(row.id);
    }
    if (!quarantineIds.size) {
      setApiNotice("Security cleanup found no unsafe corpus rows to quarantine.");
      return;
    }
    setCurationDecisions((current) => ({
      ...current,
      ...Object.fromEntries(Array.from(quarantineIds).map((promptId) => [promptId, "quarantine" as const])),
    }));
    setApiNotice(`Security cleanup quarantined ${quarantineIds.size} unsafe corpus row(s).`);
  }

  function handleProveGeneratedPrompt() {
    if (apiHealth?.ok && selectedPrompt) {
      void runHostedProofWorker();
      return;
    }

    const now = Date.now();
    const createdAt = new Date(now).toISOString();
    const sourcePrompt =
      selectedPrompt ??
      ({
        id: `generator-v2-${slugify(promptGeneratorV2.variant.title) || "prompt"}-${now}`,
        title: promptGeneratorV2.variant.title || "Generated website prompt",
        text: promptGeneratorV2.compiledPrompt || promptGeneratorV2.variant.prompt || generatedPrompt,
        source: "user" as const,
        createdAt,
      } satisfies PromptExample);
    const promptScore = evaluatePrompt(sourcePrompt.text).score;
    const job = createBuildQueueJob(
      sourcePrompt,
      { title: sourcePrompt.title, prompt: sourcePrompt.text, score: promptScore },
      selectedBuildRun?.resultUrl || "http://127.0.0.1:5173",
    );
    const proofRun: ProofLearningRun = {
      id: `product-proof-${now}`,
      createdAt,
      promptId: sourcePrompt.id,
      title: sourcePrompt.title,
      queueJobId: job.id,
      phase: "queued",
      promptScore,
      resultScore: selectedBuildRun?.score || 0,
      visualScore: screenshotQa.score,
      dnaScore: scorePromptDnaV2(sourcePrompt, undefined, undefined).overall,
      learnedStatus: "queued",
      screenshotCount: selectedScreenshots.length,
      notes: [
        apiHealth?.ok ? "Hosted API is online, but no selected prompt was active; queued the generated prompt locally first." : "API is offline, so the product proof action created a local queue job.",
        "Run the queue or import queue-result.json to finish the proof loop.",
      ],
    };
    if (!selectedPrompt) {
      const historyVersion: PromptVersion = {
        id: `product-proof-version-${now}`,
        kind: "generated",
        title: sourcePrompt.title,
        text: sourcePrompt.text,
        score: promptScore,
        createdAt,
      };
      setUserPrompts((current) => [sourcePrompt, ...current.filter((item) => item.id !== sourcePrompt.id)]);
      setSelectedId(sourcePrompt.id);
      setHistory((current) => [historyVersion, ...current].slice(0, 80));
      addLineageNode({
        id: `lineage-product-proof-source-${sourcePrompt.id}`,
        parentId: null,
        promptId: sourcePrompt.id,
        kind: "source",
        title: sourcePrompt.title,
        score: promptScore,
        status: "generated",
        detail: "Created from Generate Prompt product front door.",
        createdAt,
      });
    }
    setQueueJobs((current) => [job, ...current.filter((item) => item.id !== job.id)].slice(0, 140));
    setProofLearningRuns((current) => [proofRun, ...current.filter((item) => item.id !== proofRun.id)].slice(0, 80));
    addLineageNode({
      id: `lineage-product-proof-queue-${job.id}`,
      parentId: `lineage-source-${sourcePrompt.id}`,
      promptId: sourcePrompt.id,
      kind: "tournament",
      title: job.variantTitle,
      score: job.score,
      status: "queued",
      detail: `Proof job queued in ${job.runFolder}.`,
      createdAt,
    });
    setActiveTrainStage("Run");
    setApiNotice(`Queued product proof for ${sourcePrompt.title}: ${job.id}.`);
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
      apiKey: "",
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

  async function runServerClosedLoopJudge() {
    const source = selectedPrompt ?? {
      id: `generated-${Date.now()}`,
      title: promptCandidateTournament.winner?.title || "Generated prompt",
      text: promptCandidateTournament.finalPrompt || generatedPrompt,
      source: "user" as const,
      createdAt: new Date().toISOString(),
    };
    setModelNotice("Running server-side closed-loop judge...");
    try {
      const result = await runClosedLoopViaApi({
        title: source.title,
        prompt: source.text,
        memory: promptMemory.markdown,
        context: {
          sourceTitle: source.title,
          localQualityGate: qualityGate.score,
          buildResultLearning,
          promptQualityDna,
        },
        settings: modelSettingsPayload(),
      });
      const apiRun = result.run as ClosedLoopRun | undefined;
      const winnerPrompt = modelString(result, "winnerPrompt", apiRun?.winnerPrompt || source.text);
      const originalScore = Number(apiRun?.originalScore ?? evaluatePrompt(source.text).score);
      const improvedScore = Number(apiRun?.improvedScore ?? evaluatePrompt(winnerPrompt).score);
      const createdAt = new Date().toISOString();
      const prompt: PromptExample = {
        id: `closed-loop-api-${slugify(source.title) || "prompt"}-${Date.now()}`,
        title: `${source.title} API refined`,
        text: winnerPrompt,
        source: "user",
        createdAt,
      };
      const run: ClosedLoopRun = apiRun ?? {
        id: `closed-loop-api-run-${Date.now()}`,
        createdAt,
        sourceTitle: source.title,
        originalScore,
        improvedScore,
        winnerTitle: prompt.title,
        winnerPrompt,
        modelMode: "api",
        findings: modelStringArray(result, "findings"),
        recommendations: modelStringArray(result, "recommendations"),
      };
      setClosedLoopRuns((current) => [run, ...current].slice(0, 40));
      setUserPrompts((current) => [prompt, ...current]);
      setSelectedId(prompt.id);
      const historyVersion: PromptVersion = {
        id: `closed-loop-api-version-${Date.now()}`,
        kind: "improved",
        title: prompt.title,
        text: prompt.text,
        score: Math.max(originalScore, improvedScore),
        createdAt,
      };
      setHistory((current) => [historyVersion, ...current].slice(0, 80));
      setImproveText(winnerPrompt);
      setModelNotice(`Server closed-loop judge saved ${prompt.title}: ${originalScore} -> ${improvedScore}.`);
    } catch (error) {
      setModelNotice(`Server closed-loop judge failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function runTrueClosedLoop() {
    const source = selectedPrompt ?? {
      id: `generated-${Date.now()}`,
      title: promptCandidateTournament.winner?.title || "Generated prompt",
      text: promptCandidateTournament.finalPrompt || generatedPrompt,
      source: "user" as const,
      createdAt: new Date().toISOString(),
    };
    const createdAt = new Date().toISOString();
    const localRewrite = comparePromptImprovement(source.text, profile, outcomes, resultScore);
    let winnerPrompt = localRewrite.improvedPrompt;
    let originalScore = localRewrite.originalScore;
    let improvedScore = localRewrite.improvedScore;
    let modelMode = "local-full-loop";
    let findings = [...localRewrite.missingBefore, ...localRewrite.changes].slice(0, 8);
    let recommendations = ["Queued proof for the closed-loop winner.", "Run or import build evidence before promoting to gold."];
    try {
      const result = await runClosedLoopViaApi({
        title: source.title,
        prompt: source.text,
        memory: promptMemory.markdown,
        context: {
          sourceTitle: source.title,
          mode: "generate-build-screenshot-judge-rewrite",
          trueClosedLoop,
          buildResultLearning,
          promptSectionRegeneration,
        },
        settings: modelSettingsPayload(),
      });
      const apiRun = result.run as Partial<ClosedLoopRun> | undefined;
      winnerPrompt = modelString(result, "winnerPrompt", apiRun?.winnerPrompt || winnerPrompt);
      originalScore = Number(apiRun?.originalScore ?? originalScore);
      improvedScore = Number(apiRun?.improvedScore ?? improvedScore);
      modelMode = String(apiRun?.modelMode || "api-closed-loop");
      findings = Array.isArray(apiRun?.findings) ? apiRun.findings : findings;
      recommendations = Array.isArray(apiRun?.recommendations) ? apiRun.recommendations : recommendations;
    } catch {
      // Local loop remains useful without the API route.
    }
    const prompt: PromptExample = {
      id: `true-closed-loop-${slugify(source.title) || "prompt"}-${Date.now()}`,
      title: `${source.title} full-loop winner`,
      text: winnerPrompt,
      source: "user",
      createdAt,
    };
    const run: ClosedLoopRun = {
      id: `true-closed-loop-run-${Date.now()}`,
      createdAt,
      sourceTitle: source.title,
      originalScore,
      improvedScore,
      winnerTitle: prompt.title,
      winnerPrompt,
      modelMode,
      findings,
      recommendations,
    };
    const job = createBuildQueueJob(prompt, { title: prompt.title, prompt: prompt.text, score: improvedScore }, selectedBuildRun?.resultUrl || "http://127.0.0.1:5173");
    const proofRun: ProofLearningRun = {
      id: `true-loop-proof-${Date.now()}`,
      createdAt,
      promptId: prompt.id,
      title: prompt.title,
      queueJobId: job.id,
      phase: "queued",
      promptScore: evaluatePrompt(prompt.text).score,
      resultScore: 0,
      visualScore: 0,
      dnaScore: scorePromptDnaV2(prompt, undefined, undefined).overall,
      learnedStatus: "queued",
      screenshotCount: 0,
      notes: trueClosedLoop.runPlan,
    };
    setClosedLoopRuns((current) => [run, ...current].slice(0, 40));
    setUserPrompts((current) => [prompt, ...current]);
    setSelectedId(prompt.id);
    const historyVersion: PromptVersion = { id: `true-loop-version-${Date.now()}`, kind: "improved", title: prompt.title, text: prompt.text, score: improvedScore, createdAt };
    setHistory((current) => [historyVersion, ...current].slice(0, 80));
    setQueueJobs((current) => [job, ...current.filter((item) => item.id !== job.id)].slice(0, 140));
    setProofLearningRuns((current) => [proofRun, ...current].slice(0, 40));
    setImproveText(winnerPrompt);
    setActiveTrainStage("Run");
    setApiNotice(`True closed loop saved ${prompt.title} and queued proof job ${job.id}.`);
  }

  async function runHostedProofWorker() {
    const source = selectedPrompt ?? {
      id: `generated-${Date.now()}`,
      title: promptCandidateTournament.winner?.title || "Generated prompt",
      text: promptCandidateTournament.finalPrompt || generatedPrompt,
      source: "user" as const,
      createdAt: new Date().toISOString(),
    };
    setApiNotice("Running hosted proof worker: judge, rewrite, scaffold, build, and capture...");
    try {
      const result = await runClosedLoopProofViaApi({
        promptId: source.id,
        title: source.title,
        prompt: source.text,
        memory: promptMemory.markdown,
        buildCommand: modelSettings.buildCommand || "npm run build",
        agentCommand: modelSettings.agentCommand,
        install: true,
        capture: true,
        context: {
          sourceTitle: source.title,
          mode: "hosted-proof-worker",
          promptQualityDna,
          failureMemory: failureMemory.promptPatch,
        },
        settings: modelSettingsPayload(),
      });
      const run = result.run as ClosedLoopRun | undefined;
      const job = result.job as BuildQueueJob | undefined;
      const proofRun = result.proofRun as ProofLearningRun | undefined;
      const collections = result.collections as {
        buildRuns?: unknown[];
        closedLoopRuns?: unknown[];
        lineage?: unknown[];
        proofArtifacts?: unknown[];
        proofLearningRuns?: unknown[];
        queueJobs?: unknown[];
        screenshots?: unknown[];
      } | undefined;
      if (run) setClosedLoopRuns((current) => [run, ...current.filter((item) => item.id !== run.id)].slice(0, 40));
      if (job) setQueueJobs((current) => [job, ...current.filter((item) => item.id !== job.id)].slice(0, 140));
      if (proofRun) setProofLearningRuns((current) => [proofRun, ...current.filter((item) => item.id !== proofRun.id)].slice(0, 80));
      if (Array.isArray(collections?.buildRuns)) setBuildRuns((collections.buildRuns as BuildRunRecord[]).slice(0, 120));
      if (Array.isArray(collections?.closedLoopRuns)) setClosedLoopRuns(collections.closedLoopRuns as ClosedLoopRun[]);
      if (Array.isArray(collections?.lineage)) setLineageNodes((collections.lineage as PromptLineageNode[]).slice(0, 220));
      if (Array.isArray(collections?.proofArtifacts)) setProofArtifacts((collections.proofArtifacts as ProofArtifactRecord[]).slice(0, 160));
      if (Array.isArray(collections?.queueJobs)) setQueueJobs((collections.queueJobs as BuildQueueJob[]).slice(0, 140));
      if (Array.isArray(collections?.proofLearningRuns)) setProofLearningRuns((collections.proofLearningRuns as ProofLearningRun[]).slice(0, 80));
      if (Array.isArray(collections?.screenshots)) setScreenshots((collections.screenshots as ScreenshotRecord[]).slice(0, 120));
      setActiveTrainStage("Run");
      setApiNotice(result.ok ? `Hosted proof worker completed ${job?.id || "the queue job"} and imported returned proof artifacts.` : "Hosted proof worker returned a failed queue result.");
      void refreshApiEvents();
    } catch (error) {
      setApiNotice(`Hosted proof worker failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function applySectionRegeneration(sectionId: string) {
    const section = promptSectionRegeneration.sections.find((item) => item.id === sectionId) ?? promptSectionRegeneration.sections[0];
    if (!section) return;
    const sourceText = selectedPrompt?.text || generatedPrompt;
    const patched = `${sourceText.trim()}\n\n${section.patch}`;
    setImproveText(patched);
    const historyVersion: PromptVersion = {
      id: `section-regeneration-${section.id}-${Date.now()}`,
      kind: "improved",
      title: `${section.label} regeneration patch`,
      text: patched,
      score: evaluatePrompt(patched).score,
      createdAt: new Date().toISOString(),
    };
    setHistory((current) => [historyVersion, ...current].slice(0, 80));
    setApiNotice(`Loaded ${section.label} regeneration patch into the improvement editor.`);
  }

  function applySpeedLabel(candidateId: string) {
    const candidate = speedLabeling.candidates.find((item) => item.id === candidateId);
    const prompt = examples.find((example) => example.id === candidateId);
    if (!candidate || !prompt) return;
    if (candidate.suggestedStatus === "not-website") {
      setCurationDecisions((current) => ({ ...current, [candidate.id]: "quarantine" }));
      setApiNotice(`Quarantined ${candidate.title} as not website training data.`);
      return;
    }
    updateOutcome(prompt, {
      rating: candidate.suggestedRating,
      status: candidate.suggestedStatus,
      notes: `Speed label: ${candidate.reason}`,
    });
  }

  function runBenchmarkBattles() {
    const rows: BenchmarkRun["rows"] = benchmarkBattle.rows.map((row) => ({
      briefId: row.fixtureId,
      title: row.title,
      promptTitle: row.winnerTitle,
      score: row.winnerScore,
      readiness: row.winnerScore >= 82 ? "ready" : row.winnerScore >= 62 ? "needs-review" : "blocked",
      findings: [row.nextAction, ...row.variants.slice(0, 2).map((variant) => `${variant.title}: ${variant.score}`)],
    }));
    const run: BenchmarkRun = {
      id: `benchmark-battle-${Date.now()}`,
      createdAt: new Date().toISOString(),
      suite: "benchmark-battle",
      count: rows.length,
      averageScore: benchmarkBattle.score,
      modelMode: "local-battle",
      rows,
    };
    setBenchmarkRuns((current) => [run, ...current].slice(0, 40));
    setModelNotice(`Benchmark battles recorded ${rows.length} winners at ${benchmarkBattle.score} average.`);
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
      `Prompt ${promptScore}/100, result ${resultScore.score}/100, screenshot ${screenshotQa.score}/100, strength ${dnaV2.overall}/100.`,
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

  function exportLearnerPack() {
    const stamp = Date.now();
    downloadText(`prompt-learner-export-${stamp}.md`, learnerExportPack.markdown, "text/markdown");
    downloadText(`prompt-learner-export-${stamp}.json`, learnerExportPack.json, "application/json");
    setApiNotice("Exported learner pack with prompt markdown, JSON training record, scorecard, memory patch, and screenshot proof refs.");
  }

  function saveLearnerSession(reviewedPrompt: string, acceptedDiffs: string[], rejectedDiffs: string[]) {
    const session = createLearnerSession({
      acceptedDiffs,
      activeProfile: activeLearningProfile,
      benchmarkWinner: {
        title: learnerBattle.winner.title,
        score: learnerBattle.winner.score,
        prompt: learnerBattle.winner.prompt,
      },
      dnaScore: dnaExplanation.overall,
      exportFilesReady: learnerExportPack.files.filter((file) => file.ready).length,
      improvedPrompt,
      promptScore: learnerEvaluation.score,
      rejectedDiffs,
      reviewedPrompt,
      sourcePrompt: learnerSource,
    });
    setLearnerSessions((current) => [session, ...current.filter((item) => item.id !== session.id)].slice(0, 60));
    setApiNotice(`Saved learner session: ${session.title}.`);
  }

  function openLearnerSession(session: LearnerSession) {
    setImproveText(session.sourcePrompt);
    if (learningProfiles.some((item) => item.id === session.profileId)) {
      setActiveLearningProfileId(session.profileId);
    }
    setApiNotice(`Reopened learner session: ${session.title}.`);
  }

  function recordLearnerOutcomeFeedback(rating: OutcomeRating, notes: string, screenshotUrl: string, screenshotNotes: string) {
    const status = outcomeStatusForRating(rating);
    const prompt = selectedPrompt ?? createLearnerFeedbackPrompt(improvedPrompt || learnerSource);
    if (!selectedPrompt) {
      setUserPrompts((current) => [prompt, ...current]);
      setSelectedId(prompt.id);
    }
    updateOutcome(prompt, {
      rating,
      status,
      notes: notes || `Learner outcome feedback recorded as ${rating}.`,
    });
    const screenshotRecord = createLearnerFeedbackScreenshot({ notes, prompt, rating, screenshotNotes, screenshotUrl });
    if (screenshotRecord) addScreenshot(screenshotRecord);
    setApiNotice(`Saved learner feedback for ${prompt.title}: ${rating}.`);
  }

  function exportCodexBuildPack() {
    downloadText(`codex-build-pack-${Date.now()}.md`, codexBuildPack.markdown, "text/markdown");
    downloadText(`codex-build-pack-${Date.now()}.json`, codexBuildPack.json, "application/json");
    setApiNotice("Exported Codex build pack with task, queue, prompt, memory, and QA gates.");
  }

  function exportOneClickTrainingPack() {
    downloadText(`prompt-atelier-full-training-pack-${Date.now()}.json`, oneClickExportPack, "application/json");
    if (goldenDataset.jsonl) {
      downloadText(`prompt-atelier-golden-dataset-v1-${Date.now()}.jsonl`, goldenDataset.jsonl, "application/x-ndjson");
    }
    setApiNotice("Exported full training pack with golden dataset, JSONL, memory, grader, benchmark trend, and build pack.");
  }

  async function trainFromCurrentCorpus() {
    setApiNotice("Training from this corpus: locking dataset, benchmarking, calibrating, and exporting the pack...");
    lockGoldenDatasetV1();
    await runBenchmarkSuite();
    await runModelBatchCalibration();
    exportOneClickTrainingPack();
    setActiveTrainStage("Analyze");
    setApiNotice("Corpus training ladder complete: Golden Dataset v1, benchmark suite, calibration, and export pack are ready.");
  }

  async function runGuidedTraining() {
    const now = new Date().toISOString();
    const localRun: TrainingRunRecord = {
      id: `training-run-local-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      status: "complete",
      stage: "complete",
      source: "corpus",
      inputCounts: { prompts: learningExamples.length, outcomes: outcomes.length, screenshots: screenshots.length },
      scores: {
        starting: Math.max(0, Math.min(100, dnaCalibration.predictedAverage)),
        final: Math.max(0, Math.min(100, Math.round((dnaCalibration.calibratedScore + benchmarkV2Report.score + promptMemoryDiff.score + visualRegression.score) / 4))),
        benchmark: benchmarkV2Report.score,
        memory: promptMemoryDiff.score,
        proof: visualRegression.score,
      },
      benchmarkDelta: benchmarkRegression.delta,
      memoryDiff: promptMemoryDiff,
      artifacts: [
        { id: `artifact-memory-${Date.now()}`, title: "Prompt memory diff", kind: "json", detail: `${promptMemoryDiff.score} memory score` },
        { id: `artifact-benchmark-${Date.now()}`, title: "Benchmark v2", kind: "json", detail: `${benchmarkV2Report.score} benchmark score` },
      ],
      errors: [],
      notes: [
        "Guided workflow completed locally.",
        `${learningExamples.length} prompt(s), ${outcomes.length} label(s), and ${screenshots.length} screenshot(s) were included.`,
      ],
    };
    setTrainingRuns((current) => [localRun, ...current.filter((item) => item.id !== localRun.id)].slice(0, 100));
    setActiveTrainStage("Export");
    setApiNotice(`Recorded local guided training run at score ${localRun.scores.final}. Syncing API if available...`);
    try {
      const result = await createTrainingRun({
        source: "corpus",
        promptCount: learningExamples.length,
        outcomeCount: outcomes.length,
        screenshotCount: screenshots.length,
        benchmarkScore: benchmarkV2Report.score,
        memoryScore: promptMemoryDiff.score,
        proofScore: visualRegression.score,
        benchmarkDelta: benchmarkRegression.delta,
        memoryDiff: promptMemoryDiff,
        artifacts: localRun.artifacts,
      });
      const apiRun = result.trainingRun as TrainingRunRecord | undefined;
      if (apiRun?.id) {
        setTrainingRuns((current) => [apiRun, ...current.filter((item) => item.id !== apiRun.id && item.id !== localRun.id)].slice(0, 100));
        setApiNotice(`API guided training run saved at score ${apiRun.scores.final}.`);
      }
    } catch (error) {
      setApiNotice(`Local guided training run saved. API sync unavailable: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function runCachedModelEvaluation() {
    const prompt = selectedPrompt ?? { id: "generated", title: "Generated prompt", text: generatedPrompt, source: "user" as const, createdAt: new Date().toISOString() };
    const localScore = evaluatePrompt(prompt.text).score;
    const localRecord: ModelEvaluationCacheRecord = {
      id: `cache-local-${Date.now()}`,
      promptHash: `${prompt.id}-${prompt.text.length}`,
      memoryHash: `${promptMemory.markdown.length}-${promptMemory.sections.length}`,
      provider: modelSettings.provider || "local",
      schemaVersion: "prompt-atelier.model-evaluation.v1",
      score: localScore,
      localScore,
      delta: 0,
      readiness: localScore >= 80 ? "ready" : "needs-review",
      findings: [`Local cached evaluation for ${prompt.title}.`],
      recommendations: localScore >= 80 ? ["Promote after visual proof."] : ["Run a mutation loop before promotion."],
      createdAt: new Date().toISOString(),
    };
    setModelEvaluationCache((current) => [localRecord, ...current.filter((item) => item.id !== localRecord.id)].slice(0, 250));
    setApiNotice(`Cached local model agreement row for ${prompt.title}.`);
    try {
      const result = await evaluateWithModelCache({
        prompt: prompt.text,
        memory: promptMemory.markdown,
        context: { title: prompt.title, selectedPromptId: prompt.id },
        settings: {
          provider: modelSettings.provider,
          endpoint: modelSettings.endpoint,
          model: modelSettings.model,
          temperature: modelSettings.temperature,
        },
      });
      const cacheRecord = result.cacheRecord as ModelEvaluationCacheRecord | undefined;
      if (cacheRecord?.id) {
        setModelEvaluationCache((current) => [cacheRecord, ...current.filter((item) => item.id !== cacheRecord.id && item.id !== localRecord.id)].slice(0, 250));
        setApiNotice(`Cached API model evaluation for ${prompt.title}.`);
      }
    } catch (error) {
      setApiNotice(`Local model cache row saved. API cache unavailable: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function runCandidateQualityLoop() {
    const report = buildPromptCandidateTournament({ candidates: learnedGeneratorVariants, examples: learningExamples, promptMemory });
    const run: PromptCandidateRun = {
      id: `candidate-run-${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: "generator",
      report,
      notes: report.explanation,
    };
    setPromptCandidateRuns((current) => [run, ...current.filter((item) => item.id !== run.id)].slice(0, 80));
    setImproveText(report.finalPrompt);
    setMutationSource(report.winner.prompt);
    setApiNotice(`Candidate quality loop picked ${report.winner.title} at score ${report.winner.score}.`);
  }

  async function runCorpusIntelligence() {
    const report = buildCorpusIntelligenceReport(learningExamples, outcomes);
    const run: CorpusClusterRun = {
      id: `corpus-intelligence-${Date.now()}`,
      createdAt: new Date().toISOString(),
      count: learningExamples.length,
      report,
      notes: report.suggestions.slice(0, 4),
    };
    setCorpusClusterRuns((current) => [run, ...current.filter((item) => item.id !== run.id)].slice(0, 80));
    setApiNotice(`Corpus intelligence scored ${report.score} across ${report.clusters.length} cluster(s).`);
    try {
      const result = await analyzeCorpusViaApi({ examples: learningExamples });
      const apiRun = result.run as CorpusClusterRun | undefined;
      if (apiRun?.id && apiRun.report) {
        setCorpusClusterRuns((current) => [{ ...apiRun, notes: apiRun.notes ?? apiRun.report.suggestions ?? [] }, ...current.filter((item) => item.id !== apiRun.id && item.id !== run.id)].slice(0, 80));
        setApiNotice(`API corpus intelligence scored ${apiRun.report.score}.`);
      }
    } catch (error) {
      setApiNotice(`Local corpus intelligence saved. API analysis unavailable: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function runBenchmarkV2() {
    const report = buildBenchmarkV2Report({ examples: learningExamples, runs: benchmarkRuns });
    const run: BenchmarkV2Run = {
      id: `benchmark-v2-${Date.now()}`,
      createdAt: new Date().toISOString(),
      count: report.rows.length,
      score: report.score,
      report,
      notes: report.summary,
    };
    setBenchmarkV2Runs((current) => [run, ...current.filter((item) => item.id !== run.id)].slice(0, 80));
    setApiNotice(`Benchmark v2 recorded locally at ${report.score}.`);
    try {
      const result = await runBenchmarkV2ViaApi({ examples: learningExamples });
      const apiRun = result.run as BenchmarkV2Run | undefined;
      if (apiRun?.id && apiRun.report) {
        setBenchmarkV2Runs((current) => [{ ...apiRun, notes: apiRun.notes ?? apiRun.report.summary ?? [] }, ...current.filter((item) => item.id !== apiRun.id && item.id !== run.id)].slice(0, 80));
        setApiNotice(`API benchmark v2 recorded at ${apiRun.report.score}.`);
      }
    } catch (error) {
      setApiNotice(`Local benchmark v2 saved. API benchmark unavailable: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function runAutonomousProofLoop() {
    handleProveGeneratedPrompt();
    runProofLearningLoop();
    void runTrueClosedLoop();
    void runScreenshotJudge();
    void runBenchmarkV2();
    setApiNotice("Autonomous proof loop queued proof, local proof learning, closed-loop rewrite, screenshot judge, and benchmark v2.");
  }

  function applyGeneratorV3Mode(mode: GeneratorV3Report["modes"][number]) {
    setGeneratorInput((current) => ({
      ...current,
      ...mode.patch,
      goal: current.goal || "turn learned prompt patterns into a build-ready, proof-ready website brief",
      outputTarget: current.outputTarget || "Codex build prompt",
      strictness: Math.max(current.strictness || 0, 9),
    }));
    setApiNotice(`Applied Generator v3 mode: ${mode.label}.`);
  }

  function runHostedSmoke() {
    void copyText(hostedCiSmoke.workflowPatch, "hosted-smoke");
    setApiNotice("Copied the hosted smoke command. CI runs the same smoke after Pages deploy.");
  }

  async function createSelectedEvaluationArtifact() {
    const prompt = selectedPrompt ?? { id: "generated", title: "Generated prompt", text: generatedPrompt, source: "user" as const, createdAt: new Date().toISOString() };
    const artifact = buildEvaluationArtifact({
      prompt,
      promptMemory,
      qualityGate,
      sourceExamples: learningExamples.slice(0, 5),
      visualRegression,
    });
    setEvaluationArtifacts((current) => [artifact, ...current.filter((item) => item.id !== artifact.id)].slice(0, 120));
    setApiNotice(`Created local evaluation artifact for ${prompt.title}.`);
    try {
      const result = await createEvaluationArtifact({
        prompt,
        promptMemory,
        qualityGate,
        visualRegression,
        score: qualityGate.score,
      });
      const apiArtifact = result.artifact as Partial<EvaluationArtifact> | undefined;
      if (apiArtifact?.id && apiArtifact.markdown) {
        const normalized: EvaluationArtifact = {
          id: apiArtifact.id,
          title: apiArtifact.title || artifact.title,
          markdown: apiArtifact.markdown,
          json: apiArtifact.json || artifact.json,
          influences: Array.isArray(apiArtifact.influences) ? apiArtifact.influences : artifact.influences,
          rulesUsed: Array.isArray(apiArtifact.rulesUsed) ? apiArtifact.rulesUsed : artifact.rulesUsed,
          proofStatus: apiArtifact.proofStatus || artifact.proofStatus,
          nextMutation: apiArtifact.nextMutation || artifact.nextMutation,
        };
        setEvaluationArtifacts((current) => [normalized, ...current.filter((item) => item.id !== normalized.id && item.id !== artifact.id)].slice(0, 120));
        setApiNotice(`API evaluation artifact created for ${prompt.title}.`);
      }
    } catch (error) {
      setApiNotice(`Local evaluation artifact saved. API artifact route unavailable: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function runHostedSetupWizard() {
    const report = buildSafeToTrainReport({
      apiOnline: Boolean(apiHealth?.ok || claudeHealthChecks[0]?.apiOnline),
      authRequired: Boolean(apiHealth?.authRequired || claudeHealthChecks[0]?.tokenValid),
      sqliteWritable: Boolean(apiHealth?.sqlitePath || claudeHealthChecks[0]?.sqliteWritable),
      modelRouteWorking: Boolean(claudeHealthChecks[0]?.modelRouteWorking || modelEvaluation?.schemaVersion),
      redactionActive: true,
      queuePostureKnown: Boolean(queueJobs.length || queueProgress.status !== "idle"),
      snapshotWorks: Boolean(datasetVersions.length || backupSnapshots.length || trainingRuns.length),
    });
    const check: HostedSetupCheck = {
      id: `hosted-setup-${Date.now()}`,
      createdAt: new Date().toISOString(),
      report,
      notes: report.blocking.length ? report.blocking : ["Safe-to-train checks passed locally."],
    };
    setHostedSetupChecks((current) => [check, ...current.filter((item) => item.id !== check.id)].slice(0, 80));
    setApiNotice(report.safe ? "Safe-to-train setup check passed." : `Safe-to-train needs attention: ${report.blocking[0] ?? "review checklist"}`);
    try {
      await checkApi();
    } catch {
      // checkApi already writes the user-facing notice.
    }
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
      memoryRuleDecisions,
      projectSpaces: savedProjectSpaces,
      learnerSessions,
      modelBatchEvaluations,
      pairwiseReviews,
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
      trainingRuns,
      modelEvaluationCache,
      promptCandidateRuns,
      corpusClusterRuns,
      benchmarkV2Runs,
      evaluationArtifacts,
      hostedSetupChecks,
      proofArtifacts,
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
    if (collections.memoryRuleDecisions) setMemoryRuleDecisions(collections.memoryRuleDecisions);
    if (Array.isArray(collections.projectSpaces)) setSavedProjectSpaces(collections.projectSpaces);
    if (Array.isArray(collections.learnerSessions)) setLearnerSessions(collections.learnerSessions);
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
    if (Array.isArray(collections.trainingRuns)) setTrainingRuns(collections.trainingRuns);
    if (Array.isArray(collections.modelEvaluationCache)) setModelEvaluationCache(collections.modelEvaluationCache);
    if (Array.isArray(collections.promptCandidateRuns)) setPromptCandidateRuns(collections.promptCandidateRuns);
    if (Array.isArray(collections.corpusClusterRuns)) setCorpusClusterRuns(collections.corpusClusterRuns);
    if (Array.isArray(collections.benchmarkV2Runs)) setBenchmarkV2Runs(collections.benchmarkV2Runs);
    if (Array.isArray(collections.evaluationArtifacts)) setEvaluationArtifacts(collections.evaluationArtifacts);
    if (Array.isArray(collections.hostedSetupChecks)) setHostedSetupChecks(collections.hostedSetupChecks);
    if (Array.isArray(collections.proofArtifacts)) setProofArtifacts((collections.proofArtifacts as ProofArtifactRecord[]).slice(0, 160));
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

  async function operateQueueJob(id: string, action: "retry" | "cancel" | "remove") {
    const updatedAt = new Date().toISOString();
    setQueueJobs((current) => {
      if (action === "remove") return current.filter((job) => job.id !== id);
      return current.map((job) => job.id === id
        ? {
            ...job,
            status: action === "retry" ? "queued" : "failed",
            updatedAt,
            notes: [
              action === "retry" ? "Queued for retry from worker operations." : "Canceled from worker operations.",
              ...job.notes,
            ].slice(0, 8),
          }
        : job);
    });
    if (!apiHealth?.ok) {
      setApiNotice(`Updated ${id} locally; sync when the API is online.`);
      return;
    }
    try {
      const result = await updateQueueJob(id, action);
      if (Array.isArray(result.collections.queueJobs)) setQueueJobs((result.collections.queueJobs as BuildQueueJob[]).slice(0, 140));
      setApiNotice(`Queue job ${action} recorded for ${id}.`);
      void refreshApiEvents();
    } catch (error) {
      setApiNotice(`Queue job ${action} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
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
        memoryRuleDecisions,
        projectSpaces: savedProjectSpaces,
        learnerSessions,
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
        trainingRuns,
        modelEvaluationCache,
        promptCandidateRuns,
        corpusClusterRuns,
        benchmarkV2Runs,
        evaluationArtifacts,
        hostedSetupChecks,
        proofArtifacts,
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
      if (collections.memoryRuleDecisions && typeof collections.memoryRuleDecisions === "object" && !Array.isArray(collections.memoryRuleDecisions)) {
        setMemoryRuleDecisions(collections.memoryRuleDecisions as Record<string, MemoryRuleDecision>);
        restored.push("memory decisions");
      }
      if (Array.isArray(collections.projectSpaces)) {
        setSavedProjectSpaces((collections.projectSpaces as SavedProjectSpace[]).slice(0, 20));
        restored.push("project spaces");
      }
      if (Array.isArray(collections.learnerSessions)) {
        setLearnerSessions((collections.learnerSessions as LearnerSession[]).slice(0, 60));
        restored.push("learner sessions");
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
      if (Array.isArray(collections.trainingRuns)) {
        setTrainingRuns((collections.trainingRuns as TrainingRunRecord[]).slice(0, 100));
        restored.push("training runs");
      }
      if (Array.isArray(collections.modelEvaluationCache)) {
        setModelEvaluationCache((collections.modelEvaluationCache as ModelEvaluationCacheRecord[]).slice(0, 250));
        restored.push("model cache");
      }
      if (Array.isArray(collections.promptCandidateRuns)) {
        setPromptCandidateRuns((collections.promptCandidateRuns as PromptCandidateRun[]).slice(0, 80));
        restored.push("candidate runs");
      }
      if (Array.isArray(collections.corpusClusterRuns)) {
        setCorpusClusterRuns((collections.corpusClusterRuns as CorpusClusterRun[]).slice(0, 80));
        restored.push("corpus intelligence");
      }
      if (Array.isArray(collections.benchmarkV2Runs)) {
        setBenchmarkV2Runs((collections.benchmarkV2Runs as BenchmarkV2Run[]).slice(0, 80));
        restored.push("benchmark v2");
      }
      if (Array.isArray(collections.evaluationArtifacts)) {
        setEvaluationArtifacts((collections.evaluationArtifacts as EvaluationArtifact[]).slice(0, 120));
        restored.push("evaluation artifacts");
      }
      if (Array.isArray(collections.hostedSetupChecks)) {
        setHostedSetupChecks((collections.hostedSetupChecks as HostedSetupCheck[]).slice(0, 80));
        restored.push("setup checks");
      }
      if (Array.isArray(collections.proofArtifacts)) {
        setProofArtifacts((collections.proofArtifacts as ProofArtifactRecord[]).slice(0, 160));
        restored.push("proof artifacts");
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
        collections: {
          userPrompts,
          history,
          outcomes,
          screenshots,
          buildRuns,
          queueJobs,
          lineage: lineageNodes,
          datasetVersions,
          curationDecisions,
          memoryRuleDecisions,
          projectSpaces: savedProjectSpaces,
          learnerSessions,
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
          trainingRuns,
          modelEvaluationCache,
          promptCandidateRuns,
          corpusClusterRuns,
          benchmarkV2Runs,
          evaluationArtifacts,
          hostedSetupChecks,
          proofArtifacts,
        },
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
      if (collections.memoryRuleDecisions && typeof collections.memoryRuleDecisions === "object" && !Array.isArray(collections.memoryRuleDecisions)) {
        setMemoryRuleDecisions(collections.memoryRuleDecisions as Record<string, MemoryRuleDecision>);
        restored.push("memory decisions");
      }
      if (Array.isArray(collections.projectSpaces)) {
        setSavedProjectSpaces((collections.projectSpaces as SavedProjectSpace[]).slice(0, 20));
        restored.push("project spaces");
      }
      if (Array.isArray(collections.learnerSessions)) {
        setLearnerSessions((collections.learnerSessions as LearnerSession[]).slice(0, 60));
        restored.push("learner sessions");
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
      if (Array.isArray(collections.trainingRuns)) {
        setTrainingRuns((collections.trainingRuns as TrainingRunRecord[]).slice(0, 100));
        restored.push("training runs");
      }
      if (Array.isArray(collections.modelEvaluationCache)) {
        setModelEvaluationCache((collections.modelEvaluationCache as ModelEvaluationCacheRecord[]).slice(0, 250));
        restored.push("model cache");
      }
      if (Array.isArray(collections.promptCandidateRuns)) {
        setPromptCandidateRuns((collections.promptCandidateRuns as PromptCandidateRun[]).slice(0, 80));
        restored.push("candidate runs");
      }
      if (Array.isArray(collections.corpusClusterRuns)) {
        setCorpusClusterRuns((collections.corpusClusterRuns as CorpusClusterRun[]).slice(0, 80));
        restored.push("corpus intelligence");
      }
      if (Array.isArray(collections.benchmarkV2Runs)) {
        setBenchmarkV2Runs((collections.benchmarkV2Runs as BenchmarkV2Run[]).slice(0, 80));
        restored.push("benchmark v2");
      }
      if (Array.isArray(collections.evaluationArtifacts)) {
        setEvaluationArtifacts((collections.evaluationArtifacts as EvaluationArtifact[]).slice(0, 120));
        restored.push("evaluation artifacts");
      }
      if (Array.isArray(collections.hostedSetupChecks)) {
        setHostedSetupChecks((collections.hostedSetupChecks as HostedSetupCheck[]).slice(0, 80));
        restored.push("setup checks");
      }
      if (Array.isArray(collections.proofArtifacts)) {
        setProofArtifacts((collections.proofArtifacts as ProofArtifactRecord[]).slice(0, 160));
        restored.push("proof artifacts");
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
          memoryRuleDecisions: collections.memoryRuleDecisions ?? memoryRuleDecisions,
          projectSpaces: collections.projectSpaces ?? savedProjectSpaces,
          learnerSessions: collections.learnerSessions ?? learnerSessions,
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
          trainingRuns: collections.trainingRuns ?? trainingRuns,
          modelEvaluationCache: collections.modelEvaluationCache ?? modelEvaluationCache,
          promptCandidateRuns: collections.promptCandidateRuns ?? promptCandidateRuns,
          corpusClusterRuns: collections.corpusClusterRuns ?? corpusClusterRuns,
          benchmarkV2Runs: collections.benchmarkV2Runs ?? benchmarkV2Runs,
          evaluationArtifacts: collections.evaluationArtifacts ?? evaluationArtifacts,
          hostedSetupChecks: collections.hostedSetupChecks ?? hostedSetupChecks,
          proofArtifacts: collections.proofArtifacts ?? proofArtifacts,
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

  const isPublicDemoRoute =
    typeof window !== "undefined" &&
    (/\/demo\/?$/.test(window.location.pathname) || new URLSearchParams(window.location.search).get("mode") === "demo");

  if (isPublicDemoRoute) {
    return (
      <PublicDemoRoute
        activeLearningProfile={activeLearningProfile}
        copied={copied}
        dnaExplanation={dnaExplanation}
        improvedPrompt={improvedPrompt}
        learnerEvaluation={learnerEvaluation}
        learnerExportPack={learnerExportPack}
        learnerText={improveText}
        learningProfiles={learningProfiles}
        samplePrompts={learnerSamples}
        targetExportPresets={learnerTargetExportPresets}
        onCopy={(value, key) => void copyText(value, key)}
        onExportLearnerPack={exportLearnerPack}
        onSaveImproved={() => saveVersion("improved", "Demo improved prompt", improvedPrompt, evaluatePrompt(improvedPrompt).score)}
        onUseSamplePrompt={setImproveText}
        profile={profile}
        selectedPrompt={selectedPrompt}
        setActiveLearningProfileId={setActiveLearningProfileId}
        setLearnerText={setImproveText}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">
          <span>PA</span>
        </div>
        <div>
          <p className="eyebrow">Prompt review workbench</p>
          <h1>Website prompt learner</h1>
        </div>
        <div className="topbar-actions" aria-label="Corpus metrics">
          <Metric value={formatNumber(profile.exampleCount)} label="Examples" />
          <Metric value={formatNumber(clusters.length)} label="Archetypes" />
          <Metric value={addPercent(dnaScore)} label="Prompt strength" />
        </div>
      </header>

      <main className="workspace">
        <div className="workspace-actions" aria-label="Workspace inspectors">
          <button className="ghost-button compact-button" type="button" onClick={() => setOpenInspector("corpus")}>
            <BookOpen size={15} />
            Corpus
          </button>
          <button className="ghost-button compact-button" type="button" onClick={() => setOpenInspector("rules")}>
            <Lightbulb size={15} />
            Rules
          </button>
        </div>

        {openInspector ? <button className="drawer-scrim" type="button" aria-label="Close inspector" onClick={() => setOpenInspector(null)} /> : null}

        <aside className={`panel left-panel side-drawer ${openInspector === "corpus" ? "open" : ""}`} data-inspector="corpus">
          <div className="panel-header">
            <BookOpen size={18} />
            <h2>Training corpus</h2>
            <button className="icon-button drawer-close" type="button" aria-label="Close corpus inspector" onClick={() => setOpenInspector(null)}>
              <X size={15} />
            </button>
          </div>

          <div className="import-box">
            <textarea
              value={draftPrompt}
              onChange={(event) => setDraftPrompt(event.target.value)}
              placeholder="Paste another excellent website prompt here..."
            />
            <DraftIngestionPreflight report={draftContaminationReport} />
            {draftAnalysis ? <SmartIngestion analysis={draftAnalysis} /> : null}
            {draftBatchCandidates.length > 1 ? <BatchIngestionPreview audit={draftImportAudit} candidateCount={draftBatchCandidates.length} /> : null}
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
                disabled={draftAnalysis?.duplicate.kind === "exact" || draftContaminationReport.status === "block"}
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
            <TabButton active={tab === "compose"} icon={<Hammer size={16} />} onClick={() => setTab("compose")}>
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
            <TabButton active={tab === "train"} icon={<ListChecks size={16} />} onClick={() => setTab("train")}>
              Train
            </TabButton>
          </nav>

          {tab === "learn" ? (
            <LearnView
              activeLearningProfile={activeLearningProfile}
              batchAudit={draftImportAudit}
              batchCandidateCount={draftBatchCandidates.length}
              clusters={clusters}
              compiledPrompt={learnerHousePrompt}
              corpusReviewRows={learnerCorpusReviewRows}
              copied={copied}
              dnaExplanation={dnaExplanation}
              dnaScore={dnaScore}
              improvedPrompt={improvedPrompt}
              learnerBattle={learnerBattle}
              corpusNeighbors={learnerCorpusNeighbors}
              dnaRewrites={learnerDnaRewrites}
              learnerDiff={learnerPromptDiff}
              learnerEvaluation={learnerEvaluation}
              learnerExportPack={learnerExportPack}
              learnerProofGallery={learnerProofGallery}
              learnerRecipes={learnerRecipes}
              learnerText={improveText}
              learningProfiles={learningProfiles}
              holdoutBenchmark={holdoutBenchmark}
              samplePrompts={learnerSamples}
              savedLearnerSessions={learnerSessions}
              targetExportPresets={learnerTargetExportPresets}
              onCopy={(value, key) => void copyText(value, key)}
              onCopyImproved={() => void copyText(improvedPrompt, "learner-improved")}
              onExportLearnerPack={exportLearnerPack}
              onOpenLearnerSession={openLearnerSession}
              onRecordOutcomeFeedback={recordLearnerOutcomeFeedback}
              onReviewCorpusCandidate={reviewLearnerCorpusCandidate}
              onSaveBattleWinner={() => saveVersion("tournament", learnerBattle.winner.title, learnerBattle.winner.prompt, learnerBattle.winner.score)}
              onSaveCompiledPrompt={() => saveVersion("compiled", "House-format compiled prompt", learnerHousePrompt, evaluatePrompt(learnerHousePrompt).score)}
              onSaveImproved={() => saveVersion("improved", "One-click improved prompt", improvedPrompt, evaluatePrompt(improvedPrompt).score)}
              onSaveLearnerSession={saveLearnerSession}
              onSaveReviewedDiff={(text) => saveVersion("merged", "Reviewed learner diff", text, evaluatePrompt(text).score)}
              onUseSamplePrompt={setImproveText}
              profile={profile}
              selectedAnalysis={selectedAnalysis}
              selectedPrompt={selectedPrompt}
              setActiveLearningProfileId={setActiveLearningProfileId}
              setLearnerText={setImproveText}
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
              benchmarkTrend={benchmarkTrend}
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
              evolutionDiff={evolutionDiff}
              exportPresets={exportPresets}
              failureMemory={failureMemory}
              improvedPrompt={improvedPrompt}
              improveText={improveText}
              interviewBrief={interviewBrief}
              interviewPrompt={interviewPrompt}
              goldenRecipes={goldenRecipes}
              goldenChallengeBoard={goldenChallengeBoard}
              goldenDataset={goldenDataset}
              goldReview={goldReview}
              guidedWizard={guidedWizard}
              qualityGraderV2={qualityGraderV2}
              generatorPresets={generatorPresets}
              generatorInput={generatorInput}
              hostedSyncReport={hostedSyncReport}
              hostedBrainReadiness={hostedBrainReadiness}
              learnerAnswer={learnerAnswer}
              learnerQuestion={learnerQuestion}
              learnedGeneratorVariants={learnedGeneratorVariants}
              trainingRunSummary={trainingRunSummary}
              modelEvaluationCacheReport={modelEvaluationCacheReport}
              promptCandidateTournament={promptCandidateTournament}
              promptCandidateRuns={promptCandidateRuns}
              corpusIntelligence={corpusIntelligence}
              corpusClusterRuns={corpusClusterRuns}
              benchmarkV2Report={benchmarkV2Report}
              benchmarkV2Runs={benchmarkV2Runs}
              safeToTrain={safeToTrain}
              evaluationArtifacts={evaluationArtifacts}
              latestEvaluationArtifact={latestEvaluationArtifact}
              hostedSetupChecks={hostedSetupChecks}
              corpusProvenanceFirewall={corpusProvenanceFirewall}
              guidedTrainingStepper={guidedTrainingStepper}
              buildResultLearning={buildResultLearning}
              promptQualityDna={promptQualityDna}
              recipeDistiller={recipeDistiller}
              modelJudgeComparison={modelJudgeComparison}
              benchmarkLibrary={benchmarkLibrary}
              promptEditorGuidance={promptEditorGuidance}
              bestNextAction={bestNextAction}
              trueClosedLoop={trueClosedLoop}
              promptSectionRegeneration={promptSectionRegeneration}
              importWizard={importWizard}
              speedLabeling={speedLabeling}
              benchmarkBattle={benchmarkBattle}
              calibrationDashboard={calibrationDashboard}
              hostedHardening={hostedHardening}
              operatorMode={operatorMode}
              hostedBuildWorker={hostedBuildWorker}
              claudeCalibrationSet={claudeCalibrationSet}
              bulkImportPipeline={bulkImportPipeline}
              closedLoopRunDetail={closedLoopRunDetail}
              goldenDatasetV1Lock={goldenDatasetV1Lock}
              beginnerPromptMaker={beginnerPromptMaker}
              failureMemoryAutopilot={failureMemoryAutopilot}
              visualProofComparison={visualProofComparison}
              modelProviderRouter={modelProviderRouter}
              apiAdminHardening={apiAdminHardening}
              workerSandbox={workerSandbox}
              proofArtifactStorage={proofArtifactStorage}
              queueObservability={queueObservability}
              simpleModeCleanup={simpleModeCleanup}
              datasetGovernance={datasetGovernance}
              providerPluginLayer={providerPluginLayer}
              evaluatorCalibrationWorkflow={evaluatorCalibrationWorkflow}
              goldenBenchmarkHarness={goldenBenchmarkHarness}
              promptGeneratorV2={promptGeneratorV2}
              promptCritiqueRepair={promptCritiqueRepair}
              resultQualityDashboard={resultQualityDashboard}
              datasetReviewQueue={datasetReviewQueue}
              hostedWorkerOps={hostedWorkerOps}
              measuredQualitySprint={measuredQualitySprint}
              datasetInbox={datasetInbox}
              proofRunController={proofRunController}
              calibrationProduct={calibrationProduct}
              hostedReadinessProduct={hostedReadinessProduct}
              qualityRegressionGate={qualityRegressionGate}
              accessibilityQaScore={accessibilityQaScore}
              productOs={productOs}
              productEvolution={productEvolution}
              promptLearnerMode={promptLearnerMode}
              learningMemoryV2={learningMemoryV2}
              resultReviewer={resultReviewer}
              holdoutBenchmark={holdoutBenchmark}
              promptEditorStudio={promptEditorStudio}
              projectSpaces={projectSpaces}
              modularArchitecture={modularArchitecture}
              publicDemoExperience={publicDemoExperience}
              productSprint={productSprint}
              guidedProductRun={guidedProductRun}
              corpusCleanupMode={corpusCleanupMode}
              promptBattleAutopilot={promptBattleAutopilot}
              templateCompiler={templateCompiler}
              resultFeedbackLoop={resultFeedbackLoop}
              publicDemoSimplification={publicDemoSimplification}
              localModePolish={localModePolish}
              productCommandCenter={productCommandCenter}
              allInRunway={allInRunway}
              learningMachine={learningMachine}
              autonomousProofLoop={autonomousProofLoop}
              generatorV3={generatorV3}
              benchmarkExpansion={benchmarkExpansion}
              learningExplanation={learningExplanation}
              publicDemoPolish={publicDemoPolish}
              hostedCiSmoke={hostedCiSmoke}
              trainingExportReadiness={trainingExportReadiness}
              nextProductLayer={nextProductLayer}
              proofSeedingRunway={proofSeedingRunway}
              hostedBackendKit={hostedBackendKit}
              promptToProofWorkflow={promptToProofWorkflow}
              datasetBulkTools={datasetBulkTools}
              preferenceReviewDeck={preferenceReviewDeck}
              preferenceTraining={preferenceTraining}
              claudeCalibrationProduct={claudeCalibrationProduct}
              briefBuilderProduct={briefBuilderProduct}
              generatorBriefChecklist={generatorBriefChecklist}
              regressionHistoryProduct={regressionHistoryProduct}
              regressionTimeline={regressionTimeline}
              publicProofChecklist={publicProofChecklist}
              securityBoundary={securityBoundary}
              securityCleanupProduct={securityCleanupProduct}
              narrativePolish={narrativePolish}
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
              onApplyResultReviewAction={applyResultReviewAction}
              onCaptureSelectedResult={captureSelectedResult}
              onApplyResultLearningPatch={applyResultLearningPatch}
              onSaveEditorSectionPatch={saveEditorSectionPatch}
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
              onExportOneClickTrainingPack={exportOneClickTrainingPack}
              onExportProjectPack={exportProjectPack}
              onExportTrainingSnapshot={exportTrainingSnapshot}
              onImportTrainingSnapshot={importTrainingSnapshotText}
              onImportResultJson={importResultJson}
              onInstallSkill={installSkillFromApi}
              onLoadDemoMode={loadDemoMode}
              onLockGoldenDatasetV1={lockGoldenDatasetV1}
              onModelEvaluate={runModelEvaluation}
              oneClickExportPack={oneClickExportPack}
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
              onRunGuidedTraining={runGuidedTraining}
              onRunCachedModelEvaluation={runCachedModelEvaluation}
              onRunCorpusIntelligence={runCorpusIntelligence}
              onRunBenchmarkV2={runBenchmarkV2}
              onRunAutonomousProofLoop={runAutonomousProofLoop}
              onApplyGeneratorV3Mode={applyGeneratorV3Mode}
              onRunHostedSmoke={runHostedSmoke}
              onRunProofLearningLoop={runProofLearningLoop}
              onRunModelBatchCalibration={runModelBatchCalibration}
              onRunPromptComparison={runPromptComparison}
              onRunScreenshotJudge={runScreenshotJudge}
              onRunMutationTournament={runMutationTournament}
              onRunCandidateQualityLoop={runCandidateQualityLoop}
              onRunTrueClosedLoop={runTrueClosedLoop}
              onRunServerClosedLoopJudge={runServerClosedLoopJudge}
              onRunHostedProofWorker={runHostedProofWorker}
              onApplySectionRegeneration={applySectionRegeneration}
              onApplySpeedLabel={applySpeedLabel}
              onRunBenchmarkBattles={runBenchmarkBattles}
              onCreateSelectedEvaluationArtifact={createSelectedEvaluationArtifact}
              onRunHostedSetupWizard={runHostedSetupWizard}
              onTrainFromCorpus={trainFromCurrentCorpus}
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
              onOperateQueueJob={operateQueueJob}
              onRemoveScreenshot={removeScreenshot}
              onRunQueueViaApi={runQueueViaApi}
              onSave={saveVersion}
              onSaveApiBase={saveApiBase}
              onSaveProjectSpace={saveActiveProjectSpace}
              onSelectPrompt={setSelectedId}
              onSetMemoryRuleDecision={setMemoryRuleDecision}
              onDatasetInboxDecision={handleDatasetInboxDecision}
              onBulkDatasetInboxDecision={handleBulkDatasetInboxDecision}
              onProveGeneratedPrompt={handleProveGeneratedPrompt}
              onAddRecommendedPreferenceLabel={addRecommendedPreferenceLabel}
              onAddPreferenceDeckLabel={addPreferenceDeckLabel}
              onApplyBriefBuilderPatch={applyBriefBuilderPatch}
              onRunSecurityCleanup={runSecurityCleanup}
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
              proofProgress={proofProgress}
              proofLearningRuns={proofLearningRuns}
              promptBattle={promptBattle}
              promptCoach={promptCoach}
              promptMemoryDiff={promptMemoryDiff}
              promptMemory={promptMemory}
              promptQualityRecipe={promptQualityRecipe}
              promptDiff={promptDiff}
              projectExportPack={projectExportPack}
              qualityGate={qualityGate}
              qaText={qaText}
              queueExport={queueExport}
              queueJobs={queueJobs}
              queueProgress={queueProgress}
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
              trainModeReport={trainModeReport}
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

        <aside className={`panel right-panel side-drawer ${openInspector === "rules" ? "open" : ""}`} data-inspector="rules">
          <div className="panel-header">
            <Lightbulb size={18} />
            <h2>Learned rules</h2>
            <button className="icon-button drawer-close" type="button" aria-label="Close rules inspector" onClick={() => setOpenInspector(null)}>
              <X size={15} />
            </button>
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
          <Hammer size={18} />
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
  benchmarkTrend,
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
  evolutionDiff,
  exportPresets,
  failureMemory,
  improvedPrompt,
  improveText,
  interviewBrief,
  interviewPrompt,
  goldenRecipes,
  goldenChallengeBoard,
  goldenDataset,
  goldReview,
  guidedWizard,
  qualityGraderV2,
  generatorPresets,
  generatorInput,
  hostedSyncReport,
  hostedBrainReadiness,
  learnerAnswer,
  learnerQuestion,
  learnedGeneratorVariants,
  trainingRunSummary,
  modelEvaluationCacheReport,
  promptCandidateTournament,
  promptCandidateRuns,
  corpusIntelligence,
  corpusClusterRuns,
  benchmarkV2Report,
  benchmarkV2Runs,
  safeToTrain,
  evaluationArtifacts,
  latestEvaluationArtifact,
  hostedSetupChecks,
  corpusProvenanceFirewall,
  guidedTrainingStepper,
  buildResultLearning,
  promptQualityDna,
  recipeDistiller,
  modelJudgeComparison,
  benchmarkLibrary,
  promptEditorGuidance,
  bestNextAction,
  trueClosedLoop,
  promptSectionRegeneration,
  importWizard,
  speedLabeling,
  benchmarkBattle,
  calibrationDashboard,
  hostedHardening,
  operatorMode,
  hostedBuildWorker,
  claudeCalibrationSet,
  bulkImportPipeline,
  closedLoopRunDetail,
  goldenDatasetV1Lock,
  beginnerPromptMaker,
  failureMemoryAutopilot,
  visualProofComparison,
  modelProviderRouter,
  apiAdminHardening,
  workerSandbox,
  proofArtifactStorage,
  queueObservability,
  simpleModeCleanup,
  datasetGovernance,
  providerPluginLayer,
  evaluatorCalibrationWorkflow,
  goldenBenchmarkHarness,
  promptGeneratorV2,
  promptCritiqueRepair,
  resultQualityDashboard,
  datasetReviewQueue,
  hostedWorkerOps,
  measuredQualitySprint,
  datasetInbox,
  proofRunController,
  calibrationProduct,
  hostedReadinessProduct,
  qualityRegressionGate,
  accessibilityQaScore,
  productOs,
  productEvolution,
  promptLearnerMode,
  learningMemoryV2,
  resultReviewer,
  holdoutBenchmark,
  promptEditorStudio,
  projectSpaces,
  modularArchitecture,
  publicDemoExperience,
  productSprint,
  guidedProductRun,
  corpusCleanupMode,
  promptBattleAutopilot,
  templateCompiler,
  resultFeedbackLoop,
  publicDemoSimplification,
  localModePolish,
  productCommandCenter,
  allInRunway,
  learningMachine,
  autonomousProofLoop,
  generatorV3,
  benchmarkExpansion,
  learningExplanation,
  publicDemoPolish,
  hostedCiSmoke,
  trainingExportReadiness,
  nextProductLayer,
  proofSeedingRunway,
  hostedBackendKit,
  promptToProofWorkflow,
  datasetBulkTools,
  preferenceReviewDeck,
  preferenceTraining,
  claudeCalibrationProduct,
  briefBuilderProduct,
  generatorBriefChecklist,
  regressionHistoryProduct,
  regressionTimeline,
  publicProofChecklist,
  securityBoundary,
  securityCleanupProduct,
  narrativePolish,
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
  onApplyResultReviewAction,
  onApplyResultLearningPatch,
  onSaveEditorSectionPatch,
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
  onExportOneClickTrainingPack,
  onExportProjectPack,
  onExportQueue,
  onExportTrainingSnapshot,
  onImportTrainingSnapshot,
  onImportResultJson,
  onInstallSkill,
  onLoadDemoMode,
  onLockGoldenDatasetV1,
  onModelEvaluate,
  oneClickExportPack,
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
  onRunGuidedTraining,
  onRunCachedModelEvaluation,
  onRunCorpusIntelligence,
  onRunBenchmarkV2,
  onRunAutonomousProofLoop,
  onApplyGeneratorV3Mode,
  onRunHostedSmoke,
  onRunProofLearningLoop,
  onRunModelBatchCalibration,
  onRunPromptComparison,
  onRunScreenshotJudge,
  onRunMutationTournament,
  onRunCandidateQualityLoop,
  onRunTrueClosedLoop,
  onRunServerClosedLoopJudge,
  onRunHostedProofWorker,
  onApplySectionRegeneration,
  onApplySpeedLabel,
  onRunBenchmarkBattles,
  onCreateSelectedEvaluationArtifact,
  onRunHostedSetupWizard,
  onTrainFromCorpus,
  onGeneratePromptFromScreenshot,
  onSaveWorkspacePackRun,
  onRunPromptCoach,
  onQueueTournament,
  onQueueWizard,
  onQuarantineOffProjectPrompts,
  onRemoveBuildRun,
  onRemoveQueueJob,
  onOperateQueueJob,
  onRemoveScreenshot,
  onRunQueueViaApi,
  onSave,
  onSaveApiBase,
  onSaveProjectSpace,
  onSelectPrompt,
  onSetMemoryRuleDecision,
  onDatasetInboxDecision,
  onBulkDatasetInboxDecision,
  onProveGeneratedPrompt,
  onAddRecommendedPreferenceLabel,
  onAddPreferenceDeckLabel,
  onApplyBriefBuilderPatch,
  onRunSecurityCleanup,
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
  proofProgress,
  proofLearningRuns,
  promptBattle,
  promptCoach,
  promptMemoryDiff,
  promptMemory,
  promptQualityRecipe,
  promptDiff,
  projectExportPack,
  qualityGate,
  qaText,
  queueExport,
  queueJobs,
  queueProgress,
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
  trainModeReport,
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
  benchmarkTrend: BenchmarkTrendReport;
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
  evolutionDiff: EvolutionDiffReport;
  exportPresets: ExportPreset[];
  failureMemory: FailureMemoryReport;
  improvedPrompt: string;
  improveText: string;
  interviewBrief: InterviewBrief;
  interviewPrompt: string;
  goldenRecipes: GoldenRecipe[];
  goldenChallengeBoard: ReturnType<typeof buildGoldenChallengeBoard>;
  goldenDataset: GoldenDatasetReport;
  goldReview: GoldReviewReport;
  guidedWizard: GuidedPromptWizardReport;
  qualityGraderV2: QualityGraderV2;
  generatorPresets: GeneratorPreset[];
  generatorInput: LearnedGeneratorInput;
  hostedSyncReport: HostedSyncReport;
  hostedBrainReadiness: HostedBrainReadinessReport;
  learnerAnswer: LearnerAnswerReport;
  learnerQuestion: string;
  learnedGeneratorVariants: LearnedGeneratorVariant[];
  trainingRunSummary: ReturnType<typeof buildTrainingRunSummary>;
  modelEvaluationCacheReport: ModelEvaluationCacheReport;
  promptCandidateTournament: PromptCandidateTournamentReport;
  promptCandidateRuns: PromptCandidateRun[];
  corpusIntelligence: CorpusIntelligenceReport;
  corpusClusterRuns: CorpusClusterRun[];
  benchmarkV2Report: BenchmarkV2Report;
  benchmarkV2Runs: BenchmarkV2Run[];
  safeToTrain: SafeToTrainReport;
  evaluationArtifacts: EvaluationArtifact[];
  latestEvaluationArtifact?: EvaluationArtifact;
  hostedSetupChecks: HostedSetupCheck[];
  corpusProvenanceFirewall: CorpusProvenanceFirewallReport;
  guidedTrainingStepper: GuidedTrainingStepperReport;
  buildResultLearning: BuildResultLearningReport;
  promptQualityDna: PromptQualityDnaReport;
  recipeDistiller: PromptRecipeDistillerReport;
  modelJudgeComparison: ModelJudgeComparisonReport;
  benchmarkLibrary: BenchmarkLibraryReport;
  promptEditorGuidance: PromptEditorGuidanceReport;
  bestNextAction: BestNextActionReport;
  trueClosedLoop: TrueClosedLoopReport;
  promptSectionRegeneration: PromptSectionRegenerationReport;
  importWizard: ImportWizardReport;
  speedLabeling: SpeedLabelingReport;
  benchmarkBattle: BenchmarkBattleReport;
  calibrationDashboard: CalibrationDashboardReport;
  hostedHardening: HostedHardeningReport;
  operatorMode: OperatorModeReport;
  hostedBuildWorker: HostedBuildWorkerReport;
  claudeCalibrationSet: ClaudeCalibrationSetReport;
  bulkImportPipeline: BulkImportPipelineReport;
  closedLoopRunDetail: ClosedLoopRunDetailReport;
  goldenDatasetV1Lock: GoldenDatasetV1LockReport;
  beginnerPromptMaker: BeginnerPromptMakerReport;
  failureMemoryAutopilot: FailureMemoryAutopilotReport;
  visualProofComparison: VisualProofComparisonReport;
  modelProviderRouter: ModelProviderRouterReport;
  apiAdminHardening: ApiAdminHardeningReport;
  workerSandbox: WorkerSandboxReport;
  proofArtifactStorage: ProofArtifactStorageReport;
  queueObservability: QueueObservabilityReport;
  simpleModeCleanup: SimpleModeReport;
  datasetGovernance: DatasetGovernanceReport;
  providerPluginLayer: ProviderPluginLayerReport;
  evaluatorCalibrationWorkflow: EvaluatorCalibrationWorkflowReport;
  goldenBenchmarkHarness: GoldenBenchmarkHarnessReport;
  promptGeneratorV2: PromptGeneratorV2Report;
  promptCritiqueRepair: PromptCritiqueRepairReport;
  resultQualityDashboard: ResultQualityDashboardReport;
  datasetReviewQueue: DatasetReviewQueueReport;
  hostedWorkerOps: HostedWorkerOpsReport;
  measuredQualitySprint: MeasuredQualitySprintReport;
  datasetInbox: DatasetInboxReport;
  proofRunController: ProofRunControllerReport;
  calibrationProduct: CalibrationProductReport;
  hostedReadinessProduct: HostedReadinessProductReport;
  qualityRegressionGate: QualityRegressionGateReport;
  accessibilityQaScore: AccessibilityQaScoreReport;
  productOs: PromptProductOsReport;
  productEvolution: ProductEvolutionReport;
  promptLearnerMode: PromptLearnerModeReport;
  learningMemoryV2: LearningMemoryV2Report;
  resultReviewer: ResultReviewerReport;
  holdoutBenchmark: HoldoutBenchmarkReport;
  promptEditorStudio: PromptEditorStudioReport;
  projectSpaces: ProjectSpacesReport;
  modularArchitecture: ModularArchitectureReport;
  publicDemoExperience: PublicDemoExperienceReport;
  productSprint: ProductSprintReport;
  guidedProductRun: GuidedProductRunReport;
  corpusCleanupMode: CorpusCleanupModeReport;
  promptBattleAutopilot: PromptBattleAutopilotReport;
  templateCompiler: TemplateCompilerReport;
  resultFeedbackLoop: ResultFeedbackLoopReport;
  publicDemoSimplification: PublicDemoSimplificationReport;
  localModePolish: LocalModePolishReport;
  productCommandCenter: ProductCommandCenterReport;
  allInRunway: AllInRunwayReport;
  learningMachine: LearningMachineReport;
  autonomousProofLoop: AutonomousProofLoopReport;
  generatorV3: GeneratorV3Report;
  benchmarkExpansion: BenchmarkExpansionReport;
  learningExplanation: LearningExplanationReport;
  publicDemoPolish: PublicDemoPolishReport;
  hostedCiSmoke: HostedCiSmokeReport;
  trainingExportReadiness: TrainingExportReadinessReport;
  nextProductLayer: NextProductLayerReport;
  proofSeedingRunway: ProofSeedingRunwayReport;
  hostedBackendKit: HostedBackendKitReport;
  promptToProofWorkflow: PromptToProofWorkflowReport;
  datasetBulkTools: DatasetBulkToolsReport;
  preferenceReviewDeck: PreferenceReviewDeckReport;
  preferenceTraining: PreferenceTrainingReport;
  claudeCalibrationProduct: ClaudeCalibrationProductReport;
  briefBuilderProduct: BriefBuilderProductReport;
  generatorBriefChecklist: GeneratorBriefChecklistReport;
  regressionHistoryProduct: RegressionHistoryProductReport;
  regressionTimeline: RegressionTimelineReport;
  publicProofChecklist: PublicProofChecklistReport;
  securityBoundary: SecurityBoundaryReport;
  securityCleanupProduct: SecurityCleanupProductReport;
  narrativePolish: NarrativePolishReport;
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
  onApplyResultReviewAction: (row: ResultReviewerReport["rows"][number], action: "promote" | "repair" | "exclude") => void;
  onApplyResultLearningPatch: () => void;
  onSaveEditorSectionPatch: (card: PromptEditorStudioReport["cards"][number]) => void;
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
  onExportOneClickTrainingPack: () => void;
  onExportProjectPack: () => void;
  onExportQueue: () => void;
  onExportTrainingSnapshot: () => void;
  onImportTrainingSnapshot: () => void;
  onImportResultJson: () => void;
  onInstallSkill: () => void;
  onLoadDemoMode: () => void;
  onLockGoldenDatasetV1: () => void;
  onModelEvaluate: () => void;
  oneClickExportPack: string;
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
  onRunGuidedTraining: () => void;
  onRunCachedModelEvaluation: () => void;
  onRunCorpusIntelligence: () => void;
  onRunBenchmarkV2: () => void;
  onRunAutonomousProofLoop: () => void;
  onApplyGeneratorV3Mode: (mode: GeneratorV3Report["modes"][number]) => void;
  onRunHostedSmoke: () => void;
  onRunProofLearningLoop: () => void;
  onRunModelBatchCalibration: () => void;
  onRunPromptComparison: (left: PromptExample | undefined, right: PromptExample | undefined) => void;
  onRunScreenshotJudge: () => void;
  onRunMutationTournament: () => void;
  onRunCandidateQualityLoop: () => void;
  onRunTrueClosedLoop: () => void;
  onRunServerClosedLoopJudge: () => void;
  onRunHostedProofWorker: () => void;
  onApplySectionRegeneration: (sectionId: string) => void;
  onApplySpeedLabel: (candidateId: string) => void;
  onRunBenchmarkBattles: () => void;
  onCreateSelectedEvaluationArtifact: () => void;
  onRunHostedSetupWizard: () => void;
  onTrainFromCorpus: () => void;
  onGeneratePromptFromScreenshot: (input: { title: string; url: string; notes: string; siteType: string }) => Promise<ScreenshotPromptRun>;
  onSaveWorkspacePackRun: () => void;
  onRunPromptCoach: () => void;
  onQueueTournament: () => void;
  onQueueWizard: () => void;
  onQuarantineOffProjectPrompts: () => void;
  onRemoveBuildRun: (id: string) => void;
  onRemoveQueueJob: (id: string) => void;
  onOperateQueueJob: (id: string, action: "retry" | "cancel" | "remove") => void;
  onRemoveScreenshot: (id: string) => void;
  onRunQueueViaApi: () => void;
  onSave: (kind: PromptVersion["kind"], title: string, text: string, score?: number) => void;
  onSaveApiBase: () => void;
  onSaveProjectSpace: () => void;
  onSelectPrompt: (id: string) => void;
  onSetMemoryRuleDecision: (ruleId: string, decision: MemoryRuleDecision) => void;
  onDatasetInboxDecision: (promptId: string, action: DatasetInboxReport["rows"][number]["recommendation"]) => void;
  onBulkDatasetInboxDecision: (action: DatasetInboxReport["rows"][number]["recommendation"]) => void;
  onProveGeneratedPrompt: () => void;
  onAddRecommendedPreferenceLabel: () => void;
  onAddPreferenceDeckLabel: (pair: PreferenceReviewDeckReport["pairs"][number], winnerId?: string) => void;
  onApplyBriefBuilderPatch: () => void;
  onRunSecurityCleanup: () => void;
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
  proofProgress: ProofProgressReport;
  proofLearningRuns: ProofLearningRun[];
  promptBattle: PromptBattle;
  promptCoach: PromptCoachReport;
  promptMemoryDiff: PromptMemoryDiffReport;
  promptMemory: PromptMemoryExport;
  promptQualityRecipe: string;
  promptDiff?: PromptDiff;
  projectExportPack: ProjectExportPack;
  qualityGate: QualityGateReport;
  qaText: string;
  queueExport: string;
  queueJobs: BuildQueueJob[];
  queueProgress: QueueProgressReport;
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
  trainModeReport: TrainModeReport;
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
    { id: "product-evolution", label: "Evolution" },
    { id: "learner-mode", label: "Learner mode" },
    { id: "memory-v2", label: "Memory v2" },
    { id: "result-reviewer", label: "Reviewer" },
    { id: "holdout", label: "Holdout" },
    { id: "editor-studio", label: "Editor" },
    { id: "project-spaces", label: "Spaces" },
    { id: "architecture", label: "Architecture" },
    { id: "public-experience", label: "Public experience" },
    { id: "product-sprint", label: "Sprint" },
    { id: "product-os", label: "Product OS" },
    { id: "guided-run", label: "Guided run" },
    { id: "cleanup-mode", label: "Cleanup" },
    { id: "battle-autopilot", label: "Battle" },
    { id: "template-compiler", label: "Templates" },
    { id: "result-feedback", label: "Feedback" },
    { id: "demo-simple", label: "Demo simple" },
    { id: "local-mode", label: "Local mode" },
    { id: "workflow", label: "Workflow" },
    { id: "machine", label: "Learning machine" },
    { id: "next-layer", label: "Next layer" },
    { id: "proof-seeding", label: "Proof seeding" },
    { id: "autonomous", label: "Autonomous" },
    { id: "generator-v3", label: "Generator v3" },
    { id: "benchmark-scale", label: "Benchmark scale" },
    { id: "explain", label: "Explain" },
    { id: "public-demo", label: "Public demo" },
    { id: "public-proof", label: "Public proof" },
    { id: "hosted-smoke", label: "Hosted smoke" },
    { id: "training-exports", label: "Training exports" },
    { id: "proof", label: "Prompt-to-proof" },
    { id: "brief", label: "Brief builder" },
    { id: "brief-checklist", label: "Brief checklist" },
    { id: "preferences", label: "Preferences" },
    { id: "preference-deck", label: "Preference deck" },
    { id: "regression", label: "Regression" },
    { id: "regression-timeline", label: "Regression timeline" },
    { id: "security", label: "Security" },
    { id: "security-boundary", label: "Security boundary" },
    { id: "story", label: "Story" },
    { id: "demo", label: "Demo" },
    { id: "api", label: "API" },
    { id: "workspace", label: "Workspaces" },
    { id: "generate", label: "Generate" },
    { id: "dataset", label: "Dataset" },
    { id: "prove", label: "Prove" },
    { id: "calibrate", label: "Calibrate" },
    { id: "hosted", label: "Hosted" },
    { id: "qa-score", label: "QA score" },
    { id: "quality", label: "Quality" },
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
            Run prompts, capture screenshots, calibrate prompt strength against actual results, clean the corpus, remember failures,
            compile rough ideas, and tournament-test variants.
          </p>
        </div>
        <div className="outcome-scoreboard">
          <Metric value={formatNumber(dnaCalibration.calibratedScore)} label="Calibrated strength" />
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

      <PromptProductOsPanel report={productOs} onSelect={scrollToTrainSection} />

      <ProductEvolutionPanel report={productEvolution} onSelect={scrollToTrainSection} />

      <section className="train-columns">
        <PromptLearnerModePanel report={promptLearnerMode} onSelect={scrollToTrainSection} />
        <PublicDemoExperiencePanel report={publicDemoExperience} />
      </section>

      <section className="train-columns">
        <LearningMemoryV2Panel copied={copied} onCopy={onCopy} onSetDecision={onSetMemoryRuleDecision} report={learningMemoryV2} />
        <ResultReviewerPanel onApplyAction={onApplyResultReviewAction} report={resultReviewer} />
      </section>

      <section className="train-columns">
        <HoldoutBenchmarkPanel report={holdoutBenchmark} />
        <PromptEditorStudioPanel copied={copied} onCopy={onCopy} onSaveSection={onSaveEditorSectionPatch} report={promptEditorStudio} />
      </section>

      <section className="train-columns">
        <ProjectSpacesPanel onSaveProjectSpace={onSaveProjectSpace} report={projectSpaces} />
        <ModularArchitecturePanel report={modularArchitecture} />
      </section>

      <AccessibilityQaScorePanel report={accessibilityQaScore} onSelect={scrollToTrainSection} />

      <ProductSprintPanel report={productSprint} onSelect={scrollToTrainSection} />

      <section className="train-columns">
        <GuidedProductRunPanel report={guidedProductRun} onRunGuidedTraining={onRunGuidedTraining} onSelect={scrollToTrainSection} />
        <CorpusCleanupModePanel report={corpusCleanupMode} onRunCorpusHygieneSweep={onRunCorpusHygieneSweep} onSelect={scrollToTrainSection} />
      </section>

      <section className="train-columns">
        <PromptBattleAutopilotPanel report={promptBattleAutopilot} onQueueBattle={onQueueBattle} onSelect={scrollToTrainSection} />
        <TemplateCompilerPanel copied={copied} onCopy={onCopy} report={templateCompiler} />
      </section>

      <section className="train-columns">
        <ResultFeedbackLoopPanel copied={copied} onApplyResultLearningPatch={onApplyResultLearningPatch} onCopy={onCopy} report={resultFeedbackLoop} onSelect={scrollToTrainSection} />
        <PublicDemoSimplificationPanel report={publicDemoSimplification} onLoadDemoMode={onLoadDemoMode} onSelect={scrollToTrainSection} />
      </section>

      <LocalModePolishPanel report={localModePolish} onApplyProviderPreset={onApplyProviderPreset} />

      <ProductCommandCenterPanel report={productCommandCenter} onSelect={scrollToTrainSection} />

      <AllInRunwayPanel report={allInRunway} onSelect={scrollToTrainSection} />

      <LearningMachinePanel report={learningMachine} onSelect={scrollToTrainSection} />

      <NextProductLayerPanel copied={copied} onCopy={onCopy} report={nextProductLayer} />

      <ProofSeedingRunwayPanel copied={copied} onCopy={onCopy} report={proofSeedingRunway} />

      <section className="train-columns">
        <AutonomousProofLoopPanel report={autonomousProofLoop} onRunAutonomousProofLoop={onRunAutonomousProofLoop} />
        <GeneratorV3Panel report={generatorV3} onApplyMode={onApplyGeneratorV3Mode} onCopy={onCopy} copied={copied} />
      </section>

      <section className="train-columns">
        <BenchmarkExpansionPanel report={benchmarkExpansion} onRunBenchmarkV2={onRunBenchmarkV2} />
        <LearningExplanationPanel report={learningExplanation} />
      </section>

      <section className="train-columns">
        <PublicDemoPolishPanel report={publicDemoPolish} onLoadDemoMode={onLoadDemoMode} onSelect={scrollToTrainSection} />
        <PublicProofChecklistPanel copied={copied} onCopy={onCopy} report={publicProofChecklist} />
      </section>

      <HostedCiSmokePanel report={hostedCiSmoke} onRunHostedSmoke={onRunHostedSmoke} />

      <TrainingExportReadinessPanel report={trainingExportReadiness} onExportOneClickTrainingPack={onExportOneClickTrainingPack} />

      <section className="train-columns">
        <HostedBackendKitPanel report={hostedBackendKit} onCheckApi={onCheckApi} onRunHostedSetupWizard={onRunHostedSetupWizard} />
        <PromptToProofWorkflowPanel report={promptToProofWorkflow} onProveGeneratedPrompt={onProveGeneratedPrompt} onRunOneClickBuildProof={onRunOneClickBuildProof} />
      </section>

      <section className="train-columns">
        <DatasetBulkToolsPanel report={datasetBulkTools} onBulkDecision={onBulkDatasetInboxDecision} />
        <PreferenceTrainingPanel report={preferenceTraining} onAddRecommendedPreferenceLabel={onAddRecommendedPreferenceLabel} />
      </section>

      <PreferenceReviewDeckPanel report={preferenceReviewDeck} onAddPreferenceDeckLabel={onAddPreferenceDeckLabel} />

      <section className="train-columns">
        <ClaudeCalibrationProductPanel report={claudeCalibrationProduct} onRunCachedModelEvaluation={onRunCachedModelEvaluation} onRunHostedClaudeHealthCheck={onRunHostedClaudeHealthCheck} />
        <BriefBuilderProductPanel report={briefBuilderProduct} onApplyBriefBuilderPatch={onApplyBriefBuilderPatch} />
      </section>

      <GeneratorBriefChecklistPanel copied={copied} onApplyBriefBuilderPatch={onApplyBriefBuilderPatch} onCopy={onCopy} report={generatorBriefChecklist} />

      <section className="train-columns">
        <RegressionHistoryProductPanel report={regressionHistoryProduct} onRunBenchmarkSuite={onRunBenchmarkSuite} onRunBenchmarkV2={onRunBenchmarkV2} />
        <RegressionTimelinePanel copied={copied} onCopy={onCopy} report={regressionTimeline} />
      </section>

      <section className="train-columns">
        <SecurityCleanupProductPanel report={securityCleanupProduct} onRunSecurityCleanup={onRunSecurityCleanup} />
        <SecurityBoundaryPanel copied={copied} onCopy={onCopy} report={securityBoundary} />
      </section>

      <NarrativePolishPanel report={narrativePolish} onLoadDemoMode={onLoadDemoMode} onSelect={scrollToTrainSection} />

      <TrainFlowModesPanel modes={trainModeReport} onSelect={scrollToTrainSection} />

      <TrainWorkflowAccordionPanel onSelect={scrollToTrainSection} />

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

      <MeasuredQualitySprintPanel report={measuredQualitySprint} />

      <section className="train-columns">
        <GeneratePromptFrontDoorPanel
          report={promptGeneratorV2}
          onApplyGeneratorVariant={onApplyGeneratorVariant}
          onCopy={onCopy}
          copied={copied}
          onProveGeneratedPrompt={onProveGeneratedPrompt}
        />
        <DatasetInboxPanel report={datasetInbox} onDecision={onDatasetInboxDecision} />
      </section>

      <section className="train-columns">
        <ProofRunControllerPanel
          jobs={queueJobs}
          report={proofRunController}
          onOperateQueueJob={onOperateQueueJob}
          onProveGeneratedPrompt={onProveGeneratedPrompt}
        />
        <CalibrationProductPanel report={calibrationProduct} onRunCachedModelEvaluation={onRunCachedModelEvaluation} />
      </section>

      <section className="train-columns">
        <HostedReadinessProductPanel report={hostedReadinessProduct} onConnectHostedBrain={onConnectHostedBrain} />
        <QualityRegressionGatePanel report={qualityRegressionGate} />
      </section>

      <section className="train-columns">
        <GoldenBenchmarkHarnessPanel report={goldenBenchmarkHarness} />
        <PromptGeneratorV2Panel report={promptGeneratorV2} onApplyGeneratorVariant={onApplyGeneratorVariant} onCopy={onCopy} copied={copied} />
      </section>

      <section className="train-columns">
        <PromptCritiqueRepairPanel report={promptCritiqueRepair} onCopy={onCopy} copied={copied} />
        <ResultQualityDashboardPanel report={resultQualityDashboard} />
      </section>

      <section className="train-columns">
        <DatasetReviewQueueV2Panel report={datasetReviewQueue} onSetPromptCurationDecision={onSetPromptCurationDecision} />
        <HostedWorkerOperationsPanel report={hostedWorkerOps} onOperateQueueJob={onOperateQueueJob} />
      </section>

      <TrainFromCorpusPanel
        dataset={goldenDataset}
        memoryDiff={promptMemoryDiff}
        onTrainFromCorpus={onTrainFromCorpus}
        queueProgress={queueProgress}
      />

      <OperatorModePanel report={operatorMode} mode={onboardingMode} onChooseMode={onChooseOnboardingMode} onSelect={scrollToTrainSection} />

      <TrueClosedLoopRunwayPanel
        report={trueClosedLoop}
        onRunTrueClosedLoop={onRunTrueClosedLoop}
        onRunServerClosedLoopJudge={onRunServerClosedLoopJudge}
      />

      <HostedBuildWorkerPanel report={hostedBuildWorker} onRunHostedProofWorker={onRunHostedProofWorker} onRunQueueViaApi={onRunQueueViaApi} />

      <section className="train-columns">
        <WorkerSandboxPanel report={workerSandbox} />
        <QueueObservabilityPanel report={queueObservability} />
      </section>

      <section className="train-columns">
        <ProofArtifactStoragePanel report={proofArtifactStorage} />
        <SimpleModeCleanupPanel report={simpleModeCleanup} />
      </section>

      <section className="train-columns">
        <DatasetGovernancePanel report={datasetGovernance} onLockGoldenDatasetV1={onLockGoldenDatasetV1} />
        <ProviderPluginLayerPanel report={providerPluginLayer} onApplyProviderPreset={onApplyProviderPreset} />
      </section>

      <section className="train-columns">
        <ClosedLoopRunDetailPanel report={closedLoopRunDetail} />
        <ClaudeCalibrationSetPanel report={claudeCalibrationSet} onRunCachedModelEvaluation={onRunCachedModelEvaluation} />
      </section>

      <EvaluatorCalibrationWorkflowPanel report={evaluatorCalibrationWorkflow} onRunCachedModelEvaluation={onRunCachedModelEvaluation} />

      <section className="train-columns">
        <BulkImportPipelinePanel report={bulkImportPipeline} onSelect={scrollToTrainSection} />
        <BeginnerPromptMakerPanel
          report={beginnerPromptMaker}
          generatorInput={generatorInput}
          onApplyGeneratorVariant={onApplyGeneratorVariant}
          setGeneratorInput={setGeneratorInput}
        />
      </section>

      <section className="train-columns">
        <GoldenDatasetV1ProductPanel report={goldenDatasetV1Lock} onLockGoldenDatasetV1={onLockGoldenDatasetV1} />
        <FailureMemoryAutopilotPanel report={failureMemoryAutopilot} onApplyResultLearningPatch={onApplyResultLearningPatch} onCopy={onCopy} copied={copied} />
      </section>

      <section className="train-columns">
        <BeforeAfterVisualProofPanel report={visualProofComparison} />
        <ModelProviderRouterPanel report={modelProviderRouter} onApplyProviderPreset={onApplyProviderPreset} />
      </section>

      <ApiAdminHardeningPanel
        report={apiAdminHardening}
        onCheckApi={onCheckApi}
        onCreateBackupSnapshot={onCreateBackupSnapshot}
        onSyncToApi={onSyncToApi}
      />

      <section className="train-columns">
        <ImportWizardPanel report={importWizard} onSelect={scrollToTrainSection} />
        <PromptSectionRegenerationPanel report={promptSectionRegeneration} onApplySectionRegeneration={onApplySectionRegeneration} />
      </section>

      <section className="train-columns">
        <SpeedLabelingPanel report={speedLabeling} onApplySpeedLabel={onApplySpeedLabel} />
        <TrainingRunReplayPanel
          closedLoopRuns={closedLoopRuns}
          modelEvaluationCacheReport={modelEvaluationCacheReport}
          proofLearningRuns={proofLearningRuns}
          trainingRunSummary={trainingRunSummary}
        />
      </section>

      <section className="train-columns">
        <BenchmarkBattlePanel report={benchmarkBattle} onRunBenchmarkBattles={onRunBenchmarkBattles} />
        <CalibrationDashboardPanel report={calibrationDashboard} />
      </section>

      <HostedHardeningPanel report={hostedHardening} onRunHostedSetupWizard={onRunHostedSetupWizard} onCreateBackupSnapshot={onCreateBackupSnapshot} onSyncToApi={onSyncToApi} />

      <BestNextActionPanel action={bestNextAction} onSelect={scrollToTrainSection} />

      <GuidedTrainingStepperPanel report={guidedTrainingStepper} />

      <section className="train-columns">
        <CorpusProvenanceFirewallPanel report={corpusProvenanceFirewall} />
        <BuildResultLearningPanel report={buildResultLearning} />
      </section>

      <section className="train-columns">
        <PromptQualityDnaPanel report={promptQualityDna} />
        <ModelJudgeComparisonPanel report={modelJudgeComparison} onRunCachedModelEvaluation={onRunCachedModelEvaluation} />
      </section>

      <section className="train-columns">
        <PromptRecipeDistillerPanel report={recipeDistiller} />
        <PromptEditorGuidancePanel report={promptEditorGuidance} />
      </section>

      <BenchmarkLibraryCoveragePanel report={benchmarkLibrary} />

      <GuidedTrainingWorkflowPanel
        benchmarkV2={benchmarkV2Report}
        corpusIntelligence={corpusIntelligence}
        modelCache={modelEvaluationCacheReport}
        onRunGuidedTraining={onRunGuidedTraining}
        safeToTrain={safeToTrain}
        trainingRunSummary={trainingRunSummary}
      />

      <section className="train-columns">
        <TrainingRunHistoryPanel summary={trainingRunSummary} runs={trainingRunSummary.runs} />
        <ModelIntelligencePanel
          cacheReport={modelEvaluationCacheReport}
          modelBatchEvaluations={modelBatchEvaluations}
          onRunCachedModelEvaluation={onRunCachedModelEvaluation}
        />
      </section>

      <section className="train-columns">
        <PromptCandidateLoopPanel
          report={promptCandidateTournament}
          runs={promptCandidateRuns}
          onRunCandidateQualityLoop={onRunCandidateQualityLoop}
        />
        <CorpusIntelligencePanel
          report={corpusIntelligence}
          runs={corpusClusterRuns}
          onRunCorpusIntelligence={onRunCorpusIntelligence}
        />
      </section>

      <section className="train-columns">
        <BenchmarkV2Panel
          report={benchmarkV2Report}
          runs={benchmarkV2Runs}
          onRunBenchmarkV2={onRunBenchmarkV2}
        />
        <SafeToTrainSetupPanel
          checks={hostedSetupChecks}
          report={safeToTrain}
          onRunHostedSetupWizard={onRunHostedSetupWizard}
        />
      </section>

      <EvaluationArtifactsPanel
        artifacts={evaluationArtifacts}
        latest={latestEvaluationArtifact}
        onCreateSelectedEvaluationArtifact={onCreateSelectedEvaluationArtifact}
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

      <ProofRunnerProgressPanel progress={proofProgress} />

      <QueueProgressLedgerPanel onRefresh={onRefreshApiEvents} report={queueProgress} />

      <VisualProofGalleryPanel buildRuns={buildRuns} resultGallery={resultGallery} screenshots={screenshots} />

      <PromptEvolutionTimelinePanel steps={promptEvolutionSteps} />

      <PromptEvolutionDiffPanel report={evolutionDiff} />

      <PromptMemoryDiffPanel report={promptMemoryDiff} />

      <section className="train-columns">
        <GoldenBenchmarkBoardPanel
          board={goldenChallengeBoard}
          benchmarkRuns={benchmarkRuns}
          onRunBenchmarkSuite={onRunBenchmarkSuite}
        />
        <BenchmarkRegressionPanel report={benchmarkRegression} />
      </section>

      <BenchmarkTrendChartPanel report={benchmarkTrend} />

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

      <HostedBrainReadinessPanel report={hostedBrainReadiness} onRunHostedClaudeHealthCheck={onRunHostedClaudeHealthCheck} />

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

      <GoldenDatasetLockPanel
        copied={copied}
        dataset={goldenDataset}
        onCopy={onCopy}
        onDownload={onDownload}
        onLockGoldenDatasetV1={onLockGoldenDatasetV1}
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

      <PromptGeneratorFrontDoorPanel
        copied={copied}
        generatorInput={generatorInput}
        guidedWizard={guidedWizard}
        onApplyGeneratorVariant={onApplyGeneratorVariant}
        onCopy={onCopy}
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

      <OneClickExportPackPanel
        copied={copied}
        goldenDataset={goldenDataset}
        onCopy={onCopy}
        onExportOneClickTrainingPack={onExportOneClickTrainingPack}
        packText={oneClickExportPack}
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

function TrainFlowModesPanel({ modes, onSelect }: { modes: TrainModeReport; onSelect: (id: string) => void }) {
  return (
    <section className="panel lab-panel train-flow-panel" data-train-section="workflow">
      <div className="panel-header">
        <SlidersHorizontal size={18} />
        <h2>Training modes</h2>
      </div>
      <div className="mode-flow-grid">
        {modes.map((mode) => (
          <button type="button" key={mode.id} onClick={() => onSelect(mode.target)}>
            <span data-tone={scoreTone(mode.score)}>{mode.score}</span>
            <strong>{mode.label}</strong>
            <p>{mode.detail}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function TrainWorkflowAccordionPanel({ onSelect }: { onSelect: (id: string) => void }) {
  const groups = [
    { title: "Ingest and curate", target: "workspace", items: ["Import prompts", "Quarantine off-project text", "Lock Golden Dataset v1"] },
    { title: "Generate and compare", target: "generate", items: ["Guided wizard", "Claude comparison", "Mutation tournament"] },
    { title: "Prove and learn", target: "queue", items: ["Queue build", "Capture screenshots", "Write result back to memory"] },
    { title: "Export and sync", target: "packs", items: ["Model JSONL", "Claude project memory", "Codex skill bundle"] },
  ];
  return (
    <section className="panel lab-panel train-accordion-panel" data-train-section="workflow">
      <div className="panel-header">
        <ListChecks size={18} />
        <h2>Collapsible training map</h2>
      </div>
      <div className="train-accordion-grid">
        {groups.map((group, index) => (
          <details className="train-accordion" key={group.title} open={index < 2}>
            <summary>
              <strong>{group.title}</strong>
              <span>{group.items.length} steps</span>
            </summary>
            <ul>
              {group.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <button className="ghost-button compact-button" type="button" onClick={() => onSelect(group.target)}>
              Jump there
            </button>
          </details>
        ))}
      </div>
    </section>
  );
}

function HostedBuildWorkerPanel({
  onRunHostedProofWorker,
  onRunQueueViaApi,
  report,
}: {
  onRunHostedProofWorker: () => void;
  onRunQueueViaApi: () => void;
  report: HostedBuildWorkerReport;
}) {
  return (
    <section className="panel lab-panel hosted-worker-panel" data-readiness={report.readiness} data-train-section="queue">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Real hosted build worker</h2>
        </div>
        <ScoreRing score={report.score} label={report.readiness} />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <div className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Ready" : "Needs work"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </div>
        ))}
      </div>
      <FeedbackList title="Worker plan" items={report.workerPlan} empty="No worker plan." />
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onRunHostedProofWorker}>Run hosted proof worker</button>
        <button className="ghost-button compact-button" type="button" onClick={onRunQueueViaApi}>Run existing queue</button>
      </div>
      <FeedbackList title="Worker notes" items={report.notes} empty="No worker notes." />
    </section>
  );
}

function MeasuredQualitySprintPanel({ report }: { report: MeasuredQualitySprintReport }) {
  return (
    <section className="panel lab-panel" data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Measured quality sprint</h2>
        </div>
        <ScoreRing score={report.score} label="sprint" />
      </div>
      <div className="safe-check-grid">
        {report.cards.map((card) => (
          <div className="safe-check" key={card.label} data-ready={card.ready ? "true" : "false"}>
            <strong>{card.ready ? "Ready" : "Open"}</strong>
            <span>{card.label}</span>
            <p>{card.detail}</p>
          </div>
        ))}
      </div>
      <FeedbackList title="Sprint notes" items={report.notes} empty="No sprint notes." />
    </section>
  );
}

function ProductEvolutionPanel({
  onSelect,
  report,
}: {
  onSelect: (id: string) => void;
  report: ProductEvolutionReport;
}) {
  return (
    <section className="panel lab-panel product-sprint-panel" data-readiness={report.status} data-train-section="product-evolution">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>{report.headline}</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <p className="selected-meta">
        The next product layer simplifies the learner path, strengthens memory, adds review/holdout/editor/spaces, splits logic into a module, and polishes the public demo.
      </p>
      <div className="metric-grid compact-metrics">
        <Metric value={`${report.items.filter((item) => item.status === "ready").length}/${report.items.length}`} label="Ready upgrades" />
        <Metric value={formatNumber(report.blockers.length)} label="Blockers" />
        <Metric value={formatNumber(report.score)} label="Evolution score" />
      </div>
      <div className="safe-check-grid product-os-grid">
        {report.items.map((item) => (
          <button
            className="safe-check product-command-card"
            key={item.id}
            type="button"
            data-ready={item.status === "ready" ? "true" : "false"}
            onClick={() => onSelect(item.target)}
          >
            <strong>{item.score}</strong>
            <span>{item.label}</span>
            <p>{item.evidence}</p>
            <small>{item.nextAction}</small>
          </button>
        ))}
      </div>
      <p className="selected-meta"><strong>Next:</strong> {report.nextAction}</p>
      <FeedbackList title="Evolution summary" items={report.summary} empty="No evolution summary." />
      {report.blockers.length ? <FeedbackList title="Evolution blockers" items={report.blockers} empty="No blockers." /> : null}
    </section>
  );
}

function PromptLearnerModePanel({
  onSelect,
  report,
}: {
  onSelect: (id: string) => void;
  report: PromptLearnerModeReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="learner-mode">
      <div className="output-header">
        <div className="panel-header">
          <BookOpen size={18} />
          <h2>Prompt Learner mode</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <p className="selected-meta">{report.valueStory}</p>
      <div className="safe-check-grid">
        {report.steps.map((step) => (
          <button className="safe-check product-command-card" key={step.id} type="button" data-ready={step.ready ? "true" : "false"} onClick={() => onSelect(step.target)}>
            <strong>{step.score}</strong>
            <span>{step.label}</span>
            <p>{step.detail}</p>
            <small>{step.action}</small>
          </button>
        ))}
      </div>
      <FeedbackList title="Learner notes" items={report.notes} empty="No learner notes." />
    </section>
  );
}

function LearningMemoryV2Panel({
  copied,
  onCopy,
  onSetDecision,
  report,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onSetDecision: (ruleId: string, decision: MemoryRuleDecision) => void;
  report: LearningMemoryV2Report;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="memory-v2">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Learning Memory v2</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.rules.map((rule) => (
          <article className="safe-check" key={rule.label} data-ready={rule.confidence >= 70 ? "true" : "false"}>
            <strong>{rule.confidence}</strong>
            <span>{rule.label}</span>
            <p>{rule.promptPatch}</p>
            <small>{rule.evidenceCount} evidence item(s) / {rule.decision}</small>
            <div className="button-row compact-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onSetDecision(rule.id, "accepted")}>Accept</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onSetDecision(rule.id, "pinned")}>Pin</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onSetDecision(rule.id, "rejected")}>Reject</button>
            </div>
          </article>
        ))}
      </div>
      <div className="button-row">
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.memoryPatch, "learning-memory-v2")}>
          {copied === "learning-memory-v2" ? <Check size={15} /> : <Copy size={15} />}
          Copy memory patch
        </button>
      </div>
      <FeedbackList title="Memory notes" items={report.notes} empty="No memory notes." />
    </section>
  );
}

function ResultReviewerPanel({
  onApplyAction,
  report,
}: {
  onApplyAction: (row: ResultReviewerReport["rows"][number], action: "promote" | "repair" | "exclude") => void;
  report: ResultReviewerReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="result-reviewer">
      <div className="output-header">
        <div className="panel-header">
          <MonitorSmartphone size={18} />
          <h2>Side-by-side result reviewer</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      {report.rows.length ? (
        <div className="safe-check-grid">
          {report.rows.map((row) => (
            <article className="safe-check" key={row.promptId} data-ready={row.verdict === "promote" ? "true" : "false"}>
              <strong>{row.buildScore}/{row.visualScore}</strong>
              <span>{row.title}</span>
              <p>{row.action}</p>
              <small>{row.verdict} / delta {row.delta}</small>
              <div className="button-row compact-row">
                <button className="ghost-button compact-button" type="button" onClick={() => onApplyAction(row, "promote")}>Promote</button>
                <button className="ghost-button compact-button" type="button" onClick={() => onApplyAction(row, "repair")}>Repair</button>
                <button className="ghost-button compact-button" type="button" onClick={() => onApplyAction(row, "exclude")}>Exclude</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="selected-meta">No paired build and screenshot rows yet. Run proof or import a result to review side by side.</p>
      )}
      <FeedbackList title="Reviewer actions" items={report.reviewActions} empty="No reviewer actions." />
      <FeedbackList title="Reviewer notes" items={report.notes} empty="No reviewer notes." />
    </section>
  );
}

function HoldoutBenchmarkPanel({ report }: { report: HoldoutBenchmarkReport }) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="holdout">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Holdout benchmark regression</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={`${report.lockedCount}/${report.rows.length}`} label="Locked holdouts" />
        <Metric value={formatNumber(report.score)} label="Regression score" />
      </div>
      <div className="safe-check-grid">
        {report.rows.slice(0, 6).map((row) => (
          <article className="safe-check" key={row.id} data-ready={row.locked ? "true" : "false"}>
            <strong>{row.localScore}</strong>
            <span>{row.title}</span>
            <p>{row.policy}</p>
            <small>{row.missingTraits.length ? row.missingTraits.slice(0, 3).join(" / ") : "No missing traits"}</small>
          </article>
        ))}
      </div>
      <FeedbackList title="Regression policy" items={report.regressionPolicy} empty="No regression policy." />
      <FeedbackList title="Holdout notes" items={report.notes} empty="No holdout notes." />
    </section>
  );
}

function PromptEditorStudioPanel({
  copied,
  onCopy,
  onSaveSection,
  report,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onSaveSection: (card: PromptEditorStudioReport["cards"][number]) => void;
  report: PromptEditorStudioReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="editor-studio">
      <div className="output-header">
        <div className="panel-header">
          <SlidersHorizontal size={18} />
          <h2>Prompt editor studio</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.cards.map((card) => (
          <article className="safe-check" key={card.label} data-ready={card.ready ? "true" : "false"}>
            <strong>{card.ready ? "Ready" : "Edit"}</strong>
            <span>{card.label}</span>
            <p>{card.detail}</p>
            <small>{card.rewriteHint}</small>
            <div className="button-row compact-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(card.rewriteHint, `editor-${card.label}`)}>
                {copied === `editor-${card.label}` ? <Check size={15} /> : <Copy size={15} />}
                Hint
              </button>
              <button className="ghost-button compact-button" type="button" onClick={() => onSaveSection(card)}>
                <Save size={15} />
                Save patch
              </button>
            </div>
          </article>
        ))}
      </div>
      <FeedbackList title="Edit recipe" items={report.editRecipe} empty="No edit recipe." />
      <FeedbackList title="Editor notes" items={report.notes} empty="No editor notes." />
    </section>
  );
}

function ProjectSpacesPanel({
  onSaveProjectSpace,
  report,
}: {
  onSaveProjectSpace: () => void;
  report: ProjectSpacesReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="project-spaces">
      <div className="output-header">
        <div className="panel-header">
          <PackageOpen size={18} />
          <h2>Project spaces</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={onSaveProjectSpace}>
            <Save size={15} />
            Save current
          </button>
          <ScoreRing score={report.score} label={report.status} />
        </div>
      </div>
      <div className="safe-check-grid">
        {report.spaces.map((space) => (
          <article className="safe-check" key={space.id} data-ready={space.isolation !== "blocked" ? "true" : "false"}>
            <strong>{space.count}</strong>
            <span>{space.label}</span>
            <p>{space.detail}</p>
            <small>{space.isolation}</small>
          </article>
        ))}
      </div>
      <FeedbackList title="Space policy" items={report.activePolicy} empty="No space policy." />
      <FeedbackList title="Space notes" items={report.notes} empty="No space notes." />
    </section>
  );
}

function ModularArchitecturePanel({ report }: { report: ModularArchitectureReport }) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="architecture">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Modular architecture cleanup</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <article className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Ready" : "Watch"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Module plan" items={report.modulePlan} empty="No module plan." />
      <FeedbackList title="Architecture notes" items={report.notes} empty="No architecture notes." />
    </section>
  );
}

function PublicDemoExperiencePanel({ report }: { report: PublicDemoExperienceReport }) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="public-experience">
      <div className="output-header">
        <div className="panel-header">
          <Laptop size={18} />
          <h2>Public demo experience</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <p className="selected-meta">{report.headline}</p>
      <div className="safe-check-grid">
        {report.rows.map((row) => (
          <article className="safe-check" key={row.label} data-ready={row.ready ? "true" : "false"}>
            <strong>{row.ready ? "Ready" : "Polish"}</strong>
            <span>{row.label}</span>
            <p>{row.detail}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Public demo script" items={report.demoScript} empty="No demo script." />
      <FeedbackList title="Public demo notes" items={report.notes} empty="No public demo notes." />
    </section>
  );
}

function ProductSprintPanel({
  onSelect,
  report,
}: {
  onSelect: (id: string) => void;
  report: ProductSprintReport;
}) {
  return (
    <section className="panel lab-panel product-sprint-panel" data-readiness={report.status} data-train-section="product-sprint">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>{report.headline}</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <p className="selected-meta">
        The next product batch is now one operating layer: guided run, cleanup, battle autopilot, template compiler, result feedback, public demo simplification, and no-key local mode.
      </p>
      <div className="metric-grid compact-metrics">
        <Metric value={`${report.items.filter((item) => item.status === "ready").length}/${report.items.length}`} label="Ready upgrades" />
        <Metric value={formatNumber(report.blockers.length)} label="Blockers" />
        <Metric value={formatNumber(report.score)} label="Sprint score" />
      </div>
      <div className="safe-check-grid product-os-grid">
        {report.items.map((item) => (
          <button
            className="safe-check product-command-card"
            key={item.id}
            type="button"
            data-ready={item.status === "ready" ? "true" : "false"}
            onClick={() => onSelect(item.target)}
          >
            <strong>{item.score}</strong>
            <span>{item.label}</span>
            <p>{item.evidence}</p>
            <small>{item.nextAction}</small>
          </button>
        ))}
      </div>
      <p className="selected-meta"><strong>Next:</strong> {report.nextAction}</p>
      <FeedbackList title="Sprint summary" items={report.summary} empty="No sprint summary." />
      {report.blockers.length ? <FeedbackList title="Sprint blockers" items={report.blockers} empty="No blockers." /> : null}
    </section>
  );
}

function GuidedProductRunPanel({
  onRunGuidedTraining,
  onSelect,
  report,
}: {
  onRunGuidedTraining: () => void;
  onSelect: (id: string) => void;
  report: GuidedProductRunReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="guided-run">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>One guided training run</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.steps.map((step) => (
          <button className="safe-check product-command-card" key={step.id} type="button" data-ready={step.status === "ready" ? "true" : "false"} onClick={() => onSelect(step.target)}>
            <strong>{step.score}</strong>
            <span>{step.label}</span>
            <p>{step.detail}</p>
            <small>{step.action}</small>
          </button>
        ))}
      </div>
      <p className="selected-meta"><strong>Primary:</strong> {report.primaryAction}</p>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onRunGuidedTraining}>Run guided training</button>
      </div>
      <FeedbackList title="Guided run notes" items={report.notes} empty="No guided run notes." />
    </section>
  );
}

function CorpusCleanupModePanel({
  onRunCorpusHygieneSweep,
  onSelect,
  report,
}: {
  onRunCorpusHygieneSweep: () => void;
  onSelect: (id: string) => void;
  report: CorpusCleanupModeReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="cleanup-mode">
      <div className="output-header">
        <div className="panel-header">
          <ShieldCheck size={18} />
          <h2>Corpus cleanup mode</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={formatNumber(report.counts.leakage)} label="Leakage" />
        <Metric value={formatNumber(report.counts.exact + report.counts.near)} label="Duplicates" />
        <Metric value={formatNumber(report.counts.weak)} label="Weak prompts" />
      </div>
      <div className="safe-check-grid">
        {report.rows.map((row) => (
          <button className="safe-check product-command-card" key={row.label} type="button" data-ready={row.status === "clean" ? "true" : "false"} onClick={() => onSelect(row.target)}>
            <strong>{row.severity}</strong>
            <span>{row.label}</span>
            <p>{row.detail}</p>
            <small>{row.action}</small>
          </button>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onRunCorpusHygieneSweep}>Apply hygiene sweep</button>
      </div>
      <p className="selected-meta">{report.bulkAction}</p>
      <FeedbackList title="Cleanup notes" items={report.notes} empty="No cleanup notes." />
    </section>
  );
}

function PromptBattleAutopilotPanel({
  onQueueBattle,
  onSelect,
  report,
}: {
  onQueueBattle: () => void;
  onSelect: (id: string) => void;
  report: PromptBattleAutopilotReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="battle-autopilot">
      <div className="output-header">
        <div className="panel-header">
          <Swords size={18} />
          <h2>Prompt battle autopilot</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <p className="selected-meta"><strong>Winner:</strong> {report.winnerTitle}. {report.decision}</p>
      <div className="safe-check-grid">
        {report.variants.map((variant) => (
          <article className="safe-check" key={`${variant.source}-${variant.title}`} data-ready={variant.score >= 75 ? "true" : "false"}>
            <strong>{variant.score}</strong>
            <span>{variant.title}</span>
            <p>{variant.source}: {variant.reason}</p>
            <small>{variant.promptPreview}</small>
          </article>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onQueueBattle}>Queue battle variants</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onSelect("result-feedback")}>Open feedback loop</button>
      </div>
      <FeedbackList title="Battle notes" items={report.notes} empty="No battle notes." />
    </section>
  );
}

function TemplateCompilerPanel({
  copied,
  onCopy,
  report,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  report: TemplateCompilerReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="template-compiler">
      <div className="output-header">
        <div className="panel-header">
          <FileJson size={18} />
          <h2>Prompt template compiler</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.slots.map((slot) => (
          <article className="safe-check" key={slot.label} data-ready={slot.ready ? "true" : "false"}>
            <strong>{slot.ready ? "Ready" : "Slot"}</strong>
            <span>{slot.label}</span>
            <p>{slot.detail}</p>
          </article>
        ))}
      </div>
      <div className="button-row">
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.compilerPrompt, "template-compiler-prompt")}>
          {copied === "template-compiler-prompt" ? <Check size={15} /> : <Copy size={15} />}
          Compiler prompt
        </button>
        {report.templates[0] ? (
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.templates[0].prompt, report.templates[0].id)}>
            {copied === report.templates[0].id ? <Check size={15} /> : <Copy size={15} />}
            Top template
          </button>
        ) : null}
      </div>
      <div className="safe-check-grid">
        {report.templates.slice(0, 3).map((template) => (
          <article className="safe-check" key={template.id} data-ready={template.score >= 75 ? "true" : "false"}>
            <strong>{template.score}</strong>
            <span>{template.title}</span>
            <p>{template.bestFor}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Compiler notes" items={report.notes} empty="No compiler notes." />
    </section>
  );
}

function ResultFeedbackLoopPanel({
  copied,
  onApplyResultLearningPatch,
  onCopy,
  onSelect,
  report,
}: {
  copied: string;
  onApplyResultLearningPatch: () => void;
  onCopy: (value: string, key: string) => void;
  onSelect: (id: string) => void;
  report: ResultFeedbackLoopReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="result-feedback">
      <div className="output-header">
        <div className="panel-header">
          <Activity size={18} />
          <h2>Real result feedback loop</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.rows.map((row) => (
          <button className="safe-check product-command-card" key={row.label} type="button" data-ready={row.status === "ready" ? "true" : "false"} onClick={() => onSelect(row.target)}>
            <strong>{row.score}</strong>
            <span>{row.label}</span>
            <p>{row.detail}</p>
            <small>{row.action}</small>
          </button>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onApplyResultLearningPatch}>Apply repair patch</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.feedbackPatch, "result-feedback-patch")}>
          {copied === "result-feedback-patch" ? <Check size={15} /> : <Copy size={15} />}
          Copy feedback patch
        </button>
      </div>
      <FeedbackList title="Feedback notes" items={report.notes} empty="No feedback notes." />
    </section>
  );
}

function PublicDemoSimplificationPanel({
  onLoadDemoMode,
  onSelect,
  report,
}: {
  onLoadDemoMode: () => void;
  onSelect: (id: string) => void;
  report: PublicDemoSimplificationReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="demo-simple">
      <div className="output-header">
        <div className="panel-header">
          <MonitorSmartphone size={18} />
          <h2>Public demo simplification</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <p className="selected-meta">{report.publicStory}</p>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <button className="safe-check product-command-card" key={check.label} type="button" data-ready={check.ready ? "true" : "false"} onClick={() => onSelect(check.label === "Proof visible" ? "result-feedback" : "public-demo")}>
            <strong>{check.ready ? "Ready" : "Open"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </button>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onLoadDemoMode}>Load public demo mode</button>
      </div>
      <FeedbackList title="Hide from public path" items={report.hiddenComplexity} empty="No hidden complexity." />
      <FeedbackList title="Demo notes" items={report.notes} empty="No demo notes." />
    </section>
  );
}

function LocalModePolishPanel({
  onApplyProviderPreset,
  report,
}: {
  onApplyProviderPreset: (kind: "local" | "anthropic" | "openai-compatible" | "codex-agent" | "scaffold-build") => void;
  report: LocalModePolishReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="local-mode">
      <div className="output-header">
        <div className="panel-header">
          <Laptop size={18} />
          <h2>No-key local mode polish</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("local")}>Use local fallback</button>
          <ScoreRing score={report.score} label={report.status} />
        </div>
      </div>
      <p className="selected-meta">{report.modeLabel}</p>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <article className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Ready" : "Open"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
            {!check.ready ? <small>{check.fix}</small> : null}
          </article>
        ))}
      </div>
      <FeedbackList title="Local mode notes" items={report.notes} empty="No local mode notes." />
    </section>
  );
}

function PromptProductOsPanel({
  onSelect,
  report,
}: {
  onSelect: (id: string) => void;
  report: PromptProductOsReport;
}) {
  return (
    <section className="panel lab-panel product-os-panel" data-readiness={report.status} data-train-section="product-os">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>{report.headline}</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <p className="selected-meta">
        One operating layer for the full product path: command center, dataset inbox, generator, proof gallery, accessibility QA, demo polish, regression, exports, and explanations.
      </p>
      <div className="metric-grid compact-metrics">
        <Metric value={`${report.items.filter((item) => item.status === "ready").length}/${report.items.length}`} label="Ready upgrades" />
        <Metric value={formatNumber(report.blockers.length)} label="Blockers" />
        <Metric value={formatNumber(report.score)} label="Product score" />
      </div>
      <div className="safe-check-grid product-os-grid">
        {report.items.map((item) => (
          <button
            className="safe-check product-command-card"
            key={item.id}
            type="button"
            data-ready={item.status === "ready" ? "true" : "false"}
            onClick={() => onSelect(item.target)}
          >
            <strong>{item.score}</strong>
            <span>{item.label}</span>
            <p>{item.evidence}</p>
            <small>{item.nextAction}</small>
          </button>
        ))}
      </div>
      <p className="selected-meta"><strong>Next:</strong> {report.nextAction}</p>
      <FeedbackList title="Product OS summary" items={report.summary} empty="No product OS summary." />
      {report.blockers.length ? <FeedbackList title="Product OS blockers" items={report.blockers} empty="No blockers." /> : null}
    </section>
  );
}

function AccessibilityQaScorePanel({
  onSelect,
  report,
}: {
  onSelect: (id: string) => void;
  report: AccessibilityQaScoreReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="qa-score">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Accessibility and QA scoring</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onSelect("quality")}>
            Open quality gate
          </button>
          <ScoreRing score={report.score} label={report.status} />
        </div>
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <article className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Ready" : check.blocking ? "Blocker" : "Watch"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
            {!check.ready ? <small>{check.fix}</small> : null}
          </article>
        ))}
      </div>
      <FeedbackList title="Accessibility QA notes" items={report.notes} empty="No accessibility QA notes." />
    </section>
  );
}

function ProductCommandCenterPanel({
  onSelect,
  report,
}: {
  onSelect: (id: string) => void;
  report: ProductCommandCenterReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Product Command Center</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.cards.map((card) => (
          <button className="safe-check product-command-card" key={card.id} type="button" data-ready={card.status === "ready" || card.status === "complete" ? "true" : "false"} onClick={() => onSelect(card.target)}>
            <strong>{card.metric}</strong>
            <span>{card.label}</span>
            <p>{card.reason}</p>
            <small>{card.cta}</small>
          </button>
        ))}
      </div>
      <p className="selected-meta"><strong>Next:</strong> {report.nextAction}</p>
      <FeedbackList title="Command notes" items={report.notes} empty="No command notes." />
    </section>
  );
}

function AllInRunwayPanel({
  onSelect,
  report,
}: {
  onSelect: (id: string) => void;
  report: AllInRunwayReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <PackageOpen size={18} />
          <h2>All-in product runway</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={`${report.items.filter((item) => item.status === "ready").length}/${report.items.length}`} label="Ready" />
        <Metric value={formatNumber(report.blockers.length)} label="Blockers" />
        <Metric value={formatNumber(report.score)} label="Runway score" />
      </div>
      <div className="safe-check-grid">
        {report.items.map((item) => (
          <button className="safe-check product-command-card" key={item.id} type="button" data-ready={item.status === "ready" ? "true" : "false"} onClick={() => onSelect(item.target)}>
            <strong>{item.score}</strong>
            <span>{item.label}</span>
            <p>{item.evidence}</p>
            <small>{item.nextAction}</small>
          </button>
        ))}
      </div>
      <p className="selected-meta"><strong>Next:</strong> {report.nextAction}</p>
      <FeedbackList title="All-in summary" items={report.summary} empty="No runway summary." />
      {report.blockers.length ? <FeedbackList title="Runway blockers" items={report.blockers} empty="No blockers." /> : null}
    </section>
  );
}

function LearningMachinePanel({
  onSelect,
  report,
}: {
  onSelect: (id: string) => void;
  report: LearningMachineReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="machine">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Learning machine control plane</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={`${report.items.filter((item) => item.status === "ready").length}/${report.items.length}`} label="Ready" />
        <Metric value={formatNumber(report.blockers.length)} label="Blockers" />
        <Metric value={formatNumber(report.score)} label="Machine score" />
      </div>
      <div className="safe-check-grid">
        {report.items.map((item) => (
          <button className="safe-check product-command-card" key={item.id} type="button" data-ready={item.status === "ready" ? "true" : "false"} onClick={() => onSelect(item.target)}>
            <strong>{item.score}</strong>
            <span>{item.label}</span>
            <p>{item.evidence}</p>
            <small>{item.nextAction}</small>
          </button>
        ))}
      </div>
      <p className="selected-meta"><strong>Next:</strong> {report.nextAction}</p>
      <FeedbackList title="Machine summary" items={report.summary} empty="No learning machine summary." />
      {report.blockers.length ? <FeedbackList title="Machine blockers" items={report.blockers} empty="No blockers." /> : null}
    </section>
  );
}

function NextProductLayerPanel({
  copied,
  onCopy,
  report,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  report: NextProductLayerReport;
}) {
  const commandPack = report.items.map((item) => item.command).filter(Boolean).join("\n");

  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="next-layer">
      <div className="output-header">
        <div className="panel-header">
          <PackageOpen size={18} />
          <h2>Next product layer</h2>
        </div>
        <div className="button-row">
          <button
            className="ghost-button compact-button"
            type="button"
            onClick={() => onCopy(commandPack, "next-layer-command-pack")}
            disabled={!commandPack}
          >
            {copied === "next-layer-command-pack" ? <Check size={15} /> : <Copy size={15} />}
            Copy commands
          </button>
          <ScoreRing score={report.score} label={report.status} />
        </div>
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={`${report.items.filter((item) => item.status === "ready").length}/${report.items.length}`} label="Ready lanes" />
        <Metric value={formatNumber(report.items.filter((item) => item.status === "active").length)} label="Active lanes" />
        <Metric value={formatNumber(report.blockers.length)} label="Blockers" />
      </div>
      <div className="safe-check-grid">
        {report.items.map((item) => (
          <article className="safe-check product-command-card" key={item.id} data-ready={item.status === "ready" ? "true" : "false"}>
            <strong>{item.score}</strong>
            <span>{item.label}</span>
            <p>{item.evidence}</p>
            <small>{item.nextAction}</small>
            <button
              className="ghost-button compact-button"
              type="button"
              onClick={() => onCopy(item.command, `next-layer-${item.id}`)}
              disabled={!item.command}
            >
              {copied === `next-layer-${item.id}` ? <Check size={15} /> : <Copy size={15} />}
              Command
            </button>
          </article>
        ))}
      </div>
      <p className="selected-meta"><strong>Next:</strong> {report.nextAction}</p>
      <FeedbackList title="Next layer summary" items={report.summary} empty="No next-layer summary." />
      {report.blockers.length ? <FeedbackList title="Next layer blockers" items={report.blockers} empty="No blockers." /> : null}
    </section>
  );
}

function ProofSeedingRunwayPanel({
  copied,
  onCopy,
  report,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  report: ProofSeedingRunwayReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="proof-seeding">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>Proof seeding runway</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.command, "proof-seeding-command")}>
            {copied === "proof-seeding-command" ? <Check size={15} /> : <Copy size={15} />}
            Command
          </button>
          <ScoreRing score={report.score} label={report.status} />
        </div>
      </div>
      <div className="safe-check-grid">
        {report.rows.map((row) => (
          <div className="safe-check" key={row.label} data-ready={row.ready ? "true" : "false"}>
            <strong>{row.ready ? "Ready" : "Open"}</strong>
            <span>{row.label}</span>
            <p>{row.detail}</p>
          </div>
        ))}
      </div>
      <p className="selected-meta"><strong>Seed command:</strong> {report.command}</p>
      <FeedbackList title="Proof seeding notes" items={report.notes} empty="No proof seeding notes." />
    </section>
  );
}

function AutonomousProofLoopPanel({
  onRunAutonomousProofLoop,
  report,
}: {
  onRunAutonomousProofLoop: () => void;
  report: AutonomousProofLoopReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="autonomous">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>Autonomous proof loop</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="guided-stepper-grid">
        {report.steps.map((step) => (
          <div className="guided-step" key={step.label} data-status={step.ready ? "ready" : "active"}>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" disabled={!report.canRun} onClick={onRunAutonomousProofLoop}>
        Run autonomous proof loop
      </button>
      <p className="selected-meta"><strong>Smoke:</strong> {report.command}</p>
      <FeedbackList title="Autonomous notes" items={report.notes} empty="No autonomous notes." />
    </section>
  );
}

function GeneratorV3Panel({
  copied,
  onApplyMode,
  onCopy,
  report,
}: {
  copied: string;
  onApplyMode: (mode: GeneratorV3Report["modes"][number]) => void;
  onCopy: (value: string, key: string) => void;
  report: GeneratorV3Report;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="generator-v3">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Prompt generator v3</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.fields.map((field) => (
          <div className="safe-check" key={field.label} data-ready={field.ready ? "true" : "false"}>
            <strong>{field.ready ? "Ready" : "Open"}</strong>
            <span>{field.label}</span>
            <p>{field.detail}</p>
          </div>
        ))}
      </div>
      <div className="benchmark-v2-grid">
        {report.modes.map((mode) => (
          <button className="benchmark-row product-command-card" key={mode.id} type="button" data-status={mode.ready ? "aligned" : "watch"} onClick={() => onApplyMode(mode)}>
            <strong>{mode.label}</strong>
            <p>{mode.detail}</p>
            <span>{mode.ready ? "trained" : "thin"}</span>
          </button>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={() => onCopy(report.compiledPreview, "generator-v3-preview")}>
          {copied === "generator-v3-preview" ? "Copied" : "Copy v3 preview"}
        </button>
      </div>
      <FeedbackList title="Generator v3 notes" items={report.notes} empty="No generator v3 notes." />
    </section>
  );
}

function BenchmarkExpansionPanel({
  onRunBenchmarkV2,
  report,
}: {
  onRunBenchmarkV2: () => void;
  report: BenchmarkExpansionReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="benchmark-scale">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Benchmark suite expansion</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={formatNumber(report.total)} label="Golden cases" />
        <Metric value={formatNumber(report.byType.length)} label="Types" />
        <Metric value={formatNumber(report.missingTypes.length)} label="Gaps" />
      </div>
      <div className="safe-check-grid">
        {report.byType.slice(0, 8).map((row) => (
          <div className="safe-check" key={row.label} data-ready="true">
            <strong>{row.count}</strong>
            <span>{row.label}</span>
            <p>Canonical benchmark coverage bucket.</p>
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onRunBenchmarkV2}>Run benchmark v2</button>
      {report.missingTypes.length ? <FeedbackList title="Remaining benchmark gaps" items={report.missingTypes.slice(0, 8)} empty="No benchmark gaps." /> : null}
      <FeedbackList title="Benchmark expansion notes" items={report.notes} empty="No benchmark expansion notes." />
    </section>
  );
}

function LearningExplanationPanel({ report }: { report: LearningExplanationReport }) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="explain">
      <div className="output-header">
        <div className="panel-header">
          <Lightbulb size={18} />
          <h2>Learning explanations</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <p className="selected-meta">{report.plainEnglish}</p>
      <div className="safe-check-grid">
        {report.cards.map((card) => (
          <div className="safe-check" key={card.label} data-ready={card.score >= 70 ? "true" : "false"}>
            <strong>{card.score}</strong>
            <span>{card.label}</span>
            <p>{card.plainEnglish}</p>
            <small>{card.nextAction}</small>
          </div>
        ))}
      </div>
      <FeedbackList title="Explanation notes" items={report.notes} empty="No explanation notes." />
    </section>
  );
}

function PublicDemoPolishPanel({
  onLoadDemoMode,
  onSelect,
  report,
}: {
  onLoadDemoMode: () => void;
  onSelect: (id: string) => void;
  report: PublicDemoPolishReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="public-demo">
      <div className="output-header">
        <div className="panel-header">
          <BookOpen size={18} />
          <h2>Public demo polish</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <article className="version-card">
        <strong>{report.headline}</strong>
        <p>Public visitors should understand corpus, learned patterns, generation, proof, explanations, and exports in one pass.</p>
      </article>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <button className="safe-check product-command-card" key={check.label} type="button" data-ready={check.ready ? "true" : "false"} onClick={() => onSelect(check.label === "Result gallery" ? "demo" : check.label === "Exports" ? "training-exports" : "machine")}>
            <strong>{check.ready ? "Ready" : "Open"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </button>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onLoadDemoMode}>Load public demo mode</button>
      <FeedbackList title="Demo polish notes" items={report.notes} empty="No demo polish notes." />
    </section>
  );
}

function PublicProofChecklistPanel({
  copied,
  onCopy,
  report,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  report: PublicProofChecklistReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="public-proof">
      <div className="output-header">
        <div className="panel-header">
          <Clipboard size={18} />
          <h2>Public proof checklist</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <div className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Ready" : "Open"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </div>
        ))}
      </div>
      <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.command, "public-proof-command")}>
        {copied === "public-proof-command" ? <Check size={15} /> : <Copy size={15} />}
        Copy smoke command
      </button>
      <FeedbackList title="Public proof notes" items={report.notes} empty="No public proof notes." />
    </section>
  );
}

function HostedCiSmokePanel({
  onRunHostedSmoke,
  report,
}: {
  onRunHostedSmoke: () => void;
  report: HostedCiSmokeReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="hosted-smoke">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Hosted CI smoke</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <div className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Ready" : "Open"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onRunHostedSmoke}>Copy hosted smoke command</button>
      <p className="selected-meta"><strong>Command:</strong> {report.workflowPatch}</p>
      <FeedbackList title="Hosted smoke notes" items={report.notes} empty="No hosted smoke notes." />
    </section>
  );
}

function TrainingExportReadinessPanel({
  onExportOneClickTrainingPack,
  report,
}: {
  onExportOneClickTrainingPack: () => void;
  report: TrainingExportReadinessReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="training-exports">
      <div className="output-header">
        <div className="panel-header">
          <Download size={18} />
          <h2>Training export readiness</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.targets.map((target) => (
          <div className="safe-check" key={`${target.label}-${target.filename}`} data-ready={target.ready ? "true" : "false"}>
            <strong>{target.ready ? "Ready" : "Open"}</strong>
            <span>{target.label}</span>
            <p>{target.detail}</p>
            <small>{target.filename}</small>
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onExportOneClickTrainingPack}>Export one-click training pack</button>
      <FeedbackList title="Training export notes" items={report.notes} empty="No training export notes." />
    </section>
  );
}

function HostedBackendKitPanel({
  onCheckApi,
  onRunHostedSetupWizard,
  report,
}: {
  onCheckApi: () => void;
  onRunHostedSetupWizard: () => void;
  report: HostedBackendKitReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="hosted">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Hosted backend kit</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <div className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Ready" : check.blocking ? "Blocker" : "Todo"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
            {!check.ready ? <small>{check.fix}</small> : null}
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onCheckApi}>Check API</button>
        <button className="ghost-button compact-button" type="button" onClick={onRunHostedSetupWizard}>Run setup check</button>
      </div>
      <p className="selected-meta"><strong>CLI:</strong> {report.command}</p>
      <FeedbackList title="Hosted backend notes" items={report.notes} empty="No hosted backend notes." />
    </section>
  );
}

function PromptToProofWorkflowPanel({
  onProveGeneratedPrompt,
  onRunOneClickBuildProof,
  report,
}: {
  onProveGeneratedPrompt: () => void;
  onRunOneClickBuildProof: () => void;
  report: PromptToProofWorkflowReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="proof">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>One-click prompt-to-proof</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="guided-stepper-grid">
        {report.steps.map((step) => (
          <div className="guided-step" key={step.label} data-status={step.status === "done" ? "ready" : step.status === "active" ? "active" : "blocked"}>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" disabled={!report.canRun} onClick={onProveGeneratedPrompt}>Start proof run</button>
        <button className="ghost-button compact-button" type="button" onClick={onRunOneClickBuildProof}>Run local proof helper</button>
      </div>
      <p className="selected-meta"><strong>Primary action:</strong> {report.primaryAction}</p>
      <FeedbackList title="Prompt-to-proof notes" items={report.notes} empty="No proof workflow notes." />
    </section>
  );
}

function DatasetBulkToolsPanel({
  onBulkDecision,
  report,
}: {
  onBulkDecision: (action: DatasetInboxReport["rows"][number]["recommendation"]) => void;
  report: DatasetBulkToolsReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="dataset">
      <div className="output-header">
        <div className="panel-header">
          <Tags size={18} />
          <h2>Dataset Inbox bulk tools</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.actions.map((action) => (
          <button className="safe-check product-command-card" key={action.id} type="button" disabled={!action.enabled} data-ready={action.enabled ? "true" : "false"} onClick={() => onBulkDecision(action.id)}>
            <strong>{action.count}</strong>
            <span>{action.label}</span>
            <p>{action.detail}</p>
          </button>
        ))}
      </div>
      <FeedbackList title="Bulk tool notes" items={report.notes} empty="No bulk tool notes." />
    </section>
  );
}

function PreferenceTrainingPanel({
  onAddRecommendedPreferenceLabel,
  report,
}: {
  onAddRecommendedPreferenceLabel: () => void;
  report: PreferenceTrainingReport;
}) {
  const candidate = report.candidates[0];
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="preferences">
      <div className="output-header">
        <div className="panel-header">
          <Trophy size={18} />
          <h2>Human preference training</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={formatNumber(report.reviewCount)} label="Pairs" />
        <Metric value={formatNumber(report.goldCount)} label="Gold" />
        <Metric value={formatNumber(report.avoidCount)} label="Avoid" />
      </div>
      {candidate ? (
        <article className="version-card">
          <strong>Recommended pair</strong>
          <span>{candidate.leftId} vs {candidate.rightId}</span>
          <p>{candidate.reason}</p>
          <button className="primary-button compact-button" type="button" onClick={onAddRecommendedPreferenceLabel}>Add pairwise label</button>
        </article>
      ) : (
        <p className="selected-meta">Add at least two examples to create a recommended pair.</p>
      )}
      <FeedbackList title="Preference lessons" items={report.lessons} empty="No preference lessons." />
      <FeedbackList title="Preference notes" items={report.notes} empty="No preference notes." />
    </section>
  );
}

function PreferenceReviewDeckPanel({
  onAddPreferenceDeckLabel,
  report,
}: {
  onAddPreferenceDeckLabel: (pair: PreferenceReviewDeckReport["pairs"][number], winnerId?: string) => void;
  report: PreferenceReviewDeckReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="preference-deck">
      <div className="output-header">
        <div className="panel-header">
          <Trophy size={18} />
          <h2>Preference review deck</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={`${report.reviewedCount}/${report.targetCount}`} label="Reviewed" />
        <Metric value={formatNumber(report.pairs.length)} label="Ready pairs" />
        <Metric value={formatNumber(report.score)} label="Preference score" />
      </div>
      {report.pairs.length ? (
        <div className="benchmark-v2-grid">
          {report.pairs.map((pair) => (
            <article className="benchmark-row" key={`${pair.leftId}-${pair.rightId}`} data-status="watch">
              <strong>{pair.leftTitle} vs {pair.rightTitle}</strong>
              <p>{pair.reason}</p>
              <span>{pair.leftScore} / {pair.rightScore}</span>
              <div className="button-row">
                <button className="ghost-button compact-button" type="button" onClick={() => onAddPreferenceDeckLabel(pair, pair.leftId)}>
                  Pick left
                </button>
                <button className="ghost-button compact-button" type="button" onClick={() => onAddPreferenceDeckLabel(pair, pair.rightId)}>
                  Pick right
                </button>
                <button className="primary-button compact-button" type="button" onClick={() => onAddPreferenceDeckLabel(pair)}>
                  Pick suggested
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="selected-meta">No unreviewed preference pairs are ready. Add more prompts or clear completed pair labels.</p>
      )}
      <FeedbackList title="Preference deck notes" items={report.notes} empty="No preference deck notes." />
    </section>
  );
}

function ClaudeCalibrationProductPanel({
  onRunCachedModelEvaluation,
  onRunHostedClaudeHealthCheck,
  report,
}: {
  onRunCachedModelEvaluation: () => void;
  onRunHostedClaudeHealthCheck: () => void;
  report: ClaudeCalibrationProductReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="calibration">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Claude calibration dashboard</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <p className="selected-meta"><strong>Route:</strong> {report.route}</p>
      <div className="safe-check-grid">
        {report.rows.map((row) => (
          <div className="safe-check" key={row.label} data-ready={row.ready ? "true" : "false"}>
            <strong>{row.ready ? "Ready" : "Open"}</strong>
            <span>{row.label}</span>
            <p>{row.detail}</p>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onRunCachedModelEvaluation}>Run cached model eval</button>
        <button className="ghost-button compact-button" type="button" onClick={onRunHostedClaudeHealthCheck}>Check Claude route</button>
      </div>
      <FeedbackList title="Claude calibration notes" items={report.notes} empty="No Claude calibration notes." />
    </section>
  );
}

function BriefBuilderProductPanel({
  onApplyBriefBuilderPatch,
  report,
}: {
  onApplyBriefBuilderPatch: () => void;
  report: BriefBuilderProductReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="brief">
      <div className="output-header">
        <div className="panel-header">
          <SlidersHorizontal size={18} />
          <h2>Prompt generator brief builder</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.fields.map((field) => (
          <div className="safe-check" key={String(field.key)} data-ready={field.ready ? "true" : "false"}>
            <strong>{field.ready ? "Set" : "Missing"}</strong>
            <span>{field.label}</span>
            <p>{field.ready ? field.value : field.hint}</p>
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" disabled={!Object.keys(report.suggestedPatch).length} onClick={onApplyBriefBuilderPatch}>Fill missing brief fields</button>
      <FeedbackList title="Brief builder notes" items={report.notes} empty="No brief builder notes." />
    </section>
  );
}

function GeneratorBriefChecklistPanel({
  copied,
  onApplyBriefBuilderPatch,
  onCopy,
  report,
}: {
  copied: string;
  onApplyBriefBuilderPatch: () => void;
  onCopy: (value: string, key: string) => void;
  report: GeneratorBriefChecklistReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="brief-checklist">
      <div className="output-header">
        <div className="panel-header">
          <SlidersHorizontal size={18} />
          <h2>Generator brief checklist</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={report.completion} label="Complete" />
        <Metric value={String(Object.keys(report.suggestedPatch).length)} label="Patch fields" />
        <Metric value={formatNumber(report.samplePrompt.length)} label="Prompt chars" />
      </div>
      <div className="safe-check-grid">
        {report.fields.map((field) => (
          <div className="safe-check" key={String(field.key)} data-ready={field.ready ? "true" : "false"}>
            <strong>{field.ready ? "Ready" : "Ask"}</strong>
            <span>{field.label}</span>
            <p>{field.ready ? field.value : field.prompt}</p>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" disabled={!Object.keys(report.suggestedPatch).length} onClick={onApplyBriefBuilderPatch}>
          Fill missing fields
        </button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.samplePrompt, "brief-checklist-sample")} disabled={!report.samplePrompt}>
          {copied === "brief-checklist-sample" ? <Check size={15} /> : <Copy size={15} />}
          Copy generated prompt
        </button>
      </div>
      <FeedbackList title="Brief checklist notes" items={report.notes} empty="No brief checklist notes." />
    </section>
  );
}

function RegressionHistoryProductPanel({
  onRunBenchmarkSuite,
  onRunBenchmarkV2,
  report,
}: {
  onRunBenchmarkSuite: () => void;
  onRunBenchmarkV2: () => void;
  report: RegressionHistoryProductReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="regression">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Regression history</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        {report.metrics.map((metric) => <Metric key={metric.label} value={metric.value} label={metric.label} />)}
      </div>
      <div className="benchmark-v2-grid">
        {report.rows.map((row) => (
          <div className="benchmark-row" key={row.label} data-status={row.status === "pass" ? "aligned" : row.status === "fail" ? "missing" : "watch"}>
            <strong>{row.label}</strong>
            <p>{row.detail}</p>
            <span>{row.status}</span>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onRunBenchmarkSuite}>Run benchmark suite</button>
        <button className="ghost-button compact-button" type="button" onClick={onRunBenchmarkV2}>Run benchmark v2</button>
      </div>
      <FeedbackList title="Regression notes" items={report.notes} empty="No regression notes." />
    </section>
  );
}

function RegressionTimelinePanel({
  copied,
  onCopy,
  report,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  report: RegressionTimelineReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="regression-timeline">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Regression timeline export</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        {report.metrics.map((metric) => <Metric key={metric.label} value={metric.value} label={metric.label} />)}
      </div>
      <div className="benchmark-v2-grid">
        {report.events.map((event) => (
          <div className="benchmark-row" key={`${event.kind}-${event.label}-${event.createdAt}`} data-status={event.status === "fail" ? "missing" : event.status === "pass" ? "aligned" : "watch"}>
            <strong>{event.label}</strong>
            <p>{event.detail}</p>
            <span>{event.kind}</span>
          </div>
        ))}
      </div>
      <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.exportCommand, "regression-export-command")}>
        {copied === "regression-export-command" ? <Check size={15} /> : <Copy size={15} />}
        Copy export command
      </button>
      <FeedbackList title="Timeline notes" items={report.notes} empty="No timeline notes." />
    </section>
  );
}

function SecurityCleanupProductPanel({
  onRunSecurityCleanup,
  report,
}: {
  onRunSecurityCleanup: () => void;
  report: SecurityCleanupProductReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="security">
      <div className="output-header">
        <div className="panel-header">
          <AlertTriangle size={18} />
          <h2>Security cleanup</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <div className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Clean" : check.blocking ? "Blocker" : "Review"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
            {!check.ready ? <small>{check.fix}</small> : null}
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" disabled={!report.cleanupActions.length} onClick={onRunSecurityCleanup}>Run cleanup</button>
      <FeedbackList title="Cleanup actions" items={report.cleanupActions} empty="No cleanup actions." />
      <FeedbackList title="Security notes" items={report.notes} empty="No security notes." />
    </section>
  );
}

function SecurityBoundaryPanel({
  copied,
  onCopy,
  report,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  report: SecurityBoundaryReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="security-boundary">
      <div className="output-header">
        <div className="panel-header">
          <AlertTriangle size={18} />
          <h2>Credential boundary audit</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <div className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Clean" : check.blocking ? "Blocker" : "Review"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
            {!check.ready ? <small>{check.fix}</small> : null}
          </div>
        ))}
      </div>
      <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.auditCommand, "security-boundary-command")}>
        {copied === "security-boundary-command" ? <Check size={15} /> : <Copy size={15} />}
        Copy audit command
      </button>
      <FeedbackList title="Boundary notes" items={report.notes} empty="No boundary notes." />
    </section>
  );
}

function NarrativePolishPanel({
  onLoadDemoMode,
  onSelect,
  report,
}: {
  onLoadDemoMode: () => void;
  onSelect: (id: string) => void;
  report: NarrativePolishReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="story">
      <div className="output-header">
        <div className="panel-header">
          <BookOpen size={18} />
          <h2>Narrative polish</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <article className="version-card" data-train-section="demo">
        <strong>{report.headline}</strong>
        <p>{report.subhead}</p>
      </article>
      <div className="safe-check-grid">
        {report.beats.map((beat) => (
          <button className="safe-check product-command-card" key={beat.label} type="button" data-ready={beat.ready ? "true" : "false"} onClick={() => onSelect(beat.label === "Learn" ? "dataset" : beat.label === "Generate" ? "brief" : beat.label === "Prove" ? "proof" : beat.label === "Calibrate" ? "calibration" : beat.label === "Export" ? "packs" : "workflow")}>
            <strong>{beat.ready ? "Ready" : "Open"}</strong>
            <span>{beat.label}</span>
            <p>{beat.detail}</p>
          </button>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onLoadDemoMode}>Load public demo mode</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onSelect("demo")}>Review demo lane</button>
      </div>
      <FeedbackList title="Narrative notes" items={report.notes} empty="No narrative notes." />
    </section>
  );
}

function GeneratePromptFrontDoorPanel({
  copied,
  onApplyGeneratorVariant,
  onCopy,
  onProveGeneratedPrompt,
  report,
}: {
  copied: string;
  onApplyGeneratorVariant: (variant: LearnedGeneratorVariant) => void;
  onCopy: (value: string, key: string) => void;
  onProveGeneratedPrompt: () => void;
  report: PromptGeneratorV2Report;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.readiness} data-train-section="generate">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Generate Prompt</h2>
        </div>
        <ScoreRing score={report.score} label={report.readiness} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={formatNumber(report.appliedBenchmarks.length)} label="Benchmarks" />
        <Metric value={formatNumber(report.missingInputs.length)} label="Gaps" />
      </div>
      <div className="guided-stepper-grid">
        {report.sections.map((section) => (
          <div className="guided-step" key={section.label} data-status={section.ready ? "ready" : "active"}>
            <strong>{section.label}</strong>
            <p>{section.detail}</p>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={() => onApplyGeneratorVariant(report.variant)}>Load into editor</button>
        <button className="ghost-button compact-button" type="button" onClick={onProveGeneratedPrompt}>Prove generated prompt</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.compiledPrompt, "generate-front-door")}>
          {copied === "generate-front-door" ? <Check size={15} /> : <Copy size={15} />}
          Copy
        </button>
      </div>
      <FeedbackList title="Generator notes" items={report.notes} empty="No generator notes." />
    </section>
  );
}

function DatasetInboxPanel({
  onDecision,
  report,
}: {
  onDecision: (promptId: string, action: DatasetInboxReport["rows"][number]["recommendation"]) => void;
  report: DatasetInboxReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="dataset">
      <div className="output-header">
        <div className="panel-header">
          <Tags size={18} />
          <h2>Dataset Inbox</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={formatNumber(report.counts.learn)} label="Learn" />
        <Metric value={formatNumber(report.counts.gold)} label="Gold" />
        <Metric value={formatNumber(report.counts.review)} label="Review" />
        <Metric value={formatNumber(report.counts.quarantine + report.counts.remove)} label="Block" />
      </div>
      <div className="version-list compact-list">
        {report.rows.slice(0, 8).map((row) => (
          <article className="version-card" key={row.promptId}>
            <div>
              <strong>{row.title}</strong>
              <span>{row.recommendation} / {row.score}</span>
            </div>
            <p>{row.reason}</p>
            {row.warnings.length ? <p className="selected-meta">{row.warnings.slice(0, 2).join(" ")}</p> : null}
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onDecision(row.promptId, "learn")}>Learn</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onDecision(row.promptId, "gold")}>Gold</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onDecision(row.promptId, "review")}>Review</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onDecision(row.promptId, "quarantine")}>Quarantine</button>
              <button className="icon-button danger" type="button" onClick={() => onDecision(row.promptId, "remove")} aria-label={`Remove ${row.title}`}>
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
        {!report.rows.length && <p className="selected-meta">No dataset inbox rows yet.</p>}
      </div>
      <FeedbackList title="Inbox notes" items={report.notes} empty="No inbox notes." />
    </section>
  );
}

function ProofRunControllerPanel({
  jobs,
  onOperateQueueJob,
  onProveGeneratedPrompt,
  report,
}: {
  jobs: BuildQueueJob[];
  onOperateQueueJob: (id: string, action: "retry" | "cancel" | "remove") => void;
  onProveGeneratedPrompt: () => void;
  report: ProofRunControllerReport;
}) {
  const retryJob = jobs.find((job) => ["failed", "canceled", "cancelled"].includes(job.status));
  const cancelJob = jobs.find((job) => ["queued", "scaffolded", "building", "capturing"].includes(job.status));
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="prove">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>Proof Run Controller</h2>
        </div>
        <ScoreRing score={report.score} label={report.currentStage} />
      </div>
      <div className="guided-stepper-grid">
        {report.stages.map((stage) => (
          <div className="guided-step" key={stage.id} data-status={stage.status === "done" ? "ready" : stage.status === "active" ? "active" : "blocked"}>
            <strong>{stage.label}</strong>
            <p>{stage.detail}</p>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" disabled={!report.actions.find((action) => action.id === "prove")?.enabled} onClick={onProveGeneratedPrompt}>Prove prompt</button>
        <button className="ghost-button compact-button" type="button" disabled={!retryJob} onClick={() => retryJob && onOperateQueueJob(retryJob.id, "retry")}>Retry failed job</button>
        <button className="ghost-button compact-button" type="button" disabled={!cancelJob} onClick={() => cancelJob && onOperateQueueJob(cancelJob.id, "cancel")}>Cancel active job</button>
      </div>
      <FeedbackList title="Controller actions" items={report.actions.map((action) => `${action.label}: ${action.detail}`)} empty="No proof actions." />
      <FeedbackList title="Proof notes" items={report.notes} empty="No proof notes." />
    </section>
  );
}

function CalibrationProductPanel({
  onRunCachedModelEvaluation,
  report,
}: {
  onRunCachedModelEvaluation: () => void;
  report: CalibrationProductReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="calibrate">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Calibration</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="benchmark-v2-grid">
        {report.rows.map((row) => (
          <div className="benchmark-row" key={row.label} data-status={row.delta <= 15 ? "aligned" : "missing"}>
            <strong>{row.label}</strong>
            <p>Local {row.localScore} / model {row.modelScore} / delta {row.delta}</p>
            <span>{row.verdict}</span>
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onRunCachedModelEvaluation}>Run cached model evaluation</button>
      <FeedbackList title={`Recommendation: ${report.recommendation}`} items={report.notes} empty="No calibration notes." />
    </section>
  );
}

function HostedReadinessProductPanel({
  onConnectHostedBrain,
  report,
}: {
  onConnectHostedBrain: () => void;
  report: HostedReadinessProductReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.verdict} data-train-section="hosted">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Hosted Readiness</h2>
        </div>
        <ScoreRing score={report.score} label={report.verdict} />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <div className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Ready" : "Fix"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
            {!check.ready ? <small>{check.fix}</small> : null}
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onConnectHostedBrain}>Connect hosted brain</button>
      <FeedbackList title="Hosted notes" items={report.notes} empty="No hosted notes." />
    </section>
  );
}

function QualityRegressionGatePanel({ report }: { report: QualityRegressionGateReport }) {
  return (
    <section className="panel lab-panel" data-readiness={report.status} data-train-section="quality">
      <div className="output-header">
        <div className="panel-header">
          <Check size={18} />
          <h2>Quality Regression Gate</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.rows.map((row) => (
          <div className="safe-check" key={row.label} data-ready={row.ready ? "true" : "false"}>
            <strong>{row.ready ? "Pass" : row.blocking ? "Blocker" : "Report"}</strong>
            <span>{row.label}</span>
            <p>{row.detail}</p>
          </div>
        ))}
      </div>
      <FeedbackList title="Gate notes" items={report.notes} empty="No quality gate notes." />
    </section>
  );
}

function GoldenBenchmarkHarnessPanel({ report }: { report: GoldenBenchmarkHarnessReport }) {
  return (
    <section className="panel lab-panel" data-readiness={report.readiness}>
      <div className="output-header">
        <div className="panel-header">
          <Trophy size={18} />
          <h2>Golden benchmark harness</h2>
        </div>
        <ScoreRing score={report.score} label={report.readiness} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={`${report.covered}/${report.total}`} label="Covered" />
        <Metric value={formatNumber(report.score)} label="Harness score" />
      </div>
      <div className="benchmark-v2-grid">
        {report.cases.slice(0, 8).map((row) => (
          <div className="benchmark-row" key={row.id} data-status={row.status}>
            <strong>{row.title}</strong>
            <p>{row.status === "covered" ? "Covered" : `Missing: ${row.missingSignals.slice(0, 4).join(", ")}`}</p>
          </div>
        ))}
      </div>
      <FeedbackList title="Harness notes" items={report.notes} empty="No benchmark notes." />
    </section>
  );
}

function PromptGeneratorV2Panel({
  copied,
  onApplyGeneratorVariant,
  onCopy,
  report,
}: {
  copied: string;
  onApplyGeneratorVariant: (variant: LearnedGeneratorVariant) => void;
  onCopy: (value: string, key: string) => void;
  report: PromptGeneratorV2Report;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.readiness}>
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Prompt Generator v2</h2>
        </div>
        <ScoreRing score={report.score} label={report.readiness} />
      </div>
      <div className="guided-stepper-grid">
        {report.sections.map((section) => (
          <div className="guided-step" key={section.label} data-status={section.ready ? "ready" : "active"}>
            <strong>{section.label}</strong>
            <p>{section.detail}</p>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={() => onApplyGeneratorVariant(report.variant)}>Use Generator v2 prompt</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.compiledPrompt, "generator-v2")}>
          {copied === "generator-v2" ? <Check size={15} /> : <Copy size={15} />}
          Copy prompt
        </button>
      </div>
      <div className="output-box mini-output">
        <pre>{report.compiledPrompt.slice(0, 1800)}</pre>
      </div>
      <FeedbackList title="Generator notes" items={report.notes} empty="No generator notes." />
    </section>
  );
}

function PromptCritiqueRepairPanel({
  copied,
  onCopy,
  report,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  report: PromptCritiqueRepairReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status}>
      <div className="output-header">
        <div className="panel-header">
          <Lightbulb size={18} />
          <h2>Prompt critique and repair loop</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.issues.slice(0, 6).map((issue) => (
          <div className="safe-check" key={issue.label} data-ready="false">
            <strong>Severity {issue.severity}</strong>
            <span>{issue.label}</span>
            <p>{issue.fix}</p>
          </div>
        ))}
        {!report.issues.length && <p className="selected-meta">No critique blockers detected.</p>}
      </div>
      <FeedbackList title="Repair sections" items={report.repairSections.map((section) => `${section.label}: ${section.patch}`)} empty="No repairs needed." />
      <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.repairedPrompt, "repair-prompt")}>
        {copied === "repair-prompt" ? <Check size={15} /> : <Copy size={15} />}
        Copy repaired prompt
      </button>
    </section>
  );
}

function ResultQualityDashboardPanel({ report }: { report: ResultQualityDashboardReport }) {
  return (
    <section className="panel lab-panel" data-readiness={report.status}>
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Result quality dashboard</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="guided-stepper-grid">
        {report.stages.map((stage) => (
          <div className="guided-step" key={stage.label} data-status={stage.ready ? "ready" : "active"}>
            <strong>{stage.label}</strong>
            <p>{stage.score}/100 - {stage.detail}</p>
          </div>
        ))}
      </div>
      <div className="metric-grid compact-metrics">
        {report.deltas.map((delta) => (
          <Metric key={delta.label} value={delta.value > 0 ? `+${delta.value}` : String(delta.value)} label={delta.label} />
        ))}
      </div>
      <FeedbackList title="Quality notes" items={report.notes} empty="No quality notes." />
    </section>
  );
}

function DatasetReviewQueueV2Panel({
  onSetPromptCurationDecision,
  report,
}: {
  onSetPromptCurationDecision: (promptId: string, decision: CurationDecision) => void;
  report: DatasetReviewQueueReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status}>
      <div className="output-header">
        <div className="panel-header">
          <Tags size={18} />
          <h2>Dataset review queue</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={formatNumber(report.counts.learn)} label="Learn" />
        <Metric value={formatNumber(report.counts.review)} label="Review" />
        <Metric value={formatNumber(report.counts.quarantine)} label="Reject" />
      </div>
      <div className="version-list compact-list">
        {report.rows.slice(0, 8).map((row) => (
          <article className="version-card" key={row.promptId}>
            <div>
              <strong>{row.title}</strong>
              <span>{row.decision} / priority {row.priority}</span>
            </div>
            <p>{row.reason}</p>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onSetPromptCurationDecision(row.promptId, "learn")}>Promote</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onSetPromptCurationDecision(row.promptId, "review")}>Review</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onSetPromptCurationDecision(row.promptId, "quarantine")}>Reject</button>
            </div>
          </article>
        ))}
      </div>
      <FeedbackList title="Dataset notes" items={report.notes} empty="No dataset notes." />
    </section>
  );
}

function HostedWorkerOperationsPanel({
  onOperateQueueJob,
  report,
}: {
  onOperateQueueJob: (id: string, action: "retry" | "cancel" | "remove") => void;
  report: HostedWorkerOpsReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status}>
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Hosted worker operations</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={formatNumber(report.retention.total)} label="Artifacts" />
        <Metric value={formatNumber(report.retention.stale)} label="Stale" />
        <Metric value={formatNumber(report.jobs.length)} label="Jobs" />
      </div>
      <div className="queue-list">
        {report.jobs.length ? report.jobs.map((job) => (
          <article className="queue-card" key={job.id}>
            <div>
              <strong>{job.title}</strong>
              <span>{job.status}</span>
            </div>
            <p>{job.lastLog}</p>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" disabled={!job.canRetry} onClick={() => onOperateQueueJob(job.id, "retry")}>Retry</button>
              <button className="ghost-button compact-button" type="button" disabled={!job.canCancel} onClick={() => onOperateQueueJob(job.id, "cancel")}>Cancel</button>
              <button className="icon-button danger" type="button" onClick={() => onOperateQueueJob(job.id, "remove")} aria-label={`Remove ${job.title}`}>
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        )) : <p className="selected-meta">No hosted worker jobs yet.</p>}
      </div>
      <FeedbackList title="Operations notes" items={report.notes} empty="No worker operations notes." />
    </section>
  );
}

function WorkerSandboxPanel({ report }: { report: WorkerSandboxReport }) {
  return (
    <section className="panel lab-panel" data-readiness={report.readiness}>
      <div className="output-header">
        <div className="panel-header">
          <Check size={18} />
          <h2>Worker sandbox and command guard</h2>
        </div>
        <ScoreRing score={report.score} label={report.readiness} />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <div className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Guarded" : "Needs guard"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </div>
        ))}
      </div>
      <FeedbackList title="Sandbox notes" items={report.notes} empty="No sandbox notes." />
    </section>
  );
}

function QueueObservabilityPanel({ report }: { report: QueueObservabilityReport }) {
  return (
    <section className="panel lab-panel" data-readiness={report.status}>
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>Queue observability timeline</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="guided-stepper-grid">
        {report.stages.map((stage) => (
          <div className="guided-step" key={stage.label} data-status={stage.ready ? "ready" : "active"}>
            <strong>{stage.label}</strong>
            <p>{stage.detail}</p>
          </div>
        ))}
      </div>
      <FeedbackList title="Timeline notes" items={report.notes} empty="No queue notes." />
    </section>
  );
}

function ProofArtifactStoragePanel({ report }: { report: ProofArtifactStorageReport }) {
  const artifactRows = report.artifacts.map((artifact) => `${artifact.title} - ${artifact.kind} - ${artifact.path || artifact.source}`);
  return (
    <section className="panel lab-panel" data-readiness={report.status}>
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Automatic proof import</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={formatNumber(report.artifacts.length)} label="Artifacts" />
        <Metric value={report.status} label="Storage" />
      </div>
      <p className="selected-meta"><strong>Screenshot artifact storage</strong> attaches build, screenshot, lineage, and proof rows after hosted proof runs.</p>
      <FeedbackList title="Stored artifacts" items={artifactRows} empty="No imported proof artifacts yet." />
      <FeedbackList title="Import notes" items={report.notes} empty="No import notes." />
    </section>
  );
}

function SimpleModeCleanupPanel({ report }: { report: SimpleModeReport }) {
  return (
    <section className="panel lab-panel" data-readiness={report.mode}>
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Simple beginner mode cleanup</h2>
        </div>
        <ScoreRing score={report.score} label={report.mode} />
      </div>
      <div className="guided-stepper-grid">
        {report.steps.map((step) => (
          <div className="guided-step" key={step.label} data-status={step.ready ? "ready" : "active"}>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </div>
        ))}
      </div>
      <FeedbackList title="Hidden expert panels" items={report.hiddenPanels} empty="Expert mode keeps all panels visible." />
      <FeedbackList title="Simple-mode notes" items={report.notes} empty="No simple-mode notes." />
    </section>
  );
}

function DatasetGovernancePanel({
  onLockGoldenDatasetV1,
  report,
}: {
  onLockGoldenDatasetV1: () => void;
  report: DatasetGovernanceReport;
}) {
  return (
    <section className="panel lab-panel" data-readiness={report.status}>
      <div className="output-header">
        <div className="panel-header">
          <PackageOpen size={18} />
          <h2>Dataset governance</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.rows.map((row) => (
          <div className="safe-check" key={row.label} data-ready={row.ready ? "true" : "false"}>
            <strong>{row.ready ? "Covered" : "Open"}</strong>
            <span>{row.label}</span>
            <p>{row.detail}</p>
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onLockGoldenDatasetV1}>Lock Golden Dataset v1</button>
      <FeedbackList title="Governance actions" items={report.actions} empty="No governance actions." />
      <FeedbackList title="Governance notes" items={report.notes} empty="No governance notes." />
    </section>
  );
}

function ProviderPluginLayerPanel({
  onApplyProviderPreset,
  report,
}: {
  onApplyProviderPreset: (kind: "local" | "anthropic" | "openai-compatible" | "codex-agent" | "scaffold-build") => void;
  report: ProviderPluginLayerReport;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <SlidersHorizontal size={18} />
          <h2>Provider plugin layer</h2>
        </div>
        <ScoreRing score={report.score} label={report.activeRoute} />
      </div>
      <div className="benchmark-v2-grid">
        {report.adapters.map((adapter) => (
          <div className="benchmark-row" key={adapter.id} data-status={adapter.ready ? "aligned" : "missing"}>
            <strong>{adapter.label}</strong>
            <p>{adapter.detail}</p>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("anthropic")}>Use server Claude</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("local")}>Use local fallback</button>
      </div>
      <FeedbackList title="Provider notes" items={report.notes} empty="No provider notes." />
    </section>
  );
}

function EvaluatorCalibrationWorkflowPanel({
  onRunCachedModelEvaluation,
  report,
}: {
  onRunCachedModelEvaluation: () => void;
  report: EvaluatorCalibrationWorkflowReport;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Evaluator calibration workflow</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="safe-check-grid">
        {report.rows.map((row) => (
          <div className="safe-check" key={row.label} data-ready={row.ready ? "true" : "false"}>
            <strong>{row.ready ? "Ready" : "Review"}</strong>
            <span>{row.label}</span>
            <p>{row.detail}</p>
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onRunCachedModelEvaluation}>Run cached model evaluation</button>
      <FeedbackList title="Calibration notes" items={report.notes} empty="No calibration notes." />
    </section>
  );
}

function ClosedLoopRunDetailPanel({ report }: { report: ClosedLoopRunDetailReport }) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>Closed-loop run detail page</h2>
        </div>
        <ScoreRing score={report.score} label="detail" />
      </div>
      {report.latest ? (
        <div className="metric-grid compact-metrics">
          <Metric value={report.latest.delta > 0 ? `+${report.latest.delta}` : String(report.latest.delta)} label="Score delta" />
          <Metric value={report.latest.status} label="Status" />
          <Metric value={report.latest.modelMode} label="Judge" />
        </div>
      ) : (
        <p className="selected-meta">Run a closed loop to populate the detail view.</p>
      )}
      <div className="guided-stepper-grid">
        {report.timeline.map((item) => (
          <div className="guided-step" key={item.label} data-status={item.ready ? "ready" : "active"}>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
      {report.latest ? <FeedbackList title="Recommendations" items={[...report.latest.findings, ...report.latest.recommendations].slice(0, 8)} empty="No recommendations." /> : null}
      <FeedbackList title="Run notes" items={report.notes} empty="No run notes." />
    </section>
  );
}

function ClaudeCalibrationSetPanel({ onRunCachedModelEvaluation, report }: { onRunCachedModelEvaluation: () => void; report: ClaudeCalibrationSetReport }) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Claude scoring calibration set</h2>
        </div>
        <ScoreRing score={report.score} label={report.readiness} />
      </div>
      <div className="benchmark-v2-grid">
        {report.rows.map((row) => (
          <div className="benchmark-row" key={row.id} data-status={row.status}>
            <strong>{row.title}</strong>
            <p>Expected {row.expected} / observed {row.observed} / delta {row.delta}</p>
            <span>{row.status}</span>
          </div>
        ))}
      </div>
      <button className="ghost-button compact-button" type="button" onClick={onRunCachedModelEvaluation}>Run cached calibration</button>
      <FeedbackList title="Calibration notes" items={report.notes} empty="No calibration notes." />
    </section>
  );
}

function BulkImportPipelinePanel({ onSelect, report }: { onSelect: (id: string) => void; report: BulkImportPipelineReport }) {
  return (
    <section className="panel lab-panel import-pipeline-panel" data-mode={report.readiness}>
      <div className="output-header">
        <div className="panel-header">
          <Upload size={18} />
          <h2>Prompt ingestion pipeline</h2>
        </div>
        <ScoreRing score={report.score} label={report.readiness} />
      </div>
      <div className="guided-stepper-grid">
        {report.stages.map((stage) => (
          <div className="guided-step" key={stage.label} data-status={stage.status}>
            <strong>{stage.label}</strong>
            <p>{stage.detail}</p>
          </div>
        ))}
      </div>
      <div className="label-candidate-list">
        {report.previewRows.map((row) => (
          <button className="label-candidate" type="button" key={`${row.title}-${row.decision}`} onClick={() => onSelect("workspace")}>
            <strong>{row.title}</strong>
            <span>{row.decision} / {row.score}</span>
            <p>{row.reason}</p>
          </button>
        ))}
      </div>
      <FeedbackList title="Pipeline notes" items={report.notes} empty="No pipeline notes." />
    </section>
  );
}

function BeginnerPromptMakerPanel({
  generatorInput,
  onApplyGeneratorVariant,
  report,
  setGeneratorInput,
}: {
  generatorInput: LearnedGeneratorInput;
  onApplyGeneratorVariant: (variant: LearnedGeneratorVariant) => void;
  report: BeginnerPromptMakerReport;
  setGeneratorInput: Dispatch<SetStateAction<LearnedGeneratorInput>>;
}) {
  const variant: LearnedGeneratorVariant = {
    id: "beginner-one-click",
    title: `${generatorInput.brandName || "Project"} one-click prompt`,
    bestFor: "Beginner guided prompt",
    prompt: report.suggestedPrompt,
    score: report.score,
    signals: report.notes,
  };
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>One-click make me a great prompt</h2>
        </div>
        <ScoreRing score={report.score} label={report.readiness} />
      </div>
      <div className="field-grid two">
        <Field label="Brand">
          <input value={generatorInput.brandName} onChange={(event) => setGeneratorInput((current) => ({ ...current, brandName: event.target.value }))} />
        </Field>
        <Field label="Goal">
          <input value={generatorInput.goal} onChange={(event) => setGeneratorInput((current) => ({ ...current, goal: event.target.value }))} />
        </Field>
      </div>
      <div className="safe-check-grid">
        {report.brief.map((item) => (
          <div className="safe-check" key={item.label} data-ready={item.ready ? "true" : "false"}>
            <strong>{item.ready ? "Ready" : "Missing"}</strong>
            <span>{item.label}</span>
            <p>{item.value || "Add this to improve the generated prompt."}</p>
          </div>
        ))}
      </div>
      <pre className="compact-pre">{report.suggestedPrompt}</pre>
      <button className="primary-button compact-button" type="button" onClick={() => onApplyGeneratorVariant(variant)}>Use this prompt</button>
      <FeedbackList title="Beginner notes" items={report.notes} empty="No beginner notes." />
    </section>
  );
}

function GoldenDatasetV1ProductPanel({ onLockGoldenDatasetV1, report }: { onLockGoldenDatasetV1: () => void; report: GoldenDatasetV1LockReport }) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <Trophy size={18} />
          <h2>Golden Dataset v1 lock</h2>
        </div>
        <ScoreRing score={report.score} label={report.locked ? "locked" : "draft"} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={String(report.counts.gold)} label="Gold" />
        <Metric value={String(report.counts.train)} label="Train" />
        <Metric value={String(report.counts.test)} label="Test" />
        <Metric value={report.locked ? "Locked" : "Draft"} label="State" />
      </div>
      <div className="safe-check-grid">
        {report.checklist.map((item) => (
          <div className="safe-check" key={item.label} data-ready={item.ready ? "true" : "false"}>
            <strong>{item.ready ? "Ready" : "Needs work"}</strong>
            <span>{item.label}</span>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onLockGoldenDatasetV1}>Lock Golden Dataset v1</button>
      <FeedbackList title="Dataset notes" items={report.notes} empty="No dataset notes." />
    </section>
  );
}

function FailureMemoryAutopilotPanel({
  copied,
  onApplyResultLearningPatch,
  onCopy,
  report,
}: {
  copied: string;
  onApplyResultLearningPatch: () => void;
  onCopy: (value: string, key: string) => void;
  report: FailureMemoryAutopilotReport;
}) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <AlertTriangle size={18} />
          <h2>Failure memory autopilot</h2>
        </div>
        <ScoreRing score={report.score} label={report.readiness} />
      </div>
      <div className="benchmark-v2-grid">
        {report.topFailures.map((failure) => (
          <div className="benchmark-row" key={failure.label}>
            <strong>{failure.label}</strong>
            <p>{failure.fix}</p>
            <span>{failure.severity}</span>
          </div>
        ))}
      </div>
      <pre className="compact-pre">{report.patch}</pre>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onApplyResultLearningPatch}>Apply failure patch</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(report.patch, "failure-autopilot")}>
          {copied === "failure-autopilot" ? <Check size={15} /> : <Copy size={15} />} Copy
        </button>
      </div>
      <FeedbackList title="Autopilot notes" items={report.notes} empty="No autopilot notes." />
    </section>
  );
}

function BeforeAfterVisualProofPanel({ report }: { report: VisualProofComparisonReport }) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Visual proof before/after comparison</h2>
        </div>
        <ScoreRing score={report.score} label={report.status} />
      </div>
      <div className="comparison-grid">
        <div>
          <strong>Before</strong>
          <p>{report.before ? `${report.before.title} / ${report.before.score}` : "Capture an earlier screenshot."}</p>
          {report.before?.url ? <code>{report.before.url}</code> : null}
        </div>
        <div>
          <strong>After</strong>
          <p>{report.after ? `${report.after.title} / ${report.after.score}` : "Capture a rewritten screenshot."}</p>
          {report.after?.url ? <code>{report.after.url}</code> : null}
        </div>
      </div>
      <FeedbackList title="Visual comparison notes" items={report.notes} empty="No visual comparison notes." />
    </section>
  );
}

function ModelProviderRouterPanel({ onApplyProviderPreset, report }: { onApplyProviderPreset: (kind: "local" | "anthropic" | "openai-compatible" | "codex-agent" | "scaffold-build") => void; report: ModelProviderRouterReport }) {
  return (
    <section className="panel lab-panel">
      <div className="output-header">
        <div className="panel-header">
          <SlidersHorizontal size={18} />
          <h2>Model/provider abstraction router</h2>
        </div>
        <ScoreRing score={report.score} label={report.route} />
      </div>
      <div className="metric-grid compact-metrics">
        <Metric value={report.provider} label="Provider" />
        <Metric value={report.route} label="Route" />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <div className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Ready" : "Needs work"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("anthropic")}>Claude server</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("openai-compatible")}>OpenAI-compatible</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyProviderPreset("local")}>Local fallback</button>
      </div>
      <FeedbackList title="Router notes" items={report.notes} empty="No router notes." />
    </section>
  );
}

function ApiAdminHardeningPanel({
  onCheckApi,
  onCreateBackupSnapshot,
  onSyncToApi,
  report,
}: {
  onCheckApi: () => void;
  onCreateBackupSnapshot: (label?: string) => void;
  onSyncToApi: () => void;
  report: ApiAdminHardeningReport;
}) {
  return (
    <section className="panel lab-panel api-admin-hardening-panel" data-readiness={report.readiness} data-train-section="api">
      <div className="output-header">
        <div className="panel-header">
          <PackageOpen size={18} />
          <h2>Hosted API admin hardening</h2>
        </div>
        <ScoreRing score={report.score} label={report.readiness} />
      </div>
      <div className="safe-check-grid">
        {report.checks.map((check) => (
          <div className="safe-check" key={check.label} data-ready={check.ready ? "true" : "false"}>
            <strong>{check.ready ? "Ready" : "Needs work"}</strong>
            <span>{check.label}</span>
            <p>{check.detail}</p>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="ghost-button compact-button" type="button" onClick={onCheckApi}>Check API</button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCreateBackupSnapshot("Admin hardening restore point")}>Create restore point</button>
        <button className="primary-button compact-button" type="button" onClick={onSyncToApi}>Push API</button>
      </div>
      <FeedbackList title="Admin actions" items={report.actions} empty="No admin actions." />
      <FeedbackList title="Admin notes" items={report.notes} empty="No admin notes." />
    </section>
  );
}

function OperatorModePanel({
  mode,
  onChooseMode,
  onSelect,
  report,
}: {
  mode: OnboardingMode;
  onChooseMode: (mode: OnboardingMode) => void;
  onSelect: (id: string) => void;
  report: OperatorModeReport;
}) {
  return (
    <section className="panel lab-panel operator-mode-panel" data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <SlidersHorizontal size={18} />
          <h2>Beginner / expert operator mode</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" data-active={mode !== "trained"} type="button" onClick={() => onChooseMode("upload")}>Beginner</button>
          <button className="ghost-button compact-button" data-active={mode === "trained"} type="button" onClick={() => onChooseMode("trained")}>Expert</button>
        </div>
      </div>
      <div className="operator-mode-grid">
        <article className="index-card">
          <strong>{report.mode}</strong>
          <span>{report.primaryCta}</span>
          <p>{report.notes[0]}</p>
        </article>
        {report.cards.map((card) => (
          <button className="version-card prompt-audit-card" key={card.title} type="button" onClick={() => onSelect(card.target)}>
            <strong>{card.title}</strong>
            <span>{card.target}</span>
            <p>{card.detail}</p>
          </button>
        ))}
      </div>
      <div className="pill-row">
        {report.visiblePanels.map((panel) => <span key={panel}>{panel}</span>)}
      </div>
    </section>
  );
}

function TrueClosedLoopRunwayPanel({
  onRunServerClosedLoopJudge,
  onRunTrueClosedLoop,
  report,
}: {
  onRunServerClosedLoopJudge: () => void;
  onRunTrueClosedLoop: () => void;
  report: TrueClosedLoopReport;
}) {
  return (
    <section className="panel lab-panel true-closed-loop-panel" data-readiness={report.readiness} data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>True closed-loop runner</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={onRunServerClosedLoopJudge}>Server judge</button>
          <button className="primary-button compact-button" type="button" onClick={onRunTrueClosedLoop}>Run full loop</button>
        </div>
      </div>
      <div className="closed-loop-stage-grid">
        {report.stages.map((stage, index) => (
          <article className="guided-stepper-card" data-state={stage.status} key={stage.id}>
            <span>{index + 1}</span>
            <strong>{stage.label}</strong>
            <em>{stage.status}</em>
            <p>{stage.detail}</p>
            <small>{stage.action}</small>
          </article>
        ))}
      </div>
      <div className="two-field-grid">
        <FeedbackList title="Run plan" items={report.runPlan} empty="No run plan." />
        <FeedbackList title="Expected artifacts" items={report.expectedArtifacts} empty="No artifacts." />
      </div>
    </section>
  );
}

function ImportWizardPanel({ onSelect, report }: { onSelect: (id: string) => void; report: ImportWizardReport }) {
  return (
    <section className="panel lab-panel import-wizard-panel" data-mode={report.mode} data-train-section="workspace">
      <div className="output-header">
        <div className="panel-header">
          <Upload size={18} />
          <h2>Large prompt import wizard</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={() => onSelect("workspace")}>Open corpus</button>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={report.score} label={report.mode} />
        <div className="env-status-grid">
          <span data-ready={report.counts.importable > 0}>{report.counts.importable} importable</span>
          <span data-ready={report.counts.gold > 0}>{report.counts.gold} gold</span>
          <span data-ready={report.counts.review === 0}>{report.counts.review} review</span>
          <span data-ready={report.counts.quarantine === 0}>{report.counts.quarantine} quarantine</span>
        </div>
      </div>
      <div className="guided-steps">
        {report.steps.map((step, index) => (
          <article className="guided-step" data-state={step.status} key={step.label}>
            <span>{index + 1}</span>
            <p>{step.label}</p>
            <small>{step.detail}</small>
          </article>
        ))}
      </div>
      <FeedbackList title="Import recommendations" items={report.recommendations} empty="Paste a batch to preview import guidance." />
    </section>
  );
}

function PromptSectionRegenerationPanel({
  onApplySectionRegeneration,
  report,
}: {
  onApplySectionRegeneration: (sectionId: string) => void;
  report: PromptSectionRegenerationReport;
}) {
  return (
    <section className="panel lab-panel section-regeneration-panel" data-train-section="improve">
      <div className="panel-header">
        <Hammer size={18} />
        <h2>Prompt section regeneration</h2>
      </div>
      <p className="selected-meta">{report.notes[1]}</p>
      <div className="editor-guidance-grid">
        {report.sections.map((section) => (
          <article className="gate-check-card" data-pass={section.status === "ready"} key={section.id}>
            <div className="dna-v2-topline">
              <strong>{section.label}</strong>
              <span data-tone={section.status === "ready" ? "strong" : "mixed"}>{section.status}</span>
            </div>
            <p>{section.recipeHint}</p>
            <button className="ghost-button compact-button" type="button" onClick={() => onApplySectionRegeneration(section.id)}>
              Regenerate
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function SpeedLabelingPanel({ onApplySpeedLabel, report }: { onApplySpeedLabel: (candidateId: string) => void; report: SpeedLabelingReport }) {
  return (
    <section className="panel lab-panel speed-labeling-panel" data-train-section="patterns">
      <div className="panel-header">
        <Trophy size={18} />
        <h2>Golden/bad speed labeling</h2>
      </div>
      <div className="version-list compact-list">
        {report.candidates.slice(0, 8).map((candidate) => (
          <article className="version-card" key={candidate.id}>
            <div className="dna-v2-topline">
              <strong>{candidate.title}</strong>
              <span>{candidate.confidence}</span>
            </div>
            <p>{candidate.reason}</p>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onApplySpeedLabel(candidate.id)}>
                Apply {candidate.suggestedStatus}
              </button>
            </div>
          </article>
        ))}
        {!report.candidates.length ? <p className="selected-meta">Everything visible has a label. Paste more prompts or clear old labels to continue.</p> : null}
      </div>
      <FeedbackList title="Labeling notes" items={report.notes} empty="No speed-label notes." />
    </section>
  );
}

function TrainingRunReplayPanel({
  closedLoopRuns,
  modelEvaluationCacheReport,
  proofLearningRuns,
  trainingRunSummary,
}: {
  closedLoopRuns: ClosedLoopRun[];
  modelEvaluationCacheReport: ModelEvaluationCacheReport;
  proofLearningRuns: ProofLearningRun[];
  trainingRunSummary: ReturnType<typeof buildTrainingRunSummary>;
}) {
  const rows = [
    trainingRunSummary.latest ? { title: trainingRunSummary.latest.id, detail: `${trainingRunSummary.latest.stage} / ${trainingRunSummary.latest.scores.final}`, kind: "training" } : undefined,
    closedLoopRuns[0] ? { title: closedLoopRuns[0].winnerTitle, detail: `${closedLoopRuns[0].originalScore} -> ${closedLoopRuns[0].improvedScore}`, kind: "closed-loop" } : undefined,
    proofLearningRuns[0] ? { title: proofLearningRuns[0].title, detail: `${proofLearningRuns[0].phase} / ${proofLearningRuns[0].learnedStatus}`, kind: "proof" } : undefined,
    modelEvaluationCacheReport.items[0] ? { title: modelEvaluationCacheReport.items[0].provider, detail: `${modelEvaluationCacheReport.items[0].score} model / ${modelEvaluationCacheReport.items[0].localScore} local`, kind: "model" } : undefined,
  ].filter(Boolean) as { title: string; detail: string; kind: string }[];
  return (
    <section className="panel lab-panel run-replay-panel" data-train-section="lineage">
      <div className="panel-header">
        <Clipboard size={18} />
        <h2>Training run replay debugger</h2>
      </div>
      <div className="version-list compact-list">
        {rows.map((row) => (
          <article className="version-card" key={`${row.kind}-${row.title}`}>
            <strong>{row.title}</strong>
            <span>{row.kind}</span>
            <p>{row.detail}</p>
          </article>
        ))}
        {!rows.length ? <p className="selected-meta">No run evidence yet. Run the closed-loop runner or guided train to create replay rows.</p> : null}
      </div>
    </section>
  );
}

function BenchmarkBattlePanel({ onRunBenchmarkBattles, report }: { onRunBenchmarkBattles: () => void; report: BenchmarkBattleReport }) {
  return (
    <section className="panel lab-panel benchmark-battle-panel" data-train-section="patterns">
      <div className="output-header">
        <div className="panel-header">
          <Shuffle size={18} />
          <h2>Prompt benchmark battles</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunBenchmarkBattles}>Record battles</button>
      </div>
      <div className="benchmark-library-grid">
        {report.rows.slice(0, 6).map((row) => (
          <article className="version-card" key={row.fixtureId}>
            <div className="dna-v2-topline">
              <strong>{row.title}</strong>
              <span>{row.winnerScore}</span>
            </div>
            <p>{row.winnerTitle}: {row.nextAction}</p>
            <small>{row.variants.map((variant) => `${variant.title} ${variant.score}`).join(" / ")}</small>
          </article>
        ))}
      </div>
      <FeedbackList title="Battle notes" items={report.notes} empty="No benchmark battle notes." />
    </section>
  );
}

function CalibrationDashboardPanel({ report }: { report: CalibrationDashboardReport }) {
  return (
    <section className="panel lab-panel calibration-dashboard-panel" data-train-section="patterns">
      <div className="panel-header">
        <Gauge size={18} />
        <h2>Quality score calibration dashboard</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={report.score} label={report.alignment} />
        <FeedbackList title="Calibration notes" items={report.notes} empty="No calibration notes." />
      </div>
      <div className="version-list compact-list">
        {report.rows.map((row) => (
          <article className="version-card" key={row.label}>
            <strong>{row.label}</strong>
            <span>score {row.score} / delta {row.delta}</span>
            <p>{row.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HostedHardeningPanel({
  onCreateBackupSnapshot,
  onRunHostedSetupWizard,
  onSyncToApi,
  report,
}: {
  onCreateBackupSnapshot: (label?: string) => void;
  onRunHostedSetupWizard: () => void;
  onSyncToApi: () => void;
  report: HostedHardeningReport;
}) {
  return (
    <section className="panel lab-panel hosted-hardening-panel" data-readiness={report.readiness} data-train-section="api">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Hosted backend hardening</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCreateBackupSnapshot("pre-hosted-hardening")}>Backup</button>
          <button className="ghost-button compact-button" type="button" onClick={onSyncToApi}>Sync</button>
          <button className="primary-button compact-button" type="button" onClick={onRunHostedSetupWizard}>Check gate</button>
        </div>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={report.score} label={report.readiness} />
        <FeedbackList title="Backup plan" items={report.backupPlan} empty="No backup plan." />
      </div>
      <div className="safe-check-grid">
        {report.checklist.map((item) => (
          <article className="gate-check-card" data-pass={item.ready} key={item.label}>
            <strong>{item.label}</strong>
            <p>{item.ready ? "Ready" : item.fix}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BestNextActionPanel({ action, onSelect }: { action: BestNextActionReport; onSelect: (id: string) => void }) {
  const targetMap: Record<string, string> = {
    Provenance: "workspace",
    "Hosted setup": "api",
    "Proof loop": "queue",
    "Model intelligence": "api",
    "Benchmark library": "patterns",
    "Prompt strength": "workflow",
    "Evaluation artifacts": "packs",
    "Guided workflow": "workflow",
  };
  return (
    <section className="panel lab-panel best-next-action-panel" data-priority={action.priority} data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <Lightbulb size={18} />
          <h2>Best next action</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={() => onSelect(targetMap[action.target] ?? "workflow")}>
          Jump there
        </button>
      </div>
      <div className="next-action-layout">
        <div>
          <span className="workspace-pill">{action.priority} priority</span>
          <h3>{action.title}</h3>
          <p>{action.detail}</p>
        </div>
        <FeedbackList title={action.target} items={action.checklist} empty="No blocking checklist. Create the next artifact or run guided train." />
      </div>
    </section>
  );
}

function GuidedTrainingStepperPanel({ report }: { report: GuidedTrainingStepperReport }) {
  return (
    <section className="panel lab-panel guided-stepper-panel" data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>One-click training run wizard</h2>
        </div>
        <span className="workspace-pill">Focus: {report.currentStep}</span>
      </div>
      <div className="guided-stepper-grid">
        {report.steps.map((step, index) => (
          <article className="guided-stepper-card" data-state={step.status} key={step.id}>
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
            <em>{step.score}</em>
            <p>{step.detail}</p>
            <small>{step.fix}</small>
          </article>
        ))}
      </div>
      <FeedbackList title="Stepper notes" items={report.notes} empty="No guided stepper notes yet." />
    </section>
  );
}

function CorpusProvenanceFirewallPanel({ report }: { report: CorpusProvenanceFirewallReport }) {
  return (
    <section className="panel lab-panel provenance-firewall-panel" data-train-section="workspace">
      <div className="output-header">
        <div className="panel-header">
          <AlertTriangle size={18} />
          <h2>Corpus provenance firewall</h2>
        </div>
        <span className="workspace-pill">{report.score} safe</span>
      </div>
      <div className="compact-scoreboard">
        <Metric value={String(report.allowedCount)} label="Allowed" />
        <Metric value={String(report.reviewCount)} label="Review" />
        <Metric value={String(report.quarantinedCount)} label="Quarantine" />
      </div>
      <div className="provenance-list">
        {report.rows.slice(0, 6).map((row) => (
          <article className="provenance-row" data-decision={row.decision} key={row.id}>
            <div>
              <strong>{row.title}</strong>
              <span>{row.source} / {row.decision}</span>
            </div>
            <p>{row.reason}</p>
            <small>{row.originHint}</small>
          </article>
        ))}
      </div>
      <FeedbackList title="Firewall actions" items={report.actions} empty="No firewall actions." />
    </section>
  );
}

function BuildResultLearningPanel({ report }: { report: BuildResultLearningReport }) {
  return (
    <section className="panel lab-panel build-result-learning-panel" data-train-section="queue">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Real build-result learning loop</h2>
        </div>
        <span className="workspace-pill">{report.status}</span>
      </div>
      <div className="proof-signal-grid">
        {report.rows.map((row) => (
          <article className="candidate-card" data-state={row.state} key={row.label}>
            <span data-tone={scoreTone(row.value)}>{row.value}</span>
            <strong>{row.label}</strong>
            <p>{row.detail}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Next proof actions" items={report.nextActions} empty="Build evidence is ready to learn from." />
    </section>
  );
}

function PromptQualityDnaPanel({ report }: { report: PromptQualityDnaReport }) {
  return (
    <section className="panel lab-panel prompt-quality-dna-panel" data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Explainable Prompt Strength Profile</h2>
        </div>
        <span className="workspace-pill">{report.label}</span>
      </div>
      <div className="compact-scoreboard">
        <Metric value={String(report.score)} label="Quality score" />
        <Metric value={String(report.dimensions.filter((dimension) => dimension.score >= 75).length)} label="Strong" />
        <Metric value={String(report.dimensions.filter((dimension) => dimension.score < 65).length)} label="Patch" />
      </div>
      <div className="dna-dimension-grid">
        {report.dimensions.slice(0, 8).map((dimension) => (
          <article className="candidate-card" key={dimension.key}>
            <span data-tone={scoreTone(dimension.score)}>{dimension.score}</span>
            <strong>{dimension.label}</strong>
            <p>{dimension.plainEnglish}</p>
            <small>{dimension.fix}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ModelJudgeComparisonPanel({
  onRunCachedModelEvaluation,
  report,
}: {
  onRunCachedModelEvaluation: () => void;
  report: ModelJudgeComparisonReport;
}) {
  return (
    <section className="panel lab-panel model-judge-comparison-panel" data-train-section="api">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Claude/local/result comparison</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={onRunCachedModelEvaluation}>
          Cache eval
        </button>
      </div>
      <div className="proof-signal-grid">
        {report.rows.map((row) => (
          <article className="candidate-card" key={row.label}>
            <span data-tone={scoreTone(row.score)}>{row.score}</span>
            <strong>{row.label}</strong>
            <p>{row.detail}</p>
          </article>
        ))}
      </div>
      <FeedbackList title={`Alignment: ${report.alignment}`} items={report.notes} empty="Run cached evaluation to compare judges." />
    </section>
  );
}

function PromptRecipeDistillerPanel({ report }: { report: PromptRecipeDistillerReport }) {
  return (
    <section className="panel lab-panel recipe-distiller-panel" data-train-section="patterns">
      <div className="output-header">
        <div className="panel-header">
          <BookOpen size={18} />
          <h2>Prompt recipe distiller</h2>
        </div>
        <span className="workspace-pill">{report.score}</span>
      </div>
      <div className="recipe-distiller-grid">
        {report.recipes.slice(0, 4).map((recipe) => (
          <article className="index-card" key={recipe.title}>
            <strong>{recipe.title}</strong>
            <span>{recipe.score}</span>
            <p>{recipe.ingredients.slice(0, 3).join(" / ")}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Recipe notes" items={report.notes} empty="No recipes distilled yet." />
    </section>
  );
}

function PromptEditorGuidancePanel({ report }: { report: PromptEditorGuidanceReport }) {
  return (
    <section className="panel lab-panel prompt-editor-guidance-panel" data-train-section="generate">
      <div className="output-header">
        <div className="panel-header">
          <SlidersHorizontal size={18} />
          <h2>Generated prompt section editor</h2>
        </div>
        <span className="workspace-pill">{report.score}</span>
      </div>
      <div className="editor-guidance-grid">
        {report.sections.map((section) => (
          <article className="index-card" data-tone={section.status === "ready" ? "good" : "watch"} key={section.id}>
            <strong>{section.label}</strong>
            <span>{section.status}</span>
            <p>{section.detail}</p>
            <small>{section.rewriteHint}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function BenchmarkLibraryCoveragePanel({ report }: { report: BenchmarkLibraryReport }) {
  return (
    <section className="panel lab-panel benchmark-library-panel" data-train-section="patterns">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Benchmark library coverage</h2>
        </div>
        <span className="workspace-pill">{report.covered}/{report.total}</span>
      </div>
      <div className="benchmark-library-grid">
        {report.rows.map((row) => (
          <article className="index-card" data-tone={row.status === "covered" ? "good" : "watch"} key={row.id}>
            <strong>{row.title}</strong>
            <span>{row.status}</span>
            <p>{row.status === "covered" ? "Covered by the current corpus." : row.fix}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Coverage notes" items={report.notes} empty="No benchmark coverage notes." />
    </section>
  );
}

function GuidedTrainingWorkflowPanel({
  benchmarkV2,
  corpusIntelligence,
  modelCache,
  onRunGuidedTraining,
  safeToTrain,
  trainingRunSummary,
}: {
  benchmarkV2: BenchmarkV2Report;
  corpusIntelligence: CorpusIntelligenceReport;
  modelCache: ModelEvaluationCacheReport;
  onRunGuidedTraining: () => void;
  safeToTrain: SafeToTrainReport;
  trainingRunSummary: ReturnType<typeof buildTrainingRunSummary>;
}) {
  const stages = [
    { label: "Curate", score: corpusIntelligence.score, detail: `${corpusIntelligence.clusters.length} cluster(s), ${corpusIntelligence.gaps.length} gap(s).` },
    { label: "Evaluate", score: Math.max(0, 100 - modelCache.averageDelta), detail: `${modelCache.items.length} cached model row(s).` },
    { label: "Benchmark", score: benchmarkV2.score, detail: benchmarkV2.summary[0] },
    { label: "Generate", score: trainingRunSummary.score || corpusIntelligence.score, detail: trainingRunSummary.latest?.notes[0] ?? "Ready to generate candidates from memory." },
    { label: "Prove", score: safeToTrain.score, detail: safeToTrain.safe ? "Environment is safe to train." : `${safeToTrain.blocking.length} setup blocker(s).` },
    { label: "Export", score: trainingRunSummary.latest ? 100 : 30, detail: trainingRunSummary.latest ? "Latest run has artifacts." : "Run the guided workflow to create artifacts." },
  ];
  return (
    <section className="panel lab-panel guided-training-workflow-panel" data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <ListChecks size={18} />
          <h2>Guided training workflow</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunGuidedTraining}>
          <BarChart3 size={15} />
          Run guided train
        </button>
      </div>
      <div className="guided-workflow-grid">
        {stages.map((stage, index) => (
          <article className="guided-stage-card" key={stage.label} data-tone={scoreTone(stage.score)}>
            <span>{index + 1}</span>
            <strong>{stage.label}</strong>
            <em>{stage.score}</em>
            <p>{stage.detail}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Latest run notes" items={trainingRunSummary.notes} empty="No guided training run yet." />
    </section>
  );
}

function TrainingRunHistoryPanel({
  runs,
  summary,
}: {
  runs: TrainingRunRecord[];
  summary: ReturnType<typeof buildTrainingRunSummary>;
}) {
  return (
    <section className="panel lab-panel training-run-history-panel" data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Training run history</h2>
        </div>
        <span className="workspace-pill">{summary.status}</span>
      </div>
      <div className="compact-scoreboard">
        <Metric value={String(summary.score)} label="Latest score" />
        <Metric value={String(runs.length)} label="Visible runs" />
        <Metric value={String(summary.latest?.benchmarkDelta ?? 0)} label="Bench delta" />
      </div>
      <div className="version-list compact-list">
        {runs.length ? (
          runs.map((run) => (
            <article className="version-card" key={run.id}>
              <div>
                <strong>{run.source}</strong>
                <span>{new Date(run.createdAt).toLocaleString()}</span>
              </div>
              <p>{run.notes[0] ?? `${run.inputCounts.prompts} prompt(s), ${run.inputCounts.outcomes} outcome(s).`}</p>
              <small>{run.stage} / final {run.scores.final}</small>
            </article>
          ))
        ) : (
          <p className="selected-meta">No training runs yet. Run guided train to create the first durable row.</p>
        )}
      </div>
    </section>
  );
}

function ModelIntelligencePanel({
  cacheReport,
  modelBatchEvaluations,
  onRunCachedModelEvaluation,
}: {
  cacheReport: ModelEvaluationCacheReport;
  modelBatchEvaluations: ModelBatchEvaluation[];
  onRunCachedModelEvaluation: () => void;
}) {
  const latest = cacheReport.items[0];
  return (
    <section className="panel lab-panel model-intelligence-panel" data-train-section="api">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Model intelligence</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={onRunCachedModelEvaluation}>
          <BarChart3 size={14} />
          Cache eval
        </button>
      </div>
      <div className="compact-scoreboard">
        <Metric value={`${cacheReport.cacheHitRate}%`} label="Cache posture" />
        <Metric value={String(cacheReport.averageDelta)} label="Avg delta" />
        <Metric value={String(modelBatchEvaluations.length)} label="Batch rows" />
      </div>
      <FeedbackList title="Agreement notes" items={cacheReport.notes} empty="No model notes yet." />
      {latest ? (
        <p className="selected-meta">
          Latest cached row: {latest.provider} / {latest.readiness} / <span data-tone={latest.agreement === "agrees" ? "strong" : latest.agreement === "divergent" ? "weak" : "mixed"}>{latest.agreement}</span>.
        </p>
      ) : (
        <p className="selected-meta">Cache the selected prompt to compare local strength and model judgment without re-spending calls.</p>
      )}
    </section>
  );
}

function PromptCandidateLoopPanel({
  onRunCandidateQualityLoop,
  report,
  runs,
}: {
  onRunCandidateQualityLoop: () => void;
  report: PromptCandidateTournamentReport;
  runs: PromptCandidateRun[];
}) {
  return (
    <section className="panel lab-panel prompt-candidate-loop-panel" data-train-section="generate">
      <div className="output-header">
        <div className="panel-header">
          <Trophy size={18} />
          <h2>Prompt candidate quality loop</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunCandidateQualityLoop}>
          <Shuffle size={14} />
          Pick winner
        </button>
      </div>
      <div className="compact-scoreboard">
        <Metric value={String(report.winner.score)} label="Winner score" />
        <Metric value={String(report.variants.length)} label="Variants" />
        <Metric value={String(runs.length)} label="Saved loops" />
      </div>
      <div className="candidate-grid">
        {[report.winner, ...report.mutations].slice(0, 4).map((variant) => (
          <article className="candidate-card" key={variant.id}>
            <span data-tone={scoreTone(variant.score)}>{variant.score}</span>
            <strong>{variant.title}</strong>
            <p>{variant.intent}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Why this wins" items={report.explanation} empty="No candidate explanation yet." />
    </section>
  );
}

function CorpusIntelligencePanel({
  onRunCorpusIntelligence,
  report,
  runs,
}: {
  onRunCorpusIntelligence: () => void;
  report: CorpusIntelligenceReport;
  runs: CorpusClusterRun[];
}) {
  return (
    <section className="panel lab-panel corpus-intelligence-product-panel" data-train-section="patterns">
      <div className="output-header">
        <div className="panel-header">
          <BookOpen size={18} />
          <h2>Corpus intelligence</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={onRunCorpusIntelligence}>
          <Search size={14} />
          Analyze
        </button>
      </div>
      <div className="compact-scoreboard">
        <Metric value={String(report.score)} label="Corpus score" />
        <Metric value={String(report.clusters.length)} label="Clusters" />
        <Metric value={String(report.gaps.length)} label="Gaps" />
        <Metric value={String(runs.length)} label="Runs" />
      </div>
      <div className="corpus-intelligence-grid">
        {report.clusters.slice(0, 4).map((cluster) => (
          <article className="index-card" key={cluster.label}>
            <strong>{cluster.label}</strong>
            <span>{cluster.count} prompt(s)</span>
            <p>{cluster.examples.slice(0, 2).join(" / ") || "No examples listed."}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Suggested next corpus moves" items={report.suggestions.slice(0, 5)} empty="No corpus gaps detected." />
    </section>
  );
}

function BenchmarkV2Panel({
  onRunBenchmarkV2,
  report,
  runs,
}: {
  onRunBenchmarkV2: () => void;
  report: BenchmarkV2Report;
  runs: BenchmarkV2Run[];
}) {
  return (
    <section className="panel lab-panel benchmark-v2-panel" data-train-section="patterns">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Benchmark v2</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunBenchmarkV2}>
          <Gauge size={14} />
          Run v2
        </button>
      </div>
      <div className="compact-scoreboard">
        <Metric value={String(report.score)} label="Average" />
        <Metric value={String(report.rows.length)} label="Fixtures" />
        <Metric value={String(runs.length)} label="Saved" />
      </div>
      <div className="benchmark-v2-grid">
        {report.rows.slice(0, 4).map((row) => (
          <article className="candidate-card" key={row.fixtureId}>
            <span data-tone={scoreTone(row.modelScore)}>{row.modelScore}</span>
            <strong>{row.title}</strong>
            <p>{row.missingTraits.length ? `Missing ${row.missingTraits.join(", ")}` : row.regressionExplanation}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Benchmark v2 summary" items={report.summary} empty="Run benchmark v2 to create a trend." />
    </section>
  );
}

function SafeToTrainSetupPanel({
  checks,
  onRunHostedSetupWizard,
  report,
}: {
  checks: HostedSetupCheck[];
  onRunHostedSetupWizard: () => void;
  report: SafeToTrainReport;
}) {
  return (
    <section className="panel lab-panel safe-to-train-panel" data-train-section="api">
      <div className="output-header">
        <div className="panel-header">
          <Check size={18} />
          <h2>Safe-to-train setup</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={onRunHostedSetupWizard}>
          <ListChecks size={14} />
          Check setup
        </button>
      </div>
      <div className="compact-scoreboard">
        <Metric value={String(report.score)} label="Setup score" />
        <Metric value={report.safe ? "Yes" : "Review"} label="Safe" />
        <Metric value={String(checks.length)} label="Check runs" />
      </div>
      <div className="gate-check-grid">
        {report.checks.map((check) => (
          <article className="index-card" data-tone={check.ready ? "good" : "watch"} key={check.key}>
            <strong>{check.label}</strong>
            <span>{check.ready ? "ready" : "fix"}</span>
            <p>{check.ready ? "Verified for this environment." : check.fix}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvaluationArtifactsPanel({
  artifacts,
  latest,
  onCreateSelectedEvaluationArtifact,
}: {
  artifacts: EvaluationArtifact[];
  latest?: EvaluationArtifact;
  onCreateSelectedEvaluationArtifact: () => void;
}) {
  return (
    <section className="panel lab-panel evaluation-artifacts-panel" data-train-section="packs">
      <div className="output-header">
        <div className="panel-header">
          <FileText size={18} />
          <h2>Evaluation artifacts</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onCreateSelectedEvaluationArtifact}>
          <Plus size={14} />
          Create artifact
        </button>
      </div>
      <div className="artifact-preview-grid">
        <div className="output-box mini-output">
          <pre>{latest?.markdown ?? "Create an evaluation artifact to package the selected prompt, proof state, memory influences, and next mutation."}</pre>
        </div>
        <div className="version-list compact-list">
          {artifacts.slice(0, 5).map((artifact) => (
            <article className="version-card" key={artifact.id}>
              <div>
                <strong>{artifact.title}</strong>
                <span>{artifact.proofStatus}</span>
              </div>
              <p>{artifact.nextMutation}</p>
              <small>{artifact.influences.length} influence(s), {artifact.rulesUsed.length} rule(s)</small>
            </article>
          ))}
          {!artifacts.length && <p className="selected-meta">No artifacts yet. Create one from the selected prompt.</p>}
        </div>
      </div>
    </section>
  );
}

function TrainFromCorpusPanel({
  dataset,
  memoryDiff,
  onTrainFromCorpus,
  queueProgress,
}: {
  dataset: GoldenDatasetReport;
  memoryDiff: PromptMemoryDiffReport;
  onTrainFromCorpus: () => void;
  queueProgress: QueueProgressReport;
}) {
  return (
    <section className="panel lab-panel train-from-corpus-panel" data-train-section="workflow">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Train from this corpus</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onTrainFromCorpus} disabled={!dataset.rows.length}>
          <Hammer size={15} />
          Train corpus
        </button>
      </div>
      <div className="compact-scoreboard">
        <Metric value={String(dataset.rows.length)} label="Dataset rows" />
        <Metric value={String(dataset.readyScore)} label="Dataset ready" />
        <Metric value={String(memoryDiff.score)} label="Memory diff" />
        <Metric value={String(queueProgress.score)} label="Queue proof" />
      </div>
      <FeedbackList
        title="What this runs"
        items={[
          "Locks Golden Dataset v1 from the current curated corpus.",
          "Runs the benchmark suite against canonical website prompt fixtures.",
          "Calibrates predicted strength against actual outcomes and exports JSON/JSONL training artifacts.",
        ]}
        empty="No corpus training steps."
      />
    </section>
  );
}

function ProofRunnerProgressPanel({ progress }: { progress: ProofProgressReport }) {
  return (
    <section className="panel lab-panel proof-progress-panel" data-train-section="queue">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Proof runner progress</h2>
        </div>
        <span className="workspace-pill">{progress.status}</span>
      </div>
      <div className="proof-progress-track">
        {progress.steps.map((step, index) => (
          <article className="proof-progress-step" data-state={step.state} key={step.label}>
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </article>
        ))}
      </div>
      <p className="selected-meta">
        {progress.latest ? `Latest proof job: ${progress.latest.variantTitle} in ${progress.latest.runFolder}.` : "No proof job has been queued for the selected prompt yet."}
      </p>
    </section>
  );
}

function QueueProgressLedgerPanel({ onRefresh, report }: { onRefresh: () => void; report: QueueProgressReport }) {
  return (
    <section className="panel lab-panel queue-progress-ledger" data-train-section="queue">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Queue progress ledger</h2>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={onRefresh}>
          <RefreshIcon />
          Refresh
        </button>
      </div>
      <div className="proof-progress-track compact-track">
        {report.steps.map((step) => (
          <article className="proof-progress-step" data-state={step.state} key={step.label}>
            <span>{step.state === "done" ? "ok" : step.state === "failed" ? "!" : "..."}</span>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </article>
        ))}
      </div>
      <div className="event-list">
        {report.events.length ? report.events.map((event) => (
          <article key={`${event.createdAt}-${event.label}-${event.detail}`}>
            <strong>{event.label}</strong>
            <span>{event.detail}</span>
            <small>{new Date(event.createdAt).toLocaleString()}</small>
          </article>
        )) : <p className="selected-meta">No queue events yet. Run the API queue to create durable progress logs.</p>}
      </div>
      <FeedbackList title="Queue notes" items={report.notes} empty="No queue notes yet." />
    </section>
  );
}

function RefreshIcon() {
  return <span aria-hidden="true">R</span>;
}

function VisualProofGalleryPanel({
  buildRuns,
  resultGallery,
  screenshots,
}: {
  buildRuns: BuildRunRecord[];
  resultGallery: ResultGalleryItem[];
  screenshots: ScreenshotRecord[];
}) {
  const latestRuns = buildRuns.slice(0, 4);
  return (
    <section className="panel lab-panel visual-proof-gallery" data-train-section="screenshots">
      <div className="output-header">
        <div className="panel-header">
          <FileText size={18} />
          <h2>Visual proof gallery</h2>
        </div>
        <span className="workspace-pill">{screenshots.length} screenshot(s)</span>
      </div>
      <div className="result-gallery-grid">
        {resultGallery.length ? resultGallery.slice(0, 8).map((item) => (
          <article className="gallery-card" key={`proof-${item.id}`}>
            {item.image && /^(https?:|data:|\/)/.test(item.image) ? <img src={item.image} alt={item.title} /> : <div className="empty-shot">No screenshot</div>}
            <strong>{item.title}</strong>
            <span>{item.status} / {item.score}</span>
            <p>{item.notes || item.resultUrl || "Attach a result URL or screenshot note."}</p>
          </article>
        )) : <p className="selected-meta">Capture or import screenshots to build visual proof memory.</p>}
      </div>
      <div className="version-list compact-list">
        {latestRuns.length ? latestRuns.map((run) => (
          <article className="version-card" key={`proof-run-${run.id}`}>
            <div className="dna-v2-topline">
              <strong>{run.promptTitle}</strong>
              <span data-tone={scoreTone(run.score)}>{run.score}</span>
            </div>
            <p>{run.status} · {run.resultUrl || run.folderPath || "No URL"}</p>
          </article>
        )) : <p className="selected-meta">No build runs recorded yet.</p>}
      </div>
    </section>
  );
}

function PromptEvolutionDiffPanel({ report }: { report: EvolutionDiffReport }) {
  return (
    <section className="panel lab-panel evolution-diff-panel" data-train-section="improve">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Prompt diff and evolution</h2>
        </div>
        <span data-tone={scoreTone(50 + report.scoreDelta)}>{report.scoreDelta >= 0 ? `+${report.scoreDelta}` : report.scoreDelta}</span>
      </div>
      <div className="train-columns nested-train-columns">
        <FeedbackList title={`Added in ${report.toTitle}`} items={report.addedSignals} empty="No added signals yet." />
        <FeedbackList title={`Removed from ${report.fromTitle}`} items={report.removedSignals} empty="No removed signals yet." />
      </div>
      <FeedbackList title="Evolution summary" items={report.summary} empty="No evolution summary yet." />
    </section>
  );
}

function PromptMemoryDiffPanel({ report }: { report: PromptMemoryDiffReport }) {
  return (
    <section className="panel lab-panel memory-diff-panel" data-train-section="packs">
      <div className="output-header">
        <div className="panel-header">
          <Archive size={18} />
          <h2>Prompt memory diff</h2>
        </div>
        <ScoreRing score={report.score} label="memory" />
      </div>
      <div className="train-columns nested-train-columns">
        <FeedbackList title="Added sections" items={report.addedSections} empty="No new memory sections." />
        <FeedbackList title="Expanded sections" items={report.expandedSections} empty="No expanded sections yet." />
      </div>
      <FeedbackList title="Memory summary" items={report.summary} empty="No memory summary yet." />
      {report.staleSections.length ? <FeedbackList title="Needs proof" items={report.staleSections} empty="No stale sections." /> : null}
    </section>
  );
}

function BenchmarkTrendChartPanel({ report }: { report: BenchmarkTrendReport }) {
  return (
    <section className="panel lab-panel benchmark-trend-panel" data-train-section="patterns">
      <div className="output-header">
        <div className="panel-header">
          <BarChart3 size={18} />
          <h2>Benchmark trend chart</h2>
        </div>
        <span className="workspace-pill">{report.trend}</span>
      </div>
      <div className="trend-chart" aria-label="Benchmark score trend">
        {report.points.length ? (
          report.points.map((point) => (
            <article key={point.label} style={{ "--score": `${Math.max(8, point.score)}%` } as CSSProperties}>
              <span>{point.score}</span>
              <i data-tone={scoreTone(point.score)} />
              <small>{point.label}</small>
              <em>{point.delta >= 0 ? `+${point.delta}` : point.delta}</em>
            </article>
          ))
        ) : (
          <p className="selected-meta">Run the benchmark suite to create the first trend point.</p>
        )}
      </div>
      <FeedbackList title="Trend notes" items={report.notes} empty="No trend notes yet." />
    </section>
  );
}

function HostedBrainReadinessPanel({
  onRunHostedClaudeHealthCheck,
  report,
}: {
  onRunHostedClaudeHealthCheck: () => void;
  report: HostedBrainReadinessReport;
}) {
  return (
    <section className="panel lab-panel hosted-readiness-panel" data-train-section="api">
      <div className="output-header">
        <div className="panel-header">
          <Gauge size={18} />
          <h2>Claude readiness without browser secrets</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunHostedClaudeHealthCheck}>
          <Check size={15} />
          Deep check
        </button>
      </div>
      <ScoreRing score={report.score} label="ready" />
      <div className="hardening-grid">
        {report.rows.map((row) => (
          <article className="sync-check-card" data-ready={row.ready} key={row.label}>
            <strong>{row.ready ? "Ready" : "Watch"}</strong>
            <span>{row.label}</span>
            <p>{row.detail}</p>
          </article>
        ))}
      </div>
      <FeedbackList title="Readiness notes" items={report.notes} empty="No readiness notes." />
    </section>
  );
}

function GoldenDatasetLockPanel({
  copied,
  dataset,
  onCopy,
  onDownload,
  onLockGoldenDatasetV1,
}: {
  copied: string;
  dataset: GoldenDatasetReport;
  onCopy: (value: string, key: string) => void;
  onDownload: (filename: string, text: string, type?: string) => void;
  onLockGoldenDatasetV1: () => void;
}) {
  return (
    <section className="panel lab-panel golden-dataset-panel" data-train-section="workspace">
      <div className="output-header">
        <div className="panel-header">
          <Trophy size={18} />
          <h2>Locked Golden Dataset v1</h2>
        </div>
        <ScoreRing score={dataset.readyScore} label="ready" />
      </div>
      <div className="compact-scoreboard">
        <Metric value={String(dataset.rows.length)} label="Rows" />
        <Metric value={String(dataset.trainCount)} label="Train" />
        <Metric value={String(dataset.testCount)} label="Test" />
        <Metric value={String(dataset.goldCount)} label="Gold" />
      </div>
      <div className="button-row">
        <button className="primary-button compact-button" type="button" onClick={onLockGoldenDatasetV1}>
          <Save size={15} />
          Lock v1
        </button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(dataset.jsonl, "golden-dataset-jsonl")} disabled={!dataset.jsonl}>
          {copied === "golden-dataset-jsonl" ? <Check size={15} /> : <Copy size={15} />}
          Copy JSONL
        </button>
        <button className="ghost-button compact-button" type="button" onClick={() => onDownload("golden-dataset-v1.jsonl", dataset.jsonl, "application/x-ndjson")} disabled={!dataset.jsonl}>
          <Download size={15} />
          Export JSONL
        </button>
      </div>
      <FeedbackList title={dataset.label} items={dataset.notes} empty="No dataset notes yet." />
      <div className="version-list compact-list">
        {dataset.rows.slice(0, 8).map((row) => (
          <article className="version-card" key={row.id}>
            <div className="dna-v2-topline">
              <strong>{row.title}</strong>
              <span data-tone={scoreTone(row.score)}>{row.score}</span>
            </div>
            <p>{row.split} / {row.status}</p>
          </article>
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
          <BarChart3 size={15} />
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
    { id: "patterns", title: "Patterns", value: outcomes.filter((outcome) => outcome.status === "gold").length, detail: "Mine gold/good examples for reusable prompt patterns." },
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
          <BarChart3 size={18} />
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
          <BarChart3 size={15} />
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
        <BarChart3 size={18} />
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
          <Hammer size={18} />
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
              <BarChart3 size={15} />
              Refine with Claude
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function PromptGeneratorFrontDoorPanel({
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
  const best = guidedWizard.variants[0];
  function update<K extends keyof LearnedGeneratorInput>(key: K, value: LearnedGeneratorInput[K]) {
    setGeneratorInput((current) => ({ ...current, [key]: value }));
  }
  const fields: { key: keyof LearnedGeneratorInput; label: string; multiline?: boolean }[] = [
    { key: "industry", label: "Industry" },
    { key: "audience", label: "Audience" },
    { key: "goal", label: "Goal", multiline: true },
    { key: "stack", label: "Stack" },
    { key: "visualStyle", label: "Visual style", multiline: true },
    { key: "assets", label: "Assets", multiline: true },
    { key: "constraints", label: "Constraints and proof", multiline: true },
  ];
  return (
    <section className="panel lab-panel prompt-generator-front-door-panel" data-train-section="generate">
      <div className="output-header">
        <div className="panel-header">
          <Hammer size={18} />
          <h2>Prompt generator front door</h2>
        </div>
        <span className="workspace-pill">{generatorInput.outputTarget}</span>
      </div>
      <p className="selected-meta">Fill the brief once, then use the best generated prompt as a build task, Claude prompt, or JSONL training row.</p>
      <div className="generator-front-grid">
        <div className="simple-brief-fields">
          <div className="two-field-grid">
            <Field label="Brand">
              <input value={generatorInput.brandName} onChange={(event) => update("brandName", event.target.value)} />
            </Field>
            <Field label="Site type">
              <input value={generatorInput.siteType} onChange={(event) => update("siteType", event.target.value)} />
            </Field>
          </div>
          {fields.map((field) => (
            <Field label={field.label} key={field.key}>
              {field.multiline ? (
                <textarea value={String(generatorInput[field.key])} onChange={(event) => update(field.key, event.target.value as never)} />
              ) : (
                <input value={String(generatorInput[field.key])} onChange={(event) => update(field.key, event.target.value as never)} />
              )}
            </Field>
          ))}
        </div>
        <article className="simple-prompt-preview">
          <div className="dna-v2-topline">
            <strong>{best?.title ?? "No generated prompt yet"}</strong>
            <span data-tone={scoreTone(best?.score ?? 0)}>{best?.score ?? 0}</span>
          </div>
          <FeedbackList title="Brief gaps" items={guidedWizard.nextActions} empty="Brief is ready enough to generate." />
          <textarea className="generated-output style-guide-output" readOnly value={best?.prompt ?? ""} />
          <div className="button-row">
            <button className="primary-button compact-button" type="button" disabled={!best} onClick={() => best && onApplyGeneratorVariant(best)}>
              Use best
            </button>
            <button className="ghost-button compact-button" type="button" disabled={!best} onClick={() => best && onCopy(best.prompt, "generator-front-door")}>
              {copied === "generator-front-door" ? <Check size={15} /> : <Copy size={15} />}
              Copy
            </button>
            <button className="ghost-button compact-button" type="button" disabled={!best} onClick={() => best && onSave("generated", best.title, best.prompt, best.score)}>
              <Save size={15} />
              Save
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
          <BarChart3 size={18} />
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
          <BarChart3 size={18} />
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
          <BarChart3 size={15} />
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
          <Hammer size={18} />
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
              <BarChart3 size={15} />
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
          <BarChart3 size={15} />
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
          <BarChart3 size={15} />
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
  const targets = ["Codex prompt", "Claude prompt", "v0 prompt", "Cursor task", "JSON training dataset", "JSONL training data", "OpenAI fine-tune JSONL", "Claude project memory", "Codex skill bundle", "Model evaluation schema", "Markdown prompt pack"];
  const [target, setTarget] = useState(targets[0]);
  const formatted = formatPromptForTarget(selectedPrompt, target, promptMemory, packs);
  const extension = target === "JSON training dataset" || target === "Model evaluation schema" ? "json" : target === "JSONL training data" || target === "OpenAI fine-tune JSONL" ? "jsonl" : "md";
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

function OneClickExportPackPanel({
  copied,
  goldenDataset,
  onCopy,
  onExportOneClickTrainingPack,
  packText,
}: {
  copied: string;
  goldenDataset: GoldenDatasetReport;
  onCopy: (value: string, key: string) => void;
  onExportOneClickTrainingPack: () => void;
  packText: string;
}) {
  const sizeKb = Math.max(1, Math.round(packText.length / 1024));
  return (
    <section className="panel lab-panel one-click-export-panel" data-train-section="packs">
      <div className="output-header">
        <div className="panel-header">
          <PackageOpen size={18} />
          <h2>One-click export pack</h2>
        </div>
        <div className="button-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(packText, "one-click-export-pack")}>
            {copied === "one-click-export-pack" ? <Check size={15} /> : <Copy size={15} />}
            Copy
          </button>
          <button className="primary-button compact-button" type="button" onClick={onExportOneClickTrainingPack}>
            <Download size={15} />
            Export all
          </button>
        </div>
      </div>
      <div className="source-safety-grid">
        <article className="index-card">
          <strong>{sizeKb}kb</strong>
          <span>pack size</span>
        </article>
        <article className="index-card">
          <strong>{goldenDataset.rows.length}</strong>
          <span>dataset rows</span>
        </article>
        <article className="index-card wide-index-card">
          <h3>Included</h3>
          <p>Golden prompts, JSONL, bad/avoid signals, strength rules, benchmark trend, project boundary report, reusable memory, and Codex build pack.</p>
        </article>
      </div>
      <textarea className="generated-output mini-output" readOnly value={packText.slice(0, 2500)} />
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
          <Hammer size={18} />
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
          <BarChart3 size={18} />
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
        <h2>Why this quality score?</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={dnaExplanation.overall} label="Quality" />
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
    "PROMPT_LAB_DATA_DIR=/tmp/prompt-atelier",
    "PROMPT_LAB_ALLOWED_ORIGIN=https://zakiefer.github.io",
    "PROMPT_LAB_RATE_LIMIT=240",
    "PROMPT_LAB_WORKER_ENABLED=false",
  ].join("\n");
  const setup = [
    "1. Render builds the public main branch with render.yaml.",
    "2. Render runs npm ci, then npm run api.",
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
      <p className="selected-meta">Use the included source-backed Render config for token-protected cross-browser sync and hosted smoke checks. Attach a disk when production persistence is required.</p>
      <div className="hosted-api-grid">
        <article className="index-card wide-index-card">
          <h3>Files added</h3>
          <p>render.yaml, docs/hosted-api.md, Render API workflow</p>
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
        <Hammer size={18} />
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
          <BarChart3 size={18} />
          <h2>Claude batch calibration</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunModelBatchCalibration}>
          <BarChart3 size={15} />
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
          <BarChart3 size={18} />
          <h2>Claude prompt coach</h2>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRunPromptCoach}>
          <BarChart3 size={15} />
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
          <Hammer size={18} />
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
        <h2>Prompt strength v2</h2>
      </div>
      <div className="qa-score-row">
        <ScoreRing score={dnaV2.overall} label="Strength v2" />
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
    ["server key", Boolean(modelEnvStatus?.apiKeyConfigured || modelEnvStatus?.anthropicApiKeyConfigured)],
    ["agent", Boolean(modelSettings.agentCommand || modelEnvStatus?.agentCommandConfigured)],
    ["build", Boolean(modelSettings.buildCommand || modelEnvStatus?.buildCommandConfigured)],
  ] as const;

  return (
    <section className="panel lab-panel">
      <div className="panel-header">
        <BarChart3 size={18} />
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
      <article className="version-card">
        <strong>Provider credentials stay server-side</strong>
        <span>{modelEnvStatus?.anthropicApiKeyConfigured || modelEnvStatus?.apiKeyConfigured ? "Server model credential detected" : "Local fallback active"}</span>
        <p>
          The browser sends prompts to the hosted API route and does not accept provider keys in this settings panel.
        </p>
      </article>
      <div className="two-field-grid">
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
        <BarChart3 size={18} />
        <h2>Model integration</h2>
      </div>
      <p className="selected-meta">
        Sends the selected prompt plus compiled memory to the local API. Set <code>PROMPT_LAB_MODEL_ENDPOINT</code> for an external evaluator; otherwise it uses a local fallback.
      </p>
      <button className="primary-button wide-button" type="button" onClick={onModelEvaluate} disabled={!selectedPrompt}>
        <BarChart3 size={15} />
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
        <h2>Prompt strength calibration</h2>
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
          <span>calibrated strength</span>
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
        <Hammer size={18} />
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
        <BarChart3 size={18} />
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
        <Hammer size={18} />
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
                <span>Strength</span>
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
        <Hammer size={18} />
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
        <h2>Prompt strength leaderboard</h2>
      </div>
      <div className="leaderboard-list">
        {leaderboard.slice(0, 10).map((rank, index) => (
          <button className="leaderboard-card" key={rank.example.id} type="button" onClick={() => onSelectPrompt(rank.example.id)}>
            <span className="rank-badge">{index + 1}</span>
            <div>
              <strong>{rank.example.title}</strong>
              <p>{rank.reasons.join(" / ")}</p>
              <small>
                Strength {rank.dnaScore} / Originality {rank.originality} / Outcome {rank.outcomeBoost >= 0 ? "+" : ""}
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
