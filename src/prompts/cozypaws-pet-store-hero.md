Build a single-page "CozyPaws" pet store hero section using React, TypeScript, Vite, Tailwind CSS, and Lucide React icons. The layout is viewport-height, no-scroll, and responsive across mobile, tablet, and desktop.

Fonts:
- Inter from Google Fonts, weights 400, 500, 600, for body and UI text.
- DM Serif Display from Google Fonts, weight 400, for the hero heading only.
- Load with:
```html
https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap
```
- Add `.font-serif-display { font-family: 'DM Serif Display', serif; }`.
- Body uses `font-family: 'Inter', sans-serif`.

Color palette:
- Background: `#EFFDF0`.
- Primary dark green: `#1a3d1a`.
- Hover green: `#2a5a2a`.
- Orange accent: `#E86A10`.
- Orange hover: `#d45e0d`.

Assets:
- Logo SVG: `https://polo-pecan-73837341.figma.site/_assets/v11/0ae29d6d9628bede667f90d57bebe81b8f1ec2bf.svg`
- Avatar: `https://polo-pecan-73837341.figma.site/_assets/v11/e62173d41f91350a59628e8a9a55ae078a886fb9.png?w=128`
- Product card, Cat House: `https://polo-pecan-73837341.figma.site/_assets/v11/3e5158dad63d392ade022e81890edc9f54d750bc.png`
- Video card, TikTok/YouTube: `https://polo-pecan-73837341.figma.site/_assets/v11/76be6ec3a93a703b15e9cc01e764a4e3f9d7d2c0.png`
- Bottom left image: `https://polo-pecan-73837341.figma.site/_assets/v11/8d44b25186ef45a5789c74668fb781cea4e1ff49.png`
- Bottom center image: `https://polo-pecan-73837341.figma.site/_assets/v11/96745c4e72ad5c5208e53a885df797fd82cd854a.png?h=1024`
- Bottom right image: `https://polo-pecan-73837341.figma.site/_assets/v11/81bd2e7a66b58f3d8f3ad78fd1ebf01af8dfdee1.png`

Top-level layout:
- Container: `h-screen flex flex-col overflow-hidden`.
- Header: `shrink-0`.
- Hero section: `flex-1 flex flex-col overflow-hidden`.
- Use show/hide responsive blocks such as `hidden lg:flex` rather than CSS-only media queries.
- Use `clamp()` heavily for fluid typography and spacing.

Header:
- Full width, relative z-30.
- Desktop padding: `px-12 py-4`.
- Left logo image: 205x52px desktop, 130x33px mobile.
- Center nav hidden below md:
  - "Home" in text-gray-900.
  - "Shop", "Delivery and payment", "Brands", "Blog" in text-gray-600.
  - text-sm, font-medium, gap-8.
- Right controls:
  - Search button: circular border, hidden below sm, Lucide `Search`.
  - Favorites button: orange circle, white Star icon, badge "4".
  - Cart button: circular border, cart icon, badge "1".
  - Avatar: 40x40 circle.
- Badges: absolute -top-1 -right-1, 20x20, orange background, 2px border matching background, white 10px bold text.

Desktop hero layout, lg and up:
- Text layer z-5, centered, `px-12 pt-[5.4rem]`.
- Heading:
  - Text line 1: "Everything".
  - Text line 2: "Your Pets Love".
  - `.font-serif-display`, color `#1a3d1a`.
  - Size: `text-[clamp(60px,7.5vw,110px)]`.
  - `leading-[0.95]`, tracking-tight.
  - Each word is inline-block with staggered `animate-word-pop`.

Left product card:
- Absolutely positioned `top-[50px] left-12`.
- Width: `clamp(160px,14vw,260px)`.
- Image aspect-ratio 260/257, rounded-2xl, overflow hidden.
- Dark green circular ArrowUpRight button at bottom-right corner.
- Text below image: "Cozy Cat House" in gray-700 and "$49.99" in dark green bold.
- Responsive font sizes use clamp.

Right video card:
- Absolutely positioned `top-[50px] right-12`.
- Width: `clamp(120px,10vw,177px)`.
- Image aspect-ratio 177/287, rounded-2xl.
- Dark green circular Play button centered near bottom.
- Text below play button: "Watch Product Reviews on TikTok and YouTube".

Bottom three images:
- Absolutely positioned bottom-0 left-0 right-0, z-10.
- Flex row, items-end, no gaps.
- Left image: `flex-1`, max-height `min(70vh, 55vw)`.
- Center image: `flex-[1.265]`, max-height `min(85vh, 70vw)`.
- Right image: `flex-1`, max-height `min(70vh, 55vw)`.
- All images are `w-full h-auto block`.

Bottom image overlays:
- Left overlay: "98K+" stat with avatar stack, avatar plus green circle with Plus icon.
- Center overlay: "Best Products for Your Pet" white heading plus "Explore Products" orange pill button with ArrowRight icon.
- Right overlay: "4.6" rating with orange filled Star icon.
- Position all overlays with `bottom: clamp(20px, 4vh, 50px)`.

Tablet layout, md to lg:
- Similar to desktop but smaller.
- Heading: text-7xl.
- Side cards at `top-[80px]`, left-4/right-4, fixed smaller widths 160px and 120px.
- Bottom images use same three-panel flex with maxHeight 60vh, 75vh, 60vh.

Mobile layout, below md:
- Top section has centered title at 36px, subtitle, and "Explore Products" button.
- Two cards side by side, flex gap-3:
  - Product card aspect-square.
  - Video card aspect-3/4.
- Stats row: "98K+" with avatars on left, divider, "4.6" star on right.
- Bottom images use same three-panel flex with no max-height constraint.

Animations:
- Define custom keyframes and classes.
- `.animate-fade-up`: opacity 0 to 1 and translateY 30px to 0, 0.8s, cubic-bezier(0.16, 1, 0.3, 1).
- `.animate-fade-in`: opacity 0 to 1, 0.6s ease-out.
- `.animate-slide-up`: translateY 60px to 0, 0.9s, cubic-bezier(0.16, 1, 0.3, 1).
- `.animate-slide-in-left`: translateX -40px to 0, 0.8s.
- `.animate-slide-in-right`: translateX 40px to 0, 0.8s.
- `.animate-text-reveal`: translateY 40px, skewY 3deg, blur 4px to normal, 1s.
- `.animate-word-pop`: translateY 60px, scale 0.7, rotate -4deg, blur 8px to bounce overshoot and settle, 0.9s with cubic-bezier(0.34, 1.56, 0.64, 1).
- `.animate-scale-in`: scale 0.85 to 1, 0.7s.
- `.animate-photo-reveal`: translateY 80px and scale 1.02 to normal, 1.1s.
- All use animation-fill-mode both.
- `.animate-word-pop` starts opacity 0.
- Delay classes from `.delay-100` through `.delay-1200`.

Stagger order:
1. Header fades in from 100 to 300ms.
2. Heading words pop in from 200 to 600ms.
3. Side cards slide in from 600 to 700ms.
4. Bottom photos reveal upward from 600 to 900ms, center first.
5. Overlay stats and buttons pop in from 1000 to 1200ms.

Lucide icons:
- Search, ShoppingCart, Star, ArrowUpRight, Play, ArrowRight, Plus.
