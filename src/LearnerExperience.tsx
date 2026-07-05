import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BarChart3, Check, Copy, Download, Layers, Save, SlidersHorizontal, Sparkles, Tags, Trophy } from "lucide-react";
import {
  categoryLabels,
  countWords,
  dnaLabels,
  type ArchetypeCluster,
  type CategoryKey,
  type DnaKey,
  type DnaScoreExplanation,
  type Evaluation,
  type Feature,
  type OutcomeRating,
  type PromptAnalysis,
  type PromptBattle,
  type PromptDiff,
  type PromptExample,
  type PromptImportAudit,
  type PromptProfile,
} from "./promptEngine";
import {
  buildLearnerBriefPrompt,
  createEmptyLearnerBriefInput,
  type CorpusNeighbor,
  type CorpusReviewRow,
  type DnaRewrite,
  type LearnerBriefInput,
  type LearnerExportPack,
  type LearnerProofItem,
  type LearnerRecipe,
  type LearnerSamplePrompt,
  type LearnerSession,
  type LearningProfile,
  type TargetExportPreset,
} from "./learnerProduct";
import {
  buildExportDifferentiators,
  buildLearnedPromptSections,
  buildLearnerBattleSummary,
  buildLearnerCorpusSafety,
  buildLearnerDiagnosis,
  buildLearnerExportTargetMatrix,
  buildLearnerIngestionSummary,
  buildLearnerOperatingLoop,
  buildLearnerProofPlan,
  buildLearnerProofAction,
  buildLearnerProofDeployStatus,
  buildLearnerProjectSystem,
  buildLearnerRegressionSummary,
  buildLearnerStyleProfileCards,
  buildLearnedStyleGenerator,
} from "./learnerViewModel";
import {
  BeginnerPromptPath,
  CiProofStatusPanel,
  CoverageIntelligencePanel,
  CorpusTriageToolbar,
  ExportDeliverablesPanel,
  EvalHistoryCompactPanel,
  ExportStudioPanel,
  ExportPresetPreview,
  ImportFrontDoorPanel,
  LearnedPromptSectionEditor,
  LearnerActivityRail,
  LearnerCommandDeck,
  LearnerMobileStepBar,
  LearnerWorkspaceSearchPanel,
  OneClickProofRail,
  ProjectCockpitPanel,
  ProjectHistoryPanel,
  ProjectTimelinePanel,
  ProductionCommandCenterPanel,
  ProductionHardeningPanel,
  ProductChangelogPanel,
  ProjectPersistencePanel,
  PromptQualityReportPanel,
  ProofRunnerChecklistPanel,
  ResultGalleryPanel,
  TasteProfileVersionsPanel,
  PromptLintFixPanel,
  ProofQualityLeaderboardPanel,
  ProofArtifactVault,
  ProofDeployStatusPanel,
  ProofIntakePanel,
  MobileOperatorPanel,
  TrainingImpactPanel,
  VisualRepairLoopPanel,
  WorkflowOsPanel,
  type CurrentProjectSummary,
  type CorpusHealthDecision,
  type EvalHistoryRecord,
  type ImportFrontDoorItem,
  type LearnerActivityItem,
  type LearnerProofVaultItem,
  type LearnerWorkspaceTab,
  type LearnerSearchResult,
  type OneClickProofStep,
  type ProjectStage,
  type ProjectSnapshot,
  type ProjectProofRunRecord,
  type ProjectSyncState,
  type PromptQualityReportItem,
  type ProofChecklistItem,
  type ProofLeaderboardRow,
  type ProductChangelogItem,
  type PromptLintFix,
  type TrainingSignal,
} from "./LearnerWorkflowPanels";
import { BUILD_STATUS } from "./buildStatus";
import { type HoldoutBenchmarkReport, type ProjectSpacesReport } from "./productEvolution";
import { getProjectCollections, runProjectProofViaApi, saveProjectToApi } from "./promptApi";
import {
  buildCiProofCards,
  buildCoverageIntelligence,
  buildExportStudioGroups,
  buildMobileOperatorActions,
  buildProjectTimeline,
  buildResultGalleryItems,
  buildVisualRepairPrompt,
  buildWorkflowMilestones,
  createTasteProfileVersion,
  type ResultGalleryItem,
  type TasteProfileVersion,
  type TimelineItem,
} from "./learnerWorkflowNext";

const categoryOrder = Object.keys(categoryLabels) as CategoryKey[];
const dnaOrder = Object.keys(dnaLabels) as DnaKey[];
const PROOF_VAULT_KEY = "prompt-atelier-proof-vault-v1";
const PROJECT_SNAPSHOT_KEY = "prompt-atelier-project-snapshot-v1";
const PROJECT_HISTORY_KEY = "prompt-atelier-project-history-v1";
const GENERATED_PROMPTS_KEY = "prompt-atelier-generated-prompts-v1";
const PROJECT_PROOF_RUNS_KEY = "prompt-atelier-project-proof-runs-v1";
const EVAL_HISTORY_KEY = "prompt-atelier-eval-history-v1";
const CORPUS_HEALTH_DECISION_KEY = "prompt-atelier-corpus-health-decision-v1";
const REPAIR_PROMPT_KEY = "prompt-atelier-visual-repair-prompt-v1";
const TASTE_PROFILE_VERSIONS_KEY = "prompt-atelier-taste-profile-versions-v1";

type GeneratedPromptRecord = {
  id: string;
  projectId: string;
  title: string;
  prompt: string;
  score: number;
  source: string;
  createdAt: string;
};

function addPercent(score: number) {
  return `${Math.max(0, Math.min(100, Math.round(score)))}%`;
}

function readProofVault(): LearnerProofVaultItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROOF_VAULT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 24) as LearnerProofVaultItem[] : [];
  } catch {
    return [];
  }
}

function writeProofVault(items: LearnerProofVaultItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROOF_VAULT_KEY, JSON.stringify(items.slice(0, 24)));
}

function readProjectSnapshot(): ProjectSnapshot | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(PROJECT_SNAPSHOT_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as ProjectSnapshot;
    return parsed && typeof parsed.id === "string" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeProjectSnapshot(snapshot: ProjectSnapshot) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROJECT_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

function readProjectHistory(): ProjectSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROJECT_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 12) as ProjectSnapshot[] : [];
  } catch {
    return [];
  }
}

function writeProjectHistory(history: ProjectSnapshot[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROJECT_HISTORY_KEY, JSON.stringify(history.slice(0, 12)));
}

function readLocalArray<T>(key: string, limit: number): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, limit) as T[] : [];
  } catch {
    return [];
  }
}

function writeLocalArray<T>(key: string, value: T[], limit: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value.slice(0, limit)));
}

