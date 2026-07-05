import {
  evaluatePrompt,
  type BenchmarkLibraryReport,
  type BenchmarkV2Report,
  type BuildRunRecord,
  type CorpusCleanupModeReport,
  type GuidedProductRunReport,
  type LocalModePolishReport,
  type OutcomeRecord,
  type ProductSprintReport,
  type PromptEditorGuidanceReport,
  type PromptExample,
  type PromptProductOsReport,
  type PromptQualityDnaReport,
  type PublicDemoSimplificationReport,
  type QualityRegressionGateReport,
  type ResultFeedbackLoopReport,
  type ScreenshotRecord,
  type TemplateCompilerReport,
} from "./promptEngine";

type EvolutionStatus = "ready" | "active" | "needs-work" | "blocked";

export type ProductEvolutionItem = {
  id:
    | "learner-mode"
    | "memory-v2"
    | "result-reviewer"
    | "holdout"
    | "editor-studio"
    | "project-spaces"
    | "architecture"
    | "public-experience";
  label: string;
  score: number;
  status: EvolutionStatus;
  evidence: string;
  nextAction: string;
  target: string;
};

export type ProductEvolutionReport = {
  score: number;
  status: "ready" | "in-progress" | "blocked";
  headline: "Product evolution roadmap";
  items: ProductEvolutionItem[];
  nextAction: string;
  blockers: string[];
  summary: string[];
};

export type PromptLearnerModeReport = {
  score: number;
  status: "ready" | "active" | "blocked";
  valueStory: string;
  steps: {
    id: "paste" | "score" | "improve" | "battle" | "prove" | "export";
    label: string;
    ready: boolean;
    score: number;
    detail: string;
    action: string;
    target: string;
  }[];
  notes: string[];
};

export type LearningMemoryV2Report = {
  score: number;
  status: "ready" | "learning" | "thin";
  rules: {
    label: string;
    confidence: number;
    evidenceCount: number;
    promptPatch: string;
  }[];
  memoryPatch: string;
  notes: string[];
};

export type ResultReviewerReport = {
  score: number;
  status: "ready" | "needs-proof" | "needs-rating";
  rows: {
    promptId: string;
    title: string;
    buildScore: number;
    visualScore: number;
    delta: number;
    verdict: "promote" | "repair" | "needs-proof";
    action: string;
  }[];
  reviewActions: string[];
  notes: string[];
};

export type HoldoutBenchmarkReport = {
  score: number;
  status: "ready" | "thin" | "blocked";
  lockedCount: number;
  rows: {
    id: string;
    title: string;
    locked: boolean;
    localScore: number;
    missingTraits: string[];
    policy: string;
  }[];
  regressionPolicy: string[];
  notes: string[];
};

export type PromptEditorStudioReport = {
  score: number;
  status: "ready" | "needs-sections" | "blocked";
  cards: {
    label: string;
    ready: boolean;
    detail: string;
    rewriteHint: string;
  }[];
  editRecipe: string[];
  notes: string[];
};

export type ProjectSpacesReport = {
  score: number;
  status: "ready" | "mixed" | "blocked";
  spaces: {
    id: string;
    label: string;
    count: number;
    isolation: "clean" | "review" | "blocked";
    detail: string;
  }[];
  activePolicy: string[];
  notes: string[];
};

export type ModularArchitectureReport = {
  score: number;
  status: "ready" | "watch" | "needs-split";
  checks: { label: string; ready: boolean; detail: string }[];
  modulePlan: string[];
  notes: string[];
};

export type PublicDemoExperienceReport = {
  score: number;
  status: "ready" | "needs-polish";
  headline: string;
  rows: { label: string; ready: boolean; detail: string }[];
  demoScript: string[];
  notes: string[];
};

function bounded(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readyPercent(rows: { ready: boolean }[]): number {
  return rows.length ? bounded((rows.filter((row) => row.ready).length / rows.length) * 100) : 0;
}

function latestByPrompt<T extends { promptId: string; createdAt?: string; updatedAt?: string }>(records: T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const record of records) {
    const current = map.get(record.promptId);
    const currentTime = current ? Date.parse(current.updatedAt || current.createdAt || "") : -1;
    const nextTime = Date.parse(record.updatedAt || record.createdAt || "");
    if (!current || nextTime >= currentTime) map.set(record.promptId, record);
  }
  return map;
}

