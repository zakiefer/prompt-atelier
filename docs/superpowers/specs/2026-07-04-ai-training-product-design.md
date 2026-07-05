# Prompt Atelier AI Training Product Design

## Goal

Turn Prompt Atelier from a powerful prompt-learning workbench into a guided AI training product for website prompts. The next release should preserve the current expert controls, but put a clearer training-run backbone above them so a user can ingest prompts, curate the corpus, train, generate, prove results, and export artifacts without needing to understand every panel first.

The release should implement the full pipeline:

```text
Ingest -> Curate -> Train -> Generate -> Prove -> Export
```

## Success Criteria

- A user can start a durable training run from the current corpus and see its status, stage, score, artifacts, benchmark delta, memory diff, and errors.
- Model-backed scoring feels first-class: model output is cached, normalized, comparable against local strength scoring, and safe from browser-secret exposure.
- The app can generate multiple prompt candidates, score them, explain the winner, mutate weaker candidates, and produce a final best prompt.
- Corpus intelligence shows clusters, archetype gaps, strongest prompt families, weak examples, and recommended prompt examples to add next.
- The Train tab has a guided top-level workflow while retaining advanced panels below.
- Hosted setup gives a clear safe-to-train verdict and exact remediation steps.
- Benchmark Suite v2 explains regressions and improvements, not just scores.
- Every generated prompt can be exported with evaluation artifacts: influences, rules used, quality explanations, proof status, and next mutation.

## Architecture

### Engine Layer

Add pure functions in `src/promptEngine.ts` for the new product intelligence:

- `TrainingRunRecord` and `buildTrainingRunSummary`
- `ModelEvaluationCacheReport`
- `PromptCandidateTournamentReport`
- `CorpusClusterReport`
- `CorpusGapReport`
- `BenchmarkV2Report`
- `EvaluationArtifactReport`
- `SafeToTrainReport`

These functions should stay deterministic, side-effect-free, and covered by `scripts/testEngine.ts`. The app and API should call them instead of duplicating scoring or summary logic.

### Persistence Layer

Add first-class collections for:

- `trainingRuns`
- `modelEvaluationCache`
- `promptCandidateRuns`
- `corpusClusterRuns`
- `benchmarkV2Runs`
- `evaluationArtifacts`
- `hostedSetupChecks`

The browser storage, IndexedDB bridge, SQLite API sync, snapshot export, and hosted API collection list should include these collections. Existing collections remain compatible.

### API Layer

Extend `scripts/promptLabApi.mjs` with safe endpoints:

- `POST /api/training/run`
- `GET /api/training/runs`
- `POST /api/model/evaluate-cached`
- `POST /api/corpus/analyze`
- `POST /api/benchmark/v2`
- `POST /api/artifact/create`

All endpoints must reuse existing auth, CORS, rate limiting, schema normalization, and server-side redaction. Model keys stay server-side only.

If a model key is unavailable, routes return local fallback results with explicit fallback metadata. They should not fail the product flow unless the requested action truly requires image/model support.

## Guided Train UX

Add a guided workflow panel at the top of Train:

```text
1. Ingest
2. Curate
3. Train
4. Generate
5. Prove
6. Export
```

Each stage should show:

- status: blocked, ready, running, complete, needs review
- one primary action
- key metric
- next fix if blocked
- link to the relevant expert panel

The guided workflow should not remove existing expert panels. It should act as the product surface; expert panels remain the advanced workbench below.

## Training Run Backbone

A training run is the central record of a learning pass.

Fields:

- `id`
- `createdAt`
- `updatedAt`
- `status`
- `stage`
- `source`: corpus, selected prompt, benchmark, generated candidates
- `inputCounts`
- `scores`: starting, final, benchmark, memory, proof
- `benchmarkDelta`
- `memoryDiff`
- `artifacts`
- `errors`
- `notes`

Stages:

- queued
- curating
- evaluating
- benchmarking
- generating
- proving
- exporting
- complete
- failed

The existing "Train from this corpus" button should create a `TrainingRunRecord`, update it through each stage, and write a final summary. If an intermediate step falls back to local logic, the run should still complete with a clear fallback note.

