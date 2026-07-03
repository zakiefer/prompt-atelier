Create a "Creative Studio Showcase" landing page as a single-page HTML/React-style hero with a splash reveal, fixed navigation, menu panel, animated hero image, word-by-word headline reveal, expanding CTA, and canvas-powered spotlight image reveal.

Global setup:
- Page title: "Creative Studio Showcase".
- Load Inter weights 300, 400, 500, 600, 700 from Google Fonts.
- Global reset applies border-box and removes margin/padding from all elements.
- All elements use Inter/system font stack.
- html/body background: #E4E4E4, text #F4F1E8, overflow-x hidden, smooth scroll.

Splash screen:
- Fixed fullscreen `.splash`, z-index 9999, pointer-events none, overflow hidden.
- Two rows, each 50% height.
- Each row contains five `.splash-box` blocks, each 20% width and full row height, background #75C5DE.
- Top row boxes animate upward with `splashTop`; bottom row boxes animate downward with `splashBottom`.
- Box delays: 0s, 0.05s, 0.1s, 0.15s, 0.2s.
- Splash fades/visibility-hides with `splashHide` after 1.35s.
- Timing: top/bottom boxes animate for 1s with cubic-bezier(0.96,-0.02,0.38,1.01).

Hero image entrance:
- `.hero-image-animate` starts opacity 0, scale 1.5, rotate 3deg.
- Animates to opacity 1, scale 1, rotate 0 over 1.2s, cubic-bezier(0.25,0.46,0.45,0.94), delay 1s.

Word reveal:
- Headline text is split into words in JavaScript.
- Text: "I build compelling visual stories & motion that make ideas shine."
- Each word is an inline-block `.word-reveal` span with margin-right 0.3em.
- Animation: opacity 0, translateY(10px), blur(10px) to visible, y 0, blur 0 over 0.4s.
- Per-word delay: `1 + i * 0.05` seconds.

CTA:
- Main `.cta-btn` is an expanding pill button with white sliding background and blue circular arrow.
- CTA text: "Start a project now".
- Button has no border/background, border-radius 9999px, padding 8px, gap 12px.
- `.cta-btn-bg` is absolute, white, rounded-full, transitions width over 0.4s.
- On hover, the white background expands to nearly full button width.
- `.cta-btn-circle` is #75C5DE, 48px mobile and 54px desktop, moves left by 7px on hover.
- CTA enters with `slideUpScale`: opacity 0, translateY(60px), scale 0.4 to visible over 0.8s, delay 1s.
- Menu uses a smaller `.menu-cta-btn` variant with 38px circle.

Creator text:
- Giant bottom text says "Visuals".
- `.creator-text-animate` starts translateY(330px), animates to 0 over 1s, cubic-bezier(0.16,1,0.3,1), delay 1.5s.
- `.hero-big-text` is absolute bottom -30px mobile, -40px desktop, full width, centered, z-index 2, pointer-events none.
- Heading size: clamp(180px, 28vw, 560px), line-height 80%, tracking -0.04em, white-space nowrap, color #F4F1E8.

Fixed logo:
- `.logo-wrapper` fixed top 30px mobile, 40px desktop, left half of screen, z-index 10, mix-blend-mode difference.
- Logo image URL: https://framerusercontent.com/images/VMcS7YYTM5PXfXvlHc9u3hSCMM.svg
- Image size: 32x32.
- Padding-left: 20px mobile, 40px desktop.

Burger:
- `.burger-wrapper` fixed top 16px mobile, 27px desktop, right half of screen, z-index 10.
- `.burger-btn`: 59x59 circular button, background #F4F1E8, two bars, hover background #0B0B0B with bars #F4F1E8.
- Open state: button background #0B0B0B; bars rotate into X.

Menu panel:
- Fixed panel z-index 9.
- Mobile: left/right 8px, rounded 20px.
- Desktop: right 7px, width 420px.
- Background rgba(17,17,17,0.95), backdrop-filter blur(26px), padding 90px 32px 32px mobile, 60px desktop.
- Closed: top -600px, opacity 0, pointer-events none.
- Open: top 0 mobile, top 7px desktop, opacity 1, pointer-events auto.
- Transitions top over 0.5s cubic-bezier(0.25,0.46,0.45,0.94) and opacity 0.4s.
- Nav links: Work, About, Blog, color #F4F1E8, font-size 36px mobile, 42px desktop, weight 500, line-height 130%, hover opacity 0.7.
- Contact email: studio@norakessler.com, color #9A9590, 18px mobile, 20px desktop, hover #F4F1E8.
- Socials: Pinterest, Behance, Letterboxd, underlined, 14px, color #9A9590.

Hero:
- `.hero`: relative, width 100%, overflow hidden, background #E4E4E4, min-height 100vh.
- Desktop: height 100vh, min-height 800px.
- Base image layer:
  - absolute top 30vh mobile, top 0 desktop, left/right/bottom 0, z-index 5.
  - background-size cover, no-repeat.
  - background-position 60% center mobile, center desktop.
  - URL: https://soft-zoom-63098134.figma.site/_assets/v11/5c9f982199fde1d9b85a20e5396f0fa7bacaf9a3.png?w=2560
- Reveal image layer:
  - same positioning and background behavior, z-index 7, pointer-events none.
  - URL: https://soft-zoom-63098134.figma.site/_assets/v11/6be2165e31648955b4e071f4cf2a50bc572b9bfd.png?w=1536
- Hidden canvas `#reveal-canvas` is absolute inset 0 and used only to generate the mask.

Hero content:
- `.hero-content` relative z-8, flex column, aligned top on mobile, absolute inset 0 on desktop.
- Mobile padding 110px 16px 24px.
- Desktop padding 160px 40px 100px and justify-content space-between.
- `.hero-content-inner`: flex column, align-start, gap 30px, pointer-events auto.
- `.hero-headline`: 22px mobile, 28px desktop, font-weight 500, line-height 120%, tracking -0.02em, color #111111, max-width 447px.

Canvas spotlight reveal:
- `SPOTLIGHT_R = 260`.
- Canvas is resized to window width/height on load and resize.
- Track mouse target from `mousemove`; smooth coordinates lerp by 0.1 each frame.
- Each animation frame:
  - Clear canvas.
  - Create radial gradient centered at smooth mouse position.
  - Stops: 0 and 0.4 fully white, 0.6 rgba white 0.75, 0.75 rgba 0.4, 0.88 rgba 0.12, 1 transparent.
  - Fill a circular arc with the gradient.
  - Convert canvas to data URL.
  - Apply it as `webkitMaskImage` and `maskImage` on the reveal layer.
  - Set mask size to 100% 100%.
- This creates a soft cursor-following reveal window into the second image layer.

Reduced motion:
- `prefers-reduced-motion: reduce` disables splash-box, hero image, word reveal, CTA, and creator text animations.
- Reduced-motion state forces opacity visible, transform none, filter none, visibility visible.

Implementation behavior:
- Burger toggles `open` class on button and menu panel, updates aria-label.
- Clicking menu nav links closes menu.
- The page is mostly static DOM/CSS plus small JS for word reveal, burger menu, and canvas spotlight.
