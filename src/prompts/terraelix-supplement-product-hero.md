Create a single-page hero landing for a wellness/supplements brand called "TerraElix" using React, Tailwind CSS, and Lucide React icons. The page is a full-viewport responsive hero with a background image, navbar, word-by-word headline reveal, CTA section, responsive product imagery, and a three-panel footer strip.

Fonts:
- DM Sans from Google Fonts, weights 400 and 500. Use for brand name, nav links, headline, and panel 1 text.
- Inter from Google Fonts, weights 400 and 500. Use for buttons, body text, and panel 2/3 text.

Background:
- Full-screen image on the root container.
- `background-size: cover`, `background-position: center`, `background-repeat: no-repeat`.
- URL: `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_110248_b62f758d-f68c-4045-a7b4-91771d6d0a0f.png&w=1280&q=85`

Layout structure:
```tsx
<div className="relative flex min-h-screen flex-col overflow-hidden">
  <nav />
  <section />
  <div className="lg:hidden" />
  <div />
  <img className="hidden lg:block" />
</div>
```
- Root is min-h-screen, flex column, relative, overflow hidden.
- Desktop floating product image is absolute and hidden below lg.

Navbar:
- Padding: `px-5 sm:px-8 lg:px-10 py-4 lg:py-5`.
- Left brand: "TerraElix", white, DM Sans 500, 30px, letter-spacing -0.05em.
- Desktop center nav hidden on mobile: "About", "Products", "Promotions", "Contact".
- Nav links: DM Sans 500, 18px, text-white/90, gap 10 at lg.
- Right row:
  - Search icon, Lucide `Search`, size 20, strokeWidth 1.5.
  - Shopping bag icon, Lucide `ShoppingBag`, size 20, strokeWidth 1.5.
  - Return icon, Lucide `CornerUpLeft`, size 20, strokeWidth 1.5.
  - Round avatar image, w-8 h-8, lg:w-10 lg:h-10, rounded-full, object-cover.
  - Avatar URL: `https://polo-pecan-73837341.figma.site/_assets/v11/ca8093996e970200cbcf8bde8744175e52da5a79.png`
  - Mobile hamburger toggle, md:hidden, Lucide `Menu` / `X`.
- Mobile overlay menu: fixed inset-0, bg-black/90, z-30, centered nav links, text-2xl, white.

Hero headline:
- Font: DM Sans, weight 400, letter-spacing -0.05em.
- Responsive sizes:
  - Base: 48px with 50px line-height.
  - sm: 80px with 72px line-height.
  - md: 110px with 95px line-height.
  - lg: 130px with 110px line-height.
  - xl: 155px with 125px line-height.
- Three-line text:
  - Line 1: "The" white, "Power" white, "of" white/45.
  - Line 2: "Nature" dimmed, "in" dimmed, "Every" white.
  - Line 3: "Capsule" white plus inline product image.
- Wrap every word in an overflow-hidden container.
- Inner spans animate with `wordReveal` from translateY 100% and blur to visible.
- Stagger delays: 0.3s through 0.9s.
- Inline image after "Capsule" is hidden on mobile, `sm:inline-block`, `align-middle`, `ml-2 lg:ml-4`.
- Inline image URL: `https://polo-pecan-73837341.figma.site/_assets/v11/6a7de4fbe9c9e2315040607320a9ff5e93117bf4.png`
- Inline image height: `clamp(60px, 10vw, 160px)`.

CTA section:
- Below headline with `mt-8 sm:mt-12 lg:mt-[75px]`.
- Column on mobile, row at sm and up.
- Gap: 5 mobile, 8 sm, 50px lg.
- Button: "Explore Now" plus Lucide `ArrowUpRight`, black background, white text, rounded-md.
- Button sizes: w-full on mobile, sm:w-[240px], md:w-[280px], lg:w-[310px].
- Height: h-14, sm:h-16, lg:h-[72px].
- Font: Inter 500, responsive base to 2xl, letter-spacing -0.03em.
- Paragraph: "Discover our new plant-based supplements for daily balance and clean energy."
- Paragraph: white, max-w-[310px], Inter 400, text-sm to lg:text-lg, line-height 1.45, letter-spacing -0.03em.

