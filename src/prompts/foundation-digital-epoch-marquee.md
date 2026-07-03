Build a modern, high-performance landing page section using React, TypeScript, Tailwind CSS v4, and Motion. Match these exact specifications.

Dependencies & setup:
Install lucide-react, motion, clsx, and tailwind-merge.
In index.css, import Inter and Outfit:
`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600&display=swap');`
Configure Tailwind CSS v4 theme so `--font-sans` is Inter and `--font-display` is Outfit.
Global body background: #f9fafb.

Main Hero Container & Video Background:
Create hero section container with exact classes:
`relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col`.
Inside add absolute underlying layer:
`absolute inset-0 pointer-events-none z-0 overflow-hidden select-none`.
Video URL:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4
Video attributes: autoPlay loop muted playsInline.
Video classes: `w-full h-full object-cover scale-105 transition-transform duration-1000`.
No overlays.

Hero Text Content:
Content wrapper: `relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start`.
Use `motion.div` to fade in and slide up slightly.
Headline: `Foundation of the<br />new digital epoch`, font-display, text-[42px] md:text-[56px], medium, tight tracking, color #0a1b33.
Subheadline: `Designing products, powering ecosystems and laying the foundation of a decentralized web for enterprises, builders and communities alike.`, font-sans, text-[14px] md:text-[15px], color #64748b.
Contact button: "Contact Us", dark bg #0a152d, white text, rounded-full, hover scale via motion.button.

Floating Bottom Navbar:
Wrapper: `absolute bottom-10 left-1/2 -translate-x-1/2 z-30`.
`motion.nav` fades in and slides up after text.
Nav classes:
`flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40`.
Elements:
- Logo placeholder: circle w-9 h-9 bg-white border-slate-100 shadow-sm containing star `✦`.
- Text buttons "Products" and "Docs": text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33].
- "Get in touch" button with ChevronRight from lucide-react. Styling matches marquee cards: bg-white px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all.

Seamless Marquee Logo Scroller:
Below hero, mt-10. No title or description above.
Uses pure CSS @keyframes from transform translateX(0) to translateX(-50%) for infinite scrolling, pausing on hover.
Scroller has left/right mask gradient with `maskImage: linear-gradient(...)` fading to transparent at edges.
Render the logo list twice inline for seamless loop.

Logos list:
8 objects with svgl.app src URLs, alt names, and gradient hex objects:
- Procure (procure.svg, blue gradient)
- Shopify (shopify.svg, yellow gradient)
- Blender (blender.svg, blue gradient)
- Figma (figma.svg, purple gradient)
- Spotify (spotify.svg, pink/red gradient)
- Lottielab (lottielab.svg, yellow/green)
- Google Cloud (google-cloud.svg, light blue)
- Bing (bing.svg, cyan/teal)

Card Design:
Each logo card exactly matches the "Get in touch" navbar button styling.
Container classes:
`group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden`.
Inside each card, add an absolute div using the specific gradient colors, scaled to 1.5 and opacity 0, transitioning to scale 1 and opacity 100 on group-hover.
Image should invert/turn black on hover using `group-hover:brightness-0 group-hover:invert`.
