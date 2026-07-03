Build a full-screen hero section for a creative portfolio using React, Vite, Tailwind CSS, and the Figtree Google Font. The page has two components: `Navbar` and `Hero`. The entire page uses a black background with white text.

Setup:
- Font: Figtree from Google Fonts, weights 400, 500, and 600.
- Load the font in `index.html`.
- Use Tailwind custom max-width breakpoints:
  - `mobile`: max 809.98px.
  - `md-tablet`: min 810px and max 1199.98px.
- Define CSS variable `--ease-spring: cubic-bezier(0.16, 1, 0.3, 1)`.
- No additional packages beyond `lucide-react`, though icons are not required here.

Video background:
- Stack three full-screen looping videos absolutely.
- All videos render simultaneously.
- Attributes: `muted`, `autoPlay`, `playsInline`, and `loop`.
- Only the active video has `opacity-100`; inactive videos have `opacity-0`.
- Crossfade with `transition-opacity duration-[1200ms] ease-in-out`.
- Video URLs:
  1. `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4`
  2. `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4`
  3. `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4`
- On mount, preload all videos by fetching them as blobs and creating object URLs for instant playback.
- If blob preloading fails, fall back to the original URL.
- Add a `bg-black/10` overlay above the videos at `z-[1]`.

Navbar:
- Absolute positioned on top of the hero, z-10.
- Centered container with max-width 1340px.
- Padding: `py-9 px-[15px]`.

Desktop navbar left:
- Navigation items:
  - `01 / Works`
  - `02 / Services`
  - `03 / About`
  - `04 / Contact`
- Index number style: `text-[8px] leading-3 tracking-[-0.08px] font-medium uppercase`.
- Label style: `text-xs leading-4 tracking-[-0.12px] font-medium uppercase`.
- Each link uses `.nav-link-underline`.
- Underline slides in from right on hover with scaleX transform.

Desktop navbar right:
- Email: `Davies@gmail.com`.
- Live clock: `CUP HH:MM:SS`.
- Clock uses 24-hour format and updates every second with `Intl.DateTimeFormat('en-GB')`.

Mobile navbar:
- Hide nav items.
- Replace with a `Menu` / `Close` toggle button.
- Mobile panel expands and collapses using CSS Grid rows:
  - Closed: `grid-rows-[0fr]`.
  - Open: `grid-rows-[1fr]`.
- Transition: 420ms with the spring ease variable.
- Mobile nav links are large: `text-[28px] leading-8 tracking-[-0.84px]`.

Hero content:
- Relative z-[2].
- Container max-width: 1340px.
- Full height.
- Flex column, `justify-end`, `items-end`.
- Gap: 150px.
- Padding: `pt-[190px] px-[15px]`.

Section 1, video switcher and availability:
- Upper area with two columns.
- Left column: `flex-[4]`.
- Three switcher buttons:
  - `01 / WATER WAVE`
  - `02 / GRIDWAVE`
  - `03 / LIGHT TUNNEL`
- Active button uses full opacity.
- Inactive buttons use `opacity-55` and `hover:opacity-75`.
- On click, set `activeIndex` and crossfade videos.
- Each button uses `.role-link`, translating 4px right on hover.

Availability:
- Right column: `flex-1`.
- Contains pulsing dot plus "Available for work" text.
- Dot is 7px circle with glow shadow and infinite pulse animation.
- Pulse animation scales from 1 to 1.45 and opacity 1 to 0.45 over 1.6s.
- On slide 1, dot is pink `#F598F2` with matching pink glow.
- On slides 2 and 3, dot is white with white glow.

Section 2, name and CTA:
- Bottom area with `pb-[60px]`.
- Left column: `flex-[2]`.
- Giant name text: "Viktor."
- Style: `text-[200px] leading-[81%] tracking-[-6px] font-medium uppercase`.
- The period is accent-colored: pink `#F598F2` on slide 1, white on slides 2 and 3.
- Animate in with `revealUp`, from translateY 80px to 0 over 0.9s with spring easing.

Bottom right column:
- `flex-1`, `pl-[50px]`.
- Paragraph: "I craft bold brands and modern websites with purpose..."
- Paragraph style: `text-base leading-6 tracking-[-0.16px] font-medium`.
- Below paragraph, add a lowercase "start a project" button.
- Button has a white border.
- Hover effect fills upward:
  - `::before` pseudo-element with background `#F598F2`.
  - Moves from `translateY(101%)` to `translateY(0)` on hover.
  - Text turns black and border turns pink.
- Paragraph and button animate with `revealRight`, from translateX 100px to 0 over 0.9s.
- Button animation delay: 0.08s.

Reveal behavior:
- Reveal animations trigger once via IntersectionObserver.
- Threshold: 0.35.

Responsive tablet, 810px to 1199px:
- Navbar padding: `py-[30px] px-[18px]`.
- Nav gaps shrink to `gap-4`.
- Hero name: `text-[129.6px] leading-[113.4px] tracking-[-7.7px]`.
- Bottom section gap: 28px.
- Bottom padding: 52px.
- Right column left padding: 24px.

Responsive mobile, below 810px:
- Navbar padding: `py-6 px-[18px]`.
- Hide desktop nav and show hamburger menu.
- Hero content: `justify-end items-start gap-[72px] pt-[140px] px-[18px]`.
- Switcher and availability stack vertically with gap 7.
- Bottom section becomes column layout with `gap-8 pb-11`.
- Name: `text-[clamp(68px,21vw,80px)] leading-[96px] tracking-[-4.8px]`.
- Paragraph max-width: 420px.

Custom CSS animations:
```css
@keyframes videoFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes revealUp {
  from { opacity: 0; transform: translateY(80px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes revealRight {
  from { opacity: 0; transform: translateX(100px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(1.45); }
}
```

Accessibility:
- Respect `prefers-reduced-motion: reduce` by disabling animations.
- Use semantic landmarks: `header`, `main`, `nav`, and `section`.
- Add ARIA labels on navigation regions and status elements.
- Mark background videos `aria-hidden="true"`.
