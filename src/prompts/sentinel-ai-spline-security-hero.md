Create a full-screen dark hero landing page for a security company called "SENTINEL AI" using React, Vite, TypeScript, Tailwind CSS, shadcn/ui, and an embedded Spline 3D scene as the background. The tech stack uses `@splinetool/react-spline` and `@splinetool/runtime`.

Font:
Load Google Fonts Sora weights 300, 400, 500, 600, 700 in index.html. Set `font-sora` as the body font via Tailwind config and apply `font-sora antialiased` on body.

Color theme:
Dark only, no light mode. HSL CSS custom properties:
- --background: 0 0% 10%
- --foreground: 0 0% 96%
- --primary: 119 99% 46%
- --primary-foreground: 0 0% 4%
- --secondary: 0 0% 18%
- --secondary-foreground: 0 0% 96%
- --muted: 0 0% 16%
- --muted-foreground: 0 0% 60%
- --accent: 119 99% 46%
- --accent-foreground: 0 0% 4%
- --destructive: 0 84% 60%
- --border: 0 0% 20%
- --input: 0 0% 20%
- --ring: 119 99% 46%
- --radius: 0.5rem
- --nav-button: 0 0% 18%
- --hero-bg: 0 0% 8%
Map these with `hsl(var(--variable))`, including custom tokens nav-button and hero-bg.

Custom animations:
Tailwind keyframes:
- fade-up: opacity 0, translateY(20px), blur(4px) to opacity 1, translateY(0), blur(0). Animation `fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards`.
- fade-in: opacity 0 to 1, animation `fade-in 0.5s ease-out forwards`.

Navbar:
- fixed top-0 left-0 right-0 z-50, flex justify-between, padding px-8 lg:px-16 py-5.
- Left logo text "SENTINEL" in foreground, text-xl, font-semibold, tracking-tight.
- Center links hidden on mobile: Services, About Us, Projects, Team, Contacts. Each text-sm muted-foreground, hover foreground, uppercase tracking-widest, href to section anchors, gap-8.
- Right: shadcn Button custom navCta variant. Text "Get Quote", bg-nav-button hover bg-nav-button/80 active scale 0.97, hidden below md, rounded-lg uppercase text-xs tracking-widest px-6.

Hero:
- Outer section: `relative min-h-screen flex items-end bg-hero-bg overflow-hidden`.
- Spline background: React.lazy import `@splinetool/react-spline`, wrapped in Suspense fallback `<div className="absolute inset-0 bg-hero-bg" />`. Spline scene URL: https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode. Class `w-full h-full`, inside absolute inset-0.
- Dark overlay: absolute inset-0 bg-black/30 z-[1] pointer-events-none.
- Content container: relative z-10 pointer-events-none w-full max-w-[90%] sm:max-w-md lg:max-w-2xl px-6 md:px-10 pb-10 md:pb-10 pt-32. Anchored bottom-left.

Content:
All elements start `opacity-0 animate-fade-up` with inline animationDelay.
- Heading delay 0.2s: h1 "SENTINEL" white + " AI" primary green. Classes: text clamp(3rem,8vw,6rem), font-bold, leading 1.05, tracking -0.05em, uppercase.
- Subheading delay 0.4s: "We implement security correctly.", foreground/80, clamp(1.125rem,2.5vw,1.875rem), font-light.
- Description delay 0.55s: "Enterprise security systems built in days. AI-powered surveillance deployed with zero-trust architecture. Smart access control set up for your entire facility. All of it done right, not just fast.", muted-foreground, clamp(0.875rem,1.5vw,1.25rem), font-light.
- CTA buttons delay 0.7s: flex wrap gap-3, pointer-events-auto buttons because parent is pointer-events-none. "Book a Call" primary green/near-black and "Our Work" white/background. Rounded-sm, hover brightness, active scale.
- Trust line delay 0.85s: "Trusted security partner. Columbus, OH. 12 systems deployed.", muted-foreground/60 text-xs.

Page wrapper:
`<div className="bg-hero-bg min-h-screen"><Navbar /><HeroSection /></div>`.

Dependencies:
`@splinetool/react-spline`, `@splinetool/runtime`, tailwindcss-animate, shadcn/ui Button with custom variants navCta/hero/heroOutline, class-variance-authority.

Important notes:
Content area has pointer-events-none so clicks pass through to Spline; CTA buttons re-enable with pointer-events-auto. No hamburger menu on mobile; nav links and CTA hide.
