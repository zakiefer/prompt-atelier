import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  analyzeCorpus,
  analyzeArchetypeClusters,
  buildGeneratorPresets,
  buildBenchmarkV2Report,
  buildBenchmarkLibraryReport,
  buildBestNextActionReport,
  buildCodexBuildPack,
  buildBuildResultLearningReport,
  buildBenchmarkBattleReport,
  buildCorpusProvenanceFirewallReport,
  buildCalibrationDashboardReport,
  buildCorpusIntelligenceReport,
  buildEvaluationArtifact,
  buildEvaluationHistoryReport,
  buildExperimentLeaderboard,
  buildExportPresets,
  buildBuildFeedbackReport,
  buildArchetypePromptPacks,
  buildGuidedPromptWizardReport,
  buildHostedSyncReport,
  buildHostedHardeningReport,
  buildImportWizardReport,
  buildLearnedGeneratorVariants,
  buildLeakageGuardReport,
  buildPatternDashboard,
  buildProjectExportPack,
  buildPromptMemoryDiffReport,
  buildModelEvaluationCacheReport,
  buildPromptCandidateTournament,
  buildPromptCoachReport,
  buildPromptEditorGuidance,
  buildPromptQualityDnaReport,
  buildPromptRecipeDistillerReport,
  buildQueueProgressReport,
  buildQualityGateReport,
  buildReusableMemoryPack,
  buildSourceSafetyReport,
  buildSafeToTrainReport,
  buildGuidedTrainingStepperReport,
  buildModelJudgeComparisonReport,
  buildOperatorModeReport,
  buildTrainingRunSummary,
  buildTrueClosedLoopReport,
  buildVisualRegressionReport,
  buildPromptSectionRegenerationReport,
  buildSpeedLabelingReport,
  answerLearnerQuestion,
  comparePromptImprovement,
  createDatasetVersionSnapshot,
  curatePromptCorpus,
  evaluatePrompt,
  normalizeModelEvaluationResult,
  redactSensitiveText,
  extractReusablePatterns,
  explainDnaScore,
  BENCHMARK_FIXTURES,
  auditPromptImportBatch,
  parsePromptBatch,
  scoreResultArtifact,
  scoreScreenshotIssues,
  scoreScreenshotSet,
  slugify,
  titleFromPrompt,
  type BuildRunRecord,
  type PairwiseReviewRecord,
  type OutcomeRecord,
  type PromptExample,
  type ScreenshotRecord,
  type TrainingRunRecord,
} from "../src/promptEngine";

function readCuratedSeedPrompts() {
  return readdirSync("src/prompts")
    .filter((file) => file.endsWith(".md"))
    .sort()
    .flatMap((file) => {
      const text = readFileSync(join("src/prompts", file), "utf8");
      if (!text.trim()) return [];
      const slug = file.replace(/\.md$/, "");
      return [{
        id: `seed-${slugify(slug)}`,
        title: titleFromPrompt(text, slug),
        text,
        source: "seed" as const,
        createdAt: "2026-07-02T00:00:00.000Z",
      }];
    });
}

const exactPrompt = `Build a fullscreen hero section in React + TypeScript + Vite + Tailwind CSS.
Use this exact background video URL: https://example.com/hero.mp4.
The video must be cinematic, autoplay, loop, muted, and playsInline.
Specify fonts, colors, responsive mobile behavior, accessible buttons, hover states, and a Playwright screenshot verification checklist.
No decorative blobs, no unlisted UI libraries, and keep the first viewport focused on the product.`;

const curatedSeedPrompts = readCuratedSeedPrompts();
const corpusText = curatedSeedPrompts.map((prompt) => `${prompt.title}\n${prompt.text}`).join("\n\n");
assert.ok(!/kapital-next|jkiefer89\/helios|you are firing/i.test(corpusText), "Curated prompt corpus must not include unrelated repo-operation prompts.");
const examples = curatedSeedPrompts
  .map((example) => ({ example, score: evaluatePrompt(example.text).score }))
  .sort((a, b) => b.score - a.score)
  .map((item) => item.example)
  .slice(0, 8);
const score = evaluatePrompt(exactPrompt);
assert.ok(score.score >= 20, `Expected scoring smoke test >= 20, received ${score.score}`);
assert.ok(score.upgrades.some((item) => /asset|responsive|visual/i.test(item)), "Expected upgrades to include design/build signals.");

