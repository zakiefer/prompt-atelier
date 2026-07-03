Stack:
- Vite + React 18 + TypeScript
- Tailwind CSS 3.4
- lucide-react for icons: LogIn, UserPlus, Play, Sparkles, Menu, X
- No Framer Motion; all animations are CSS transition classes.

Fonts:
Load Inter plus Neue Haas Grotesk Text Pro and Neue Haas Grotesk Display Pro in index.html. Body/root font stack:

```css
html, body, #root {
  height: 100%;
  margin: 0;
  font-family: 'Neue Haas Grotesk Display Pro 55 Roman', 'Neue Haas Grotesk Text Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

Video URL:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4

Color Palette:
- Dark green (text, buttons): #1f2a1d
- Medium dark green: #2d3a2a
- Button hover: #2a3827
- Body text green: #4b5b47
- Heading primary: #336443
- Heading accent: #85AB8B
- Bottom-left text: #3d5638
- Bottom-left button bg: #3d5638, hover #2d4228

Architecture:
Two files:
1. BoomerangVideoBg.tsx - captures video frames into canvas, then plays them forward/backward in a seamless boomerang loop at 30fps, max capture width 960px.
2. App.tsx - full hero section.

BoomerangVideoBg behavior:
- Uses a hidden source video and a display canvas.
- Captures frames using requestVideoFrameCallback when available, otherwise requestAnimationFrame.
- On loadedmetadata, plays the video and starts capturing.
- On ended, stops capture, stores frames in a ref, sets framesReady true.
- When frames are ready, hides the video, sizes the canvas to the first frame, then animates index forward and backward at 30fps.
- Cleanup cancels animation frames and removes loadedmetadata/ended listeners.
- Video is muted, playsInline, preload auto, crossOrigin anonymous.
- Canvas and video use w-full h-full object-cover.

App layout:
- Root section: `relative w-full min-h-screen sm:h-screen overflow-hidden`.
- Renders `<BoomerangVideoBg src={BG_VIDEO} className="absolute inset-0 w-full h-full" />`.

Navbar:
- Absolute top, z-30, flex justify-between, px-4 sm:px-6 md:px-10 py-4 sm:py-6.
- Left brand: "LinkFlow" with `TM` superscript, text #2d3a2a.
- Desktop pill nav: hidden lg:flex, bg-white/70 backdrop-blur-md rounded-full pl-6 pr-1 py-1 shadow-sm border border-white/60.
- Links: Purpose, The Process, Tariffs. First active uses font-semibold text #1f2a1d; inactive uses #4b5b47 hover #1f2a1d.
- Button: "Try it Live", bg #1f2a1d hover #2a3827, rounded-full.
- Right desktop links: "Sign Me Up!" with UserPlus and "Enter" with LogIn.
- Mobile menu button swaps Menu/X icons with transition-all duration-300, rotate/scale/opacity states.

Mobile menu:
- Fixed overlay with bg-[#1f2a1d]/40 backdrop-blur-sm.
- Drawer slides from right, `w-[85%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl`, transition-transform duration-500 ease cubic-bezier(0.22,1,0.36,1).
- Nav links stagger in with translate-x/opacity delays `150 + i * 70ms`.
- CTA group delay 400ms.
- Body overflow is locked while menu is open.

Hero copy:
- Centered top copy: relative z-10 flex flex-col items-center text-center pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6.
- H1: "Close the rift linking signals and action". Primary text #336443, accent span #85AB8B. Font sizes text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.75rem] xl:text-[5.25rem], leading 0.95, letterSpacing -0.035em.
- Paragraph: "Shape scattered signals into meaningful outcomes via AI-driven workflows." in #4b5b47.

Bottom-left CTA block:
- Absolute left/right on mobile, left 6/10 on larger screens, bottom 6/8/10.
- Sparkles + "FluxEngineTM" label.
- Copy: "LinkFlow smoothly unites your company systems, streamlining data paths between services without having to write custom scripts."
- Buttons: "Try it Live" and "Know More." with responsive color shifts for mobile/desktop.

Bottom-right video link:
- Hidden on mobile. Play circle button + "How we build?" + duration "1:35".

Animation details:
- Hamburger Menu/X icon swap: transition-all duration-300 with rotate/scale/opacity.
- Mobile overlay: transition-opacity duration-300.
- Mobile drawer: transition-transform duration-500 ease cubic-bezier(0.22,1,0.36,1).
- Mobile nav links stagger with transition-all duration-500.
- Nav buttons use transition-colors; opacity links use transition-opacity.

Dependencies:
react, react-dom, lucide-react, Vite, TypeScript, Tailwind CSS 3.4.
