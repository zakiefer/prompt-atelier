---
id: attachment-you-are-firing-v89-2-design-token-spine-on-the-kapital-next-repo-thi-be80bdc7
title: "You are firing V89-2 (design token spine) on the kapital-next repo. Thi..."
source: attachment
createdAt: 2026-07-03T00:00:00.000Z
---

You are firing V89-2 (design token spine) on the kapital-next repo. This is the second V89 cycle. It establishes the complete kapital design token system: accent color, semantic status palette, neutral ramp, radius scale, shadow rules, focus rings, data typography contract, and the mono-currency-code signature primitive. V89-3 (admin dashboard redesign) requires this token spine before it can fire.

Branch-only. Do NOT fire merge from this chat. Use a fresh sibling clone.

Standing rules in AGENTS.md apply. Strategic-debt budgets must hold:
- src/lib/notifications.ts: 1473/1490
- prisma/schema (combined): 5938/5938

All existing CSS contract guards must continue passing:
- check:ui-class-definitions (V88-4)
- check:z-index-scale (V88-6)
- check:hf-2-cold-load-locality (HF-2/3)
- check:v85-task-e (V85 E)
- check:v89-1-typography (V89-1)

Inputs:
- Base: origin/main 1f5b70a4a29ae40c137b6e794276c7bc5581cfa9
- Closes: V89-2 (token spine)
- Identity decisions (committed): Geist Sans + Geist Mono (V89-1) + Indigo accent `#4F46E5` + mono currency code signature.
- Expected post-branch manifest: 74 structural guards / 61 check:* scripts (+1 each — one bundled V89-2 guard).
- Reference: docs/handoffs/v89-design-reference.md sections 3.1-3.4 and 3.5.8.

V89-2 scope (do exactly these, no scope creep):

1. CREATE src/app/tokens.css as the canonical design token file. Import it at the top of globals.css. The token file defines:

   --- ACCENT ---
   --color-accent: #4F46E5;       /* indigo-600 — the single accent, used like punctuation */
   --color-accent-hover: #4338CA; /* indigo-700 — hover/active */
   --color-accent-soft: #EEF2FF;  /* indigo-50 — selection backgrounds, focus rings */
   --color-accent-ink: #FFFFFF;   /* text on accent surfaces */

   --- SEMANTIC STATUS PALETTE (5 tokens, each means ONE thing) ---
   --color-status-paid: #10B981;     /* emerald-500 — paid / active / approved */
   --color-status-paid-soft: #ECFDF5;
   --color-status-paid-ink: #047857;

   --color-status-pending: #F59E0B;  /* amber-500 — pending / review / in-progress */
   --color-status-pending-soft: #FFFBEB;
   --color-status-pending-ink: #B45309;

   --color-status-overdue: #EF4444;  /* red-500 — overdue / failed / blocked */
   --color-status-overdue-soft: #FEF2F2;
   --color-status-overdue-ink: #B91C1C;

   --color-status-vacant: #6B7280;   /* gray-500 — vacant / inactive / neutral */
   --color-status-vacant-soft: #F9FAFB;
   --color-status-vacant-ink: #374151;

   --color-status-occupied: var(--color-accent);  /* occupied uses the accent — operational present */
   --color-status-occupied-soft: var(--color-accent-soft);
   --color-status-occupied-ink: var(--color-accent-hover);

   --- NEUTRAL RAMP (light mode) ---
   --color-surface-base: #FFFFFF;
   --color-surface-raised: #FAFAFA;       /* lifted modules — V89 reference 1.4 */
   --color-surface-overlay: #F4F4F5;      /* popovers, dropdowns */
   --color-border-subtle: #E5E7EB;        /* default 1px border */
   --color-border-strong: #D1D5DB;        /* emphasized border (focus, active) */
   --color-ink-primary: rgba(15, 23, 42, 0.92);   /* main text */
   --color-ink-secondary: rgba(15, 23, 42, 0.55); /* secondary text */
   --color-ink-tertiary: rgba(15, 23, 42, 0.35);  /* disabled, captions */

   --- NEUTRAL RAMP (dark mode, scoped under [data-theme="dark"]) ---
   --color-surface-base: #0A0A0A;
   --color-surface-raised: #171717;
   --color-surface-overlay: #1F1F1F;
   --color-border-subtle: rgba(255, 255, 255, 0.08);
   --color-border-strong: rgba(255, 255, 255, 0.16);
   --color-ink-primary: rgba(255, 255, 255, 0.92);
   --color-ink-secondary: rgba(255, 255, 255, 0.55);
   --color-ink-tertiary: rgba(255, 255, 255, 0.35);

   --- RADIUS SCALE ---
   --radius-xs: 4px;   /* inputs, tags */
   --radius-sm: 6px;   /* buttons, small cards */
   --radius-md: 8px;   /* cards, modals, app shell */
   --radius-pill: 999px; /* pills, avatars, status chips */

   --- SHADOW RULES (reserved for floating UI only, per V89 reference 1.4) ---
   --shadow-popover: 0 4px 12px rgba(0, 0, 0, 0.06);     /* dropdowns, tooltips */
   --shadow-modal: 0 8px 24px rgba(0, 0, 0, 0.12);       /* modal scrims */
   --shadow-hover-lift: 0 2px 6px rgba(0, 0, 0, 0.06);   /* hover-lift on cards (use sparingly) */
   /* Inline cards/modules should use border-subtle, NOT shadow */

   --- FOCUS RINGS ---
   --focus-ring: 2px solid var(--color-accent);
   --focus-ring-offset: 2px;

   --- TRANSITIONS ---
   --transition-quick: 180ms cubic-bezier(0.22, 1, 0.36, 1);
   --transition-medium: 220ms cubic-bezier(0.22, 1, 0.36, 1);

