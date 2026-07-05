import { type ReactNode } from "react";
import { type PromptAnalysis, type PromptImportAudit } from "./promptEngine";

type DraftContaminationReport = {
  status: "clean" | "review" | "block";
  score: number;
  warnings: string[];
  actions: string[];
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export function FormattedMetric({ value, label }: { value: number; label: string }) {
  return <Metric value={formatNumber(value)} label={label} />;
}

export function TabButton({
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

export function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function SliderField({
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

export function Toggle({
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

export function DraftIngestionPreflight({ report }: { report: DraftContaminationReport }) {
  if (report.status === "clean" && !report.warnings.length) return null;
  return (
    <div className="analysis-card draft-preflight" data-status={report.status}>
      <div>
        <strong>{report.status === "block" ? "Import blocked" : "Review before import"}</strong>
        <span>{report.score}/100 source safety</span>
      </div>
      <div className="mini-stat-row">
        {report.warnings.map((warning) => (
          <span key={warning}>{warning}</span>
        ))}
      </div>
      <div className="batch-recommendations">
        {report.actions.slice(0, 3).map((action) => (
          <span key={action}>{action}</span>
        ))}
      </div>
    </div>
  );
}

export function SmartIngestion({ analysis }: { analysis: PromptAnalysis }) {
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

export function BatchIngestionPreview({ audit, candidateCount }: { audit: PromptImportAudit; candidateCount: number }) {
  const buckets: PromptImportAudit["items"][number]["decision"][] = ["gold", "learn", "review", "quarantine"];
  return (
    <div className="analysis-card batch-preview">
      <div>
        <strong>{candidateCount} prompt candidates detected</strong>
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
