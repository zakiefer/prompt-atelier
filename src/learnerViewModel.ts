import { type DnaScoreExplanation, type Evaluation } from "./promptEngine";
import {
  type CorpusNeighbor,
  type CorpusReviewRow,
  type LearnerExportPack,
  type LearnerProofItem,
} from "./learnerProduct";
import { type HoldoutBenchmarkReport } from "./productEvolution";

export type LearnerDiagnosis = {
  strengths: string[];
  gaps: string[];
  rewriteMoves: string[];
  confidence: {
    label: "High" | "Medium" | "Needs proof";
    score: number;
    detail: string;
  };
  closestGold: string[];
};

export type LearnerProofPlan = {
  status: "proved" | "partial" | "missing";
  headline: string;
  nextAction: string;
  items: { label: string; ready: boolean; detail: string }[];
};

export type LearnerCorpusSafety = {
  label: "clean" | "review" | "quarantine";
  detail: string;
  counts: {
    website: number;
    maybe: number;
    quarantine: number;
  };
  actions: string[];
};

export type LearnerRegressionSummary = {
  label: "ready" | "thin" | "blocked";
  score: number;
  detail: string;
  rows: string[];
};

export function buildLearnerDiagnosis({
  dnaExplanation,
  evaluation,
  neighbors,
  proofGallery,
}: {
  dnaExplanation: DnaScoreExplanation;
  evaluation: Evaluation;
  neighbors: CorpusNeighbor[];
  proofGallery: LearnerProofItem[];
}): LearnerDiagnosis {
  const sortedDimensions = [...dnaExplanation.dimensions].sort((a, b) => b.score - a.score);
  const weakDimensions = [...dnaExplanation.dimensions].sort((a, b) => a.score - b.score);
  const strengths = sortedDimensions
    .filter((dimension) => dimension.score >= 70)
    .slice(0, 3)
    .map((dimension) => `${dimension.label}: ${dimension.evidence[0] || dimension.why}`);
  const gaps = weakDimensions
    .slice(0, 3)
    .map((dimension) => `${dimension.label}: ${dimension.why}`);
  const rewriteMoves = (evaluation.upgrades.length ? evaluation.upgrades : gaps)
    .slice(0, 3)
    .map((move) => move.replace(/\.$/, ""));
  const proofSignals = proofGallery.filter((item) => item.kind === "screenshot" || item.kind === "outcome").length;
  const proofScore = proofSignals ? Math.min(100, 62 + proofSignals * 12) : 42;
  const confidenceScore = Math.round((dnaExplanation.overall + evaluation.score + proofScore) / 3);
  const confidence =
    confidenceScore >= 78 && proofSignals
      ? { label: "High" as const, score: confidenceScore, detail: "Prompt text and proof signals agree." }
      : confidenceScore >= 62
        ? { label: "Medium" as const, score: confidenceScore, detail: proofSignals ? "Good structure with partial proof." : "Good structure, but still needs screenshot or outcome proof." }
        : { label: "Needs proof" as const, score: confidenceScore, detail: "Add stronger specs and result evidence before promoting this prompt." };
  return {
    strengths: strengths.length ? strengths : ["Strongest sections are still emerging from the current prompt."],
    gaps,
    rewriteMoves,
    confidence,
    closestGold: neighbors.slice(0, 3).map((neighbor) => `${neighbor.title} (${neighbor.score}/100)`),
  };
}

export function buildLearnerProofPlan({
  proofGallery,
}: {
  proofGallery: LearnerProofItem[];
}): LearnerProofPlan {
  const screenshotCount = proofGallery.filter((item) => item.kind === "screenshot").length;
  const outcomeCount = proofGallery.filter((item) => item.kind === "outcome").length;
  const sessionCount = proofGallery.filter((item) => item.kind === "session").length;
  const hasVisualProof = screenshotCount > 0;
  const hasOutcomeProof = outcomeCount > 0;
  const hasSessionProof = sessionCount > 0;
  const status = hasVisualProof && hasOutcomeProof ? "proved" : hasVisualProof || hasOutcomeProof || hasSessionProof ? "partial" : "missing";
  return {
    status,
    headline:
      status === "proved"
        ? "Proof loop is connected"
        : status === "partial"
          ? "Proof is started"
          : "Proof is missing",
    nextAction:
      status === "proved"
        ? "Use this evidence in the export pack and regression board."
        : hasVisualProof
          ? "Add outcome feedback so the learner knows whether the build actually worked."
          : "Attach desktop/mobile screenshots or run a proof capture before marking this prompt gold.",
    items: [
      { label: "Saved session", ready: hasSessionProof, detail: hasSessionProof ? `${sessionCount} saved session proof item(s).` : "Save a learner session after review." },
      { label: "Screenshot proof", ready: hasVisualProof, detail: hasVisualProof ? `${screenshotCount} screenshot proof item(s).` : "Attach or capture desktop/mobile screenshots." },
      { label: "Outcome feedback", ready: hasOutcomeProof, detail: hasOutcomeProof ? `${outcomeCount} outcome proof item(s).` : "Record whether the generated result was great, okay, or bad." },
    ],
  };
}

export function buildLearnerCorpusSafety(rows: CorpusReviewRow[]): LearnerCorpusSafety {
  const website = rows.filter((row) => row.decision === "gold" || row.decision === "learn").length;
  const maybe = rows.filter((row) => row.decision === "review").length;
  const quarantine = rows.filter((row) => row.decision === "quarantine").length;
  const label = quarantine > 0 ? "quarantine" : maybe > 0 ? "review" : "clean";
  return {
    label,
    detail:
      label === "clean"
        ? "Visible candidates look safe for website-prompt learning."
        : label === "review"
          ? "Some candidates need a human gold/bad decision before training."
          : "Quarantined candidates should stay out of prompt memory and exports.",
    counts: { website, maybe, quarantine },
    actions: [
      quarantine ? "Keep repo tasks, deploy logs, and likely secrets quarantined." : "Continue importing only high-fidelity website prompts.",
      maybe ? "Review maybe-useful rows before running training export." : "No maybe-useful rows are blocking the learner.",
      website ? "Promote clean website prompts to gold when proof exists." : "Add at least one safe website prompt candidate before batch training.",
    ],
  };
}

export function buildLearnerRegressionSummary(report: HoldoutBenchmarkReport): LearnerRegressionSummary {
  return {
    label: report.status,
    score: report.score,
    detail:
      report.status === "ready"
        ? `${report.lockedCount}/${report.rows.length} holdouts are locked for regression checks.`
        : report.status === "blocked"
          ? "A blocking quality gate is failing; do not promote memory changes yet."
          : `${report.lockedCount}/${report.rows.length} holdouts are locked; keep this report-only until coverage improves.`,
    rows: report.rows.slice(0, 3).map((row) => `${row.title}: ${row.locked ? "locked" : row.missingTraits.slice(0, 2).join(", ") || "needs coverage"}`),
  };
}

export function buildExportDifferentiators(pack: LearnerExportPack): string[] {
  const ready = pack.files.filter((file) => file.ready).length;
  return [
    `Codex: build contract, constraints, and verification ladder.`,
    `Claude: design critique, ambiguity review, and success criteria.`,
    `v0: concise UI-generation prompt with exact composition.`,
    `GPT: rewrite context plus learner memory, scorecard, and proof fields.`,
    `${ready}/${pack.files.length} export files are ready now.`,
  ];
}