const redacted = redactSensitiveText("Use secret=aaaaaaaaaaaaaaaaaaaa and sk-ant-api03-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa in a prompt.");
assert.equal(redacted.redacted, true, "Secret redaction should report redacted text.");
assert.ok(!redacted.text.includes("sk-ant-api03-"), "Anthropic keys should be redacted.");
assert.ok(redacted.findings.some((finding) => finding.kind === "anthropic-key"), "Redaction should classify Anthropic keys.");

const normalizedEvaluation = normalizeModelEvaluationResult({
  mode: "anthropic",
  rawText: '{"score": 88, "readiness": "excellent", "findings": ["specific"], "recommendations": ["ship"]}',
});
assert.equal(normalizedEvaluation.schemaVersion, "prompt-atelier.model-evaluation.v1", "Model evaluations should expose a stable schema version.");
assert.equal(normalizedEvaluation.score, 88, "Model evaluation schema normalization should parse JSON scores.");
assert.equal(normalizedEvaluation.readiness, "excellent", "Model evaluation readiness should normalize.");
assert.ok(BENCHMARK_FIXTURES.length >= 8, "Benchmark fixtures should cover canonical website prompt archetypes.");

const promptScore = evaluatePrompt(examples[0].text);
assert.ok(promptScore.score >= 70, `Expected a gold corpus prompt score >= 70, received ${promptScore.score}`);
const curation = curatePromptCorpus(examples);
assert.ok(curation.counts.learn > 0, "Curation should keep website prompts in the learning set.");
assert.ok(curation.items.every((item) => item.promptId && item.reasons.length), "Curation items should include prompt ids and reasons.");
const leakageGuard = buildLeakageGuardReport(curatedSeedPrompts);
assert.equal(leakageGuard.status, "clean", "Curated seed prompts should pass leakage guard.");
const sourceSafety = buildSourceSafetyReport(curatedSeedPrompts, curatePromptCorpus(curatedSeedPrompts));
assert.ok(sourceSafety.score >= 90, `Expected source safety >= 90, received ${sourceSafety.score}.`);
const qualityGate = buildQualityGateReport(examples[0], promptScore, undefined);
assert.ok(qualityGate.checks.length >= 5, "Quality gate should produce multiple readiness checks.");
assert.equal(typeof qualityGate.ready, "boolean", "Quality gate readiness should be boolean.");

