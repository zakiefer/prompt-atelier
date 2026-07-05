# Learner Product Hardening Design

## Goal

Make Prompt Atelier feel like a focused website-prompt learner rather than a long diagnostic dashboard. The main learner path should stay compact and obvious: paste a prompt, score it, improve it, review proof, and export a target-specific pack.

## Scope

This pass keeps the current React/Vite app and browser-first persistence model. It improves the learner front door, proof/corpus/export surfaces, and maintainability without rotating provider keys, changing hosted secrets, or replacing the existing scoring engine.

## Architecture

- Extract learner diagnosis and product view-model helpers into a small module so `LearnerExperience.tsx` stops owning every UI-specific decision.
- Keep `learnerProduct.ts` as the data/product logic layer for recipes, proof, exports, sessions, and prompt brief generation.
- Keep `App.tsx` as the orchestrator for state and persistence, but reduce new logic added there.
- Keep heavy/advanced Train panels behind existing tabs and drawers.

## Product Behavior

- The primary learner path is a one-run machine: Compose, Review, Export.
- Prompt strength is explained as a diagnosis with strengths, missing ingredients, next rewrite moves, confidence, and nearest gold examples.
- Proof becomes a first-class signal. The proof gallery should explain what kind of proof exists, what is missing, and what the next proof action is.
- Corpus review should label candidate text as website prompt, maybe useful, or quarantine so unrelated project/deploy text cannot quietly train the learner.
- Export packs should differ by target: Codex gets implementation and verification; Claude gets review framing and success criteria; v0 gets concise generation structure; GPT gets rewrite context.
- Public demo stays simplified and hides expert control-room details.

## UX Constraints

- The app shell remains a fixed-height workbench with internal scrolling.
- Corpus and rules stay drawers.
- No AI-themed decorative styling is added.
- No provider keys or bearer tokens are exposed, copied, or persisted by the browser.

## Verification

- Lint, build, engine tests, hosted smoke, and live Pages smoke must pass.
- First-load desktop and mobile document height must equal the viewport with no horizontal overflow.
- Corpus safety and quality gate checks should continue to pass.