function readLocalString(key: string) {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeLocalString(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

function readCorpusHealthDecision(): CorpusHealthDecision | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(CORPUS_HEALTH_DECISION_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as CorpusHealthDecision;
    return parsed?.id ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeCorpusHealthDecision(decision: CorpusHealthDecision) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CORPUS_HEALTH_DECISION_KEY, JSON.stringify(decision));
}

function classifyImportFile(filename: string, text: string): Omit<ImportFrontDoorItem, "id" | "filename" | "text"> {
  const lower = filename.toLowerCase();
  const kind: ImportFrontDoorItem["kind"] = lower.endsWith(".md")
    ? "markdown"
    : lower.endsWith(".jsonl")
      ? "jsonl"
      : lower.endsWith(".json")
        ? "json"
        : lower.endsWith(".txt")
          ? "txt"
          : "unknown";
  const words = countWords(text);
  const secretLike = /(sk-ant|sk-proj|api[_-]?key|bearer\s+[a-z0-9._-]{16,}|password|secret|token)/i.test(text);
  const websiteLike = /(react|vite|tailwind|hero|landing|font|video|layout|responsive|css|typescript|navbar|button)/i.test(text);
  const status: ImportFrontDoorItem["status"] = secretLike ? "blocked" : words < 35 || !websiteLike ? "review" : "ready";
  const reason = secretLike
    ? "Possible secret, token, or unrelated credential text detected. Keep it out of memory."
    : status === "ready"
      ? "Looks like a website prompt and is safe to use as the working prompt."
      : "Needs review before training because it is short or missing website-build signals.";
  return { kind, words, status, reason };
}

function buildPromptLintFixes(prompt: string): PromptLintFix[] {
  const text = prompt.toLowerCase();
  const fixes: PromptLintFix[] = [];
  if (!/mobile|responsive|breakpoint|viewport/.test(text)) {
    fixes.push({
      id: "mobile-proof",
      label: "Add mobile proof",
      detail: "The prompt should require mobile layout and screenshot verification.",
      patch: "Responsive proof: verify desktop and mobile screenshots, text wrapping, navigation behavior, and no horizontal overflow.",
      severity: "fix",
    });
  }
  if (!/https?:\/\/|\/assets|\/logo|image|video/.test(text)) {
    fixes.push({
      id: "asset-specificity",
      label: "Specify assets",
      detail: "Great website prompts usually pin real media, image paths, or explicit asset fallback rules.",
      patch: "Assets: include exact image/video URLs or named local asset paths, plus fallback behavior if an asset fails to load.",
      severity: "watch",
    });
  }
  if (!/no |avoid|do not|without|must not/.test(text)) {
    fixes.push({
      id: "no-go-rules",
      label: "Add no-go rules",
      detail: "The prompt needs guardrails for visual style, scope, and unwanted sections.",
      patch: "No-go rules: do not add unrelated sections, marketing filler, decorative blobs, hidden overflow, or unrequested libraries.",
      severity: "fix",
    });
  }
  if (!/console|build|lint|screenshot|qa|verify|playwright/.test(text)) {
    fixes.push({
      id: "verification-gates",
      label: "Add verification gates",
      detail: "Require build, browser, screenshot, and console proof so the result can be judged.",
      patch: "Verification: run lint/build, capture desktop and mobile screenshots, check console/network errors, and confirm media is nonblank.",
      severity: "fix",
    });
  }
  return fixes.slice(0, 4);
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  return (
    <div className="score-ring" style={{ "--score": score } as React.CSSProperties}>
      <strong>{addPercent(score)}</strong>
      <span>{label}</span>
    </div>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function FeedbackList({ empty, items, title }: { empty: string; items: string[]; title: string }) {
  return (
    <div className="feedback-list">
      <h3>{title}</h3>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="selected-meta">{empty}</p>
      )}
    </div>
  );
}

function DnaList({ dna }: { dna: Record<DnaKey, number> }) {
  return (
    <div className="dna-list">
      {dnaOrder.map((key) => (
        <div className="dna-row" key={key}>
          <span>{dnaLabels[key]}</span>
          <strong>{dna[key]}</strong>
        </div>
      ))}
    </div>
  );
}

function ScoreList({ scores }: { scores: Record<CategoryKey, number> }) {
  return (
    <div className="score-list">
      {categoryOrder.map((key) => (
        <div className="score-row" key={key}>
          <span>{categoryLabels[key]}</span>
          <strong>{scores[key]}</strong>
        </div>
      ))}
    </div>
  );
}

function FeaturePills({ empty, features }: { empty: string; features: Feature[] }) {
  if (!features.length) return <p className="selected-meta">{empty}</p>;
  return (
    <div className="chips">
      {features.slice(0, 10).map((feature) => (
        <span key={feature.label}>{feature.label}</span>
      ))}
    </div>
  );
}

function ClusterCard({ cluster }: { cluster: ArchetypeCluster }) {
  return (
    <article className="cluster-card">
      <strong>{cluster.label}</strong>
      <span>{cluster.count} prompts / {cluster.score}%</span>
      <p>{cluster.signals.slice(0, 4).join(" / ") || "Learning signals are still forming."}</p>
    </article>
  );
}

export function PublicDemoRoute({
  activeLearningProfile,
  copied,
  dnaExplanation,
  improvedPrompt,
  learnerEvaluation,
  learnerExportPack,
  learnerText,
  learningProfiles,
  samplePrompts,
  targetExportPresets,
  onCopy,
  onExportLearnerPack,
  onSaveImproved,
  onUseSamplePrompt,
  profile,
  selectedPrompt,
  setActiveLearningProfileId,
  setLearnerText,
}: {
  activeLearningProfile: LearningProfile;
  copied: string;
  dnaExplanation: DnaScoreExplanation;
  improvedPrompt: string;
  learnerEvaluation: Evaluation;
  learnerExportPack: LearnerExportPack;
  learnerText: string;
  learningProfiles: LearningProfile[];
  samplePrompts: LearnerSamplePrompt[];
  targetExportPresets: TargetExportPreset[];
  onCopy: (value: string, key: string) => void;
  onExportLearnerPack: () => void;
  onSaveImproved: () => void;
  onUseSamplePrompt: (text: string) => void;
  profile: PromptProfile;
  selectedPrompt?: PromptExample;
  setActiveLearningProfileId: (id: string) => void;
  setLearnerText: (value: string) => void;
}) {
  const sourceText = learnerText.trim() || selectedPrompt?.text || "";
  const demoSteps = [
    { label: "Paste", ready: Boolean(sourceText), detail: "Start with a high-quality website prompt." },
    { label: "Score", ready: learnerEvaluation.score > 0, detail: `${learnerEvaluation.score}/100 prompt strength.` },
    { label: "Improve", ready: improvedPrompt.length > sourceText.length, detail: "Better prompt generated from learned patterns." },
    { label: "Export", ready: learnerExportPack.files.every((file) => file.ready || file.label === "Screenshot proof refs"), detail: "Markdown and JSON pack ready." },
  ];
  return (
    <div className="demo-shell">
      <header className="demo-topbar">
        <div className="brand-mark" aria-hidden="true">
          <span>PA</span>
        </div>
        <div>
          <p className="eyebrow">Public demo</p>
          <h1>Website prompt learner</h1>
        </div>
        <a className="ghost-button compact-button" href="./">
          Open workbench
        </a>
      </header>

      <main className="demo-main">
        <section className="demo-hero panel">
          <div>
            <p className="eyebrow">Paste one great prompt</p>
            <h2>Score it clearly, then revise it.</h2>
            <p>
              Prompt Atelier diagnoses stack, assets, typography, layout, motion, responsiveness, constraints, and QA, then exports
              a builder-ready prompt pack.
            </p>
          </div>
          <div className="demo-score-row">
            <ScoreRing score={learnerEvaluation.score || activeLearningProfile.score || profile.detailScore} label="Prompt" />
            <ScoreRing score={dnaExplanation.overall} label="Strength" />
          </div>
        </section>

        <section className="demo-grid">
          <article className="panel learner-input-card">
            <div className="output-header">
              <h3>Your prompt</h3>
              <span className="selected-meta">{activeLearningProfile.label}</span>
            </div>
            <textarea
              value={learnerText}
              onChange={(event) => setLearnerText(event.target.value)}
              placeholder={selectedPrompt?.text || "Paste a website prompt here..."}
            />
            <div className="profile-strip">
              {learningProfiles.slice(0, 6).map((learningProfile) => (
                <button
                  className={learningProfile.id === activeLearningProfile.id ? "profile-chip active" : "profile-chip"}
                  key={learningProfile.id}
                  type="button"
                  onClick={() => setActiveLearningProfileId(learningProfile.id)}
                >
                  <strong>{learningProfile.label}</strong>
                  <span>{learningProfile.score}%</span>
                </button>
              ))}
            </div>
            <div className="sample-gallery compact-list">
              <div className="output-header">
                <h3>Try sample prompts</h3>
                <span className="selected-meta">No paste needed</span>
              </div>
              {samplePrompts.slice(0, 4).map((sample) => (
                <button className="sample-card" key={sample.id} type="button" onClick={() => onUseSamplePrompt(sample.prompt)}>
                  <strong>{sample.title}</strong>
                  <span>{sample.archetype} / {sample.score}%</span>
                </button>
              ))}
            </div>
          </article>

          <article className="panel learner-output-card">
            <div className="output-header">
              <h3>Better prompt</h3>
              <div className="button-row">
                <button className="primary-button compact-button" type="button" onClick={onSaveImproved}>
                  Revise
                </button>
                <button className="ghost-button compact-button" type="button" onClick={() => onCopy(improvedPrompt, "demo-improved")}>
                  {copied === "demo-improved" ? <Check size={15} /> : <Copy size={15} />}
                  Copy
                </button>
              </div>
            </div>
            <textarea className="generated-output learner-output" readOnly value={improvedPrompt} />
          </article>
        </section>

        <section className="self-serve-grid">
          <article className="panel learner-mini-panel">
            <h3>Guided path</h3>
            <div className="safe-check-grid learner-step-grid">
              {demoSteps.map((step) => (
                <article className="safe-check" data-ready={step.ready ? "true" : "false"} key={step.label}>
                  <strong>{step.ready ? "Ready" : "Next"}</strong>
                  <span>{step.label}</span>
                  <p>{step.detail}</p>
                </article>
              ))}
            </div>
          </article>
          <article className="panel learner-mini-panel">
            <div className="output-header">
              <h3>Export pack</h3>
              <button className="primary-button compact-button" type="button" onClick={onExportLearnerPack}>
                <Download size={15} />
                Export
              </button>
            </div>
            <FeedbackList title="Included files" items={learnerExportPack.files.map((file) => `${file.filename}: ${file.detail}`)} empty="No files." />
            <div className="preset-grid">
              {targetExportPresets.slice(0, 4).map((preset) => (
                <button className="ghost-button compact-button" key={preset.id} type="button" onClick={() => onCopy(preset.content, `demo-preset-${preset.id}`)}>
                  {copied === `demo-preset-${preset.id}` ? <Check size={15} /> : <Copy size={15} />}
                  {preset.label}
                </button>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export function LearnView({
  activeLearningProfile,
  batchAudit,
  batchCandidateCount,
  clusters,
  compiledPrompt,
  copied,
  dnaExplanation,
  dnaScore,
  improvedPrompt,
  learnerBattle,
  corpusNeighbors,
  dnaRewrites,
  learnerDiff,
  learnerEvaluation,
  learnerExportPack,
  learnerRecipes,
  learnerProofGallery,
  learnerText,
  learningProfiles,
  holdoutBenchmark,
  projectSpaces,
  corpusReviewRows,
  samplePrompts,
  savedLearnerSessions,
  targetExportPresets,
  onCopy,
  onCopyImproved,
  onExportLearnerPack,
  onSaveBattleWinner,
  onSaveCompiledPrompt,
  onSaveImproved,
  onSaveLearnerSession,
  onSaveReviewedDiff,
  onOpenLearnerSession,
  onRecordOutcomeFeedback,
  onReviewCorpusCandidate,
  onUseSamplePrompt,
  profile,
  selectedAnalysis,
  selectedPrompt,
  setActiveLearningProfileId,
  setLearnerText,
}: {
  activeLearningProfile: LearningProfile;
  batchAudit: PromptImportAudit;
  batchCandidateCount: number;
  clusters: ArchetypeCluster[];
  compiledPrompt: string;
  copied: string;
  dnaExplanation: DnaScoreExplanation;
  dnaScore: number;
  improvedPrompt: string;
  learnerBattle: PromptBattle;
  corpusNeighbors: CorpusNeighbor[];
  dnaRewrites: DnaRewrite[];
  learnerDiff?: PromptDiff;
  learnerEvaluation: Evaluation;
  learnerExportPack: LearnerExportPack;
  learnerRecipes: LearnerRecipe[];
  learnerProofGallery: LearnerProofItem[];
  learnerText: string;
  learningProfiles: LearningProfile[];
  holdoutBenchmark: HoldoutBenchmarkReport;
  projectSpaces: ProjectSpacesReport;
  corpusReviewRows: CorpusReviewRow[];
  samplePrompts: LearnerSamplePrompt[];
  savedLearnerSessions: LearnerSession[];
  targetExportPresets: TargetExportPreset[];
  onCopy: (value: string, key: string) => void;
  onCopyImproved: () => void;
  onExportLearnerPack: () => void;
  onSaveBattleWinner: () => void;
  onSaveCompiledPrompt: () => void;
  onSaveImproved: () => void;
  onSaveLearnerSession: (reviewedPrompt: string, acceptedDiffs: string[], rejectedDiffs: string[]) => void;
  onSaveReviewedDiff: (text: string) => void;
  onOpenLearnerSession: (session: LearnerSession) => void;
  onRecordOutcomeFeedback: (rating: OutcomeRating, notes: string, screenshotUrl: string, screenshotNotes: string) => void;
  onReviewCorpusCandidate: (row: CorpusReviewRow, action: "import" | "gold" | "bad" | "quarantine" | "merge", notes: string) => void;
  onUseSamplePrompt: (text: string) => void;
  profile: PromptProfile;
  selectedAnalysis?: PromptAnalysis;
  selectedPrompt?: PromptExample;
  setActiveLearningProfileId: (id: string) => void;
  setLearnerText: (value: string) => void;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"compose" | "review" | "export">("compose");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [diffDecisions, setDiffDecisions] = useState<Record<string, "accepted" | "rejected">>({});
  const [briefInput, setBriefInput] = useState<LearnerBriefInput>(() => createEmptyLearnerBriefInput(activeLearningProfile));
  const [outcomeRating, setOutcomeRating] = useState<OutcomeRating>("great");
  const [outcomeNotes, setOutcomeNotes] = useState("Built result matched the intended hierarchy, media treatment, and mobile layout.");
  const [outcomeScreenshotUrl, setOutcomeScreenshotUrl] = useState("");
  const [outcomeScreenshotNotes, setOutcomeScreenshotNotes] = useState("Desktop/mobile proof notes.");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [learnerActivity, setLearnerActivity] = useState<LearnerActivityItem[]>([]);
  const [proofVault, setProofVault] = useState<LearnerProofVaultItem[]>(() => readProofVault());
  const [projectSnapshot, setProjectSnapshot] = useState<ProjectSnapshot | undefined>(() => readProjectSnapshot());
  const [projectHistory, setProjectHistory] = useState<ProjectSnapshot[]>(() => readProjectHistory());
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPromptRecord[]>(() => readLocalArray<GeneratedPromptRecord>(GENERATED_PROMPTS_KEY, 24));
  const [projectProofRuns, setProjectProofRuns] = useState<ProjectProofRunRecord[]>(() => readLocalArray<ProjectProofRunRecord>(PROJECT_PROOF_RUNS_KEY, 24));
  const [evalHistory, setEvalHistory] = useState<EvalHistoryRecord[]>(() => readLocalArray<EvalHistoryRecord>(EVAL_HISTORY_KEY, 40));
  const [corpusHealthDecision, setCorpusHealthDecision] = useState<CorpusHealthDecision | undefined>(() => readCorpusHealthDecision());
  const [visualRepairPrompt, setVisualRepairPrompt] = useState(() => readLocalString(REPAIR_PROMPT_KEY));
  const [selectedRepairResult, setSelectedRepairResult] = useState<ResultGalleryItem | undefined>();
  const [tasteProfileVersions, setTasteProfileVersions] = useState<TasteProfileVersion[]>(() => readLocalArray<TasteProfileVersion>(TASTE_PROFILE_VERSIONS_KEY, 16));
  const [projectSync, setProjectSync] = useState<ProjectSyncState>({
    status: "browser",
    detail: "Browser storage is active. Sync project when the local or hosted API is reachable.",
    remoteProjects: 0,
    versions: 0,
    proofRuns: 0,
    generatedPrompts: 0,
  });
  const [importFrontDoorItems, setImportFrontDoorItems] = useState<ImportFrontDoorItem[]>([]);

  useEffect(() => {
    let active = true;
    const explicitApiBase = typeof window !== "undefined"
      ? window.localStorage.getItem("prompt-atelier-api-base") || import.meta.env.VITE_PROMPT_ATELIER_API_BASE
      : import.meta.env.VITE_PROMPT_ATELIER_API_BASE;
    if (!explicitApiBase) {
      setProjectSync((current) => ({
        ...current,
        remoteProjects: projectHistory.length ? 1 : 0,
        versions: projectHistory.length,
        proofRuns: projectProofRuns.length,
        generatedPrompts: generatedPrompts.length,
      }));
      return () => {
        active = false;
      };
    }
    void getProjectCollections()
      .then((payload) => {
        if (!active) return;
        const remoteGenerated = payload.collections.generatedPrompts as GeneratedPromptRecord[];
        const remoteProofRuns = payload.collections.projectProofRuns as ProjectProofRunRecord[];
        const remoteHistory = payload.collections.evalHistory as EvalHistoryRecord[];
        if (remoteGenerated.length) {
          setGeneratedPrompts(remoteGenerated.slice(0, 24));
          writeLocalArray(GENERATED_PROMPTS_KEY, remoteGenerated, 24);
        }
        if (remoteProofRuns.length) {
          setProjectProofRuns(remoteProofRuns.slice(0, 24));
          writeLocalArray(PROJECT_PROOF_RUNS_KEY, remoteProofRuns, 24);
        }
        if (remoteHistory.length) {
          setEvalHistory(remoteHistory.slice(0, 40));
          writeLocalArray(EVAL_HISTORY_KEY, remoteHistory, 40);
        }
        setProjectSync({
          status: "synced",
          detail: "Backend project sync is online; project records can persist to SQLite.",
          lastSyncedAt: new Date().toISOString(),
          remoteProjects: payload.collections.promptProjects.length,
          versions: payload.collections.projectVersions.length,
          proofRuns: remoteProofRuns.length,
          generatedPrompts: remoteGenerated.length,
        });
      })
      .catch(() => {
        if (!active) return;
        setProjectSync((current) => ({
          ...current,
          status: "browser",
          detail: "Browser storage is active. Run npm run api or set a hosted API base to sync projects.",
        }));
      });
    return () => {
      active = false;
    };
  }, [generatedPrompts.length, projectHistory.length, projectProofRuns.length]);

  const learnerSource = learnerText.trim() || selectedPrompt?.text || "";
  const diffCategories = learnerDiff?.categories.slice(0, 10) ?? [];
  const selectedSession = savedLearnerSessions.find((session) => session.id === selectedSessionId) || savedLearnerSessions[0];
  const briefPrompt = useMemo(() => buildLearnerBriefPrompt(briefInput, activeLearningProfile, profile), [activeLearningProfile, briefInput, profile]);
  const acceptedDiffLabels = diffCategories.filter((category) => diffDecisions[String(category.key)] === "accepted").map((category) => category.label);
  const rejectedDiffLabels = diffCategories.filter((category) => diffDecisions[String(category.key)] === "rejected").map((category) => category.label);
  const reviewedPrompt = useMemo(() => {
    const accepted = diffCategories
      .filter((category) => diffDecisions[String(category.key)] === "accepted")
      .flatMap((category) => category.rightOnly.slice(0, 5).map((item) => `${category.label}: ${item}`));
    const rejected = diffCategories
      .filter((category) => diffDecisions[String(category.key)] === "rejected")
      .map((category) => category.label);
    return [
      improvedPrompt,
      "",
      "PROMPT DIFF REVIEW LOCKS",
      accepted.length ? `Accept these gained signals:\n- ${accepted.join("\n- ")}` : "No section-level gains accepted yet.",
      rejected.length ? `Do not import these sections without review: ${rejected.join(", ")}.` : "No sections rejected.",
    ].join("\n");
  }, [diffCategories, diffDecisions, improvedPrompt]);
  const learnerProofPlan = useMemo(() => buildLearnerProofPlan({ proofGallery: learnerProofGallery }), [learnerProofGallery]);
  const learnerProofAction = useMemo(() => buildLearnerProofAction({ improvedPrompt, proofGallery: learnerProofGallery }), [improvedPrompt, learnerProofGallery]);
  const learnerBattleSummary = useMemo(() => buildLearnerBattleSummary(learnerBattle), [learnerBattle]);
  const learnerDiagnosis = useMemo(
    () => buildLearnerDiagnosis({ dnaExplanation, evaluation: learnerEvaluation, neighbors: corpusNeighbors, proofGallery: learnerProofGallery }),
    [corpusNeighbors, dnaExplanation, learnerEvaluation, learnerProofGallery],
  );
  const corpusSafety = useMemo(() => buildLearnerCorpusSafety(corpusReviewRows), [corpusReviewRows]);
  const ingestionSummary = useMemo(() => buildLearnerIngestionSummary(corpusReviewRows), [corpusReviewRows]);
  const regressionSummary = useMemo(() => buildLearnerRegressionSummary(holdoutBenchmark), [holdoutBenchmark]);
  const exportDifferentiators = useMemo(() => buildExportDifferentiators(learnerExportPack), [learnerExportPack]);
  const exportTargetMatrix = useMemo(() => buildLearnerExportTargetMatrix({ pack: learnerExportPack, presets: targetExportPresets }), [learnerExportPack, targetExportPresets]);
  const proofDeployStatus = useMemo(
    () => buildLearnerProofDeployStatus({
      buildStatus: BUILD_STATUS,
      corpusSafety,
      exportReadyCount: exportTargetMatrix.readyCount,
      proofAction: learnerProofAction,
      regressionSummary,
    }),
    [corpusSafety, exportTargetMatrix.readyCount, learnerProofAction, regressionSummary],
  );
  const workspaceSearchResults = useMemo<LearnerSearchResult[]>(() => [
    ...savedLearnerSessions.slice(0, 10).map((session) => ({
      id: `session-${session.id}`,
      kind: "session" as const,
      title: session.title,
      detail: `${session.profileLabel} / strength ${session.dnaScore} / ${session.benchmarkWinner.title}`,
      actionLabel: "Reopen session",
    })),
    ...proofVault.slice(0, 10).map((artifact) => ({
      id: `proof-vault-${artifact.id}`,
      kind: "proof" as const,
      title: artifact.title,
      detail: `${artifact.rating} / ${artifact.screenshotNotes || artifact.notes}`,
      actionLabel: "Review proof",
    })),
    ...learnerProofGallery.slice(0, 10).map((item) => ({
      id: `proof-gallery-${item.id}`,
      kind: "proof" as const,
      title: item.title,
      detail: `${item.kind} / ${item.score}% / ${item.detail}`,
      actionLabel: "Open proof tab",
    })),
    ...targetExportPresets.map((preset) => ({
      id: `export-${preset.id}`,
      kind: "export" as const,
      title: preset.label,
      detail: `${preset.filename} / ${preset.detail}`,
      actionLabel: "Open exports",
    })),
    ...corpusReviewRows.slice(0, 10).map((row) => ({
      id: `corpus-${row.id}`,
      kind: "corpus" as const,
      title: row.title,
      detail: `${row.decision} / ${row.score}% / ${row.cluster}`,
      actionLabel: "Open review",
    })),
    ...samplePrompts.slice(0, 10).map((sample) => ({
      id: `sample-${sample.id}`,
      kind: "sample" as const,
      title: sample.title,
      detail: `${sample.archetype} / ${sample.score}%`,
      actionLabel: "Use sample",
    })),
  ], [corpusReviewRows, learnerProofGallery, proofVault, samplePrompts, savedLearnerSessions, targetExportPresets]);
  const styleProfileCards = useMemo(() => buildLearnerStyleProfileCards({ activeProfile: activeLearningProfile, profiles: learningProfiles }), [activeLearningProfile, learningProfiles]);
  const operatingLoop = useMemo(
    () => buildLearnerOperatingLoop({
      battleReady: learnerBattleSummary.status === "ready",
      evaluation: learnerEvaluation,
      exportReadyCount: exportTargetMatrix.readyCount,
      improvedPrompt,
      proofAction: learnerProofAction,
      source: learnerSource,
    }),
    [exportTargetMatrix.readyCount, improvedPrompt, learnerBattleSummary.status, learnerEvaluation, learnerProofAction, learnerSource],
  );
  const learnedStyleGenerator = useMemo(
    () => buildLearnedStyleGenerator({
      activeProfile: activeLearningProfile,
      briefInput,
      diagnosis: learnerDiagnosis,
      improvedPrompt,
      proofAction: learnerProofAction,
      sourcePrompt: learnerSource,
    }),
    [activeLearningProfile, briefInput, improvedPrompt, learnerDiagnosis, learnerProofAction, learnerSource],
  );
  const learnedPromptSections = useMemo(
    () => buildLearnedPromptSections({ prompt: learnedStyleGenerator.prompt || improvedPrompt, sourcePrompt: learnerSource }),
    [improvedPrompt, learnedStyleGenerator.prompt, learnerSource],
  );
  const promptLintFixes = useMemo(
    () => buildPromptLintFixes(learnerText.trim() || learnedStyleGenerator.prompt || improvedPrompt || briefPrompt),
    [briefPrompt, improvedPrompt, learnedStyleGenerator.prompt, learnerText],
  );
  const changelogItems = useMemo<ProductChangelogItem[]>(() => [
    {
      id: "scroll-shell",
      label: "Normal page-wide scrolling",
      detail: "The workspace now lets the document scroll naturally instead of trapping scroll in the center panel.",
      meta: "UX",
    },
    {
      id: "proof-vault",
      label: "Durable local proof vault",
      detail: `${proofVault.length} proof artifact(s) are saved in this browser for export and review.`,
      meta: "Proof",
    },
    {
      id: "export-targets",
      label: "Target-specific exports",
      detail: `${targetExportPresets.length} presets now explain how each handoff changes for its target.`,
      meta: "Export",
    },
    {
      id: "build-status",
      label: "Build and deploy evidence",
      detail: BUILD_STATUS.commit ? `${BUILD_STATUS.commit.slice(0, 7)} / ${BUILD_STATUS.deployedAt || BUILD_STATUS.lastSmoke}` : "Local build metadata will populate during CI and Pages deploys.",
      meta: "Build",
    },
  ], [proofVault.length, targetExportPresets.length]);
  const proofLeaderboardRows = useMemo<ProofLeaderboardRow[]>(() => {
    const sessionRows = savedLearnerSessions.slice(0, 8).map((session) => ({
      id: `session-${session.id}`,
      title: session.title,
      score: Math.round(session.dnaScore * 0.7 + Math.min(100, session.exportFilesReady * 18) * 0.3),
      proof: Math.min(100, session.exportFilesReady * 18),
      kind: "session",
      detail: `${session.profileLabel} / ${session.acceptedDiffs.length} accepted section(s) / ${session.exportFilesReady} export file(s).`,
    }));
    const galleryRows = learnerProofGallery.slice(0, 8).map((item) => ({
      id: `proof-${item.id}`,
      title: item.title,
      score: Math.round(item.score * 0.85 + 15),
      proof: item.score,
      kind: item.kind,
      detail: `${item.kind} proof / ${item.meta} / ${item.detail}`,
    }));
    const vaultRows = proofVault.slice(0, 8).map((item) => ({
      id: `vault-${item.id}`,
      title: item.title,
      score: item.rating === "great" ? 96 : item.rating === "okay" ? 72 : item.rating === "bad" ? 28 : 50,
      proof: item.screenshotUrl ? 100 : 58,
      kind: "vault",
      detail: `${item.rating} / ${item.screenshotNotes || item.notes}`,
    }));
    return [...sessionRows, ...galleryRows, ...vaultRows]
      .sort((a, b) => b.score - a.score || b.proof - a.proof || a.title.localeCompare(b.title))
      .slice(0, 12);
  }, [learnerProofGallery, proofVault, savedLearnerSessions]);
  const oneClickSteps = useMemo<OneClickProofStep[]>(() => [
    {
      id: "prompt",
      label: "Prompt",
      detail: learnerSource ? "Working prompt is ready." : "Paste or import one website prompt.",
      status: learnerSource ? "ready" : "blocked",
    },
    {
      id: "patch",
      label: "Patch",
      detail: promptLintFixes.length ? `${promptLintFixes.length} lint fix(es) can be applied.` : "No lint fixes needed.",
      status: promptLintFixes.length ? "active" : "ready",
    },
    {
      id: "proof",
      label: "Proof",
      detail: proofVault.length || learnerProofGallery.length ? "Proof evidence is attached." : "A notes-only proof artifact will be created.",
      status: proofVault.length || learnerProofGallery.length ? "ready" : "active",
    },
    {
      id: "export",
      label: "Export",
      detail: `${exportTargetMatrix.readyCount}/${exportTargetMatrix.rows.length} export targets are ready.`,
      status: exportTargetMatrix.readyCount >= 4 ? "ready" : "active",
    },
  ], [exportTargetMatrix.readyCount, exportTargetMatrix.rows.length, learnerProofGallery.length, learnerSource, promptLintFixes.length, proofVault.length]);
  const oneClickScore = useMemo(() => {
    const score = oneClickSteps.reduce((total, step) => total + (step.status === "ready" ? 25 : step.status === "active" ? 14 : 0), 0);
    return Math.min(100, score);
  }, [oneClickSteps]);
  const productionChecks = useMemo(() => [
    {
      label: "CI proof artifacts",
      ready: true,
      detail: "CI and Pages workflows upload smoke, visual QA, regression, API, and preview artifacts.",
    },
    {
      label: "Visual regression baseline",
      ready: true,
      detail: "Baseline JSON guards viewport size, horizontal overflow, and scroll-height ranges.",
    },
    {
      label: "Secret boundary",
      ready: true,
      detail: "Security audit keeps provider keys server-side and out of browser-visible state.",
    },
    {
      label: "Hosted smoke",
      ready: /passed|ok|local|pending/i.test(BUILD_STATUS.lastSmoke),
      detail: BUILD_STATUS.lastSmoke || "Hosted smoke metadata is populated by CI or local verification.",
    },
  ], []);
  const latestGeneratedPrompt = generatedPrompts[0];
  const latestProjectProofRun = projectProofRuns[0];
  const firstRunChecklist = useMemo(() => [
    {
      label: "Import or brief source",
      ready: Boolean(learnerSource || latestGeneratedPrompt?.prompt),
      detail: learnerSource ? "Working source prompt is loaded." : "Generate or paste a first source prompt.",
    },
    {
      label: "Generate great prompt",
      ready: Boolean(latestGeneratedPrompt?.prompt),
      detail: latestGeneratedPrompt ? `${latestGeneratedPrompt.score}/100 generated prompt is saved.` : "Use the generator so the project starts from learned taste.",
    },
    {
      label: "Run proof runner",
      ready: Boolean(latestProjectProofRun),
      detail: latestProjectProofRun ? `${latestProjectProofRun.score}/100 proof runner record exists.` : "Create a proof-run record before promoting.",
    },
    {
      label: "Corpus health label",
      ready: Boolean(corpusHealthDecision),
      detail: corpusHealthDecision ? `Current prompt is labeled ${corpusHealthDecision.label}.` : "Choose gold, watch, or quarantine.",
    },
    {
      label: "Handoff package",
      ready: exportTargetMatrix.readyCount >= 6,
      detail: `${exportTargetMatrix.readyCount}/${exportTargetMatrix.rows.length} export target(s) ready.`,
    },
  ], [corpusHealthDecision, exportTargetMatrix.readyCount, exportTargetMatrix.rows.length, latestGeneratedPrompt, latestProjectProofRun, learnerSource]);
  const ciProofLinks = useMemo(() => [
    {
      label: "GitHub Actions run",
      href: BUILD_STATUS.runId ? `https://github.com/zakiefer/prompt-atelier/actions/runs/${BUILD_STATUS.runId}` : undefined,
      detail: BUILD_STATUS.runId ? `${BUILD_STATUS.workflow} #${BUILD_STATUS.runId}${BUILD_STATUS.runAttempt ? `.${BUILD_STATUS.runAttempt}` : ""}` : "Local build; CI run id is injected during hosted workflow.",
      ready: Boolean(BUILD_STATUS.runId),
    },
    {
      label: "Hosted Pages proof",
      href: BUILD_STATUS.pagesUrl,
      detail: BUILD_STATUS.pagesUrl ? "Open the hosted workbench that CI smoke checks target." : "Pages URL not configured.",
      ready: Boolean(BUILD_STATUS.pagesUrl),
    },
    {
      label: "Latest smoke",
      href: BUILD_STATUS.runId ? `https://github.com/zakiefer/prompt-atelier/actions/runs/${BUILD_STATUS.runId}` : undefined,
      detail: BUILD_STATUS.lastSmoke || "No smoke metadata yet.",
      ready: /passed|ok|local|pending/i.test(BUILD_STATUS.lastSmoke),
    },
  ], []);
  const currentProject = useMemo<CurrentProjectSummary>(() => ({
    name: projectSnapshot?.label ?? `${activeLearningProfile.label} website prompt`,
    profileLabel: activeLearningProfile.label,
    sourceWords: countWords(learnerSource || learnerText || improvedPrompt),
    promptScore: learnerEvaluation.score || dnaScore,
    proofScore: learnerProofAction.score,
    exportReadyCount: exportTargetMatrix.readyCount,
    exportPresetCount: exportTargetMatrix.rows.length,
    proofCount: proofVault.length + learnerProofGallery.length,
    sessionCount: savedLearnerSessions.length,
    savedAt: projectSnapshot?.savedAt,
  }), [activeLearningProfile.label, dnaScore, exportTargetMatrix.readyCount, exportTargetMatrix.rows.length, improvedPrompt, learnerEvaluation.score, learnerProofAction.score, learnerProofGallery.length, learnerSource, learnerText, projectSnapshot, proofVault.length, savedLearnerSessions.length]);
  const workflowMilestones = useMemo(() => buildWorkflowMilestones({
    corpusDecision: corpusHealthDecision,
    exportReadyCount: exportTargetMatrix.readyCount,
    exportTargetCount: exportTargetMatrix.rows.length,
    latestGenerated: latestGeneratedPrompt,
    latestProofRun: latestProjectProofRun,
    proofItems: proofVault.length + learnerProofGallery.length,
    sourcePrompt: learnerSource,
  }), [corpusHealthDecision, exportTargetMatrix.readyCount, exportTargetMatrix.rows.length, latestGeneratedPrompt, latestProjectProofRun, learnerProofGallery.length, learnerSource, proofVault.length]);
  const resultGalleryItems = useMemo(() => buildResultGalleryItems({
    generatedPrompts,
    proofGallery: learnerProofGallery,
    proofRuns: projectProofRuns,
    proofVault,
  }), [generatedPrompts, learnerProofGallery, projectProofRuns, proofVault]);
  const visualRepairPlan = useMemo(() => buildVisualRepairPrompt({
    activeProfile: activeLearningProfile,
    gaps: learnerDiagnosis.gaps,
    latestResult: selectedRepairResult || resultGalleryItems[0],
    sourcePrompt: learnerSource || latestGeneratedPrompt?.prompt || improvedPrompt,
  }), [activeLearningProfile, improvedPrompt, latestGeneratedPrompt?.prompt, learnerDiagnosis.gaps, learnerSource, resultGalleryItems, selectedRepairResult]);
  const coverageGaps = useMemo(() => buildCoverageIntelligence({
    corpusRows: corpusReviewRows,
    sourcePrompt: learnerSource,
    targetPresets: targetExportPresets,
  }), [corpusReviewRows, learnerSource, targetExportPresets]);
  const exportStudioGroups = useMemo(() => buildExportStudioGroups(targetExportPresets), [targetExportPresets]);
  const projectTimelineItems = useMemo(() => buildProjectTimeline({
    corpusDecision: corpusHealthDecision,
    evalHistory,
    generatedPrompts,
    projectHistory,
    proofRuns: projectProofRuns,
    proofVault,
  }), [corpusHealthDecision, evalHistory, generatedPrompts, projectHistory, projectProofRuns, proofVault]);
  const ciProofCards = useMemo(() => buildCiProofCards(BUILD_STATUS), []);
  const mobileOperatorActions = useMemo(() => buildMobileOperatorActions({
    exportReadyCount: exportTargetMatrix.readyCount,
    generatedCount: generatedPrompts.length,
    proofCount: proofVault.length + learnerProofGallery.length + projectProofRuns.length,
    promptReady: Boolean(learnerSource || latestGeneratedPrompt?.prompt),
  }), [exportTargetMatrix.readyCount, generatedPrompts.length, latestGeneratedPrompt?.prompt, learnerProofGallery.length, learnerSource, projectProofRuns.length, proofVault.length]);
  const projectStages = useMemo<ProjectStage[]>(() => [
    {
      id: "import",
      label: "Import",
      status: learnerSource || importFrontDoorItems.some((item) => item.status === "ready") ? "ready" : "active",
      detail: learnerSource ? `${countWords(learnerSource)} words loaded.` : "Start with a strong prompt or drop files into the import door.",
      cta: learnerSource ? "Review source" : "Open import",
    },
    {
      id: "compose",
      label: "Improve",
      status: promptLintFixes.length ? "active" : learnerSource ? "ready" : "watch",
      detail: promptLintFixes.length ? `${promptLintFixes.length} fix(es) can sharpen the prompt.` : "Revision and learned style are ready.",
      cta: "Open compose",
    },
    {
      id: "review",
      label: "Prove",
      status: proofVault.length || learnerProofGallery.length ? "ready" : "active",
      detail: proofVault.length || learnerProofGallery.length ? `${proofVault.length + learnerProofGallery.length} proof item(s) attached.` : "Add screenshot or proof notes before promotion.",
      cta: "Open proof",
    },
    {
      id: "export",
      label: "Export",
      status: exportTargetMatrix.readyCount >= 6 ? "ready" : "active",
      detail: `${exportTargetMatrix.readyCount}/${exportTargetMatrix.rows.length} export targets are ready.`,
      cta: "Package files",
    },
  ], [exportTargetMatrix.readyCount, exportTargetMatrix.rows.length, importFrontDoorItems, learnerProofGallery.length, learnerSource, promptLintFixes.length, proofVault.length]);
  const proofChecklist = useMemo<ProofChecklistItem[]>(() => [
    {
      id: "desktop-mobile",
      label: "Desktop and mobile screenshots",
      ready: proofVault.some((item) => /desktop|mobile|screenshot/i.test(`${item.screenshotNotes} ${item.notes}`)) || learnerProofGallery.length > 0,
      detail: "Capture first viewport proof with no blank media, clipping, or horizontal overflow.",
      target: "review",
    },
    {
      id: "console-health",
      label: "Console and media health",
      ready: /visual|smoke|console|media/i.test(BUILD_STATUS.lastSmoke) || learnerProofAction.ready.some((item) => /smoke|console|media/i.test(item)),
      detail: "Prove the build has no relevant console errors, request failures, or missing media.",
      target: "review",
    },
    {
      id: "acceptance-gates",
      label: "Acceptance gates",
      ready: /verify|qa|screenshot|build|lint|playwright/i.test(learnerSource || improvedPrompt),
      detail: "The prompt should name the exact QA commands or rendered checks expected.",
      target: "compose",
    },
    {
      id: "export-proof",
      label: "Proof travels with export",
      ready: exportTargetMatrix.readyCount >= 6 && (proofVault.length > 0 || learnerProofGallery.length > 0),
      detail: "Export packages should carry proof references and target-specific acceptance notes.",
      target: "export",
    },
  ], [exportTargetMatrix.readyCount, improvedPrompt, learnerProofAction.ready, learnerProofGallery.length, learnerSource, proofVault, BUILD_STATUS.lastSmoke]);
  const qualityReportRows = useMemo<PromptQualityReportItem[]>(() => {
    const dimensions: PromptQualityReportItem[] = dnaExplanation.dimensions.slice(0, 4).map((dimension) => ({
      label: dimension.label,
      score: dimension.score,
      status: dimension.score >= 85 ? "strong" as const : dimension.score >= 60 ? "watch" as const : "missing" as const,
      detail: dimension.why,
    }));
    const proofScore = learnerProofAction.score;
    const proofStatus: PromptQualityReportItem["status"] = proofScore >= 85 ? "strong" : proofScore >= 50 ? "watch" : "missing";
    return [
      ...dimensions,
      {
        label: "Proof readiness",
        score: proofScore,
        status: proofStatus,
        detail: learnerProofAction.missing[0] || "Proof evidence is attached and ready for export.",
      },
    ].slice(0, 5);
  }, [dnaExplanation.dimensions, learnerProofAction.missing, learnerProofAction.score]);
  const trainingSignals = useMemo<TrainingSignal[]>(() => [
    {
      label: "Archetype",
      detail: activeLearningProfile.description,
      strength: activeLearningProfile.score,
    },
    {
      label: "Visual signature",
      detail: selectedAnalysis?.tags.slice(0, 5).join(" / ") || learnedStyleGenerator.ingredients[0]?.detail || "No dominant visual signature detected yet.",
      strength: learnerEvaluation.score || dnaScore,
    },
    {
      label: "Stack pattern",
      detail: selectedAnalysis?.stack.join(" + ") || "Stack is inferred from the working prompt and learned profile.",
      strength: selectedAnalysis?.stack.length ? 92 : 58,
    },
    {
      label: "Proof habit",
      detail: proofChecklist.filter((item) => item.ready).map((item) => item.label).join(" / ") || "Add proof before this becomes a gold example.",
      strength: Math.round((proofChecklist.filter((item) => item.ready).length / proofChecklist.length) * 100),
    },
  ], [activeLearningProfile.description, activeLearningProfile.score, dnaScore, learnedStyleGenerator.ingredients, learnerEvaluation.score, proofChecklist, selectedAnalysis]);
  const learnerProjectSystem = useMemo(
    () => buildLearnerProjectSystem({ activeProfile: activeLearningProfile, projectSpaces, savedSessions: savedLearnerSessions }),
    [activeLearningProfile, projectSpaces, savedLearnerSessions],
  );
  const flowSteps = operatingLoop.steps.map((step) => ({
    label: step.label,
    ready: step.status === "ready",
    detail: step.detail,
  }));
  const workspaceTabs: { id: "compose" | "review" | "export"; label: string; detail: string }[] = [
    { id: "compose", label: "Compose", detail: "Paste, score, brief, revise" },
    { id: "review", label: "Review", detail: "Diff, feedback, decisions" },
    { id: "export", label: "Export", detail: "Presets, sessions, proof" },
  ];
  const activeStepIndex = workspaceTabs.findIndex((tab) => tab.id === activeWorkspaceTab);
  const nextWorkspaceTab = workspaceTabs[Math.min(workspaceTabs.length - 1, activeStepIndex + 1)]?.id ?? "export";
  const interactionChecks = [
    { label: "Profile switching", ready: Boolean(activeLearningProfile.id), detail: `${activeLearningProfile.label} is active.` },
    { label: "Diff decisions", ready: acceptedDiffLabels.length > 0 || rejectedDiffLabels.length > 0, detail: `${acceptedDiffLabels.length} accepted / ${rejectedDiffLabels.length} rejected.` },
    { label: "Export pack", ready: learnerExportPack.files.filter((file) => file.ready).length >= 4, detail: `${learnerExportPack.files.filter((file) => file.ready).length}/${learnerExportPack.files.length} files ready.` },
    { label: "Session save", ready: savedLearnerSessions.length > 0, detail: savedLearnerSessions.length ? `${savedLearnerSessions.length} saved session(s).` : "Save this learner session." },
  ];
  const quarantineItems = batchAudit.items.filter((item) => item.decision === "quarantine").slice(0, 5);
  function recordActivity(label: string, detail: string, tone: LearnerActivityItem["tone"] = "neutral") {
    setLearnerActivity((items) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        label,
        detail,
        tone,
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...items,
    ].slice(0, 8));
  }
  function addEvalHistoryRecord(label: string, detail: string, override?: Partial<EvalHistoryRecord>) {
    const record: EvalHistoryRecord = {
      id: `eval-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      label,
      createdAt: new Date().toISOString(),
      promptScore: currentProject.promptScore,
      proofScore: currentProject.proofScore,
      exportReadyCount: currentProject.exportReadyCount,
      detail,
      ...override,
    };
    setEvalHistory((current) => {
      const next = [record, ...current.filter((item) => item.id !== record.id)].slice(0, 40);
      writeLocalArray(EVAL_HISTORY_KEY, next, 40);
      return next;
    });
    return record;
  }
  function applyRemoteProjectCollections(collections: {
    promptProjects: unknown[];
    projectVersions: unknown[];
    projectProofRuns: unknown[];
    generatedPrompts: unknown[];
    evalHistory: unknown[];
  }) {
    const remoteGenerated = collections.generatedPrompts as GeneratedPromptRecord[];
    const remoteProofRuns = collections.projectProofRuns as ProjectProofRunRecord[];
    const remoteHistory = collections.evalHistory as EvalHistoryRecord[];
    setGeneratedPrompts(remoteGenerated.slice(0, 24));
    setProjectProofRuns(remoteProofRuns.slice(0, 24));
    setEvalHistory(remoteHistory.slice(0, 40));
    writeLocalArray(GENERATED_PROMPTS_KEY, remoteGenerated, 24);
    writeLocalArray(PROJECT_PROOF_RUNS_KEY, remoteProofRuns, 24);
    writeLocalArray(EVAL_HISTORY_KEY, remoteHistory, 40);
    setProjectSync({
      status: "synced",
      detail: "Backend project sync is online and project records are persisted.",
      lastSyncedAt: new Date().toISOString(),
      remoteProjects: collections.promptProjects.length,
      versions: collections.projectVersions.length,
      proofRuns: remoteProofRuns.length,
      generatedPrompts: remoteGenerated.length,
    });
  }
  function handleGenerateGreatPrompt() {
    const basePrompt = learnedStyleGenerator.prompt || briefPrompt || improvedPrompt || learnerSource;
    const generated = [
      basePrompt,
      "",
      "PRODUCTION QUALITY LOCKS",
      "- Build the actual usable website experience first; do not create a marketing explanation page unless requested.",
      "- Specify stack, assets, typography, layout, responsive behavior, interaction states, and no-go rules.",
      "- Include desktop and mobile proof requirements, media checks, console health, and acceptance gates.",
      "- Keep all secrets and provider keys out of browser-visible code, prompts, screenshots, exports, and logs.",
      "",
      `LEARNED TASTE: ${activeLearningProfile.label}`,
      activeLearningProfile.rules.slice(0, 5).map((rule) => `- ${rule}`).join("\n"),
    ].filter(Boolean).join("\n");
    const record: GeneratedPromptRecord = {
      id: `generated-${Date.now()}`,
      projectId: projectSnapshot?.id || "browser-current-project",
      title: `${activeLearningProfile.label} generated prompt`,
      prompt: generated,
      score: Math.min(100, Math.max(currentProject.promptScore, learnerEvaluation.score || dnaScore) + 4),
      source: "learned-style-generator",
      createdAt: new Date().toISOString(),
    };
    setGeneratedPrompts((current) => {
      const next = [record, ...current.filter((item) => item.id !== record.id)].slice(0, 24);
      writeLocalArray(GENERATED_PROMPTS_KEY, next, 24);
      return next;
    });
    setLearnerText(generated);
    addEvalHistoryRecord("Generated prompt", "Generated a production-ready prompt from learned style and current brief.", {
      promptScore: record.score,
      proofScore: currentProject.proofScore,
    });
    recordActivity("Generated great prompt", `${record.title} saved at ${record.score}/100.`, "good");
  }
  async function handleSyncProject() {
    setProjectSync((current) => ({ ...current, status: "syncing", detail: "Syncing project records to the backend API." }));
    const snapshot = handleSaveProjectSnapshot();
    const version = {
      id: `project-version-${Date.now()}`,
      projectId: snapshot.id,
      label: snapshot.label,
      sourcePrompt: snapshot.sourcePrompt,
      improvedPrompt: snapshot.improvedPrompt || "",
      reviewedPrompt: snapshot.reviewedPrompt || "",
      profileId: snapshot.profileId,
      promptScore: snapshot.promptScore || 0,
      proofScore: snapshot.proofScore || 0,
      exportReadyCount: snapshot.exportReadyCount || 0,
      exportPresetCount: snapshot.exportPresetCount || 0,
      createdAt: new Date().toISOString(),
    };
    const evalRecord = addEvalHistoryRecord("Backend project sync", "Saved a versioned project snapshot to browser storage and attempted API sync.", {
      promptScore: snapshot.promptScore || currentProject.promptScore,
      proofScore: snapshot.proofScore || currentProject.proofScore,
      exportReadyCount: snapshot.exportReadyCount || currentProject.exportReadyCount,
    });
    try {
      const payload = await saveProjectToApi({
        project: {
          id: snapshot.id,
          title: snapshot.label,
          profileId: snapshot.profileId,
          promptScore: snapshot.promptScore || 0,
          proofScore: snapshot.proofScore || 0,
          exportReadyCount: snapshot.exportReadyCount || 0,
          proofArtifacts: snapshot.proofArtifacts.length,
          status: "active",
        },
        version,
        generatedPrompt: latestGeneratedPrompt,
        evalRecord,
        curationDecision: corpusHealthDecision,
      });
      applyRemoteProjectCollections(payload.collections);
      recordActivity("Backend project sync", `${snapshot.label} synced to API collections.`, "good");
    } catch (error) {
      setProjectSync((current) => ({
        ...current,
        status: "error",
        detail: error instanceof Error ? error.message : "Backend sync failed; browser snapshot is still saved.",
      }));
      recordActivity("Backend sync fallback", "Project is saved locally; API sync was not reachable.", "watch");
    }
  }
  async function handleRunProjectProof() {
    const proofRun: ProjectProofRunRecord = {
      id: `project-proof-${Date.now()}`,
      title: "Proof runner package",
      createdAt: new Date().toISOString(),
      score: Math.min(100, Math.round((proofChecklist.filter((item) => item.ready).length / Math.max(1, proofChecklist.length)) * 100)),
      commands: [
        "npm run lint",
        "npm run build",
        "npm run test:api",
        "npm run smoke:hosted -- --url http://127.0.0.1:4173",
        "npm run smoke:visual-regression -- --url http://127.0.0.1:4173",
      ],
      checks: proofChecklist.map((item) => ({ label: item.label, ready: item.ready, detail: item.detail })),
    };
    setProjectProofRuns((current) => {
      const next = [proofRun, ...current.filter((item) => item.id !== proofRun.id)].slice(0, 24);
      writeLocalArray(PROJECT_PROOF_RUNS_KEY, next, 24);
      return next;
    });
    const evalRecord = addEvalHistoryRecord("Proof runner", "Created a proof-run package with commands, checklist state, and acceptance gates.", {
      proofScore: proofRun.score,
    });
    recordActivity("Proof runner created", `${proofRun.score}/100 proof package saved.`, proofRun.score >= 75 ? "good" : "watch");
    try {
      const payload = await runProjectProofViaApi({ proofRun, evalRecord, projectId: projectSnapshot?.id || "browser-current-project" });
      applyRemoteProjectCollections(payload.collections);
      recordActivity("Proof runner synced", "Proof runner record persisted to API collections.", "good");
    } catch {
      recordActivity("Proof runner local", "Proof runner saved locally; API sync can happen later.", "watch");
    }
  }
  function handleCurateCurrentPrompt(label: CorpusHealthDecision["label"]) {
    const detail = label === "gold"
      ? "Use as a high-quality training example after proof passes."
      : label === "watch"
        ? "Keep visible, but require more result proof before training."
        : "Keep out of training memory until the prompt is scrubbed or proven relevant.";
    const decision: CorpusHealthDecision = {
      id: `corpus-health-${Date.now()}`,
      label,
      detail,
      createdAt: new Date().toISOString(),
    };
    setCorpusHealthDecision(decision);
    writeCorpusHealthDecision(decision);
    addEvalHistoryRecord("Corpus health controls", `Marked the current prompt ${label}.`);
    recordActivity("Corpus health label", `${label}: ${detail}`, label === "gold" ? "good" : "watch");
  }
  function handleSelectWorkflowTarget(target: LearnerWorkspaceTab) {
    setActiveWorkspaceTab(target);
    if (target === "export") setExportModalOpen(true);
    recordActivity("Workflow OS", `Opened ${target}.`, "neutral");
  }
  function handleGenerateVisualRepairPrompt(item?: ResultGalleryItem) {
    const plan = item
      ? buildVisualRepairPrompt({
          activeProfile: activeLearningProfile,
          gaps: learnerDiagnosis.gaps,
          latestResult: item,
          sourcePrompt: learnerSource || latestGeneratedPrompt?.prompt || improvedPrompt,
        })
      : visualRepairPlan;
    setVisualRepairPrompt(plan.prompt);
    writeLocalString(REPAIR_PROMPT_KEY, plan.prompt);
    addEvalHistoryRecord("Visual repair loop", `Built repair prompt with ${plan.repairs.length} target(s).`);
    recordActivity("Visual repair prompt", plan.title, "good");
  }
  function handleUseVisualRepairPrompt() {
    const prompt = visualRepairPrompt || visualRepairPlan.prompt;
    setVisualRepairPrompt(prompt);
    writeLocalString(REPAIR_PROMPT_KEY, prompt);
    setLearnerText(prompt);
    setActiveWorkspaceTab("compose");
    recordActivity("Visual repair applied", "Repair prompt is now the working prompt.", "good");
  }
  function handlePromoteResultGalleryItem(item: ResultGalleryItem) {
    handleCurateCurrentPrompt("gold");
    addEvalHistoryRecord("Result promoted", `${item.title} promoted to gold evidence.`, {
      promptScore: item.score,
      proofScore: item.proof,
    });
    recordActivity("Result promoted", `${item.title} marked gold.`, "good");
  }
  function handleMarkWeakResultGalleryItem(item: ResultGalleryItem) {
    handleCurateCurrentPrompt("watch");
    addEvalHistoryRecord("Result marked weak", `${item.title} needs repair before promotion.`, {
      promptScore: item.score,
      proofScore: item.proof,
    });
    recordActivity("Result marked weak", `${item.title} moved to repair watch.`, "watch");
  }
  function handleRepairResultGalleryItem(item: ResultGalleryItem) {
    setSelectedRepairResult(item);
    handleGenerateVisualRepairPrompt(item);
    setActiveWorkspaceTab("compose");
  }
  function handleSaveTasteProfileVersion() {
    const version = createTasteProfileVersion({
      activeProfile: activeLearningProfile,
      promptScore: currentProject.promptScore,
      proofScore: currentProject.proofScore,
      seedPrompt: learnerSource || latestGeneratedPrompt?.prompt || improvedPrompt,
    });
    setTasteProfileVersions((current) => {
      const next = [version, ...current.filter((item) => item.id !== version.id)].slice(0, 16);
      writeLocalArray(TASTE_PROFILE_VERSIONS_KEY, next, 16);
      return next;
    });
    addEvalHistoryRecord("Taste profile version", `${version.label} saved at ${version.score}/100.`, {
      promptScore: version.promptScore,
      proofScore: version.proofScore,
    });
    recordActivity("Taste version saved", `${version.label} saved.`, "good");
  }
  function handleUseTasteProfileVersion(version: TasteProfileVersion) {
    setActiveLearningProfileId(version.profileId);
    if (version.seedPrompt) setLearnerText(version.seedPrompt);
    setActiveWorkspaceTab("compose");
    recordActivity("Taste version restored", `${version.label} is active.`, "good");
  }
  function handleCopyExportStudioPreset(preset: TargetExportPreset) {
    onCopy(preset.content, `export-studio-${preset.id}`);
    recordActivity("Export studio copy", `${preset.label} copied.`, "good");
  }
  function handleSelectTimelineItem(item: TimelineItem) {
    if (item.kind === "proof") setActiveWorkspaceTab("review");
    if (item.kind === "prompt" || item.kind === "profile" || item.kind === "corpus") setActiveWorkspaceTab("compose");
    if (item.kind === "export" || item.kind === "sync") {
      setActiveWorkspaceTab("export");
      setExportModalOpen(true);
    }
    recordActivity("Timeline opened", `${item.kind}: ${item.label}`, "neutral");
  }
  function handleUseBriefPrompt() {
    onUseSamplePrompt(briefPrompt);
    recordActivity("Brief prompt applied", `${activeLearningProfile.label} brief moved into the working prompt.`, "good");
  }
  function handleApplySectionEdits(value: string) {
    setLearnerText(value);
    onSaveReviewedDiff(value);
    recordActivity("Section edits applied", "Generated section edits are now the working prompt.", "good");
  }
  function handleRecordOutcomeFeedback(rating: OutcomeRating, notes: string, screenshotUrl: string, screenshotNotes: string) {
    onRecordOutcomeFeedback(rating, notes, screenshotUrl, screenshotNotes);
    const artifact: LearnerProofVaultItem = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: screenshotNotes.split(".")[0]?.replace(/^\[[^\]]+\]\s*/, "") || "Saved proof artifact",
      rating,
      screenshotUrl,
      screenshotNotes,
      notes,
      createdAt: new Date().toISOString(),
    };
    setProofVault((current) => {
      const next = [artifact, ...current].slice(0, 24);
      writeProofVault(next);
      return next;
    });
    recordActivity("Proof saved", `${rating} result saved with ${screenshotUrl ? "visual proof" : "notes only"}.`, rating === "great" ? "good" : "watch");
  }
  function handleReviewCorpusCandidate(row: CorpusReviewRow, action: "import" | "gold" | "bad" | "quarantine" | "merge", notes: string) {
    onReviewCorpusCandidate(row, action, notes);
    recordActivity("Corpus decision", `${row.title}: ${action}.`, action === "quarantine" || action === "bad" ? "watch" : "good");
  }
  function handleExportLearnerPack() {
    onExportLearnerPack();
    recordActivity("Export pack downloaded", `${learnerExportPack.files.filter((file) => file.ready).length}/${learnerExportPack.files.length} files ready.`, "good");
  }
  function handleSaveReviewedPrompt() {
    onSaveReviewedDiff(reviewedPrompt);
    recordActivity("Reviewed prompt saved", `${acceptedDiffLabels.length} accepted / ${rejectedDiffLabels.length} rejected.`, "good");
  }
  function handleSaveLearnerSession() {
    onSaveLearnerSession(reviewedPrompt, acceptedDiffLabels, rejectedDiffLabels);
    recordActivity("Learner session saved", `${acceptedDiffLabels.length} accepted / ${rejectedDiffLabels.length} rejected.`, "good");
  }
  function handleSaveImproved() {
    onSaveImproved();
    recordActivity("Prompt revised", "Improved prompt saved from the compose step.", "good");
  }
  function handleApplyLintFix(fix: PromptLintFix) {
    const base = learnerText.trim() || learnedStyleGenerator.prompt || improvedPrompt || briefPrompt;
    setLearnerText(`${base}\n\n${fix.patch}`);
    recordActivity("Prompt lint fixed", fix.label, fix.severity === "fix" ? "good" : "watch");
  }
  function handleUseSearchResult(result: LearnerSearchResult) {
    if (result.kind === "sample") {
      const sample = samplePrompts.find((item) => `sample-${item.id}` === result.id);
      if (sample) onUseSamplePrompt(sample.prompt);
    }
    if (result.kind === "session") {
      const session = savedLearnerSessions.find((item) => `session-${item.id}` === result.id);
      if (session) onOpenLearnerSession(session);
    }
    if (result.kind === "export") {
      setActiveWorkspaceTab("export");
      setExportModalOpen(true);
    }
    if (result.kind === "proof" || result.kind === "corpus") {
      setActiveWorkspaceTab("review");
    }
    recordActivity("Workspace search", `${result.kind}: ${result.title}`, "neutral");
  }
  async function handleImportFrontDoorFiles(files: FileList | File[]) {
    const list = Array.from(files).slice(0, 12);
    const imported = await Promise.all(
      list.map(async (file, index) => {
        const text = await file.text();
        const classification = classifyImportFile(file.name, text);
        return {
          id: `${Date.now()}-${index}-${file.name}`,
          filename: file.name,
          text,
          ...classification,
        };
      }),
    );
    setImportFrontDoorItems((current) => [...imported, ...current].slice(0, 24));
    recordActivity("Import reviewed", `${imported.length} file(s) scanned before memory.`, imported.some((item) => item.status === "blocked") ? "watch" : "good");
  }
  function handleUseImportFrontDoorItem(item: ImportFrontDoorItem) {
    setLearnerText(item.text);
    setActiveWorkspaceTab("compose");
    recordActivity("Import used", `${item.filename} became the working prompt.`, item.status === "ready" ? "good" : "watch");
  }
  function handleSaveProjectSnapshot() {
    const snapshot: ProjectSnapshot = {
      id: `project-snapshot-${Date.now()}`,
      label: `${activeLearningProfile.label} prompt project`,
      savedAt: new Date().toISOString(),
      profileId: activeLearningProfile.id,
      sourcePrompt: learnerText,
      proofArtifacts: proofVault,
      improvedPrompt,
      reviewedPrompt,
      promptScore: currentProject.promptScore,
      proofScore: currentProject.proofScore,
      exportReadyCount: currentProject.exportReadyCount,
      exportPresetCount: currentProject.exportPresetCount,
    };
    writeProjectSnapshot(snapshot);
    setProjectSnapshot(snapshot);
    setProjectHistory((current) => {
      const next = [snapshot, ...current.filter((item) => item.id !== snapshot.id)].slice(0, 12);
      writeProjectHistory(next);
      return next;
    });
    recordActivity("Project snapshot saved", `${snapshot.label} saved with ${proofVault.length} proof artifact(s).`, "good");
    return snapshot;
  }
  function handleRestoreProjectSnapshot(snapshot: ProjectSnapshot) {
    setLearnerText(snapshot.sourcePrompt || snapshot.improvedPrompt || "");
    setProofVault(snapshot.proofArtifacts);
    writeProofVault(snapshot.proofArtifacts);
    writeProjectSnapshot(snapshot);
    setProjectSnapshot(snapshot);
    setActiveLearningProfileId(snapshot.profileId);
    setActiveWorkspaceTab("compose");
    recordActivity("Project snapshot restored", `${snapshot.label} restored.`, "good");
  }
  function handleSelectProjectStage(stage: ProjectStage) {
    if (stage.id === "import") {
      setActiveWorkspaceTab("compose");
      recordActivity("Project stage opened", "Import tools are available in the compose workspace.", "neutral");
      return;
    }
    setActiveWorkspaceTab(stage.id);
    if (stage.id === "export") setExportModalOpen(true);
    recordActivity("Project stage opened", `${stage.label}: ${stage.cta}.`, stage.status === "ready" ? "good" : "neutral");
  }
  function handleSelectProofChecklistItem(item: ProofChecklistItem) {
    setActiveWorkspaceTab(item.target);
    if (item.target === "export") setExportModalOpen(true);
    recordActivity("Proof checklist opened", `${item.label}: ${item.ready ? "ready" : "needs proof"}.`, item.ready ? "good" : "watch");
  }
  function handleLearnFromPromptSignal() {
    onSaveLearnerSession(reviewedPrompt, acceptedDiffLabels, rejectedDiffLabels);
    const snapshot = handleSaveProjectSnapshot();
    recordActivity("Training signal saved", `${snapshot.label} saved as a restorable learning run.`, "good");
  }
  function handleSelectProofLeaderboardRow(row: ProofLeaderboardRow) {
    if (row.id.startsWith("session-")) {
      const session = savedLearnerSessions.find((item) => `session-${item.id}` === row.id);
      if (session) onOpenLearnerSession(session);
    }
    setActiveWorkspaceTab(row.kind === "session" ? "export" : "review");
    recordActivity("Proof leaderboard", `${row.title} selected at ${row.score}/100.`, row.score >= 80 ? "good" : "neutral");
  }
  function handleRunOneClickProofPath() {
    const base = learnerText.trim() || learnedStyleGenerator.prompt || improvedPrompt || briefPrompt;
    const patches = promptLintFixes.map((fix) => fix.patch).filter((patch) => !base.includes(patch));
    const patchedPrompt = [base, ...patches].filter(Boolean).join("\n\n");
    if (patchedPrompt && patchedPrompt !== learnerText) {
      setLearnerText(patchedPrompt);
    }
    onSaveImproved();
    onSaveLearnerSession(reviewedPrompt, acceptedDiffLabels, rejectedDiffLabels);
    handleRecordOutcomeFeedback(
      "great",
      "Guided path created a proof placeholder. Replace with real screenshot notes after the build runs.",
      "",
      "Guided proof placeholder: run desktop/mobile screenshots before promoting this prompt to gold.",
    );
    setActiveWorkspaceTab("export");
    setExportModalOpen(true);
    recordActivity("Guided path completed", "Patched, revised, saved proof, saved session, and opened export.", "good");
  }
  return (
    <div className="learn-grid">
      <section className="panel public-learner-panel" data-train-section="public-learner">
        <div className="output-header">
          <div>
            <p className="eyebrow">Prompt workspace</p>
            <h2>Paste, score, improve, battle, prove, export.</h2>
            <p>Start with one excellent website prompt and turn the learned patterns into a stronger build prompt without opening the lab.</p>
          </div>
          <ScoreRing score={learnerEvaluation.score || dnaScore} label="Strength" />
        </div>

        <ProjectCockpitPanel
          activeStage={activeWorkspaceTab}
          onRunOneClick={handleRunOneClickProofPath}
          onSaveProject={handleSaveProjectSnapshot}
          onSelectStage={handleSelectProjectStage}
          project={currentProject}
          stages={projectStages}
        />

        <div className="guided-product-grid workflow-top-grid">
          <WorkflowOsPanel milestones={workflowMilestones} onRunFullPath={handleRunOneClickProofPath} onSelectTarget={handleSelectWorkflowTarget} />
          <MobileOperatorPanel actions={mobileOperatorActions} onSelectTarget={handleSelectWorkflowTarget} />
        </div>

        <div className="guided-product-grid production-path-grid">
          <ProductionCommandCenterPanel
            checklist={firstRunChecklist}
            ciLinks={ciProofLinks}
            corpusDecision={corpusHealthDecision}
            generatedPrompt={latestGeneratedPrompt?.prompt}
            onCurate={handleCurateCurrentPrompt}
            onGenerate={handleGenerateGreatPrompt}
            onRunProof={handleRunProjectProof}
            onSync={handleSyncProject}
            proofRun={latestProjectProofRun}
            sync={projectSync}
          />
          <EvalHistoryCompactPanel history={evalHistory} />
        </div>

        <details className="learner-tools-drawer product-intelligence-drawer" data-train-section="product-intelligence">
          <summary>
            <span>Product intelligence</span>
            <strong>Gallery, repair, coverage, exports, timeline, taste, and CI proof</strong>
          </summary>
          <div className="learner-tools-stack">
            <div className="self-serve-grid product-intelligence-grid">
              <ResultGalleryPanel
                items={resultGalleryItems}
                onMarkWeak={handleMarkWeakResultGalleryItem}
                onPromote={handlePromoteResultGalleryItem}
                onRepair={handleRepairResultGalleryItem}
              />
              <VisualRepairLoopPanel
                copied={copied}
                onCopy={onCopy}
                onGenerateRepair={handleGenerateVisualRepairPrompt}
                onUseRepair={handleUseVisualRepairPrompt}
                repairPrompt={visualRepairPrompt}
                repairs={visualRepairPlan.repairs}
                title={visualRepairPlan.title}
              />
            </div>
            <div className="self-serve-grid product-intelligence-grid">
              <CoverageIntelligencePanel gaps={coverageGaps} />
              <ExportStudioPanel copied={copied} groups={exportStudioGroups} onCopyPreset={handleCopyExportStudioPreset} onOpenExport={() => setExportModalOpen(true)} />
            </div>
            <div className="self-serve-grid product-intelligence-grid">
              <ProjectTimelinePanel items={projectTimelineItems} onSelectItem={handleSelectTimelineItem} />
              <TasteProfileVersionsPanel versions={tasteProfileVersions} onSaveVersion={handleSaveTasteProfileVersion} onUseVersion={handleUseTasteProfileVersion} />
            </div>
            <CiProofStatusPanel cards={ciProofCards} />
          </div>
        </details>

        <div className="guided-product-grid">
          <LearnerCommandDeck
            activeTab={activeWorkspaceTab}
            currentAction={operatingLoop.currentAction}
            latestSession={savedLearnerSessions[0]}
            onOpenLatest={onOpenLearnerSession}
            onSetTab={setActiveWorkspaceTab}
            steps={operatingLoop.steps}
            stats={{
              exportReadyCount: exportTargetMatrix.readyCount,
              presetCount: targetExportPresets.length,
              proofItems: learnerProofGallery.length,
              proofScore: learnerProofAction.score,
              promptScore: learnerEvaluation.score || dnaScore,
              sessions: savedLearnerSessions.length,
            }}
          />
          <ProofRunnerChecklistPanel items={proofChecklist} onSelectItem={handleSelectProofChecklistItem} />
        </div>

        <div className="guided-product-grid">
          <OneClickProofRail onRun={handleRunOneClickProofPath} score={oneClickScore} steps={oneClickSteps} />
          <PromptQualityReportPanel
            items={qualityReportRows}
            onImprove={handleSaveImproved}
            score={learnerEvaluation.score || dnaScore}
            summary={dnaExplanation.summary[0] ?? "Quality report is based on prompt strength, proof readiness, and export safety."}
          />
        </div>

        <div className="guided-product-grid">
          <BeginnerPromptPath onUseBriefPrompt={handleUseBriefPrompt} score={learnerEvaluation.score || dnaScore} />
          <TrainingImpactPanel onLearn={handleLearnFromPromptSignal} signals={trainingSignals} />
        </div>

        <details className="learner-tools-drawer" data-train-section="advanced-workspace-tools">
          <summary>
            <span>Workspace tools</span>
            <strong>Search, imports, lint fixes, and snapshots</strong>
          </summary>
          <div className="learner-tools-stack">
            <div className="self-serve-grid cockpit-tool-grid">
              <LearnerWorkspaceSearchPanel results={workspaceSearchResults} onUseResult={handleUseSearchResult} />
              <PromptLintFixPanel fixes={promptLintFixes} onApplyFix={handleApplyLintFix} />
            </div>

            <div className="self-serve-grid cockpit-tool-grid">
              <ImportFrontDoorPanel items={importFrontDoorItems} onFiles={handleImportFrontDoorFiles} onUseItem={handleUseImportFrontDoorItem} />
              <ProjectPersistencePanel
                activeSnapshot={projectSnapshot}
                copied={copied}
                onCopy={onCopy}
                onRestore={handleRestoreProjectSnapshot}
                onSave={handleSaveProjectSnapshot}
              />
            </div>

            <ProjectHistoryPanel history={projectHistory} onRestore={handleRestoreProjectSnapshot} />
          </div>
        </details>

        <details className="learner-tools-drawer learner-insight-drawer" data-train-section="supporting-prompt-intelligence">
          <summary>
            <span>Supporting intelligence</span>
            <strong>Diagnosis, project memory, proof hints, and style profiles</strong>
          </summary>
          <div className="learner-tools-stack">
            <section className="learner-operating-loop" aria-label="Prompt operating loop" data-train-section="prompt-operating-loop">
              <div className="loop-summary">
                <div>
                  <span>Operating loop</span>
                  <strong>Paste, score, improve, battle, prove, export</strong>
                  <p>{operatingLoop.currentAction}</p>
                </div>
                <ScoreRing score={operatingLoop.score} label="loop" />
              </div>
              <div className="loop-step-grid">
                {operatingLoop.steps.map((step) => (
                  <button
                    data-status={step.status}
                    key={step.id}
                    type="button"
                    onClick={() => setActiveWorkspaceTab(step.target)}
                  >
                    <span>{step.label}</span>
                    <strong>{step.status === "ready" ? "Ready" : step.status === "active" ? "Do next" : "Later"}</strong>
                    <p>{step.detail}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="learner-proof-action" data-status={learnerProofAction.status} data-train-section="proof-first-action">
              <div>
                <span>Proof-first action</span>
                <strong>{learnerProofAction.title}</strong>
                <p>{learnerProofAction.detail}</p>
              </div>
              <ScoreRing score={learnerProofAction.score} label={learnerProofAction.status} />
              <div className="proof-action-list">
                <small>Ready: {learnerProofAction.ready.join(" / ") || "No proof signal yet"}</small>
                <small>Next: {learnerProofAction.missing[0] || "Package this evidence into the export"}</small>
              </div>
              <button
                className="primary-button compact-button"
                type="button"
                onClick={() => setActiveWorkspaceTab(learnerProofAction.status === "ready" ? "export" : "review")}
              >
                {learnerProofAction.cta}
              </button>
            </section>

            <section className="learner-diagnosis-strip" data-train-section="prompt-diagnosis">
              <article>
                <span>Diagnosis</span>
                <strong>{learnerDiagnosis.confidence.label}</strong>
                <p>{learnerDiagnosis.confidence.detail}</p>
              </article>
              <article>
                <span>Next rewrite</span>
                <strong>{learnerDiagnosis.rewriteMoves[0] ?? "Tighten the prompt"}</strong>
                <p>{learnerDiagnosis.gaps[0] ?? "No major missing ingredient detected."}</p>
              </article>
              <article>
                <span>Nearest gold</span>
                <strong>{learnerDiagnosis.closestGold[0] ?? "Add gold examples"}</strong>
                <p>{learnerDiagnosis.closestGold.slice(1, 3).join(" / ") || "Closest examples appear here after import."}</p>
              </article>
            </section>

            <section className="learner-project-system" data-status={learnerProjectSystem.status} data-train-section="project-system">
              <div className="project-system-copy">
                <span>Project memory</span>
                <strong>{learnerProjectSystem.headline}</strong>
                <p>{learnerProjectSystem.detail}</p>
              </div>
              <div className="project-system-grid">
                {learnerProjectSystem.rows.map((row) => (
                  <article data-status={row.status} key={row.label}>
                    <strong>{row.count}</strong>
                    <span>{row.label}</span>
                    <p>{row.detail}</p>
                  </article>
                ))}
              </div>
              <FeedbackList title="Policy" items={learnerProjectSystem.policy} empty="No project policy." />
            </section>

            <div className="profile-strip" aria-label="Learning profiles">
              {learningProfiles.slice(0, 8).map((learningProfile) => (
                <button
                  className={learningProfile.id === activeLearningProfile.id ? "profile-chip active" : "profile-chip"}
                  key={learningProfile.id}
                  type="button"
                  onClick={() => setActiveLearningProfileId(learningProfile.id)}
                >
                  <strong>{learningProfile.label}</strong>
                  <span>{learningProfile.examples} examples / {learningProfile.score}%</span>
                </button>
              ))}
            </div>

            <section className="style-profile-board" data-train-section="style-profiles">
              <div className="output-header">
                <div>
                  <h3>Style profiles</h3>
                  <p>Choose the prompt taste the learner should emphasize before export.</p>
                </div>
                <span className="selected-meta">{activeLearningProfile.label}</span>
              </div>
              <div className="style-profile-grid">
                {styleProfileCards.slice(0, 4).map((card) => (
                  <button className="style-profile-card" data-active={card.active ? "true" : "false"} key={card.id} type="button" onClick={() => setActiveLearningProfileId(card.id)}>
                    <strong>{card.label}</strong>
                    <span>{card.examples} examples / {card.score}%</span>
                    <p>{card.emphasis}</p>
                    <small>{card.exportVoice}</small>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </details>

        <nav className="learner-jump-nav" aria-label="Guided learner sections" data-train-section="guided-first-run">
          {workspaceTabs.map((tab, index) => (
            <button
              data-active={activeWorkspaceTab === tab.id ? "true" : "false"}
              key={tab.id}
              type="button"
              onClick={() => setActiveWorkspaceTab(tab.id)}
            >
              <span>{index + 1}</span>
              <strong>{tab.label}</strong>
              <small>{tab.detail}</small>
            </button>
          ))}
        </nav>

        <section className="learner-run-guide" data-train-section="one-prompt-run">
          <div>
            <strong>One prompt run</strong>
            <p>{workspaceTabs[activeStepIndex]?.detail ?? "Move through the prompt workflow."}</p>
          </div>
          <div className="run-step-track" aria-label="Prompt run progress">
            {workspaceTabs.map((tab, index) => (
              <span data-active={index <= activeStepIndex ? "true" : "false"} key={tab.id}>{tab.label}</span>
            ))}
          </div>
          <button
            className="primary-button compact-button"
            type="button"
            onClick={() => activeWorkspaceTab === "export" ? setExportModalOpen(true) : setActiveWorkspaceTab(nextWorkspaceTab)}
          >
            {activeWorkspaceTab === "export" ? "Export center" : `Next: ${workspaceTabs[activeStepIndex + 1]?.label ?? "Export"}`}
          </button>
        </section>

        <section className="learner-battle-strip" data-status={learnerBattleSummary.status} data-train-section="prompt-battle-flow">
          <div>
            <span>Prompt battle</span>
            <strong>{learnerBattleSummary.winnerTitle}</strong>
            <p>{learnerBattleSummary.why[0]}</p>
          </div>
          <ScoreRing score={learnerBattleSummary.winnerScore} label="winner" />
          <div className="battle-variant-row">
            {learnerBattleSummary.variants.slice(0, 3).map((variant) => (
              <article key={variant.title}>
                <strong>{variant.score}</strong>
                <span>{variant.title}</span>
                <small>{variant.trait}</small>
              </article>
            ))}
          </div>
          <button className="ghost-button compact-button" type="button" onClick={onSaveBattleWinner}>
            <Trophy size={15} />
            {learnerBattleSummary.cta}
          </button>
        </section>

        <div className="learner-tab-panel" data-active={activeWorkspaceTab === "compose" ? "true" : "false"} hidden={activeWorkspaceTab !== "compose"}>
        <div className="learner-flow-grid" id="learner-paste">
          <div className="learner-input-card">
            <Field label="Prompt to learn from">
              <textarea
                value={learnerText}
                onChange={(event) => setLearnerText(event.target.value)}
                placeholder={selectedPrompt?.text || "Paste a website prompt here..."}
              />
            </Field>
            <div className="safe-check-grid learner-step-grid">
              {flowSteps.map((step) => (
                <article className="safe-check" key={step.label} data-ready={step.ready ? "true" : "false"}>
                  <strong>{step.ready ? "Ready" : "Next"}</strong>
                  <span>{step.label}</span>
                  <p>{step.detail}</p>
                </article>
              ))}
            </div>
            <div className="sample-gallery">
              <div className="output-header">
                <h3>Try sample prompts</h3>
                <span className="selected-meta">Public gallery</span>
              </div>
              {samplePrompts.slice(0, 4).map((sample) => (
                <button className="sample-card" key={sample.id} type="button" onClick={() => onUseSamplePrompt(sample.prompt)}>
                  <strong>{sample.title}</strong>
                  <span>{sample.archetype} / {sample.score}%</span>
                  <small>{sample.tags.slice(0, 3).join(" / ")}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="learner-output-card" id="learner-revise">
            <div className="output-header">
              <h3>Prompt revision</h3>
              <div className="button-row">
                <button className="primary-button compact-button" type="button" onClick={handleSaveImproved}>
                  Revise prompt
                </button>
                <button className="ghost-button compact-button" type="button" onClick={onCopyImproved}>
                  {copied === "learner-improved" ? <Check size={15} /> : <Copy size={15} />}
                  Copy
                </button>
                <button className="ghost-button compact-button" type="button" onClick={handleSaveImproved}>
                  <Save size={15} />
                  Save
                </button>
              </div>
            </div>
            <textarea className="generated-output learner-output" readOnly value={improvedPrompt} />
            <FeedbackList title="Top 3 fixes" items={learnerEvaluation.upgrades.slice(0, 3)} empty="No major gaps detected." />
          </div>
        </div>

        <details className="learner-tools-drawer compact-compose-drawer" data-train-section="brief-builder">
          <summary>
            <span>Make me a prompt</span>
            <strong>Structured brief builder</strong>
          </summary>
          <div className="learner-tools-stack">
        <section className="learner-mini-panel" id="learner-score">
          <div className="output-header">
            <div>
              <h3>Make me a prompt</h3>
              <span className="selected-meta">Brief builder</span>
              <p>Generate a fresh implementation-ready prompt from structured choices instead of a blank textarea.</p>
            </div>
            <button className="primary-button compact-button" type="button" onClick={handleUseBriefPrompt}>
              Use brief prompt
            </button>
          </div>
          <div className="brief-builder-grid">
            {([
              ["brandName", "Brand"],
              ["siteType", "Site type"],
              ["audience", "Audience"],
              ["stack", "Stack"],
              ["visualSignature", "Visual signature"],
              ["assets", "Assets"],
              ["motion", "Motion"],
              ["constraints", "Constraints"],
              ["qa", "QA"],
            ] as const).map(([key, label]) => (
              <Field label={label} key={key}>
                {key === "visualSignature" || key === "assets" || key === "motion" || key === "constraints" || key === "qa" ? (
                  <textarea
                    className="compact-textarea"
                    value={briefInput[key]}
                    onChange={(event) => setBriefInput((current) => ({ ...current, [key]: event.target.value }))}
                  />
                ) : (
                  <input value={briefInput[key]} onChange={(event) => setBriefInput((current) => ({ ...current, [key]: event.target.value }))} />
                )}
              </Field>
            ))}
          </div>
          <div className="learned-style-generator" data-ready={learnedStyleGenerator.ready ? "true" : "false"} data-train-section="learned-style-generator">
            <div className="generator-copy">
              <span><Sparkles size={14} /> Generate from learned style</span>
              <strong>{learnedStyleGenerator.headline}</strong>
              <p>{learnedStyleGenerator.detail}</p>
              <div className="button-row compact-row">
                <button className="primary-button compact-button" type="button" onClick={() => {
                  onUseSamplePrompt(learnedStyleGenerator.prompt);
                  recordActivity("Style prompt applied", `${activeLearningProfile.label} generator moved into the working prompt.`, "good");
                }}>
                  Use style prompt
                  <ArrowRight size={14} />
                </button>
                <button className="ghost-button compact-button" type="button" onClick={() => onCopy(learnedStyleGenerator.prompt, "learned-style-generator")}>
                  {copied === "learned-style-generator" ? <Check size={15} /> : <Copy size={15} />}
                  Copy
                </button>
              </div>
            </div>
            <div className="generator-ingredients">
              {learnedStyleGenerator.ingredients.map((ingredient) => (
                <article key={ingredient.label}>
                  <span>{ingredient.label}</span>
                  <p>{ingredient.detail}</p>
                </article>
              ))}
            </div>
          </div>
          <textarea className="generated-output mini-output learned-style-output" readOnly value={learnedStyleGenerator.prompt} />
          <details className="learner-tools-drawer compact-compose-drawer" data-train-section="generated-section-drawer">
            <summary>
              <span>Generated sections</span>
              <strong>Edit sections and inspect raw brief output</strong>
            </summary>
            <div className="learner-tools-stack">
              <LearnedPromptSectionEditor copied={copied} onApplyPrompt={handleApplySectionEdits} onCopy={onCopy} sections={learnedPromptSections} />
              <textarea className="generated-output mini-output" readOnly value={briefPrompt} />
            </div>
          </details>
          <div className="button-row">
            <button className="ghost-button compact-button" type="button" onClick={() => onCopy(briefPrompt, "brief-builder")}>
              {copied === "brief-builder" ? <Check size={15} /> : <Copy size={15} />}
              Copy brief
            </button>
            <button className="ghost-button compact-button" type="button" onClick={() => setBriefInput(createEmptyLearnerBriefInput(activeLearningProfile))}>
              Reset fields
            </button>
          </div>
        </section>
          </div>
        </details>

        <details className="learner-tools-drawer compact-compose-drawer" data-train-section="compose-diagnostics-drawer">
          <summary>
            <span>Compose diagnostics</span>
            <strong>Prompt diagnosis, strength gaps, and similar prompts</strong>
          </summary>
          <div className="learner-tools-stack">
            <div className="self-serve-grid">
              <article className="learner-mini-panel">
                <div className="output-header">
                  <div>
                    <h3>Prompt diagnosis</h3>
                    <p>What is working, what is missing, and what to rewrite next.</p>
                  </div>
                  <ScoreRing score={learnerDiagnosis.confidence.score} label={learnerDiagnosis.confidence.label} />
                </div>
                <FeedbackList title="Strengths" items={learnerDiagnosis.strengths} empty="No strengths detected yet." />
                <FeedbackList title="Missing ingredients" items={learnerDiagnosis.gaps} empty="No major gaps detected." />
                <FeedbackList title="Rewrite moves" items={learnerDiagnosis.rewriteMoves} empty="No rewrite moves available." />
                <div className="quality-explainer" data-train-section="quality-explanation">
                  <div>
                    <span>Text score</span>
                    <strong>{learnerEvaluation.score}</strong>
                    <p>Prompt structure, specificity, constraints, and implementation clarity.</p>
                  </div>
                  <div>
                    <span>Proof score</span>
                    <strong>{learnerProofAction.score}</strong>
                    <p>{learnerProofAction.ready.length ? learnerProofAction.ready.join(" / ") : learnerProofAction.missing[0]}</p>
                  </div>
                  <div>
                    <span>Confidence</span>
                    <strong>{learnerDiagnosis.confidence.score}</strong>
                    <p>{learnerDiagnosis.confidence.detail}</p>
                  </div>
                </div>
                <div className="mini-stat-row">
                  {dnaExplanation.dimensions.slice(0, 4).map((dimension) => (
                    <span key={dimension.key}>{dimension.label}: {dimension.score}</span>
                  ))}
                </div>
              </article>

              <article className="learner-mini-panel">
                <div className="output-header">
                  <h3>Learning profile</h3>
                  <ScoreRing score={activeLearningProfile.score} label="Profile" />
                </div>
                <p>{activeLearningProfile.description}</p>
                <div className="chips">
                  {activeLearningProfile.rules.slice(0, 5).map((rule) => (
                    <span key={rule}>{rule}</span>
                  ))}
                </div>
              </article>
            </div>

            <div className="self-serve-grid">
              <article className="learner-mini-panel" data-train-section="strength-rewrite-plan">
                <div className="output-header">
                  <h3>Strength gap plan</h3>
                  <span className="selected-meta">Exact rewrite moves</span>
                </div>
                <div className="version-list compact-list">
                  {dnaRewrites.map((rewrite) => (
                    <article className="version-card" key={rewrite.key}>
                      <strong>{rewrite.label}: {rewrite.score}/100</strong>
                      <p>{rewrite.why}</p>
                      <small>{rewrite.rewrite}</small>
                    </article>
                  ))}
                </div>
              </article>

              <article className="learner-mini-panel" data-train-section="corpus-neighbors">
                <div className="output-header">
                  <h3>Learned from similar prompts</h3>
                  <span className="selected-meta">{corpusNeighbors.length} matches</span>
                </div>
                <div className="version-list compact-list">
                  {corpusNeighbors.slice(0, 4).map((neighbor) => (
                    <article className="version-card" key={neighbor.id}>
                      <strong>{neighbor.title}</strong>
                      <span>{neighbor.score}% / {neighbor.words} words</span>
                      <p>{neighbor.reasons.slice(0, 2).join(" / ")}</p>
                      <small>{neighbor.tags.slice(0, 4).join(" / ")}</small>
                    </article>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </details>
        </div>

        <div className="learner-tab-panel" data-active={activeWorkspaceTab === "review" ? "true" : "false"} hidden={activeWorkspaceTab !== "review"}>
        <section className="learner-mini-panel" data-train-section="prompt-diff-editor" id="learner-compare">
          <div className="output-header">
            <div>
              <h3>Prompt diff editor</h3>
              <p>Accept or reject section-level gains before saving the reviewed prompt.</p>
            </div>
            <ScoreRing score={learnerDiff?.similarity ?? 0} label="similar" />
          </div>
          <div className="diff-action-grid">
            {diffCategories.map((category) => (
              <article className="diff-card" key={String(category.key)} data-decision={diffDecisions[String(category.key)] || "open"}>
                <strong>{category.label}</strong>
                <p>Gained: {category.rightOnly.slice(0, 4).join(", ") || "none"}</p>
                <p>Shared: {category.shared.slice(0, 3).join(", ") || "none"}</p>
                <div className="button-row compact-row">
                  <button className="ghost-button compact-button" type="button" onClick={() => setDiffDecisions((current) => ({ ...current, [String(category.key)]: "accepted" }))}>Accept</button>
                  <button className="ghost-button compact-button" type="button" onClick={() => setDiffDecisions((current) => ({ ...current, [String(category.key)]: "rejected" }))}>Reject</button>
                </div>
              </article>
            ))}
          </div>
          <div className="button-row">
            <button className="ghost-button compact-button" type="button" onClick={() => onCopy(reviewedPrompt, "reviewed-diff")}>
              {copied === "reviewed-diff" ? <Check size={15} /> : <Copy size={15} />}
              Copy reviewed
            </button>
            <button className="primary-button compact-button" type="button" onClick={handleSaveReviewedPrompt}>
              <Save size={15} />
              Save reviewed prompt
            </button>
            <button className="primary-button compact-button" data-learner-action="save-session" type="button" onClick={handleSaveLearnerSession}>
              <Save size={15} />
              Save learner session
            </button>
          </div>
        </section>

        <section className="learner-mini-panel proof-plan-card" data-status={learnerProofPlan.status} data-train-section="proof-learning-plan">
          <div className="output-header">
            <div>
              <h3>Proof learning plan</h3>
              <p>{learnerProofPlan.headline}: {learnerProofPlan.nextAction}</p>
            </div>
            <span className="selected-meta">{learnerProofPlan.status}</span>
          </div>
          <div className="proof-plan-grid">
            {learnerProofPlan.items.map((item) => (
              <article className="safe-check" key={item.label} data-ready={item.ready ? "true" : "false"}>
                <strong>{item.ready ? "Ready" : "Next"}</strong>
                <span>{item.label}</span>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <ProofIntakePanel onRecordOutcomeFeedback={handleRecordOutcomeFeedback} />

        <ProofArtifactVault artifacts={proofVault} copied={copied} onCopy={onCopy} />

        <ProofQualityLeaderboardPanel rows={proofLeaderboardRows} onSelectRow={handleSelectProofLeaderboardRow} />

        <section className="learner-mini-panel ingestion-safety-panel" data-status={ingestionSummary.status} data-train-section="ingestion-safety">
          <div className="output-header">
            <div>
              <h3>Ingestion safety</h3>
              <p>{ingestionSummary.headline}: {ingestionSummary.detail}</p>
            </div>
            <span className="selected-meta">{ingestionSummary.status}</span>
          </div>
          <div className="ingestion-row-grid">
            {ingestionSummary.rows.slice(0, 4).map((row) => (
              <article key={row.title} data-label={row.label}>
                <strong>{row.label}</strong>
                <span>{row.title} / {row.score}%</span>
                <p>{row.reason}</p>
              </article>
            ))}
          </div>
          <FeedbackList title="Import actions" items={ingestionSummary.actions} empty="No import actions." />
        </section>

        <section className="learner-mini-panel" data-train-section="outcome-feedback-loop" id="learner-feedback">
          <div className="output-header">
            <div>
              <h3>Outcome feedback loop</h3>
              <p>Record how the built result performed so prompt strength learns from actual output, not only static text.</p>
            </div>
            <button
              className="primary-button compact-button"
              type="button"
              onClick={() => handleRecordOutcomeFeedback(outcomeRating, outcomeNotes, outcomeScreenshotUrl, outcomeScreenshotNotes)}
            >
              Save feedback
            </button>
          </div>
          <div className="feedback-form-grid">
            <Field label="Result rating">
              <select value={outcomeRating} onChange={(event) => setOutcomeRating(event.target.value as OutcomeRating)}>
                <option value="great">Great</option>
                <option value="okay">Okay</option>
                <option value="bad">Bad</option>
                <option value="unrated">Unrated</option>
              </select>
            </Field>
            <Field label="Screenshot URL">
              <input value={outcomeScreenshotUrl} onChange={(event) => setOutcomeScreenshotUrl(event.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Result notes">
              <textarea className="compact-textarea" value={outcomeNotes} onChange={(event) => setOutcomeNotes(event.target.value)} />
            </Field>
            <Field label="Screenshot notes">
              <textarea className="compact-textarea" value={outcomeScreenshotNotes} onChange={(event) => setOutcomeScreenshotNotes(event.target.value)} />
            </Field>
          </div>
        </section>
        </div>

        <div className="learner-tab-panel" data-active={activeWorkspaceTab === "export" ? "true" : "false"} hidden={activeWorkspaceTab !== "export"}>
        <section className="learner-mini-panel export-hub">
          <div className="output-header">
            <div>
              <h3>Export center</h3>
              <p>Presets, sessions, corpus review, and proof live in one focused dialog instead of stretching the workspace.</p>
            </div>
            <button className="primary-button compact-button" data-learner-action="open-export-modal" type="button" onClick={() => setExportModalOpen(true)}>
              <Download size={15} />
              Open export center
            </button>
          </div>
          <div className="export-summary-grid">
            <article>
              <strong>{targetExportPresets.length}</strong>
              <span>target presets</span>
            </article>
            <article>
              <strong>{savedLearnerSessions.length}</strong>
              <span>saved sessions</span>
            </article>
            <article>
              <strong>{learnerProofGallery.length}</strong>
              <span>proof items</span>
            </article>
          </div>
          <div className="learner-export-readiness">
            <article data-status={corpusSafety.label}>
              <strong>Corpus safety</strong>
              <span>{corpusSafety.detail}</span>
              <small>{corpusSafety.counts.website} website / {corpusSafety.counts.maybe} review / {corpusSafety.counts.quarantine} quarantine</small>
            </article>
            <article data-status={regressionSummary.label}>
              <strong>Regression guard</strong>
              <span>{regressionSummary.detail}</span>
              <small>{regressionSummary.score}/100 holdout score</small>
            </article>
          </div>
        </section>
        <ProofDeployStatusPanel status={proofDeployStatus} />
        <ProductChangelogPanel
          items={changelogItems}
          status={{ label: BUILD_STATUS.workflow || "local", detail: `Latest smoke: ${BUILD_STATUS.lastSmoke}` }}
        />
        <ProductionHardeningPanel checks={productionChecks} copied={copied} onCopy={onCopy} />
        <ExportDeliverablesPanel onOpenExport={() => setExportModalOpen(true)} presets={targetExportPresets} />
        <section className="learner-mini-panel export-target-matrix" data-train-section="export-target-matrix">
          <div className="output-header">
            <div>
              <h3>Export target matrix</h3>
              <p>Each target gets a different package, not a renamed copy.</p>
            </div>
            <span className="selected-meta">{exportTargetMatrix.readyCount}/{exportTargetMatrix.rows.length} ready</span>
          </div>
          <div className="export-target-grid">
            {exportTargetMatrix.rows.map((row) => (
              <article key={row.target} data-ready={row.ready ? "true" : "false"}>
                <strong>{row.target}</strong>
                <span>{row.useFor}</span>
                <p>{row.include}</p>
                <small>Avoid: {row.avoid}</small>
              </article>
            ))}
          </div>
        </section>
        <div className="modal-layer" hidden={!exportModalOpen}>
          <button className="modal-scrim" type="button" aria-label="Close export center" onClick={() => setExportModalOpen(false)} />
          <section className="export-modal panel" role="dialog" aria-modal="true" aria-label="Export center">
            <div className="output-header modal-header">
              <div>
                <h3>Export center</h3>
                <p>Copy presets, save sessions, review corpus candidates, and attach proof.</p>
              </div>
              <button className="icon-button" type="button" aria-label="Close export center" onClick={() => setExportModalOpen(false)}>x</button>
            </div>
        <div className="self-serve-grid">
          <article className="learner-mini-panel" data-train-section="export-target-differences">
            <div className="output-header">
              <h3>Target export differences</h3>
              <span className="selected-meta">Not just labels</span>
            </div>
            <FeedbackList title="How exports differ" items={exportDifferentiators} empty="No export differences available." />
          </article>

          <article className="learner-mini-panel" data-train-section="corpus-safety">
            <div className="output-header">
              <h3>Corpus safety</h3>
              <span className="selected-meta">{corpusSafety.label}</span>
            </div>
            <div className="mini-stat-row">
              <span>{corpusSafety.counts.website} website</span>
              <span>{corpusSafety.counts.maybe} review</span>
              <span>{corpusSafety.counts.quarantine} quarantine</span>
            </div>
            <FeedbackList title="Safety actions" items={corpusSafety.actions} empty="No safety actions." />
          </article>
        </div>

        <div className="self-serve-grid">
          <article className="learner-mini-panel" data-train-section="learner-regression-guard">
            <div className="output-header">
              <h3>Regression guard</h3>
              <ScoreRing score={regressionSummary.score} label={regressionSummary.label} />
            </div>
            <p>{regressionSummary.detail}</p>
            <FeedbackList title="Holdout rows" items={regressionSummary.rows} empty="No holdout rows." />
          </article>

          <article className="learner-mini-panel" data-train-section="house-compiler">
            <div className="output-header">
              <h3>House-format compiler</h3>
              <div className="button-row">
                <button className="ghost-button compact-button" type="button" onClick={() => onCopy(compiledPrompt, "learner-compiled")}>
                  {copied === "learner-compiled" ? <Check size={15} /> : <Copy size={15} />}
                  Copy
                </button>
                <button className="primary-button compact-button" type="button" onClick={onSaveCompiledPrompt}>
                  <Save size={15} />
                  Save
                </button>
              </div>
            </div>
            <textarea className="generated-output mini-output" readOnly value={compiledPrompt} />
          </article>

          <article className="learner-mini-panel" data-train-section="benchmark-battle">
            <div className="output-header">
              <h3>Benchmark battle</h3>
              <ScoreRing score={learnerBattle.winner.score} label="winner" />
            </div>
            <strong>{learnerBattle.winner.title}</strong>
            <FeedbackList title="Why it wins" items={learnerBattle.explanation} empty="No battle explanation." />
            <div className="version-list compact-list">
              {learnerBattle.variants.slice(0, 3).map((variant) => (
                <article className="version-card" key={variant.id}>
                  <strong>{variant.title}</strong>
                  <span>{variant.score}/100</span>
                  <p>{variant.intent}</p>
                </article>
              ))}
            </div>
            <button className="primary-button compact-button" type="button" onClick={onSaveBattleWinner}>
              <Trophy size={15} />
              Save winner
            </button>
          </article>
        </div>

        <div className="self-serve-grid">
          <article className="learner-mini-panel" data-train-section="recipe-builder">
            <div className="output-header">
              <h3>Prompt recipe builder</h3>
              <span className="selected-meta">Learned archetypes</span>
            </div>
            <div className="recipe-grid">
              {learnerRecipes.slice(0, 4).map((recipe) => (
                <article className="recipe-card" key={recipe.id}>
                  <strong>{recipe.label}</strong>
                  <span>{recipe.score}% recipe</span>
                  <p>{recipe.traits.slice(0, 3).join(" / ") || "General website prompt recipe."}</p>
                  <div className="button-row compact-row">
                    <button className="ghost-button compact-button" type="button" onClick={() => onCopy(recipe.prompt, `recipe-${recipe.id}`)}>
                      {copied === `recipe-${recipe.id}` ? <Check size={15} /> : <Copy size={15} />}
                      Copy
                    </button>
                    <button className="ghost-button compact-button" type="button" onClick={() => onUseSamplePrompt(recipe.prompt)}>
                      Use
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <ExportPresetPreview
            copied={copied}
            onCopy={onCopy}
            onExportLearnerPack={handleExportLearnerPack}
            presets={targetExportPresets}
          />
        </div>

        <div className="self-serve-grid">
          <article className="learner-mini-panel" data-train-section="batch-training-review">
            <div className="output-header">
              <h3>Batch training review</h3>
              <ScoreRing score={batchAudit.averageScore} label="batch" />
            </div>
            <p>{batchCandidateCount ? `${batchCandidateCount} pasted prompt candidate(s) reviewed.` : "Paste 10-50 prompts into Training corpus to cluster and triage them here."}</p>
            <div className="mini-stat-row">
              <span>{batchAudit.importable} importable</span>
              <span>{batchAudit.goldCandidates} gold</span>
              <span>{batchAudit.nearDuplicates} duplicates</span>
            </div>
            <FeedbackList title="Batch recommendations" items={batchAudit.recommendations.slice(0, 4)} empty="No batch recommendations yet." />
          </article>

          <article className="learner-mini-panel" data-train-section="learner-export-pack" id="learner-export">
            <div className="output-header">
              <h3>Export pack</h3>
              <button className="primary-button compact-button" type="button" onClick={handleExportLearnerPack}>
                <Download size={15} />
                Export
              </button>
            </div>
            <div className="source-safety-grid">
              {learnerExportPack.files.map((file) => (
                <article className="index-card" key={file.label} data-ready={file.ready ? "true" : "false"}>
                  <strong>{file.ready ? "Ready" : "Next"}</strong>
                  <span>{file.label}</span>
                  <p>{file.detail}</p>
                </article>
              ))}
            </div>
            <div className="button-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(learnerExportPack.markdown, "learner-export-md")}>Copy markdown</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(learnerExportPack.json, "learner-export-json")}>Copy JSON</button>
            </div>
          </article>
        </div>

        <div className="self-serve-grid">
          <CorpusTriageToolbar rows={corpusReviewRows} onReviewCorpusCandidate={handleReviewCorpusCandidate} />

          <article className="learner-mini-panel" data-train-section="corpus-review-queue">
            <div className="output-header">
              <h3>Corpus review queue</h3>
              <span className="selected-meta">{corpusReviewRows.length} candidate(s)</span>
            </div>
            <div className="mini-stat-row">
              <span>{corpusSafety.counts.website} website prompt</span>
              <span>{corpusSafety.counts.maybe} maybe useful</span>
              <span>{corpusSafety.counts.quarantine} quarantine</span>
            </div>
            <div className="version-list compact-list">
              {corpusReviewRows.slice(0, 5).map((row) => (
                <article className="version-card review-card" key={row.id} data-decision={row.decision}>
                  <strong>{row.title}</strong>
                  <span>
                    {row.decision === "quarantine" ? "Quarantine" : row.decision === "review" ? "Maybe useful" : "Website prompt"}
                    {" / "}{row.score}% / {row.cluster}
                  </span>
                  <p>{row.duplicate}</p>
                  <small>{row.reasons.slice(0, 3).join(" / ")}</small>
                  <textarea
                    className="compact-textarea"
                    value={reviewNotes[row.id] || ""}
                    placeholder="Review note..."
                    onChange={(event) => setReviewNotes((current) => ({ ...current, [row.id]: event.target.value }))}
                  />
                  <div className="button-row compact-row">
                    <button className="ghost-button compact-button" type="button" onClick={() => handleReviewCorpusCandidate(row, "import", reviewNotes[row.id] || "")}>Import</button>
                    <button className="ghost-button compact-button" type="button" onClick={() => handleReviewCorpusCandidate(row, "gold", reviewNotes[row.id] || "")}>Gold</button>
                    <button className="ghost-button compact-button" type="button" onClick={() => handleReviewCorpusCandidate(row, "bad", reviewNotes[row.id] || "")}>Bad</button>
                    <button className="ghost-button compact-button" type="button" onClick={() => handleReviewCorpusCandidate(row, "quarantine", reviewNotes[row.id] || "")}>Quarantine</button>
                    <button className="ghost-button compact-button" type="button" onClick={() => handleReviewCorpusCandidate(row, "merge", reviewNotes[row.id] || "")}>Merge note</button>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="learner-mini-panel" data-train-section="corpus-quarantine">
            <div className="output-header">
              <h3>Corpus quarantine queue</h3>
              <span className="selected-meta">{quarantineItems.length} flagged</span>
            </div>
            {quarantineItems.length ? (
              <div className="version-list compact-list">
                {quarantineItems.map((item) => (
                  <article className="version-card" key={item.candidate.id}>
                    <strong>{item.candidate.title}</strong>
                    <p>{item.reasons.slice(0, 3).join(" / ")}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p>No pasted prompts currently look like unrelated project material.</p>
            )}
          </article>

          <article className="learner-mini-panel" data-train-section="learner-session-history">
            <div className="output-header">
              <h3>Saved learner sessions</h3>
              <span className="selected-meta">Hosted sync ready, no provider keys</span>
            </div>
            <div className="safe-check-grid learner-step-grid">
              {interactionChecks.map((check) => (
                <article className="safe-check" data-ready={check.ready ? "true" : "false"} key={check.label}>
                  <strong>{check.ready ? "Ready" : "Next"}</strong>
                  <span>{check.label}</span>
                  <p>{check.detail}</p>
                </article>
              ))}
            </div>
            <div className="version-list compact-list">
              {savedLearnerSessions.slice(0, 4).map((session) => (
                <article className="version-card" key={session.id}>
                  <strong>{session.title}</strong>
                  <span>{session.profileLabel} / Strength {session.dnaScore}</span>
                  <p>{session.benchmarkWinner.title} won at {session.benchmarkWinner.score}/100.</p>
                  <div className="button-row compact-row">
                    <button className="ghost-button compact-button" type="button" onClick={() => setSelectedSessionId(session.id)}>Details</button>
                    <button className="ghost-button compact-button" type="button" onClick={() => onOpenLearnerSession(session)}>Reopen</button>
                  </div>
                </article>
              ))}
            </div>
            {selectedSession ? (
              <article className="session-detail-card">
                <strong>{selectedSession.title}</strong>
                <span>{selectedSession.profileLabel} / prompt {selectedSession.promptScore} / strength {selectedSession.dnaScore}</span>
                <p>Accepted: {selectedSession.acceptedDiffs.join(", ") || "none"}.</p>
                <p>Rejected: {selectedSession.rejectedDiffs.join(", ") || "none"}.</p>
                <div className="button-row compact-row">
                  <button className="ghost-button compact-button" type="button" onClick={() => onCopy(selectedSession.reviewedPrompt, `session-reviewed-${selectedSession.id}`)}>Copy reviewed</button>
                  <button className="ghost-button compact-button" type="button" onClick={() => onUseSamplePrompt(selectedSession.benchmarkWinner.prompt)}>Use winner</button>
                </div>
              </article>
            ) : null}
          </article>
        </div>

        <section className="learner-mini-panel" data-train-section="visual-proof-gallery">
          <div className="output-header">
            <div>
              <h3>Visual proof gallery</h3>
              <p>Before/after evidence from saved sessions, screenshot notes, and outcome records.</p>
            </div>
            <span className="selected-meta">{learnerProofGallery.length} proof item(s)</span>
          </div>
          <div className="proof-board">
            <article data-ready={learnerProofPlan.status !== "missing" ? "true" : "false"}>
              <Layers size={16} />
              <strong>{learnerProofPlan.headline}</strong>
              <p>{learnerProofPlan.nextAction}</p>
            </article>
            <article data-ready={learnerProofAction.status === "ready" ? "true" : "false"}>
              <Trophy size={16} />
              <strong>{learnerProofAction.title}</strong>
              <p>{learnerProofAction.missing[0] || "Evidence is ready for export."}</p>
            </article>
            <article data-ready={exportTargetMatrix.readyCount >= 6 ? "true" : "false"}>
              <Download size={16} />
              <strong>{exportTargetMatrix.readyCount} export targets</strong>
              <p>Proof, prompt text, and handoff presets stay connected.</p>
            </article>
          </div>
          <div className="proof-gallery-grid">
            {learnerProofGallery.map((item) => (
              <article className="proof-card" key={item.id} data-kind={item.kind}>
                <div className="proof-thumb" data-kind={item.kind}>
                  {item.url ? (
                    <img
                      src={item.url}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.removeAttribute("src");
                        event.currentTarget.hidden = true;
                      }}
                    />
                  ) : <span>{item.score}%</span>}
                </div>
                <strong>{item.title}</strong>
                <span>{item.kind} / {item.score}% / {item.meta}</span>
                <p>{item.detail}</p>
                {item.url ? <a className="ghost-button compact-button" href={item.url} target="_blank" rel="noreferrer">Open proof</a> : null}
              </article>
            ))}
          </div>
        </section>
          </section>
        </div>
        </div>

        <LearnerActivityRail items={learnerActivity} />

        <button className="ghost-button wide-button" type="button" onClick={() => setAdvancedOpen((open) => !open)}>
          <SlidersHorizontal size={15} />
          {advancedOpen ? "Hide advanced corpus analysis" : "Show advanced corpus analysis"}
        </button>
        <LearnerMobileStepBar activeTab={activeWorkspaceTab} onOpenExport={() => setExportModalOpen(true)} onSetTab={setActiveWorkspaceTab} />
      </section>

      {advancedOpen ? (
        <>
          <section className="insight-grid">
            <div className="panel category-panel">
              <div className="panel-header">
                <BarChart3 size={18} />
                <h2>Prompt signals</h2>
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
              <BarChart3 size={18} />
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
        </>
      ) : null}
    </div>
  );
}
