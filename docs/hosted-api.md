# Hosted Prompt Atelier API

Prompt Atelier ships with a small Node 24 + SQLite API for syncing prompts, labels, screenshots, build runs, true closed-loop judge/rewrite results, benchmark runs, Claude health checks, prompt comparisons, screenshot-generated prompts, workspace packs, learner sessions, proof-loop runs, screenshot judge results, mutation tournaments, guided training runs, cached model evaluations, corpus intelligence runs, benchmark v2 runs, evaluation artifacts, hosted setup checks, and backups across browsers.

The browser also computes deterministic training intelligence locally: corpus provenance, guided step readiness, real build-result learning, quality explanations, prompt recipes, benchmark-library coverage, generated-prompt editor guidance, model/local/result comparison, and best-next-action recommendations. These reports do not require a model key, but they become stronger when cached model evaluations, build runs, screenshots, and hosted artifacts are synced through the API.

The Train tab now exposes the same intelligence as a product runway: Product Command Center, Generate Prompt, Dataset Inbox, Proof Run Controller, Calibration, Hosted Readiness, and Quality Regression Gate. The all-in runway layer adds hosted backend verification, one-click prompt-to-proof, Dataset Inbox bulk tools, preference training, Claude calibration, brief-builder completion, public demo mode, regression history, security cleanup, and narrative polish. The Learning Machine control plane adds the next operating layer: autonomous proof orchestration, Prompt Generator v3 modes, 60+ golden benchmark challenges, result gallery proof, plain-English learning explanations, public demo polish, hosted CI smoke, and real training export readiness. The latest operator layer adds proof seeding, a preference review deck, generator brief checklist, public proof checklist, regression timeline export, and credential-boundary audit. The product evolution layer adds Prompt Learner mode, Learning Memory v2, side-by-side result review, holdout regression, prompt editor studio, isolated project spaces, modular report logic, and public demo experience polish without changing provider keys. The self-serve learner layer adds saved learning profiles, explainable quality scoring, prompt diff decisions, house-format compiler output, benchmark battles, batch training review, public demo routing, export packs, and learner/app chrome chunks that keep the bundle warning-free. The learner proof layer adds saved learner sessions, nearest-neighbor corpus teaching, why-not-100 rewrite moves, learned recipes, sample prompt gallery, target-specific exports, quarantine review, and Pages CI smokes for learner, Train, and demo routes. The productized learner layer adds sticky first-run navigation, a structured brief builder, saved-session reopen/details, actionable import/gold/bad/quarantine corpus decisions, outcome feedback with screenshot notes, visual proof gallery, and target exports that are genuinely different for Codex, Claude, v0, and GPT. These panels are deterministic browser reports with API-backed actions where available; if the hosted API is offline, the proof controller still queues local proof work so the operator can continue.

## Render Source Service

1. Create a Render web service or Blueprint from the public repository.
2. Render reads `render.yaml`, runs `npm ci`, and starts the API with `npm run api`.
3. Copy the generated `PROMPT_LAB_API_TOKEN`.
4. In Prompt Atelier, open Train -> Hosted API and persistence readiness.
5. Set the API base to your Render URL and paste the token.
6. Click Check API, then Push API.
7. Use Connect hosted brain in the Train tab to verify health, SQLite writes, auth posture, and configured model settings before running calibration or one-click proof work.
8. Use Claude readiness without browser secrets to confirm API health, bearer auth, SQLite write visibility, model route behavior, and whether image judging can run through the server-side key.
9. Run `npm run verify:hosted-api -- --url https://your-api.example.com --token <token>` from a terminal or CI smoke to prove the same hosted-readiness checks outside the browser.
10. Run `npm run deploy:hosted-api -- --url https://your-api.example.com --out output/hosted-api-deploy` after the source deploy to write a JSON deployment-readiness report.
11. Use `.github/workflows/render-api.yml` for repeatable `render.yaml` validation, Render API deploy triggering, hosted API verification, proof seeding, regression timeline export, and credential-boundary audit.

## Required Environment

- `PROMPT_LAB_API_HOST=0.0.0.0`
- `PROMPT_LAB_API_TOKEN=<generated secret>`
- `PROMPT_LAB_DATA_DIR=/tmp/prompt-atelier`
- `PROMPT_LAB_ALLOWED_ORIGIN=https://zakiefer.github.io`
- `PROMPT_LAB_RATE_LIMIT=240`
- `PROMPT_LAB_WORKER_ENABLED=false`
- `PROMPT_LAB_MODEL_PROVIDER=anthropic`
- `PROMPT_LAB_MODEL_NAME=claude-sonnet-5`
- `ANTHROPIC_API_KEY=<optional model provider key on the API host only>`

