# Hosted Prompt Atelier API

Prompt Atelier ships with a small Node 24 + SQLite API for syncing prompts, labels, screenshots, build runs, closed-loop trainer results, benchmark runs, Claude health checks, prompt comparisons, screenshot-generated prompts, workspace packs, proof-loop runs, screenshot judge results, mutation tournaments, and backups across browsers.

## Render Blueprint

1. Create a new Render Blueprint from this repository.
2. Render reads `render.yaml` and builds `Dockerfile.api`.
3. Copy the generated `PROMPT_LAB_API_TOKEN`.
4. In Prompt Atelier, open Train -> Hosted API and persistence readiness.
5. Set the API base to your Render URL and paste the token.
6. Click Check API, then Push API.
7. Use Connect hosted brain in the Train tab to verify health, SQLite writes, auth posture, and configured model settings before running calibration or one-click proof work.
8. Use Claude readiness without browser secrets to confirm API health, bearer auth, SQLite write visibility, model route behavior, and whether image judging can run through the server-side key.

## Required Environment

- `PROMPT_LAB_API_HOST=0.0.0.0`
- `PROMPT_LAB_API_TOKEN=<generated secret>`
- `PROMPT_LAB_DATA_DIR=/var/data/prompt-atelier`
- `PROMPT_LAB_ALLOWED_ORIGIN=https://zakiefer.github.io`
- `PROMPT_LAB_RATE_LIMIT=240`
- `PROMPT_LAB_MODEL_PROVIDER=anthropic`
- `PROMPT_LAB_MODEL_NAME=claude-sonnet-5`
- `ANTHROPIC_API_KEY=<Claude API key on the API host only>`

The SQLite file is stored on the mounted Render disk so the training state persists across deploys.

## Claude Scoring

Claude evaluation runs through `/api/model/evaluate` on the Node API. Keep `ANTHROPIC_API_KEY` on Render or your local API process; do not expose it to GitHub Pages or any browser-side `VITE_` variable. The static client only stores the API base URL and optional Prompt Atelier bearer token.

If the key is absent, the API falls back to the local evaluator so the app remains usable, but Claude batch calibration, closed-loop training, prompt coach, benchmark scoring, A/B prompt comparison, and screenshot-to-prompt generation are strongest when `ANTHROPIC_API_KEY` is configured on the API host.

Every model response is normalized to `schemaVersion: prompt-atelier.model-evaluation.v1` with `score`, `readiness`, `findings`, `recommendations`, optional prompt outputs, and a `redactions` array. Prompt text, memory, context, collection syncs, and API event details are redacted server-side before they are stored or logged.

## Training Artifacts

The hosted API advertises all durable collection keys from `/api/health` and stores each collection through `/api/collections`. The Train view now persists these higher-order artifacts in addition to the raw corpus:

- `claudeHealthChecks`: deep readiness checks for API health, token auth, SQLite writes, Claude key visibility, and model route scoring.
- `promptComparisons`: Claude/local A/B decisions plus hybrid prompts that are written back into the improvement flow.
- `screenshotPromptRuns`: prompts generated from a screenshot URL, uploaded data URL, or visual notes.
- `workspacePackRuns`: saved snapshots of workspace-specific prompt packs.
- `proofLearningRuns`: prompt -> build queue -> screenshot/result score -> label learning records.
- `screenshotJudgeRuns`: Claude/local visual judge results that turn screenshots into repair patches.
- `mutationTournamentRuns`: variant tournament histories and winners before spending another build run.
- `healthChecks`: lightweight write probes used by the hosted readiness check.

Screenshot uploads are sent to `/api/model/evaluate` as data URL image blocks only when the API route has access to the model key. Do not put image-generation or Claude keys in browser-visible environment variables.

## One-click Proof Runs

The Train tab's Run proof now action uses `/api/queue/run` with scaffold, install, build, and screenshot capture enabled. It imports the returned build run, desktop/mobile screenshot records, and proof-learning score into the browser state.

Run this only against a trusted API worker. The hosted static frontend never receives shell access or model secrets; it sends the selected prompt and queue options to the API, and the API decides whether queue execution is allowed in that environment.

The queue runner now returns a `progress` array, and the API writes durable `queue-progress` events for queued, requested scaffold/install/build/capture stages, and final complete/failed state. The Train tab's queue ledger reads those events through `/api/events`.

## Training Export Pack

The Train tab can export a full training pack containing Golden Dataset v1 rows, JSONL data, learned prompt memory, the prompt quality grader report, benchmark trend, project boundary state, reusable memory, and the Codex build pack. This is intended for handoff to another agent or model without giving that agent browser-local secrets.

The export studio also includes model-specific presets:

- OpenAI fine-tune JSONL
- Claude project memory
- Codex skill bundle
- model evaluation schema JSON

Use Train from this corpus after curation is clean. It locks Golden Dataset v1, runs the canonical benchmark suite, calibrates DNA, and exports the training pack from the current corpus.
