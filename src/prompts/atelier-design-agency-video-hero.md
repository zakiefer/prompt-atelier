Create a fullscreen hero landing page section for a design agency called "Atelier" using React, Tailwind CSS, and Lucide React icons. The section must be fully mobile responsive and include an animated hamburger mobile menu.

Fonts:
- Instrument Serif from Google Fonts, regular and italic, for headings and mobile menu links.
- Inter from Google Fonts, weights 300, 400, 500, 600, as the sans-serif body font.
- Load in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
```
- Tailwind fontFamily extension:
```js
fontFamily: {
  'instrument-serif': ['"Instrument Serif"', 'serif'],
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

Background:
- Fullscreen looping autoplay muted video.
- The video covers the entire viewport with `object-cover`.
- Video URL: `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204103_f607742e-09da-4cf5-bb06-4e67b0a531de.mp4`

Layout:
- Entire section: `w-full h-screen overflow-hidden`.
- Video is absolutely positioned behind the content.
- Content layer: `relative z-10 flex flex-col h-full`.

Navbar:
- Horizontal flex bar.
- Padding: `px-6 md:px-12 lg:px-16 py-5 md:py-6`.
- Left side:
  - Logo text "Atelier", white, font-semibold, text-lg, tracking-tight, font-sans.
  - Desktop nav links hidden on mobile and shown at md+.
  - Links: "Projects", "Expertise", "Studio", "Insights".
  - Link style: text-white/80, hover:text-white, text-sm, font-light, transition-colors duration-200.
- Right side:
  - "Reach Out" text link, hidden on mobile.
  - "Let's Talk" button, white background, black text, rounded-full, px-5 py-2, hidden on mobile.
  - Hamburger button shown only on mobile, `md:hidden`.

Hamburger:
- Three lines, 2px height, white, rounded-full.
- Middle line is shorter, w-4, while top and bottom are w-6.
- On open:
  - Top and bottom lines rotate 45 and -45 degrees and translate into an X.
  - Middle line fades out.
- Easing: `cubic-bezier(0.76,0,0.24,1)`.
- Duration: 500ms.

Mobile menu overlay:
- Fixed inset-0, z-50, md:hidden.
- Backdrop: `bg-black/90 backdrop-blur-xl`.
- Backdrop fades in with 700ms transition.
- Content fades in with the same 700ms cubic-bezier easing.
- Header matches navbar layout with logo and close button.
- Close button is an X formed by rotated lines.
- Nav links stack vertically and center.
- Links:
  - "Projects"
  - "Expertise"
  - "Studio"
  - "Insights"
  - "Reach Out"
- Link style: `text-4xl sm:text-5xl font-instrument-serif`, white, border-b border-white/10, py-4.
- On open, each link animates in with staggered delays: 150ms plus index * 80ms.
- Link entrance: translate-y-8 to translate-y-0.
- Hover shifts text right with `hover:pl-4`.
- Footer contains a full-width "Let's Talk" button, white bg, black text, rounded-full, py-4.
- Footer button fades in with 550ms delay.

Hero content:
- Container: `flex-1 flex flex-col items-center justify-start pt-4 sm:pt-6 md:pt-8 lg:pt-10 px-6 text-center`.
- Heading:
  - `font-instrument-serif text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] max-w-5xl`.
  - Text with line breaks:
```text
UX and APP
DESIGN for BOLD
VENTURES
```
  - The words "and" and "for" use italic Instrument Serif spans.
- Subtext:
  - `mt-4 md:mt-5 text-white/70 text-sm md:text-base font-light max-w-md leading-relaxed`.
  - Text: "We shape digital products that define brands" plus a line break hidden on mobile and visible at sm, then "and unlock exponential growth."

Buttons:
- Row: `mt-5 md:mt-6 flex flex-col sm:flex-row items-center gap-4`.
- Primary:
  - "See Cases" plus Lucide `ArrowRight`.
  - White background, black text, rounded-full, px-7 py-3, text-sm font-medium.
  - On hover, arrow translates 0.5 to the right.
- Secondary:
  - "Watch Reel" plus Lucide `Play`.
  - Transparent, border border-white/40, white text, rounded-full, px-7 py-3.
  - On hover: bg-white/10 and border-white/60.

Global CSS:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
```

Dependencies:
- React.
- Tailwind CSS.
- lucide-react for ArrowRight and Play.
- No other UI libraries.
