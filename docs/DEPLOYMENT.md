# Deployment

Prompt Atelier is split into two deployment surfaces:

1. Static frontend: deploys to GitHub Pages from `dist/`.
2. API/worker: runs locally or as a hosted Node service for SQLite persistence, snapshot sync, model evaluation, API event history, and visual QA. Heavy queue execution is still best run on a trusted local worker.

## GitHub Pages

The `Deploy Pages` workflow builds the app on pushes to `main` and uploads `dist/` through GitHub Pages.
After deployment, a smoke job opens the public Pages URL, switches to the Train view, asserts the Learning Machine headings, and captures a screenshot artifact.

Repository settings:

- Pages source: GitHub Actions.
- Default branch: `main`.
- Expected URL: `https://zakiefer.github.io/prompt-atelier/`.

The Vite `base` path is controlled by `GITHUB_PAGES=true` in the workflow so local development still serves from `/`.
The Pages build also reads `PROMPT_LAB_API_URL` from GitHub Actions secrets and exposes it as `VITE_PROMPT_ATELIER_API_BASE`, so the public app can default to the hosted API without bundling the bearer token.

## API

Run the API beside the Vite app:

```bash
npm run api
```

The API listens on `http://127.0.0.1:8787` and writes SQLite state to `data/prompt-atelier.sqlite` by default.

The hosted/static frontend can point at any compatible API by setting the API base in the Train tab. For rebuild-time defaults, set:

```bash
VITE_PROMPT_ATELIER_API_BASE=https://your-api.example.com npm run build
```

Useful environment variables:

```bash
PORT=8787 npm run api
PROMPT_LAB_DATA_DIR=/data npm run api
PROMPT_LAB_API_TOKEN=replace-me npm run api
PROMPT_LAB_ALLOWED_ORIGIN=https://zakiefer.github.io npm run api
PROMPT_LAB_RATE_LIMIT=240 npm run api
ANTHROPIC_API_KEY=... npm run api
PROMPT_LAB_MODEL_PROVIDER=anthropic npm run api
PROMPT_LAB_AGENT_COMMAND="codex exec --full-auto --prompt-file codex-task.md" npm run api
PROMPT_LAB_BUILD_COMMAND="npm run build" npm run api
PROMPT_LAB_PREVIEW_PORT=4320 npm run run:queue -- --scaffold --install --capture
```

Hosted readiness can be checked without opening the browser:

```bash
npm run verify:hosted-api -- --url http://127.0.0.1:8787
PROMPT_LAB_API_TOKEN=replace-me npm run verify:hosted-api -- --url https://your-api.example.com --evaluate
npm run smoke:hosted -- --url https://zakiefer.github.io/prompt-atelier/ --train --out output/playwright/hosted-smoke
npm run deploy:hosted-api -- --url https://your-api.example.com --out output/hosted-api-deploy
```

The verifier reports API health, token posture, SQLite persistence, worker allowlists, model-route status, and optional evaluator health while redacting token and model-key values.

`deploy:hosted-api` validates the Render/API script contract, storage posture, server-side model-key requirements, optional Render deploy hooks, and optional hosted API reachability. It does not print bearer tokens or model keys. In release automation, use `--require-deploy` to fail when neither `RENDER_DEPLOY_HOOK_URL` nor a reachable `--url` is present.

Do not commit real API keys. `.env`, `.env.*`, and local data folders are ignored.

## Render API

`render.yaml` provisions a free Node web service that builds from the public GitHub repository and starts the API with `npm run api`. Set these secrets in Render:

- `PROMPT_LAB_API_TOKEN`: shared bearer token used by the Train tab API token field.
- `ANTHROPIC_API_KEY`: optional Claude evaluator key.

The free service stores SQLite data under `/tmp/prompt-atelier`, which is suitable for hosted smoke, training handoff, and public demo checks. For long-lived production persistence, add payment info in Render and attach a persistent disk, then move `PROMPT_LAB_DATA_DIR` back to a mounted path such as `/var/data/prompt-atelier`.

The health route stays public so deployment monitors can reach `/api/health`. All other API routes require `Authorization: Bearer <token>` or `x-prompt-lab-token` when `PROMPT_LAB_API_TOKEN` is configured.

Hosted services should not run arbitrary Codex agent commands unless the environment is intentionally sandboxed. For autonomous builds, export the queue from the Train tab and run a local trusted worker:

```bash
npm run run:queue -- --queue prompt-lab-queue.json --scaffold --install --capture --preview-port 4320
```

For automated desktop/mobile visual QA against a reachable result URL:

```bash
npm run visual:qa -- --url https://zakiefer.github.io/prompt-atelier/ --out output/visual-qa/pages
# add --api-token <token> when validating against a token-protected API
```

Blueprint deeplink after this file is merged to `main`:

```text
https://dashboard.render.com/blueprint/new?repo=https://github.com/zakiefer/prompt-atelier
```

Current live Render service:

- Service: `prompt-atelier-api`
- Service ID: `srv-d94ossa8qa3s73d2vjd0`
- URL: `https://prompt-atelier-api.onrender.com`
- Source: `https://github.com/zakiefer/prompt-atelier`, branch `main`
- Plan/runtime: free Node web service
- Build/start: `npm ci` / `npm run api`
- Worker execution: disabled with `PROMPT_LAB_WORKER_ENABLED=false`
- API auth: enabled with `PROMPT_LAB_API_TOKEN` stored in Render and mirrored to GitHub Actions secrets

The `Render API` GitHub Actions workflow has `RENDER_API_KEY`, `RENDER_SERVICE_ID`, `PROMPT_LAB_API_URL`, and `PROMPT_LAB_API_TOKEN` configured as repository secrets. On relevant pushes it validates the API package, triggers a real Render deploy for the current commit through the Render API, waits for `live`, then verifies the hosted API.

## Verification

Before merging:

```bash
npm run lint
npm run test:engine
npm run check:corpus-safety
npm run check:quality-gate
npm run verify:hosted-api -- --url http://127.0.0.1:8787
npm run smoke:hosted -- --url http://127.0.0.1:4173 --train --out output/playwright/learning-machine-local
npm run deploy:hosted-api -- --out output/hosted-api-deploy
npm run export:training-v2 -- --out output/training-dataset-v2
npm run gallery:hydrate -- --url http://127.0.0.1:8787 --out output/result-gallery
npm run proof:batch -- --url http://127.0.0.1:8787 --limit 1 --allow-fail --out output/autonomous-proof-batch
npm run test:api
npm run build
for file in scripts/*.mjs; do node --check "$file"; done
```

For browser proof:

```bash
npm run dev
npm run api
npm run capture:result -- --url http://127.0.0.1:5173 --out output/playwright/prompt-atelier
npm run visual:qa -- --url http://127.0.0.1:5173 --out output/visual-qa/local
```
