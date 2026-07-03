Build a full-viewport cinematic hero section for a travel brand called "Wanderful" using React + TypeScript + Vite + Tailwind CSS. Use GSAP for animation and lucide-react for icons.

Fonts in `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');
```
- Also load Dirtyline:
```css
@font-face {
  font-family: 'Dirtyline';
  src: url('https://fonts.cdnfonts.com/s/15011/Dirtyline36DaysofType.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```
- Body font: Barlow.
- Hero headings: Inter.
- Body background: #000.

Video background:
- Fixed full-screen z-0 video background.
- Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260510_060007_60275ce7-030c-4668-a160-8f364ec537d3.mp4
- Video attributes: autoPlay, muted, loop, playsInline, object-cover.
- Wrapper: scale-[1.08] with origin-center.
- On `onLoadedMetadata`, set `playbackRate = 1.25`.
- Add GSAP mouse parallax:
  - Listen to mousemove.
  - Compute `targetX/Y = ((clientX - cx) / cx) * 20`.
  - Lerp `currentX/Y += (target - current) * 0.06` inside requestAnimationFrame.
  - Apply using `gsap.set(videoBg, { x, y })`.

Liquid glass utility:
```css
.liquid-glass {
  background: rgba(255,255,255,0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

Header:
- Fixed top, z-50, px-10 py-8, flex justify-between items-center.
- Left wordmark: `Wanderful` followed by `<sup>TM</sup>`, text-[17px] font-semibold tracking-tight.
- Center nav: `.liquid-glass rounded-full px-2 py-2 flex items-center gap-1`.
- Nav links: JOURNEY, BENEFITS, JOURNAL, GUIDEBOOK.
- Each link: text-[11px] font-medium tracking-[0.12em] text-white/90 hover:text-white px-4 py-1.5 rounded-full transition-colors duration-200.
- Right CTA: "GET ROAMING", `.liquid-glass rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-white/90 hover:text-white`.

Hero headline:
- Fixed at top 120px, centered, z-20.
- Two centered lines, Inter 400.
- Font size: `clamp(40px, 5.4vw, 72px)`.
- Line-height: 1.1.
- Letter-spacing: -0.02em.
- Line 1 in white: "Venture without edges."
- Line 2 in rgba(255,255,255,0.55): "Uncover with keen instinct."
- Fade in on mount: opacity 0 to 100 and translate-y-6 to 0, transition-all duration-1000.

Bottom block:
- Fixed bottom-14, z-20, flex column, items-center, gap-6.
- Fade in with delay-300.
- Paragraph: max-w-[620px], text-[15px], leading-relaxed, centered.
- White text segment: "Our smart itineraries shape around you - your rhythm, your vibe, your hunger for adventure."
- Muted segment text-white/55: " Each getaway is tailored, seamless, and wholly yours."
- Button: white background, black text, text-[15px] font-medium rounded-full px-8 py-3.5, hover scale-[1.03] plus shadow-[0_0_32px_4px_rgba(255,255,255,0.2)], active scale-[0.97].
- Button label: "Plan my escape today".
- Security row: Lock icon from lucide-react, size 13, strokeWidth 1.5, plus text-[11px] font-medium tracking-[0.14em] text-white/70.
- Security text: "SECURE BY DESIGN. ZERO DATA LEAKS."

Root container:
- `min-h-screen bg-black text-white overflow-x-hidden`.
- Inline font family: `'Inter', sans-serif`.

Dependencies:
- gsap, lucide-react, react, react-dom.
- Tailwind content globs: `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`.