export function buildPromptLearnerModeReport({
  guidedRun,
  localMode,
  productOs,
  productSprint,
  publicDemo,
  resultFeedback,
}: {
  guidedRun: GuidedProductRunReport;
  localMode: LocalModePolishReport;
  productOs: PromptProductOsReport;
  productSprint: ProductSprintReport;
  publicDemo: PublicDemoSimplificationReport;
  resultFeedback: ResultFeedbackLoopReport;
}): PromptLearnerModeReport {
  const steps: PromptLearnerModeReport["steps"] = [
    {
      id: "paste",
      label: "Paste",
      ready: productOs.score >= 55,
      score: productOs.score,
      detail: "Start with one excellent website prompt instead of exposing every lab control.",
      action: productOs.nextAction,
      target: "product-os",
    },
    {
      id: "score",
      label: "Score",
      ready: productSprint.score >= 55,
      score: productSprint.score,
      detail: "Explain why the prompt works with DNA, archetype, proof, and readiness signals.",
      action: productSprint.nextAction,
      target: "product-sprint",
    },
    {
      id: "improve",
      label: "Improve",
      ready: guidedRun.steps.some((step) => step.id === "battle" && step.status !== "blocked"),
      score: guidedRun.score,
      detail: "Use the guided run to turn learned rules into a sharper prompt.",
      action: guidedRun.primaryAction,
      target: "guided-run",
    },
    {
      id: "battle",
      label: "Battle",
      ready: productSprint.items.some((item) => item.id === "battle-autopilot" && item.status !== "blocked"),
      score: productSprint.items.find((item) => item.id === "battle-autopilot")?.score || 0,
      detail: "Compare candidate prompts before promoting a winner.",
      action: productSprint.items.find((item) => item.id === "battle-autopilot")?.nextAction || "Generate battle candidates.",
      target: "battle-autopilot",
    },
    {
      id: "prove",
      label: "Prove",
      ready: resultFeedback.status !== "needs-proof",
      score: resultFeedback.score,
      detail: "Attach build, screenshot, QA, and result evidence to the winner.",
      action: resultFeedback.rows.find((row) => row.status !== "ready")?.action || "Promote result lessons into memory.",
      target: "result-feedback",
    },
    {
      id: "export",
      label: "Export",
      ready: localMode.status !== "needs-route" && publicDemo.status === "ready",
      score: bounded((localMode.score + publicDemo.score) / 2),
      detail: "Let the public path work without browser keys, then export reusable learning.",
      action: publicDemo.checks.find((check) => !check.ready)?.detail || localMode.notes[0],
      target: "public-experience",
    },
  ];
  const score = readyPercent(steps);
  return {
    score,
    status: steps.some((step) => step.score < 35) ? "blocked" : score >= 80 ? "ready" : "active",
    valueStory: "Paste a great website prompt, learn the DNA, improve it, compare results, prove the winner, and export the learning.",
    steps,
    notes: [
      `${steps.filter((step) => step.ready).length}/${steps.length} learner-mode step(s) are ready.`,
      "This keeps the main product path simple while preserving the advanced lab underneath.",
    ],
  };
}

