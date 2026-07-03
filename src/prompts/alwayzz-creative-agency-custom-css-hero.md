Create a single-page landing hero section for a creative agency called "Alwayzz" with React, Vite, and Tailwind CSS. Use custom CSS rather than Tailwind utilities for all styling. The design is minimal, clean, black-and-white, with tight negative letter-spacing throughout.

Fonts:
- Load Inter from Google Fonts, weights 400, 500, 600, 700.
- Load Source Serif 4 from Google Fonts, weights 400 and 600, normal and italic.
- Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`.

CSS variables:
```css
--bg: #ffffff;
--text: #0a0a0a;
--muted: #6b6b6b;
--button-bg: #0a0a0a;
--button-text: #ffffff;
--border-soft: rgba(0, 0, 0, 0.08);
--green: #17c964;
```

Navbar:
- Fixed top, z-index 100.
- Padding: `19px 36px`.
- Max-width: 1200px, centered.
- Left logo:
  - Text: "Alwayzz".
  - Font: Source Serif 4.
  - 30px, weight 600, italic.
  - Letter-spacing: -0.08em.
  - Include registered trademark symbol in Inter, 14px, weight 600.
- Right:
  - "Menu" pill button.
  - Black background, white text, rounded-full.
  - 14px, weight 500, Inter.
  - Lucide `ChevronUp` icon, 16px.
- On click, open fullscreen drawer overlay.

Fullscreen drawer:
- White background.
- Fade transition duration: 0.4s.
- Nav links centered vertically.
- Links: "Projects", "Plans", "Team", "FAQs", "Get in Touch".
- Link style: 48px, weight 500, letter-spacing -0.04em.
- Footer contains copyright text.

Hero section:
- Min-height: 850px.
- Padding: `160px 36px`.
- Centered flex column.
- Background image applied through a `::before` pseudo-element that covers the section.
- Background-size: cover.
- Background-position: center.
- Image URL: `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260626_041422_4a459e05-abce-4150-9fb7-4ededc423cd1.png&w=1280&q=85`

Decorative curved line animations:
- Place 20 lines on the left side and 20 on the right side, absolutely positioned.
- Each line is a tall rectangle with a one-sided 80% border-radius.
- Border: `2.5px solid #FCFAF8`.
- Left lines have no left border and radius on the right.
- Right lines have no right border and radius on the left.
- Stagger each line with `animationDelay: i * 0.25s`.
- Widths start at 60px and increase by 10px per line.
- Animation: `line-pulse`, 5s ease-in-out infinite.
- `line-pulse` fades opacity to 0.9 and back to 0 with slight scale.
- On mobile below 810px, hide side lines and show top horizontal lines instead with the same animation and horizontal orientation with bottom border-radius.

Ticker row:
- Max-width: 500px.
- Height: 36px.
- Horizontal marquee scrolls left over 30s, linear, infinite.
- Items:
  - "Brand Identity"
  - "App Development"
  - "Visual Design"
  - "Creative Video"
  - "Iconography"
- Item style: 13px, weight 500, color var(--muted), padding `6px 14px`, rounded-full, background `rgb(251, 251, 251)`.
- Duplicate row content 4x for a seamless loop.
- Edge fade mask: `linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)`.

Title:
- Text: `Premium creative alwayzz(R) on demand.`
- Markup:
```html
Premium creative <span class="serif italic">alwayzz</span><sup>registered mark</sup> on demand.
```
- Max-width: 550px.
- Font-size: 82px.
- Line-height: 1.03.
- Letter-spacing: -0.07em.
- Weight: 600.
- Centered.
- The word "alwayzz" uses Source Serif 4, italic, weight 600, letter-spacing -0.08em.
- Registered mark uses Inter, 24px, weight 600, vertical-align super.

Subtitle:
- Text: "A flexible design partnership for founders, brands, and agencies who want top craft delivered on their timeline."
- Max-width: 476px.
- 17px, line-height 1.45, weight 400.
- Color: var(--muted).
- Centered.

CTA row:
- Flex row, gap 16px, centered.
- Primary button:
  - Text: "View Plans".
  - Height 56px.
  - Padding `18px 30px`.
  - Rounded-full.
  - Black background, white text.
  - Inter, 15px, weight 600.
  - Hover: translateY(-1px) and box-shadow `0 4px 20px rgba(0,0,0,0.12)`.
- Book button:
  - Text: "Chat for 15 minutes".
  - White background.
  - `4px solid rgb(248,248,248)` border.
  - Rounded-full.
  - Padding `8px 24px 8px 8px`.
  - Contains 40px circular avatar image.
  - Avatar URL: `https://framerusercontent.com/images/hfneFL6CHBi5BnNvCeOaqU9HqE4.png`
  - Text stack primary: "Chat for 15 minutes", 14px, weight 600, black.
  - Text stack secondary: "Pick a slot", 12px, weight 500, `rgb(152,152,152)`.
  - Include a green dot `rgb(29, 204, 93)`, 8px circle.

Progressive blur:
- At hero bottom.
- Absolute, full width.
- Height: 178px.
- Gradient from transparent to `rgba(255,255,255,0.4)` at 40% to solid white.

TrustedBy section:
- Padding: 36px.
- Max-width: 1200px, centered.
- Left label: "Partnered with top-tier companies globally".
- Label max-width: 163px, 14px, weight 500, muted color.
- Right: horizontal marquee over 30s.
- Company text logos:
  - Airbnb, Cedarville Cursive, weight 700.
  - Shopify, system-ui, weight 800.
  - Notion, Georgia, weight 500.
  - Linear, Inter, weight 600.
  - Webflow, Inter, weight 700.
  - Figma, system-ui, weight 600.
  - Slack, Georgia, weight 700.
  - Stripe, system-ui, weight 800.
  - Vercel, Inter, weight 600.
  - Framer, Source Serif 4, weight 600.
- Company logo text style: 16px, weight 600, black.
- Use the same edge-fade marquee mask as the ticker.

Responsive behavior:
- Below 1200px:
  - Hero padding `140px 32px`.
  - Title `clamp(60px, 8vw, 72px)`.
  - Navbar padding 32px.
  - Drawer links 40px.
- Below 810px:
  - Hero min-height 760px.
  - Hero padding `120px 24px 96px`.
  - Rotate background image 90deg to fill portrait viewport.
  - Hide side curved lines and show top horizontal lines.
  - Title `clamp(44px, 13vw, 52px)`.
  - CTA buttons stack vertically and become full-width with max-width 320px.
  - Trusted section stacks vertically.
  - Drawer links 32px.
  - Navbar padding 20px.

Keyframes:
```css
@keyframes marquee-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes line-pulse {
  0% { opacity: 0; transform: scale(1); }
  15% { opacity: 0.9; }
  70% { opacity: 0.4; }
  100% { opacity: 0; transform: scale(0.85); }
}
```

Exact image URLs:
- Hero background:
  `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260626_041422_4a459e05-abce-4150-9fb7-4ededc423cd1.png&w=1280&q=85`
- Book button avatar:
  `https://framerusercontent.com/images/hfneFL6CHBi5BnNvCeOaqU9HqE4.png`
