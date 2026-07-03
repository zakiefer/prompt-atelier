Build a React + Vite + Tailwind CSS landing page for "Axion Studio" - a design agency site. Use the `shaders` package (npm: `shaders`) for the hero background, `lucide-react` for icons. The page has 3 sections. Match every detail exactly.

---

## SECTION 1: HERO (Full viewport height)

Background:
Light gray `#EFEFEF` with a full-screen animated shader overlay (positioned absolute, inset-0, z-10, pointer-events-none). The shader stack uses components from `shaders/react`:
- `Swirl` - colorA: `#ffffff`, colorB: `#f0f0f0`, detail: 1.7
- `ChromaFlow` - baseColor: `#ffffff`, downColor/leftColor/rightColor/upColor: `#ff5f03`, momentum: 13, radius: 3.5
- `FlutedGlass` - aberration: 0.61, angle: 31, frequency: 8, highlight: 0.12, highlightSoftness: 0, lightAngle: -90, refraction: 4, shape: "rounded", softness: 1, speed: 0.15
- `FilmGrain` - strength: 0.05

Navigation (z-20, relative):
A pill-shaped white navbar (`bg-white rounded-full`) with 5px padding, inside a max-w-[1440px] container with p-2 sm:p-3.

LEFT:
Dark circle logo (w-9 h-9 sm:w-10 sm:h-10, bg-gray-900, rounded-full) with white text "AX" (10px/11px, font-bold, tracking-tight). Next to it (hidden on mobile, shown md+): nav links "Projects", "Studio", "Journal", "Connect" - 14px, text-gray-900, hover:text-gray-500, transition-colors duration-300, gap-6.

RIGHT (hidden on mobile, shown md+):
- Text "Taking on projects for Q1 2026" (13px, text-gray-600, hidden below lg)
- Clock icon (lucide, size 14) + live London time "{HH:MM} in London" (13px, text-gray-600)
- CTA button: bg-gray-900, text-white, 13px font-medium, rounded-full, pl-5 pr-2 py-2. Text "Book a strategy call" with a HOVER TEXT ROLL animation: the text is duplicated inside a flex-col container with overflow-hidden h-[20px], on group-hover it translates -50% vertically (duration-500, ease cubic-bezier(0.25,0.1,0.25,1)). Arrow icon in a white circle (w-6 h-6) that rotates -45deg on hover.

MOBILE:
A "Menu"/"Close" toggle button (md:hidden), bg-gray-900, rounded-full, with Menu/X icons from lucide-react.

Mobile Menu Overlay:
Fixed inset-0, z-50. Black/60 backdrop. A white bottom sheet (rounded-2xl, mx-3 mb-3) that slides up (translate-y-full to translate-y-0, duration-500, ease cubic-bezier(0.32,0.72,0,1)). Contains: time badge, nav links (28px/32px font-medium), and a "Start a project" button with arrow.

