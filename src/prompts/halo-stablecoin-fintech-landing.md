Build a premium, fintech-style landing page for a stablecoin product called "Halo / USD Halo" using React + TypeScript + Vite + Tailwind CSS, with lucide-react for icons. No other UI libraries. The page background is #F5F5F5.

Global setup:
- Use TT Norms Pro as the primary font, loaded with @font-face from `/fonts/tt-norms-pro-regular.woff2` weight 400 and `/fonts/tt-norms-pro-semibold.woff2` weight 600, with font-display swap.
- Apply the font to html, body, and inherit on `*`.
- Keep Tailwind base, components, and utilities at the top of `src/index.css`.
- Page wrapper: `flex flex-col bg-[#F5F5F5]`.
- The first section wraps Navbar + Hero in `h-screen flex flex-col overflow-hidden`.
- Shared section width: `max-w-[88rem] mx-auto`.

Custom logo:
Create a `LogoIcon` SVG component using currentColor, viewBox `0 0 256 256`, with this stylized halo mark path:
```svg
M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z
```

Navbar:
- `nav` is absolute top-0 left-0 right-0 z-20 px-6 py-5.
- Inner row: flex items-center justify-between.
- Left: LogoIcon `w-7 h-7 text-black` plus "Halo" in text-2xl font-medium tracking-tight text-black.
- Center, hidden below md: links Network, Ecosystem, Rewards, Help, News with gap-8, text-base text-gray-700 hover:text-black font-medium transition-colors duration-200.
- Right: black pill "Open Wallet" button, bg-black text-white text-base font-medium px-7 py-2.5 rounded-full hover:bg-gray-800 transition-colors duration-200.

Hero section:
- Outer: flex-1 px-6 pt-20 pb-6 flex items-end.
- Inner card: relative w-full rounded-2xl overflow-hidden, inline height `calc(100vh - 96px)`.
- Background video absolute inset-0 w-full h-full object-cover, autoPlay muted loop playsInline.
- Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4
- Content overlay: relative z-10 flex flex-col items-start justify-start h-full p-12 pt-36.
- h1: `Your Wealth<br/>Works`, text-black text-5xl md:text-6xl font-medium leading-tight max-w-xl mb-4, letterSpacing -0.04em.
- p: "An automated, reward-powered digital dollar built for native passive earnings and effortless connection into DeFi." Use text-black/70 text-base md:text-lg max-w-md mb-8 leading-relaxed and inline Inter/system font.
- CTA: "Join us" pill with ArrowRight from lucide-react. Button classes: inline-flex items-center gap-3 bg-black text-white text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800. Trailing arrow sits in bg-white rounded-full p-2 with `w-5 h-5 text-black`.

Hero brand marquee:
- Container: mt-24 w-full max-w-md overflow-hidden.
- Inject scoped CSS keyframes translating 0 to -50%; `.marquee-track` display flex, width max-content, animation `marquee 22s linear infinite`.
- Render brand list twice for a seamless loop.
- Each item: mx-7 shrink-0 text-black/60 whitespace-nowrap with distinct inline logo typography:
  - Stripe: Georgia serif, 700, letterSpacing -0.02em, 15px.
  - Coinbase: Arial sans, 900, letterSpacing 0.08em, 13px, uppercase.
  - Uniswap: Trebuchet MS, 600, letterSpacing 0.01em, 15px, italic.
  - Aave: Courier New monospace, 700, letterSpacing 0.12em, 13px, uppercase.
  - Compound: Palatino/Book Antiqua, 400, letterSpacing -0.01em, 16px.
  - MakerDAO: Impact/Arial Narrow, 400, letterSpacing 0.04em, 14px.
  - Chainlink: Verdana, 700, letterSpacing -0.03em, 13px.

Info section:
- Section bg-[#F5F5F5] px-6 py-24.
- Row 1: grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start.
- Left h2: "Meet USD Halo.", text-black text-4xl md:text-5xl font-medium leading-tight mb-8, letterSpacing -0.03em.
- Left button: black pill "Discover it" with white arrow circle using the same pattern as "Join us".
- Right paragraph: "USD Halo is a reward-earning dollar coin that lets your savings grow while remaining tied to the U.S. dollar." Use text-black/70 text-2xl md:text-3xl leading-relaxed.
- Row 2: card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.
- Card 1 spans two lg columns, rounded-2xl, min-h-80, p-7, cover image background:
  https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85
- Card 1 title: "Savings that bloom"; body: "Gain steady returns as your dollar tokens are routed into top-performing DeFi strategies."
- Card 2: solid #2B2644, rounded-2xl, p-7, min-h-80. Heading "Always fluid,\nalways pegged."; body "Keep fully dollar-anchored with on-demand access to funds - no lockups or waits."
- Card 3: same #2B2644 styling. Heading "Fully\nautomated"; body "Skip the task of tuning positions yourself. USD Halo runs in the background for you."

Backed By section:
- Section bg-[#F5F5F5] px-6.
- Inner max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center.
- Left text: "Funded by premier partners\nand forward-thinking leaders." Use text-black/70 text-base leading-relaxed.
- Right 3/4 column: infinite marquee duplicated twice, 30s linear, class `.backers-track`, keyframes `backers-marquee`.
- Backer items use mx-10 shrink-0 text-black/50 whitespace-nowrap and distinct inline typography:
  Fundamental Labs, KUCOIN, NGC, NxGen, Matter Labs, DEXTools, NGRAVE, Polychain.

Use Cases section:
- Section bg-[#F5F5F5] px-6 py-24.
- Inner: grid grid-cols-1 md:grid-cols-2 gap-8 items-start.
- Left column: md:pr-12 md:pt-2.
- Eyebrow: "USD Halo in Practice", text-black/60 text-sm mb-2.
- h2: "Use modes", text-5xl md:text-6xl font-medium leading-none mb-6, letterSpacing -0.04em.
- Paragraph: "USD Halo powers a wide range of modes for builders, companies and treasuries wanting safe and rewarding stablecoin integrations plus more", text-black/60 text-base leading-relaxed max-w-sm.
- Right column: large relative rounded-3xl overflow-hidden min-h-[720px] with background video absolute inset-0 object-cover.
- Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_183428_ab5e672a-f608-4dcb-b319-f3e040f02e2d.mp4
- Overlay content: relative z-10 p-10 md:p-12.
- h3 "Commerce", text-4xl md:text-5xl font-medium leading-tight mb-5, letterSpacing -0.03em.
- Paragraph: "Lift customer retention by offering USD Halo, a trusted dollar-backed stablecoin with strong yields, letting your patrons earn with zero effort on your platform."
- Link: inline-flex "Know more" with a leading circular white/80 backdrop-blur icon containing ArrowRight.

Interactions and composition:
- Two CSS marquees: 22s hero brands and 30s backers, both duplicated and translating 0 to -50%.
- All buttons use transition-colors duration-200 with hover:bg-gray-800 or hover:bg-white for arrow circles.
- Nav links transition from text-gray-700 to text-black.
- Videos autoplay muted loop playsInline.
- Render order: h-screen wrapper with Navbar + HeroSection, then InfoSection, BackedBySection, UseCasesSection.
- All headings use tight negative letter spacing and font-medium as the heaviest weight.
