---
id: attachment-you-are-working-in-the-jkiefer89-helios-repo-on-a-new-branch-after-a-4506a985
title: "You are working in the `jkiefer89/helios` repo on a new branch after a..."
source: attachment
createdAt: 2026-07-03T00:00:00.000Z
---

You are working in the `jkiefer89/helios` repo on a new branch after a completed hardening PR.

Do not redo the previous hardening work. Assume the baseline now has:
- API JSON error handling
- horizon validation
- deterministic simulated ticker seeds
- offline pytest coverage
- CI/dev requirements
- frontend stale-state/accessibility/mobile fixes
- portfolio methodology docs aligned around union-of-dates weight rescaling
- process-local store behavior documented

Mission:
Build the first serious “Helios Pro” vertical slice.

I want Helios to become a visually impressive, advisor-grade research terminal that is not just prettier, but materially more useful for finding potentially profitable, risk-controlled opportunities. The goal is not hype or guaranteed returns. The goal is evidence: stronger opportunity ranking, better historical validation, better portfolio risk diagnosis, and clearer advisor-ready explanations.

Core product rule:
Helios is analysis-only. It must never place trades, connect to brokerage accounts, promise profits, or imply guaranteed outcomes. It can rank opportunities, show evidence, run backtests, generate hypothetical research suggestions, and produce advisor reports. It must clearly distinguish:
- historical evidence
- out-of-sample or walk-forward evidence
- hypothetical projections
- simulated/sample data
- uploaded data
- optional live market data
- illustrative backtests

Build a coherent v1 of Helios Pro, not a pile of unfinished features.

Primary deliverable:
A polished vertical slice with these five features:

A. Command Center
B. Opportunity Radar
C. Strategy Lab v1
D. Portfolio Clinic v1
E. Advisor Report v1

Do not start Signal Journal or SQLite persistence in this pass unless A-E are complete, tested, and stable. Signal Journal should be the next branch.

Current architecture:
- Flask backend: `app.py`
- Production/local-network server: `serve.py`
- Analytics modules: `engine/`
- Frontend: `templates/index.html`, `static/app.js`, `static/styles.css`
- Current engine already has data, indicators, forecast, signals, backtest, mandates, portfolio, insights, and sentiment
- Keep vanilla JS + Chart.js
- Do not migrate to React, Vite, FastAPI, Django, or a database unless explicitly needed
- No brokerage integrations
- No paid APIs
- No network-dependent tests

Development workflow:
1. Inspect current repo and tests.
2. Produce a short implementation plan before editing.
3. Implement A-E as a complete vertical slice.
4. Keep existing routes backward-compatible.
5. Add focused engine/API tests for every new backend feature.
6. Keep tests offline and deterministic.
7. Update README and `.env.example` only if behavior/config changes.
8. Run full verification and report exact results.

Feature A: Command Center

Add a top-level Command Center view that answers:
- What is the current market/regime backdrop?
- What are the best opportunities right now?
- Which models need attention?
- Which risks are flashing red?
- What should an advisor review first?

Backend:
Add `engine/regime.py` if useful.

Add an endpoint:

`GET /api/command-center`

Response should include:
- `regime`
  - `label`: risk-on / neutral / risk-off
  - `score`: numeric, e.g. -100 to +100 or 0-100
  - `drivers`
  - `summary`
  - `warnings`
- `top_opportunities`
- `top_risks`
- `model_alerts`
- `research_queue`
- `generated_at`
- analysis-only disclaimer text

Regime logic:
Use available data only. Prefer SPY if present, otherwise the best broad proxy available from samples/uploads. Inputs may include:
- price vs SMA50/SMA200
- realized volatility
- drawdown
- recent return
- trend score
- correlation if portfolio/model context exists

Do not invent macro data.

Frontend:
Add a Command Center section as the default landing view:
- Market Regime banner
- Top opportunities cards
- Top risk cards
- Research Queue
- Model alerts
- Clear empty states
- Clear warnings for sample/simulated data
- Professional visual polish

Feature B: Opportunity Radar

Create `engine/opportunity.py`.

Build an explainable ranking engine for instruments and models.

Add endpoint:

`GET /api/opportunities`

Supported optional query params:
- `limit`
- `kind`: all / instrument / model
- `include_hold`: true/false
- `min_score`

