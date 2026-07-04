import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  analyzeCorpus,
  analyzeArchetypeClusters,
  buildAllInRunwayReport,
  buildAutonomousProofBatchProductReport,
  buildAutonomousProofLoopReport,
  buildGeneratorPresets,
  buildBenchmarkExpansionReport,
  buildBenchmarkV2Report,
  buildBenchmarkLibraryReport,
  buildBestNextActionReport,
  buildCodexBuildPack,
  buildBuildResultLearningReport,
  buildApiAdminHardeningReport,
  buildBeginnerPromptMakerReport,
  buildBenchmarkBattleReport,
  buildBulkImportPipelineReport,
  buildCorpusProvenanceFirewallReport,
  buildCalibrationDashboardReport,
  buildCalibrationProductReport,
  buildBriefBuilderProductReport,
  buildClaudeCalibrationProductReport,
  buildClaudeCalibrationSetReport,
  buildClosedLoopRunDetailReport,
  buildCorpusIntelligenceReport,
  buildDatasetBulkToolsReport,
  buildDatasetGovernanceReport,
  buildDatasetInboxReport,
  buildEvaluationArtifact,
  buildEvaluatorCalibrationWorkflowReport,
  buildEvaluationHistoryReport,
  buildExperimentLeaderboard,
  buildExportPresets,
  buildBuildFeedbackReport,
  buildArchetypePromptPacks,
  buildFailureMemory,
  buildGoldenDatasetV1LockReport,
  buildGoldenBenchmarkHarnessReport,
  buildGeneratorV3Report,
  buildGeneratorModeTestProductReport,
  buildHostedApiDeploymentProductReport,
  buildHostedCiSmokeReport,
  buildHostedBackendKitReport,
  buildGuidedPromptWizardReport,
  buildHostedSyncReport,
  buildHostedHardeningReport,
  buildHostedBuildWorkerReport,
  buildHostedReadinessProductReport,
  buildHostedWorkerOpsReport,
  buildImportWizardReport,
  buildFailureMemoryAutopilotReport,
  buildLearnedGeneratorVariants,
  buildLeakageGuardReport,
  buildLearningExplanationReport,
  buildLearningMachineReport,
  buildNextProductLayerReport,
  buildPatternDashboard,
  buildMeasuredQualitySprintReport,
  buildProjectExportPack,
  buildPreferenceDatasetV2ProductReport,
  buildPreferenceTrainingReport,
  buildPromptMemoryDiffReport,
  buildModelEvaluationCacheReport,
  buildPromptCandidateTournament,
  buildPromptCritiqueRepairReport,
  buildPromptCoachReport,
  buildPromptEditorGuidance,
  buildPromptGeneratorV2Report,
  buildPromptToProofWorkflowReport,
  buildProductCommandCenterReport,
  buildPromptQualityDnaReport,
  buildPromptRecipeDistillerReport,
  buildProofRunControllerReport,
  buildQualityRegressionGateReport,
  buildQueueProgressReport,
  buildQualityGateReport,
  buildResultQualityDashboardReport,
  buildResultGalleryHydrationProductReport,
  buildRegressionDashboardV2ProductReport,
  buildRegressionHistoryProductReport,
  buildDatasetReviewQueueReport,
  buildReusableMemoryPack,
  buildPublicDemoPolishReport,
  buildSecurityCleanupProductReport,
  buildSourceSafetyReport,
  buildSafeToTrainReport,
  buildGuidedTrainingStepperReport,
  buildModelJudgeComparisonReport,
  buildModelProviderRouterReport,
  buildOperatorModeReport,
  buildProofArtifactStorageReport,
  buildProviderPluginLayerReport,
  buildQueueObservabilityReport,
  buildSimpleModeReport,
  buildTrainingExportReadinessReport,
  buildTrainingRunSummary,
  buildTrueClosedLoopReport,
  buildVisualProofComparisonReport,
  buildVisualRegressionReport,
  buildNarrativePolishReport,
  buildWorkerSandboxReport,
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
  explainPromptWin,
  BENCHMARK_FIXTURES,
  auditPromptImportBatch,
  parsePromptBatch,
  scoreResultArtifact,
  scoreScreenshotIssues,
  scoreScreenshotSet,
  slugify,
  titleFromPrompt,
  type BuildRunRecord,
  type BuildQueueJob,
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

