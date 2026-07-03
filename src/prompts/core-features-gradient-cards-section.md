Build a "Core Features" marketing section as a single centered component with three gradient cards. Use Inter weights 400, 500, 600 loaded from Google Fonts:
`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap`.

Page shell:
- Body: white background #ffffff.
- Padding: 80px top and bottom, 20px left and right.
- Layout: flex centered.
- Font: Inter.
- Global reset:
```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

Container:
- `.c1-container`: max-width 1100px, full width, text-align center.

Header block:
- Badge `.c1-badge`:
  - Text: "Core Features".
  - Font size 0.75rem, weight 600, uppercase, letter-spacing 1px.
  - Gradient text using `linear-gradient(90deg, #F5C344, #F28482, #B567C2)`.
  - Use `-webkit-background-clip: text` and transparent fill.
  - Margin-bottom 16px.
- Title `.c1-title`:
  - Text: "Built for Speed & Quality".
  - Font-size 2.75rem, weight 500, color #0f172a.
  - Letter-spacing -0.02em.
  - Margin-bottom 12px.
- Subtitle `.c1-subtitle`:
  - Text: "Everything you need to go" + `<br>` + "from idea to image".
  - Font-size 1.125rem, color #64748b, line-height 1.5.
  - Margin-bottom 50px.

Grid:
- `.c1-grid`: three equal columns, gap 24px.
- Under 900px: two columns.
- Under 600px: one column and title scales to 2.25rem.

Card base:
- `.c1-card`: 20px border-radius, height 340px.
- Flex column, justify-end.
- Position relative, overflow hidden, text-align left.
- Background #F4F8F9.
- Shadow: `0 10px 30px -10px rgba(0,0,0,0.1)`.
- Card titles h3: 1.05rem, weight 600, color #1e293b, padding 24px, z-index 2.

Card 1 - Smart Prompt Suggestions:
- Class `.c1-card-1`.
- Background: `radial-gradient(circle at 50% 0%, #FFB347 0%, #F9ED96 30%, #F4F8F9 60%, #F4F8F9 100%)`.
- Prompt box:
  - White background, 12px radius, 16px padding.
  - 0.8rem text, color #475569, line-height 1.6.
  - Shadow `0 8px 20px rgba(0,0,0,0.04)`.
  - Absolute top 30px, left 24px, right 24px.
  - Text: "A bright, high-resolution 3D illustration of a cheerful cartoon of a girl character centred against a smooth blue background".
  - Bold phrases use `.c1-blur-text` with clipped gradient `linear-gradient(90deg, #FFB347, #E5A1F5)`, weight 600.
- "Add more details" pill:
  - Absolute top 180px, left 40px.
  - White background, 1px solid black border.
  - Padding 5px 14px, radius 20px.
  - 0.75rem text, weight 600, color #1e293b.
  - Shadow `0 4px 15px rgba(0,0,0,0.08)`.
  - Includes `✦` character styled color #a855f7, font-size 1rem, with 6px gap.
- Cursor SVG arrow:
  - Absolute top 205px, left 110px.
  - 24x24, fill #0f172a, white stroke 1px.
  - Drop shadow `0 4px 6px rgba(0,0,0,0.2)`.
  - z-index 10.
  - Path: `M4 2L20 11L11 13L9 22L4 2Z`.
- Heading: "Smart Prompt Suggestions".

Card 2 - API Access:
- Class `.c1-card-2`.
- Background: `radial-gradient(circle at 50% 0%, #E5A1F5 0%, #F8ACA0 30%, #F4F8F9 60%, #F4F8F9 100%)`.
- `.c1-api-visual`: absolute top 0, left 0, right 0, bottom 70px, flex centered, 24px horizontal padding.
- Image `.c1-network-img`: width 100%, height 180px, object-fit contain, margin-top 20px.
- Image source: https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg
- Heading: "API Access".

Card 3 - Project Library:
- Class `.c1-card-3`.
- Background: `radial-gradient(circle at 50% 0%, #F9ED96 0%, #E5A1F5 30%, #F4F8F9 60%, #F4F8F9 100%)`.
- Mesh overlay `.c1-mesh`:
  - Absolute inset 0.
  - Background image: two linear gradients of `rgba(255,255,255,0.8) 1px, transparent 1px`, one horizontal and one 90deg vertical.
  - Background-size 16px 16px.
  - Mask with `radial-gradient(circle at center top, black 0%, transparent 80%)`.
  - Include `-webkit-mask-image`.
- Folder image `.c1-folder`:
  - Absolute top 50px.
  - Center horizontally with left 50% and transform translateX(-50%).
  - Width 170px.
  - Drop shadow `0 15px 25px rgba(0,0,0,0.08)`.
  - Source: https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/library%20icon.svg
- Search pill `.c1-search`:
  - Absolute top 220px, centered.
  - White background, 1px solid black.
  - Padding 6px 18px, radius 20px.
  - 0.75rem text, weight 500, color #1e293b.
  - Shadow `0 8px 20px rgba(0,0,0,0.06)`.
  - white-space nowrap, gap 8px.
  - Contains a 14x14 lucide-style search SVG, then text "Search in library".
  - Search SVG: circle cx=11 cy=11 r=8, line from 21,21 to 16.65,16.65, stroke #64748b, stroke-width 2, round caps/joins.
- Heading: "Project Library".

Note:
- No animations are defined.
- No JavaScript behavior.
- No hover effects.
- Use Supabase only if persistence is needed, which this section does not require.
