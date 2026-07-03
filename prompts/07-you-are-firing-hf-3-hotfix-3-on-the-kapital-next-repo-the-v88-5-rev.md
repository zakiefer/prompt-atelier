---
id: attachment-you-are-firing-hf-3-hotfix-3-on-the-kapital-next-repo-the-v88-5-rev-247b14dc
title: "You are firing HF-3 (Hotfix #3) on the kapital-next repo. The V88-5 rev..."
source: attachment
createdAt: 2026-07-03T00:00:00.000Z
---

You are firing HF-3 (Hotfix #3) on the kapital-next repo. The V88-5 revert (9f6631b7) restored 763 lines of admin.css including the proper notification-center-trigger-icon styling (gold gradient pill, round border-radius, inset highlight). However, HF-2's override at admin.css:6678 is now CONFLICTING with the restored rule because it explicitly sets border-radius: 0, background: none, box-shadow: none — making the bell icon render as a stripped-down square instead of the proper gradient pill. HF-2's SVG override at admin.css:6693 also forces the SVG to fill 100% of the parent (1.95rem) instead of inheriting the parent's font-size, making the icon visually too large.

Branch-only. Do NOT fire merge from this chat. Use a fresh sibling clone.

Standing rules in AGENTS.md apply. Strategic-debt budgets must hold:
- src/lib/notifications.ts: 1473/1490
- prisma/schema (combined): 5938/5938

Inputs:
- Base: origin/main 9f6631b7558d8992bca7d2e23d73c2df90540b22
- Closes: HF-3 (notification trigger icon styling regression caused by HF-2 override conflict)
- Expected post-branch manifest: 71 structural guards / 58 check:* scripts (no change — modifying existing guard, not adding a new one)

V88 code-aware methodology required.

Steps:

1. Clone fresh to /tmp/kapital-next-hf-3-20260602, cd in, git fetch origin, git checkout origin/main (verify 9f6631b7). npm ci.

2. INSPECT current state at src/app/admin/admin.css:
   - Base rule `.notification-center-trigger-icon` (around line 6661) — has gold gradient, border-radius: 999px, box-shadow. This is the RESTORED correct rule.
   - HF-2 override `.admin-header-notifications .notification-center-trigger-icon` (around line 6678) — sets border-radius: 0, background: none, box-shadow: none. THIS IS THE BUG.
   - HF-2 SVG override `.admin-header-notifications .notification-center-trigger-icon svg` (around line 6693) — sets svg width/height to 100%. ALSO WRONG with the restored base rule because it forces SVG to fill 1.95rem container instead of inheriting font-size.
   - Mobile responsive overrides (around line 7058-7068) inside `@media (max-width: 760px)` — these are CORRECT and should stay.

3. FIX phase — modify admin.css:
   a. In the HF-2 override at line 6678, REMOVE these three declarations: `border-radius: 0`, `background: none`, `box-shadow: none`. KEEP everything else: `display: inline-flex`, `align-items: center`, `justify-content: center`, `flex: 0 0 auto`, `width: 1.95rem`, `min-width: 1.95rem`, `height: 1.95rem`, `min-height: 1.95rem`, `padding: 0`.
   b. DELETE the HF-2 SVG override block at line 6693-6696 entirely (`.admin-header-notifications .notification-center-trigger-icon svg { width: 100%; height: 100%; }`). With the base rule's font-size: var(--text-sm), the SVG will inherit correct sizing.
   c. Leave the mobile responsive @media rules (7058-7068) untouched.

4. UPDATE the HF-2 guard at scripts/check-hf-2-cold-load-locality-local.ts:
   - The guard currently expects the SVG override to exist at admin.css with declarations `width: "100%", height: "100%"`. Remove that assertion (the expectRuleWithDeclarations block at lines 182-190).
   - Keep the asserting that `.admin-header-notifications .notification-center-trigger-icon` exists with display:inline-flex, width:1.95rem, height:1.95rem (those declarations still apply).
   - Keep the mobile @media assertion (lines 191-198, width: 1rem / height: 1rem inside media).
   - Keep the expectNoSelector globalsCss assertions (lines 199-200) — they prevent rules from drifting back into globals.css.

5. UPDATE the HF-2 test at tests/hf-2-cold-load.test.ts to match the guard changes. Read the test, find any case asserting the SVG override exists, remove or update it. The 5-test count may drop to 4.

6. UPDATE docs/handoffs/review-read-manifest.md in-commit:
   - Add an HF-3 row noting "HF-3: Fix HF-2 override conflict with restored V88-5 base rule (notification-center-trigger-icon)"
   - Manifest counts stay at 71/58 (no new guard added; existing guard modified)

7. Verification ladder per AGENTS.md:
   - npm ci
   - npm run architecture:proof (budgets hold)
   - npm run local:smoke
   - npm run check:ui-class-definitions (V88-4 — must PASS)
   - npm run check:z-index-scale (V88-6 — must PASS)
   - npm run check:hf-2-cold-load-locality (HF-2 guard, modified — must PASS with new assertions)
   - npx vitest run tests/hf-2-cold-load.test.ts (4 or 5 tests pass, whatever the post-modification count is)
   - npx vitest run --maxWorkers=8
   - npm run build (expect 158/158 static pages)

8. COLD-LOAD VERIFICATION — Playwright channel:"chrome", headless:false, fresh persistent profile per URL:
   - PORT=3050 npm run dev
   - Cold-load with NO prior navigation:
     a. http://localhost:3050/admin — the notification trigger bell must render with the gold/blue gradient ROUND background (border-radius: 999px) behind the SVG, NOT a square outline. SVG should be smaller than the round container (inherited 0.875rem font-size, not the parent's 1.95rem).
     b. http://localhost:3050/admin (hover over notification trigger) — verify hover state shows the pill button hover, not weird focus rings around the icon
     c. http://localhost:3050/admin/applications/<any valid id> — verify applicant page renders fine
     d. http://localhost:3050/admin/calendar — verify calendar renders fine
     e. http://localhost:3050/owner — verify owner shell renders fine
     f. http://localhost:3050/portal — verify resident portal renders fine
     g. http://localhost:3050/admin/settings/profiles — verify HTTP 200, no error boundary
   - CDP CSS.getMatchedStylesForNode on the notification trigger icon — verify base rule's border-radius:999px and gradient background apply (not stripped to 0/none)
   - Save screenshots to /tmp/kapital-next-hf-3-20260602-screenshots/

9. Create branch codex/hf-3-notification-icon-styling-20260602, commit, push branch-only.

10. Report:
    - Branch SHA + base SHA (9f6631b7)
    - Specific lines deleted from admin.css and the guard
    - CDP evidence that border-radius: 999px now applies
    - Cold-load verification per URL with screenshots
    - Verification ladder timings
    - All three CSS contract guards still PASSING (V88-4, V88-6, HF-2 modified)
    - Final manifest counts (71/58 — unchanged)

Halt criteria:
- Budget violation
- Any CSS contract guard breaks
- Bell icon still renders as square box without gradient
- Visual regression on any of the 7 surfaces relative to current state
- /admin/settings/profiles crashes

CONSTRAINTS:
- Minimal change: only fix the HF-2 override conflict, do NOT scope-creep
- Preserve HF-2's CRASH-1 fix (the React dedup) entirely — that's in a .tsx file, untouched by HF-3
- Preserve the mobile responsive overrides at lines 7058-7068
- Document in docs/handoffs/hf-3-audit.md committed in same branch