Mobile/tablet product image:
- Visible below lg.
- URL: `https://polo-pecan-73837341.figma.site/_assets/v11/50ad042b3cd48a2e120ea3ba17c8cfeaf3cc334c.png`
- Oversized and bleeding off edges.
- Width: w-[180%] on mobile, sm:w-[151%], max-w-[1296px].
- object-contain, mx-auto, drop-shadow-2xl.
- Margin-bottom: -180px mobile, sm:-220px.

Bottom three-panel grid:
- `grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr]`, relative z-10.

Panel 1:
- Background: `#ECEDEC`.
- Text: "Start your personalized path to natural balance".
- DM Sans 400, text-2xl, sm:text-[28px], lg:text-[35px], leading 1.1, letter-spacing -0.05em, max-w-[350px].
- Link: "Personal Assessment", underlined, Inter 400, text-base to lg:text-lg.
- Decorative image absolute right-0 bottom-0, h-full, mix-blend-multiply.
- Decorative URL: `https://polo-pecan-73837341.figma.site/_assets/v11/6736cbe6e26afa2cd7c04a91892a79f7640785b5.png`

Panel 2:
- Background: `#FEFDF9`.
- Auto-rotating card carousel cycles every 3500ms with fade/slide transition.
- Four cards:
  1. FlaskConical icon, black circle, "Experience our newly enhanced natural formula".
  2. Leaf icon, emerald-800 circle, "Pure organic ingredients sourced sustainably".
  3. Droplets icon, cyan-800 circle, "Advanced bioavailability for maximum absorption".
  4. Sun icon, amber-700 circle, "Clinically tested for daily energy & vitality".
- Card text: Inter 400, text-sm to lg:text-lg, black/80, line-height 1.2, letter-spacing -0.03em.
- Active card: opacity-100 translate-y-0.
- Inactive cards: opacity-0 translate-y-4 absolute.
- Bottom dots: four thin bars, h-0.5, flex-1, rounded-full. Active black, inactive black/20.

Panel 3:
- Background: black.
- Product image left:
  `https://polo-pecan-73837341.figma.site/_assets/v11/30e8f38d1f993c357a3be2721557fc899d5640fc.png`
- Image size: 120x82 mobile, 160x110 sm, 208x142 lg.
- Right text: "+14K" in white, Inter 400, text-2xl to lg:text-[35px], letter-spacing -0.05em.
- Supporting text: "People have already optimized their wellness", text-white/60, Inter 400, text-sm to lg:text-lg.

Desktop floating product:
- Same image as the mobile product.
- Hidden below lg.
- Absolute z-0.
- Width: `clamp(600px, 80vw, 1412px)`.
- Bottom: -10%.
- Right: `clamp(-400px, -20vw, -100px)`.

Animations:
- Use `cubic-bezier(0.16, 1, 0.3, 1)` and `both` fill mode.
- Define keyframes: fadeUp, fadeIn, slideInLeft, slideInRight, scaleIn, wordReveal.
- `.animate-fade-up`: fadeUp 0.8s.
- `.animate-fade-in`: fadeIn 0.7s.
- `.animate-slide-left`: slideInLeft 0.8s.
- `.animate-slide-right`: slideInRight 0.8s.
- `.animate-scale-in`: scaleIn 1s.
- `.animate-word-reveal > span`: wordReveal 0.7s.
- Delay classes from `.delay-200` through `.delay-1100` in 0.1s increments.
- Navbar container fades in.
- Brand slides left at delay 200.
- Nav links fade in at delay 400.
- Right icons slide right at delay 300.
- CTA row fades up at delay 600.
- Desktop product image scales in at delay 700.
- Mobile product image scales in at delay 800.
- Panels 1, 2, 3 fade up at delays 900, 1000, and 1100.
- Inline capsule image scales in at delay 1000.