export function buildLearningMemoryV2Report({
  buildRuns,
  examples,
  outcomes,
  promptQualityDna,
  screenshots,
  templateCompiler,
}: {
  buildRuns: BuildRunRecord[];
  examples: PromptExample[];
  outcomes: OutcomeRecord[];
  promptQualityDna: PromptQualityDnaReport;
  screenshots: ScreenshotRecord[];
  templateCompiler: TemplateCompilerReport;
}): LearningMemoryV2Report {
  const goldOutcomes = outcomes.filter((outcome) => outcome.status === "gold" || outcome.rating === "great");
  const passedBuilds = buildRuns.filter((run) => run.status === "passed" || run.score >= 75);
  const greatScreenshots = screenshots.filter((shot) => shot.rating === "great");
  const exactAssetPrompts = examples.filter((example) => /https?:\/\/|exact|cloudfront|video url|image url/i.test(example.text));
  const responsivePrompts = examples.filter((example) => /mobile|responsive|breakpoint|desktop|viewport/i.test(example.text));
  const rules = [
    {
      label: "Exact assets beat generic art direction",
      confidence: bounded((exactAssetPrompts.length / Math.max(1, examples.length)) * 100),
      evidenceCount: exactAssetPrompts.length,
      promptPatch: "Name exact video/image URLs, focal points, playback behavior, and fallbacks.",
    },
    {
      label: "Responsive proof is a training feature",
      confidence: bounded((responsivePrompts.length / Math.max(1, examples.length)) * 100),
      evidenceCount: responsivePrompts.length,
      promptPatch: "Require mobile, tablet, and desktop layout behavior plus screenshot proof.",
    },
    {
      label: "Great outcomes should override vague corpus frequency",
      confidence: bounded((goldOutcomes.length / Math.max(1, outcomes.length || 1)) * 100),
      evidenceCount: goldOutcomes.length,
      promptPatch: "Weight gold/great labels above repeated but unproven prompt habits.",
    },
    {
      label: "Build passes become positive memory",
      confidence: bounded((passedBuilds.length / Math.max(1, buildRuns.length || 1)) * 100),
      evidenceCount: passedBuilds.length,
      promptPatch: "Promote build-passing implementation constraints into reusable templates.",
    },
    {
      label: "Visual proof closes the loop",
      confidence: bounded((greatScreenshots.length / Math.max(1, screenshots.length || 1)) * 100),
      evidenceCount: greatScreenshots.length,
      promptPatch: "Capture screenshot quality, text fit, media loading, and visual hierarchy as learnable facts.",
    },
    {
      label: "Templates need slots, not prose mush",
      confidence: templateCompiler.score,
      evidenceCount: templateCompiler.slots.filter((slot) => slot.ready).length,
      promptPatch: "Store stack, assets, layout, motion, responsive, accessibility, and QA as independent prompt slots.",
    },
    {
      label: "DNA dimensions explain what changed",
      confidence: promptQualityDna.score,
      evidenceCount: promptQualityDna.dimensions.length,
      promptPatch: "Attach plain-English DNA fixes to every generated improvement.",
    },
  ];
  const score = bounded(rules.reduce((sum, rule) => sum + rule.confidence, 0) / Math.max(1, rules.length));
  return {
    score,
    status: score >= 80 ? "ready" : score >= 50 ? "learning" : "thin",
    rules,
    memoryPatch: [
      "LEARNING MEMORY V2 PATCH",
      ...rules
        .filter((rule) => rule.confidence >= 50 || rule.evidenceCount > 0)
        .map((rule) => `- ${rule.label}: ${rule.promptPatch}`),
      "- Never require provider key changes to improve local prompt learning.",
    ].join("\n"),
    notes: [
      `${rules.filter((rule) => rule.confidence >= 70).length}/${rules.length} memory rule(s) have strong confidence.`,
      "Learning Memory v2 separates proven result evidence from raw prompt frequency.",
    ],
  };
}

