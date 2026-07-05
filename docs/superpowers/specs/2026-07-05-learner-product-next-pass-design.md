# Learner Product Next Pass Design

## Goal

Make Prompt Atelier feel like a compact product that learns website-prompt taste from evidence. The main learner should guide a user from prompt input to proof, battle, safe corpus review, profile-aware rewrite, and target-specific export without sending them into the long Train control room.

## Scope

This pass improves the existing React/Vite app. It does not rotate provider keys, change hosted secrets, replace the scoring engine, or introduce a new backend. The work stays browser-first and reuses the current learner/product reports, proof gallery, corpus review rows, benchmark battle, and export pack.

## Product Shape

The learner first viewport remains the primary surface. It gets four stronger signals:

- **Proof-first action:** a compact proof card shows whether session proof, screenshot proof, and outcome feedback exist, then gives one obvious next action.
- **Prompt battle:** a visible battle strip compares generated variants, names the winner, and explains what learned trait made it win.
- **Safe ingestion:** the corpus queue labels rows as website prompt, maybe useful, or quarantine, with an ingestion summary that explains what can safely train the learner.
- **Style profiles:** saved learner profiles become an explicit style profile selector with scoring emphasis and export voice.

The Train tab becomes a summary cockpit. The default view shows only core operating groups: corpus, proof, battle, benchmark, exports, and safety. Existing advanced panels move behind an Advanced drawer so the app is still powerful without making the first read unusable.

## Architecture

- Keep `LearnerExperience.tsx` as the learner UI layer.
- Extend `learnerViewModel.ts` with pure report builders for proof action, battle summary, ingestion labels, style profile cards, export target differences, and Train compression.
- Keep `learnerProduct.ts` as product-data logic. Add only small helper data if needed.
- Keep Train compression in `App.tsx` because Train panels are still defined there, but do not refactor unrelated panels in this pass.
- Extend `scripts/smokeHostedApp.mjs` to require the new product sections and catch accidental page growth or missing smoke sections.

## UI Requirements

- The learner first viewport stays compact on desktop and mobile.
- The main proof CTA is visible before the user reaches advanced export content.
- Prompt battle appears as a normal workflow step, not only inside export.
- Corpus ingestion labels are plain English and avoid abstract AI wording.
- Export differences must name what Codex, Claude, v0, GPT, JSONL, and memory each need.
- Train tab default view must be much shorter than the existing full advanced stack.

## Error Handling

- If no proof exists, proof action says exactly what is missing.
- If no battle variants exist, the battle summary explains that prompt constraints must be added first.
- If corpus rows are quarantined, export/training readiness should mention that quarantined rows stay out of memory.
- If style profile data is thin, the profile card should show how many examples support it.

## Verification

- Build, lint, engine tests, corpus safety, quality gate, and diff whitespace must pass.
- Hosted smoke must verify new learner headings and the compressed Train view.
- Browser viewport checks must confirm no horizontal overflow and no document-height regression on the main learner route.
- GitHub CI, Pages deploy, and hosted smoke must be green after push.
