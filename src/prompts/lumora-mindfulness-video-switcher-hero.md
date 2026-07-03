Create a fullscreen cinematic hero section for a mindfulness/focus app called "Lumora" using React, Tailwind CSS, and Lucide React icons. The entire app lives in one `App.tsx` component with CSS in `index.css`.

Font:
- Use Instrument Serif from Google Fonts, including italic for the logo.
- Load in `index.html` with preconnect links and:
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
```
- Set `font-family: 'Instrument Serif', serif` on html/body.
- Use `system-ui, sans-serif` inline for body text such as subtext, buttons, stats, and video labels.

Section container:
```html
<section className="relative w-full h-screen overflow-hidden bg-black">
```
- Black background prevents video-load flash.
- Everything is a single viewport-height section with no scroll.

Background video layer:
- Stack four fullscreen looping videos absolutely.
- Every video has `autoPlay`, `muted`, `loop`, and `playsInline`.
- Only the active video has `opacity-100`; inactive videos use `opacity-0`.
- Crossfade opacity over 1000ms with ease-in-out.
- Video URLs, in order:
  1. `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4`
  2. `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4`
  3. `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4`
  4. `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4`
- Labels: "Golden Hour", "Still Water", "Deep Woods", "Quiet Dawn".

Transparent PNG overlay:
- Place this image above the videos at z-index 1, covering the whole viewport:
  `https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png`
- Apply a continuous `train-bob` animation.
- The image oscillates translateY from 0 to -6px over 3s ease-in-out infinite.
- Keep a constant `scale(1.03)` to prevent edge gaps while it moves.

Liquid glass utility:
```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

Content layer:
- z-index 2.
- Full-height flex column.

Navigation:
- Top nav.
- Left: "Lumora" in white, italic, `text-xl sm:text-2xl`.
- Desktop right at md and up: `.liquid-glass` pill containing nav links and a solid white button.
- Nav links: "How It Works", "Features", "Pricing", "Community".
- Link style: white/90, text-sm, hover to white.
- End button: solid white "Get Started".
- Mobile right: `.liquid-glass` rounded hamburger button with Lucide `Menu` and `X`.
- Hamburger icon animation: 300ms crossfade rotation. Menu rotates out 90deg and scales to 75%; X rotates in from -90deg.

Mobile menu overlay:
- Fixed z-50.
- Backdrop: `bg-black/60 backdrop-blur-sm`.
- Centered fullscreen panel.
- Links stagger in with 50ms increments: 100ms, 150ms, 200ms, 250ms, 300ms.
- Links are white, text-3xl, translate-y-4 to 0 when opened.
- Include a "Get Started" button at the bottom with scale animation.
- Easing: `cubic-bezier(0.4,0,0.2,1)`.
- Duration: 500ms.

Hero content:
- Centered below nav.
- Badge: `.liquid-glass` rounded-full pill with text "Over 10,000 minds already finding their clarity".
- Heading:
  - Text line 1: "Clarity in an Endlessly"
  - Text line 2: "Noisy Universe"
  - Break after "Endlessly".
  - Sizes: `text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem]`.
  - `leading-[1.1]`, `max-w-4xl`.
- Subtext:
  - "Rise above the chaos of pings, infinite scrolling, and relentless demands. Discover how to protect your presence and create with intention."
  - `max-w-xl`, relaxed leading.
- Email input:
  - `.liquid-glass` rounded-full pill.
  - Contains a text input with placeholder "Your Best Email".
  - Contains a solid white "Get Early Access" button.
  - Max-width 320px on mobile, `sm:max-w-sm`.
- Video switcher:
  - Row of four text buttons matching the video labels.
  - Active button has solid color plus bottom border.
  - Inactive buttons have 50% opacity, transparent border, and hover to 80%.

Dark mode for Deep Woods:
- When the third video is active, index 2, all hero content transitions to dark color `#182C41`.
- Affected content: badge, heading, subtext, input, and video switcher.
- Transition duration: 700ms.
- Navbar and bottom stats always remain white.

Bottom stats:
- Pushed to bottom with a flex-1 spacer.
- Row of stats separated by `|` dividers, hidden on mobile.
- Stats:
  - "60+ Deep Sessions"
  - "12,000+ Creators"
  - "4.8 User Satisfaction"
  - "Intentional-First Design"
- Text style: white/70, text-xs to sm, system-ui font.

Video switching logic:
- Track `activeVideo` state, default 0.
- Track `isTransitioning` boolean.
- On click, ignore if clicked video is already active or a transition is in progress.
- Otherwise set the new active video and start a 1000ms cooldown matching the CSS crossfade duration.
- During cooldown, ignore additional clicks.

Responsive behavior:
- Mobile: smaller text, tighter padding, hamburger nav, stats wrap naturally.
- Tablet/desktop: larger heading, more padding, inline nav pill, stats with pipe separators.
