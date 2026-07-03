Build a dark monochrome landing page called Mindloop, a newsletter/content platform. Use React + Vite + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion. Fonts: Inter sans and Instrument Serif for italic accent words. Entire theme is pure black (#000) background with white foreground: no colors or gradients beyond monochrome. Install hls.js and framer-motion.

Design System (index.css):
All CSS variables are HSL values without hsl() wrapper:
--background: 0 0% 0%
--foreground: 0 0% 100%
--card: 0 0% 5%
--card-foreground: 0 0% 100%
--primary: 0 0% 100%
--primary-foreground: 0 0% 0%
--secondary: 0 0% 12%
--secondary-foreground: 0 0% 85%
--muted: 0 0% 15%
--muted-foreground: 0 0% 65%
--accent: 170 15% 45%
--accent-foreground: 0 0% 100%
--border: 0 0% 20%
--input: 0 0% 18%
--ring: 0 0% 40%
--hero-subtitle: 210 17% 95%

Liquid Glass:
Global `.liquid-glass` uses rgba(255,255,255,0.01), luminosity blend, backdrop-filter blur(4px), no border, inset shadow, relative/overflow hidden, and masked ::before gradient border with alpha stops 0.45/0.15/0/0/0.15/0.45 and padding 1.4px.

Animation pattern:
All sections use reusable `fadeUp(delay)` helper:
initial opacity 0 y 20, whileInView opacity 1 y 0, viewport once margin -100px, transition duration 0.6 delay and easeOut.

Page Structure:

1. Navbar:
- Fixed transparent top nav, z-50, padding px-8 md:px-28 py-4.
- Left: concentric circles logo (outer w-7 h-7 border-2 border-foreground/60, inner w-3 h-3 border) + "Mindloop" bold.
- Center-left: nav links Home, How It Works, Philosophy, Use Cases separated by dot characters. Links text-muted-foreground hover:text-foreground.
- Right: Instagram, Linkedin, Twitter icons in liquid-glass circular buttons w-10 h-10.
- No background.

2. Hero Section:
- Full viewport height.
- Background MP4 video covers section:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4
- Bottom gradient h-64 from-background to transparent.
- Content centered z-10 pt-28 md:pt-32.
- Avatar row: 3 overlapping circular avatars + "7,000+ people already subscribed".
- Heading: "Get Inspired with Us", text-5xl md:text-7xl lg:text-8xl font-medium tracking -2px, with "Inspired" in font-serif italic.
- Subtitle: "Join our feed for meaningful updates, news around technology and a shared journey toward depth and direction." in hsl(var(--hero-subtitle)).
- Email form: liquid-glass rounded-full p-2 max-w-lg with email input and white "SUBSCRIBE" button with whileHover scale 1.03 and whileTap scale 0.98.

3. "Search has changed" Section:
- pt-52 md:pt-64, pb-6 md:pb-9.
- Heading: "Search has changed. Have you?" with "changed." in serif italic.
- Subtitle text-muted-foreground max-w-2xl mb-24.
- 3 platform cards: ChatGPT, Perplexity, Google AI. Each has local 200x200 icon image, platform name, description.
- Bottom tagline: "If you don't answer the questions, someone else will."

4. Mission Section:
- pt-0 pb-32 md:pb-44.
- Large centered 800x800 looping video:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4
- Scroll-driven word-by-word reveal using useScroll/useTransform.
- Paragraph 1: "We're building a space where curiosity meets clarity - where readers find depth, writers find reach, and every newsletter becomes a conversation worth having." Words curiosity, meets, clarity highlighted in foreground.
- Paragraph 2: "A platform where content, community, and insight flow together - with less noise, less friction, and more meaning for everyone involved."
- Each word opacity transitions 0.15 to 1 based on scroll progress.

5. Solution Section:
- py-32 md:py-44, border-t border-border/30.
- Label "SOLUTION" uppercase with tracking.
- Heading: "The platform for meaningful content" with "meaningful" serif italic.
- Video aspect 3/1 rounded-2xl:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4
- 4-column feature grid: Curated Feed, Writer Tools, Community, Distribution.

6. CTA Section:
- py-32 md:py-44, border-t border-border/30, overflow-hidden.
- Background video via HLS using hls.js:
https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8
- Use Hls.isSupported() with native HLS fallback for Safari.
- Overlay bg-background/45.
- Content centered: concentric logo, heading "Start Your Journey" in serif italic, subtitle, buttons "Subscribe Now" and "Start Writing" (liquid-glass).

7. Footer:
- py-12 px-8 md:px-28.
- Left: "© 2026 Mindloop. All rights reserved."
- Right: Privacy, Terms, Contact links.

Key dependencies:
framer-motion for animations, hls.js for CTA background video streaming, @fontsource/inter, @fontsource/instrument-serif, lucide-react, tailwindcss-animate plugin.

Assets needed:
avatar-1.png, avatar-2.png, avatar-3.png, icon-chatgpt.png, icon-perplexity.png, icon-google.png.