export function buildResultReviewerReport({
  buildRuns,
  promptQualityDna,
  resultFeedback,
  screenshots,
}: {
  buildRuns: BuildRunRecord[];
  promptQualityDna: PromptQualityDnaReport;
  resultFeedback: ResultFeedbackLoopReport;
  screenshots: ScreenshotRecord[];
}): ResultReviewerReport {
  const buildByPrompt = latestByPrompt(buildRuns);
  const screenshotByPrompt = latestByPrompt(screenshots);
  const ids = Array.from(new Set([...buildByPrompt.keys(), ...screenshotByPrompt.keys()]));
  const rows = ids.slice(0, 8).map((promptId) => {
    const run = buildByPrompt.get(promptId);
    const shot = screenshotByPrompt.get(promptId);
    const buildScore = run?.score || 0;
    const visualScore = shot?.rating === "great" ? 92 : shot?.rating === "okay" ? 64 : shot?.rating === "bad" ? 24 : 0;
    const delta = bounded(visualScore ? visualScore - buildScore : promptQualityDna.score - buildScore);
    const verdict: ResultReviewerReport["rows"][number]["verdict"] =
      buildScore >= 75 && visualScore >= 75 ? "promote" : buildScore && visualScore ? "repair" : "needs-proof";
    return {
      promptId,
      title: run?.promptTitle || shot?.title || "Unlabeled prompt",
      buildScore,
      visualScore,
      delta,
      verdict,
      action:
        verdict === "promote"
          ? "Promote this result into Learning Memory v2."
          : verdict === "repair"
            ? "Open a side-by-side review and write the visual/build delta into a repair prompt."
            : "Attach both build and screenshot evidence before judging.",
    };
  });
  const score = rows.length ? bounded((rows.filter((row) => row.verdict === "promote").length / rows.length) * 100) : resultFeedback.score;
  return {
    score,
    status: !rows.length ? "needs-proof" : rows.some((row) => row.verdict === "needs-proof") ? "needs-proof" : rows.some((row) => row.verdict === "repair") ? "needs-rating" : "ready",
    rows,
    reviewActions: [
      "Show generated prompt, build output, screenshot, notes, and DNA deltas in one review card.",
      "Let the reviewer choose Promote, Repair, or Exclude from learning.",
      "Write accepted deltas into Learning Memory v2 and holdout benchmark notes.",
    ],
    notes: [
      rows.length ? `${rows.length} result row(s) are ready for side-by-side review.` : "No paired result rows yet; run proof or import a result.",
      resultFeedback.notes[0],
    ],
  };
}

export function buildHoldoutBenchmarkReport({
  benchmarkLibrary,
  benchmarkV2,
  learningMemory,
  qualityGate,
}: {
  benchmarkLibrary: BenchmarkLibraryReport;
  benchmarkV2: BenchmarkV2Report;
  learningMemory: LearningMemoryV2Report;
  qualityGate: QualityRegressionGateReport;
}): HoldoutBenchmarkReport {
  const rows = benchmarkLibrary.rows.slice(0, 10).map((row) => {
    const v2 = benchmarkV2.rows.find((entry) => entry.fixtureId === row.id);
    const locked = row.status === "covered" && row.missingTraits.length === 0;
    return {
      id: row.id,
      title: row.title,
      locked,
      localScore: v2?.localScore || (locked ? benchmarkLibrary.score : 45),
      missingTraits: v2?.missingTraits.length ? v2.missingTraits : row.missingTraits,
      policy: locked ? "Hold as regression guard." : row.fix,
    };
  });
  const lockedCount = rows.filter((row) => row.locked).length;
  const blockingRows = qualityGate.rows.filter((row) => row.blocking && !row.ready);
  const score = bounded((readyPercent(rows.map((row) => ({ ready: row.locked }))) + benchmarkV2.score + qualityGate.score + learningMemory.score) / 4);
  return {
    score,
    status: blockingRows.length ? "blocked" : score >= 75 ? "ready" : "thin",
    lockedCount,
    rows,
    regressionPolicy: [
      "Keep holdout prompts out of everyday memory tuning.",
      "Run holdout checks after Learning Memory v2 changes and before public demo copy changes.",
      "Fail only on blocking quality-gate rows; keep thin coverage report-only until examples exist.",
    ],
    notes: [
      `${lockedCount}/${rows.length} visible holdout row(s) are locked.`,
      blockingRows.length ? `${blockingRows.length} blocking quality gate row(s) still fail.` : "Quality gate has no blocking holdout failure.",
    ],
  };
}