2. EXTEND globals.css data typography contract (the .data-mono and .numeric primitives V89-1 established):

   .data-mono {
     font-family: var(--font-data);
     font-variant-numeric: tabular-nums;
     letter-spacing: 0;
   }

   .numeric {
     font-family: var(--font-data);
     font-variant-numeric: tabular-nums;
     text-align: right;
     letter-spacing: 0;
   }

   /* New primitives for V89-2 */
   .data-amount { /* dollar amounts — composes with .numeric */
     font-family: var(--font-data);
     font-variant-numeric: tabular-nums;
     letter-spacing: 0;
   }
   .data-date {
     font-family: var(--font-data);
     font-variant-numeric: tabular-nums;
     letter-spacing: 0;
   }
   .data-id {
     font-family: var(--font-data);
     font-variant-numeric: tabular-nums;
     letter-spacing: 0;
   }

3. BUILD the kapital signature primitive — a <MoneyAmount> React component at src/components/ui/money-amount.tsx:

```tsx
   import { clsx } from "@/lib/utils";

   type MoneyAmountProps = {
     value: number;          // raw number, e.g. 1234.56
     currency?: string;      // ISO code, default "USD"
     className?: string;
     muted?: boolean;        // when true, the whole component renders in --color-ink-secondary
     compact?: boolean;      // suppress fractional cents (e.g. for KPI cards)
   };

   const CURRENCY_SYMBOLS: Record<string, string> = {
     USD: "$",
     CAD: "$",
     EUR: "€",
     GBP: "£",
   };

   export function MoneyAmount({ value, currency = "USD", className, muted, compact }: MoneyAmountProps) {
     const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
     const formattedAmount = new Intl.NumberFormat("en-US", {
       minimumFractionDigits: compact ? 0 : 2,
       maximumFractionDigits: compact ? 0 : 2,
     }).format(Math.abs(value));
     const isNegative = value < 0;

     return (
       <span className={clsx("money-amount", muted && "money-amount-muted", className)}>
         {isNegative && <span className="money-amount-sign">-</span>}
         <span className="money-amount-currency">{symbol}</span>
         <span className="money-amount-value">{formattedAmount}</span>
       </span>
     );
   }
```

   Plus CSS in globals.css:
```css
   .money-amount {
     font-family: var(--font-data);
     font-variant-numeric: tabular-nums;
     letter-spacing: 0;
     display: inline-flex;
     align-items: baseline;
     gap: 0.15em;
   }
   .money-amount-currency {
     color: var(--color-ink-secondary);   /* the signature: muted currency code */
     font-weight: 400;
   }
   .money-amount-value {
     color: inherit;
     font-weight: 500;
   }
   .money-amount-muted {
     color: var(--color-ink-secondary);
   }
   .money-amount-muted .money-amount-value {
     color: var(--color-ink-secondary);
   }
   .money-amount-sign {
     color: var(--color-status-overdue);
     font-weight: 500;
   }
```

   The kapital signature: every money value renders the currency symbol in muted weight ahead of the amount. Visible everywhere money appears.

