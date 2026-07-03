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

Useful checks:

```bash
npm run lint
npm run test:engine
npm run test:api
npm run build
node --check scripts/promptLabApi.mjs
node --check scripts/runQueue.mjs
node --check scripts/analyzeScreenshots.mjs
```

The app runs at `http://127.0.0.1:5173` and the API runs at `http://127.0.0.1:8787`.

## Persistence

- Static app state is saved in browser storage and IndexedDB.
- `npm run api` promotes collections into `data/prompt-atelier.sqlite`.
- Training snapshots can be exported and restored from the Train tab.
- Dataset versions are persisted as a first-class collection.
- Curation decisions and model batch evaluations are persisted as first-class collections.

## Learning Loop

The Train tab now starts with:

1. A first-run checklist for curation, versioning, API connection, calibration, and memory export.
2. Corpus curation that classifies website prompts, raw HTML prompts, repo tasks, and review tasks.
3. Claude/local batch calibration for comparing external model judgment against internal DNA scores.
4. A visual QA dashboard for screenshot coverage, failed runs, and pixel-analysis summaries.

The raw corpus remains visible, but recipe, memory, search, and generator learning use curated website prompts by default.

## Prompt Corpus

The runtime corpus is `public/attachment-prompts.json`. Regenerate tracked markdown source files with:

```bash
npm run export:prompts
```

Generated markdown lands in `prompts/`. The raw attachment markdown under `src/prompts/` is ignored because several pasted source files were sparse/corrupt on disk.

## Deployment

GitHub Actions includes:

- `CI`: lint, engine tests, API route tests, build, and script syntax checks.
- `Deploy Pages`: builds the static workbench for GitHub Pages on `main`.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for setup notes.
