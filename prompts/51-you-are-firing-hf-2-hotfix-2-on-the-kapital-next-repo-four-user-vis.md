---
id: attachment-you-are-firing-hf-2-hotfix-2-on-the-kapital-next-repo-four-user-vis-c2c260dc
title: "You are firing HF-2 (Hotfix #2) on the kapital-next repo. Four user-vis..."
source: attachment
createdAt: 2026-07-03T00:00:00.000Z
---

You are firing HF-2 (Hotfix #2) on the kapital-next repo. Four user-visible bugs were surfaced in admin/owner/portal surfaces. None are caused by recent V88 closures — verified by inspecting Zachary's local working tree at 4cb230e (V88 audit doc), where the CSS rules that should style these elements DO exist in source. The bugs are runtime CSS-not-applying or runtime errors — same class as HF-1 but on different surfaces that HF-1 never inspected.

Branch-only. Do NOT fire merge from this chat. Use a fresh sibling clone.

Standing rules in AGENTS.md apply. Strategic-debt budgets must hold:
- src/lib/notifications.ts: 1473/1490
- prisma/schema (combined): 5938/5938
All three CSS contract guards must continue passing: check:css-selector-ownership, check:ui-class-definitions, check:z-index-scale.

Inputs:
- Base: origin/main 7086d241628ee8df0e5b337b8d1618424a8a1d3c
- Closes: HF-2 (4 symptoms below)
- Expected post-branch manifest: 72 structural guards / 59 check:* scripts (+1 each — single bundled HF-2 guard)

The four symptoms:

1. ICONS-1 (admin) — Notification bell trigger icon renders at natural SVG size (huge) on cold-load of admin pages. Surface: any admin page with .notification-center-trigger in the workspace header. Existing rule lives at src/app/admin/admin.css around line 6664 (`.notification-center-trigger-icon { width: 1.95rem; height: 1.95rem; ... }`). Rule exists in source but does not reach the element at runtime cold.

2. ICONS-2 (owner) — Sign-out utility icon renders at natural SVG size (huge) on cold-load of /owner. Same root cause class as ICONS-1 but for `.utility-icon` (defined at src/app/workspace-shell.css:165, `width: 1em; height: 1em`). Rule exists in source but does not reach the element at runtime cold.

3. LABEL-1 (admin applicant) — On /admin/applications/[id], the screening recommendation label (the <strong> containing "Pending recommendation") renders at huge font-size instead of var(--text-2xl) = 1.5rem. Rule at src/app/admin/admin.css:3311 (`.admin-screening-score strong { font-size: var(--text-2xl); ... }`). Rule exists in source but does not reach the element at runtime cold.

4. CRASH-1 (admin settings) — /admin/settings/profiles hard-crashes with the React error boundary firing ("This workspace hit a snag"). NOT a CSS issue — runtime JavaScript error. Need stack trace.

V88 code-aware methodology required. This is not a narrate-and-move-on cycle.

Steps:

1. Clone fresh to /tmp/kapital-next-hf-2-20260531, cd in, git fetch origin, git checkout origin/main (verify 7086d241). npm ci. PORT=3030 npm run dev.

2. REPRODUCE phase — Playwright channel:"chrome", headless:false, fresh persistent profile per URL (no warmed-up shared profile):
   For each symptom, cold-load the surface with NO prior navigation:
   - ICONS-1: http://localhost:3030/admin (look at top-bar notification trigger)
   - ICONS-2: http://localhost:3030/owner (look at sidebar sign-out button)
   - LABEL-1: http://localhost:3030/admin/applications/<any valid id> (look at the screening recommendation panel)
   - CRASH-1: http://localhost:3030/admin/settings/profiles (capture console + network)
   Screenshot each.

3. CDP INSPECTION phase (per symptom 1-3, the CSS bugs):
   For each affected element, use CDP CSS.getMatchedStylesForNode to enumerate ALL CSS rules that apply (or should apply) including those that don't match. Save the JSON for each. Compare:
   - Is the expected rule present in the loaded stylesheets at all? (CSS.getStyleSheetText for each loaded sheet, grep for the selector)
   - If present in stylesheets but not matched: why? Selector specificity? Element doesn't have the expected className? Parent missing data-attribute?
   - If NOT present in loaded stylesheets: which file in source has it? Why didn't that file load on this page?

4. CRASH-1 SPECIFIC investigation:
   - Read browser console; capture full stack trace
   - Read server logs (next dev output) for SSR errors on /admin/settings/profiles
   - Identify the file and line where the throw originates
   - Determine whether the crash is server-side or client-side
   - If it's a thrown error, identify what data shape or prop is missing/malformed

5. ROOT-CAUSE doc:
   Write docs/handoffs/hf-2-cold-load-audit.md with:
   - For each symptom: the offending file:line in source, the runtime evidence, the root cause hypothesis, the proposed fix
   - Cross-reference: was the rule moved by HF-1 (3cbd6a1) or was it never in the cold-load chunk to begin with?
   - Cross-reference: did V88-4 (check:ui-class-definitions) miss these because the tokens ARE defined but the rules don't load?
   - Cross-reference: did V88-5 (check:css-selector-ownership) miss these because the issue is import-chain locality, not duplicate selectors?

6. FIX phase — for each of ICONS-1, ICONS-2, LABEL-1:
   The fix depends on root cause. Options:
   a. If rule isn't in any loaded stylesheet for the page: move it to a globally-loaded scope (globals.css or workspace-shell.css)
   b. If rule is loaded but doesn't match: fix the className mismatch in JSX
   c. If rule is loaded and selector matches but is overridden: increase specificity or fix the override
   d. If Turbopack/optimizeCss is purging it: add to the safelist, OR restructure so the rule isn't tree-shaken
   ALWAYS respect the three-part CSS contract: V88-5 selector ownership, V88-4 class definitions, V88-6 z-index scale. If a fix moves a rule, the ownership guard's allowlist may need updating with documented reason.

7. FIX phase for CRASH-1:
   The fix depends on root cause. Don't add a defensive try/catch — actually fix the underlying issue.

8. GUARD: Add scripts/check-hf-2-cold-load-locality-local.ts that asserts:
   - For each of the four affected elements, the expected rule IS in the cold-load chunk for the affected page
   - This is similar to HF-1's check:css-locality-local.ts but covers the four new surfaces
   - Single bundled guard covering all four findings

9. TEST: tests/hf-2-cold-load.test.ts that asserts the structural fix holds.

10. Wire into package.json, scripts/check-local-smoke.ts, scripts/check-strategic-debt-local.ts.

11. Update docs/handoffs/review-read-manifest.md in-commit: HF-2 closure row, guard row. Final counts must reconcile to 72/59.

12. Verification ladder per AGENTS.md:
    - npm ci
    - npm run architecture:proof (budgets hold)
    - npm run local:smoke
    - npm run check:hf-2-cold-load-locality
    - npm run check:css-selector-ownership (V88-5 contract)
    - npm run check:ui-class-definitions (V88-4 contract)
    - npm run check:z-index-scale (V88-6 contract)
    - npx vitest run tests/hf-2-cold-load.test.ts
    - npx vitest run --maxWorkers=8
    - npm run build (158/158)

13. POST-FIX COLD-LOAD VERIFICATION — same Playwright setup as step 2:
    - Re-load each affected URL on a fresh persistent profile (NEVER reuse the reproduction profile)
    - Verify the element renders correctly cold
    - Save before/after screenshots side-by-side
    - For each, run CDP CSS.getMatchedStylesForNode again and confirm the expected rule now matches

14. Create branch codex/hf-2-cold-load-20260531, commit, push branch-only.

15. Report:
    - Branch SHA + base SHA
    - For each of the 4 symptoms:
      * Root cause (in 1-2 sentences)
      * Files changed
      * Cold-load before/after screenshots
      * CDP evidence (rule now matches)
    - Verification ladder timings
    - All three CSS contract guards still PASSING
    - Final manifest counts (72/59)
    - Halt if any symptom can't be root-caused — do NOT push a partial fix without flagging which ones are unresolved.

Halt criteria per AGENTS.md:
- Budget violation
- Any CSS contract guard breaks (V88-4/5/6)
- Visual regression detected elsewhere (don't fix one icon and break another)
- Any check:* fails in isolation
- Any test fails in isolation
- Cannot root-cause any of the 4 symptoms

CONSTRAINTS:
- Single bundled HF-2 guard for all 4 findings
- V88 code-aware methodology required — CDP evidence, not narration
- Respect three-part CSS contract
- Do NOT scope-creep into V88-7 (inline styles polish), V86 Task F, or anything else
- The audit doc must explain WHY each rule wasn't loading, so future maintainers learn from this
- HF-1's lesson: when verification reports "PASS" but the user sees a bug, trust the user. Force a real cold-load.
