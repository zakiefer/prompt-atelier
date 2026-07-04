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
- Start-here proof loop that queues a build, blends prompt/result/screenshot/DNA scores, and records whether the prompt learned from real evidence
- One-click proof runner that can scaffold, build, capture desktop/mobile screenshots, import the result, and update the proof-learning ledger
- Proof runner progress tracking for queue, build, capture, and learning states
- Durable queue progress events in the hosted API plus a Train-tab queue ledger
- Train from this corpus action that locks Golden Dataset v1, benchmarks, calibrates, and exports the full training pack
- Before/after prompt evolution timeline that shows the selected prompt moving through mutation, screenshot judging, closed-loop training, proof, and benchmark scoring
- Prompt diff and evolution view that highlights added and removed signals between the source prompt and latest improved winner
- Prompt memory diff panel for spotting new, expanded, and thin memory sections
- Golden benchmark board for canonical website prompt challenges
- Regression benchmark suite that compares the latest benchmark average against the previous run and flags improved or regressed briefs
- Benchmark trend chart for seeing whether the learner is improving over time
- Claude/local screenshot judge that converts visual proof into repair patches
- Mutation tournament history so variants can compete before a build run is spent
- Project isolation guard and training-set curator v2 for keeping unrelated repo prompts out of website-prompt learning
- Pre-ingest contamination guard for repo tasks, deployment logs, likely secrets, and non-website prompt text
- Locked Golden Dataset v1 workflow with deterministic train/test JSONL export
- Prompt quality grader v2 covering exactness, visual specificity, implementation readiness, assets, responsiveness, and proof instructions
- Claude readiness panel that verifies hosted API, auth, SQLite, model route, and server-side key posture without exposing secrets in the browser
- Stable model-evaluation schema for Claude/local scoring plus server-side redaction before prompt data is stored
- Structured prompt generator front door for brand, industry, audience, stack, assets, constraints, motion, and proof requirements
- Workspace prompt packs and format adapters for Codex, Claude, v0, Cursor, JSON training sets, OpenAI fine-tune JSONL, Claude project memory, Codex skill bundles, evaluator schema JSON, and Markdown packs
- One-click full training export pack with golden dataset, JSONL, prompt memory, quality grader, benchmark trend, project boundary report, reusable memory pack, and Codex build pack

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
- Proof-loop runs, screenshot judge runs, mutation tournaments, Claude health checks, prompt comparisons, screenshot prompts, and workspace packs are persisted as first-class collections.

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
9. A Start Here path: prove the selected prompt, judge screenshots, run a mutation tournament, and refresh the benchmark suite.
10. A before/after evolution timeline, prompt diff view, quality grader v2, regression benchmark deltas, benchmark trend chart, and project isolation guard so each prompt can be improved without contaminating the corpus.
11. A structured generator front door and locked Golden Dataset v1 path for turning good examples into train/test JSONL.
12. A production-hardening checklist, hosted brain connector, and Claude readiness panel covering API health, token posture, server-side model key visibility, restore points, dataset versions, and proof history.
13. A collapsible training map, Train from this corpus button, queue progress ledger, memory diff, and visual proof gallery for operating the whole learner from one screen.

The tightest improvement cycle is:

```text
prompt -> queued build -> desktop/mobile screenshots -> screenshot judge -> mutation tournament -> regression benchmark -> learned corpus
```

The app is honest about missing proof. If no build result or screenshot exists yet, the proof loop records a queued run and tells you to import `queue-result.json` or attach screenshots before promoting a prompt to gold.

The corpus should only contain prompts intentionally imported for this project. Recipe, memory, search, and generator learning use curated website prompts by default.

Use the project isolation guard before running calibration or exporting training data. In an isolated workspace it reports out-of-scope prompts and can quarantine them so unrelated Codex project tasks do not affect website prompt recipes.

Use the one-click export pack when handing the learner to another agent or model. It bundles the locked dataset, JSONL rows, learned memory, benchmark trend, project boundary state, quality grader, reusable memory pack, and Codex build pack in one JSON artifact.

Use the Train from this corpus button after curation looks clean. It locks the current golden dataset, runs the benchmark suite, calibrates DNA against outcomes, and exports the model-training pack. The API and export paths redact recognized API keys, bearer tokens, and generic secrets before they are persisted or logged.

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