4. GUARD: Add scripts/check-v89-2-token-spine-local.ts asserting:
   - src/app/tokens.css exists
   - tokens.css defines --color-accent: #4F46E5 (exact)
   - tokens.css defines all 5 status tokens (paid/pending/overdue/vacant/occupied) with -soft and -ink variants
   - tokens.css defines neutral ramp (surface-base/raised/overlay, border-subtle/strong, ink-primary/secondary/tertiary)
   - tokens.css defines radius scale (xs/sm/md/pill)
   - tokens.css defines shadow rules (popover/modal/hover-lift)
   - tokens.css defines focus-ring
   - globals.css imports tokens.css
   - globals.css defines .money-amount with var(--font-data) AND .money-amount-currency with var(--color-ink-secondary)
   - src/components/ui/money-amount.tsx exists and exports MoneyAmount

5. TEST: tests/v89-2-token-spine.test.ts asserting:
   - tokens.css declarations match the spec above (parse with postcss)
   - MoneyAmount component renders muted currency + amount + negative sign correctly for sample inputs ($1,234.56, -$500, $0.00, EUR 12.34)
   - MoneyAmount compact mode strips decimals

6. Wire into package.json, scripts/check-local-smoke.ts, scripts/check-strategic-debt-local.ts.

7. Update docs/handoffs/review-read-manifest.md in-commit: V89-2 closure row + guard row. Final counts must reconcile to 74/61.

8. Verification ladder per AGENTS.md:
   - npm ci
   - npm run architecture:proof
   - npm run local:smoke
   - npm run check:v89-2-token-spine (NEW — PASS)
   - npm run check:v89-1-typography (V89-1 — PASS)
   - npm run check:ui-class-definitions (V88-4 — PASS)
   - npm run check:z-index-scale (V88-6 — PASS)
   - npm run check:hf-2-cold-load-locality (HF-2/3 — PASS)
   - npm run check:v85-task-e (V85 E — PASS)
   - npx vitest run tests/v89-2-token-spine.test.ts (PASS)
   - npx vitest run --maxWorkers=8
   - npm run build (158/158)

9. COLD-LOAD VERIFICATION — Playwright channel:"chrome", headless:false, fresh persistent profile per URL:
    - PORT=3082 npm run dev
    - Cold-load with NO prior navigation:
      a. http://localhost:3082/ — verify CSS custom prop --color-accent computes to rgb(79, 70, 229) via CDP getComputedStyle
      b. http://localhost:3082/admin — verify same
      c. http://localhost:3082/admin/applications/<some id> — verify same; admin shell still works
      d. http://localhost:3082/admin/settings/profiles — REGRESSION CHECK: still loads, no error boundary
      e. http://localhost:3082/owner — REGRESSION CHECK: sign-out icon still 16px (HF-2 ICONS-2)
      f. http://localhost:3082/admin (notification bell) — REGRESSION CHECK: still gold gradient pill (HF-3)
    - Verify computed font-family on body and KPI elements is still GeistSans (V89-1 preserved)
    - Render a test page with <MoneyAmount value={1234.56} /> if possible (or check existing surface that already renders money) — CDP-verify `.money-amount-currency` computed color matches --color-ink-secondary (light or dark mode as appropriate)
    - Save screenshots to /tmp/kapital-next-v89-2-token-spine-20260604-screenshots/

10. Create branch codex/v89-2-token-spine-20260604, commit, push branch-only.

11. Report:
    - Branch SHA + base SHA
    - Files changed (tokens.css new, globals.css updated, MoneyAmount.tsx new, guard, test, manifest, audit doc)
    - CDP evidence --color-accent computes correctly and Geist remains
    - HF-2/3 regression checks confirm
    - Verification ladder timings
    - All 6 CSS contract guards (V88-4, V88-6, HF-2/3, V85-E, V89-1, V89-2) PASSING
    - Final manifest counts (74/61)

Halt criteria:
- Budget violation
- Any existing CSS contract guard breaks
- --color-accent does not compute to rgb(79, 70, 229)
- Geist Sans is no longer the computed body font (V89-1 regression)
- HF-2 crash / HF-3 bell regresses
- Build doesn't produce 158/158

CONSTRAINTS:
- V89-2 establishes the token spine. Do NOT migrate component consumers to use new tokens in this cycle. That migration is V89-3 (admin dashboard) and beyond.
- Do NOT remove or alter existing color uses elsewhere in admin.css, marketing.css, communications-surface.css, or workspace-shell.css. V89-2 ADDS the canonical tokens; existing rules continue using their existing colors. Migration happens in V89-3+.
- Don't try to update CSS to switch the entire admin shell to the new tokens. That's also V89-3.
- The MoneyAmount component is the ONLY component to land in V89-2. It's the signature primitive.
- Document in docs/handoffs/v89-2-token-spine-audit.md (committed in same branch) what was changed, the full token reference, and what's deferred to V89-3+.
