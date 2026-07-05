# Prompt Atelier All-In Product Runway Design

## Goal

Turn Prompt Atelier from a powerful expert workbench into a guided product that can reliably generate, review, prove, repair, and export excellent website prompts.

This sprint should preserve the advanced Train-tab machinery, but the primary experience should become:

```text
Import -> Review -> Generate -> Prove -> Calibrate -> Export
```

The app should feel useful even when the user does not understand every scoring panel. The expert panels remain available, but a new command center should make the next action obvious.

## Success Criteria

- A user can create a high-quality website prompt from a short brief without opening advanced panels.
- Imported prompts enter a dataset inbox where each row can be accepted, marked gold, rejected, or quarantined with reasons.
- A proof run can connect generated prompt text to build output, screenshots, visual judgment, repair patches, and winner selection.
- Claude calibration compares server-side model scores against local strength scoring and flags disagreement.
- The Train tab starts with a simplified command center and hides advanced detail behind clear sections.
- Hosted API setup is actionable enough to run persistent server-side evaluation and guarded worker proof.
- CI can detect quality regressions in corpus safety, benchmark coverage, generator output, and API contracts.

## Recommended Approach

Use the all-in product runway approach.

The narrow option would polish only the generator and Train tab, but it would leave proof and dataset governance feeling disconnected. The infrastructure-first option would make hosted execution stronger, but users would still need to understand too many panels. The all-in runway is the right next step because the underlying engine already exists; the product now needs a coherent path across those capabilities.

## Product Surface

### Command Center

Add a first panel at the top of Train called `Command Center`.

It should expose six cards:

1. Import prompts
2. Review dataset
3. Generate prompt
4. Prove result
5. Calibrate evaluator
6. Export pack

Each card shows:

- status: blocked, ready, running, complete, needs review
- one primary action
- one key metric
- short reason
- link or scroll target to the relevant advanced section

The command center should be the default operating surface. Existing expert panels stay below it.

### Generate Prompt Front Door

Add a beginner-safe generation flow that asks for:

- brand or project name
- site type
- audience
- goal
- visual signature
- required assets
- constraints and no-go rules
- preferred stack

Output:

- compiled prompt
- prompt score
- benchmark influences
- critique issues
- repaired version
- copy/export buttons
- "Prove this prompt" action

The flow should reuse `buildPromptGeneratorV2Report` and `buildPromptCritiqueRepairReport`. It should not create a second scoring system.

### Dataset Inbox

Add a review inbox for imported and curated prompts.

Rows should include:

- title
- source
- recommendation: learn, review, quarantine
- duplicate or contamination warnings
- score
- reason
- actions: learn, gold, review, quarantine, remove

The inbox should write to existing curation/outcome collections where possible. It should make it hard for unrelated repo tasks, secrets, or non-website content to enter the learning corpus.

### Proof Run Controller

Add a proof controller that links:

```text
prompt -> queue job -> build run -> screenshots -> screenshot judge -> repair -> winner
```

The first version should support:

- starting from the selected or generated prompt
- calling `/api/closed-loop/prove` when hosted worker execution is enabled
- falling back to local queued proof records when no worker is available
- importing build runs, screenshots, lineage, proof-learning rows, and proof artifacts
- surfacing retry/cancel/remove operations from `/api/queue/job`
- showing the current proof stage and the next corrective action

It should not run arbitrary commands from the browser. Worker execution remains API-side and governed by existing allowlists.

### Claude Calibration Dashboard

Add a calibration surface that compares:

- local strength score
- cached model score
- screenshot judge score
- result/build score
- benchmark fixture expected score

It should show:

- agreement label
- stricter evaluator
- biggest disagreement
- recommendation: trust local, trust model, run proof, or manual review
- "run calibration batch" action

This should use existing cached model evaluation and calibration reports, then add a clearer top-level product view.

### Hosted Setup and Deployment Readiness

Add a hosted setup section that focuses on action, not diagnostics alone.

It should show:

- API URL
- token status
- SQLite writable
- server-side Claude key status
- worker enabled status
- allowed build commands
- queue path sandbox status
- latest backup/snapshot
- latest Pages deploy status if available locally through GitHub CLI or API

It should output a clear verdict:

- local-only
- hosted sync ready
- hosted judge ready
- hosted proof ready
- unsafe