The free Render service writes SQLite state under `/tmp/prompt-atelier`, which is enough for public hosted smoke, demo checks, and handoff verification. If this becomes the production training backend, add payment info in Render, attach a persistent disk, and move `PROMPT_LAB_DATA_DIR` to that mounted disk path.

## Hosted Verifier CLI

Use the hosted verifier for repeatable smoke checks:

```bash
npm run verify:hosted-api -- --url http://127.0.0.1:8787
PROMPT_LAB_API_TOKEN=replace-me npm run verify:hosted-api -- --url https://your-api.example.com
PROMPT_LAB_API_TOKEN=replace-me npm run verify:hosted-api -- --url https://your-api.example.com --evaluate
npm run smoke:hosted -- --url https://zakiefer.github.io/prompt-atelier/ --out output/playwright/hosted-learner-smoke
npm run smoke:hosted -- --url https://zakiefer.github.io/prompt-atelier/ --train --out output/playwright/hosted-smoke
npm run smoke:hosted -- --url https://zakiefer.github.io/prompt-atelier/ --demo --out output/playwright/hosted-demo-smoke
```

The command checks `/api/health` and `/api/model/settings`, then optionally posts a tiny schema-compatible prompt to `/api/model/evaluate` when `--evaluate` is supplied. Output is JSON with booleans, route status, and next actions only. It never prints bearer tokens, Claude keys, or model endpoint secrets.

The hosted app smoke command is frontend-only. By default it loads the public learner, checks the self-serve learner headings, exercises sample loading, profile switching, brief-builder use, diff decisions, corpus review, outcome feedback, session saving/reopen, export download, verifies the learner section containers and horizontal overflow posture, and writes desktop/mobile screenshot artifacts. With `--train`, it switches to Train, checks the Learning Machine and Product Evolution headings, and verifies the Train section containers. With `--demo`, it opens the public demo route and captures the simplified demo experience. All three modes run without a hosted API token.

Blocking failures are limited to health reachability, bearer auth, SQLite storage, and the model-settings route. Worker enablement, build allowlists, Claude key visibility, and model-route readiness are reported as operational checks because a hosted demo can still run in deterministic fallback mode.

## Next-layer Automation CLIs

These commands are the terminal equivalents of the Train tab's Next Product Layer panel:

```bash
npm run deploy:hosted-api -- --out output/hosted-api-deploy
npm run proof:seed -- --limit 5 --out output/proof-seed-runway
npm run export:regression -- --out output/regression-timeline
npm run audit:security-boundary -- --out output/security-boundary
npm run export:training-v2 -- --out output/training-dataset-v2
npm run check:holdout -- --out output/holdout-regression
npm run gallery:hydrate -- --url http://127.0.0.1:8787 --out output/result-gallery
npm run proof:batch -- --url http://127.0.0.1:8787 --limit 1 --allow-fail --out output/autonomous-proof-batch
```

`deploy:hosted-api` is safe to run without a deploy hook or API URL; it still validates the Render service contract, package scripts, storage posture, bearer-token env, and server-side model-provider placeholder. Add `--require-deploy` only in CI or release jobs where a Render deploy hook, Render API workflow secrets, or reachable API URL is mandatory.

`proof:seed` creates a queue of proof jobs from hosted collections or the local curated corpus. It can run offline, sync queued jobs to `/api/collections`, or execute immediately against `/api/closed-loop/prove` with `--run` on a trusted worker host.

`export:regression` writes JSON and Markdown timeline artifacts from outcomes, builds, screenshots, pairwise reviews, cached model rows, benchmarks, proof runs, and training runs. It falls back to an empty local timeline when no hosted API is configured.

`audit:security-boundary` scans source, scripts, public corpus files, workflows, and env examples for raw provider keys, browser-exposed provider env vars, and client-side provider-key channels. It redacts any finding and reports only boundary posture; it does not change provider keys or deploy secrets.

`export:training-v2` writes supervised chat rows, chosen/rejected preference pairs, closed-loop repair rows, avoid/failure rows, and a manifest. It reads the hosted API when `--url` is supplied and falls back to the curated `src/prompts` corpus for offline exports.

`gallery:hydrate` derives result-gallery rows from synced build runs, screenshots, and proof artifacts. Add `--sync` only when the API token and collection write path are intentionally available.

`proof:batch` posts selected prompts to `/api/closed-loop/prove`. Use it only against a trusted worker host. `--allow-fail` records the proof-batch report even when the worker is disabled or a proof run is rejected.

## Claude Scoring

