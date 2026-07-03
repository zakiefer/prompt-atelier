import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  analyzeCorpus,
  analyzeArchetypeClusters,
  buildGeneratorPresets,
  buildCodexBuildPack,
  buildExperimentLeaderboard,
  buildLearnedGeneratorVariants,
  buildPatternDashboard,
  buildProjectExportPack,
  buildPromptCoachReport,
  buildQualityGateReport,
  buildReusableMemoryPack,
  buildVisualRegressionReport,
  createDatasetVersionSnapshot,
  curatePromptCorpus,
  evaluatePrompt,
  type BuildRunRecord,
  type PairwiseReviewRecord,
  type OutcomeRecord,
  type PromptExample,
  type ScreenshotRecord,
} from "../src/promptEngine";

const corpusPayload = JSON.parse(readFileSync("public/attachment-prompts.json", "utf8")) as { prompts: PromptExample[] };

const exactPrompt = `Build a fullscreen hero section in React + TypeScript + Vite + Tailwind CSS.
Use this exact background video URL: https://example.com/hero.mp4.
The video must be cinematic, autoplay, loop, muted, and playsInline.
Specify fonts, colors, responsive mobile behavior, accessible buttons, hover states, and a Playwright screenshot verification checklist.
No decorative blobs, no unlisted UI libraries, and keep the first viewport focused on the product.`;

const examples = corpusPayload.prompts.slice(0, 8);
const score = evaluatePrompt(exactPrompt);
assert.ok(score.score >= 20, `Expected scoring smoke test >= 20, received ${score.score}`);
assert.ok(score.upgrades.some((item) => /asset|responsive|visual/i.test(item)), "Expected upgrades to include design/build signals.");

const promptScore = evaluatePrompt(examples[0].text);
assert.ok(promptScore.score >= 70, `Expected a gold corpus prompt score >= 70, received ${promptScore.score}`);
const curation = curatePromptCorpus(examples);
assert.ok(curation.counts.learn > 0, "Curation should keep website prompts in the learning set.");
assert.ok(curation.items.every((item) => item.promptId && item.reasons.length), "Curation items should include prompt ids and reasons.");
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

const coach = buildPromptCoachReport(exactPrompt, profile, outcomes);
assert.ok(coach.score > 0, "Prompt coach should return a score.");
assert.ok(coach.rewrittenPrompt.includes("Build"), "Prompt coach should return a rewritten prompt.");

const experimentLeaderboard = buildExperimentLeaderboard(examples, outcomes, buildRuns, pairwiseReviews);
assert.equal(experimentLeaderboard.items[0].promptId, examples[0].id, "Pairwise winner should lead the experiment leaderboard.");

const learnedVariants = buildLearnedGeneratorVariants(
  {
    brandName: "Atlas",
    industry: "AI research",
    stack: "React + TypeScript + Vite + Tailwind CSS",
    siteType: "single-page hero",
    visualStyle: "cinematic video hero with exact typography",
    assets: "exact video URL and logo SVG",
    constraints: "no vague placeholders",
    strictness: 9,
  },
  profile,
  presets,
  outcomes,
);
assert.equal(learnedVariants.length, 3, "Learned generator should create three variants.");
assert.ok(learnedVariants[0].prompt.includes("PROJECT-SPECIFIC REQUIREMENTS"), "Generator variant should include project requirements.");

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

console.log(JSON.stringify({ ok: true, assertions: 30, score: score.score, snapshot: snapshot.label }, null, 2));