No model API key should ever be stored in browser-visible state.

## Data and Persistence

Reuse existing collections where possible:

- `userPrompts`
- `outcomes`
- `curationDecisions`
- `queueJobs`
- `buildRuns`
- `screenshots`
- `proofLearningRuns`
- `screenshotJudgeRuns`
- `modelEvaluationCache`
- `benchmarkV2Runs`
- `evaluationArtifacts`
- `proofArtifacts`
- `trainingRuns`

Add new collections only if a record cannot fit existing data cleanly. Prefer derived reports for command-center state instead of storing duplicate summaries.

## API Changes

Add API routes only where browser-only logic is insufficient:

- `POST /api/dataset/review` for durable inbox decisions, if local collection sync is not enough.
- `POST /api/proof/run` as a friendlier wrapper over `/api/closed-loop/prove`, if the current route becomes too implementation-specific for the product UI.
- `POST /api/calibration/run` for batch model calibration, if existing cached evaluation endpoints are too low-level.

All API routes must:

- use existing auth, CORS, and rate limits
- redact secrets before persistence
- return deterministic local fallback data when model keys are absent
- never expose `ANTHROPIC_API_KEY`, bearer tokens, or shell command internals to the browser

## UI Organization

The Train tab should be reorganized into these visible groups:

1. Command Center
2. Generate
3. Dataset Inbox
4. Prove
5. Calibrate
6. Export
7. Advanced Diagnostics

Advanced Diagnostics can contain the existing detailed panels, but the first six sections should be understandable without reading the whole product history.

## Error Handling

- Missing hosted API: show local-only mode and keep deterministic generation available.
- Missing Claude key: use local fallback and explain that model calibration is unavailable.
- Worker disabled: allow queued proof records but disable real build execution.
- Build failure: keep logs, mark proof as needs repair, and expose retry/cancel.
- Screenshot failure: keep build result, mark visual proof missing, and suggest capture/import.
- Dataset contamination: quarantine by default and require manual promotion.

## Testing and Regression Gates

Extend `scripts/testEngine.ts` for:

- command center report state
- generator front-door output
- dataset inbox prioritization
- proof controller stage transitions
- calibration disagreement summaries
- export-pack completeness

Extend `scripts/testApiRoutes.mjs` for any new API wrapper routes.

Add a CI quality gate script that checks:

- curated corpus safety
- golden benchmark coverage threshold
- generated prompt includes verification, responsive rules, exact assets, and constraints
- no known unrelated project phrases in seed corpus
- API route syntax and redaction behavior

The gate should start as report-only if thresholds are still being tuned, then become blocking once stable.

## Rollout Plan

1. Add pure engine reports for command center, dataset inbox, proof controller, calibration summary, and regression gate.
2. Wire browser persistence and API sync only for records that are not already covered.
3. Add Train-tab command center and regroup the existing panels.
4. Add the Generate Prompt front door and connect it to critique/repair and proof actions.
5. Add dataset inbox actions and ensure curation/outcome records update consistently.
6. Add proof controller actions for hosted prove, local fallback, retry, cancel, and remove.
7. Add calibration product view.
8. Add regression gate script and tests.
9. Run full local checks, browser proof, PR, CI, Pages deploy, and hosted smoke.

## Non-Goals

- Do not build a multi-user SaaS account system in this sprint.
- Do not expose model keys in the static app.
- Do not allow arbitrary shell command execution from browser input.
- Do not replace the existing expert panels; reorganize and summarize them.
- Do not introduce a new database or framework.

## Acceptance Checklist

- Command Center appears first in Train and gives one obvious next action.
- Generate Prompt produces a complete prompt, critique, repaired prompt, score, and export/prove actions.
- Dataset Inbox can move examples between learn, gold, review, quarantine, and remove states.
- Proof Controller can start proof, import results, retry/cancel/remove jobs, and show repair guidance.
- Calibration view explains local/model/result disagreement in plain language.
- Hosted setup view gives a clear safe-to-train verdict.
- Regression gate script runs in CI or is documented as report-only with clear thresholds.
- `npm run lint`, `npm run test:engine`, `npm run check:corpus-safety`, `npm run test:api`, `npm run build`, script syntax checks, browser smoke, PR checks, Pages deploy, and hosted smoke all pass.
