import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Clock, Copy, Database, Download, ExternalLink, FileText, GitBranch, History, ImagePlus, ListChecks, MonitorCheck, PackageCheck, Palette, PlayCircle, Save, Search, ShieldCheck, Smartphone, Sparkles, Upload, Wrench } from "lucide-react";
import { type OutcomeRating } from "./promptEngine";
import { type CorpusReviewRow, type LearnerSession, type TargetExportPreset } from "./learnerProduct";
import {
  type LearnedPromptSection,
  type LearnerOperatingLoop,
  type LearnerProofDeployStatus,
} from "./learnerViewModel";
import {
  type CiProofCard,
  type CoverageGap,
  type ExportStudioGroup,
  type MobileOperatorAction,
  type ResultGalleryItem,
  type TasteProfileVersion,
  type TimelineItem,
  type WorkflowMilestone,
} from "./learnerWorkflowNext";
import {
  type AccessibilityQaReport,
  type EmptyStateCard,
  type FirstRunGuide,
  type GalleryFilter,
  type GalleryFilterOption,
  type MobileConsoleAction,
  type ProjectBundle,
  type ProofRepairDraft,
  type RegressionTrendSummary,
  type SurfaceNavCard,
} from "./learnerProductHardening";
import { type WebsiteReferenceInput, type WebsiteReferencePromptResult } from "./websiteReferencePrompt";

export type LearnerWorkspaceTab = "compose" | "review" | "export";

export type LearnerActivityItem = {
  id: string;
  label: string;
  detail: string;
  tone?: "good" | "watch" | "neutral";
  at: string;
};

export type LearnerProofVaultItem = {
  id: string;
  title: string;
  rating: OutcomeRating;
  screenshotUrl: string;
  screenshotNotes: string;
  notes: string;
  createdAt: string;
};

export type LearnerSearchResult = {
  id: string;
  kind: "session" | "proof" | "export" | "corpus" | "sample";
  title: string;
  detail: string;
  actionLabel?: string;
};

export type PromptLintFix = {
  id: string;
  label: string;
  detail: string;
  patch: string;
  severity: "fix" | "watch";
};

export type ProductChangelogItem = {
  id: string;
  label: string;
  detail: string;
  meta: string;
};

export type OneClickProofStep = {
  id: string;
  label: string;
  detail: string;
  status: "ready" | "active" | "blocked";
};

export type ProjectSnapshot = {
  id: string;
  label: string;
  savedAt: string;
  profileId: string;
  sourcePrompt: string;
  proofArtifacts: LearnerProofVaultItem[];
  improvedPrompt?: string;
  reviewedPrompt?: string;
  promptScore?: number;
  proofScore?: number;
  exportReadyCount?: number;
  exportPresetCount?: number;
};

export type ImportFrontDoorItem = {
  id: string;
  filename: string;
  kind: "txt" | "markdown" | "jsonl" | "json" | "unknown";
  text: string;
  words: number;
  status: "ready" | "review" | "blocked";
  reason: string;
};

export type ProofLeaderboardRow = {
  id: string;
  title: string;
  score: number;
  proof: number;
  kind: string;
  detail: string;
};

export type ProjectStage = {
  id: LearnerWorkspaceTab | "import";
  label: string;
  status: "ready" | "active" | "watch";
  detail: string;
  cta: string;
};

export type CurrentProjectSummary = {
  name: string;
  profileLabel: string;
  sourceWords: number;
  promptScore: number;
  proofScore: number;
  exportReadyCount: number;
  exportPresetCount: number;
  proofCount: number;
  sessionCount: number;
  savedAt?: string;
};

export type ProjectSyncState = {
  status: "browser" | "syncing" | "synced" | "error";
  detail: string;
  lastSyncedAt?: string;
  remoteProjects: number;
  versions: number;
  proofRuns: number;
  generatedPrompts: number;
};

export type EvalHistoryRecord = {
  id: string;
  label: string;
  createdAt: string;
  promptScore: number;
  proofScore: number;
  exportReadyCount: number;
  detail: string;
};

export type ProjectProofRunRecord = {
  id: string;
  title: string;
  createdAt: string;
  score: number;
  commands: string[];
  checks: { label: string; ready: boolean; detail?: string }[];
};

export type CorpusHealthDecision = {
  id: string;
  label: "gold" | "watch" | "quarantine";
  detail: string;
  createdAt: string;
};

export type ProductionCommandCenterProps = {
  checklist: { label: string; ready: boolean; detail: string }[];
  ciLinks: { label: string; href?: string; detail: string; ready: boolean }[];
  corpusDecision?: CorpusHealthDecision;
  generatedPrompt?: string;
  onCurate: (label: CorpusHealthDecision["label"]) => void;
  onGenerate: () => void;
  onRunProof: () => void;
  onSync: () => void;
  proofRun?: ProjectProofRunRecord;
  sync: ProjectSyncState;
};

export type ProofChecklistItem = {
  id: string;
  label: string;
  ready: boolean;
  detail: string;
  target: LearnerWorkspaceTab;
};

export type PromptQualityReportItem = {
  label: string;
  score: number;
  status: "strong" | "watch" | "missing";
  detail: string;
};

export type TrainingSignal = {
  label: string;
  detail: string;
  strength: number;
};

