# Hosted Prompt Atelier API

Prompt Atelier ships with a small Node 24 + SQLite API for syncing prompts, labels, screenshots, build runs, and backups across browsers.

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
- `ANTHROPIC_API_KEY` is optional. Leave it empty to use local fallback scoring.

The SQLite file is stored on the mounted Render disk so the training state persists across deploys.