Hero Content (z-20):
Positioned at the bottom of the viewport using flexbox (flex-1 spacer above). Max-w-[1440px], px-5 sm:px-8 lg:px-12, pb-14 sm:pb-16 lg:pb-20.
- Small label: "Axion Studio" (13px/14px, text-gray-900, tracking-wide, mb-5 sm:mb-8)
- Headline h1: "We craft digital experiences / for brands ready to dominate / their category online." - clamp(1.75rem,7vw,4.2rem) on mobile, clamp(2.5rem,5vw,4.2rem) on sm+. font-medium, leading-[1.08], tracking-[-0.03em], text-gray-900. Line breaks hidden on mobile.
- CTA row (mt-8 sm:mt-12, flex-col sm:flex-row, gap-4 sm:gap-5):
  - Orange button: bg-[#F26522], hover:bg-[#e05a1a], text-white, 13px/14px, rounded-full, pl-5 sm:pl-6 pr-2 py-2. Same text-roll hover animation for "Start a project". White circle with orange ArrowRight that rotates -45deg on hover.
  - Partner badge: White pill with subtle shadow and hover shadow, rounded-[4px]. Contains inline SVG starburst/compass icon, text "Certified Partner", and a dark badge "Featured".

---

## SECTION 2: ABOUT (White background)

`bg-white`, pt-16 sm:pt-20 lg:pt-32, pb-12 sm:pb-16 lg:pb-24, overflow-hidden. Max-w-[1440px] container.

Badge row: px-5 sm:px-8 lg:px-12, flex items-center gap-3, mb-6 sm:mb-8.
- Numbered circle: w-6 h-6 sm:w-7 sm:h-7, rounded-full, bg-gray-900, text-white, 11px/12px font-semibold. Shows "1".
- Pill label: "Introducing Axion" - 12px/13px, font-medium, border border-gray-200, rounded-full, px-3 sm:px-4 py-1 sm:py-1.5.

Heading h2:
"Strategy-led creatives, delivering / results in digital and beyond." - clamp(1.5rem,4vw,3.2rem), font-medium, leading-[1.12], tracking-[-0.02em], text-gray-900, mb-12 sm:mb-16 lg:mb-28.

Content area:
MOBILE/TABLET (lg:hidden): paragraph + orange button, then images.
DESKTOP (hidden lg:grid): `grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8`.
Small image URL: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85
Large image URL: https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85

---

## SECTION 3: CASE STUDIES (Light gray background)

`bg-[#F5F5F5]`, pt-16 sm:pt-20 lg:pt-28, pb-16 sm:pb-20 lg:pb-28. Max-w-[1440px] container.

Badge row: Same pattern as Section 2, number "2", label "Featured client work", border-gray-300.
Heading h2: "Our projects" - same clamp sizing as hero headline, font-medium, leading-[1.08], tracking-[-0.03em], mb-10 sm:mb-14 lg:mb-16.
Cards Grid: `grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7`, px-5 sm:px-8 lg:px-12.

Card 1 (Narrativ):
Video container: aspect-[329/246], rounded-2xl, overflow-hidden, bg-[#1a1d2e], group, cursor-pointer.
Video: `src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4"`, autoPlay, muted, loop, playsInline, w-full h-full object-cover.
Hover button: absolute bottom-4 left-4 white circle h-9 w-9 expands to w-[148px] on group-hover; contains "Learn more" and a link/chain SVG icon rotating -45deg to 0.
Description: "Winner of Site of the Month 2025 - an interactive 3D showcase driving record engagement"; Title: "Narrativ".

Card 2 (Luminar):
Video container: aspect-square, rounded-2xl, overflow-hidden, bg-[#6b6b6b], group, cursor-pointer.
Video: `src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4"`, autoPlay, muted, loop, playsInline, w-full h-full object-cover.
Hover button: DARK circle bg-gray-900 h-9 w-9 expands to w-[168px] on group-hover. Contains "View case study" and white ArrowRight icon rotating -45deg to 0.
Description: "Transforming a dated platform into a conversion-focused brand experience"; Title: "Luminar".

---

## GLOBAL STYLES (index.css)

Standard Tailwind directives plus two utility classes:
- `.liquid-glass`: rgba(255,255,255,0.01) bg, backdrop-filter blur(4px), inset box-shadow, pseudo-element gradient border using mask-composite.
- `.liquid-glass-strong`: Same but blur(50px), no pseudo-element.

---

## TECHNICAL DETAILS
- Framework: React 18 + TypeScript + Vite
- Styling: Tailwind CSS 3.4 (default config, no custom theme extensions)
- Packages: `shaders` (for Shader, ChromaFlow, FilmGrain, FlutedGlass, Swirl from `shaders/react`), `lucide-react` (ArrowRight, Clock, Menu, X)
- Font: System default (no custom font loaded)
- All animations use: `duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]` unless noted otherwise
- Max content width: 1440px, centered with mx-auto
- Responsive breakpoints: Default Tailwind
- Live clock: Updates every second, shows London timezone in HH:MM format
