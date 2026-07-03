Build a full-screen, scroll-driven fashion/archive landing page for a brand called "prmpt". The page has two main phases: a hero phase with full-viewport dual video and overlaid UI, then a gallery phase where a black panel rises and scattered product images scale in and out as the user scrolls. At the end, a white overlay fades in and a large "view" CTA scales into place.

Tech stack:
- React 19 + TypeScript
- Vite 6 with `@vitejs/plugin-react`
- Tailwind CSS v4 via `@tailwindcss/vite`
- GSAP 3.15 with `@gsap/react` and ScrollTrigger
- Motion 12 via `motion/react`
- Font: Inter Tight from Google Fonts, weight 500

Video assets:
- LEFT video: `https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4`
- RIGHT video: `https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4`

Gallery images, in order:
1. `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85`
2. `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85`
3. `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png&w=1920&q=85`
4. `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png&w=1920&q=85`
5. `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png&w=1920&q=85`
6. `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png&w=1920&q=85`
7. `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png&w=1920&q=85`
8. `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png&w=1920&q=85`
9. `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png&w=1920&q=85`
10. `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png&w=1920&q=85`

Root container:
- `id="scroll-spacer"`, position relative, background white, user-select none.
- Initial height: `500vh`.
- GSAP later sets height to `vh + maxScroll + 2 * vh`.
- Desktop hides the default cursor with `cursor: none`; touch devices keep the default cursor.

Custom desktop cursor:
- Hidden below 1024px.
- Fixed, pointer-events none, z-index 50.
- Follows mousemove by setting `style.left` and `style.top` directly.
- Center with `transform: translate(-50%, -50%)`.
- Use `mix-blend-mode: exclusion`.
- Contains a 48x48 SVG circle with stroke radius 22.75, strokeWidth 2.5, plus a custom decorative glyph path, all white.

Logo:
- Fixed top-left, pointer-events none, z-index 20.
- Use `mix-blend-mode: exclusion`.
- Responsive width: 124px mobile, 266px tablet, 355px desktop.
- Position: 16px top/left on mobile, 32px top/left on desktop.
- Animate with Motion from `opacity: 0, y: 12` to visible over 0.6s, ease `[0.25, 0.1, 0.25, 1]`.
- SVG viewBox `0 0 355 110` with prmpt wordmark and circled R mark, all paths filled white.

Caption:
- Fixed left below the logo, pointer-events none, z-index 20, mix-blend-mode exclusion.
- Left: 32px desktop, 16px mobile.
- Top: 244px desktop, 180px tablet, 118px mobile.
- Width: 692px desktop, `calc(50vw - 48px)` tablet, `calc(100vw - 32px)` mobile.
- Font: Inter Tight, weight 500, 12px, line-height 140%, letter-spacing -0.04em, white.
- Motion delay: 0.3s.
- Text: "When switching between videos near the center, do not reset currentTime to 0 abruptly. Add a small dead zone: if cursor is within +/-50px of center, keep both videos at currentTime = 0 and show whichever was last active."

Header navigation:
- Fixed top-right, z-index 20, pointer-events none, mix-blend-mode exclusion.
- Position: 32px top/right desktop, 16px top/right mobile.
- Width 330px desktop, auto mobile.
- Height 30px.
- Flex row, justify-between, align center.
- Motion delay: 0.15s.
- Contains "ABOUT" text hidden on mobile.
- Hamburger SVG icon: viewBox `0 0 40 40`, two horizontal lines, stroke white, strokeWidth 2.5, size 30 desktop and 24 mobile.
- Cart text: `[ CART ]`, Inter Tight 500, uppercase, white, 15px desktop and 13px mobile.

Product info:
- `id="outro-info"`, fixed, pointer-events none, z-index 20, mix-blend-mode exclusion.
- Desktop: right 32px, bottom 80px, width 330px, flex-column, align center.
- Mobile: left 0, right 0, bottom 48px, flex-column, align center.
- Animate opacity from 0 to 1 with delay 0.45s.
- Store `data-outro-offset` as 166 desktop or 132 mobile.
- Circle icon is 30x30 desktop, 20x20 mobile.
- Circle symbol starts at "8" and randomizes on scroll from `['8', '$', '^^', '%', '/']`, throttled to 80ms.
- Collection label text: `ARCHIVE COLLECTION` line break `"PROMPT"`.
- Label font: Inter Tight 500, uppercase, letter-spacing -0.04em, white, 30px desktop and 20px mobile.
- Price: `$97,33`, Inter Tight 500, 80px desktop and 60px mobile, white.

