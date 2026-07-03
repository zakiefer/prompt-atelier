Build a fully responsive, full-viewport hero section for a PR-agency SaaS called "Convix Software" with these exact specs.

Page frame:
- Outer wrapper: `min-h-screen w-full bg-[#ededed] p-3 sm:p-4`, font-family Inter.
- Hero container: `relative w-full h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl`.
- The hero container clips everything inside, including video, content, and dashboard.

Background video:
- URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4
- Absolutely positioned: inset-0 w-full h-full object-cover pointer-events-none.
- Attributes: autoPlay, loop, muted, playsInline, preload="auto", disableRemotePlayback, `webkit-playsinline="true"`, `x5-playsinline="true"`.
- Poster fallback: https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60
- Above video: absolute inset-0 bg-white/10 overlay.
- Foreground content wrapper: relative z-10.

Fonts:
- `/src/styles/fonts.css` imports Inter weights 400, 500, 600, 700 and Instrument Serif regular plus italic from Google Fonts.

Navbar:
- Floating responsive pill with hamburger.
- Wrapper: `flex justify-center pt-4 sm:pt-6 px-3 sm:px-4`.
- Pill: `bg-white rounded-full shadow-sm border border-neutral-200 pl-2 pr-2 py-2 w-full max-w-[760px] relative`.
- Logo: orange #ef4d23 eight-petal flower SVG, viewBox 32x32, rendered w-7 h-7 sm:w-8 sm:h-8.
- Logo SVG: eight circles of r=3.5 at radius 10 around center (16,16), plus center circle, all orange.
- Desktop links: hidden md:flex, gap-6, 14px.
- Links: Home with 1.5px black dot, Features, About, Pages in #ef4d23 with ChevronDown size 3.5.
- Right cluster: ml-auto, ShoppingCart icon hidden on mobile, then orange #ef4d23 rounded-full button.
- Button label: "Get early access" on desktop and "Early access" on mobile.
- Button includes a white/20 inner circle holding ChevronRight.
- Mobile-only Menu hamburger button using lucide Menu, md:hidden.
- Open state: dropdown panel absolute top-full left-2 right-2 mt-2 bg-white rounded-2xl shadow-lg border border-neutral-200 p-3 z-20.
- Dropdown lists the same nav items vertically.
- useState open toggles menu.

Hero content:
- Centered with `flex flex-col items-center px-4 pt-10 sm:pt-16 pb-8 sm:pb-12 text-center`.
- Badge: inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm, 13px.
- Badge content: orange dot plus "Convix Software".
- Headline h1:
  - Inline style fontSize `clamp(36px, 8vw, 72px)`.
  - lineHeight 1.05.
  - fontWeight 500.
  - letterSpacing -0.02em.
  - mt-5 sm:mt-6 max-w-4xl.
- Headline text:
```tsx
Shaping <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 }}>Agencies</span><br />of tomorrow
```
- Subtitle: mt-4 sm:mt-6 text-neutral-700 px-2, fontSize `clamp(13px, 3.5vw, 16px)`.
- Subtitle text: "The All-In-One Software Powering the Future of PR Agencies".
- CTA button: mt-6 sm:mt-8 inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5, 14px.
- CTA text: "Get Started".
- CTA icon circle: w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 containing ChevronRight 4x4.

Dashboard preview:
- Outer wrapper around dashboard: px-3 sm:px-4.
- Dashboard tray: bg-[#f5f2ee] rounded-3xl p-4 sm:p-6 w-full max-w-[880px] mx-auto.
- Grid: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4.
- Dashboard cards should bleed off the bottom edge of the clipped rounded hero container.

Card 1 - Clicks:
- White card, rounded-2xl, p-5.
- Header: orange "Clicks" plus neutral "This Month" at 13px.
- Big number "6,896" at 28px, weight 600.
- Red pill: bg-red-50 text-red-600 rounded-full px-2 py-0.5 with TrendingDown icon and "-3,382 (33%)" at 11px.
- Caption: "Compared to yesterday".
- Centered label: "Month Target achieved".
- Gauge at 92% in #ef4d23, with labels "389K" and "425K".
- Bottom toggle pill: bg-neutral-100 rounded-full p-1 flex. "Impressions" active with white card + shadow; "Clicks" inactive.

Card 2 - Form:
- White card, rounded-2xl, p-5, flex flex-col gap-3.
- Two label/dropdown groups:
  - "Show figures for" -> "This month".
  - "Compare period by" -> "Month-to-date (MTD)".
- Labels: 12px neutral-700.
- Dropdown buttons: bordered rounded-lg px-3 py-2 with ChevronDown.
- Two label/input groups with # prefix:
  - "Ste targets (This month)" -> 10.
  - "Ste targets (This year)" -> 100.
- Footer: orange #ef4d23 "Save" button rounded-lg px-5 py-2, underlined "Cancel", and X icon pushed right with ml-auto.

Card 3 - Video Starts:
- White card, rounded-2xl, p-5.
- Header: orange "Video Starts" plus "today".
- Big "0" plus neutral pill with TrendingUp and "0".
- Text: "Compared to yesterday".
- Gauge at 68% in #9ca3af, no end labels.
- Toggle pill: "Video Clicks" active / "Video Starts".

Gauge component:
- Props: value, color default "#ef4d23", showLabels, min, max.
- SVG viewBox 0 0 200 120, max-width 260px.
- 40 tick marks spanning a 180 degree arc from angle pi to 2pi.
- Active tick count = round(value / 100 * 40).
- Each tick is a line from radius r-10 to r=80 around center (100,100).
- strokeWidth 2.5, strokeLinecap round.
- Active ticks use color; inactive ticks use #d4d4d8.
- Center text: `<text x=100 y=105 textAnchor="middle">{value}%</text>`, fontSize 22, fontWeight 600.
- If showLabels, render small flex row below SVG, 11px neutral-500, justify-between, showing min and max.

Colors:
- Primary orange: #ef4d23.
- Dark CTA: #0b0f1a.
- Page bg: #ededed.
- Hero bg: #d9d9d9.
- Dashboard tray: #f5f2ee.

Icons:
- Use lucide-react ChevronDown, ChevronRight, ShoppingCart, Menu, TrendingDown, TrendingUp, X.

File structure:
```text
src/app/App.tsx
src/app/components/Navbar.tsx
src/app/components/DashboardPreview.tsx
src/app/components/Gauge.tsx
src/styles/fonts.css
```

Behavior:
- No custom animations, only the native looping muted background video.
- Fully responsive: navbar collapses to hamburger under md, headline and CTA scale via clamp(), dashboard grid steps 1 to 2 to 3 columns.
