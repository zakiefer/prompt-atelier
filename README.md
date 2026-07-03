# Prompt Atelier

Prompt Atelier is a local workbench for learning what makes high-fidelity website prompts effective. It imports strong prompt examples, scores prompt DNA, compiles reusable recipes, runs prompt battles, tracks build outcomes, and exports a compact memory pack for future Codex sessions.

## Features

- Prompt corpus ingestion and duplicate detection
- Prompt DNA and ready-to-build quality gates
- Golden recipe distillation from successful examples
- Gold vs bad review workflow
- Autonomous prompt battle queue scaffolding
- Screenshot capture and visual analysis helpers
- Dataset version snapshots and comparisons
- Codex skill and reusable memory pack exports

## Development

```bash
npm install
npm run dev
```

Start the local API in a second terminal:

```bash
npm run api
```

Useful checks:

```bash
npm run lint
npm run build
node --check scripts/promptLabApi.mjs
node --check scripts/runQueue.mjs
node --check scripts/analyzeScreenshots.mjs
```

The app runs at `http://127.0.0.1:5173` and the API runs at `http://127.0.0.1:8787`.
