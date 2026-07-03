Build a single-page React + TypeScript Vite landing hero for a product called "Xero". Use Inter from Google Fonts, weights 300-800. Do not use Tailwind utility classes for the hero; write plain CSS in a global stylesheet. No purple/indigo branding outside the specified pink-magenta gradient arc.

Layout:
- Body: black page #0a0a0f, display flex column, align-items center, padding 14px, font-family Inter.
- Render three top-level blocks, each max-width 1600px:
  1. nav.
  2. section.hero-card.
  3. div.brands.

CSS variables:
```css
--bg: #0a0a0f;
--surface: #111118;
--text: #f0f0f5;
--text-muted: #8888a8;
--accent: #c8a0e0;
--accent-pink: #b04090;
--border: rgba(255, 255, 255, 0.08);
```

Navbar:
- Grid layout columns 1fr auto 1fr, padding 12px 24px, margin-bottom 14px.
- Left logo: "Xero", font-size 1.05rem, font-weight 700, letter-spacing -0.01em.
- Center links: Method, Pricing, Docs, color var(--text-muted), font-size 0.85rem, gap 32px, hover to var(--text) over 0.2s.
- Right actions: Login and Sign up pill buttons.
- Login: rgba(255,255,255,0.06), border var(--border), white text, padding 7px 18px, border-radius 999px.
- Signup: solid white, text #0a0a0f, same sizing, font-weight 600.
- `.nav-menu` uses display contents on desktop.
- Mobile <=768px: nav flex space-between, hamburger `.menu-toggle`, full-screen nav menu slides in from right, body overflow hidden while open.

Hero card:
- width 100%, max-width 1600px, border-radius 20px, border rgba(255,255,255,0.07), overflow hidden, position relative, background #0d0b12, padding 80px 40px 70px, min-height 640px.
- Flex column center aligned, text-align center.
- ::before signature gradient arc:
  - radial-gradient at 50% -70% with many stops from transparent through rgba(176,48,136,...) to white at 95%.
  - plus secondary radial-gradient at 50% 35%.
  - z-index 0, pointer-events none.
- `.hero-grid`: absolute overlay with 40px crosshatch grid and radial mask showing grid inside arc only.

Icon pipeline:
- `.icon-pipeline`: relative flex centered, max-width 700px, margin-bottom 52px, z-index 1.
- Children in exact order:
  1. `svg.beam-svg` absolute over full pipeline with filter glow, linearGradient beam-gradient, and two path elements.
  2. Left `.icon-node.node-light-right` id node-stack, layers SVG.
  3. `.pipeline-line`, 160px x 1px gradient line.
  4. Center wrapper with `.splash` and `.icon-node-center` id node-x, containing Xero logo SVG.
  5. `.pipeline-line.right`.
  6. Right `.icon-node.node-light-left` id node-shield, shield-check SVG.
- Side nodes: 46px round, background #1a1a24, cursor pointer, z-index 3, neumorphic shadow, dotted outer ring via ::after, hover translateY(-1px), active inset-only shadows.
- Center node: 64px round #1e1e2c, stronger neumorphic shadow, inner Xero SVG 28px fill white.
- Side-light glows: radial ::before on active node sides, right glow gray and left glow purple.
- Splash animation scales 0.4 to 1.4 and fades out over 0.8s.

Beam animation:
- Use refs for pipeline, three nodes, both beam paths, gradient, and splash.
- On mount and resize, compute SVG path from node center positions:
  `M startX,startY L midX,midY L endX,endY`.
- Apply d to both beam paths.
- Animate `x1` and `x2` of #beam-gradient in userSpaceOnUse so bright window slides along, halfWidth 5 percentage units.
- requestAnimationFrame state machine:
  - p1 800ms: percentage 0 to 0.5, node-stack active while p < 0.4. End switches to splash, hides beam paths, adds splash animate.
  - splash 800ms: waits, then p2, removes animate, restores paths.
  - p2 800ms: percentage 0.5 to 1.0, node-shield active while p > 0.6. End switches to idle.
  - idle 1000ms: wait then loop to p1.
- Total cycle about 3.4s, infinite.

Hero text:
```html
<h1 class="hero-heading">
  The simple way
  <strong>encryption your data</strong>
</h1>
<p class="hero-sub">
  Fully managed data encrypting service and annotation<br>
  platform for teams of all industries.
</p>
<a href="#" class="btn-cta">Get Started</a>
```
- `.hero-heading`: clamp(2.4rem, 5.5vw, 4rem), font-weight 300, line-height 1.1, letter-spacing -0.02em.
- strong block: weight 400, margin-top 4px, gradient from white to #a98597 clipped to text.
- `.hero-sub`: 0.9rem, rgba(255,255,255,0.4), max-width 440px, margin 0 auto 36px.
- CTA: white pill, black text, padding 12px 32px, radius 999px, font-weight 600, hover opacity 0.9 and translateY(-1px).

Brands row:
- `.brands`: flex row, gap 64px, padding 32px 24px 10px, flex-wrap, justify-content center.
- Five brand items with monochrome SVGs: Expedia, asana, zenefits, HubSpot, loom.
- Brand items: flex gap 10, color rgba(255,255,255,0.35), font-size 1.1rem, font-weight 500, white-space nowrap.

Responsive:
- <=860px: pipeline gap 0, margin-bottom 40px, pipeline-line width 80px.
- <=768px: mobile hamburger menu, icon-node 38px, icon-node-center 52px, hero-card padding 60px 20px 60px, brands gap 32px.
- <=480px: hero-card radius 16px, brands gap 24px.
- Z-index: 0 arc/grid, 1 pipeline/text, 2 beam/splash, 3 nodes, 4 side glows, 1000 mobile nav overlay, 1001 toggle.
