# AI Training Product Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build the approved guided AI training product layer for Prompt Atelier, including durable training runs, cached model intelligence, corpus intelligence, benchmark v2, candidate prompt loops, hosted readiness, and evaluation artifacts.

**Architecture:** Keep deterministic product intelligence in `src/promptEngine.ts`, persistence in existing browser/SQLite collection flows, API orchestration in `scripts/promptLabApi.mjs`, and presentation in `src/App.tsx` plus `src/styles.css`. Preserve all existing expert panels while adding a guided top-level Train workflow.

**Tech Stack:** React + TypeScript + Vite, local IndexedDB/browser storage, Node API with SQLite, Playwright for browser proof, existing model route and redaction helpers.

---

## File Structure

- Modify `src/promptEngine.ts`: add new records and pure report builders for training runs, cached evaluations, candidate tournaments, corpus intelligence, benchmark v2, safe-to-train readiness, and evaluation artifacts.
- Modify `src/App.tsx`: add state, derived reports, action handlers, guided workflow panels, setup wizard, run history, candidate loop, corpus intelligence, benchmark v2, and artifact panels.
- Modify `src/styles.css`: add responsive layout for guided workflow, run history, candidate cards, corpus clusters, setup wizard, and artifact cards.
- Modify `src/promptDb.ts`: add IndexedDB collection keys for the guided training product records.
- Modify `src/promptApi.ts`: add typed clients for new API routes.
- Modify `scripts/promptLabApi.mjs`: add new collection keys and safe API routes.
- Modify `scripts/testEngine.ts`: add regression assertions for pure engine reports.
- Modify `scripts/testApiRoutes.mjs`: add route assertions for new API endpoints and snapshot collections.
- Modify `README.md` and `docs/hosted-api.md`: document the product workflow and API additions.

## Task 1: Engine Product Types and Reports

**Files:**
- Modify: `src/promptEngine.ts`
- Test: `scripts/testEngine.ts`

- [x] **Step 1: Write failing engine tests**

Add tests that import:

```ts
buildBenchmarkV2Report,
buildCorpusIntelligenceReport,
buildEvaluationArtifact,
buildModelEvaluationCacheReport,
buildPromptCandidateTournament,
buildSafeToTrainReport,
buildTrainingRunSummary,
type TrainingRunRecord,
```

Assert:

```ts
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
  memoryDiff: { score: 80, summary: ["Memory improved"], addedSections: [], expandedSections: [], staleSections: [] },
  artifacts: [{ id: "artifact-test", title: "Artifact", kind: "json", detail: "Created" }],
  errors: [],
  notes: ["Training run completed."],
};
const trainingSummary = buildTrainingRunSummary([trainingRun]);
assert.equal(trainingSummary.latest?.id, "training-run-test");
assert.equal(trainingSummary.score, 84);
```

Add these additional assertions in the same test file:

```ts
const cacheReport = buildModelEvaluationCacheReport([
  { id: "cache-1", promptHash: "p1", memoryHash: "m1", provider: "local", schemaVersion: "prompt-atelier.model-evaluation.v1", score: 82, localScore: 78, delta: 4, readiness: "ready", findings: ["specific"], recommendations: ["ship"], createdAt: new Date().toISOString() },
]);
assert.equal(cacheReport.items[0].agreement, "agrees");

const candidateReport = buildPromptCandidateTournament({ candidates: learnedVariants.slice(0, 3), promptMemory, examples });
assert.ok(candidateReport.winner.prompt.length > 100);

const corpusIntelligence = buildCorpusIntelligenceReport(learningExamples, outcomes);
assert.ok(corpusIntelligence.clusters.length > 0);
assert.ok(corpusIntelligence.gaps.length > 0);

const benchmarkV2 = buildBenchmarkV2Report({ fixtures: BENCHMARK_FIXTURES, runs: benchmarkRuns, examples: learningExamples });
assert.ok(benchmarkV2.rows.length >= BENCHMARK_FIXTURES.length);

const safeToTrain = buildSafeToTrainReport({ apiOnline: true, authRequired: true, sqliteWritable: true, modelRouteWorking: true, redactionActive: true, queuePostureKnown: true, snapshotWorks: true });
assert.equal(safeToTrain.safe, true);

const artifact = buildEvaluationArtifact({ prompt: examples[0], promptMemory, qualityGate, visualRegression, sourceExamples: examples.slice(0, 3) });
assert.ok(artifact.markdown.includes("Evaluation Artifact"));
```

- [x] **Step 2: Run test to verify failure**

Run:

```bash
npm run test:engine
```

Expected: fail because the new exports do not exist.

