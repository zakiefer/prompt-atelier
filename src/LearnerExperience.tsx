import { useMemo, useState } from "react";
import { BarChart3, Check, Copy, Download, Save, SlidersHorizontal, Tags, Trophy } from "lucide-react";
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
  buildLearnerCorpusSafety,
  buildLearnerDiagnosis,
  buildLearnerProofPlan,
  buildLearnerRegressionSummary,
} from "./learnerViewModel";
import { type HoldoutBenchmarkReport } from "./productEvolution";

const categoryOrder = Object.keys(categoryLabels) as CategoryKey[];
const dnaOrder = Object.keys(dnaLabels) as DnaKey[];

function addPercent(score: number) {
  return `${Math.max(0, Math.min(100, Math.round(score)))}%`;
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
  const learnerDiagnosis = useMemo(
    () => buildLearnerDiagnosis({ dnaExplanation, evaluation: learnerEvaluation, neighbors: corpusNeighbors, proofGallery: learnerProofGallery }),
    [corpusNeighbors, dnaExplanation, learnerEvaluation, learnerProofGallery],
  );
  const corpusSafety = useMemo(() => buildLearnerCorpusSafety(corpusReviewRows), [corpusReviewRows]);
  const regressionSummary = useMemo(() => buildLearnerRegressionSummary(holdoutBenchmark), [holdoutBenchmark]);
  const exportDifferentiators = useMemo(() => buildExportDifferentiators(learnerExportPack), [learnerExportPack]);
  const flowSteps = [
    { label: "Paste", ready: Boolean(learnerSource.trim()), detail: "Bring in one website prompt." },
    { label: "Score", ready: learnerEvaluation.score >= 20, detail: `${learnerEvaluation.score}/100 local score.` },
    { label: "Improve", ready: improvedPrompt.length > learnerSource.length, detail: "One-click stronger prompt is ready." },
    { label: "Battle", ready: learnerEvaluation.categoryScores.constraints >= 40, detail: "Constraints are strong enough to compare variants." },
    { label: "Prove", ready: learnerProofPlan.status !== "missing" || /screenshot|verify|build|test|qa/i.test(improvedPrompt), detail: learnerProofPlan.nextAction },
    { label: "Export", ready: Boolean(improvedPrompt.trim()), detail: "Copy or save the improved prompt." },
  ];
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
  return (
    <div className="learn-grid">
      <section className="panel public-learner-panel" data-train-section="public-learner">
        <div className="output-header">
          <div>
            <p className="eyebrow">Prompt workspace</p>
            <h2>Paste, score, improve, prove, export.</h2>
            <p>Start with one excellent website prompt and turn the learned patterns into a stronger build prompt without opening the lab.</p>
          </div>
          <ScoreRing score={learnerEvaluation.score || dnaScore} label="Strength" />
        </div>

        <section className="learner-session-home" aria-label="Session home">
          <div>
            <strong>{savedLearnerSessions[0]?.title ?? "Start a fresh prompt run"}</strong>
            <p>{savedLearnerSessions[0] ? `${savedLearnerSessions.length} saved run(s). Reopen the latest or make a new prompt from a brief.` : "Paste a prompt, choose a brief, then review and export from one compact path."}</p>
          </div>
          <div className="button-row compact-row">
            {savedLearnerSessions[0] ? (
              <button className="ghost-button compact-button" type="button" onClick={() => onOpenLearnerSession(savedLearnerSessions[0])}>
                Reopen latest
              </button>
            ) : null}
            <button className="primary-button compact-button" type="button" onClick={() => setActiveWorkspaceTab("compose")}>
              New run
            </button>
          </div>
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
                <button className="primary-button compact-button" type="button" onClick={onSaveImproved}>
                  Revise prompt
                </button>
                <button className="ghost-button compact-button" type="button" onClick={onCopyImproved}>
                  {copied === "learner-improved" ? <Check size={15} /> : <Copy size={15} />}
                  Copy
                </button>
                <button className="ghost-button compact-button" type="button" onClick={onSaveImproved}>
                  <Save size={15} />
                  Save
                </button>
              </div>
            </div>
            <textarea className="generated-output learner-output" readOnly value={improvedPrompt} />
            <FeedbackList title="Top 3 fixes" items={learnerEvaluation.upgrades.slice(0, 3)} empty="No major gaps detected." />
          </div>
        </div>

        <section className="learner-mini-panel" data-train-section="brief-builder" id="learner-score">
          <div className="output-header">
            <div>
              <h3>Make me a prompt</h3>
              <span className="selected-meta">Brief builder</span>
              <p>Generate a fresh implementation-ready prompt from structured choices instead of a blank textarea.</p>
            </div>
            <button className="primary-button compact-button" type="button" onClick={() => onUseSamplePrompt(briefPrompt)}>
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
          <textarea className="generated-output mini-output" readOnly value={briefPrompt} />
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
          <article className="learner-mini-panel" data-train-section="dna-rewrite-plan">
            <div className="output-header">
              <h3>Why not 100</h3>
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
            <button className="primary-button compact-button" type="button" onClick={() => onSaveReviewedDiff(reviewedPrompt)}>
              <Save size={15} />
              Save reviewed prompt
            </button>
            <button className="primary-button compact-button" data-learner-action="save-session" type="button" onClick={() => onSaveLearnerSession(reviewedPrompt, acceptedDiffLabels, rejectedDiffLabels)}>
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

        <section className="learner-mini-panel" data-train-section="outcome-feedback-loop" id="learner-feedback">
          <div className="output-header">
            <div>
              <h3>Outcome feedback loop</h3>
              <p>Record how the built result performed so prompt strength learns from actual output, not only static text.</p>
            </div>
            <button
              className="primary-button compact-button"
              type="button"
              onClick={() => onRecordOutcomeFeedback(outcomeRating, outcomeNotes, outcomeScreenshotUrl, outcomeScreenshotNotes)}
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

          <article className="learner-mini-panel" data-train-section="target-export-presets">
            <div className="output-header">
              <h3>Target export presets</h3>
              <span className="selected-meta">Codex / Claude / v0 / GPT</span>
            </div>
            <div className="preset-grid">
              {targetExportPresets.map((preset) => (
                <button className="preset-card" key={preset.id} type="button" onClick={() => onCopy(preset.content, `target-${preset.id}`)}>
                  <strong>{preset.label}</strong>
                  <span>{preset.filename}</span>
                  <small>{preset.detail}</small>
                </button>
              ))}
            </div>
          </article>
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
              <button className="primary-button compact-button" type="button" onClick={onExportLearnerPack}>
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
                    <button className="ghost-button compact-button" type="button" onClick={() => onReviewCorpusCandidate(row, "import", reviewNotes[row.id] || "")}>Import</button>
                    <button className="ghost-button compact-button" type="button" onClick={() => onReviewCorpusCandidate(row, "gold", reviewNotes[row.id] || "")}>Gold</button>
                    <button className="ghost-button compact-button" type="button" onClick={() => onReviewCorpusCandidate(row, "bad", reviewNotes[row.id] || "")}>Bad</button>
                    <button className="ghost-button compact-button" type="button" onClick={() => onReviewCorpusCandidate(row, "quarantine", reviewNotes[row.id] || "")}>Quarantine</button>
                    <button className="ghost-button compact-button" type="button" onClick={() => onReviewCorpusCandidate(row, "merge", reviewNotes[row.id] || "")}>Merge note</button>
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
          <div className="proof-gallery-grid">
            {learnerProofGallery.map((item) => (
              <article className="proof-card" key={item.id} data-kind={item.kind}>
                <div className="proof-thumb" data-kind={item.kind}>
                  {item.url ? <img src={item.url} alt="" /> : <span>{item.score}%</span>}
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

        <button className="ghost-button wide-button" type="button" onClick={() => setAdvancedOpen((open) => !open)}>
          <SlidersHorizontal size={15} />
          {advancedOpen ? "Hide advanced corpus analysis" : "Show advanced corpus analysis"}
        </button>
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
