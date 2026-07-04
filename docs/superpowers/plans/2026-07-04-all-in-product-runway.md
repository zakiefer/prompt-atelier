# All-In Product Runway Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved all-in product runway for Prompt Atelier: Command Center, Generate front door, Dataset Inbox, Proof Controller, Calibration summary, hosted readiness, and regression gates.

**Architecture:** Add deterministic report builders in `src/promptEngine.ts`, then wire them through existing React state in `src/App.tsx`. Reuse current persistence/API collections; add no new database or framework. Add API wrappers only for product-level actions that are currently too low-level.

**Tech Stack:** React 18, TypeScript, Vite, local Node API, SQLite via existing API layer, deterministic engine tests, Playwright/browser smoke through existing tooling.

---

## File Map

- Modify `src/promptEngine.ts`: add pure report types/builders for product command center, dataset inbox, proof controller, calibration summary, hosted readiness, and regression gate.
- Modify `src/App.tsx`: compute new reports, add product panels, add handlers for dataset inbox actions and proof controller actions, and place the new command center first in Train.
- Modify `src/promptApi.ts`: add wrapper functions if new API endpoints are needed.
- Modify `scripts/promptLabApi.mjs`: add API product wrapper routes only if browser local sync is insufficient.
- Modify `scripts/testEngine.ts`: add regression assertions for the new report builders and command surfaces.
- Modify `scripts/testApiRoutes.mjs`: add API assertions only for any new API route wrappers.
- Create `scripts/checkQualityGate.mjs`: report-only product quality gate for corpus safety, benchmark coverage, generator prompt contract, and redaction-sensitive phrases.
- Modify `package.json`: add `check:quality-gate`.
- Modify `.github/workflows/ci.yml`: run the quality gate after corpus safety.
- Modify `README.md` and `docs/hosted-api.md`: document the new product runway and any API wrappers.

## Task 1: Engine Reports

**Files:**
- Modify: `src/promptEngine.ts`
- Test: `scripts/testEngine.ts`

- [ ] **Step 1: Add report types**

Add exported types near the existing measured-quality report types:

```ts
export type ProductCommandCenterReport = {
  score: number;
  status: "ready" | "blocked" | "needs-review";
  cards: { id: string; label: string; status: string; metric: string; reason: string; target: string; cta: string }[];
  nextAction: string;
  notes: string[];
};
```

Also add `DatasetInboxReport`, `ProofRunControllerReport`, `CalibrationProductReport`, `HostedReadinessProductReport`, and `QualityRegressionGateReport` with simple row/card fields.

- [ ] **Step 2: Implement builders**

Add pure exported builders:

```ts
export function buildProductCommandCenterReport(input: {
  curation: CorpusCurationReport;
  generator: PromptGeneratorV2Report;
  proof: ProofRunControllerReport;
  calibration: CalibrationProductReport;
  hosted: HostedReadinessProductReport;
  exportsReady: boolean;
}): ProductCommandCenterReport
```

Add similar deterministic builders:

- `buildDatasetInboxReport`
- `buildProofRunControllerReport`
- `buildCalibrationProductReport`
- `buildHostedReadinessProductReport`
- `buildQualityRegressionGateReport`

- [ ] **Step 3: Add tests**

In `scripts/testEngine.ts`, import the new builders and assert:

- command center exposes six cards
- dataset inbox can classify learn/review/quarantine rows
- proof controller shows hosted prove, retry, cancel, and repair guidance
- calibration product report detects local/model disagreement
- hosted readiness returns one of the documented verdicts
- quality gate has report-only rows and no secret leakage

- [ ] **Step 4: Verify**

Run:

```bash
npm run test:engine
```

Expected: pass with increased assertion count.

## Task 2: Train Product UI

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Import new types/builders**

Add imports for the new report builders and types from `src/promptEngine.ts`.

- [ ] **Step 2: Compute reports**

Add `useMemo` values in `App` for:

- `datasetInbox`
- `proofRunController`
- `calibrationProduct`
- `hostedReadinessProduct`
- `qualityRegressionGate`
- `productCommandCenter`

- [ ] **Step 3: Pass reports and handlers to `TrainView`**

Extend `TrainView` props with the new reports plus handlers:

- `onDatasetInboxDecision`
- `onProveGeneratedPrompt`

- [ ] **Step 4: Add product panels**

Add component functions:

- `ProductCommandCenterPanel`
- `GeneratePromptFrontDoorPanel`
- `DatasetInboxPanel`
- `ProofRunControllerPanel`
- `CalibrationProductPanel`
- `HostedReadinessProductPanel`
- `QualityRegressionGatePanel`

Place `ProductCommandCenterPanel` immediately after the Train hero, before the section navigator.

- [ ] **Step 5: Verify**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build pass.

## Task 3: Dataset and Proof Actions

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/promptApi.ts` only if needed
- Modify: `scripts/promptLabApi.mjs` only if needed

- [ ] **Step 1: Dataset inbox action handler**

Add `handleDatasetInboxDecision(promptId, action)` that maps:

- `learn` -> curation decision `learn`
- `review` -> curation decision `review`
- `quarantine` -> curation decision `quarantine`
- `gold` -> outcome status `gold`, rating `great`
- `remove` -> remove user prompt if it is user-generated, otherwise quarantine

- [ ] **Step 2: Proof generated prompt action**

Add `handleProveGeneratedPrompt()` that applies the Prompt Generator v2 variant and starts the existing hosted proof worker path when a selected prompt exists. If no selected prompt exists, it saves the generator variant as a user prompt first.

- [ ] **Step 3: Verify actions in browser build**

Run:

```bash
npm run build
```

Expected: pass.

## Task 4: Quality Gate Script and CI

**Files:**
- Create: `scripts/checkQualityGate.mjs`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Create report-only quality gate script**

The script should read `src/prompts/*.md`, reject known unrelated repo-operation phrases, and report:

- prompt count
- phrase safety
- benchmark signal hints
- generator contract hints

It should exit non-zero only for secret/unrelated-project contamination. Coverage thresholds are report-only.

- [ ] **Step 2: Add npm script**

Add:

```json
"check:quality-gate": "node scripts/checkQualityGate.mjs"
```

- [ ] **Step 3: Add CI step**

In `.github/workflows/ci.yml`, run `npm run check:quality-gate` after corpus safety.

- [ ] **Step 4: Verify**

Run:

```bash
npm run check:quality-gate
npm run lint
npm run test:engine
npm run check:corpus-safety
npm run test:api
npm run build
```

Expected: all pass.

## Task 5: Docs, Browser Proof, and Delivery

**Files:**
- Modify: `README.md`
- Modify: `docs/hosted-api.md`
- Modify: `scripts/testApiRoutes.mjs` if API routes were added

- [ ] **Step 1: Update docs**

Document:

- Command Center
- Generate front door
- Dataset Inbox
- Proof Controller
- Calibration summary
- Quality gate

- [ ] **Step 2: Full verification**

Run:

```bash
npm run lint
npm run test:engine
npm run check:corpus-safety
npm run check:quality-gate
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

- [ ] **Step 3: Browser proof**

Start API and preview:

```bash
npm run api
npm run preview -- --host 127.0.0.1 --port 4173
```

Use Playwright to confirm Train renders:

- Command Center
- Generate Prompt
- Dataset Inbox
- Proof Run Controller
- Calibration
- Hosted Readiness
- Quality Regression Gate

- [ ] **Step 4: Commit, push, PR, CI, deploy**

Commit implementation, push branch, create PR, wait for CI, merge, wait for Pages, and smoke the hosted URL.