- [x] **Step 3: Implement engine types and pure builders**

Add exported types:

```ts
export type TrainingRunStatus = "queued" | "running" | "complete" | "failed" | "needs-review";
export type TrainingRunStage = "queued" | "curating" | "evaluating" | "benchmarking" | "generating" | "proving" | "exporting" | "complete" | "failed";
export type TrainingRunRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: TrainingRunStatus;
  stage: TrainingRunStage;
  source: "corpus" | "selected-prompt" | "benchmark" | "generated-candidates";
  inputCounts: { prompts: number; outcomes: number; screenshots: number };
  scores: { starting: number; final: number; benchmark: number; memory: number; proof: number };
  benchmarkDelta: number;
  memoryDiff: PromptMemoryDiffReport;
  artifacts: { id: string; title: string; kind: "markdown" | "json" | "jsonl"; detail: string }[];
  errors: string[];
  notes: string[];
};
```

Implement:

```ts
export function buildTrainingRunSummary(runs: TrainingRunRecord[]) {
  const latest = runs[0];
  const score = latest?.scores.final ?? 0;
  return {
    latest,
    score,
    status: latest?.status ?? "queued",
    runs: runs.slice(0, 8),
    notes: latest ? latest.notes : ["No training run has been recorded yet."],
  };
}
```

Add deterministic builders for model cache, candidate tournament, corpus intelligence, benchmark v2, safe-to-train, and evaluation artifacts using existing helpers such as `evaluatePrompt`, `analyzePrompt`, `analyzeArchetypeClusters`, `buildPromptMemoryDiffReport`, and `buildExportPresets`.

- [x] **Step 4: Run engine tests**

Run:

```bash
npm run test:engine
```

Expected: pass.

- [x] **Step 5: Commit**

```bash
git add src/promptEngine.ts scripts/testEngine.ts
git commit -m "Add training product engine reports"
```

## Task 2: Persistence and API Routes

**Files:**
- Modify: `src/promptApi.ts`
- Modify: `scripts/promptLabApi.mjs`
- Test: `scripts/testApiRoutes.mjs`

- [x] **Step 1: Write failing API tests**

In `scripts/testApiRoutes.mjs`, assert:

```js
const trainingRun = await fetch(`${base}/api/training/run`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
  body: JSON.stringify({ source: "corpus", promptCount: 3, outcomeCount: 1, screenshotCount: 1 }),
});
const trainingRunPayload = await trainingRun.json();
if (!trainingRun.ok || !trainingRunPayload.trainingRun?.id) throw new Error("Training route should create a run.");
```

Also test `/api/model/evaluate-cached`, `/api/corpus/analyze`, `/api/benchmark/v2`, and `/api/artifact/create`.

- [x] **Step 2: Run route tests to verify failure**

Run:

```bash
npm run test:api
```

Expected: fail with missing route errors.

- [x] **Step 3: Add collection keys and route handlers**

Add collection keys:

```js
"trainingRuns",
"modelEvaluationCache",
"promptCandidateRuns",
"corpusClusterRuns",
"benchmarkV2Runs",
"evaluationArtifacts",
"hostedSetupChecks",
```

Implement route handlers that read current collections, append normalized records, use local deterministic summaries for corpus, benchmark, and artifact routes, use `localModelEvaluation` for cached evaluation fallback, and write back through `writeCollection`.

Use existing `redactSensitiveValue`, `withModelSchema`, `localModelEvaluation`, and `normalizeModelEvaluation`.

- [x] **Step 4: Add frontend API clients**

In `src/promptApi.ts`, add:

```ts
export function createTrainingRun(payload: Record<string, unknown>) {
  return requestJson<Record<string, unknown>>("/api/training/run", { method: "POST", body: JSON.stringify(payload) });
}
export function evaluateWithModelCache(payload: Record<string, unknown>) {
  return requestJson<Record<string, unknown>>("/api/model/evaluate-cached", { method: "POST", body: JSON.stringify(payload) });
}
export function analyzeCorpusViaApi(payload: Record<string, unknown>) {
  return requestJson<Record<string, unknown>>("/api/corpus/analyze", { method: "POST", body: JSON.stringify(payload) });
}
export function runBenchmarkV2ViaApi(payload: Record<string, unknown>) {
  return requestJson<Record<string, unknown>>("/api/benchmark/v2", { method: "POST", body: JSON.stringify(payload) });
}
export function createEvaluationArtifact(payload: Record<string, unknown>) {
  return requestJson<Record<string, unknown>>("/api/artifact/create", { method: "POST", body: JSON.stringify(payload) });
}
```

- [x] **Step 5: Run route tests**

Run:

