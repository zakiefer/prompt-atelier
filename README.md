# Prompt Atelier

Prompt Atelier is a local workbench for learning what makes high-fidelity website prompts effective. It imports strong prompt examples, scores prompt DNA, compiles reusable recipes, runs prompt battles, tracks build outcomes, and exports a compact memory pack for future Codex sessions.

Demo target after Pages is enabled: `https://zakiefer.github.io/prompt-atelier/`

## Features

- Prompt corpus ingestion and duplicate detection
- Prompt DNA and ready-to-build quality gates
- Golden recipe distillation from successful examples
- Gold vs bad review workflow
- Autonomous prompt battle queue scaffolding
- Screenshot capture and visual analysis helpers
- Dataset version snapshots and comparisons
- Training snapshot export and restore
- Claude-native or custom external model evaluation through the local API
- Corpus curation so repo-task prompts can be quarantined from website-prompt learning
- Batch model calibration across curated prompts
- Configurable API base for local or hosted backend usage
- Token-protected hosted API mode with external SQLite data directory support
- Pairwise ground-truth labeling, pattern dashboards, prompt coaching, visual regression scoring, and project export packs
- Queue runner scaffolding that can install, build, preview, and capture screenshots for generated Vite apps
- Guided onboarding, learned prompt generator variants, experiment leaderboards, restore-point backups, Codex build packs, and API ops event history
- Automated visual QA for desktop/mobile screenshots, console errors, media readiness, text fit, overlap, and horizontal overflow
- Export presets for Codex, v0, Claude artifacts, Lovable, and raw implementation specs
- Codex skill and reusable memory pack exports

## Development

```bash
npm install
npm run dev
```

Start the local API in a second terminal for SQLite persistence, screenshots, queue running, skill install, and external model evaluation:

```bash
npm run api
```

Optional Claude evaluator:

```bash
ANTHROPIC_API_KEY=... npm run api
```

Hosted-style API with persistent storage and bearer auth:

```bash
PROMPT_LAB_DATA_DIR=/data \
PROMPT_LAB_API_TOKEN=replace-me \
PROMPT_LAB_ALLOWED_ORIGIN=https://zakiefer.github.io \
PROMPT_LAB_RATE_LIMIT=240 \
npm run api
```

Queue worker smoke for scaffolded builds:

```bash
npm run run:queue -- --queue prompt-lab-queue.json --scaffold --install --capture --preview-port 4320
```

Automated visual QA against any running result:

```bash
npm run visual:qa -- --url http://127.0.0.1:5173 --out output/visual-qa/latest
# with a token-protected API running:
PROMPT_LAB_API_TOKEN=replace-me npm run visual:qa -- --url http://127.0.0.1:5173 --out output/visual-qa/latest --api-token replace-me
```

Useful checks:

```bash
npm run lint
npm run test:engine
npm run test:api
npm run build
node --check scripts/promptLabApi.mjs
node --check scripts/runQueue.mjs
node --check scripts/analyzeScreenshots.mjs
node --check scripts/visualQa.mjs
```

The app runs at `http://127.0.0.1:5173` and the API runs at `http://127.0.0.1:8787`.

## Persistence

- Static app state is saved in browser storage and IndexedDB.
- `npm run api` promotes collections into `data/prompt-atelier.sqlite`.
- Training snapshots can be exported and restored from the Train tab.
- Dataset versions are persisted as a first-class collection.
- Curation decisions and model batch evaluations are persisted as first-class collections.
- Pairwise reviews are persisted as a first-class collection.

## Learning Loop

The Train tab now starts with:

1. A first-run checklist for curation, versioning, API connection, calibration, and memory export.
2. Corpus curation that classifies website prompts and keeps unrelated repo-operation tasks out of the learning set.
3. Claude/local batch calibration for comparing external model judgment against internal DNA scores.
4. Pairwise labeling that converts human preference into gold and avoid outcome records.
5. Pattern and visual regression dashboards for spotting which prompt structures are actually winning.
6. A Claude/local prompt coach and project export pack for turning the current state into a reusable handoff.
7. Guided generator, leaderboard, backup, Codex build-pack, and security/ops panels for running the loop as a product.
8. Import audits, evaluation history, export presets, and automated visual QA so prompt quality is judged against real build evidence.

The corpus should only contain prompts intentionally imported for this project. Recipe, memory, search, and generator learning use curated website prompts by default.

## Prompt Corpus

The curated source corpus is `src/prompts/`. `public/attachment-prompts.json` is optional extra input generated only from explicitly allowlisted attachment directories.

To sync allowlisted attachments, add their directory IDs to `config/curated-attachment-sources.json`, then run:

```bash
npm run sync:attachments
```

To regenerate the human-readable `prompts/` export from the optional public attachment file:

```bash
npm run export:prompts
```

Generated markdown lands in `prompts/`. The attachment sync is intentionally opt-in so unrelated Codex project attachments cannot enter the prompt-learning corpus.

## Deployment

GitHub Actions includes:

- `CI`: lint, engine tests, API route tests, build, and script syntax checks.
- `Deploy Pages`: builds the static workbench for GitHub Pages on `main`.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for setup notes.
