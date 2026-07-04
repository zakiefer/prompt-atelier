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
- Guided AI training workflow with durable run history, cached model/local agreement, candidate prompt quality loops, corpus intelligence, benchmark v2, safe-to-train checks, and evaluation artifacts
- Best-next-action guidance, one-click training stepper, corpus provenance firewall, build-result learning loop, Claude/local/result comparison, prompt recipe distiller, section editor coaching, explainable Prompt Quality DNA, and benchmark-library coverage
- Beginner/expert operator mode, large-paste import wizard, golden/bad speed labeling, training-run replay, benchmark battles, score calibration, and hosted hardening panels
- True closed-loop runner that can generate, build-queue, screenshot-proof, judge, rewrite, and save the winning prompt through the hosted API when available
- Hosted proof worker that chains closed-loop judging into scaffold/build/capture queue execution through `/api/closed-loop/prove`
- Calibration fixtures, closed-loop run details, bulk-ingest pipeline preview, Golden Dataset v1 lock posture, beginner prompt maker, failure-memory autopilot, before/after proof comparison, provider routing, and API admin hardening
- Production proof layer with worker command sandboxing, automatic proof import, screenshot artifact storage, queue observability, evaluator calibration workflow, dataset governance, beginner-mode cleanup, and provider plugin readiness
- Measured-quality sprint layer with a golden benchmark harness, Prompt Generator v2, critique/repair loop, result quality dashboard, dataset review queue, and hosted worker operations controls

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
npm run check:corpus-safety
npm run test:api
npm run build
node --check scripts/promptLabApi.mjs
node --check scripts/testApiRoutes.mjs
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
- Training runs, cached model evaluations, candidate loops, corpus intelligence runs, benchmark v2 runs, safe-to-train setup checks, and evaluation artifacts are persisted as first-class collections.

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
14. A guided training product layer that records durable training runs, compares cached model judgment against local DNA, picks prompt candidates before spending build time, analyzes corpus gaps, runs benchmark v2, checks hosted safe-to-train posture, and packages evaluation artifacts.
15. A best-next-action assistant, one-click stepper, provenance firewall, real build-result learning report, Claude/local/result comparison dashboard, distilled prompt recipes, generated-prompt editor guidance, explainable DNA dimensions, and benchmark-library coverage so the Train tab tells you what to do next instead of only showing raw scores.
16. A beginner/expert operator layer that turns the noisy training workspace into import, label, prove, rewrite, and export cards.
17. A true closed-loop runway that connects prompt generation, build queue creation, screenshot proof, server-side Claude/local judging, section regeneration, winner saving, and artifact export.
18. Calibration, benchmark battle, replay, and hosted-hardening panels that show whether model scores, labels, API posture, backups, and real build proof are strong enough to keep learning.
19. A hosted proof worker and admin layer that can run `/api/closed-loop/prove`, scaffold a Vite app, build, capture screenshots, record proof rows, and keep API health/backups/rate-limit/key posture visible.
20. A beginner product path with one-click prompt generation, bulk-ingest preview, Golden Dataset v1 lock status, failure-memory autopilot, before/after visual proof, and provider routing for Claude, external evaluators, or local fallback.
21. A production proof layer that fences worker files inside `PROMPT_LAB_DATA_DIR`, allowlists build commands, imports returned build/screenshot/lineage artifacts automatically, stores proof artifact rows, and exposes queue/evaluator/dataset/provider readiness in the Train tab.
22. A measured-quality sprint layer that turns the training workspace into a scored operating loop: benchmark gaps feed Prompt Generator v2, critique patches repair thin prompts, result quality links generated prompts to build/screenshot/model evidence, dataset review rows protect curation, and hosted worker ops can retry or cancel queue jobs.

The tightest improvement cycle is:

```text
prompt -> queued build -> desktop/mobile screenshots -> screenshot judge -> mutation tournament -> regression benchmark -> learned corpus
```

The app is honest about missing proof. If no build result or screenshot exists yet, the proof loop records a queued run and tells you to import `queue-result.json` or attach screenshots before promoting a prompt to gold.

The corpus should only contain prompts intentionally imported for this project. Recipe, memory, search, and generator learning use curated website prompts by default.

Use the project isolation guard before running calibration or exporting training data. In an isolated workspace it reports out-of-scope prompts and can quarantine them so unrelated Codex project tasks do not affect website prompt recipes.

Use the one-click export pack when handing the learner to another agent or model. It bundles the locked dataset, JSONL rows, learned memory, benchmark trend, project boundary state, quality grader, reusable memory pack, and Codex build pack in one JSON artifact.

Use the Train from this corpus button after curation looks clean. It locks the current golden dataset, runs the benchmark suite, calibrates DNA against outcomes, and exports the model-training pack. The API and export paths redact recognized API keys, bearer tokens, and generic secrets before they are persisted or logged.

Use Run guided train when you want the product workflow rather than the expert ladder. It writes a training run immediately, then syncs to `/api/training/run` when the API is available. Cache eval uses `/api/model/evaluate-cached` without sending browser secrets. Analyze, Run v2, and Create artifact call `/api/corpus/analyze`, `/api/benchmark/v2`, and `/api/artifact/create` while keeping deterministic browser fallbacks.

Use the best-next-action panel when the system feels noisy. It prioritizes the next move from curation status, safe-to-train posture, model agreement, proof history, benchmark coverage, and available build evidence. The provenance firewall and Prompt Quality DNA panels explain why a prompt is safe, risky, thin, or ready so you can correct the corpus before spending another build run.

Use Run true closed loop when you want the product path. It creates a local proof ledger entry, tries `/api/closed-loop/run` for server-side Claude/local judging, saves the rewritten winner as a user prompt, and queues the winner for real build proof. Use Run server judge when you only want the hosted evaluator to rewrite and persist a winner without creating a queue job.

Use Run hosted proof worker when the API is trusted to execute builds. It calls `/api/closed-loop/prove`, creates the rewritten winner, writes a queue job under the API data directory, runs the scaffold/build/capture worker, and returns closed-loop, queue, proof-learning, build-run, screenshot, lineage, and proof-artifact rows to the browser.

Hosted worker execution is guarded by `PROMPT_LAB_WORKER_ENABLED`, `PROMPT_LAB_ALLOWED_BUILD_COMMANDS`, `PROMPT_LAB_ALLOWED_AGENT_PREFIXES`, `PROMPT_LAB_WORKER_TIMEOUT_MS`, and `PROMPT_LAB_MAX_BODY_BYTES`. Leave agent command prefixes empty unless the host is intentionally allowed to run a known Codex or build-agent command.

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
