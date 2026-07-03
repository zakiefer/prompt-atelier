Build a full-screen hero section for a fictional vinyl record label called "quietpress" using React, TypeScript, Tailwind CSS, and Vite. The page is a single viewport-height hero with no scrolling. Use lucide-react for icons and no other UI libraries.

Font:
- Load Helvetica Regular in index.html:
  https://db.onlinewebfonts.com/c/a64ff11d2c24584c767f6257e880dc65?family=Helvetica+Regular
- CSS base font: `html { font-family: 'Helvetica Regular', Helvetica, Arial, sans-serif; }`.

Background boomerang video:
- Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260611_183632_c311af08-e4b7-458f-81e7-79847a49b3d3.mp4
- Create `BoomerangVideoBg`:
  1. Plays video once, muted, playsInline, crossOrigin anonymous.
  2. Captures every frame into off-screen canvases, max width 960px, scaled proportionally.
  3. Uses requestVideoFrameCallback when available, requestAnimationFrame fallback.
  4. On video end, hides video and renders canvas playback in ping-pong loop at 30fps.
  5. Container: absolute inset-0 z-0 scale-[1.08] origin-center overflow-hidden.

Liquid glass CSS:
- `.liquid-glass`: rgba(255,255,255,0.01), luminosity blend, blur(4px), inset white shadow, no border, position relative, overflow hidden.
- `::before`: masked gradient stroke, padding 1.4px, pointer-events none.

Fade-up animation:
```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}
.animate-fade-up {
  animation: fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.25s; }
.delay-3 { animation-delay: 0.4s; }
.delay-4 { animation-delay: 0.55s; }
.delay-5 { animation-delay: 0.75s; }
@media (prefers-reduced-motion: reduce) {
  .animate-fade-up { animation: none; }
}
```
- Critical: use animation-fill-mode backwards, not both or forwards. Leaving transform on a parent after animation breaks backdrop-filter for child liquid glass.

Header:
- Absolute top, z-20.
- Logo left: custom SVG quarter-circle with centered dot, white fill, 20x20, plus "quietpress" text.
- Logo path:
```svg
M 256 256 L 128 256 C 198.692 256 256 198.692 256 128 C 256 57.308 198.692 0 128 0 C 57.308 0 0 57.308 0 128 C 0 198.692 57.308 256 128 256 L 0 256 L 0 0 L 256 0 Z M 128 104 C 141.255 104 152 114.745 152 128 C 152 141.255 141.255 152 128 152 C 114.745 152 104 141.255 104 128 C 104 114.745 114.745 104 128 104 Z
```
- Nav links hidden on mobile: Anthology, Talents, Sound diary, Playback salon; text-sm text-white/90 hover:text-white, gap-8.
- Cart button: white rounded-xl pill p-1 pr-3 sm:pr-4, blue-700 icon square h-7 w-7 rounded-lg with ShoppingCart icon, text Cart (0), hover scale 105 active scale 95.
- Mobile menu toggle: liquid-glass h-9 w-9 rounded-xl, Menu/X icon, hidden md+.
- Mobile dropdown: liquid-glass mx-4 rounded-2xl p-2, links rounded-xl px-4 py-3 text-sm text-white/90 hover:bg-white/10.

Hero content:
- Centered z-10, padding pt-28 sm:pt-36 md:pt-44 px-4 sm:px-6.
- Tag badge delay-1: liquid-glass rounded-lg px-4 py-1.5 text-xs sm:text-sm text-white, inline style background rgba(255,255,255,0.16), text "Press 04 . Vernal woods", mb-5 sm:mb-6.
- Headline delay-2: max-w-3xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white.
- Headline:
```text
records cut for the
calm listener.
```
- Subtext delay-3: mt-5 sm:mt-6 max-w-md text-sm sm:text-base md:text-lg leading-relaxed text-white/90.
- Subtext: "Drone, roots, and nature-captured sound on wax LPs. Every disc cut just once, snag it or miss."
- Buttons delay-4, mt-8, stack on mobile row on sm:
  - Primary "Browse the shelves", rounded-xl bg-white px-7 py-2.5 text-sm text-gray-900 hover scale.
  - Secondary "Newest arrivals", liquid-glass rounded-xl px-7 py-2.5 text-sm text-white hover scale.

Now Playing widget:
- Absolute bottom-right z-20, bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-10.
- Max width 270px mobile, w-72 sm+, animate-fade-up delay-5.
- Track card: rounded-2xl bg-white p-2.5 pr-4 shadow-lg.
- Blue icon square h-11 w-11 rounded-xl bg-blue-700 with BarChart3 icon.
- Track text: "Helia Marsh -- Fern Light", truncated, text-sm text-gray-900.
- Progress bar: h-1 rounded-full bg-gray-200, fill w-[30%] bg-blue-700.
- Times: 0:33 and -1:21, text-[10px] text-gray-500.
- Controls row: Prev and Next flex-1 rounded-2xl bg-white py-2 text-sm text-gray-900 shadow-lg hover scale.
- Heart button: h-10 w-10 rounded-full bg-white shadow-lg hover scale, Heart icon text-blue-700, filled when liked and toggles on click.

Technical notes:
- Outer wrapper: relative h-screen w-full overflow-hidden.
- All interactive elements use transition-transform duration-200.
- Accent color is Tailwind blue-700.
- No backend needed.
