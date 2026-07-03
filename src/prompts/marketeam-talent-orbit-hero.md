Create a single-page React + Vite landing page for "Marketeam", a marketing talent platform. Use Inter for UI/body text and Urbanist for the main display typography. The page is a full-viewport hero with a header, typewriter marketing message, animated CTA borders, a right-side concentric orbit talent visualization, and a bottom partner-logo ticker.

Fonts:
- Inter from Google Fonts, weights 400, 500, 600, 700.
- Urbanist from Google Fonts, weights 600 and 700.

Background:
- Apply a full-page background image to the root `.app` container.
- Use `background: url(...) center center / cover no-repeat`.
- Image URL: `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_111401_56af5012-2263-45d3-849a-8688084d7c2a.png&w=1280&q=85`
- Body fallback background: `#0a0a0a`.

Header:
- Flex row with `justify-content: space-between`.
- Padding: `24px 64px`.
- Max-width: 1920px.
- Centered horizontally.

Header left:
- Logo image plus nav links.
- Logo image height: 32px.
- Logo URL: `https://polo-pecan-73837341.figma.site/_assets/v11/17ae538989a509947a8de3892c644664895e69b1.png`
- Nav links: "Your Team", "Solutions", "Blog", "Pricing".
- Link style: black `#000000`, 15px, font-weight 400.
- Hover underline animation: pseudo-element scales from `scaleX(0)` to `scaleX(1)`, transform-origin left, 0.3s ease.

Header right:
- "Log In" link and "Join Now" button.
- Log In: white `#ffffff`, 15px, font-weight 500, same underline hover treatment.
- Join Now: pill button, border-radius 50px, black background `#000000`, white text, padding `12px 26px`, 15px, font-weight 500.
- Join Now hover: a `#A068FF` fill slides in from the left using `::after`, from `translateX(-100%)` to `translateX(0)`, duration 0.4s, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Button uses `overflow: hidden`.
- Wrap the button in `.btn-border-wrap`.
- `.btn-border-wrap::before` creates a rotating conic-gradient border with `inset: -3px`, `padding: 3px`, and mask-composited border-only rendering.
- Gradient: `conic-gradient(from var(--border-angle), #A068FF, #070319, #A068FF, #070319, #A068FF)`.
- Register `@property --border-angle`.
- Animate `--border-angle` from `0deg` to `360deg` in 3s linear infinite.

Hero layout:
- Left column: `flex: 0 1 600px`, padding-top 40px.
- Right column: animated circles visualization, 720px by 720px, centered.
- Use a full-viewport composition.

Hero heading:
- Component: `TypewriterHeading`.
- Text: "Unlock Top Marketing Talent You Thought Was Out of Reach -- Now Just One Click Away!"
- Font: Urbanist.
- Size: 64px.
- Weight: 600.
- Line-height: 64px.
- Letter-spacing: -1.5px.
- First 67 characters are black `#000000`.
- Remaining characters are white `#ffffff`.
- Typing speed: 35ms per character.
- Start after a 400ms delay.
- Show a blinking purple cursor `#A068FF` while typing.

Primary CTA:
- Text: "Start Project".
- Same pill style as Join Now, but larger.
- Padding: `14px 28px`.
- Font size: 16px.
- Background: `#060218`.
- Include a right-arrow chevron SVG icon, 18x18.
- Hover fill slides from the right, from `translateX(100%)` to `translateX(0)`.
- Wrap in `.btn-border-wrap` using the same animated conic border.
- Appears after the heading finishes typing, animation-delay 3.2s.

Hero cursor label:
- Purple pointer cursor SVG filled `#A068FF`.
- Label: "David".
- Label is a pill badge with background `#A068FF`, white text, 16px, font-weight 500, padding `8px 16px`, border-radius 20px.
- Position by using `margin-left: 290px` and `margin-top: 40px`.
- Appears with animation-delay 3.6s.

Right-side circles visualization:
- Container is 720x720px.
- Four concentric circles, each with a 1px gradient border via mask technique.
- Border gradient: `linear-gradient(180deg, rgba(217, 161, 255, 0) 0%, rgba(217, 161, 255, 1) 43%, rgba(217, 161, 255, 0) 100%)`.
- Orbit 1, innermost: 353px diameter, rotates counterclockwise over 30s.
- Orbit 2: 501px diameter, rotates clockwise over 40s.
- Orbit 3: 649px diameter, rotates clockwise over 50s.
- Orbit 4, outermost: 797px diameter, rotates counterclockwise over 60s.

Center circle:
- Lives on orbit 1.
- Displays animated count-up number "20k+" using Urbanist, 64px, weight 500.
- Label: "Specialists", Urbanist, 16px, weight 600.
- Counter-rotate inner content so the text stays upright.
- Implement a custom `useCountUp` hook that animates 0 to 20 over 2s using easeOutCubic, starting after 1.2s.