Each ranked item should include:
- `id`
- `kind`
- `name`
- `symbol` or `model_id`
- `action`: BUY / HOLD / SELL / REVIEW
- `opportunity_score`: 0-100
- `risk_score`: 0-100
- `evidence_score`: 0-100
- `expected_return_pct`
- `expected_vol_pct`
- `max_drawdown_pct`
- `forecast_quality`
- `backtest_quality`
- `data_quality`
- `top_positive_drivers`
- `top_negative_drivers`
- `plain_english_summary`
- `recommended_next_step`
- `warnings`

Scoring philosophy:
- Separate upside from evidence.
- A high expected return with weak evidence should not rank above a moderate return with strong evidence and controlled risk.
- Penalize simulated data heavily.
- Penalize short history.
- Penalize weak forecast quality.
- Penalize high drawdown and high volatility.
- Penalize weak or negative backtest evidence.
- In risk-off regime, require stronger evidence for BUY candidates.
- Surface SELL/REVIEW candidates when risk dominates upside.
- Make the score explainable. Do not create a black box.

Frontend:
Add Opportunity Radar UI:
- sortable table or card-table hybrid
- filters for all / instruments / models
- opportunity/risk/evidence score badges
- compact drivers
- warnings
- click row to analyze the item in existing detail panels
- expandable “Why this ranks here”

Tests:
- strong signal + strong evidence ranks above weak signal
- simulated data is penalized
- weak forecast quality lowers evidence score
- high volatility/drawdown lowers opportunity score
- API returns expected shape
- no network required

Feature C: Strategy Lab v1

Create or expand `engine/strategy.py`.

Purpose:
Show whether Helios-style signals would have made money historically after costs, without lookahead bias.

Strategies for v1:
1. Composite signal strategy using existing historical signal logic
2. Buy-and-hold benchmark
3. Cash/risk-free benchmark where feasible

Optional only if simple:
- SMA trend-following strategy

For each strategy output:
- equity curve
- drawdown curve
- rolling Sharpe
- total return
- CAGR if meaningful
- mean annual return if kept
- annual volatility
- Sharpe
- Sortino
- Calmar
- max drawdown
- exposure
- number of trades
- turnover
- win rate
- average win
- average loss
- profit factor
- best trade
- worst trade
- current position
- last signal date
- cost/slippage assumptions

Critical methodology:
- No lookahead bias.
- Signal at day t can only affect position at day t+1 or later.
- Include transaction costs.
- Include slippage assumption if feasible.
- Show assumptions in API and UI.
- If strategy fails to beat buy-and-hold, say so clearly.
- Do not optimize parameters to sample data and call it edge.

Add endpoints:
- `GET /api/strategy/analyze?ticker=SYM`
- `GET /api/model/strategy/analyze?id=MODEL_ID`

Optional params:
- `cost_bps`
- `slippage_bps`
- `start`
- `end`

Frontend:
Add Strategy Lab panel:
- assumption controls for cost/slippage
- equity curve
- drawdown chart
- rolling Sharpe chart
- “Beat buy-and-hold?” card
- trade stats
- methodology note
- warning when evidence is weak

Tests:
- no lookahead: position is shifted
- costs reduce returns
- drawdown sign convention is consistent
- endpoint works offline
- weak strategy can honestly show weak results

Feature D: Portfolio Clinic v1

Create `engine/portfolio_clinic.py`.

Purpose:
Make model analysis feel like an advisor tool that can improve portfolios, not just describe them.

For a selected model, produce:
- concentration diagnosis
- risk contribution diagnosis
- mandate mismatch diagnosis
- volatility target gap
- drawdown budget gap
- return target gap
- data quality diagnosis
- hypothetical rebalance suggestions

Rebalance suggestion rules:
- Trim positions above mandate single-name cap.
- Reduce highest marginal risk contributors when over risk budget.
- Diversify concentrated clusters where data supports it.
- For preservation/CD mandates, prioritize de-risking over upside.
- Respect no-short, long-only weights.
- Respect single-name caps.
- Avoid excessive turnover.
- Heavily caveat or refuse optimization when simulated data weight is high.
- Do not pretend the suggestions are trade orders.

Output:
- current diagnostics
- suggested changes:
  - ticker
  - current weight
  - suggested weight
  - change
  - reason
  - expected impact direction
- before/after estimates:
  - volatility
  - HHI
  - top risk contributor
  - mandate-fit score
- warnings
- advisor-ready explanation

Add endpoint:
- `GET /api/model/clinic?id=MODEL_ID`

Frontend:
Add Portfolio Clinic panel for models:
- before/after cards
- rebalance table
- risk contribution bar chart
- mandate traffic lights
- advisor explanation
- “Verify before acting” checklist

