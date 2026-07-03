---
id: attachment-you-are-firing-v89-1-typography-adoption-on-the-kapital-next-repo-th-9a1b91d9
title: "You are firing V89-1 (typography adoption) on the kapital-next repo. Th..."
source: attachment
createdAt: 2026-07-03T00:00:00.000Z
---

You are firing V89-1 (typography adoption) on the kapital-next repo. This is the first closure of the V89 cycle. It adopts Geist Sans + Geist Mono as the kapital typeface system, replacing Manrope and the generic system mono stack.

Branch-only. Do NOT fire merge from this chat. Use a fresh sibling clone.

Standing rules in AGENTS.md apply. Strategic-debt budgets must hold:
- src/lib/notifications.ts: 1473/1490
- prisma/schema (combined): 5938/5938

All existing CSS contract guards must continue passing: check:ui-class-definitions (V88-4), check:z-index-scale (V88-6), check:hf-2-cold-load-locality (HF-2/3), check:v85-task-e (V85 E).

Inputs:
- Base: origin/main 290ddd00c9539f80d4044c1ba6fde4ef32ddac80
- Closes: V89-1 (typography adoption)
- Identity decisions (committed): Geist Sans (UI) + Geist Mono (data). Reference: docs/handoffs/v89-design-reference.md Section 1.4, Section 3.4, Section 3.5.8.
- Expected post-branch manifest: 73 structural guards / 60 check:* scripts (+1 each — one bundled V89-1 guard).

V89-1 scope (do exactly these, no scope creep):

1. Add Geist Sans + Geist Mono to the project via the next/font/local OR next/font/google mechanism depending on what kapital-next currently uses for Manrope. The geist npm package (https://www.npmjs.com/package/geist) is the canonical install path — it exposes GeistSans and GeistMono as next/font/local-style font objects with all weights and the variable axis.

2. Update src/app/layout.tsx:
   - Replace the Manrope import with Geist Sans + Geist Mono from the geist package.
   - Apply GeistSans.variable AND GeistMono.variable to <html> className.
   - Keep --font-manrope alive temporarily (as an alias pointing to --font-geist-sans) ONLY if removing it would force JSX edits outside the V89-1 scope. Prefer clean removal if straightforward.

3. Update src/app/globals.css token spine:
   - --font-sans: var(--font-geist-sans), system-ui, sans-serif
   - --font-mono: var(--font-geist-mono), ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace
   - Remove --font-manrope from globals.css if it's still referenced (verify nothing else uses it).
   - Adopt Geist's recommended letter-spacing: -0.011em on body, -0.02em on display-size headings. Set these as CSS custom props (--tracking-body, --tracking-display) so future surfaces can consume them.

4. Add a data typography contract used by the codebase:
   - --font-data: var(--font-mono)
   - .data-mono utility: font-family: var(--font-data); font-variant-numeric: tabular-nums.
   - .numeric utility: font-variant-numeric: tabular-nums; text-align: right;
   - These two utilities become the primitives any money/date/ID column or KPI value should reach for. Don't migrate every component to use them in V89-1 — that's a later cycle. Just establish the primitives.

5. GUARD: Add scripts/check-v89-1-typography-local.ts that asserts:
   - src/app/layout.tsx imports GeistSans AND GeistMono from "geist/font/sans" and "geist/font/mono" (or equivalent geist package path)
   - src/app/globals.css defines --font-sans referencing var(--font-geist-sans)
   - src/app/globals.css defines --font-mono referencing var(--font-geist-mono)
   - src/app/globals.css defines .data-mono utility with font-family: var(--font-data) AND font-variant-numeric: tabular-nums
   - src/app/globals.css defines .numeric utility with tabular-nums + right-align
   - Manrope is no longer imported in src/app/layout.tsx (the import should be gone)
   The guard prevents accidental regression to Manrope or generic mono.

6. TEST: tests/v89-1-typography.test.ts asserting:
   - geist is in package.json dependencies
   - layout.tsx contains the Geist imports
   - globals.css token spine is correct
   - .data-mono and .numeric utility classes exist with correct properties

7. Wire into package.json, scripts/check-local-smoke.ts, scripts/check-strategic-debt-local.ts.

8. Update docs/handoffs/review-read-manifest.md in-commit: V89-1 closure row + guard row. Final counts must reconcile to 73/60.

9. Verification ladder per AGENTS.md:
   - npm ci
   - npm run architecture:proof (budgets hold)
   - npm run local:smoke
   - npm run check:v89-1-typography
   - npm run check:ui-class-definitions (V88-4 contract still PASS)
   - npm run check:z-index-scale (V88-6 contract still PASS)
   - npm run check:hf-2-cold-load-locality (HF-2/3 contract still PASS)
   - npx vitest run tests/v89-1-typography.test.ts
   - npx vitest run --maxWorkers=8
   - npm run build (158/158 static pages)

10. COLD-LOAD VERIFICATION — Playwright channel:"chrome", headless:false, fresh persistent profile per URL:
    - PORT=3080 npm run dev
    - Cold-load with NO prior navigation:
      a. http://localhost:3080/ — verify Geist Sans renders on hero text via CDP CSS.getMatchedStylesForNode (computed font-family should include "Geist Sans" or "GeistSans")
      b. http://localhost:3080/admin — verify Geist Sans on admin chrome (sidebar nav, top bar, dashboard cards)
      c. http://localhost:3080/admin/applications/<any valid id> — verify Geist Sans on body, and inspect a date/amount element for Geist Mono (note: amounts may not yet use mono in V89-1; the FONT must be loaded, but the SWITCH to mono on data is V89-2's work)
      d. http://localhost:3080/properties — verify Geist Sans on marketing
    - For each: confirm computed font-family includes Geist Sans (or "GeistSans" depending on the package's font-name convention)
    - Confirm NO computed font-family on any element falls back to Manrope or system-ui as primary
    - Screenshot each at 1440x900
    - Save to /tmp/kapital-next-v89-1-typography-20260604-screenshots/

11. Create branch codex/v89-1-typography-20260604, commit, push branch-only.

12. Report:
    - Branch SHA + base SHA
    - geist package version installed
    - Files changed (layout.tsx, globals.css, package.json, guard, test, manifest)
    - CDP evidence Geist Sans is computed font-family across all 4 surfaces
    - Verification ladder timings
    - All four CSS contract guards still PASSING (V88-4, V88-6, HF-2/3, V85-E)
    - Final manifest counts (73/60)

Halt criteria per AGENTS.md:
- Budget violation
- Any existing CSS contract guard breaks
- Any test fails in isolation
- Build doesn't produce 158/158
- CDP shows any surface NOT loading Geist as primary font
- Visual regression: anything looks broken cold-load that worked before

CONSTRAINTS:
- V89-1 scope is typography adoption ONLY. Do NOT migrate components to .data-mono / .numeric in this cycle. Establish the primitives; consumers come in V89-2/V89-3.
- Do NOT change colors, radii, shadows, or any non-typography aspect of the design system. Those are V89-2.
- Manrope import must be cleanly removed from layout.tsx. If Manrope is referenced elsewhere in code (grep for "manrope" / "Manrope"), document those usages in the audit doc but do NOT migrate them in V89-1 — note them for follow-up.
- Geist is licensed under the SIL Open Font License — confirm in your commit message that the license is satisfied (the geist npm package handles this; just confirm package.json shows the install).
- Document in docs/handoffs/v89-1-typography-audit.md (committed in same branch) what was changed, what was deferred, and any Manrope references that remain.
