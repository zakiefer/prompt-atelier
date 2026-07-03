Create a fullscreen hero landing page for a creative studio called "Foldcraft" using React, Tailwind CSS, and Lucide React icons. The page is a single viewport-height section with a looping background video, responsive navbar, mobile menu, and staggered animated hero text.

Video background:
- URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4
- Attributes: autoPlay, muted, loop, playsInline.
- Styling: absolute positioned, full width and height, object-cover.
- Object position: 70% horizontal center.
- The video sits behind all content, with no explicit z-index needed.

Font:
- Google Fonts: Geist weights 300-700, loaded via link in index.html.
- Tailwind config extends fontFamily with `geist: ['Geist', 'sans-serif']`.
- Apply `font-geist` on the root container.
- Body CSS includes `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`.

Root container:
- `relative h-screen w-full overflow-hidden bg-black font-geist`.

Navbar:
- z-30.
- Flex, justify-between, padding `px-6 py-5 md:px-12 lg:px-16`.
- Left side: logo text "Foldcraft", `text-lg font-semibold tracking-tight text-white sm:text-xl`.
- Desktop nav links follow the logo, hidden on mobile and flex on md+.
- Nav links: Home, Projects, Studio, Reach Us.
- Nav link style: `text-sm text-white/80 hover:text-white transition-colors`.
- Desktop right button: "Let's Talk", `rounded-lg bg-white px-5 py-2 text-sm font-medium text-black hover:scale-105 transition-transform`.
- Mobile right: 40x40 hamburger toggle button with z-50 and active:scale-90.
- Mobile icons: Menu and X from lucide-react.
- Menu rotates 90deg out and X rotates in with opacity and scale transitions, duration-300.

Mobile menu:
- z-20.
- Absolute inset-x-0 top-0.
- Full-screen overlay with `bg-black/98 backdrop-blur-xl`.
- Transition: duration-500 and ease-[cubic-bezier(0.16,1,0.3,1)].
- Open state: `h-screen opacity-100`.
- Closed state: `h-0 opacity-0 pointer-events-none`.
- Inner content: `flex h-full flex-col justify-center px-8`.
- Inner animation: delayed fade plus translate, delay-100, translate-y-8.
- Links: Home, Projects, Studio, Reach Us.
- Link style: `text-3xl font-medium text-white/90 hover:text-white`.
- Button: "Let's Talk", `mt-6 rounded-full bg-white px-8 py-3.5 text-base font-medium text-black hover:scale-105`.
- All links and button call `setMobileMenuOpen(false)` on click.

Hero content:
- z-10.
- Flex column justify-between, fills remaining height with `h-[calc(100vh-80px)]`.
- Padding: `px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16`.

Top section:
- Max width: max-w-3xl.
- Badge: "Brand & Visual Storytelling".
- Badge style: `text-xs sm:text-sm text-white/90`, margin-bottom 4 sm:6.
- Badge animation: `animate-[fadeSlideUp_0.8s_ease_0.2s_both]`.
- Heading text with br line breaks:
```text
Shaping visual
narratives,
one pixel at a time.
```
- Heading sizes: text-3xl sm:text-5xl md:text-6xl lg:text-7xl.
- Heading style: font-medium leading-[1.1] tracking-tight text-white.
- Heading animation: `animate-[fadeSlideUp_0.8s_ease_0.4s_both]`.

Bottom section:
- Paragraph: "Turning vision into reality through craft, motion, and an endless pursuit of beauty."
- Paragraph style: text-sm sm:text-base md:text-lg leading-relaxed text-white/60 max-w-sm sm:max-w-lg mb-5 sm:mb-6.
- Paragraph animation: `animate-[fadeSlideUp_0.8s_ease_0.7s_both]`.
- CTA: "Explore Work" with ArrowRight icon size 16.
- CTA style: `rounded-lg bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-medium text-black hover:scale-105 transition-transform inline-flex items-center gap-2`.
- CTA animation: `animate-[fadeSlideUp_0.8s_ease_0.9s_both]`.

CSS animation in index.css:
```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

CSS reset:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

Dependencies:
- React.
- lucide-react icons ArrowRight, Menu, X.
- Tailwind CSS.
- Google Fonts Geist.
