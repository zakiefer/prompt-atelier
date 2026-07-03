Create a fullscreen hero section for a SaaS product called "flowpath" using React, Tailwind CSS, and Lucide React icons. The section is a single viewport-filling `<section>` with glass dropdown navigation and top-aligned hero copy.

Section:
- `h-screen w-full overflow-hidden`.

Background:
- Full-section looping muted autoplaying video.
- Video covers with `object-cover`.
- Video URL: `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4`
- Add subtle dark overlay over the video: `bg-black/10`.

Font:
- Use "Helvetica Now Text" as the primary font.
- Load from: `https://db.onlinewebfonts.com/c/08e020de1811ec4489f82d1247a42c09?family=Helvetica+Now+Text`
- Fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- Apply globally with `* { font-family: ... }`.

Navigation:
- Top nav is not fixed or sticky.
- Full-width with responsive horizontal padding: `px-5 sm:px-6 md:px-12 lg:px-16`.
- Vertical padding: `py-4 sm:py-5`.
- Logo:
  - Inline SVG diamond, 28x28.
  - Two overlapping diamond paths at 0.9 and 0.5 opacity.
  - Text "flowpath" in white, `text-lg sm:text-xl font-medium tracking-tight`.
- Desktop nav hidden on mobile:
  - "Product" with dropdown items "Connections", "Workflows", "Insights".
  - "Solutions" with dropdown items "Guides", "Use cases", "API reference".
  - "About" with dropdown items "Our story", "Open roles", "Reach us".
  - "Plans" with no dropdown.
- Nav buttons:
  - `text-white/90 hover:text-white text-sm font-medium`.
  - Dropdown buttons include `ChevronDown`, size 3.5x3.5.
  - Chevron rotates 180 degrees while dropdown is open.
- Dropdowns:
  - Open on hover via onMouseEnter/onMouseLeave.
  - Position: `absolute top-full left-0`.
  - Use `.liquid-glass`.
  - `rounded-xl py-3 px-2 min-w-[160px] shadow-xl`.
  - Add `.animate-dropdown`.
  - Items: `text-white/80 hover:text-white text-sm rounded-lg hover:bg-white/5`.
  - Dropdown elements need `!absolute` to override `position: relative` from `.liquid-glass`.
- Desktop CTA:
  - "Log in" link, text-white/90 hover:text-white, text-sm font-medium.
  - "Try it free" button, `.liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium`.

Mobile navigation:
- Mobile menu button toggles between Lucide `Menu` and `X`.
- Use rotation, scale, and opacity transitions, duration 300ms.
- Mobile menu:
  - Absolutely positioned below nav.
  - Slides in with easing `cubic-bezier(0.16,1,0.3,1)` over 400ms.
  - Background: `bg-[#2C221C]/95 backdrop-blur-xl`.
  - Rounded-2xl, p-6.
  - Shows all nav items and indented sub-items.
  - Footer has a border and includes "Log in" and "Try it free".

Hero content:
- Below nav, top-aligned rather than vertically centered.
- Container: `flex-1 flex items-start justify-center`.
- Top spacing: `pt-16 sm:pt-20 md:pt-24`.
- Text wrapper: `text-center max-w-3xl`.
- Heading:
  - `text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-[-0.02em]`.
  - Content:
```text
Bridge the
gaps. Ditch the
grindwork.
```
  - The phrases "Ditch the" and "grindwork." use `text-white/60`.
- Subheading:
  - `text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto mt-6 sm:mt-8`.
  - Text: "Flowpath unifies your complete wellness tools, so your crew spends less energy plugging gaps and more on real progress."
- CTA row:
  - `flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8`.
  - Button 1: "Begin your journey", solid white, `px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-white/90`.
  - Button 2: "See it live", glass button, `px-5 sm:px-6 py-2.5 sm:py-3 liquid-glass rounded-full text-white text-sm font-semibold hover:bg-white/10`.

Liquid glass CSS:
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

Additional utilities:
```css
@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(-4px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.animate-dropdown {
  animation: dropdown-in 0.2s ease-out;
}

.duration-400 {
  transition-duration: 400ms;
}
```

Important notes:
- Tailwind config stays default with no extensions.
- No external UI libraries beyond lucide-react.
- Fully responsive across sm, md, lg, xl.
