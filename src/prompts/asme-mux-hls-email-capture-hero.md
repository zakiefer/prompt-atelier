Build a full-screen dark hero section landing page in React + Vite + Tailwind CSS v4 + Motion + Lucide React icons + hls.js. The page is a single 100vh screen with no scroll, a black background, a fullscreen HLS background video, a glassmorphism navbar, and a centered hero with an email capture CTA.

Dependencies:
- react, react-dom
- motion
- hls.js
- lucide-react
- tailwindcss v4 with @tailwindcss/vite
- @vitejs/plugin-react

Fonts:
- Import Inter weights 300, 400, 500, 600 as the base sans-serif font.
- Import Instrument Serif regular and italic for the hero heading.

CSS in `index.css`:
- Import both Google Font URLs, then `@import "tailwindcss";`.
- Set `@theme { --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif; }`.
- Root variables: `--background: #000000; --foreground: #ffffff;`.
- Body: background-color var(--background), color var(--foreground), font-family var(--font-sans), `-webkit-font-smoothing: antialiased`, letter-spacing -0.01em.
- `.liquid-glass`: background rgba(255,255,255,0.01), luminosity blend, backdrop-filter blur(4px), -webkit-backdrop-filter blur(4px), border none, inset white shadow, position relative, overflow hidden.
- `.liquid-glass::before`: absolute inset 0, border-radius inherit, padding 1.4px, gradient border from rgba(255,255,255,0.45) to transparent and back, rendered via mask compositing with `-webkit-mask-composite: xor` and `mask-composite: exclude`.
- `.glass-pill`: background rgba(255,255,255,0.04), backdrop-filter blur(16px) saturate(180%), border-radius 9999px, box-shadow none !important.

BackgroundVideo component:
- Wrapper: absolute inset-0 overflow-hidden pointer-events-none.
- Video: autoPlay, muted, loop, playsInline, classes `w-full h-full object-cover opacity-100`.
- HLS video URL: https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8
- This is a Mux HLS stream, not CloudFront.
- Use hls.js:
  - If `video.canPlayType("application/vnd.apple.mpegurl")`, set `video.src` directly for native HLS.
  - Otherwise instantiate `new Hls()`, call `loadSource`, then `attachMedia`.

Navbar component:
- Use `motion.nav` with `initial={{ y: -20, opacity: 0 }}` and `animate={{ y: 0, opacity: 1 }}`.
- Outer classes: `relative z-20 px-6 py-6 w-full`.
- Inner container: `liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto`.
- Left side: `flex items-center gap-8`.
- Logo: Globe icon from lucide-react, `w-6 h-6 text-white`, plus "Asme" in text-white font-semibold text-lg, wrapped in `flex items-center gap-2`.
- Desktop nav links: Features, Pricing, About. Hidden on mobile, `hidden md:flex items-center gap-8 text-white/80 text-sm font-medium`. Links use hover:text-white transition-colors duration-300.
- Right side: `flex items-center gap-4`.
- "Sign Up": plain text button, text-white hover:text-white/80 transition-colors text-sm font-medium cursor-pointer.
- "Login": liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer.

Hero component:
- Section: `relative flex-1 flex flex-col items-center justify-center px-6`.
- Content wrapper: `relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-12`.

Tagline:
- Use `motion.p`.
- Text: "BUILD A NO-CODE AI APP IN MINUTES".
- Classes: `text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4`.
- Animation: initial opacity 0 y 10, animate opacity 1 y 0, transition delay 0.1.

Heading:
- Use `motion.h1`.
- Text: "A new way to think and create with computers", with `<br className="hidden md:block" />` after "create".
- Inline style: `fontFamily: "'Instrument Serif', serif"`.
- Classes: `text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl`.
- Animation: initial opacity 0 y 20, animate opacity 1 y 0, transition duration 1 with ease [0.16, 1, 0.3, 1].

CTA area:
- Use `motion.div` with `min-h-[50px] mt-2`, transition delay 0.4.
- Use `AnimatePresence mode="wait"` to toggle between button state and email form state.
- Button state:
  - Text: "Get early access".
  - Classes: `px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer`.
  - On click, switches to email form.
- Email form state:
  - Form classes: `flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-sm w-full max-w-[320px] focus-within:border-white/40 transition-colors duration-300`.
  - Input: type email, transparent background, white text, placeholder-white/45, autoFocus.
  - Submit button shows ArrowRight icon by default and Check icon after submit.
  - Both CTA states animate from scale 0.95 to scale 1 over 0.2s.
- Typewriter placeholder:
  - When the email form opens, type "Enter Your Email Here For Early Access" one character at a time at 60ms intervals.
  - After submission, type "You Will Receive Notifications By Email".
  - After 4 seconds, reset back to the button state.

Demo link:
- Below the CTA, add a `motion.div` with delay 0.8 fade-in.
- Text: "Play Video Demo".
- Classes: `text-white/80 hover:text-white/40 transition-colors duration-300 text-[13px] font-medium tracking-wide`.

App root layout:
- `<main>` classes: `relative bg-black h-screen w-screen flex flex-col overflow-hidden selection:bg-white selection:text-black shrink-0`.
- Render order: BackgroundVideo, Navbar, Hero.
- Text selection uses white background with black text.

Key clarification:
- The video URL is not CloudFront. It is an HLS stream hosted on Mux.
- The `.m3u8` format requires hls.js fallback support for non-Safari browsers.