export function buildPromptEditorStudioReport({
  editorGuidance,
  qualityGate,
  templateCompiler,
}: {
  editorGuidance: PromptEditorGuidanceReport;
  qualityGate: QualityRegressionGateReport;
  templateCompiler: TemplateCompilerReport;
}): PromptEditorStudioReport {
  const required = [
    { label: "Stack", match: /stack|dependency|framework/i },
    { label: "Assets", match: /asset|media|video|image|url/i },
    { label: "Layout", match: /layout|hero|section|navigation/i },
    { label: "Motion", match: /motion|animation|transition|state/i },
    { label: "Responsive", match: /responsive|mobile|breakpoint|viewport/i },
    { label: "QA", match: /qa|verify|test|accessibility|proof/i },
  ];
  const cards = required.map((item) => {
    const section = editorGuidance.sections.find((entry) => item.match.test(`${entry.label} ${entry.detail} ${entry.rewriteHint}`));
    const gate = qualityGate.rows.find((row) => item.match.test(`${row.label} ${row.detail}`));
    const slot = templateCompiler.slots.find((entry) => item.match.test(`${entry.label} ${entry.detail}`));
    const ready = Boolean(section && section.status === "ready") || Boolean(gate?.ready) || Boolean(slot?.ready);
    return {
      label: item.label,
      ready,
      detail: section?.detail || gate?.detail || slot?.detail || `Add a dedicated ${item.label.toLowerCase()} section.`,
      rewriteHint: section?.rewriteHint || (ready ? `Keep ${item.label.toLowerCase()} constraints explicit.` : `Regenerate the ${item.label.toLowerCase()} section with exact values.`),
    };
  });
  const score = bounded((readyPercent(cards) + editorGuidance.score + templateCompiler.score + qualityGate.score) / 4);
  return {
    score,
    status: qualityGate.status === "fail" ? "blocked" : score >= 75 ? "ready" : "needs-sections",
    cards,
    editRecipe: [
      "Split prompts into editable Stack, Assets, Layout, Motion, Responsive, and QA sections.",
      "Offer one-click section rewrite hints without replacing the whole prompt.",
      "Keep final output as a single copyable Codex build prompt.",
    ],
    notes: [
      `${cards.filter((card) => card.ready).length}/${cards.length} editor studio section(s) are ready.`,
      editorGuidance.notes[0] || "Editor guidance is available for the selected prompt.",
    ],
  };
}

export function buildProjectSpacesReport({
  cleanupMode,
  examples,
}: {
  cleanupMode: CorpusCleanupModeReport;
  examples: PromptExample[];
}): ProjectSpacesReport {
  const sourceCount = (source: PromptExample["source"]) => examples.filter((example) => example.source === source).length;
  const highScoreCount = examples.filter((example) => evaluatePrompt(example.text).score >= 75).length;
  const spaces: ProjectSpacesReport["spaces"] = [
    {
      id: "seed",
      label: "Seed corpus",
      count: sourceCount("seed"),
      isolation: "clean",
      detail: "Curated examples shipped with the product.",
    },
    {
      id: "user",
      label: "User imports",
      count: sourceCount("user"),
      isolation: cleanupMode.counts.leakage ? "review" : "clean",
      detail: "User-pasted prompts stay separate until accepted into learning.",
    },
    {
      id: "attachment",
      label: "Attachment imports",
      count: sourceCount("attachment"),
      isolation: cleanupMode.counts.sourceUnsafe ? "review" : "clean",
      detail: "Attachment-derived prompts need source review before training.",
    },
    {
      id: "review",
      label: "Review quarantine",
      count: cleanupMode.counts.leakage + cleanupMode.counts.sourceUnsafe + cleanupMode.counts.weak,
      isolation: cleanupMode.status === "blocked" ? "blocked" : cleanupMode.status === "review" ? "review" : "clean",
      detail: "Leakage, weak prompts, and unsafe source rows stay out of memory by default.",
    },
    {
      id: "proof",
      label: "Proof-ready examples",
      count: highScoreCount,
      isolation: "clean",
      detail: "High-scoring examples can seed benchmarks, templates, and public demo copy.",
    },
  ];
  const score = readyPercent(spaces.map((space) => ({ ready: space.isolation !== "blocked" })));
  return {
    score,
    status: spaces.some((space) => space.isolation === "blocked") ? "blocked" : spaces.some((space) => space.isolation === "review") ? "mixed" : "ready",
    spaces,
    activePolicy: [
      "Keep seed, user, attachment, review, and proof-ready spaces distinct.",
      "Never let unrelated repo/project text auto-train the website prompt learner.",
      "Promote examples into shared memory only after curation or result proof.",
    ],
    notes: [
      `${examples.length} prompt(s) are organized across ${spaces.length} project spaces.`,
      cleanupMode.notes[1],
    ],
  };
}

