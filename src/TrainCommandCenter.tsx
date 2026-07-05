import { Search } from "lucide-react";
import { type CSSProperties } from "react";
import { type TrainFocusSummary } from "./learnerViewModel";

function addPercent(score: number) {
  return `${Math.max(0, Math.min(100, Math.round(score)))}%`;
}

function ScoreRing({ label, score }: { label: string; score: number }) {
  return (
    <div className="score-ring" style={{ "--score": score } as CSSProperties}>
      <strong>{addPercent(score)}</strong>
      <span>{label}</span>
    </div>
  );
}

export function TrainFocusSummaryPanel({ onSelect, report }: { onSelect: (id: string) => void; report: TrainFocusSummary }) {
  return (
    <section className="panel train-focus-summary" data-train-section="train-focus-summary">
      <div className="output-header">
        <div>
          <p className="eyebrow">Train focus summary</p>
          <h2>{report.headline}</h2>
          <p>Training is organized around the operating path, with the full diagnostic wall tucked into Advanced when you need it.</p>
        </div>
        <ScoreRing score={report.score} label="focus" />
      </div>
      <div className="train-focus-grid">
        {report.groups.map((group) => (
          <button className="train-focus-card" data-status={group.status} key={group.label} type="button" onClick={() => onSelect(group.target)}>
            <strong>{group.label}</strong>
            <span>{group.status}</span>
            <p>{group.detail}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function TrainSectionNavigator({
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
