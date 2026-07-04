# Hosted Prompt Atelier API

Prompt Atelier ships with a small Node 24 + SQLite API for syncing prompts, labels, screenshots, build runs, closed-loop trainer results, benchmark runs, Claude health checks, prompt comparisons, screenshot-generated prompts, workspace packs, and backups across browsers.

## Render Blueprint

1. Create a new Render Blueprint from this repository.
2. Render reads `render.yaml` and builds `Dockerfile.api`.
3. Copy the generated `PROMPT_LAB_API_TOKEN`.
4. In Prompt Atelier, open Train -> Hosted API and persistence readiness.
5. Set the API base to your Render URL and paste the token.
6. Click Check API, then Push API.

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

## Training Artifacts

The hosted API advertises all durable collection keys from `/api/health` and stores each collection through `/api/collections`. The Train view now persists these higher-order artifacts in addition to the raw corpus:

- `claudeHealthChecks`: deep readiness checks for API health, token auth, SQLite writes, Claude key visibility, and model route scoring.
- `promptComparisons`: Claude/local A/B decisions plus hybrid prompts that are written back into the improvement flow.
- `screenshotPromptRuns`: prompts generated from a screenshot URL, uploaded data URL, or visual notes.
- `workspacePackRuns`: saved snapshots of workspace-specific prompt packs.
- `healthChecks`: lightweight write probes used by the hosted readiness check.

Screenshot uploads are sent to `/api/model/evaluate` as data URL image blocks only when the API route has access to the model key. Do not put image-generation or Claude keys in browser-visible environment variables.
