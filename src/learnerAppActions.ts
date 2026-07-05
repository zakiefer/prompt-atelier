import { evaluatePrompt, slugify, type OutcomeRating, type OutcomeRecord, type PromptExample, type PromptLineageNode, type ScreenshotRecord } from "./promptEngine";
import { type CorpusReviewRow } from "./learnerProduct";

export type CorpusCandidateReviewAction = "import" | "gold" | "bad" | "quarantine" | "merge";

export function createCorpusCandidatePrompt(row: CorpusReviewRow): PromptExample {
  const createdAt = new Date().toISOString();
  return {
    id: `review-${slugify(row.title) || "prompt"}-${Date.now()}`,
    title: row.title,
    text: row.text,
    source: "user",
    createdAt,
  };
}

export function createCorpusReviewLineageNode(
  prompt: PromptExample,
  row: CorpusReviewRow,
  action: CorpusCandidateReviewAction,
  notes: string,
): PromptLineageNode {
  return {
    id: `lineage-review-${prompt.id}`,
    parentId: null,
    promptId: prompt.id,
    kind: "source",
    title: prompt.title,
    score: evaluatePrompt(prompt.text).score,
    status: `review-${action}`,
    detail: notes || row.reasons.join(" / ") || "Corpus review action.",
    createdAt: prompt.createdAt,
  };
}

export function outcomeStatusForRating(rating: OutcomeRating): OutcomeRecord["status"] {
  if (rating === "great") return "gold";
  if (rating === "okay") return "good";
  if (rating === "bad") return "avoid";
  return "unrated";
}

export function createLearnerFeedbackPrompt(text: string): PromptExample {
  const now = Date.now();
  return {
    id: `feedback-${now}`,
    title: "Learner feedback prompt",
    text,
    source: "user",
    createdAt: new Date(now).toISOString(),
  };
}

export function createLearnerFeedbackScreenshot({
  notes,
  prompt,
  rating,
  screenshotNotes,
  screenshotUrl,
}: {
  notes: string;
  prompt: PromptExample;
  rating: OutcomeRating;
  screenshotNotes: string;
  screenshotUrl: string;
}): Omit<ScreenshotRecord, "id" | "createdAt"> | undefined {
  if (!screenshotUrl.trim()) return undefined;
  return {
    promptId: prompt.id,
    title: `${prompt.title} feedback proof`,
    url: screenshotUrl,
    notes: screenshotNotes || notes || "Learner outcome screenshot proof.",
    rating,
  };
}
