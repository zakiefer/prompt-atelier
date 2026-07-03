Build a Hero section for a DeFi dashboard named RIVR showcasing a sleek, glassmorphism aesthetic. Use lucide-react for icons and motion imported from `motion/react` for animations.

Global Styles (`src/index.css`):
Import custom "Helvetica Regular" font via onlinewebfonts and set Tailwind theme:

```css
@import "tailwindcss";
@font-face {
  font-family: "Helvetica Regular";
  src: url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.eot");
  src: url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.eot?#iefix")format("embedded-opentype"),
  url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.woff2")format("woff2"),
  url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.woff")format("woff"),
  url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.ttf")format("truetype"),
  url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.svg#Helvetica Regular")format("svg");
}
@theme { --font-helvetica: "Helvetica Regular", ui-sans-serif, system-ui, sans-serif; }
:root { font-family: var(--font-helvetica); }
body { margin: 0; overflow-x: hidden; background-color: #f0f0f0; }
```

App Structure:
`src/App.tsx` returns `<main className="min-h-screen bg-[#f0f0f0]"><Hero /></main>`.

Hero Component:
Outer wrapper: `<div className="w-full h-screen flex items-center justify-center p-3 md:p-5 bg-[#f0f0f0]">`.
Inner container: `<section className="relative w-full max-w-[1536px] h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-none flex flex-col items-center bg-white/10 group">`.

Video Background:
`<video autoPlay muted loop playsInline>` with classes `absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0`.
Source URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4

Content Layer:
`<div className="relative z-10 w-full h-full flex flex-col items-center">` containing Navbar, text container, BottomLeftCard, BottomRightCorner.

Text Container:
`w-full flex flex-col items-center pt-8 px-6 text-center max-w-4xl`.
- HeroBadge
- motion.h1: `text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-normal text-[#5E6470] mb-2 tracking-tight leading-[1.05]`. Text "Fluid Asset Streams". Animation opacity 0 scale 0.98 to opacity 1 scale 1, duration 0.8 delay 0.2.
- motion.p: `text-sm sm:text-base md:text-lg text-[#5E6470] opacity-80 leading-relaxed max-w-xl font-normal`. Text "Access Smart Vaults, stake RIVR, NFTs, transform rigid holdings into liquid cash instantly." Animation opacity fade duration 0.8 delay 0.4.

Navbar:
Wrapper `flex items-center justify-between py-6 px-6 md:px-10 w-full relative z-10`.
- Left spacer hidden md:block.
- Center menu hidden md:flex, gap-8, text rgb(45,45,45), text-sm. Items: Ecosystem, Economics (hasDropdown), Developers, Governance (hasDropdown). Dropdown items append ChevronRight icon that moves on hover.
- Mobile logo: RIVR text.
- Right button: motion.button with hover/tap scale, bg rgba(30,50,90,0.8), rounded-full, icon wrapper with ArrowUpRight, text "Book Demo".

HeroBadge:
motion.div opacity/y entrance. Classes `flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/20 mx-auto mb-3 w-fit`.
Sparkles icon and text "Fluid Staking".

BottomLeftCard:
Absolute card at bottom/right on mobile, bottom/left on md+. Glass bg-white/30 backdrop-blur-xl, responsive rounded corners and padding. Motion x -20 opacity 0 to visible.
Top: "5.2K" and "Active Yielders".
Button: "Join Discord" with ArrowUpRight inside pale circle.

BottomRightCorner:
Complex faux-cutout layout. Absolute bottom-0 right-0 with bg-[#f0f0f0], rounded top-left responsive. Motion y 20 opacity 0 to visible.
Critical corner masks:
- Top intersection mask SVG path `M56 56V0C56 30.9279 30.9279 56 0 56H56Z` filled #f0f0f0.
- Left intersection mask SVG path `M56 56H0C30.9279 56 56 30.9279 56 0V56Z` filled #f0f0f0.
Content: circular ArrowUpRight icon, title "Documentation", and "Library" row with ChevronRight.