## Model Intelligence

The model layer should include:

- cached evaluations keyed by prompt hash, memory hash, model provider, and schema version
- retries for transient model/API failures
- local-vs-model score deltas
- "agreement" labels: agrees, model stricter, local stricter, divergent
- model explanation summaries in plain language
- redaction reports attached to evaluation metadata

The UI should show:

- score
- readiness
- model mode
- cache hit/miss
- local strength score
- delta
- explanation
- recommended next mutation

## Prompt Candidate Quality Loop

Add a candidate loop:

1. Generate 3-5 candidate prompts from the brief and corpus memory.
2. Score each candidate locally and with the model route when available.
3. Explain the winning candidate.
4. Mutate weak candidates using their failure reasons.
5. Produce a final best prompt with an evaluation artifact.

Candidate records should include:

- prompt text
- source examples
- applied memory rules
- score breakdown
- model findings
- mutation notes
- winner explanation

## Corpus Intelligence

Add corpus analysis reports:

- cluster prompts by archetype, stack, asset pattern, and layout type
- identify overrepresented and underrepresented archetypes
- list strongest prompt families
- list weak or suspicious examples
- suggest "add more prompts like this" targets
- surface examples that should be quarantined before training

The first version can use deterministic local heuristics. Model-assisted labeling can be added through the existing model route, but should not be required.

## Benchmark Suite V2

Benchmark V2 should expand the current benchmark output with expectations:

- fixture id and title
- expected traits
- missing traits
- local score
- model score
- delta from previous run
- regression explanation
- suggested fix

The UI should show a concise "learner got better/worse because..." summary, plus per-fixture details.

## Evaluation Artifacts

Every generated or improved prompt should be able to produce an artifact with:

- prompt title
- final prompt text
- examples it learned from
- memory rules used
- local and model scores
- winner explanation
- proof status
- benchmark context
- next mutation
- export formats

Artifacts should be persisted and exportable as Markdown and JSON.

## Hosted Setup Wizard

Add a setup wizard focused on "safe to train":

- API reachable
- token configured when hosted
- SQLite writable
- model provider configured
- model route returns schema v1
- server-side redaction active
- queue execution posture known
- CORS origin expected
- snapshot export works

The wizard should produce:

- safe-to-train score
- blocking issues
- exact fixes
- copyable environment checklist

## Error Handling

- Missing API: guided workflow falls back to browser/local mode and explains which features are unavailable.
- Missing model key: training continues with local evaluator and marks model-backed steps as fallback.
- Queue failure: training run persists failed stage, stderr summary, and recovery action.
- Redaction hit: operation proceeds with redacted data and records redaction metadata.
- Corrupt imported snapshot: reject unsupported collections and report precise parse errors.

## Testing

Add or extend:

- `scripts/testEngine.ts`
  - training-run summaries
  - candidate tournaments
  - corpus clusters and gaps
  - benchmark v2 report
  - evaluation artifact generation
  - safe-to-train report

- `scripts/testApiRoutes.mjs`
  - training-run route
  - cached model evaluation route
  - redaction on new routes
  - snapshot includes new collections
  - local fallback remains available

- Browser proof
  - guided workflow renders on desktop and mobile
  - no horizontal overflow
  - no console errors with API running
  - hosted Pages smoke renders the guided workflow

## Implementation Boundaries

- Do not remove existing expert panels.
- Keep model keys server-side only.
- Preserve existing snapshot compatibility.
- Prefer deterministic local reports first, with model-backed enhancement as optional.
- Keep large logic in `promptEngine.ts` or small helper modules, not deeply embedded in React JSX.
- Keep commits scoped and verifiable.

## Rollout Plan

Implement this as one release branch with four verifiable slices:

1. Engine and persistence backbone: types, pure reports, collections, snapshot compatibility, and tests.
2. API routes: training runs, cached evaluation, corpus analysis, benchmark v2, artifacts, and route tests.
3. Guided Train UX: workflow panel, setup wizard, run history, corpus intelligence, candidate loop, and artifact panels.
4. Verification and delivery: full local checks, desktop/mobile browser proof, commit, push, CI, Pages deploy, and hosted smoke.