export function buildModularArchitectureReport({
  moduleNames,
  productReportCount,
}: {
  moduleNames: string[];
  productReportCount: number;
}): ModularArchitectureReport {
  const checks = [
    {
      label: "Product evolution engine",
      ready: moduleNames.includes("productEvolution"),
      detail: "New roadmap logic lives outside the main prompt engine.",
    },
    {
      label: "Prompt engine boundary",
      ready: moduleNames.includes("promptEngine"),
      detail: "Core scoring and existing reports remain in the original engine.",
    },
    {
      label: "Thin React panels",
      ready: moduleNames.includes("App panels"),
      detail: "UI panels render typed reports and avoid duplicating business logic.",
    },
    {
      label: "Regression tests",
      ready: moduleNames.includes("engine tests"),
      detail: `${productReportCount} product-evolution report(s) are expected in engine coverage.`,
    },
    {
      label: "Public docs",
      ready: moduleNames.includes("README"),
      detail: "README explains the new product-evolution surface.",
    },
  ];
  const score = readyPercent(checks);
  return {
    score,
    status: score >= 80 ? "ready" : score >= 60 ? "watch" : "needs-split",
    checks,
    modulePlan: [
      "Keep new roadmap analytics in src/productEvolution.ts.",
      "Move future UI-only panel helpers into component files once the panel count grows again.",
      "Keep provider/key configuration outside product-evolution work.",
    ],
    notes: [
      `${checks.filter((check) => check.ready).length}/${checks.length} modular cleanup check(s) are ready.`,
      "This is the first split that reduces pressure on the primary prompt engine instead of adding more report logic there.",
    ],
  };
}

export function buildPublicDemoExperienceReport({
  learnerMode,
  localMode,
  publicDemo,
  resultReviewer,
}: {
  learnerMode: PromptLearnerModeReport;
  localMode: LocalModePolishReport;
  publicDemo: PublicDemoSimplificationReport;
  resultReviewer: ResultReviewerReport;
}): PublicDemoExperienceReport {
  const rows = [
    { label: "Simple product path", ready: learnerMode.status !== "blocked", detail: learnerMode.valueStory },
    { label: "No-key confidence", ready: localMode.status !== "needs-route", detail: localMode.modeLabel },
    { label: "Proof review", ready: resultReviewer.status !== "needs-proof", detail: resultReviewer.notes[0] },
    { label: "Public story", ready: publicDemo.status === "ready", detail: publicDemo.publicStory },
  ];
  const score = readyPercent(rows);
  return {
    score,
    status: score >= 80 ? "ready" : "needs-polish",
    headline: "Website prompt learner that feels obvious in the first minute.",
    rows,
    demoScript: [
      "Paste an excellent prompt.",
      "See the DNA score and the exact traits it learned.",
      "Generate a better prompt from those traits.",
      "Review proof side by side, then export the learning pack.",
    ],
    notes: [
      `${rows.filter((row) => row.ready).length}/${rows.length} public demo experience row(s) are ready.`,
      "The public demo stays useful without provider key edits or hosted-only assumptions.",
    ],
  };
}