View CTA:
- `id="outro-buy"`, fixed, pointer-events none, z-index 20, mix-blend-mode exclusion.
- Starts hidden with `transform: scale(0)` and `transform-origin: right bottom`.
- Desktop: right 32px, bottom 32px, width 330px, height 174px.
- Mobile: left/right 16px, bottom 60px, height 100px.
- Background #fff, border-radius 1335px, flex center.
- Text: "view", Inter Tight 500, 110px desktop and 72px mobile, letter-spacing -0.04em, color #fff, mix-blend-mode exclusion.

Video container:
- `id="main-canvas"`, pointer-events none.
- Desktop: fixed inset 0, width 100%, height 100%, z-index 0.
- Mobile: fixed left 0, top 220px, width 100vw, height `calc(100vh - 220px)`, z-index 0.
- Opacity goes from 0 to 1 once both videos are loaded, using `opacity 0.3s ease`.
- Contains two absolute videos filling the container, muted, playsInline, preload auto, object-fit cover.
- Left video starts `display: none`; right video starts `display: block`.

Desktop video interaction:
- Do not autoplay videos on non-touch desktop.
- Scrub videos based on cursor X via requestAnimationFrame.
- Dead zone: `Math.max(30, width * 0.05)` pixels from center.
- If cursor is inside the dead zone, keep current video at `currentTime = 0`.
- Cursor left of the dead zone shows the RIGHT video and scrubs based on distance from center-left-edge to the left edge.
- Cursor right of the dead zone shows the LEFT video and scrubs based on distance from center+deadzone to the right edge.
- `activeSideRef` tracks the last active side and only changes when the cursor exits the dead zone.
- Map progress to `0...video.duration`.
- Critical jitter rule: only assign `currentTime` when `!video.seeking`.

Touch video interaction:
- On mobile/tablet, videos autoplay alternately.
- Left plays first, then `ended` switches to right, right `ended` switches back to left.
- Respect `prefers-reduced-motion`.

White overlay:
- `id="outro-overlay"`, fixed inset 0, pointer-events none, z-index 12.
- Background #fff, opacity 0, controlled by scroll.

Footer:
- `id="outro-footer"`, fixed, pointer-events none, mix-blend-mode exclusion.
- Left 16px, bottom 32px desktop or 24px mobile.
- Opacity 0 until outro.
- Flex row gap 80px on desktop, space-between on mobile.
- Text: "PRMPT (R) 2026" and "PRIVACY POLICY".
- Font: Inter Tight 500, uppercase, white, letter-spacing -0.02em, 13px desktop and 11px mobile.

Black panel gallery:
- Fixed inset 0, background black, z-index 10.
- Starts translated down with `translateY(100vh)`.
- Slides to `translateY(0)` during the first 100vh of scroll via GSAP ScrollTrigger with scrub true and no easing.
- Inner wrapper uses full width and `padding-top: min(400px, 40vh)`.

Gallery layout algorithm:
- Responsive columns: 2 below 640px, 3 from 640px to 1024px, 4 at 1024px and up.
- Each cell has `aspect-ratio: 2 / 3`.
- `buildLayout(count, cols)` creates scattered rows.
- For row `r`, primary column `a = (r * 2 + (r % 2)) % cols`.
- Place one image at column `a`.
- Every third row, place a second image at `b = (a + 2) % cols`, or `(a + 1) % cols` if that collides.
- Empty cells use `-1` and render as spacers.

Card scaling:
- Cards use class `bp-card` and `will-change: transform`.
- Start with `transform: scale(0)`.
- Cards in the left half use `transform-origin: right bottom`; cards in the right half use `transform-origin: left bottom`.
- Per-frame scale is computed in RAF, not scroll event handlers.
- Enter scale: `Math.min(1, (vh - top) / (vh * 0.6))`.
- Exit scale: `Math.min(1, bottom / (vh * 0.4))`.
- Final scale: `Math.min(enter, exit)`.
- If fully off-screen, set scale 0.

Scroll phases:
- Phase 1, scrollY 0 to vh: black panel slides up, cards use `panelOffset = vh - scrollY`.
- Phase 2, scrollY greater than vh: panel is fixed at top, inner wrapper translates `translateY(-(scrollY - vh))`.
- Outro starts after `vh + maxScroll`.
- Outro progress: `(scrollY - vh - maxScroll) / (vh - 100)`.
- During outro, white overlay fades in, product info slides up by `outroOffset`, the view CTA scales from 0 to 1, and the footer fades in.

CSS:
```css
@import "tailwindcss";

.bp-card {
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .bp-card {
    will-change: auto;
  }
}
```

Key principles:
- All text overlays use `mix-blend-mode: exclusion`.
- Overlays are `pointer-events: none`.
- Root uses `user-select: none`.
- Videos are hidden with `visibility: hidden` once scroll passes the first viewport height.
- Circle randomization is throttled to 80ms.
- Entry animations stagger: logo 0s, nav 0.15s, caption 0.3s, product info 0.45s.