Tests:
- over-concentrated model triggers trim suggestion
- preservation mandate with high vol triggers de-risk suggestion
- simulated-heavy model is heavily caveated
- suggestions respect single-name caps
- no negative weights

Feature E: Advisor Report v1

Add an advisor-readable report view for an instrument or model.

Backend:
Add `engine/reporting.py` if useful.

Add endpoints if clean:
- `GET /api/report/instrument?ticker=SYM`
- `GET /api/report/model?id=MODEL_ID`

Report payload should include:
- executive summary
- action / score / evidence / risk
- top reasons
- key risks
- forecast summary
- strategy evidence
- portfolio clinic summary for models
- mandate fit for models
- data provenance
- assumptions
- methodology notes
- timestamp
- analysis-only disclaimer

Frontend:
Add report view:
- printable layout using browser print
- “Print / Save as PDF” button
- clean advisor/client-readable format
- no server-side PDF dependency unless absolutely necessary
- visible simulated-data warning where applicable

Tests:
- report endpoint returns required sections
- disclaimer included
- simulated data warning included when applicable
- no network required

Visual redesign requirements:
Make Helios look significantly more impressive while preserving readability.

Navigation:
Add clear app navigation for:
- Command Center
- Instruments
- Models
- Opportunity Radar
- Strategy Lab
- Portfolio Clinic
- Reports

Do not make separate routes unless necessary. A single-page section system is fine.

Design goals:
- institutional research cockpit feel
- strong hierarchy
- polished cards
- compact data-dense tables
- better score badges
- better empty/loading/error states
- responsive at desktop and 375px mobile
- accessible focus states
- keyboard-usable controls
- clear color semantics:
  - green favorable
  - red unfavorable/risk
  - amber caution
  - blue informational
  - gray neutral/unavailable

Charts to add if feasible with Chart.js:
- Opportunity score distribution
- Strategy equity curve
- Strategy drawdown curve
- Rolling Sharpe
- Portfolio risk contribution bar chart
- Before/after portfolio estimate

Do not make it flashy at the expense of seriousness.

Explanation layer:
For every major ranking/action, show:
- what Helios thinks
- why it thinks that
- what could invalidate it
- what risks matter most
- what data caveats apply
- what the advisor should verify before acting

Preferred tone:
- “Constructive, but not clean.”
- “Trend and forecast agree, but backtest evidence is weak.”
- “Upside exists, but drawdown risk exceeds the mandate.”
- “REVIEW, not BUY: too much simulated data.”
- “Historically profitable after costs, but only with elevated drawdown.”

Testing requirements:
Expand pytest coverage for:
- regime classification
- command center response shape
- opportunity scoring and API
- strategy metrics and no-lookahead behavior
- transaction cost effect
- portfolio clinic suggestions
- report payload and disclaimers
- relevant error paths

No network tests. No browser automation required in this pass unless already easy.

Docs:
Update README with:
- Helios Pro overview
- Command Center
- Opportunity Radar
- Strategy Lab
- Portfolio Clinic
- Advisor Reports
- methodology notes
- limitations
- analysis-only disclaimer
- simulated-data caveats
- live-data caveats
- backtest limitations
- test commands

Update `.env.example` only if new env vars are added.

Acceptance criteria:
- App starts cleanly.
- Existing tests pass.
- New tests pass.
- No network needed for tests.
- API errors remain JSON.
- No simulated data is presented as real.
- Opportunity scores are explainable.
- Strategy Lab includes no-lookahead logic and costs.
- Portfolio Clinic suggestions respect constraints.
- UI is materially more polished and easier to navigate.
- Mobile remains usable.
- README accurately documents the new behavior.

Final verification:
Run:
- `./.venv/bin/python -m pytest`
- `./.venv/bin/python -m compileall app.py serve.py engine tests`
- `./.venv/bin/python -m json.tool .design_spec.json >/dev/null`
- `/usr/local/bin/node --check static/app.js` if Node exists
- `git diff --check`

Final output format:
```md
## Helios Pro Expansion Summary
...

## Product Impact
...

## Money-Making / Evidence Impact
Be honest. Explain how the new features help identify potentially profitable opportunities and avoid bad ones without claiming guaranteed returns.

## Major Features Added
...

## Files Changed
...

## Tests Added
...

## Verification
...

## How to Demo
Step-by-step demo script:
1. ...
2. ...
3. ...

## Remaining Risks
...

## Follow-Up Roadmap
...