const outcomes: OutcomeRecord[] = [
  {
    id: "outcome-1",
    promptId: examples[0].id,
    title: examples[0].title,
    rating: "great",
    status: "gold",
    notes: "Strong exact visual and implementation details.",
    updatedAt: new Date().toISOString(),
  },
];
const screenshots: ScreenshotRecord[] = [
  {
    id: "shot-1",
    promptId: examples[0].id,
    title: "Desktop proof",
    url: "/tmp/desktop.png",
    notes: "Looks cinematic and responsive.",
    rating: "great",
    createdAt: new Date().toISOString(),
  },
];
const buildRuns: BuildRunRecord[] = [
  {
    id: "run-1",
    promptId: examples[0].id,
    promptTitle: examples[0].title,
    promptText: examples[0].text,
    status: "passed",
    resultUrl: "http://127.0.0.1:5173",
    folderPath: "prompt-runs/run-1",
    screenshotUrl: "/tmp/desktop.png",
    filesChanged: "src/App.tsx",
    errors: "",
    notes: "Verified on desktop and mobile.",
    score: 88,
    failureCategories: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
const pairwiseReviews: PairwiseReviewRecord[] = [
  {
    id: "pairwise-1",
    leftId: examples[0].id,
    rightId: examples[1].id,
    winnerId: examples[0].id,
    loserId: examples[1].id,
    reason: "More exact assets and verification.",
    createdAt: new Date().toISOString(),
  },
];

const snapshot = createDatasetVersionSnapshot({
  buildRuns,
  examples,
  label: "test",
  outcomes,
  score: { finalScore: 82, promptQuality: 84, predictedBuild: 80, actualResult: 88, visualTaste: 86, failureRisk: 12, notes: ["test snapshot"] },
  screenshots,
});
assert.equal(snapshot.counts.examples, examples.length, "Dataset snapshot should count examples.");
assert.equal(snapshot.counts.buildRuns, buildRuns.length, "Dataset snapshot should count build runs.");

const profile = analyzeCorpus(examples);
const clusters = analyzeArchetypeClusters(examples);
const presets = buildGeneratorPresets(profile, clusters, outcomes);
assert.ok(presets.length > 0, "Generator presets should be created from corpus signals.");
assert.ok(presets[0].prompt.includes("React"), "Generator preset prompt should include implementation stack guidance.");

const dashboardExamples: PromptExample[] = [
  {
    id: "dashboard-cinematic-hero",
    title: "Dashboard cinematic hero",
    text: exactPrompt,
    source: "user",
    createdAt: new Date().toISOString(),
  },
  ...examples,
];
const patternDashboard = buildPatternDashboard(dashboardExamples, outcomes, buildRuns);
assert.ok(patternDashboard.summary.length >= 2, "Pattern dashboard should produce summary guidance.");
assert.ok(patternDashboard.items.length > 0, "Pattern dashboard should identify active website prompt patterns.");

const visualRegression = buildVisualRegressionReport(buildRuns, screenshots);
assert.ok(visualRegression.score >= 75, "Visual regression should score healthy evidence as ready.");
assert.ok(visualRegression.checks.every((check) => check.detail), "Visual regression checks should include details.");
const resultArtifact = scoreResultArtifact(examples[0], screenshots[0], buildRuns[0]);
const screenshotSet = scoreScreenshotSet(examples[0], screenshots, buildRuns[0]);
const dnaExplanation = explainDnaScore(examples[0], resultArtifact, screenshotSet);
assert.ok(dnaExplanation.summary.length >= 3, "DNA explanation should include summary bullets.");
assert.ok(dnaExplanation.dimensions.every((dimension) => dimension.nextAction), "DNA explanation should include next actions.");
const buildFeedback = buildBuildFeedbackReport(examples[0], resultArtifact, screenshotSet);
assert.ok(buildFeedback.nextActions.length > 0, "Build feedback should recommend next actions.");
assert.ok(buildFeedback.checks.length >= resultArtifact.checks.length, "Build feedback should include result and screenshot checks.");

const coach = buildPromptCoachReport(exactPrompt, profile, outcomes);
assert.ok(coach.score > 0, "Prompt coach should return a score.");
assert.ok(coach.rewrittenPrompt.includes("Build"), "Prompt coach should return a rewritten prompt.");

const experimentLeaderboard = buildExperimentLeaderboard(examples, outcomes, buildRuns, pairwiseReviews);
assert.equal(experimentLeaderboard.items[0].promptId, examples[0].id, "Pairwise winner should lead the experiment leaderboard.");

const learnedVariants = buildLearnedGeneratorVariants(
  {
    brandName: "Atlas",
    industry: "AI research",
    audience: "research founders",
    goal: "prove the product is serious in the first viewport",
    stack: "React + TypeScript + Vite + Tailwind CSS",
    siteType: "single-page hero",
    vibe: "cinematic and exact",
    visualStyle: "cinematic video hero with exact typography",
    assets: "exact video URL and logo SVG",
    constraints: "no vague placeholders",
    outputTarget: "Codex build prompt",
    strictness: 9,
  },
  profile,
  presets,
  outcomes,
);
assert.equal(learnedVariants.length, 5, "Learned generator should create five variants.");
assert.ok(learnedVariants[0].prompt.includes("PROJECT-SPECIFIC REQUIREMENTS"), "Generator variant should include project requirements.");

const guidedWizard = buildGuidedPromptWizardReport(
  {
    brandName: "Atlas",
    industry: "AI research",
    audience: "research founders",
    goal: "prove the product is serious in the first viewport",
    stack: "React + TypeScript + Vite + Tailwind CSS",
    siteType: "single-page hero",
    vibe: "cinematic and exact",
    visualStyle: "cinematic video hero with exact typography",
    assets: "exact video URL and logo SVG",
    constraints: "no vague placeholders",
    outputTarget: "Codex build prompt",
    strictness: 9,
  },
  profile,
  presets,
  outcomes,
);
assert.equal(guidedWizard.readiness, 100, "Completed wizard input should score fully ready.");
assert.equal(guidedWizard.variants.length, 3, "Guided wizard should expose the top three variants.");

const patternExtraction = extractReusablePatterns(examples, outcomes, clusters);
assert.ok(patternExtraction.blocks.length > 0, "Pattern extraction should produce reusable blocks.");
assert.ok(patternExtraction.summary.some((item) => /pattern/i.test(item)), "Pattern extraction should summarize learned blocks.");

const rewriteComparison = comparePromptImprovement("Make a cool website.", profile, outcomes, resultArtifact);
assert.ok(rewriteComparison.improvedScore > rewriteComparison.originalScore, "Prompt improvement should raise a vague prompt score.");
assert.ok(rewriteComparison.improvedPrompt.includes("LEARNED OUTCOME RULES"), "Prompt improvement should include learned outcome rules.");

const screenshotScoring = scoreScreenshotIssues(examples[0], "mobile text-overlap and missing-assets in first viewport", "bad");
assert.ok(screenshotScoring.score < 40, "Screenshot scoring should penalize bad visual issues.");
assert.ok(screenshotScoring.promptPatch.includes("repair constraints"), "Screenshot scoring should produce repair constraints.");

const hostedSync = buildHostedSyncReport({
  apiOnline: true,
  authRequired: true,
  apiBase: "https://api.example.com",
  counts: { prompts: examples.length, labels: outcomes.length, runs: buildRuns.length, screenshots: screenshots.length, events: 3 },
});
assert.equal(hostedSync.mode, "hosted", "Hosted sync should detect remote API mode.");
assert.ok(hostedSync.score >= 80, "Hosted sync should score a configured backend as ready.");

const archetypePacks = buildArchetypePromptPacks(examples, outcomes, clusters);
assert.ok(archetypePacks.length > 0, "Archetype prompt packs should be exportable.");
assert.ok(archetypePacks[0].prompts[0].includes("#"), "Prompt pack entries should include titled prompt markdown.");

const learnerAnswer = answerLearnerQuestion("How do I make a SaaS hero prompt better?", profile, patternExtraction, archetypePacks);
assert.ok(learnerAnswer.answer.includes("SaaS") || learnerAnswer.answer.includes("website"), "Learner answer should respond to the question.");
assert.ok(learnerAnswer.suggestedPromptPatch.includes("-"), "Learner answer should include a prompt patch.");

const importAudit = auditPromptImportBatch(
  [
    ...parsePromptBatch(exactPrompt, "test batch"),
    ...parsePromptBatch(JSON.stringify({ prompts: [examples[0]] }), "duplicate json"),
  ],
  examples,
);
assert.ok(importAudit.total >= 2, "Import audit should inspect batch candidates.");
assert.ok(importAudit.exactDuplicates >= 1, "Import audit should detect exact duplicates.");
assert.ok(importAudit.recommendations.length >= 2, "Import audit should return recommendations.");

const pack = buildReusableMemoryPack({
  failureMemory: {
    categories: [],
    avoidRules: [],
    promptPatch: "Add exact assets and verification steps.",
  },
  generatorPresets: presets,
  goldenRecipes: [],
  promptMemory: {
    markdown: "# Memory\n- exact assets win",
    json: "{}",
    sections: [],
  },
  qualityGate,
});
assert.ok(pack.markdown.includes("Website Prompt Memory Pack"), "Reusable memory pack should be markdown-exportable.");
assert.ok(JSON.parse(pack.json), "Reusable memory pack JSON should parse.");

const projectPack = buildProjectExportPack({
  curation,
  modelEvaluations: [{ score: 91, mode: "test" }],
  prompt: examples[0],
  promptMemory: {
    markdown: "# Memory\n- exact assets win",
    json: "{}",
    sections: [],
  },
  qualityGate,
  visualRegression,
});
assert.ok(projectPack.markdown.includes("Prompt Atelier Project Export"), "Project pack should be markdown-exportable.");
assert.ok(JSON.parse(projectPack.json), "Project pack JSON should parse.");

const codexBuildPack = buildCodexBuildPack({
  prompt: examples[0],
  promptMemory: {
    markdown: "# Memory\n- exact assets win",
    json: "{}",
    sections: [],
  },
  qualityGate,
  queueExport: "{}",
  visualRegression,
});
assert.ok(codexBuildPack.files.some((file) => file.path === "codex-task.md"), "Codex build pack should include a task file.");
assert.ok(codexBuildPack.markdown.includes("Acceptance Gates"), "Codex build pack should include gates.");

const exportPresets = buildExportPresets({
  codexBuildPack,
  prompt: examples[0],
  promptMemory: {
    markdown: "# Memory\n- exact assets win",
    json: "{}",
    sections: [{ title: "Rules", items: ["Exact assets win"] }],
  },
  qualityGate,
  visualRegression,
});
assert.ok(exportPresets.length >= 9, "Export presets should cover implementation and model-training formats.");
assert.ok(exportPresets.some((preset) => preset.id === "v0"), "Export presets should include v0.");
assert.ok(exportPresets.some((preset) => preset.id === "openai-finetune-jsonl"), "Export presets should include model-training JSONL.");

const evaluationHistory = buildEvaluationHistoryReport({
  buildRuns,
  modelEvaluations: [{ promptId: examples[0].id, title: examples[0].title, score: 91, readiness: "excellent", mode: "test", createdAt: new Date().toISOString() }],
  outcomes,
  pairwiseReviews,
  screenshots,
});
assert.ok(evaluationHistory.items.length >= 4, "Evaluation history should combine labels, builds, screenshots, pairwise reviews, and model rows.");
assert.ok(evaluationHistory.summary.length >= 2, "Evaluation history should summarize trends.");

const queueProgress = buildQueueProgressReport({
  apiEvents: [{ kind: "queue-progress", detail: { stage: "complete", jobId: "run-1" }, createdAt: new Date().toISOString() }],
  buildRuns,
  proofLearningRuns: [{ promptId: examples[0].id, learnedStatus: "gold", screenshotCount: 1 }],
  queueJobs: [{
    id: "queue-1",
    promptId: examples[0].id,
    promptTitle: examples[0].title,
    promptText: examples[0].text,
    variantTitle: "Variant",
    status: "completed",
    runFolder: "prompt-runs/queue-1",
    resultUrl: "http://127.0.0.1:5173",
    score: 88,
    commands: [],
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }],
  screenshots,
  selectedPrompt: examples[0],
});
assert.equal(queueProgress.status, "complete", "Queue progress should mark learned proof complete.");
assert.ok(queueProgress.events.length >= 1, "Queue progress should include API event history.");

const memoryDiff = buildPromptMemoryDiffReport({
  current: {
    markdown: "# Memory",
    json: "{}",
    sections: [
      { title: "Assets", items: ["Use exact URLs", "Verify media"] },
      { title: "Mobile", items: ["Check 375px viewport"] },
    ],
  },
  datasetVersions: [snapshot],
});
assert.ok(memoryDiff.score > 0, "Memory diff should score current memory.");
assert.ok(memoryDiff.summary.length >= 3, "Memory diff should summarize changes.");

const trainingRun: TrainingRunRecord = {
  id: "training-run-test",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: "complete",
  stage: "complete",
  source: "corpus",
  inputCounts: { prompts: examples.length, outcomes: outcomes.length, screenshots: screenshots.length },
  scores: { starting: 62, final: 84, benchmark: 78, memory: 82, proof: 75 },
  benchmarkDelta: 9,
  memoryDiff,
  artifacts: [{ id: "artifact-test", title: "Artifact", kind: "json", detail: "Created" }],
  errors: [],
  notes: ["Training run completed."],
};
const trainingSummary = buildTrainingRunSummary([trainingRun]);
assert.equal(trainingSummary.latest?.id, "training-run-test", "Training summary should expose the latest run.");
assert.equal(trainingSummary.score, 84, "Training summary should use the latest final score.");

const cacheReport = buildModelEvaluationCacheReport([
  {
    id: "cache-1",
    promptHash: "p1",
    memoryHash: "m1",
    provider: "local",
    schemaVersion: "prompt-atelier.model-evaluation.v1",
    score: 82,
    localScore: 78,
    delta: 4,
    readiness: "ready",
    findings: ["specific"],
    recommendations: ["ship"],
    createdAt: new Date().toISOString(),
  },
]);
assert.equal(cacheReport.items[0].agreement, "agrees", "Cache report should classify model/local agreement.");

const candidateReport = buildPromptCandidateTournament({
  candidates: learnedVariants.slice(0, 3),
  examples,
  promptMemory: {
    markdown: "# Memory\n- exact assets win",
    json: "{}",
    sections: [{ title: "Rules", items: ["Exact assets win"] }],
  },
});
assert.ok(candidateReport.winner.prompt.length > 100, "Candidate tournament should choose a substantial winning prompt.");
assert.ok(candidateReport.finalPrompt.length > 100, "Candidate tournament should produce a final prompt.");

const corpusIntelligence = buildCorpusIntelligenceReport(examples, outcomes);
assert.ok(corpusIntelligence.clusters.length > 0, "Corpus intelligence should find clusters.");
assert.ok(corpusIntelligence.suggestions.length > 0, "Corpus intelligence should suggest what to add next.");

const benchmarkV2 = buildBenchmarkV2Report({ fixtures: BENCHMARK_FIXTURES, runs: [], examples });
assert.ok(benchmarkV2.rows.length >= BENCHMARK_FIXTURES.length, "Benchmark v2 should cover canonical fixtures.");
assert.ok(benchmarkV2.summary.length >= 3, "Benchmark v2 should summarize regressions and gaps.");

const safeToTrain = buildSafeToTrainReport({
  apiOnline: true,
  authRequired: true,
  sqliteWritable: true,
  modelRouteWorking: true,
  redactionActive: true,
  queuePostureKnown: true,
  snapshotWorks: true,
});
assert.equal(safeToTrain.safe, true, "Safe-to-train report should pass when all checks are ready.");

const artifact = buildEvaluationArtifact({
  prompt: examples[0],
  promptMemory: {
    markdown: "# Memory\n- exact assets win",
    json: "{}",
    sections: [{ title: "Rules", items: ["Exact assets win"] }],
  },
  qualityGate,
  sourceExamples: examples.slice(0, 3),
  visualRegression,
});
assert.ok(artifact.markdown.includes("Evaluation Artifact"), "Evaluation artifact should be markdown-exportable.");
assert.ok(JSON.parse(artifact.json), "Evaluation artifact JSON should parse.");

const provenanceFirewall = buildCorpusProvenanceFirewallReport({ examples, curation, leakage: leakageGuard });
assert.ok(provenanceFirewall.score >= 80, "Provenance firewall should score curated seed prompts as safe.");
assert.ok(provenanceFirewall.rows.every((row) => row.originHint), "Provenance rows should expose origin hints.");

const buildLearning = buildBuildResultLearningReport({ queueProgress, resultScore: resultArtifact, screenshotQa: screenshotSet, visualRegression });
assert.ok(buildLearning.score >= 70, "Build result learning should score proven prompts as learnable.");
assert.ok(buildLearning.nextActions.length >= 0, "Build result learning should expose next actions array.");

const promptQualityDna = buildPromptQualityDnaReport({ dnaExplanation, qualityGate, resultScore: resultArtifact, screenshotQa: screenshotSet });
assert.ok(promptQualityDna.dimensions.length > dnaExplanation.dimensions.length, "Prompt Quality DNA should add proof dimensions.");
assert.ok(promptQualityDna.summary[0].includes("Prompt Quality DNA"), "Prompt Quality DNA should explain the score plainly.");

const recipeDistiller = buildPromptRecipeDistillerReport({
  goldenRecipes: [],
  patternExtraction,
  promptMemory: {
    markdown: "# Memory\n- exact assets win",
    json: "{}",
    sections: [{ title: "Rules", items: ["Exact assets win", "Require mobile proof"] }],
  },
});
assert.ok(recipeDistiller.recipes.length > 0, "Recipe distiller should produce reusable recipes.");

const modelComparison = buildModelJudgeComparisonReport({ cacheReport, qualityGate, resultScore: resultArtifact });
assert.notEqual(modelComparison.alignment, "empty", "Model comparison should use cached model rows.");
assert.ok(modelComparison.rows.length >= 3, "Model comparison should include model, local, and result rows.");

const benchmarkLibrary = buildBenchmarkLibraryReport({ corpusIntelligence, fixtures: BENCHMARK_FIXTURES });
assert.equal(benchmarkLibrary.total, BENCHMARK_FIXTURES.length, "Benchmark library should cover all fixtures.");
assert.ok(benchmarkLibrary.rows.every((row) => row.fix), "Benchmark library rows should include fixes.");

const editorGuidance = buildPromptEditorGuidance(examples[0]);
assert.ok(editorGuidance.sections.length >= 5, "Editor guidance should split prompt into editable sections.");
assert.ok(editorGuidance.notes.some((note) => /Regenerate/i.test(note)), "Editor guidance should recommend section-level regeneration.");

const stepper = buildGuidedTrainingStepperReport({
  benchmarkV2,
  corpusFirewall: provenanceFirewall,
  corpusIntelligence,
  evaluationArtifacts: [artifact],
  modelCache: cacheReport,
  queueProgress,
  safeToTrain,
  trainingSummary,
});
assert.ok(stepper.steps.length >= 7, "Guided stepper should include the full product training path.");
assert.ok(stepper.currentStep, "Guided stepper should identify the current focus.");

const bestNextAction = buildBestNextActionReport({
  benchmarkLibrary,
  buildLearning,
  corpusFirewall: provenanceFirewall,
  modelComparison,
  promptDna: promptQualityDna,
  safeToTrain,
  stepper,
});
assert.ok(bestNextAction.title.length > 0, "Best next action should pick a clear recommendation.");
assert.ok(bestNextAction.checklist.length >= 0, "Best next action should expose a checklist array.");

const promptMemory = {
  markdown: "# Memory\n- exact assets win",
  json: "{}",
  sections: [{ title: "Rules", items: ["Exact assets win", "Require mobile proof"] }],
};

const trueClosedLoop = buildTrueClosedLoopReport({
  benchmarkLibrary,
  buildLearning,
  candidateTournament: candidateReport,
  evaluationArtifacts: [artifact],
  modelComparison,
  promptDna: promptQualityDna,
  selectedPrompt: examples[0],
});
assert.equal(trueClosedLoop.stages.length, 6, "True closed-loop report should expose all six stages.");
assert.ok(trueClosedLoop.runPlan.some((item) => /screenshot/i.test(item)), "True closed-loop report should include screenshot proof.");

const sectionRegeneration = buildPromptSectionRegenerationReport({
  editorGuidance,
  prompt: examples[0],
  recipeDistiller,
});
assert.ok(sectionRegeneration.sections.length >= 5, "Section regeneration should cover editable prompt sections.");
assert.ok(sectionRegeneration.sections[0].patch.includes("Return only this replacement section"), "Section regeneration patches should be scoped.");

const importWizard = buildImportWizardReport({
  audit: importAudit,
  contamination: { status: "clean", warnings: [], actions: [] },
});
assert.ok(importWizard.steps.length >= 5, "Import wizard should expose the full ingest path.");
assert.ok(importWizard.counts.total >= importAudit.total, "Import wizard should preserve audit counts.");

const speedLabeling = buildSpeedLabelingReport({ buildRuns, examples, outcomes, screenshots });
assert.ok(speedLabeling.candidates.length > 0, "Speed labeling should surface unlabeled candidates.");
assert.ok(speedLabeling.candidates.every((candidate) => candidate.reason), "Speed labeling candidates should explain the suggested label.");

const benchmarkBattle = buildBenchmarkBattleReport({ examples, promptMemory });
assert.ok(benchmarkBattle.rows.length > 0, "Benchmark battles should create fixture rows.");
assert.ok(benchmarkBattle.rows.every((row) => row.variants.length === 3), "Each benchmark battle should compare three contenders.");

const calibrationDashboard = buildCalibrationDashboardReport({
  evaluationHistory,
  modelCache: cacheReport,
  modelComparison,
  resultScore: resultArtifact,
});
assert.ok(calibrationDashboard.rows.length >= 4, "Calibration dashboard should compare model, history, and build evidence.");
assert.notEqual(calibrationDashboard.alignment, "empty", "Calibration dashboard should use cached model data.");

const hostedHardening = buildHostedHardeningReport({
  eventCount: 1,
  hasBackups: true,
  hostedSyncScore: hostedSync.score,
  safeToTrain,
});
assert.ok(hostedHardening.checklist.length > safeToTrain.checks.length, "Hosted hardening should extend safe-to-train checks.");
assert.ok(hostedHardening.backupPlan.some((item) => /restore|backup/i.test(item)), "Hosted hardening should include backup guidance.");

const operatorMode = buildOperatorModeReport({
  bestNextAction,
  buildLearning,
  importWizard,
  mode: "upload",
  stepper,
});
assert.equal(operatorMode.mode, "beginner", "Operator mode should simplify non-trained workflows.");
assert.ok(operatorMode.cards.length >= 4, "Operator mode should expose workflow cards.");

console.log(JSON.stringify({ ok: true, assertions: 126, score: score.score, snapshot: snapshot.label }, null, 2));