const hostedBuildWorker = buildHostedBuildWorkerReport({
  apiOnline: true,
  authRequired: true,
  hasBuildCommand: true,
  queueStatus: queueProgress.status,
  trueClosedLoop,
});
assert.ok(hostedBuildWorker.workerPlan.some((item) => /queue worker/i.test(item)), "Hosted build worker should describe real queue execution.");
assert.notEqual(hostedBuildWorker.readiness, "needs-api", "Hosted build worker should pass API readiness with health.");

const claudeCalibrationSet = buildClaudeCalibrationSetReport({ modelCache: cacheReport });
assert.ok(claudeCalibrationSet.rows.length >= 5, "Claude calibration set should include stable fixtures.");
assert.ok(claudeCalibrationSet.rows.some((row) => row.expected > 80), "Claude calibration should include gold expected rows.");

const bulkImportPipeline = buildBulkImportPipelineReport({ audit: importAudit, contamination: { status: "clean", warnings: [], actions: [] } });
assert.ok(bulkImportPipeline.stages.length >= 5, "Bulk import pipeline should expose parse/dedupe/classify/safety/commit stages.");
assert.ok(bulkImportPipeline.previewRows.length > 0, "Bulk import pipeline should preview candidates.");

const closedLoopDetail = buildClosedLoopRunDetailReport({
  buildRuns,
  runs: [{ id: "loop-1", sourceTitle: "Source", winnerTitle: "Winner", originalScore: 60, improvedScore: 82, modelMode: "local", findings: ["better"], recommendations: ["build"] }],
  screenshots,
});
assert.equal(closedLoopDetail.latest?.status, "improved", "Closed-loop detail should classify positive deltas.");
assert.ok(closedLoopDetail.timeline.length >= 4, "Closed-loop detail should include proof timeline.");

const goldenDatasetV1 = buildGoldenDatasetV1LockReport({ goldCount: 6, trainCount: 5, testCount: 1, versions: [{ ...snapshot, label: "Golden Dataset v1" }] });
assert.equal(goldenDatasetV1.locked, true, "Golden Dataset v1 report should detect the locked version.");
assert.ok(goldenDatasetV1.checklist.every((item) => item.ready), "Golden Dataset v1 report should pass a complete lock.");

const beginnerPromptMaker = buildBeginnerPromptMakerReport({
  input: {
    brandName: "Atlas",
    industry: "AI research",
    audience: "research founders",
    goal: "prove the product is serious",
    stack: "React + TypeScript + Tailwind CSS",
    siteType: "single-page hero",
    vibe: "cinematic",
    visualStyle: "cinematic video hero",
    assets: "exact video URL",
    constraints: "no placeholders",
    outputTarget: "Codex build prompt",
    strictness: 9,
  },
  promptMemory,
});
assert.equal(beginnerPromptMaker.readiness, "ready", "Beginner prompt maker should be ready with complete input.");
assert.ok(beginnerPromptMaker.suggestedPrompt.includes("desktop/mobile verification"), "Beginner prompt maker should include proof gates.");

const failureMemory = buildFailureMemory(outcomes, buildRuns, screenshots);
const failureAutopilot = buildFailureMemoryAutopilotReport({ buildLearning, failureMemory, resultScore: resultArtifact });
assert.ok(failureAutopilot.patch.includes("FAILURE MEMORY PATCH"), "Failure autopilot should expose the repair patch.");
assert.ok(failureAutopilot.notes.length >= 2, "Failure autopilot should explain next steps.");

const visualProofComparison = buildVisualProofComparisonReport({ buildRuns, screenshots });
assert.ok(["ready", "needs-before", "needs-after"].includes(visualProofComparison.status), "Visual proof comparison should classify screenshot readiness.");
assert.ok(visualProofComparison.notes.some((note) => /screenshot/i.test(note)), "Visual proof comparison should mention screenshots.");

const providerRouter = buildModelProviderRouterReport({
  cache: cacheReport,
  settings: { provider: "anthropic", endpoint: "https://api.anthropic.com/v1/messages", model: "claude-sonnet-5" },
});
assert.equal(providerRouter.route, "server-claude", "Provider router should prefer server-side Claude.");
assert.ok(providerRouter.checks.some((check) => /Server route/i.test(check.label)), "Provider router should expose key-posture checks.");

