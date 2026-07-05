import { useMemo, useState } from "react";
import { BarChart3, Check, Copy, Download, Save, SlidersHorizontal, Sparkles, Tags, Trophy, Wand2 } from "lucide-react";
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
  type PromptAnalysis,
  type PromptBattle,
  type PromptDiff,
  type PromptExample,
  type PromptImportAudit,
  type PromptProfile,
} from "./promptEngine";
import { type LearnerExportPack, type LearningProfile } from "./learnerProduct";

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
  onCopy,
  onExportLearnerPack,
  onSaveImproved,
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
  onCopy: (value: string, key: string) => void;
  onExportLearnerPack: () => void;
  onSaveImproved: () => void;
  profile: PromptProfile;
  selectedPrompt?: PromptExample;
  setActiveLearningProfileId: (id: string) => void;
  setLearnerText: (value: string) => void;
}) {
  const sourceText = learnerText.trim() || selectedPrompt?.text || "";
  const demoSteps = [
    { label: "Paste", ready: Boolean(sourceText), detail: "Start with a high-quality website prompt." },
    { label: "Score", ready: learnerEvaluation.score > 0, detail: `${learnerEvaluation.score}/100 prompt score.` },
    { label: "Improve", ready: improvedPrompt.length > sourceText.length, detail: "Better prompt generated from learned DNA." },
    { label: "Export", ready: learnerExportPack.files.every((file) => file.ready || file.label === "Screenshot proof refs"), detail: "Markdown and JSON pack ready." },
  ];
  return (
    <div className="demo-shell">
      <header className="demo-topbar">
        <div className="brand-mark" aria-hidden="true">
          <Sparkles size={22} />
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
            <h2>Learn its DNA, then make it sharper.</h2>
            <p>
              Prompt Atelier scores stack, assets, typography, layout, motion, responsiveness, constraints, and QA, then exports
              a builder-ready prompt pack.
            </p>
          </div>
          <div className="demo-score-row">
            <ScoreRing score={learnerEvaluation.score || activeLearningProfile.score || profile.detailScore} label="Prompt" />
            <ScoreRing score={dnaExplanation.overall} label="DNA" />
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
          </article>

          <article className="panel learner-output-card">
            <div className="output-header">
              <h3>Better prompt</h3>
              <div className="button-row">
                <button className="primary-button compact-button" type="button" onClick={onSaveImproved}>
                  <Wand2 size={15} />
                  Make better
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
  learnerDiff,
  learnerEvaluation,
  learnerExportPack,
  learnerText,
  learningProfiles,
  onCopy,
  onCopyImproved,
  onExportLearnerPack,
  onSaveBattleWinner,
  onSaveCompiledPrompt,
  onSaveImproved,
  onSaveReviewedDiff,
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
  learnerDiff?: PromptDiff;
  learnerEvaluation: Evaluation;
  learnerExportPack: LearnerExportPack;
  learnerText: string;
  learningProfiles: LearningProfile[];
  onCopy: (value: string, key: string) => void;
  onCopyImproved: () => void;
  onExportLearnerPack: () => void;
  onSaveBattleWinner: () => void;
  onSaveCompiledPrompt: () => void;
  onSaveImproved: () => void;
  onSaveReviewedDiff: (text: string) => void;
  profile: PromptProfile;
  selectedAnalysis?: PromptAnalysis;
  selectedPrompt?: PromptExample;
  setActiveLearningProfileId: (id: string) => void;
  setLearnerText: (value: string) => void;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [diffDecisions, setDiffDecisions] = useState<Record<string, "accepted" | "rejected">>({});
  const learnerSource = learnerText.trim() || selectedPrompt?.text || "";
  const diffCategories = learnerDiff?.categories.slice(0, 10) ?? [];
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
  const flowSteps = [
    { label: "Paste", ready: Boolean(learnerSource.trim()), detail: "Bring in one website prompt." },
    { label: "Score", ready: learnerEvaluation.score >= 20, detail: `${learnerEvaluation.score}/100 local score.` },
    { label: "Improve", ready: improvedPrompt.length > learnerSource.length, detail: "One-click stronger prompt is ready." },
    { label: "Battle", ready: learnerEvaluation.categoryScores.constraints >= 40, detail: "Constraints are strong enough to compare variants." },
    { label: "Prove", ready: /screenshot|verify|build|test|qa/i.test(improvedPrompt), detail: "Proof checklist is present." },
    { label: "Export", ready: Boolean(improvedPrompt.trim()), detail: "Copy or save the improved prompt." },
  ];
  return (
    <div className="learn-grid">
      <section className="panel public-learner-panel" data-train-section="public-learner">
        <div className="output-header">
          <div>
            <p className="eyebrow">Prompt Learner</p>
            <h2>Paste, score, improve, prove, export.</h2>
            <p>Start with one excellent website prompt and turn the learned DNA into a stronger build prompt without opening the lab.</p>
          </div>
          <ScoreRing score={learnerEvaluation.score || dnaScore} label="Prompt score" />
        </div>

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

        <div className="learner-flow-grid">
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
          </div>

          <div className="learner-output-card">
            <div className="output-header">
              <h3>One-click better prompt</h3>
              <div className="button-row">
                <button className="primary-button compact-button" type="button" onClick={onSaveImproved}>
                  <Wand2 size={15} />
                  Make me a better prompt
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

        <div className="self-serve-grid">
          <article className="learner-mini-panel">
            <div className="output-header">
              <h3>DNA explanation</h3>
              <ScoreRing score={dnaExplanation.overall} label="DNA" />
            </div>
            <FeedbackList title="Why this score" items={dnaExplanation.summary} empty="No DNA explanation." />
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

        <section className="learner-mini-panel" data-train-section="prompt-diff-editor">
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
          </div>
        </section>

        <div className="self-serve-grid">
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

          <article className="learner-mini-panel" data-train-section="learner-export-pack">
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
        </>
      ) : null}
    </div>
  );
}
