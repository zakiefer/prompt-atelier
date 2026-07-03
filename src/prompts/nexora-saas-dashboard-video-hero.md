Create a SaaS landing page hero section with the following exact specifications.

Page layout:
- The entire page is `h-screen flex flex-col bg-background overflow-hidden`.
- Navbar + Hero fill exactly 100vh with no scroll.
- Use two Google Fonts imported in CSS: Instrument Serif for display/headings, including italic, and Inter for body text.

Fonts and design tokens in `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');

:root {
  --background: 0 0% 100%;
  --foreground: 210 14% 17%;
  --primary: 210 14% 17%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 96%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96%;
  --muted-foreground: 184 5% 55%;
  --accent: 239 84% 67%;
  --accent-foreground: 0 0% 100%;
  --border: 0 0% 90%;
  --ring: 239 84% 67%;
  --radius: 0.5rem;
  --font-display: 'Instrument Serif', serif;
  --font-body: 'Inter', sans-serif;
  --shadow-dashboard: 0 25px 80px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
```
- Tailwind config extends fontFamily with display and body mapped to CSS vars.
- All colors use `hsl(var(--token))`.

Navbar:
- `flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 font-body`.
- Left: logo text `✦ Nexora`, text-xl font-semibold tracking-tight text-foreground.
- Right desktop: hidden on mobile, links Home, Pricing, About, Contact with gap-8, text-sm text-muted-foreground hover:text-foreground.
- CTA: rounded-full px-5 text-sm font-medium using primary styling.

Hero background:
- Fullscreen muted autoplay loop video, absolute inset-0 w-full h-full object-cover z-0.
- Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4
- All content wraps in `relative z-10 flex flex-col items-center w-full`.

Hero content:
- Badge: Framer Motion fade up from y 10, duration 0.5s. Classes: `inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground font-body mb-6`. Text: "Now with GPT-5 support ✨".
- Headline: Motion fade up from y 16, duration 0.6s, delay 0.1s. Text: "The Future of Smarter Automation", with "Smarter" in Instrument Serif italic. Classes: `text-center font-display text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight text-foreground max-w-xl`.
- Subheadline: Motion fade up from y 16, duration 0.6s, delay 0.2s. Classes: `mt-4 text-center text-base md:text-lg text-muted-foreground max-w-[650px] leading-relaxed font-body`. Text: "Automate your busywork with intelligent agents that learn, adapt, and execute-so your team can focus on what matters most."
- CTAs: Motion fade up from y 16, duration 0.6s, delay 0.3s. Row `mt-5 flex items-center gap-3`. Primary button "Book a demo"; play button ghost variant h-11 w-11 rounded-full bg-background shadow-[0_2px_12px_rgba(0,0,0,0.08)] with lucide Play icon h-4 w-4 fill-foreground.

Dashboard preview:
- Motion fade up from y 30, duration 0.8s, delay 0.5s.
- Container: mt-8 w-full max-w-5xl.
- Frosted glass wrapper: rounded-2xl overflow-hidden p-3 md:p-4, with inline styles background rgba(255,255,255,0.4), border 1px solid rgba(255,255,255,0.5), boxShadow var(--shadow-dashboard).
- Dashboard is coded in React, not an image. Use text-[11px], select-none, pointer-events-none.
- Top bar: logo "N" in rounded box, "Nexora", chevron, search bar with `⌘K`, "Move Money", bell icon, avatar "JB".
- Sidebar width w-40: Home active, Tasks badge 10, Transactions, Payments with chevron, Cards, Capital, Accounts with chevron. Workflows section includes Trake rutes, Payments, Notifications, Settings.
- Main content bg-secondary/30.
- Greeting: "Welcome, Jane" text-sm font-semibold.
- Action buttons: Send primary/accent, Request, Transfer, Deposit, Pay Bill, Create Invoice, plus "Customize".
- Two equal-width cards side by side:
  - Balance card: "Mercury Balance" with checkmark, amount `$8,450,190.32`, cents in text-xs muted, stats Last 30 Days, +$1.8M green, -$900K red, SVG area chart h-20 with cubic Bezier curve, linear accent fill from 15% opacity to transparent, accent stroke width 1.5.
  - Accounts card: header "Accounts" with plus and vertical dots icons; rows Credit $98,125.50, Treasury $6,750,200.00, Operations $1,592,864.82.
- Transactions table: heading "Recent Transactions", columns Date, Description, Amount, Status. Rows: AWS -$5,200 Pending amber, Client Payment +$125,000 Completed green, Payroll -$85,450 Completed, Office Supplies -$1,200 Completed.

Dependencies and decisions:
- Use framer-motion for all animations.
- Use lucide-react for icons.
- Use shadcn/ui Button component.
- Tailwind CSS with tailwindcss-animate plugin.
- Dashboard overflows toward the bottom of the viewport and is clipped by parent overflow-hidden.
- No dark mode. Light only.
- All component colors use semantic Tailwind tokens, never raw color values.
- SVG chart is hand-crafted, not chart-library generated.
