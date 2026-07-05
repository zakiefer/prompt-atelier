import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Copy, Download, ExternalLink, ImagePlus, ListChecks, MonitorCheck, Save } from "lucide-react";
import { type OutcomeRating } from "./promptEngine";
import { type CorpusReviewRow, type LearnerSession, type TargetExportPreset } from "./learnerProduct";
import {
  type LearnedPromptSection,
  type LearnerOperatingLoop,
  type LearnerProofDeployStatus,
} from "./learnerViewModel";

export type LearnerWorkspaceTab = "compose" | "review" | "export";

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

export function LearnedPromptSectionEditor({
  copied,
  onCopy,
  sections,
}: {
  copied: string;
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
  const [notes, setNotes] = useState("Result matched the intended layout, media treatment, hierarchy, and responsive behavior.");
  const [screenshotNotes, setScreenshotNotes] = useState("Desktop and mobile screenshots prove the build is nonblank, readable, and overflow-free.");

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
          onClick={() => onRecordOutcomeFeedback(rating, notes, screenshotUrl, screenshotNotes)}
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
          <span>Screenshot URL or path</span>
          <input value={screenshotUrl} onChange={(event) => setScreenshotUrl(event.target.value)} placeholder="/tmp/desktop.png or https://..." />
        </label>
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
  const firstReview = rows.find((row) => row.decision === "review") ?? rows[0];
  const counts = {
    gold: rows.filter((row) => row.decision === "gold" || row.decision === "learn").length,
    review: rows.filter((row) => row.decision === "review").length,
    quarantine: rows.filter((row) => row.decision === "quarantine").length,
  };

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
      </div>
      {firstReview ? (
        <div className="button-row compact-row">
          <button className="ghost-button compact-button" type="button" onClick={() => onReviewCorpusCandidate(firstReview, "gold", "Fast triage: promote first review row to gold.")}>Gold first</button>
          <button className="ghost-button compact-button" type="button" onClick={() => onReviewCorpusCandidate(firstReview, "import", "Fast triage: import first review row.")}>Import first</button>
          <button className="ghost-button compact-button" type="button" onClick={() => onReviewCorpusCandidate(firstReview, "quarantine", "Fast triage: keep this row out of prompt memory.")}>Quarantine first</button>
        </div>
      ) : null}
    </section>
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
        <p className="selected-meta">
          <ListChecks size={14} /> {selectedPreset.detail}
        </p>
      ) : null}
    </section>
  );
}