Claude evaluation runs through `/api/model/evaluate` on the Node API. Keep `ANTHROPIC_API_KEY` on Render or your local API process; do not expose it to GitHub Pages or any browser-side `VITE_` variable. The static client only stores the API base URL and optional Prompt Atelier bearer token.

If the key is absent, the API falls back to the local evaluator so the app remains usable, but Claude batch calibration, closed-loop training, prompt coach, benchmark scoring, A/B prompt comparison, and screenshot-to-prompt generation are strongest when `ANTHROPIC_API_KEY` is configured on the API host.

Every model response is normalized to `schemaVersion: prompt-atelier.model-evaluation.v1` with `score`, `readiness`, `findings`, `recommendations`, optional prompt outputs, and a `redactions` array. Prompt text, memory, context, collection syncs, and API event details are redacted server-side before they are stored or logged.

The Claude/local/result comparison panel reads cached model rows, local strength scoring, and imported build outcomes together. Keep the Claude key server-side only: the browser should never receive `ANTHROPIC_API_KEY`, and the deterministic fallback is used whenever the hosted route cannot score safely.

The true closed-loop route is `POST /api/closed-loop/run`. It redacts the prompt payload, scores the original prompt, requests or creates a rewritten prompt, scores the rewrite, persists a `closedLoopRuns` row, writes a `closed-loop-run` API event, and returns `{ run, original, improved, winnerPrompt, redactions, collections.closedLoopRuns }`. When `ANTHROPIC_API_KEY` is present on the API host, the route uses Claude through the same normalized schema as `/api/model/evaluate`; when it is absent, it returns a deterministic local fallback without exposing browser secrets.

The hosted proof worker route is `POST /api/closed-loop/prove`. It performs the same redacted original-vs-rewrite judging, then creates a queue job, writes a queue file under `PROMPT_LAB_DATA_DIR`, invokes `scripts/runQueue.mjs` with scaffold/build/capture options, imports the returned build result, stores `closedLoopRuns`, `queueJobs`, `proofLearningRuns`, `buildRuns`, `screenshots`, `lineage`, and `proofArtifacts`, and returns `{ run, job, proofRun, queueResult, winnerPrompt, collections }`. Treat this as a trusted-worker route: only enable it behind bearer auth on infrastructure where running scaffold/build commands is acceptable.

Worker execution is now explicitly fenced:

- `PROMPT_LAB_WORKER_ENABLED=false` disables `/api/queue/run` and `/api/closed-loop/prove`.
- `PROMPT_LAB_ALLOWED_BUILD_COMMANDS` is a comma-separated allowlist. Default: `npm run build,true`.
- `PROMPT_LAB_ALLOWED_AGENT_PREFIXES` is empty by default, which disables arbitrary agent commands. Add narrow prefixes only on trusted hosts.
- `PROMPT_LAB_WORKER_TIMEOUT_MS` caps worker execution time. Default: `240000`.
- `PROMPT_LAB_MAX_BODY_BYTES` caps request bodies before JSON parsing. Default: `1000000`.
- Queue files must resolve inside `PROMPT_LAB_DATA_DIR`; paths outside the data directory are rejected before write or spawn.

## Training Artifacts

The hosted API advertises all durable collection keys from `/api/health` and stores each collection through `/api/collections`. The Train view now persists these higher-order artifacts in addition to the raw corpus:

- `claudeHealthChecks`: deep readiness checks for API health, token auth, SQLite writes, Claude key visibility, and model route scoring.
- `promptComparisons`: Claude/local A/B decisions plus hybrid prompts that are written back into the improvement flow.
- `screenshotPromptRuns`: prompts generated from a screenshot URL, uploaded data URL, or visual notes.
- `workspacePackRuns`: saved snapshots of workspace-specific prompt packs.
- `learnerSessions`: saved self-serve learner sessions with source prompt, improved prompt, reviewed diff decisions, quality score, active profile, benchmark winner, and export readiness.
- `proofLearningRuns`: prompt -> build queue -> screenshot/result score -> label learning records.
- `screenshotJudgeRuns`: Claude/local visual judge results that turn screenshots into repair patches.
- `mutationTournamentRuns`: variant tournament histories and winners before spending another build run.
- `trainingRuns`: durable guided training records with inputs, scores, benchmark delta, memory diff, artifacts, errors, and notes.
- `modelEvaluationCache`: redacted cached model/local agreement rows keyed by prompt, memory, provider, and schema version.
- `promptCandidateRuns`: saved candidate tournaments from generated prompt variants and mutation winners.
- `corpusClusterRuns`: corpus intelligence snapshots with clusters, gaps, weak examples, suggestions, and quarantine hints.
- `benchmarkV2Runs`: deterministic benchmark v2 snapshots with fixture rows, missing traits, deltas, and suggested fixes.
- `evaluationArtifacts`: markdown/JSON proof packages for selected prompts, memory influences, quality gates, and next mutations.
- `hostedSetupChecks`: safe-to-train readiness runs covering API, auth, SQLite, model route, redaction, queue, and snapshot posture.
- `proofArtifacts`: screenshot/build artifacts imported from hosted proof worker queue results for drilldown and promotion review.
- `healthChecks`: lightweight write probes used by the hosted readiness check.

