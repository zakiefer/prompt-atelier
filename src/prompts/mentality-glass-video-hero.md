Build a modern React landing page using Vite, Tailwind CSS, and motion/react for elegant animations. The application must feature a polished hero section and a glassmorphic navigation bar.

Typography and global CSS:
- In `src/index.css`, import Inter and Outfit from Google Fonts.
- Set `--font-sans` to Inter and `--font-display` to Outfit.
- Set `--color-brand-green` to #9fff00 and `--color-bg-base` strictly to #EDEEF5.
- Body uses `@apply bg-bg-base text-zinc-900 font-sans antialiased;` so #EDEEF5 carries through the page.

App structure:
- `src/App.tsx` imports `Navbar` and `Hero`.
- Return a wrapper div with `<Navbar />` and `<main><Hero /></main>`.
- Wrapper classes: `min-h-screen bg-bg-base selection:bg-brand-green selection:text-black`.

Navbar component:
- File: `src/components/Navbar.tsx`.
- Fixed styling: `fixed top-0 left-0 w-full z-50 py-6 md:py-10 bg-gradient-to-b from-[#f1f1f1]/80 to-transparent backdrop-blur-[2px]`.
- Container: 12-column grid, `grid-cols-12 max-w-7xl mx-auto`.
- Left, columns 1-3: geometric flower/clover SVG icon fill #1a1a1a beside the brand name "mėntality" in display font.
- Center, columns 4-9: desktop-only nav links "service", "patient resources", "about us", "education center"; small lowercase styling.
- Right, columns 10-12: "find help" anchor, black rounded "get started ->" button, and an elegant animated hamburger toggle for mobile.
- Include AnimatePresence and a motion.div mobile drawer that slides down with the nav links.

Hero component:
- File: `src/components/Hero.tsx`.
- Main section classes: `relative min-h-[110vh] sm:min-h-[140vh] w-full flex flex-col items-center justify-start overflow-hidden bg-bg-base`.

Background video:
- Wrapper: `absolute top-[15vh] sm:top-[20vh] left-0 w-full h-[95vh] sm:h-[120vh] z-0 pointer-events-none`.
- Video: `<video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-100" />`.
- Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4
- Gradient mask above the video: `absolute top-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-b from-bg-base to-transparent` to blend into #EDEEF5.

Hero content alignment:
- Use `max-w-7xl w-full mx-auto px-8 md:px-16 lg:px-20 relative z-10 grid grid-cols-12 gap-x-4 md:gap-x-8`.
- Place text in `col-span-12 md:col-span-10 md:col-start-2`.

Hero header:
- Use `motion.h1` with slide-up fade:
```tsx
initial={{ opacity: 0, y: 15 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}
```
- Exact text treatment:
  - In #1a1a1a: "Remix: Mentality offers"
  - In #8e8e8e: "information"
  - Line break.
  - In #8e8e8e: "and resources to help you manage"
  - Line break.
  - In #8e8e8e: "your", then an inline eye pill, then "mental wellbeing."
- Eye icon element: inline pill `w-[16px] md:w-[42px] lg:w-[62px] border-[2px] border-[#1a1a1a] rounded-full inline-flex items-center justify-center` containing a tiny solid black dot `w-2 h-2`.

Search pill:
- Add delayed slide-up animation with delay 0.15 under the header.
- Capsule classes: `bg-white rounded-[6px] border border-black/[0.05] p-1 pl-4 flex items-center shadow-sm`.
- Include transparent input placeholder "Ask me anything..." so it looks integrated.
- Trailing action button: `bg-[#1a1a1a] text-white w-9 h-9 rounded-full relative`, containing an SVG chevron/arrow icon.

Architectural edge anchors:
- Absolute middle right edge: glassmorphic language switching pill, "pl - en".
- Absolute bottom-left corner: small neat "2024".
- Absolute bottom-right corner: small neat "mental health tools".

Layout constraint:
- Do not add artificial margins or padding below the video.
- The video should take exactly 100% of the hero viewport while #EDEEF5 anchors the whole page cleanly.
