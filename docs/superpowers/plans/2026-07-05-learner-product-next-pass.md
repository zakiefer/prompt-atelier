# Learner Product Next Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a compact learner-product pass that makes proof, prompt battle, safe ingestion, style profiles, export differences, and Train compression visible and testable.

**Architecture:** Add pure view-model reports in `src/learnerViewModel.ts`, render them in `src/LearnerExperience.tsx`, and compress the Train tab in `src/App.tsx` using existing panels inside a native details drawer. Extend smoke coverage to lock the new learner and Train sections.

**Tech Stack:** React, TypeScript, Vite, Tailwind-like project CSS, Playwright smoke script, existing prompt-engine/product reports.

---

### Task 1: Learner View Models

**Files:**
- Modify: `src/learnerViewModel.ts`

- [ ] Add `LearnerProofAction`, `LearnerBattleSummary`, `LearnerIngestionSummary`, `LearnerStyleProfileCard`, `LearnerExportTargetMatrix`, and `TrainFocusSummary` types.
- [ ] Add pure builders that accept existing proof gallery, battle, corpus rows, learning profiles, export pack, holdout report, and corpus safety.
- [ ] Keep report strings plain English: `proof`, `battle`, `website prompt`, `maybe useful`, `quarantine`, `prompt strength`, `style profile`.

### Task 2: Learner UI

**Files:**
- Modify: `src/LearnerExperience.tsx`
- Modify: `src/styles.css`

- [ ] Compute the new reports with `useMemo`.
- [ ] Add a proof-first action card near the top of the learner panel.
- [ ] Add a first-class prompt battle strip before the advanced export modal.
- [ ] Add a style profile panel with example count, score, rules, and export voice.
- [ ] Add a safer ingestion panel that labels corpus rows and summarizes safe-to-train status.
- [ ] Add an export target matrix that clearly differentiates Codex, Claude, v0, GPT, JSONL, and memory.
- [ ] Keep all additions compact and responsive.

### Task 3: Train Compression

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] Replace the long default Train waterfall with a `TrainFocusSummaryPanel`.
- [ ] Keep core Train panels visible: learner mode, public demo, proof, battle, benchmark, export, safety.
- [ ] Move the remaining existing Train panels into a collapsed Advanced drawer.
- [ ] Keep the section navigator functional for both visible and advanced sections.

### Task 4: Smoke and Docs

**Files:**
- Modify: `scripts/smokeHostedApp.mjs`
- Modify: `README.md`

- [ ] Add smoke headings for the proof action, prompt battle, style profiles, ingestion safety, export matrix, and Train focus summary.
- [ ] Add a README bullet describing the compact learner product pass.
- [ ] Keep existing smoke routes for learner, demo, and Train.

### Task 5: Verification and Delivery

**Commands:**
- `PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH npm run build`
- `PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH npm run lint`
- `PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH npm run test:engine`
- `PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH npm run check:corpus-safety`
- `PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH npm run check:quality-gate`
- `git diff --check`
- `PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH npm run smoke:hosted -- --url http://127.0.0.1:4173/ --out output/playwright/learner-next-pass-smoke`
- `PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH npm run smoke:hosted -- --url http://127.0.0.1:4173/ --train --out output/playwright/learner-next-pass-train-smoke`
- `PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH npm run smoke:hosted -- --url http://127.0.0.1:4173/ --demo --out output/playwright/learner-next-pass-demo-smoke`

- [ ] Commit the implementation branch.
- [ ] Push branch.
- [ ] Verify GitHub Actions and live Pages smoke after merge or direct push.