export function ProjectCockpitPanel({
  activeStage,
  project,
  stages,
  onRunOneClick,
  onSaveProject,
  onSelectStage,
}: {
  activeStage: LearnerWorkspaceTab;
  project: CurrentProjectSummary;
  stages: ProjectStage[];
  onRunOneClick: () => void;
  onSaveProject: () => void;
  onSelectStage: (stage: ProjectStage) => void;
}) {
  return (
    <section className="project-cockpit-panel" data-train-section="project-cockpit">
      <div className="project-cockpit-copy">
        <span>Current project</span>
        <h3>{project.name}</h3>
        <p>
          {project.profileLabel} / {project.sourceWords} words / {project.proofCount} proof item(s) / {project.sessionCount} saved run(s)
        </p>
        <div className="button-row compact-row">
          <button className="primary-button compact-button" type="button" onClick={onRunOneClick}>
            Run full path
            <ArrowRight size={15} />
          </button>
          <button className="ghost-button compact-button" type="button" onClick={onSaveProject}>
            <Save size={15} />
            Save project
          </button>
        </div>
      </div>
      <div className="project-score-stack" aria-label="Project readiness">
        <article>
          <strong>{project.promptScore}</strong>
          <span>Prompt</span>
        </article>
        <article>
          <strong>{project.proofScore}</strong>
          <span>Proof</span>
        </article>
        <article>
          <strong>{project.exportReadyCount}/{project.exportPresetCount}</strong>
          <span>Exports</span>
        </article>
      </div>
      <div className="project-stage-grid">
        {stages.map((stage) => (
          <button
            data-active={stage.id === activeStage ? "true" : "false"}
            data-status={stage.status}
            key={stage.id}
            type="button"
            onClick={() => onSelectStage(stage)}
          >
            <span>{stage.status}</span>
            <strong>{stage.label}</strong>
            <p>{stage.detail}</p>
            <small>{stage.cta}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export function FirstRunStartPanel({
  guide,
  onOpenImport,
  onStart,
  onUseSample,
}: {
  guide: FirstRunGuide;
  onOpenImport: () => void;
  onStart: () => void;
  onUseSample: () => void;
}) {
  return (
    <section className="first-run-start-panel" data-train-section="first-run-start">
      <div className="first-run-copy">
        <span>Start here</span>
        <h3>{guide.headline}</h3>
        <p>{guide.detail}</p>
        <div className="button-row compact-row">
          <button className="primary-button compact-button" type="button" onClick={onStart}>
            Start guided run
            <ArrowRight size={15} />
          </button>
          <button className="ghost-button compact-button" type="button" onClick={onUseSample}>
            Use starter
          </button>
          <button className="ghost-button compact-button" type="button" onClick={onOpenImport}>
            <Upload size={15} />
            Import
          </button>
        </div>
      </div>
      <div className="first-run-score">
        <strong>{guide.score}</strong>
        <span>guided</span>
      </div>
      <div className="first-run-step-grid">
        {guide.steps.map((step) => (
          <article data-status={step.status} key={step.id}>
            <span>{step.label}</span>
            <strong>{step.cta}</strong>
            <p>{step.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LearnerSurfaceNavPanel({
  cards,
  onSelectTarget,
  onStart,
}: {
  cards: SurfaceNavCard[];
  onSelectTarget: (target: SurfaceNavCard["target"]) => void;
  onStart: () => void;
}) {
  return (
    <section className="learner-surface-nav-panel" data-train-section="learner-surface-nav">
      <div className="surface-nav-copy">
        <span>Workbench map</span>
        <strong>Create / Prove / Train</strong>
        <p>The primary IA is now three clear surfaces. Deeper diagnostics stay tucked behind drawers.</p>
      </div>
      <div className="surface-nav-card-row">
        {cards.map((card) => (
          <button data-status={card.status} key={card.id} type="button" onClick={() => onSelectTarget(card.target)}>
            <span>{card.metric}</span>
            <strong>{card.label}</strong>
            <p>{card.detail}</p>
          </button>
        ))}
      </div>
      <button className="ghost-button compact-button" type="button" onClick={onStart}>
        Run all
        <ArrowRight size={14} />
      </button>
    </section>
  );
}

export function WebsiteReferencePromptPanel({
  copied,
  input,
  onChange,
  onCopy,
  onGenerate,
  onUse,
  result,
  runCount,
}: {
  copied: string;
  input: WebsiteReferenceInput;
  onChange: (key: keyof WebsiteReferenceInput, value: string) => void;
  onCopy: (value: string, key: string) => void;
  onGenerate: () => void;
  onUse: () => void;
  result: WebsiteReferencePromptResult;
  runCount: number;
}) {
  const field = (key: keyof WebsiteReferenceInput, label: string, placeholder: string, textarea = false) => (
    <label className="reference-site-field" key={key}>
      <span>{label}</span>
      {textarea ? (
        <textarea
          data-reference-field={key}
          value={input[key]}
          onChange={(event) => onChange(key, event.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          data-reference-field={key}
          value={input[key]}
          onChange={(event) => onChange(key, event.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );

  return (
    <section className="website-reference-panel" data-train-section="website-reference-prompt">
      <div className="reference-site-copy">
        <span><ExternalLink size={14} /> Reference website prompt</span>
        <h3>Turn a current website into a new build prompt.</h3>
        <p>Paste the source URL, say what to preserve, then redirect it into a new brand, new copy, new assets, and proof-ready implementation rules.</p>
        <div className="reference-site-score" data-ready={result.score >= 70 ? "true" : "false"}>
          <strong>{result.score}</strong>
          <span>reference readiness</span>
        </div>
      </div>
      <div className="reference-site-form">
        <div className="reference-field-grid">
          {field("url", "Current website URL", "https://example.com")}
          {field("newBrand", "New brand", "Northstar Studio")}
          {field("newOffer", "New website offer", "AI-native design system for product teams")}
          {field("audience", "Audience", "Product leaders, founders, and design teams")}
        </div>
        <div className="reference-field-grid two-up">
          {field("keep", "Keep from reference", "Editorial hierarchy, calm navigation, proof-oriented section pacing", true)}
          {field("change", "Change for new site", "New copy, brand system, assets, colors, and mobile CTA behavior", true)}
          {field("pageNotes", "Visible site notes", "Hero, nav, motion, cards, dropdowns, scroll behavior, mobile layout, screenshots", true)}
          {field("constraints", "No-go rules", "No cloned copy, no source brand marks, no credentials, no hidden scraping", true)}
        </div>
        <details className="reference-advanced">
          <summary>Stack and asset details</summary>
          <div className="reference-field-grid two-up">
            {field("stack", "Stack", "React + TypeScript + Vite + Tailwind CSS", true)}
            {field("assets", "Asset plan", "Use new or provided media. Describe asset slots if URLs are unknown.", true)}
          </div>
        </details>
        <div className="button-row compact-row">
          <button className="primary-button compact-button" data-reference-action="generate" type="button" onClick={onGenerate}>
            <Sparkles size={15} />
            Generate reference prompt
          </button>
          <button className="ghost-button compact-button" data-reference-action="use" type="button" onClick={onUse} disabled={!result.prompt}>
            Use as working prompt
          </button>
          <button className="ghost-button compact-button" data-reference-action="copy" type="button" onClick={() => onCopy(result.prompt, "website-reference-prompt")} disabled={!result.prompt}>
            {copied === "website-reference-prompt" ? <Check size={15} /> : <Copy size={15} />}
            Copy
          </button>
        </div>
      </div>
      <div className="reference-site-output">
        <div className="output-header">
          <div>
            <h4>{result.title}</h4>
            <p>{result.summary}</p>
          </div>
          <span className="selected-meta">{runCount} run{runCount === 1 ? "" : "s"}</span>
        </div>
        {result.warnings.length ? (
          <div className="reference-warning-list">
            {result.warnings.map((warning) => (
              <span key={warning}><ShieldCheck size={13} /> {warning}</span>
            ))}
          </div>
        ) : (
          <div className="reference-section-tags">
            {result.sections.slice(0, 4).map((section) => (
              <span key={section}>{section}</span>
            ))}
          </div>
        )}
        <textarea className="generated-output reference-output" data-reference-output readOnly value={result.prompt} />
      </div>
    </section>
  );
}

export function ProofRunnerChecklistPanel({
  items,
  onSelectItem,
}: {
  items: ProofChecklistItem[];
  onSelectItem: (item: ProofChecklistItem) => void;
}) {
  const ready = items.filter((item) => item.ready).length;
  return (
    <section className="learner-mini-panel proof-runner-checklist" data-train-section="proof-runner-checklist">
      <div className="output-header">
        <div>
          <h3>Automatic proof runner</h3>
          <p>Every export should leave with visible desktop/mobile proof, console health, and acceptance gates.</p>
        </div>
        <span className="selected-meta">{ready}/{items.length} ready</span>
      </div>
      <div className="proof-checklist-grid">
        {items.map((item) => (
          <button data-ready={item.ready ? "true" : "false"} key={item.id} type="button" onClick={() => onSelectItem(item)}>
            {item.ready ? <Check size={16} /> : <ListChecks size={16} />}
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function PromptQualityReportPanel({
  items,
  onImprove,
  score,
  summary,
}: {
  items: PromptQualityReportItem[];
  onImprove: () => void;
  score: number;
  summary: string;
}) {
  return (
    <section className="learner-mini-panel prompt-quality-report" data-train-section="prompt-quality-report">
      <div className="output-header">
        <div>
          <h3>Prompt quality report</h3>
          <p>{summary}</p>
        </div>
        <div className="mini-score-badge">
          <strong>{score}</strong>
          <span>quality</span>
        </div>
      </div>
      <div className="quality-report-grid">
        {items.map((item) => (
          <article data-status={item.status} key={item.label}>
            <span>{item.status}</span>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
            <small>{item.score}/100</small>
          </article>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onImprove}>
        Improve from report
        <ArrowRight size={15} />
      </button>
    </section>
  );
}

export function TrainingImpactPanel({
  onLearn,
  signals,
}: {
  onLearn: () => void;
  signals: TrainingSignal[];
}) {
  return (
    <section className="learner-mini-panel training-impact-panel" data-train-section="training-impact">
      <div className="output-header">
        <div>
          <h3>Learn from this prompt</h3>
          <p>Show exactly what the corpus will remember before this example becomes training signal.</p>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onLearn}>
          <Sparkles size={15} />
          Learn signal
        </button>
      </div>
      <div className="training-signal-list">
        {signals.map((signal) => (
          <article key={signal.label}>
            <strong>{signal.label}</strong>
            <p>{signal.detail}</p>
            <span>{signal.strength}/100</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProductionCommandCenterPanel({
  checklist,
  ciLinks,
  corpusDecision,
  generatedPrompt,
  onCurate,
  onGenerate,
  onRunProof,
  onSync,
  proofRun,
  sync,
}: ProductionCommandCenterProps) {
  const readyCount = checklist.filter((item) => item.ready).length;
  const linkCount = ciLinks.filter((item) => item.ready).length;
  return (
    <section className="learner-mini-panel production-command-center" data-sync-status={sync.status} data-train-section="production-command-center">
      <div className="output-header">
        <div>
          <h3>Generate great prompt</h3>
          <p>One compact lane for backend project sync, proof runner evidence, corpus health controls, handoff packaging, and eval history.</p>
        </div>
        <span className="selected-meta backend-sync-badge">
          <Database size={14} />
          Backend project sync: {sync.status}
        </span>
      </div>
      <div className="production-action-row">
        <button className="primary-button compact-button" type="button" onClick={onGenerate}>
          <Sparkles size={15} />
          Generate prompt
        </button>
        <button className="ghost-button compact-button" type="button" onClick={onSync}>
          <Save size={15} />
          Sync project
        </button>
        <button className="ghost-button compact-button" type="button" onClick={onRunProof}>
          <PlayCircle size={15} />
          Run proof runner
        </button>
      </div>
      <div className="production-command-grid">
        <article>
          <span>First-run checklist</span>
          <strong>{readyCount}/{checklist.length} ready</strong>
          <p>{checklist.find((item) => !item.ready)?.detail || "The guided path is complete enough to export."}</p>
        </article>
        <article>
          <span>Corpus health controls</span>
          <strong>{corpusDecision ? corpusDecision.label : "unlabeled"}</strong>
          <p>{corpusDecision?.detail || "Label this prompt as gold, watch, or quarantine before training memory."}</p>
          <div className="compact-segmented-row" role="group" aria-label="Corpus health controls">
            {(["gold", "watch", "quarantine"] as const).map((label) => (
              <button data-active={corpusDecision?.label === label ? "true" : "false"} key={label} type="button" onClick={() => onCurate(label)}>
                {label}
              </button>
            ))}
          </div>
        </article>
        <article>
          <span>Proof runner</span>
          <strong>{proofRun ? `${proofRun.score}/100` : "not run"}</strong>
          <p>{proofRun?.title || "Creates a stored proof-run record with commands, checklist status, and acceptance gates."}</p>
        </article>
        <article>
          <span>CI proof links</span>
          <strong>{linkCount}/{ciLinks.length}</strong>
          <p>{ciLinks.find((item) => item.ready)?.detail || "CI and hosted proof links appear here after build metadata is available."}</p>
        </article>
      </div>
      <div className="generated-prompt-preview">
        <strong>Latest generated prompt</strong>
        <p>{generatedPrompt || "Use Generate prompt to produce a clean, implementation-ready prompt from the learned style and current brief."}</p>
      </div>
      <p className="selected-meta">{sync.detail}{sync.lastSyncedAt ? ` / ${new Date(sync.lastSyncedAt).toLocaleString()}` : ""}</p>
    </section>
  );
}

export function EvalHistoryCompactPanel({ history }: { history: EvalHistoryRecord[] }) {
  const latest = history[0];
  const average = Math.round(
    history.reduce((total, item) => total + Math.round((item.promptScore + item.proofScore) / 2), 0) / Math.max(1, history.length),
  );
  return (
    <section className="learner-mini-panel eval-history-compact" data-train-section="eval-history">
      <div className="output-header">
        <div>
          <h3>Eval history</h3>
          <p>Every generated prompt, proof run, sync, and handoff package leaves a comparable score row.</p>
        </div>
        <div className="mini-score-badge">
          <strong>{history.length ? average : 0}</strong>
          <span>avg</span>
        </div>
      </div>
      <div className="eval-history-list">
        {history.slice(0, 5).map((item) => (
          <article key={item.id}>
            <div>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </div>
            <span>{item.promptScore}/{item.proofScore}</span>
          </article>
        ))}
        {!history.length ? <p className="selected-meta">No eval rows yet. Generate, sync, or run proof to start the trend.</p> : null}
      </div>
      {latest ? <p className="selected-meta">Latest: {new Date(latest.createdAt).toLocaleString()} / {latest.exportReadyCount} export target(s)</p> : null}
    </section>
  );
}

export function WorkflowOsPanel({
  milestones,
  onRunFullPath,
  onSelectTarget,
}: {
  milestones: WorkflowMilestone[];
  onRunFullPath: () => void;
  onSelectTarget: (target: WorkflowMilestone["target"]) => void;
}) {
  const readyCount = milestones.filter((item) => item.status === "ready").length;
  return (
    <section className="workflow-os-panel" data-train-section="workflow-os">
      <div className="output-header">
        <div>
          <span className="eyebrow">Workflow OS</span>
          <h3>One clean path through the machine</h3>
          <p>Paste, learn, generate, prove, and export without hunting through the advanced workbench.</p>
        </div>
        <div className="mini-score-badge">
          <strong>{Math.round((readyCount / Math.max(1, milestones.length)) * 100)}</strong>
          <span>flow</span>
        </div>
      </div>
      <div className="workflow-step-line">
        {milestones.map((milestone, index) => (
          <button data-status={milestone.status} key={milestone.id} type="button" onClick={() => onSelectTarget(milestone.target)}>
            <span>{index + 1}</span>
            <strong>{milestone.label}</strong>
            <p>{milestone.detail}</p>
          </button>
        ))}
      </div>
      <button className="primary-button compact-button" type="button" onClick={onRunFullPath}>
        Run guided proof path
        <ArrowRight size={15} />
      </button>
    </section>
  );
}

export function ResultGalleryPanel({
  activeFilter,
  filters,
  items,
  onFilterChange,
  onMarkWeak,
  onPromote,
  onRepair,
}: {
  activeFilter: GalleryFilter;
  filters: GalleryFilterOption[];
  items: ResultGalleryItem[];
  onFilterChange: (filter: GalleryFilter) => void;
  onMarkWeak: (item: ResultGalleryItem) => void;
  onPromote: (item: ResultGalleryItem) => void;
  onRepair: (item: ResultGalleryItem) => void;
}) {
  return (
    <section className="result-gallery-panel" data-train-section="result-gallery">
      <div className="output-header">
        <div>
          <h3>Result gallery</h3>
          <p>Generated prompts, proof runs, screenshots, and outcome notes become reviewable evidence cards.</p>
        </div>
        <span className="selected-meta">{items.length} result(s)</span>
      </div>
      <div className="result-filter-row" role="tablist" aria-label="Result gallery filters">
        {filters.map((filter) => (
          <button
            aria-selected={activeFilter === filter.id}
            data-active={activeFilter === filter.id ? "true" : "false"}
            key={filter.id}
            role="tab"
            type="button"
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
            <span>{filter.count}</span>
          </button>
        ))}
      </div>
      <div className="result-gallery-grid">
        {items.length ? items.map((item) => (
          <article data-status={item.status} key={item.id}>
            <div className="result-card-topline">
              <span>{item.kind}</span>
              <strong>{item.score}</strong>
            </div>
            {item.screenshotUrl ? <img src={item.screenshotUrl} alt="" /> : null}
            <h4>{item.title}</h4>
            <p>{item.detail}</p>
            <small>Proof {item.proof}% / {item.status}</small>
            <div className="button-row compact-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onPromote(item)}>Promote gold</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onMarkWeak(item)}>Mark weak</button>
              <button className="ghost-button compact-button" type="button" onClick={() => onRepair(item)}>
                <Wrench size={14} />
                Repair
              </button>
            </div>
          </article>
        )) : (
          <article data-status="watch">
            <div className="result-card-topline">
              <span>empty</span>
              <strong>0</strong>
            </div>
            <h4>No matching result evidence</h4>
            <p>Try another filter, generate a prompt, run proof, or save result feedback to create a reviewable card.</p>
            <small>Proof 0% / watch</small>
          </article>
        )}
      </div>
    </section>
  );
}

export function VisualRepairLoopPanel({
  copied,
  onCopy,
  onGenerateRepair,
  onUseRepair,
  repairPrompt,
  repairs,
  title,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onGenerateRepair: () => void;
  onUseRepair: () => void;
  repairPrompt: string;
  repairs: string[];
  title: string;
}) {
  return (
    <section className="visual-repair-panel" data-train-section="visual-repair-loop">
      <div className="output-header">
        <div>
          <h3>Visual repair loop</h3>
          <p>{title}</p>
        </div>
        <div className="button-row compact-row">
          <button className="primary-button compact-button" type="button" onClick={onGenerateRepair}>Build repair prompt</button>
          <button className="ghost-button compact-button" type="button" onClick={onUseRepair} disabled={!repairPrompt}>Use repair prompt</button>
        </div>
      </div>
      <div className="repair-grid">
        <article>
          <span>Repair targets</span>
          {repairs.map((item) => <p key={item}>{item}</p>)}
        </article>
        <article>
          <span>Generated repair prompt</span>
          <textarea className="generated-output mini-output" readOnly value={repairPrompt || "Run the repair builder after a result card or proof gap is selected."} />
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(repairPrompt, "visual-repair-prompt")} disabled={!repairPrompt}>
            {copied === "visual-repair-prompt" ? <Check size={15} /> : <Copy size={15} />}
            Copy repair
          </button>
        </article>
      </div>
    </section>
  );
}

export function CoverageIntelligencePanel({ gaps }: { gaps: CoverageGap[] }) {
  return (
    <section className="coverage-intelligence-panel" data-train-section="coverage-intelligence">
      <div className="output-header">
        <div>
          <h3>Coverage intelligence</h3>
          <p>Shows where the prompt corpus is strong, thin, or missing before the learner overfits.</p>
        </div>
        <span className="selected-meta">{gaps.filter((gap) => gap.status === "covered").length}/{gaps.length} covered</span>
      </div>
      <div className="coverage-gap-grid">
        {gaps.map((gap) => (
          <article data-status={gap.status} key={gap.id}>
            <strong>{gap.score}</strong>
            <span>{gap.label}</span>
            <p>{gap.detail}</p>
            <small>{gap.action}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ExportStudioPanel({
  copied,
  groups,
  onCopyPreset,
  onOpenExport,
}: {
  copied: string;
  groups: ExportStudioGroup[];
  onCopyPreset: (preset: TargetExportPreset) => void;
  onOpenExport: () => void;
}) {
  return (
    <section className="export-studio-panel" data-train-section="export-studio">
      <div className="output-header">
        <div>
          <h3>Export studio</h3>
          <p>Builder, critique, and training exports are grouped by actual use case.</p>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onOpenExport}>
          <PackageCheck size={15} />
          Open package
        </button>
      </div>
      <div className="export-studio-grid">
        {groups.map((group) => (
          <article key={group.id}>
            <strong>{group.label}</strong>
            <p>{group.detail}</p>
            <div className="export-preset-row">
              {group.presets.slice(0, 5).map((preset) => (
                <button key={preset.id} type="button" onClick={() => onCopyPreset(preset)}>
                  {copied === `export-studio-${preset.id}` ? <Check size={13} /> : <Copy size={13} />}
                  {preset.label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProjectTimelinePanel({
  items,
  onSelectItem,
}: {
  items: TimelineItem[];
  onSelectItem: (item: TimelineItem) => void;
}) {
  return (
    <section className="project-timeline-panel" data-train-section="project-timeline">
      <div className="output-header">
        <div>
          <h3>Project timeline</h3>
          <p>Every prompt, proof, sync, profile, and export action stays visible as a project history.</p>
        </div>
        <History size={18} />
      </div>
      <div className="project-timeline-list">
        {items.length ? items.map((item) => (
          <button data-kind={item.kind} key={item.id} type="button" onClick={() => onSelectItem(item)}>
            <span>{item.kind}</span>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
            <small>{new Date(item.at).toLocaleString()}</small>
          </button>
        )) : (
          <article>
            <span>empty</span>
            <strong>No project events yet</strong>
            <p>Generate, prove, sync, or export to populate the timeline.</p>
          </article>
        )}
      </div>
    </section>
  );
}

export function TasteProfileVersionsPanel({
  onSaveVersion,
  onUseVersion,
  versions,
}: {
  onSaveVersion: () => void;
  onUseVersion: (version: TasteProfileVersion) => void;
  versions: TasteProfileVersion[];
}) {
  return (
    <section className="taste-version-panel" data-train-section="taste-profile-versions">
      <div className="output-header">
        <div>
          <h3>Taste profile versions</h3>
          <p>Save named versions of learned taste so style changes can be compared instead of guessed.</p>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onSaveVersion}>
          <Palette size={15} />
          Save taste version
        </button>
      </div>
      <div className="taste-version-grid">
        {versions.length ? versions.slice(0, 6).map((version) => (
          <article key={version.id}>
            <strong>{version.label}</strong>
            <span>{version.profileLabel} / {version.score}%</span>
            <p>{version.rules.slice(0, 2).join(" / ") || "No rules saved."}</p>
            <button className="ghost-button compact-button" type="button" onClick={() => onUseVersion(version)}>Use version</button>
          </article>
        )) : (
          <article>
            <strong>No taste versions yet</strong>
            <span>Save one after the prompt and proof scores look right.</span>
            <p>Versions preserve profile, rules, seed prompt, prompt score, and proof score.</p>
          </article>
        )}
      </div>
    </section>
  );
}

export function CiProofStatusPanel({ cards }: { cards: CiProofCard[] }) {
  return (
    <section className="ci-proof-status-panel" data-train-section="ci-proof-status">
      <div className="output-header">
        <div>
          <h3>CI proof status</h3>
          <p>Build metadata, hosted proof, smoke status, and commit evidence are visible inside the app.</p>
        </div>
        <GitBranch size={18} />
      </div>
      <div className="ci-proof-grid">
        {cards.map((card) => (
          <article data-ready={card.ready ? "true" : "false"} key={card.id}>
            <strong>{card.ready ? "Ready" : "Watch"}</strong>
            <span>{card.label}</span>
            <p>{card.detail}</p>
            {card.href ? <a href={card.href} target="_blank" rel="noreferrer">Open proof</a> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function MobileOperatorPanel({
  actions,
  onSelectTarget,
}: {
  actions: MobileOperatorAction[];
  onSelectTarget: (target: MobileOperatorAction["target"]) => void;
}) {
  return (
    <section className="mobile-operator-panel" data-train-section="mobile-operator">
      <div className="output-header">
        <div>
          <h3>Mobile operator mode</h3>
          <p>A compact command surface for phones: start, prove, or export without diagnostic walls.</p>
        </div>
        <Smartphone size={18} />
      </div>
      <div className="mobile-operator-grid">
        {actions.map((action) => (
          <button data-ready={action.ready ? "true" : "false"} key={action.id} type="button" onClick={() => onSelectTarget(action.target)}>
            <strong>{action.label}</strong>
            <span>{action.detail}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function MobileCommandConsolePanel({
  actions,
  onSelectTarget,
  onStart,
}: {
  actions: MobileConsoleAction[];
  onSelectTarget: (target: MobileConsoleAction["target"]) => void;
  onStart: () => void;
}) {
  return (
    <section className="mobile-command-console-panel" data-train-section="mobile-command-console">
      <div className="output-header">
        <div>
          <h3>Mobile command console</h3>
          <p>Phone users get one command stack instead of a wall of dense lab panels.</p>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onStart}>
          Run
        </button>
      </div>
      <div className="mobile-console-grid">
        {actions.map((action) => (
          <button data-ready={action.ready ? "true" : "false"} key={action.id} type="button" onClick={() => onSelectTarget(action.target)}>
            <strong>{action.label}</strong>
            <span>{action.detail}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function ExportDeliverablesPanel({
  onOpenExport,
  presets,
}: {
  onOpenExport: () => void;
  presets: TargetExportPreset[];
}) {
  const featured = presets.filter((preset) => ["codex", "claude", "v0", "lovable", "raw", "jsonl"].includes(preset.id)).slice(0, 6);
  return (
    <section className="learner-mini-panel export-deliverables-panel" data-train-section="export-deliverables">
      <div className="output-header">
        <div>
          <h3>Export deliverables</h3>
          <p>Each handoff explains who it is for, what proof it needs, and what file it produces.</p>
        </div>
        <button className="primary-button compact-button" type="button" onClick={onOpenExport}>
          <PackageCheck size={15} />
          Package exports
        </button>
      </div>
      <div className="deliverable-grid">
        {featured.map((preset) => (
          <article key={preset.id}>
            <FileText size={16} />
            <strong>{preset.label}</strong>
            <p>{preset.detail}</p>
            <span>{preset.filename}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProjectHistoryPanel({
  history,
  onRestore,
}: {
  history: ProjectSnapshot[];
  onRestore: (snapshot: ProjectSnapshot) => void;
}) {
  return (
    <section className="learner-mini-panel project-history-panel" data-train-section="project-history">
      <div className="output-header">
        <div>
          <h3>Project history</h3>
          <p>Saved snapshots keep prompt text, profile, proof, and export readiness together.</p>
        </div>
        <History size={16} />
      </div>
      <div className="project-history-list">
        {history.slice(0, 5).map((snapshot) => (
          <button key={snapshot.id} type="button" onClick={() => onRestore(snapshot)}>
            <ShieldCheck size={15} />
            <div>
              <strong>{snapshot.label}</strong>
              <p>{new Date(snapshot.savedAt).toLocaleString()} / prompt {snapshot.promptScore ?? 0} / proof {snapshot.proofScore ?? 0}</p>
            </div>
            <span>{snapshot.exportReadyCount ?? 0}/{snapshot.exportPresetCount ?? 0}</span>
          </button>
        ))}
        {!history.length ? <p className="selected-meta">No project snapshots yet.</p> : null}
      </div>
    </section>
  );
}

export function LearnerCommandDeck({
  activeTab,
  currentAction,
  latestSession,
  onOpenLatest,
  onSetTab,
  stats,
  steps,
}: {
  activeTab: LearnerWorkspaceTab;
  currentAction: string;
  latestSession?: LearnerSession;
  onOpenLatest: (session: LearnerSession) => void;
  onSetTab: (tab: LearnerWorkspaceTab) => void;
  stats: {
    exportReadyCount: number;
    presetCount: number;
    proofScore: number;
    proofItems: number;
    promptScore: number;
    sessions: number;
  };
  steps: LearnerOperatingLoop["steps"];
}) {
  const activeStep = steps.find((step) => step.status === "active") ?? steps.find((step) => step.status === "next") ?? steps[steps.length - 1];
  return (
    <section className="learner-command-deck" data-train-section="learner-command-deck">
      <article className="command-next-card">
        <span>Next best action</span>
        <strong>{activeStep?.label ?? "Export"}</strong>
        <p>{currentAction}</p>
        <div className="button-row compact-row">
          <button className="primary-button compact-button" type="button" onClick={() => onSetTab(activeStep?.target ?? activeTab)}>
            Go to {activeStep?.label ?? "Export"}
            <ArrowRight size={14} />
          </button>
          {latestSession ? (
            <button className="ghost-button compact-button" type="button" onClick={() => onOpenLatest(latestSession)}>
              Reopen latest
            </button>
          ) : null}
        </div>
      </article>

      <article className="command-session-card">
        <span>Current run</span>
        <strong>{latestSession?.title ?? "Fresh prompt run"}</strong>
        <p>
          {latestSession
            ? `${stats.sessions} saved run(s). ${latestSession.profileLabel} is available as the latest reference.`
            : "Paste or generate a prompt, review the section changes, attach proof, then export."}
        </p>
      </article>

      <div className="command-metric-grid" aria-label="Run readiness">
        <article>
          <strong>{stats.promptScore}</strong>
          <span>prompt</span>
        </article>
        <article>
          <strong>{stats.proofScore}</strong>
          <span>proof</span>
        </article>
        <article>
          <strong>{stats.exportReadyCount}/{stats.presetCount}</strong>
          <span>exports</span>
        </article>
        <article>
          <strong>{stats.proofItems}</strong>
          <span>proof items</span>
        </article>
      </div>
    </section>
  );
}

export function OneClickProofRail({
  onRun,
  score,
  steps,
}: {
  onRun: () => void;
  score: number;
  steps: OneClickProofStep[];
}) {
  const readyCount = steps.filter((step) => step.status === "ready").length;
  const blocked = steps.some((step) => step.status === "blocked");
  return (
    <section className="learner-mini-panel one-click-proof-rail" data-train-section="one-click-proof-rail">
      <div className="output-header">
        <div>
          <h3>One-click prompt path</h3>
          <p>Run the useful path as one guided action: patch, revise, save proof, save session, and open export.</p>
        </div>
        <span className="selected-meta">{readyCount}/{steps.length} ready</span>
      </div>
      <div className="one-click-proof-layout">
        <div className="one-click-proof-score">
          <strong>{score}</strong>
          <span>path score</span>
        </div>
        <div className="one-click-proof-steps">
          {steps.map((step) => (
            <article data-status={step.status} key={step.id}>
              <strong>{step.label}</strong>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
        <button className="primary-button compact-button" type="button" onClick={onRun} disabled={blocked && readyCount === 0}>
          Run guided path
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}

export function ImportFrontDoorPanel({
  items,
  onFiles,
  onUseItem,
}: {
  items: ImportFrontDoorItem[];
  onFiles: (files: FileList | File[]) => void;
  onUseItem: (item: ImportFrontDoorItem) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const counts = items.reduce(
    (map, item) => ({ ...map, [item.status]: (map[item.status] ?? 0) + 1 }),
    { ready: 0, review: 0, blocked: 0 },
  );
  return (
    <section className="learner-mini-panel import-front-door-panel" data-train-section="import-front-door">
      <div className="output-header">
        <div>
          <h3>Import front door</h3>
          <p>Drop text, Markdown, JSON, or JSONL prompts into a review lane before they touch memory.</p>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={() => inputRef.current?.click()}>
          <Upload size={15} />
          Add files
        </button>
      </div>
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept=".txt,.md,.json,.jsonl,text/plain,application/json"
        multiple
        onChange={(event) => {
          if (event.target.files) onFiles(event.target.files);
          event.currentTarget.value = "";
        }}
      />
      <div
        className="proof-dropzone import-dropzone"
        data-dragging={dragging ? "true" : "false"}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          onFiles(event.dataTransfer.files);
        }}
      >
        <Upload size={32} />
        <div>
          <strong>Drop prompts here</strong>
          <p>Secret-shaped text is blocked, near-empty files go to review, and safe prompts can become the working prompt.</p>
        </div>
      </div>
      <div className="mini-stat-row">
        <span>{counts.ready} ready</span>
        <span>{counts.review} review</span>
        <span>{counts.blocked} blocked</span>
      </div>
      <div className="import-front-door-list">
        {items.slice(0, 6).map((item) => (
          <article data-status={item.status} key={item.id}>
            <span>{item.kind} / {item.words} words</span>
            <strong>{item.filename}</strong>
            <p>{item.reason}</p>
            <button className="ghost-button compact-button" type="button" onClick={() => onUseItem(item)} disabled={item.status === "blocked"}>
              Use as prompt
            </button>
          </article>
        ))}
        {!items.length ? <p className="selected-meta">No imported files yet.</p> : null}
      </div>
    </section>
  );
}

export function ProjectPersistencePanel({
  activeSnapshot,
  copied,
  onCopy,
  onRestore,
  onSave,
}: {
  activeSnapshot?: ProjectSnapshot;
  copied: string;
  onCopy: (value: string, key: string) => void;
  onRestore: (snapshot: ProjectSnapshot) => void;
  onSave: () => ProjectSnapshot;
}) {
  const [snapshot, setSnapshot] = useState<ProjectSnapshot | undefined>(activeSnapshot);
  useEffect(() => setSnapshot(activeSnapshot), [activeSnapshot]);
  const payload = snapshot ? JSON.stringify(snapshot, null, 2) : "";
  return (
    <section className="learner-mini-panel project-persistence-panel" data-train-section="project-persistence">
      <div className="output-header">
        <div>
          <h3>Project persistence</h3>
          <p>Save the current prompt, profile, and proof vault into one restorable browser snapshot.</p>
        </div>
        <button
          className="primary-button compact-button"
          type="button"
          onClick={() => {
            const next = onSave();
            setSnapshot(next);
          }}
        >
          <Save size={15} />
          Save snapshot
        </button>
      </div>
      <div className="project-persistence-card">
        <strong>{snapshot?.label ?? "No snapshot saved yet"}</strong>
        <span>{snapshot ? new Date(snapshot.savedAt).toLocaleString() : "local browser snapshot"}</span>
        <p>{snapshot ? `${snapshot.proofArtifacts.length} proof artifact(s), profile ${snapshot.profileId}.` : "Save once before large imports, proof runs, or export changes."}</p>
        <div className="button-row compact-row">
          <button className="ghost-button compact-button" type="button" onClick={() => snapshot && onRestore(snapshot)} disabled={!snapshot}>
            Restore
          </button>
          <button className="ghost-button compact-button" type="button" onClick={() => payload && onCopy(payload, "project-snapshot-json")} disabled={!payload}>
            {copied === "project-snapshot-json" ? <Check size={15} /> : <Copy size={15} />}
            Copy JSON
          </button>
        </div>
      </div>
    </section>
  );
}

export function ProofQualityLeaderboardPanel({
  onSelectRow,
  rows,
}: {
  onSelectRow: (row: ProofLeaderboardRow) => void;
  rows: ProofLeaderboardRow[];
}) {
  return (
    <section className="learner-mini-panel proof-quality-leaderboard" data-train-section="proof-quality-leaderboard">
      <div className="output-header">
        <div>
          <h3>Proof quality leaderboard</h3>
          <p>Rank prompts by buildability plus actual proof instead of text strength alone.</p>
        </div>
        <span className="selected-meta">{rows.length} ranked</span>
      </div>
      <div className="proof-leaderboard-list">
        {rows.slice(0, 8).map((row, index) => (
          <button key={row.id} type="button" onClick={() => onSelectRow(row)}>
            <em>{index + 1}</em>
            <div>
              <strong>{row.title}</strong>
              <p>{row.detail}</p>
            </div>
            <span>{row.score}</span>
          </button>
        ))}
        {!rows.length ? <p className="selected-meta">Save proof or learner sessions to populate the leaderboard.</p> : null}
      </div>
    </section>
  );
}

export function ProductionHardeningPanel({
  checks,
  copied,
  onCopy,
}: {
  checks: { label: string; ready: boolean; detail: string }[];
  copied: string;
  onCopy: (value: string, key: string) => void;
}) {
  const ready = checks.filter((check) => check.ready).length;
  const payload = checks.map((check) => `- ${check.ready ? "Ready" : "Watch"}: ${check.label} - ${check.detail}`).join("\n");
  return (
    <section className="learner-mini-panel production-hardening-panel" data-train-section="production-hardening">
      <div className="output-header">
        <div>
          <h3>Production hardening</h3>
          <p>Deployability, CI artifacts, secret boundary, and smoke proof in one readiness view.</p>
        </div>
        <span className="selected-meta">{ready}/{checks.length} ready</span>
      </div>
      <div className="production-hardening-grid">
        {checks.map((check) => (
          <article data-ready={check.ready ? "true" : "false"} key={check.label}>
            <strong>{check.label}</strong>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>
      <button className="ghost-button compact-button" type="button" onClick={() => onCopy(payload, "production-hardening-checks")}>
        {copied === "production-hardening-checks" ? <Check size={15} /> : <Copy size={15} />}
        Copy readiness notes
      </button>
    </section>
  );
}

export function ProofRepairStudioPanel({
  copied,
  draft,
  onBuild,
  onCopy,
  onUse,
}: {
  copied: string;
  draft: ProofRepairDraft;
  onBuild: () => void;
  onCopy: (value: string, key: string) => void;
  onUse: () => void;
}) {
  return (
    <section className="proof-repair-studio-panel" data-train-section="proof-repair-studio" data-ready={draft.ready ? "true" : "false"}>
      <div className="output-header">
        <div>
          <h3>Proof repair studio</h3>
          <p>{draft.detail}</p>
        </div>
        <div className="button-row compact-row">
          <button className="primary-button compact-button" type="button" onClick={onBuild}>
            <Wrench size={15} />
            Build repair
          </button>
          <button className="ghost-button compact-button" type="button" onClick={onUse} disabled={!draft.ready}>
            Use repair
          </button>
        </div>
      </div>
      <div className="proof-repair-layout">
        <article>
          <span>{draft.source}</span>
          <strong>{draft.headline}</strong>
          <ul>
            {draft.targets.slice(0, 6).map((target) => (
              <li key={target}>{target}</li>
            ))}
          </ul>
        </article>
        <article>
          <textarea className="generated-output mini-output" readOnly value={draft.prompt} />
          <button className="ghost-button compact-button" type="button" onClick={() => onCopy(draft.prompt, "proof-repair-draft")} disabled={!draft.prompt}>
            {copied === "proof-repair-draft" ? <Check size={15} /> : <Copy size={15} />}
            Copy repair
          </button>
        </article>
      </div>
    </section>
  );
}

export function ProjectBundlePanel({
  bundles,
  copied,
  onCopy,
  onExport,
  onImport,
  onRestore,
}: {
  bundles: ProjectBundle[];
  copied: string;
  onCopy: (value: string, key: string) => void;
  onExport: () => ProjectBundle;
  onImport: (value: string) => void;
  onRestore: (bundle: ProjectBundle) => void;
}) {
  const [draft, setDraft] = useState("");
  const latest = bundles[0];
  const latestJson = latest ? JSON.stringify(latest, null, 2) : "";
  return (
    <section className="project-bundle-panel" data-train-section="project-bundle">
      <div className="output-header">
        <div>
          <h3>Project bundle</h3>
          <p>Export or import one portable project file with prompts, proof, history, and target handoff context.</p>
        </div>
        <div className="button-row compact-row">
          <button
            className="primary-button compact-button"
            type="button"
            onClick={() => {
              const bundle = onExport();
              setDraft(JSON.stringify(bundle, null, 2));
            }}
          >
            <Download size={15} />
            Export bundle
          </button>
          <button className="ghost-button compact-button" type="button" onClick={() => latestJson && onCopy(latestJson, "project-bundle-json")} disabled={!latestJson}>
            {copied === "project-bundle-json" ? <Check size={15} /> : <Copy size={15} />}
            Copy JSON
          </button>
        </div>
      </div>
      <div className="project-bundle-layout">
        <article>
          <span>{bundles.length} saved</span>
          <strong>{latest?.title || "No portable bundle yet"}</strong>
          <p>{latest ? `${latest.proofArtifacts.length} proof artifact(s), ${latest.proofRuns.length} proof run(s), ${latest.targetExports.length} export target(s).` : "Export a bundle before moving work across machines or agents."}</p>
          <div className="bundle-list">
            {bundles.slice(0, 3).map((bundle) => (
              <button key={bundle.id} type="button" onClick={() => onRestore(bundle)}>
                <ShieldCheck size={14} />
                <span>{bundle.title}</span>
              </button>
            ))}
          </div>
        </article>
        <article>
          <label className="field">
            <span>Import bundle JSON</span>
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Paste a project bundle JSON file here..." />
          </label>
          <button className="ghost-button compact-button" type="button" onClick={() => onImport(draft)} disabled={!draft.trim()}>
            <Upload size={15} />
            Import bundle
          </button>
        </article>
      </div>
    </section>
  );
}

export function RegressionTrendPanel({ trend }: { trend: RegressionTrendSummary }) {
  return (
    <section className="regression-trend-panel" data-train-section="regression-trends" data-status={trend.status}>
      <div className="output-header">
        <div>
          <h3>Regression trends</h3>
          <p>Score movement is summarized from eval history so improvements do not quietly regress.</p>
        </div>
        <div className="mini-score-badge">
          <strong>{trend.average}</strong>
          <span>{trend.status}</span>
        </div>
      </div>
      <div className="trend-row-list">
        {trend.rows.slice(0, 6).map((row) => (
          <article data-status={row.status} key={row.id}>
            <div>
              <strong>{row.label}</strong>
              <p>{row.detail}</p>
            </div>
            <span>{row.promptScore}/{row.proofScore}</span>
            <em>{row.delta >= 0 ? `+${row.delta}` : row.delta}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AccessibilityQaPanel({
  copied,
  onApplyPatch,
  onCopy,
  onRun,
  report,
}: {
  copied: string;
  onApplyPatch: (patch: string) => void;
  onCopy: (value: string, key: string) => void;
  onRun: () => void;
  report: AccessibilityQaReport;
}) {
  const patchPayload = report.checks.filter((check) => !check.ready).map((check) => check.patch).join("\n");
  return (
    <section className="accessibility-qa-panel" data-train-section="accessibility-qa">
      <div className="output-header">
        <div>
          <h3>Accessibility QA</h3>
          <p>{report.headline}{report.lastRunAt ? ` / last checked ${new Date(report.lastRunAt).toLocaleString()}` : ""}</p>
        </div>
        <div className="mini-score-badge">
          <strong>{report.score}</strong>
          <span>a11y</span>
        </div>
      </div>
      <div className="accessibility-check-grid">
        {report.checks.map((check) => (
          <article data-ready={check.ready ? "true" : "false"} key={check.id}>
            {check.ready ? <Check size={15} /> : <MonitorCheck size={15} />}
            <strong>{check.label}</strong>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>
      <div className="button-row compact-row">
        <button className="primary-button compact-button" type="button" onClick={onRun}>
          Run QA score
        </button>
        <button className="ghost-button compact-button" type="button" onClick={() => onApplyPatch(patchPayload)} disabled={!patchPayload}>
          Apply missing gates
        </button>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(patchPayload || "Accessibility QA checks are currently satisfied.", "accessibility-qa-patch")}>
          {copied === "accessibility-qa-patch" ? <Check size={15} /> : <Copy size={15} />}
          Copy gates
        </button>
      </div>
    </section>
  );
}

export function EmptyStateShelfPanel({
  cards,
  onSelectTarget,
}: {
  cards: EmptyStateCard[];
  onSelectTarget: (target: EmptyStateCard["target"]) => void;
}) {
  return (
    <section className="empty-state-shelf-panel" data-train-section="empty-state-shelf">
      <div className="output-header">
        <div>
          <h3>Empty states</h3>
          <p>Blank areas now explain what to do next instead of showing raw counters or dead space.</p>
        </div>
        <ListChecks size={18} />
      </div>
      <div className="empty-state-grid">
        {cards.map((card) => (
          <button data-ready={card.ready ? "true" : "false"} key={card.id} type="button" onClick={() => onSelectTarget(card.target)}>
            <span>{card.ready ? "Ready" : "Empty"}</span>
            <strong>{card.label}</strong>
            <p>{card.detail}</p>
            <small>{card.cta}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export function LearnedPromptSectionEditor({
  copied,
  onApplyPrompt,
  onCopy,
  sections,
}: {
  copied: string;
  onApplyPrompt?: (value: string) => void;
  onCopy: (value: string, key: string) => void;
  sections: LearnedPromptSection[];
}) {
  const initialDrafts = useMemo(() => Object.fromEntries(sections.map((section) => [section.id, section.content])), [sections]);
  const [drafts, setDrafts] = useState<Record<string, string>>(initialDrafts);

  useEffect(() => {
    setDrafts(initialDrafts);
  }, [initialDrafts]);

  const combinedDraft = sections.map((section) => drafts[section.id] || section.content).join("\n\n");

  return (
    <section className="section-editor-panel" data-train-section="learner-section-editor">
      <div className="output-header">
        <div>
          <h3>Generated prompt section editor</h3>
          <p>Edit one section without flattening the whole prompt. Thin sections stay visibly marked.</p>
        </div>
        <div className="button-row compact-row">
          <button className="ghost-button compact-button" type="button" onClick={() => setDrafts(initialDrafts)}>
            Reset
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onApplyPrompt?.(combinedDraft)}>
            <Check size={15} />
            Apply edits
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onCopy(combinedDraft, "section-editor-all")}>
            {copied === "section-editor-all" ? <Check size={15} /> : <Copy size={15} />}
            Copy all
          </button>
        </div>
      </div>
      <div className="section-editor-grid">
        {sections.map((section) => (
          <article className="section-editor-card" data-status={section.status} key={section.id}>
            <div>
              <strong>{section.label}</strong>
              <span>{section.status} / {section.detail}</span>
            </div>
            <textarea
              value={drafts[section.id] ?? section.content}
              onChange={(event) => setDrafts((current) => ({ ...current, [section.id]: event.target.value }))}
            />
            <div className="button-row compact-row">
              <button className="ghost-button compact-button" type="button" onClick={() => onCopy(drafts[section.id] ?? section.content, `section-${section.id}`)}>
                {copied === `section-${section.id}` ? <Check size={15} /> : <Copy size={15} />}
                Copy section
              </button>
              <small>{section.rewriteHint}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProofIntakePanel({
  onRecordOutcomeFeedback,
}: {
  onRecordOutcomeFeedback: (rating: OutcomeRating, notes: string, screenshotUrl: string, screenshotNotes: string) => void;
}) {
  const [rating, setRating] = useState<OutcomeRating>("great");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [viewport, setViewport] = useState("desktop");
  const [isDragging, setIsDragging] = useState(false);
  const [notes, setNotes] = useState("Result matched the intended layout, media treatment, hierarchy, and responsive behavior.");
  const [screenshotNotes, setScreenshotNotes] = useState("Desktop and mobile screenshots prove the build is nonblank, readable, and overflow-free.");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function ingestFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setScreenshotNotes(`Rejected ${file.name}: proof files must be images.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      setPreviewUrl(value);
      setScreenshotUrl(value);
      setScreenshotNotes(`${viewport} screenshot: ${file.name}. Confirm first viewport is nonblank, text fits, and no horizontal overflow is visible.`);
    };
    reader.readAsDataURL(file);
  }

  function saveProof() {
    const taggedNotes = `[${viewport}] ${screenshotNotes}`;
    onRecordOutcomeFeedback(rating, notes, screenshotUrl, taggedNotes);
  }

  return (
    <section className="learner-mini-panel proof-intake-panel" data-train-section="proof-intake">
      <div className="output-header">
        <div>
          <h3>Screenshot proof intake</h3>
          <p>Attach the actual result evidence that should influence future prompts.</p>
        </div>
        <button
          className="primary-button compact-button"
          type="button"
          onClick={saveProof}
        >
          <Save size={15} />
          Save proof
        </button>
      </div>
      <div className="proof-intake-grid">
        <label className="field">
          <span>Rating</span>
          <select value={rating} onChange={(event) => setRating(event.target.value as OutcomeRating)}>
            <option value="great">Great</option>
            <option value="okay">Okay</option>
            <option value="bad">Bad</option>
            <option value="unrated">Unrated</option>
          </select>
        </label>
        <label className="field">
          <span>Viewport</span>
          <select value={viewport} onChange={(event) => setViewport(event.target.value)}>
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
            <option value="wide">Wide desktop</option>
            <option value="tablet">Tablet</option>
          </select>
        </label>
        <label className="field">
          <span>Screenshot URL or path</span>
          <input value={screenshotUrl} onChange={(event) => setScreenshotUrl(event.target.value)} placeholder="/tmp/desktop.png or https://..." />
        </label>
        <div
          className="proof-dropzone"
          data-dragging={isDragging ? "true" : "false"}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            ingestFile(event.dataTransfer.files[0]);
          }}
        >
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(event) => ingestFile(event.target.files?.[0])} />
          {previewUrl ? <img src={previewUrl} alt="Uploaded proof preview" /> : <Upload size={18} />}
          <div>
            <strong>{previewUrl ? "Screenshot preview loaded" : "Drop screenshot here"}</strong>
            <span>Desktop, mobile, wide, or tablet proof. URL/path still works too.</span>
          </div>
          <button className="ghost-button compact-button" type="button" onClick={() => fileInputRef.current?.click()}>
            Choose file
          </button>
        </div>
        <label className="field">
          <span>Result notes</span>
          <textarea className="compact-textarea" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
        <label className="field">
          <span>Screenshot notes</span>
          <textarea className="compact-textarea" value={screenshotNotes} onChange={(event) => setScreenshotNotes(event.target.value)} />
        </label>
      </div>
      <div className="proof-template-row">
        {[
          ["Desktop proof", "Desktop screenshot: first viewport, no console errors, readable text, no horizontal overflow."],
          ["Mobile proof", "Mobile screenshot: navigation works, text wraps cleanly, controls fit, no clipped primary content."],
          ["Media proof", "Media proof: video/image renders nonblank, focal point is correct, and content does not hide controls."],
        ].map(([label, value]) => (
          <button className="ghost-button compact-button" key={label} type="button" onClick={() => setScreenshotNotes(value)}>
            <ImagePlus size={14} />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

export function CorpusTriageToolbar({
  onReviewCorpusCandidate,
  rows,
}: {
  onReviewCorpusCandidate: (row: CorpusReviewRow, action: "import" | "gold" | "bad" | "quarantine" | "merge", notes: string) => void;
  rows: CorpusReviewRow[];
}) {
  const [filter, setFilter] = useState<"review" | "gold" | "quarantine" | "all">("review");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const visibleRows = rows.filter((row) => {
    if (filter === "all") return true;
    if (filter === "gold") return row.decision === "gold" || row.decision === "learn";
    return row.decision === filter;
  });
  const firstReview = visibleRows.find((row) => row.decision === "review") ?? visibleRows[0] ?? rows[0];
  const selectedRows = rows.filter((row) => selectedIds[row.id]);
  const counts = {
    gold: rows.filter((row) => row.decision === "gold" || row.decision === "learn").length,
    review: rows.filter((row) => row.decision === "review").length,
    quarantine: rows.filter((row) => row.decision === "quarantine").length,
  };
  const bulkTargets = selectedRows.length ? selectedRows : firstReview ? [firstReview] : [];

  function applyBulk(action: "import" | "gold" | "bad" | "quarantine" | "merge") {
    bulkTargets.forEach((row) => onReviewCorpusCandidate(row, action, `Bulk triage: ${action} from ${filter} view.`));
    setSelectedIds({});
  }

  return (
    <section className="corpus-triage-toolbar" data-train-section="corpus-triage-toolbar">
      <div>
        <span>Fast corpus triage</span>
        <strong>{firstReview?.title ?? "No candidates waiting"}</strong>
        <p>{firstReview ? `${firstReview.score}% / ${firstReview.cluster} / ${firstReview.reasons[0] ?? firstReview.duplicate}` : "Paste a batch to review candidates here."}</p>
      </div>
      <div className="triage-counts">
        <span>{counts.gold} gold</span>
        <span>{counts.review} review</span>
        <span>{counts.quarantine} quarantine</span>
        <span>{selectedRows.length} selected</span>
      </div>
      <div className="triage-filter-row" aria-label="Corpus triage filters">
        {(["review", "gold", "quarantine", "all"] as const).map((key) => (
          <button className="ghost-button compact-button" data-active={filter === key ? "true" : "false"} key={key} type="button" onClick={() => setFilter(key)}>
            {key}
          </button>
        ))}
      </div>
      <div className="triage-select-list">
        {visibleRows.slice(0, 5).map((row) => (
          <label key={row.id}>
            <input
              checked={Boolean(selectedIds[row.id])}
              type="checkbox"
              onChange={(event) => setSelectedIds((current) => ({ ...current, [row.id]: event.target.checked }))}
            />
            <span>{row.title}</span>
            <small>{row.score}% / {row.decision}</small>
          </label>
        ))}
      </div>
      {firstReview ? (
        <div className="button-row compact-row">
          <button className="ghost-button compact-button" type="button" onClick={() => applyBulk("gold")}>Gold selected</button>
          <button className="ghost-button compact-button" type="button" onClick={() => applyBulk("import")}>Import selected</button>
          <button className="ghost-button compact-button" type="button" onClick={() => applyBulk("quarantine")}>Quarantine selected</button>
        </div>
      ) : null}
    </section>
  );
}

export function BeginnerPromptPath({
  onUseBriefPrompt,
  score,
}: {
  onUseBriefPrompt: () => void;
  score: number;
}) {
  return (
    <section className="beginner-prompt-path" data-train-section="beginner-prompt-path">
      <div>
        <span><Sparkles size={14} /> Guided start</span>
        <strong>Make me a website prompt</strong>
        <p>Use the brief builder when you do not want to paste a perfect example first.</p>
      </div>
      <div className="beginner-step-row">
        <article>
          <strong>1</strong>
          <span>Describe the site</span>
        </article>
        <article>
          <strong>2</strong>
          <span>Apply learned taste</span>
        </article>
        <article>
          <strong>3</strong>
          <span>Review proof gaps</span>
        </article>
      </div>
      <button className="primary-button compact-button" type="button" onClick={onUseBriefPrompt}>
        Start from brief
        <ArrowRight size={14} />
      </button>
      <small>Current prompt strength: {score}/100</small>
    </section>
  );
}

export function LearnerActivityRail({ items }: { items: LearnerActivityItem[] }) {
  return (
    <section className="learner-activity-rail" data-train-section="learner-activity">
      <div className="output-header">
        <div>
          <h3>Recent activity</h3>
          <p>Exports, proof saves, corpus decisions, and section edits stay visible here.</p>
        </div>
        <Clock size={16} />
      </div>
      <div className="activity-list">
        {items.length ? (
          items.slice(0, 6).map((item) => (
            <article data-tone={item.tone ?? "neutral"} key={item.id}>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
              <span>{item.at}</span>
            </article>
          ))
        ) : (
          <p className="selected-meta">No actions yet. Apply edits, save proof, export, or triage corpus rows.</p>
        )}
      </div>
    </section>
  );
}

export function LearnerMobileStepBar({
  activeTab,
  onOpenExport,
  onSetTab,
}: {
  activeTab: LearnerWorkspaceTab;
  onOpenExport: () => void;
  onSetTab: (tab: LearnerWorkspaceTab) => void;
}) {
  const tabs: { id: LearnerWorkspaceTab; label: string }[] = [
    { id: "compose", label: "Compose" },
    { id: "review", label: "Review" },
    { id: "export", label: "Export" },
  ];
  return (
    <nav className="learner-mobile-step-bar" aria-label="Learner mobile steps">
      {tabs.map((tab) => (
        <button data-active={activeTab === tab.id ? "true" : "false"} key={tab.id} type="button" onClick={() => onSetTab(tab.id)}>
          {tab.label}
        </button>
      ))}
      <button className="export-step" type="button" onClick={onOpenExport}>
        Center
      </button>
    </nav>
  );
}

export function ProofDeployStatusPanel({ status }: { status: LearnerProofDeployStatus }) {
  return (
    <section className="learner-mini-panel proof-deploy-status" data-train-section="proof-deploy-status">
      <div className="output-header">
        <div>
          <h3>Proof and deploy status</h3>
          <p>{status.headline}: {status.detail}</p>
        </div>
        <a className="ghost-button compact-button" href={status.liveUrl} target="_blank" rel="noreferrer">
          <ExternalLink size={15} />
          Live site
        </a>
      </div>
      <div className="proof-status-grid">
        {status.metadata.map((item) => (
          <article data-ready={item.ready ? "true" : "false"} key={item.label}>
            <MonitorCheck size={15} />
            <strong>{item.label}</strong>
            <p>{item.value}</p>
          </article>
        ))}
        {status.checks.map((check) => (
          <article data-ready={check.ready ? "true" : "false"} key={check.label}>
            <MonitorCheck size={15} />
            <strong>{check.label}</strong>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>
      <div className="proof-command-list">
        {status.commands.map((command) => (
          <code key={command}>{command}</code>
        ))}
      </div>
    </section>
  );
}

export function ExportPresetPreview({
  copied,
  onCopy,
  onExportLearnerPack,
  presets,
}: {
  copied: string;
  onCopy: (value: string, key: string) => void;
  onExportLearnerPack: () => void;
  presets: TargetExportPreset[];
}) {
  const [selectedPresetId, setSelectedPresetId] = useState(presets[0]?.id ?? "");
  useEffect(() => {
    if (!presets.some((preset) => preset.id === selectedPresetId)) {
      setSelectedPresetId(presets[0]?.id ?? "");
    }
  }, [presets, selectedPresetId]);
  const selectedPreset = presets.find((preset) => preset.id === selectedPresetId) ?? presets[0];
  const targetChanges = selectedPreset ? describeTargetPreset(selectedPreset) : [];

  return (
    <section className="learner-mini-panel export-preset-preview" data-learner-section="export-preset-preview" data-train-section="target-export-presets">
      <div className="output-header">
        <div>
          <h3>Target export presets</h3>
          <p>Pick the target first, preview the actual handoff, then copy or download the pack.</p>
        </div>
        <div className="button-row compact-row">
          <button className="ghost-button compact-button" type="button" onClick={onExportLearnerPack}>
            <Download size={15} />
            Download pack
          </button>
          {selectedPreset ? (
            <button className="primary-button compact-button" type="button" onClick={() => onCopy(selectedPreset.content, `target-${selectedPreset.id}`)}>
              {copied === `target-${selectedPreset.id}` ? <Check size={15} /> : <Copy size={15} />}
              Copy preset
            </button>
          ) : null}
        </div>
      </div>
      <div className="preset-preview-layout">
        <div className="preset-selector-list">
          {presets.map((preset) => (
            <button data-active={preset.id === selectedPreset?.id ? "true" : "false"} key={preset.id} type="button" onClick={() => setSelectedPresetId(preset.id)}>
              <strong>{preset.label}</strong>
              <span>{preset.filename}</span>
            </button>
          ))}
        </div>
        <textarea className="generated-output mini-output preset-preview-output" readOnly value={selectedPreset?.content ?? ""} />
      </div>
      {selectedPreset ? (
        <div className="target-difference-panel">
          <p className="selected-meta">
            <ListChecks size={14} /> {selectedPreset.detail}
          </p>
          <strong>How this target changes the handoff</strong>
          <ul>
            {targetChanges.map((change) => (
              <li key={change}>{change}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function describeTargetPreset(preset: TargetExportPreset) {
  const label = `${preset.label} ${preset.filename}`.toLowerCase();
  if (label.includes("codex")) {
    return ["Keeps implementation scope, file edits, and verification commands explicit.", "Includes proof gates so the build agent has a clear done state."];
  }
  if (label.includes("claude")) {
    return ["Adds critique-friendly context and missing-proof questions.", "Keeps memory concise enough for project instructions or artifact prompts."];
  }
  if (label.includes("v0")) {
    return ["Compresses the prompt into UI-first implementation details.", "Highlights exact visual constraints while removing repo-operation noise."];
  }
  if (label.includes("lovable")) {
    return ["Frames the prompt as an app-builder task with states and validation.", "Keeps first-screen usefulness, data states, and responsive behavior explicit."];
  }
  if (label.includes("bolt")) {
    return ["Optimizes for fast scaffold generation without extra dependencies.", "Keeps media, focus states, and no-go rules visible in the build brief."];
  }
  if (label.includes("raw") || label.includes("implementation-spec")) {
    return ["Removes tool-specific phrasing so any builder can consume the spec.", "Keeps acceptance gates and non-goals explicit for neutral implementation."];
  }
  if (label.includes("jsonl") || label.includes("finetune")) {
    return ["Packages one supervised training row with prompt, response, metadata, and scorecard.", "Keeps proof requirements machine-readable for future model tuning."];
  }
  if (label.includes("json")) {
    return ["Normalizes the prompt into model-training rows.", "Keeps quality metadata and proof expectations machine-readable."];
  }
  if (label.includes("cursor")) {
    return ["Frames the prompt as a scoped code-edit task.", "Emphasizes existing project boundaries, checks, and expected file changes."];
  }
  return ["Keeps the neutral source spec portable across builders.", "Preserves exact assets, stack, responsive rules, and acceptance gates."];
}

export function LearnerWorkspaceSearchPanel({
  onUseResult,
  results,
}: {
  onUseResult: (result: LearnerSearchResult) => void;
  results: LearnerSearchResult[];
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const visible = (normalized
    ? results.filter((result) => `${result.kind} ${result.title} ${result.detail}`.toLowerCase().includes(normalized))
    : results
  ).slice(0, 8);
  const counts = results.reduce<Record<LearnerSearchResult["kind"], number>>(
    (map, result) => ({ ...map, [result.kind]: (map[result.kind] ?? 0) + 1 }),
    { session: 0, proof: 0, export: 0, corpus: 0, sample: 0 },
  );

  return (
    <section className="learner-mini-panel workspace-search-panel" data-train-section="workspace-search">
      <div className="output-header">
        <div>
          <h3>Workspace search</h3>
          <p>Search sessions, proof, exports, corpus rows, and examples from one place.</p>
        </div>
        <Search size={16} />
      </div>
      <label className="search-field">
        <Search size={15} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search prompts, proof, exports, sessions..." />
      </label>
      <div className="mini-stat-row">
        <span>{counts.session} sessions</span>
        <span>{counts.proof} proof</span>
        <span>{counts.export} exports</span>
        <span>{counts.corpus} corpus</span>
        <span>{counts.sample} samples</span>
      </div>
      <div className="workspace-search-results">
        {visible.map((result) => (
          <button key={result.id} type="button" onClick={() => onUseResult(result)}>
            <span>{result.kind}</span>
            <strong>{result.title}</strong>
            <p>{result.detail}</p>
            <small>{result.actionLabel ?? "Open"}</small>
          </button>
        ))}
        {!visible.length ? <p className="selected-meta">No matching workspace items.</p> : null}
      </div>
    </section>
  );
}

export function PromptLintFixPanel({
  fixes,
  onApplyFix,
}: {
  fixes: PromptLintFix[];
  onApplyFix: (fix: PromptLintFix) => void;
}) {
  return (
    <section className="learner-mini-panel prompt-lint-panel" data-train-section="prompt-lint-fixes">
      <div className="output-header">
        <div>
          <h3>Prompt lint fixes</h3>
          <p>One-click patches for missing proof, assets, responsive behavior, and no-go rules.</p>
        </div>
        <span className="selected-meta">{fixes.length} issue(s)</span>
      </div>
      <div className="lint-fix-grid">
        {fixes.map((fix) => (
          <button data-severity={fix.severity} key={fix.id} type="button" onClick={() => onApplyFix(fix)}>
            <strong>{fix.label}</strong>
            <p>{fix.detail}</p>
            <small>Apply patch</small>
          </button>
        ))}
        {!fixes.length ? <p className="selected-meta">No lint gaps detected in the working prompt.</p> : null}
      </div>
    </section>
  );
}

export function ProofArtifactVault({
  artifacts,
  copied,
  onCopy,
}: {
  artifacts: LearnerProofVaultItem[];
  copied: string;
  onCopy: (value: string, key: string) => void;
}) {
  const latest = artifacts[0];
  const payload = JSON.stringify({ schema: "prompt-atelier.proof-vault.v1", artifacts }, null, 2);
  return (
    <section className="learner-mini-panel proof-artifact-vault" data-train-section="proof-artifact-vault">
      <div className="output-header">
        <div>
          <h3>Proof artifact vault</h3>
          <p>Saved proof persists in this browser and travels through exported JSON.</p>
        </div>
        <button className="ghost-button compact-button" type="button" onClick={() => onCopy(payload, "proof-vault-json")}>
          {copied === "proof-vault-json" ? <Check size={15} /> : <Copy size={15} />}
          Copy JSON
        </button>
      </div>
      <div className="proof-vault-grid">
        <article>
          <strong>{artifacts.length}</strong>
          <span>saved artifact(s)</span>
          <p>{latest ? `${latest.title} / ${latest.rating}` : "Save screenshot proof to create the first durable local artifact."}</p>
        </article>
        {artifacts.slice(0, 3).map((artifact) => (
          <article key={artifact.id}>
            <strong>{artifact.title}</strong>
            <span>{artifact.rating} / {new Date(artifact.createdAt).toLocaleString()}</span>
            <p>{artifact.screenshotNotes || artifact.notes}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProductChangelogPanel({
  items,
  status,
}: {
  items: ProductChangelogItem[];
  status: { label: string; detail: string };
}) {
  return (
    <section className="learner-mini-panel product-changelog-panel" data-train-section="product-changelog">
      <div className="output-header">
        <div>
          <h3>Product changelog</h3>
          <p>{status.detail}</p>
        </div>
        <span className="selected-meta">{status.label}</span>
      </div>
      <div className="changelog-list">
        {items.map((item) => (
          <article key={item.id}>
            <span>{item.meta}</span>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