Avatar placement:
- Place avatars on orbits using:
```css
transform: translate(-50%, -50%) rotate(var(--angle)) translate(var(--radius)) rotate(calc(var(--angle) * -1));
```
- Each avatar has a staggered fly-in animation from scale 0.3, rotate -180deg, blurred, to normal.
- Delays run from 0.6s to 2.3s.

Avatar assets:
- Orbit 1, 270deg, radius 177px, square border-radius 20px, purple glow:
  `https://polo-pecan-73837341.figma.site/_assets/v11/aa51718fb3af3637e6d666b6543fc27a175fada6.png`
- Orbit 2, 60deg, radius 251px, round, yellow glow:
  `https://polo-pecan-73837341.figma.site/_assets/v11/ca755f7f93c1126fb8bdbf99ab364a33aa9ab272.png`
- Orbit 2, 180deg, radius 251px, 78px, pink glow:
  `https://polo-pecan-73837341.figma.site/_assets/v11/dc01064c7093dcc32674876ee3cf5e41c4a485c6.png`
- Orbit 2, 300deg, radius 251px, square border-radius 20px, blue glow:
  `https://polo-pecan-73837341.figma.site/_assets/v11/d5470a58b02388336141575048720f19a50de832.png`
- Orbit 3, 130deg, radius 325px, 88px, pink glow:
  `https://polo-pecan-73837341.figma.site/_assets/v11/018736aa5d0275c4ce56cfebaf2ae3007d81ca1e.png`
- Orbit 4, 30deg, radius 399px, purple glow:
  `https://polo-pecan-73837341.figma.site/_assets/v11/c76d8a0b99676de31c014344bfaf75bad090758d.png`
- Orbit 4, 95deg, radius 399px, 88px, square border-radius 24px, orange glow:
  `https://polo-pecan-73837341.figma.site/_assets/v11/7b1b5f039de7b54cc9913e96c1923c3b15a157fa.png`
- Orbit 4, 220deg, radius 399px, 88px, square border-radius 24px, pink glow:
  `https://polo-pecan-73837341.figma.site/_assets/v11/9ae171d8895199349755c43fbff00e122221a027.png`
- Orbit 4, 320deg, radius 399px, purple glow:
  `https://polo-pecan-73837341.figma.site/_assets/v11/926c9eb7b4bc1df846fa0e39f0b0dc3fefd80671.png`

Logo ticker:
- Bottom horizontal infinitely scrolling strip of partner logos.
- Gap: 64px.
- Animation duration: 20s.
- Add fade masks on the left and right edges using a linear-gradient mask.
- Use five unique SVG logos repeated four times for a seamless loop.
- Logo URLs:
  - `https://polo-pecan-73837341.figma.site/_assets/v11/1e7b0e6fcc016cd28aec5c68990118b8c54c35a5.svg`
  - `https://polo-pecan-73837341.figma.site/_assets/v11/3eac03c183db2ae080d910159211c14843398b61.svg`
  - `https://polo-pecan-73837341.figma.site/_assets/v11/17705a4c0023a0e5a99154dfb10582adbbf4260b.svg`
  - `https://polo-pecan-73837341.figma.site/_assets/v11/0e5f442b09dc5c248e3e60d40a65505fb1887228.svg`
  - `https://polo-pecan-73837341.figma.site/_assets/v11/63f99030ceb459e3c9ab9e429cfa2353491d3816.svg`
- Each logo: width 137px, height 40px, object-fit contain.

Entrance animations:
- Header: fade down from translateY -20px to 0 over 0.8s.
- Hero left: fade up from translateY 40px to 0 over 1s.
- Hero right circles: scale in from 0.85 to 1 with opacity over 1.2s, delay 0.3s.
- Logos section: fade up, delay 0.6s.
- All use easing `cubic-bezier(0.22, 1, 0.36, 1)`.

Responsive breakpoints:
- 1280px: circles scale to 0.85.
- 1024px: stack layout as column, heading 48px, circles scale 0.7, nav gap shrinks.
- 768px: hide nav, heading 36px, circles scale 0.5.
- 480px: heading 28px, circles scale 0.4, smaller buttons and logos.

Key colors:
- Primary accent: `#A068FF`.
- Background dark: `#060218` and `#070319`.
- Text dark: `#000000`.
- Text light: `#ffffff`.
- Body fallback: `#0a0a0a`.

Technical details:
- Use React `useState`, `useEffect`, and `useRef`.
- `TypewriterHeading` types character by character at configurable speed.
- `useCountUp` animates the center stat.
- No external animation libraries; use pure CSS animations plus JavaScript for the typewriter and counter.
