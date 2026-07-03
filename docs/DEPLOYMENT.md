# Deployment

Prompt Atelier is split into two deployment surfaces:

1. Static frontend: deploys to GitHub Pages from `dist/`.
2. Local API: runs on the developer machine for SQLite persistence, screenshot capture, queue execution, Codex skill install, and model evaluation.

## GitHub Pages

The `Deploy Pages` workflow builds the app on pushes to `main` and uploads `dist/` through GitHub Pages.

Repository settings:

- Pages source: GitHub Actions.
- Default branch: `main`.
- Expected URL: `https://zakiefer.github.io/prompt-atelier/`.

The Vite `base` path is controlled by `GITHUB_PAGES=true` in the workflow so local development still serves from `/`.

## Local API

Run the API beside the Vite app:

```bash
npm run api
```

The API listens on `http://127.0.0.1:8787` and writes SQLite state to `data/prompt-atelier.sqlite`.

The hosted/static frontend can point at any compatible API by setting the API base in the Train tab. For rebuild-time defaults, set:

```bash
VITE_PROMPT_ATELIER_API_BASE=https://your-api.example.com npm run build
```

Useful environment variables:

```bash
ANTHROPIC_API_KEY=... npm run api
PROMPT_LAB_MODEL_PROVIDER=anthropic npm run api
PROMPT_LAB_AGENT_COMMAND="codex exec --full-auto --prompt-file codex-task.md" npm run api
PROMPT_LAB_BUILD_COMMAND="npm run build" npm run api
```

Do not commit real API keys. `.env`, `.env.*`, and local data folders are ignored.

## Verification

Before merging:

```bash
npm run lint
npm run test:engine
npm run test:api
npm run build
for file in scripts/*.mjs; do node --check "$file"; done
```

For browser proof:

```bash
npm run dev
npm run api
npm run capture:result -- --url http://127.0.0.1:5173 --out output/playwright/prompt-atelier
```
