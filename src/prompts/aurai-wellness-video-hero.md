Build a full-screen hero landing page for "Aurai", an always-on AI wellness companion. The page is a single viewport-height section with looping background video and overlaid glass content.

Video background:
- Full-screen video with autoPlay, loop, muted, playsInline.
- Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260618_174853_aac61aa2-0f3f-4cf1-bc78-7f657dd11164.mp4
- Video covers viewport with object-cover.
- Focal point:
  - Mobile: object-position 80% center.
  - md: object-position right center.
  - lg: object-position center center.
- No dark overlay on the video.

Fonts:
- Askan Light from https://db.onlinewebfonts.com/c/304a6edcec9f8858eeaafc2ac18243f4?family=Askan+Light for brand and heading.
- Inter weights 300, 400, 500, 600 from Google Fonts for body/UI.
- Tailwind fontFamily extends `askan: ['"Askan Light"', 'serif']` and `inter: ['Inter', 'sans-serif']`.

Layout:
- Content layer: absolute inset-0 z-10 flex column.
- Padding: px-4 sm:px-10 lg:px-12 py-4 sm:py-8.

Navigation:
- nav flex items-center justify-between.
- Left nav pill: bg-black/20 backdrop-blur-md rounded-2xl border border-white/10, px-4 py-2.5 sm:px-6 sm:py-4.
- Left pill contains custom SVG logo, brand "Aurai", and hamburger Menu/X icon.
- Logo: four-petal pinwheel, w-5 h-5 sm:w-7 sm:h-7, white, viewBox 0 0 256 256, fill currentColor.
- Logo path:
```svg
M 228 0 C 172.772 0 128 44.772 128 100 L 128 0 L 0 0 L 0 28 C 0 83.228 44.772 128 100 128 L 0 128 L 0 256 L 28 256 C 83.228 256 128 211.228 128 156 L 128 256 L 256 256 L 256 228 C 256 172.772 211.228 128 156 128 L 256 128 L 256 0 Z
```
- Brand text: "Aurai", font-askan text-white text-base sm:text-xl tracking-wide.
- Menu icon margin-left: ml-4 sm:ml-32 md:ml-64 lg:ml-96.
- Right desktop button: hidden below sm, bg-white text-gray-900 font-medium text-sm px-6 py-3 rounded-full, text "Join the list".

Mobile menu:
- Shown on toggle, sm:hidden.
- Position: absolute top-[4.5rem] left-4 right-4.
- bg-black/30 backdrop-blur-xl rounded-2xl p-5 border border-white/10.
- Links: Story, Benefits, Connect, white text.
- Full-width "Join the list" button.

Main content:
- Mobile uses a `flex-1 sm:hidden` spacer to push content down.
- Content container: `flex flex-col sm:flex-1 sm:flex-row sm:items-end pb-4 sm:pb-12 lg:pb-16 sm:mt-auto`.

Left column:
- Heading: "Your calm is always within."
- Heading classes: `font-askan text-white text-[2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1.05] tracking-tight max-w-[700px]`.
- Subtitle: "Aurai is your always-on wellness companion. Built by leading therapists, it brings you the care and clarity right when you need it."
- Subtitle classes: `text-white/70 text-xs sm:text-base md:text-lg max-w-[520px] leading-relaxed`.
- Email form:
  - Container: bg-black/30 backdrop-blur-md rounded-full border border-white/10.
  - Input: transparent, white text, placeholder "Your email address", px-4 sm:px-6 py-3 sm:py-4 text-sm.
  - Submit button absolute right-1.5, bg-white text-gray-900 text-xs sm:text-sm font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-full.
  - Submit text: "Join the list".
  - On submit, show alert with entered email.
- Mobile feature pills: flex sm:hidden flex-wrap gap-2 mt-2.
- Pill labels: Smart Therapy, Real-time Healing, Insights into outcomes.
- Pill style: bg-black/30 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10.

Right column:
- Hidden below sm.
- `hidden sm:flex flex-col items-end gap-2 self-end`.
- Same three feature pills with text-xs sm:text-sm px-4 py-2.

Global CSS:
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

Design principles:
- Glass elements use bg-black/20 or bg-black/30 plus backdrop blur.
- Borders are border-white/10.
- White text with /70 opacity for secondary text.
- rounded-full for buttons/inputs, rounded-2xl for containers.
- Page title: "Aurai - Always-On Wellness Companion".