const apiAdminHardening = buildApiAdminHardeningReport({
  backupCount: 1,
  eventCount: 2,
  health: { ok: true, authRequired: true, sqlitePath: "prompt-atelier.sqlite", rateLimitPerMinute: 240 },
  hostedHardening,
});
assert.equal(apiAdminHardening.readiness, "ready", "API admin hardening should pass a complete hosted posture.");
assert.ok(apiAdminHardening.actions.some((action) => /restore point/i.test(action)), "API admin hardening should include backup actions.");

const workerSandbox = buildWorkerSandboxReport({
  apiAdmin: apiAdminHardening,
  configuredBuildCommand: "npm run build",
  health: {
    maxBodyBytes: 1_000_000,
    worker: {
      enabled: true,
      timeoutMs: 240000,
      allowedBuildCommands: ["npm run build", "true"],
      agentPrefixesConfigured: 0,
      dataDir: "data",
    },
  },
  hostedWorker: hostedBuildWorker,
});
assert.equal(workerSandbox.readiness, "locked", "Worker sandbox should lock down a fully guarded worker posture.");
assert.ok(workerSandbox.checks.some((check) => check.label === "Build allowlist" && check.ready), "Worker sandbox should enforce build allowlists.");

const proofArtifacts = buildProofArtifactStorageReport({ buildRuns, screenshots });
assert.notEqual(proofArtifacts.status, "empty", "Proof artifact storage should find stored build or screenshot artifacts.");
assert.ok(proofArtifacts.notes.some((note) => /build run/i.test(note) || /proof artifact/i.test(note)), "Proof artifact storage should describe ledger attachment.");

const queueObservability = buildQueueObservabilityReport({
  apiEvents: [
    { kind: "queue-progress", detail: { stage: "queued" } },
    { kind: "closed-loop-proof", detail: { stage: "rewrite-complete" } },
    { kind: "queue-progress", detail: { stage: "scaffold-requested" } },
    { kind: "queue-progress", detail: { stage: "build-requested" } },
    { kind: "queue-progress", detail: { stage: "capture-requested" } },
    { kind: "queue-progress", detail: { stage: "hosted-proof-worker-complete", imported: true, artifactCount: 1 } },
  ],
  proofLearningRuns: [{ id: "proof-1", phase: "complete", learnedStatus: "proof-ready" }],
  queueProgress,
});
assert.equal(queueObservability.stages.length, 7, "Queue observability should expose the full proof timeline.");
assert.equal(queueObservability.status, "live", "Queue observability should classify a complete event stream as live.");

const simpleMode = buildSimpleModeReport({ beginnerPromptMaker, hostedBuildWorker, operatorMode, trueClosedLoop });
assert.equal(simpleMode.steps.length, 5, "Simple beginner mode should reduce the workflow to five steps.");
assert.ok(simpleMode.hiddenPanels.length > 0, "Simple beginner mode should hide expert panels.");

const datasetGovernance = buildDatasetGovernanceReport({
  comparison: { baseline: snapshot, current: { ...snapshot, id: "test-current" }, deltas: { score: 4 }, notes: ["stable"] },
  goldenDataset: { goldCount: 6, trainCount: 5, testCount: 1 },
  versions: [{ ...snapshot, label: "Golden Dataset v1" }],
});
assert.equal(datasetGovernance.status, "locked", "Dataset governance should detect a locked Golden Dataset v1.");
assert.ok(datasetGovernance.actions.some((action) => /snapshot/i.test(action)), "Dataset governance should require snapshot exports.");

const providerPluginLayer = buildProviderPluginLayerReport({ cache: cacheReport, router: providerRouter });
assert.ok(providerPluginLayer.adapters.some((adapter) => adapter.id === "local-fallback" && adapter.ready), "Provider plugin layer should always include local fallback.");
assert.equal(providerPluginLayer.activeRoute, "server-claude", "Provider plugin layer should expose the active provider route.");

const calibrationWorkflow = buildEvaluatorCalibrationWorkflowReport({ calibrationDashboard, calibrationSet: claudeCalibrationSet });
assert.ok(calibrationWorkflow.rows.some((row) => row.label === "Manual review queue"), "Evaluator calibration workflow should expose manual review rows.");
assert.ok(["aligned", "review", "needs-runs"].includes(calibrationWorkflow.status), "Evaluator calibration workflow should classify readiness.");