export function buildProductEvolutionReport({
  architecture,
  editorStudio,
  holdout,
  learnerMode,
  memoryV2,
  projectSpaces,
  publicExperience,
  resultReviewer,
}: {
  architecture: ModularArchitectureReport;
  editorStudio: PromptEditorStudioReport;
  holdout: HoldoutBenchmarkReport;
  learnerMode: PromptLearnerModeReport;
  memoryV2: LearningMemoryV2Report;
  projectSpaces: ProjectSpacesReport;
  publicExperience: PublicDemoExperienceReport;
  resultReviewer: ResultReviewerReport;
}): ProductEvolutionReport {
  const items: ProductEvolutionItem[] = [
    {
      id: "learner-mode",
      label: "Simplified Prompt Learner mode",
      score: learnerMode.score,
      status: learnerMode.status === "ready" ? "ready" : learnerMode.status === "blocked" ? "blocked" : "active",
      evidence: learnerMode.valueStory,
      nextAction: learnerMode.steps.find((step) => !step.ready)?.action || learnerMode.notes[1],
      target: "learner-mode",
    },
    {
      id: "memory-v2",
      label: "Learning Memory v2",
      score: memoryV2.score,
      status: memoryV2.status === "ready" ? "ready" : memoryV2.status === "thin" ? "needs-work" : "active",
      evidence: `${memoryV2.rules.filter((rule) => rule.confidence >= 70).length}/${memoryV2.rules.length} strong memory rule(s).`,
      nextAction: memoryV2.rules.find((rule) => rule.confidence < 70)?.promptPatch || memoryV2.notes[1],
      target: "memory-v2",
    },
    {
      id: "result-reviewer",
      label: "Side-by-side result reviewer",
      score: resultReviewer.score,
      status: resultReviewer.status === "ready" ? "ready" : resultReviewer.status === "needs-proof" ? "blocked" : "active",
      evidence: `${resultReviewer.rows.length} result review row(s).`,
      nextAction: resultReviewer.reviewActions[0],
      target: "result-reviewer",
    },
    {
      id: "holdout",
      label: "Holdout benchmark regression",
      score: holdout.score,
      status: holdout.status === "ready" ? "ready" : holdout.status === "blocked" ? "blocked" : "needs-work",
      evidence: `${holdout.lockedCount}/${holdout.rows.length} visible holdout row(s) locked.`,
      nextAction: holdout.regressionPolicy[1],
      target: "holdout",
    },
    {
      id: "editor-studio",
      label: "Prompt editor studio",
      score: editorStudio.score,
      status: editorStudio.status === "ready" ? "ready" : editorStudio.status === "blocked" ? "blocked" : "active",
      evidence: `${editorStudio.cards.filter((card) => card.ready).length}/${editorStudio.cards.length} editor card(s) ready.`,
      nextAction: editorStudio.editRecipe[1],
      target: "editor-studio",
    },
    {
      id: "project-spaces",
      label: "Project spaces",
      score: projectSpaces.score,
      status: projectSpaces.status === "ready" ? "ready" : projectSpaces.status === "blocked" ? "blocked" : "active",
      evidence: `${projectSpaces.spaces.length} isolated prompt space(s).`,
      nextAction: projectSpaces.activePolicy[1],
      target: "project-spaces",
    },
    {
      id: "architecture",
      label: "Modular code cleanup",
      score: architecture.score,
      status: architecture.status === "ready" ? "ready" : architecture.status === "needs-split" ? "needs-work" : "active",
      evidence: `${architecture.checks.filter((check) => check.ready).length}/${architecture.checks.length} architecture check(s).`,
      nextAction: architecture.modulePlan[1],
      target: "architecture",
    },
    {
      id: "public-experience",
      label: "Public demo polish",
      score: publicExperience.score,
      status: publicExperience.status === "ready" ? "ready" : "needs-work",
      evidence: publicExperience.headline,
      nextAction: publicExperience.demoScript[0],
      target: "public-experience",
    },
  ];
  const score = bounded(items.reduce((sum, item) => sum + item.score, 0) / Math.max(1, items.length));
  const blockers = items.filter((item) => item.status === "blocked").map((item) => `${item.label}: ${item.nextAction}`);
  const next = items.find((item) => item.status === "blocked") || items.find((item) => item.status === "needs-work") || items.find((item) => item.status === "active") || items[0];
  return {
    score,
    status: blockers.length ? "blocked" : items.every((item) => item.status === "ready") ? "ready" : "in-progress",
    headline: "Product evolution roadmap",
    items,
    nextAction: `${next.label}: ${next.nextAction}`,
    blockers,
    summary: [
      `${items.filter((item) => item.status === "ready").length}/${items.length} product evolution upgrade(s) are ready.`,
      "The next layer simplifies the product path, upgrades the learning memory, adds result review, locks holdout regression, improves editing, isolates projects, splits logic into a module, and polishes the public demo.",
    ],
  };
}