```bash
npm run test:api
```

Expected: pass.

- [x] **Step 6: Commit**

```bash
git add src/promptApi.ts scripts/promptLabApi.mjs scripts/testApiRoutes.mjs
git commit -m "Add training product API routes"
```

## Task 3: Guided Train UX and Product Panels

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [x] **Step 1: Add new state collections**

Add local state and persistence entries for:

```ts
trainingRuns,
modelEvaluationCache,
promptCandidateRuns,
corpusClusterRuns,
benchmarkV2Runs,
evaluationArtifacts,
hostedSetupChecks,
```

Wire them through browser storage, IndexedDB `readAllCollections`, `syncToApi`, `pullFromApi`, snapshot export, and snapshot restore.

- [x] **Step 2: Add derived reports**

Use `useMemo` to derive:

```ts
trainingRunSummary,
modelEvaluationCacheReport,
promptCandidateTournament,
corpusIntelligence,
benchmarkV2,
safeToTrain,
latestEvaluationArtifact,
```

- [x] **Step 3: Add action handlers**

Add:

```ts
runGuidedTraining()
runCandidateQualityLoop()
runCorpusIntelligence()
runBenchmarkV2()
createSelectedEvaluationArtifact()
runHostedSetupWizard()
```

Each handler should update local state first and use API routes when available.

- [x] **Step 4: Add panels near top of Train tab**

Add components:

```tsx
GuidedTrainingWorkflowPanel
TrainingRunHistoryPanel
ModelIntelligencePanel
PromptCandidateLoopPanel
CorpusIntelligencePanel
BenchmarkV2Panel
SafeToTrainSetupPanel
EvaluationArtifactsPanel
```

Place them above the existing expert panels and keep all advanced panels intact.

- [x] **Step 5: Add responsive styles**

Add CSS grids/cards for the new panels. At mobile widths, all grids collapse to one column and buttons remain touch-friendly.

- [x] **Step 6: Run lint/build**

Run:

```bash
npm run lint
npm run build
```

Expected: both pass.

- [x] **Step 7: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "Add guided training product UI"
```

## Task 4: Documentation and Verification

**Files:**
- Modify: `README.md`
- Modify: `docs/hosted-api.md`

- [x] **Step 1: Update docs**

Document:

- guided workflow
- training runs
- cached model evaluation
- corpus intelligence
- benchmark v2
- evaluation artifacts
- hosted safe-to-train checks

- [x] **Step 2: Run full verification**

Run:

```bash
npm run lint
npm run test:engine
npm run check:corpus-safety
npm run test:api
npm run build
node --check scripts/promptLabApi.mjs
node --check scripts/testApiRoutes.mjs
node --check scripts/runQueue.mjs
node --check scripts/analyzeScreenshots.mjs
node --check scripts/visualQa.mjs
git diff --check
```

Expected: all pass.

- [x] **Step 3: Browser proof**

Run API and preview:

```bash
npm run api
npm run preview -- --host 127.0.0.1 --port 4173
```

Use Playwright to verify:

- guided workflow renders
- training run history renders
- candidate loop renders
- corpus intelligence renders
- benchmark v2 renders
- safe-to-train setup renders
- evaluation artifacts render
- no console errors with API running
- no horizontal overflow on desktop or mobile

- [x] **Step 4: Commit docs**

```bash
git add README.md docs/hosted-api.md docs/superpowers/plans/2026-07-04-ai-training-product.md
git commit -m "Document AI training product workflow"
```

- [x] **Step 5: Push and hosted proof**

```bash
git push origin main
gh run list --repo zakiefer/prompt-atelier --branch main --limit 5
```

Watch CI and Pages. After Pages succeeds, smoke:

```bash
node <<'NODE'
const { chromium } = await import('playwright');
const url = 'https://zakiefer.github.io/prompt-atelier/';
const response = await fetch(url, { cache: 'no-store' });
if (!response.ok) throw new Error(`Hosted app returned ${response.status}`);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
await page.goto(url, { waitUntil: 'networkidle' });
const trainButton = page.getByRole('button', { name: /train/i }).first();
if (await trainButton.count()) await trainButton.click();
await page.getByText('Guided training workflow', { exact: true }).waitFor({ timeout: 15000 });
await page.getByText('Training run history', { exact: true }).waitFor({ timeout: 15000 });
const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth + 2);
await browser.close();
if (errors.length || overflow) throw new Error(JSON.stringify({ errors, overflow }));
console.log(JSON.stringify({ ok: true, status: response.status, errors, overflow }, null, 2));
NODE
```

Expected: hosted page returns 200, Train tab renders new guided panels, no console errors, no overflow.