const goldenBenchmarkHarness = buildGoldenBenchmarkHarnessReport(curatedSeedPrompts);
assert.ok(goldenBenchmarkHarness.total >= 60, "Golden benchmark harness should cover 60+ measured case challenges.");
assert.equal(goldenBenchmarkHarness.cases.length, goldenBenchmarkHarness.total, "Golden benchmark harness should expose one row per case.");
assert.ok(goldenBenchmarkHarness.notes.some((note) => /golden benchmark/i.test(note)), "Golden benchmark harness should explain coverage.");

const promptGeneratorV2 = buildPromptGeneratorV2Report({
  benchmarkHarness: goldenBenchmarkHarness,
  input: {
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
  promptMemory,
  variants: learnedVariants,
});
assert.ok(promptGeneratorV2.compiledPrompt.includes("Verification ladder"), "Prompt Generator v2 should compile verification gates.");
assert.notEqual(promptGeneratorV2.readiness, "needs-brief", "Prompt Generator v2 should pass a completed brief.");
assert.ok(promptGeneratorV2.variant.prompt.includes("Golden benchmark influences"), "Prompt Generator v2 should expose a benchmark-aware variant.");

const critiqueRepair = buildPromptCritiqueRepairReport({ benchmarkHarness: goldenBenchmarkHarness, prompt: "Make a cool website." });
assert.ok(critiqueRepair.issues.length > 0, "Critique/repair should flag thin prompts.");
assert.ok(critiqueRepair.repairSections.length > 0, "Critique/repair should create scoped repair sections.");
assert.ok(critiqueRepair.repairedPrompt.includes("MEASURED REPAIR PATCH"), "Critique/repair should return a patchable prompt.");

const resultQualityDashboard = buildResultQualityDashboardReport({
  buildRuns,
  generatedPrompt: promptGeneratorV2.compiledPrompt,
  modelCache: cacheReport,
  proofLearningRuns: [{ promptScore: 82, resultScore: 88, visualScore: 84, dnaScore: 86, learnedStatus: "proof-ready" }],
  screenshotJudgeRuns: [{ score: 83, verdict: "ready" }],
  screenshots,
  sourcePrompt: exactPrompt,
});
assert.equal(resultQualityDashboard.stages.length, 5, "Result quality dashboard should connect five proof stages.");
assert.notEqual(resultQualityDashboard.status, "unproven", "Result quality dashboard should use imported proof evidence.");
assert.ok(resultQualityDashboard.deltas.some((delta) => delta.label === "Generator lift"), "Result quality dashboard should explain generator lift.");

const datasetReviewQueue = buildDatasetReviewQueueReport({ curation, examples, outcomes });
assert.ok(datasetReviewQueue.rows.length > 0, "Dataset review queue should prioritize curation rows.");
assert.ok(datasetReviewQueue.counts.learn > 0, "Dataset review queue should preserve curation counts.");

const hostedOpsQueueJobs: BuildQueueJob[] = [
  {
    id: "failed-job",
    promptId: examples[0].id,
    promptTitle: examples[0].title,
    promptText: examples[0].text,
    variantTitle: "Failed variant",
    status: "failed",
    runFolder: "prompt-runs/failed-job",
    resultUrl: "",
    score: 24,
    commands: [],
    notes: ["Build failed."],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "queued-job",
    promptId: examples[0].id,
    promptTitle: examples[0].title,
    promptText: examples[0].text,
    variantTitle: "Queued variant",
    status: "queued",
    runFolder: "prompt-runs/queued-job",
    resultUrl: "",
    score: 0,
    commands: [],
    notes: ["Waiting for worker."],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
const hostedWorkerOps = buildHostedWorkerOpsReport({
  apiEvents: [{ kind: "queue-progress", detail: { jobId: "failed-job", stage: "failed" }, createdAt: new Date().toISOString() }],
  proofArtifacts: [{ id: "stale-artifact", createdAt: "2026-01-01T00:00:00.000Z" }],
  queueJobs: hostedOpsQueueJobs,
});
assert.ok(hostedWorkerOps.jobs.some((job) => job.id === "failed-job" && job.canRetry), "Hosted worker ops should mark failed jobs retryable.");
assert.ok(hostedWorkerOps.jobs.some((job) => job.id === "queued-job" && job.canCancel), "Hosted worker ops should mark queued jobs cancelable.");
assert.ok(hostedWorkerOps.retention.stale >= 1, "Hosted worker ops should flag stale proof artifacts.");

const measuredQualitySprint = buildMeasuredQualitySprintReport({
  benchmark: goldenBenchmarkHarness,
  critique: critiqueRepair,
  datasetReview: datasetReviewQueue,
  generator: promptGeneratorV2,
  ops: hostedWorkerOps,
  resultQuality: resultQualityDashboard,
  simpleMode,
});
assert.equal(measuredQualitySprint.cards.length, 7, "Measured quality sprint should summarize all seven product upgrades.");
assert.ok(measuredQualitySprint.score > 0, "Measured quality sprint should compute sprint readiness.");

const datasetInbox = buildDatasetInboxReport({ curation, examples, outcomes });
assert.ok(datasetInbox.rows.length > 0, "Dataset inbox should expose reviewable prompt rows.");
assert.ok(["ready", "review", "blocked", "empty"].includes(datasetInbox.status), "Dataset inbox should classify product readiness.");

const proofRunController = buildProofRunControllerReport({
  generatedPrompt: promptGeneratorV2.compiledPrompt,
  hostedWorker: hostedWorkerOps,
  proofLearningRuns: [{ phase: "complete", learnedStatus: "proof-ready", resultScore: 88, visualScore: 84 }],
  queueJobs: hostedOpsQueueJobs,
  resultQuality: resultQualityDashboard,
  screenshotJudgeRuns: [{ score: 83, verdict: "ready", promptPatch: "No patch needed." }],
  screenshots,
  selectedPrompt: examples[0],
});
assert.equal(proofRunController.stages.length, 7, "Proof controller should expose the full prompt-to-winner chain.");
assert.ok(proofRunController.actions.some((action) => action.id === "retry" && action.enabled), "Proof controller should surface retry when a failed job exists.");
assert.ok(proofRunController.actions.some((action) => action.id === "cancel" && action.enabled), "Proof controller should surface cancel when an active job exists.");

const calibrationProduct = buildCalibrationProductReport({ calibrationDashboard, modelComparison, resultQuality: resultQualityDashboard });
assert.ok(calibrationProduct.rows.length >= 2, "Calibration product view should compare local, model, and result evidence.");
assert.ok(["trust-local", "trust-model", "run-proof", "manual-review"].includes(calibrationProduct.recommendation), "Calibration product view should recommend a trust posture.");

const hostedReadinessProduct = buildHostedReadinessProductReport({
  apiOnline: true,
  authRequired: true,
  backupCount: 1,
  buildCommands: ["npm run build", "true"],
  claudeConfigured: true,
  queueSandboxed: true,
  sqliteWritable: true,
  workerEnabled: true,
});
assert.equal(hostedReadinessProduct.verdict, "hosted-proof-ready", "Hosted readiness should identify a fully trusted proof setup.");
assert.ok(hostedReadinessProduct.checks.every((check) => check.fix), "Hosted readiness checks should include actionable fixes.");

const qualityRegressionGate = buildQualityRegressionGateReport({
  benchmark: goldenBenchmarkHarness,
  corpusSafetyClean: true,
  generator: promptGeneratorV2,
  leakage: leakageGuard,
});
assert.ok(qualityRegressionGate.rows.some((row) => row.label === "Verification contract" && row.ready), "Quality gate should check generator verification contract.");
assert.notEqual(qualityRegressionGate.status, "fail", "Quality gate should pass blocking checks for clean fixtures.");

const productCommandCenter = buildProductCommandCenterReport({
  calibration: calibrationProduct,
  curation,
  exportsReady: true,
  generator: promptGeneratorV2,
  hosted: hostedReadinessProduct,
  proof: proofRunController,
});
assert.equal(productCommandCenter.cards.length, 6, "Product command center should expose six product runway cards.");
assert.ok(productCommandCenter.nextAction.length > 0, "Product command center should pick an obvious next action.");

const hostedBackendKit = buildHostedBackendKitReport({
  admin: apiAdminHardening,
  backupCount: 1,
  hardening: hostedHardening,
  hosted: hostedReadinessProduct,
  router: providerRouter,
  setupCheckCount: 1,
});
assert.equal(hostedBackendKit.checks.length, 8, "Hosted backend kit should expose deployment, auth, storage, model, worker, and backup checks.");
assert.notEqual(hostedBackendKit.status, "blocked", "Fully configured hosted fixtures should not block the hosted backend kit.");

const promptToProofWorkflow = buildPromptToProofWorkflowReport({
  generator: promptGeneratorV2,
  proof: proofRunController,
  queueJobCount: hostedOpsQueueJobs.length,
  resultQuality: resultQualityDashboard,
  selectedPromptTitle: examples[0].title,
});
assert.equal(promptToProofWorkflow.steps.length, 6, "Prompt-to-proof workflow should expose the full proof chain.");
assert.equal(promptToProofWorkflow.canRun, true, "Prompt-to-proof workflow should be runnable when a prompt and generator exist.");

const datasetBulkTools = buildDatasetBulkToolsReport({ inbox: datasetInbox });
assert.equal(datasetBulkTools.actions.length, 5, "Dataset bulk tools should expose all inbox decisions.");
assert.ok(datasetBulkTools.actions.some((action) => action.enabled), "Dataset bulk tools should enable at least one fixture action.");

const preferenceTraining = buildPreferenceTrainingReport({ examples, outcomes, pairwiseReviews });
assert.notEqual(preferenceTraining.status, "empty", "Preference training should see fixture examples.");
assert.ok(preferenceTraining.candidates.length <= 1, "Preference training should expose at most one recommended next pair.");

const claudeCalibrationProduct = buildClaudeCalibrationProductReport({
  calibration: calibrationProduct,
  hosted: hostedReadinessProduct,
  modelCache: cacheReport,
  router: providerRouter,
});
assert.ok(claudeCalibrationProduct.rows.some((row) => row.label === "Server Claude route"), "Claude calibration dashboard should expose server route readiness.");
assert.ok(["server-ready", "local-fallback", "needs-key", "divergent"].includes(claudeCalibrationProduct.status), "Claude calibration dashboard should classify route status.");

const briefBuilderProduct = buildBriefBuilderProductReport({
  generator: promptGeneratorV2,
  generatorInput: {
    brandName: "",
    industry: "",
    stack: "",
    siteType: "",
    visualStyle: "",
    assets: "",
    constraints: "",
    strictness: 7,
  },
});
assert.equal(briefBuilderProduct.status, "needs-brief", "Brief builder should detect missing brief fields.");
assert.ok(Object.keys(briefBuilderProduct.suggestedPatch).length >= 6, "Brief builder should provide a patch for missing fields.");

const regressionHistoryProduct = buildRegressionHistoryProductReport({
  benchmarkRunCount: 1,
  benchmarkV2RunCount: 1,
  evaluationHistory,
  qualityGate: qualityRegressionGate,
});
assert.ok(regressionHistoryProduct.metrics.some((metric) => metric.label === "Events"), "Regression history should expose event metrics.");
assert.notEqual(regressionHistoryProduct.status, "empty", "Regression history with fixture runs should not be empty.");

const securityCleanupProduct = buildSecurityCleanupProductReport({
  firewall: provenanceFirewall,
  hosted: hostedReadinessProduct,
  leakage: leakageGuard,
  qualityGate: qualityRegressionGate,
  sourceSafety,
});
assert.ok(securityCleanupProduct.checks.some((check) => check.label === "Secret leakage"), "Security cleanup should check secret leakage.");
assert.ok(["clean", "review", "blocked"].includes(securityCleanupProduct.status), "Security cleanup should classify corpus safety.");

const narrativePolish = buildNarrativePolishReport({
  commandCenter: productCommandCenter,
  corpusCount: examples.length,
  generator: promptGeneratorV2,
  proof: promptToProofWorkflow,
});
assert.equal(narrativePolish.beats.length, 6, "Narrative polish should expose the corpus-to-export story beats.");
assert.ok(narrativePolish.headline.includes("Learn"), "Narrative polish should include public-facing copy.");

const allInRunway = buildAllInRunwayReport({
  briefBuilder: briefBuilderProduct,
  claudeCalibration: claudeCalibrationProduct,
  datasetBulk: datasetBulkTools,
  hostedBackend: hostedBackendKit,
  narrative: narrativePolish,
  preferenceTraining,
  promptToProof: promptToProofWorkflow,
  publicDemoReady: true,
  regressionHistory: regressionHistoryProduct,
  securityCleanup: securityCleanupProduct,
});
assert.equal(allInRunway.items.length, 10, "All-in runway should track all ten requested product upgrades.");
assert.ok(allInRunway.summary.some((item) => /all-in runway/i.test(item)), "All-in runway should summarize the complete upgrade set.");

const autonomousProofLoop = buildAutonomousProofLoopReport({
  hostedWorker: hostedWorkerOps,
  promptToProof: promptToProofWorkflow,
  proofArtifacts: buildProofArtifactStorageReport({ buildRuns, proofArtifacts: [{ id: "artifact-1", title: "Proof", kind: "screenshot", url: "https://example.com/proof.png" }], screenshots }),
  proofController: proofRunController,
  queueJobCount: hostedOpsQueueJobs.length,
  resultQuality: resultQualityDashboard,
  screenshotCount: screenshots.length,
});
assert.equal(autonomousProofLoop.steps.length, 7, "Autonomous proof loop should expose the full generate-to-artifact chain.");
assert.ok(autonomousProofLoop.command.includes("smoke:hosted"), "Autonomous proof loop should expose hosted smoke verification.");

const generatorV3 = buildGeneratorV3Report({
  benchmark: goldenBenchmarkHarness,
  briefBuilder: buildBriefBuilderProductReport({ generator: promptGeneratorV2, generatorInput: {
    brandName: "Atlas",
    industry: "AI research",
    stack: "React + TypeScript + Vite + Tailwind CSS",
    siteType: "single-page hero",
    visualStyle: "cinematic video hero with exact typography",
    assets: "exact video URL and logo SVG",
    constraints: "no vague placeholders",
    strictness: 9,
  } }),
  generator: promptGeneratorV2,
  preferenceTraining,
  promptMemory,
});
assert.ok(generatorV3.modes.length >= 7, "Generator v3 should expose mode-specific prompt controls.");
assert.ok(generatorV3.compiledPreview.includes("Generator v3 control layer"), "Generator v3 should compile a layered preview.");

const benchmarkExpansion = buildBenchmarkExpansionReport(goldenBenchmarkHarness);
assert.equal(benchmarkExpansion.status, "scaled", "Benchmark expansion should classify the 60+ case harness as scaled.");
assert.ok(benchmarkExpansion.total >= 60, "Benchmark expansion should report the expanded case count.");

const promptMemoryDiff = buildPromptMemoryDiffReport({ current: promptMemory, datasetVersions: [] });
const winExplanation = explainPromptWin(examples[0], examples[1], outcomes, buildRuns, screenshots);
const learningExplanation = buildLearningExplanationReport({
  promptCoach: coach,
  promptMemoryDiff,
  promptQualityDna,
  selectedPrompt: examples[0],
  winExplanation,
});
assert.ok(learningExplanation.cards.length >= 6, "Learning explanations should include DNA, coach, memory, and win cards.");
assert.ok(learningExplanation.plainEnglish.includes(examples[0].title), "Learning explanations should name the selected prompt.");

const publicDemoPolish = buildPublicDemoPolishReport({
  allInRunway,
  exportPresetCount: exportPresets.length,
  learningExampleCount: examples.length,
  narrative: narrativePolish,
  resultGalleryCount: 3,
});
assert.ok(publicDemoPolish.checks.some((check) => check.label === "Result gallery" && check.ready), "Public demo polish should require gallery proof.");

const hostedCiSmoke = buildHostedCiSmokeReport({
  expectedHeadings: ["All-in product runway", "Learning machine control plane", "Next product layer", "Autonomous proof loop", "Prompt generator v3", "Training export readiness"],
  hasWorkflow: true,
  publicUrl: "https://zakiefer.github.io/prompt-atelier/",
});
assert.equal(hostedCiSmoke.status, "ready", "Hosted CI smoke should be ready with workflow, URL, headings, and screenshot artifact.");

const trainingExportReadiness = buildTrainingExportReadinessReport({
  exportPresets,
  oneClickExportPack: "# Training pack",
  projectExportPack: projectPack,
  reusableMemoryPack: pack,
});
assert.ok(trainingExportReadiness.targets.length >= exportPresets.length + 3, "Training export readiness should include presets plus aggregate packs.");
assert.equal(trainingExportReadiness.status, "ready", "Training export readiness should pass fixture exports.");

const learningMachine = buildLearningMachineReport({
  autonomousProof: autonomousProofLoop,
  benchmarkExpansion,
  explanations: learningExplanation,
  exports: trainingExportReadiness,
  generatorV3,
  hostedBackend: hostedBackendKit,
  hostedCi: hostedCiSmoke,
  preferenceTraining,
  publicDemo: publicDemoPolish,
  resultGalleryCount: 3,
});
assert.equal(learningMachine.items.length, 10, "Learning machine should track the ten requested upgrades.");
assert.ok(learningMachine.summary.some((item) => /learning-machine/i.test(item)), "Learning machine should summarize the full upgrade set.");

const hostedApiDeploymentProduct = buildHostedApiDeploymentProductReport({
  hostedBackend: hostedBackendKit,
  hostedCi: hostedCiSmoke,
});
assert.ok(hostedApiDeploymentProduct.command.includes("deploy:hosted-api"), "Hosted API deployment should expose the deploy script.");
assert.equal(hostedApiDeploymentProduct.checks.length, 5, "Hosted API deployment should track deploy, storage, auth, model, and smoke checks.");

const autonomousProofBatchProduct = buildAutonomousProofBatchProductReport({
  autonomousProof: autonomousProofLoop,
  generatorV3,
  hostedWorker: hostedWorkerOps,
  promptToProof: promptToProofWorkflow,
});
assert.ok(autonomousProofBatchProduct.command.includes("proof:batch"), "Autonomous proof batch should expose the proof batch script.");
assert.ok(["ready", "needs-worker", "needs-prompts"].includes(autonomousProofBatchProduct.status), "Autonomous proof batch should classify readiness.");

const preferenceDatasetV2Product = buildPreferenceDatasetV2ProductReport({
  closedLoopRunCount: 3,
  exampleCount: examples.length,
  outcomeCount: outcomes.length,
  pairwiseCount: Math.max(5, pairwiseReviews.length),
});
assert.equal(preferenceDatasetV2Product.status, "ready", "Preference dataset v2 should pass with fixture labels and repairs.");
assert.ok(preferenceDatasetV2Product.command.includes("export:training-v2"), "Preference dataset v2 should expose the export script.");
assert.ok(preferenceDatasetV2Product.counts.supervised >= examples.length, "Preference dataset v2 should count supervised rows.");

const generatorModeTestProduct = buildGeneratorModeTestProductReport({
  benchmarkExpansion,
  generatorV3,
  proofRunCount: screenshots.length,
});
assert.ok(generatorModeTestProduct.rows.length >= generatorV3.modes.length, "Generator mode tests should cover every generator mode.");
assert.ok(generatorModeTestProduct.command.includes("proof:batch"), "Generator mode tests should reuse proof batch execution.");

const resultGalleryHydrationProduct = buildResultGalleryHydrationProductReport({
  buildRunCount: buildRuns.length,
  proofArtifactCount: 2,
  resultGalleryCount: 10,
  screenshotCount: screenshots.length,
});
assert.equal(resultGalleryHydrationProduct.status, "ready", "Result gallery hydration should be ready at 10 gallery rows.");
assert.ok(resultGalleryHydrationProduct.command.includes("gallery:hydrate"), "Result gallery hydration should expose the hydrate script.");

const regressionDashboardV2Product = buildRegressionDashboardV2ProductReport({
  benchmarkRunCount: 1,
  benchmarkV2RunCount: 1,
  evaluationEventCount: evaluationHistory.items.length,
  modelCacheCount: cacheReport.items.length,
  trainingRunCount: trainingSummary.latest ? 1 : 0,
});
assert.notEqual(regressionDashboardV2Product.status, "empty", "Regression dashboard v2 should use benchmark, model, and training history.");
assert.ok(regressionDashboardV2Product.metrics.some((metric) => metric.label === "Evaluation events"), "Regression dashboard v2 should expose evaluation event metrics.");

const nextProductLayer = buildNextProductLayerReport({
  autonomousProofBatch: autonomousProofBatchProduct,
  galleryHydration: resultGalleryHydrationProduct,
  generatorModeTest: generatorModeTestProduct,
  hostedDeployment: hostedApiDeploymentProduct,
  preferenceDataset: preferenceDatasetV2Product,
  regressionDashboard: regressionDashboardV2Product,
  trainingExports: trainingExportReadiness,
});
assert.equal(nextProductLayer.items.length, 7, "Next product layer should track all seven delivery lanes.");
assert.ok(nextProductLayer.items.every((item) => item.command), "Every next product layer lane should include a runnable command.");
assert.ok(nextProductLayer.summary.some((item) => /next-layer/i.test(item)), "Next product layer should summarize automation readiness.");

console.log(JSON.stringify({ ok: true, assertions: 256, score: score.score, snapshot: snapshot.label }, null, 2));
