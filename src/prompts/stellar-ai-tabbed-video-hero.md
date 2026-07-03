Create a "Stellar.ai" landing page hero section using React, Tailwind CSS, and Lucide React icons. Use Inter from Google Fonts. The page has a white background, max-width max-w-7xl, and is centered with mx-auto.

Font:
- Import Inter weights 400, 500, 600, 700 from Google Fonts.
- Set `font-family: 'Inter', sans-serif` on the body.

Custom CSS animations in index.css:
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in-overlay {
  animation: fadeInOverlay 0.4s ease-out forwards;
}

@keyframes fadeInDialog {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-slide-up-overlay {
  transform: translate(-50%, -50%);
  animation: fadeInDialog 0.5s ease-out forwards;
}
```
- Every major section uses `.animate-fade-in-up` with staggered inline animationDelay starting at 0.1s and incrementing by 0.1s.
- Each animated element starts with inline opacity 0 so the animation fills it to visible.
- Tailwind config stays default with no custom theme extensions and standard content paths.

Navigation:
- Animation delay: 0.1s.
- Classes: `px-6 py-4 flex items-center justify-between max-w-7xl mx-auto`.
- Left: lucide Star icon, w-5 h-5, fill-black, plus "Stellar.ai" text, text-lg font-semibold.
- Center: hidden on mobile, `hidden md:flex items-center gap-8`.
- Center links:
  - "Solutions" with ChevronDown.
  - "For Teams" with ChevronDown.
  - "About Us".
  - "Learn Hub".
- Link style: text-sm text-gray-700 hover:text-black.
- Right: "Login" link, text-sm text-gray-700.
- Right CTA: "Get started free", bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors.

Hero section:
- Classes: `px-6 pt-24 pb-32 max-w-7xl mx-auto text-center`.
- Reviews badge, delay 0.2s:
  - `inline-flex items-center gap-2 mb-8`.
  - Contains a bordered square `w-6 h-6 border border-gray-300 rounded` with a filled Star icon.
  - Text: "4.9 rating from 18.3K+ users", text-sm font-medium text-black.
- Main heading, delay 0.3s:
  - Classes: `text-6xl md:text-7xl lg:text-[80px] font-normal leading-[1.1] tracking-tight mb-5`.
  - First line: "Work Smarter. Move Faster."
  - Second line: "AI Powers You Up.", with gradient text `bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent`.
- Subheading, delay 0.4s:
  - Classes: `text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto`.
  - Text: "Intelligent automation syncs with the tools you love to streamline tasks, boost output, and save time."
- CTA button, delay 0.5s:
  - Classes: `bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors mb-12`.
  - Text: "Begin Free Trial".

Tab bar:
- Delay 0.6s.
- Centered container: bg-gray-100 rounded-lg p-1.
- State: `useState('analyse')`.
- Auto-cycle tabs every 4 seconds with setInterval.
- Mobile md:hidden: 2x2 grid with four buttons.
- Desktop hidden md:flex: four buttons in a row with vertical dividers `w-px h-5 bg-gray-300`.
- Tabs:
  - Analyse with BarChart3.
  - Train with BookOpen.
  - Testing with Users.
  - Deploy with Rocket.
- Active state: bg-white text-black shadow-sm.
- Inactive state: text-gray-600.

Video and overlay section:
- Delay 0.7s.
- Container: relative rounded-3xl overflow-hidden h-[400px] md:h-[500px].
- Video: src `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4`, autoPlay, loop, muted, playsInline, w-full h-full object-cover.
- Render four conditional overlays based on active tab.
- Overlay outer uses animate-fade-in-overlay.
- Inner card uses animate-slide-up-overlay.
- Analyse overlay: "Set Up Your AI Workspace" wizard with purple progress bar at 25% and four steps.
- Train overlay: "AI Model Training" with orange progress at 67% and four metrics.
- Testing overlay: "Test Suite Results" with green success and 127/127 tests.
- Deploy overlay: "Deploy to Production" with four checklist items and a Deploy Now button.

Company logos:
- Delay 0.8s.
- Classes: mt-24 flex.
- Logos/text marks: INTERSCOPE, SPOTIFY, Nexera with dot grid, M3 in serif italic, LAURA COLE with LC circle, vertex with dots.