Screenshot uploads are sent to `/api/model/evaluate` as data URL image blocks only when the API route has access to the model key. Do not put image-generation or Claude keys in browser-visible environment variables.

## One-click Proof Runs

The Train tab's Run proof now action uses `/api/queue/run` with scaffold, install, build, and screenshot capture enabled. It imports the returned build run, desktop/mobile screenshot records, and proof-learning score into the browser state. The hosted proof worker does the same import server-side after `/api/closed-loop/prove`, so the browser receives durable collections instead of a loose `queue-result.json` handoff.

Run this only against a trusted API worker. The hosted static frontend never receives shell access or model secrets; it sends the selected prompt and queue options to the API, and the API decides whether queue execution is allowed in that environment.

The queue runner now returns a `progress` array, and the API writes durable `queue-progress` events for queued, requested scaffold/install/build/capture stages, hosted proof worker start/complete/failure, import status, and final complete/failed state. The Train tab's queue observability timeline reads those events through `/api/events`.

## Training Export Pack

The Train tab can export a full training pack containing Golden Dataset v1 rows, JSONL data, learned prompt memory, the prompt quality grader report, benchmark trend, project boundary state, reusable memory, and the Codex build pack. This is intended for handoff to another agent or model without giving that agent browser-local secrets.

The export studio also includes model-specific presets:

- OpenAI fine-tune JSONL
- Claude project memory
- Codex skill bundle
- model evaluation schema JSON

Use Train from this corpus after curation is clean. It locks Golden Dataset v1, runs the canonical benchmark suite, calibrates prompt strength, and exports the training pack from the current corpus.

## Guided Training Product Routes

The top of the Train tab can run without a model key, then enrich through API routes when the API is configured:

- `POST /api/training/run`: appends a guided training run and returns `{ trainingRun, collections.trainingRuns }`.
- `GET /api/training/runs`: returns stored guided training runs.
- `POST /api/model/evaluate-cached`: redacts prompt/model payloads, checks the cache, and appends a schema-versioned cache row when needed.
- `POST /api/closed-loop/run`: performs server-side original-vs-rewrite judging and appends a closed-loop winner row.
- `POST /api/closed-loop/prove`: chains closed-loop judging into the queue worker and appends closed-loop, queue, proof-learning, build-run, screenshot, lineage, and proof-artifact rows.
- `POST /api/queue/job`: updates an existing queue job with `{ jobId, action }`, where `action` is `retry`, `cancel`, or `remove`; retry requeues the job, cancel marks it failed for review, and remove deletes it from the queue ledger.
- `POST /api/corpus/analyze`: creates a deterministic corpus intelligence run from supplied examples.
- `POST /api/benchmark/v2`: creates a deterministic benchmark v2 run from supplied examples.
- `POST /api/artifact/create`: creates a markdown/JSON evaluation artifact for the selected prompt.

The browser always writes a local deterministic fallback before trying these routes. Hosted deployments should still set `PROMPT_LAB_API_TOKEN`, `PROMPT_LAB_DATA_DIR`, `PROMPT_LAB_ALLOWED_ORIGIN`, `PROMPT_LAB_ALLOWED_BUILD_COMMANDS`, and `PROMPT_LAB_WORKER_TIMEOUT_MS` before treating the setup as safe to train.

Safe-to-train should be considered a product gate, not just an API health check. A strong run has clean provenance, a locked dataset, recent backups, API auth, SQLite persistence, model-route readiness, redaction coverage, queue/proof history, benchmark coverage, and at least one imported build result or screenshot proof.

## Product Quality Gate

`npm run check:quality-gate` scans `src/prompts/*.md` for prompt-quality coverage and scans the corpus plus `public/attachment-prompts.json` for likely secrets or unrelated repo-operation contamination. It exits non-zero only for blocking contamination. Coverage gaps are report-only so the corpus can improve without hiding safety failures.

The report tracks stack, assets, layout, responsive behavior, typography, interactions, constraints, and proof instructions. CI runs it immediately after corpus safety, before API tests and build, so the hosted product cannot publish a corpus containing leaked keys or unrelated project material.
