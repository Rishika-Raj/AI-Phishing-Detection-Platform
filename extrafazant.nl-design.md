---
version: alpha
name: Extrafazant
description: A stark editorial system mixing oversized condensed sans headlines, elegant serif accents, and electric blue highlights on a soft neutral canvas.
colors:
  primary: "#0038FF"
  secondary: "#101010"
  tertiary: "#F4F4F4"
  neutral: "#FFFFFF"
  surface: "#F4F4F4"
  on-surface: "#101010"
  error: "#D92D20"
  border: "#E5E7EB"
  muted: "#DBDCDD"
typography:
  headline-display:
    fontFamily: Helvetica Now
    fontSize: 192px
    fontWeight: 700
    lineHeight: 230px
    letterSpacing: -3.84px
  headline-xl:
    fontFamily: Helvetica Now
    fontSize: 109px
    fontWeight: 500
    lineHeight: 131px
    letterSpacing: -1.92px
  headline-lg:
    fontFamily: Helvetica Now
    fontSize: 62px
    fontWeight: 500
    lineHeight: 69px
    letterSpacing: -1.73px
  headline-md:
    fontFamily: Helvetica Now
    fontSize: 35px
    fontWeight: 500
    lineHeight: 42px
    letterSpacing: 0px
  body-lg:
    fontFamily: Helvetica Now
    fontSize: 20px
    fontWeight: 500
    lineHeight: 28px
    letterSpacing: -0.8px
  body-md:
    fontFamily: Helvetica Now
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-sm:
    fontFamily: Helvetica Now
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-lg:
    fontFamily: Helvetica Now
    fontSize: 20px
    fontWeight: 500
    lineHeight: 28px
    letterSpacing: -0.8px
  label-md:
    fontFamily: Helvetica Now
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
    letterSpacing: 0px
  label-sm:
    fontFamily: Helvetica Now
    fontSize: 12px
    fontWeight: 700
    lineHeight: 16px
    letterSpacing: 0.06em
  serif-display:
    fontFamily: Serrif
    fontSize: 109px
    fontWeight: 400
    lineHeight: 131px
    letterSpacing: -1.92px
  serif-lg:
    fontFamily: Serrif
    fontSize: 62px
    fontWeight: 400
    lineHeight: 69px
    letterSpacing: -1.73px
  serif-md:
    fontFamily: Serrif
    fontSize: 35px
    fontWeight: 400
    lineHeight: 42px
    letterSpacing: 0px
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 128px
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.tertiary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "81px"
    width: "120px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.sm}"
  button-secondary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "81px"
    width: "120px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  chip:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

# Extrafazant

## Overview
Extrafazant feels like a bold editorial studio site: minimal, high-contrast, and confident, with a distinctly fashion-forward presentation. The composition is spacious and airy, leaving large areas of breathing room around a few oversized statements. The tone is professional but playful in its use of mixed type styles, bright blue accents, and slightly irreverent hierarchy.

## Colors
- **Primary (#0038FF):** A vivid electric blue used for the logo, links, icons, and emphasis states. It gives the page its sharp branded energy and acts as the only saturated accent against the neutral field.
- **Secondary (#101010):** A near-black ink used for body copy, navigation, and the dominant headline mass. It provides strong editorial contrast and carries most of the visual weight.
- **Surface (#F4F4F4):** A soft off-white background that reads as warm light gray. It keeps the interface airy and makes the black typography feel even more assertive.
- **Neutral (#FFFFFF):** Reserved for pure white panels and button surfaces where separation from the background is needed.
- **On-surface (#101010):** The default readable text color on light cards and panels.
- **Border (#E5E7EB):** A subtle divider gray for card and panel boundaries, used sparingly to preserve the flat, refined look.
- **Muted (#DBDCDD):** A light neutral line and control gray for secondary UI details such as toggles, separators, and inactive states.
- **Error (#D92D20):** A reserved alert color for destructive or error states; it should remain rare so the blue accent stays dominant.

## Typography
The system uses a custom Helvetica Now family for almost all UI text, paired with a serif display face named Serrif for contrast in large editorial moments. Helvetica Now is set with tight tracking and medium-to-bold weights for a compressed, contemporary feel, especially in navigation and utility labels. The serif face appears in oversized headlines and subheads to soften the otherwise rigid, modern structure.

Headlines are intentionally dramatic: `headline-display` and `headline-xl` use very large sizes, heavy weight, and negative letter spacing to create a poster-like presence. Smaller headings remain condensed and closely set, preserving the same editorial intensity at reduced scale. Body text is simpler and more restrained, with `body-md` and `body-sm` keeping the interface legible without competing with the display type.

Labels and buttons use compact, functional styling. Uppercase appears in navigation and utility content, with subtle tracking in the smallest labels to emphasize clarity and hierarchy rather than decoration.

## Layout
The layout is centered, spacious, and highly controlled, with a fixed-max-width editorial composition rather than a dense fluid grid. Primary content sits in the middle of a wide viewport, while utility navigation and branding anchor the top edges. Large vertical gaps separate the header, hero copy, and supporting links, creating a clear reading path.

Spacing follows a simple rhythm based on 8px increments, with `sm`, `md`, `lg`, and `xl` stepping up from component-level padding to section-level whitespace. Cards and overlays use modest internal padding, but the page itself relies on much larger negative space to create impact. Section padding should feel generous; avoid crowding content into the edges.

## Elevation & Depth
The system is intentionally flat. Instead of relying on shadows, depth comes from contrast, white panel overlays, thin borders, and the visual layering of type sizes. The only subtle exception is the faint blue outline effect seen in interactive and branded elements, which reinforces the accent color without adding heavy material depth.

Panels such as the cookie notice are distinguished with a white background, a light border, and clear separation from the page background. This keeps hierarchy readable while preserving the editorial minimalism.

## Shapes
The shape language is crisp and understated. Most surfaces are rectangular with very small radii, especially interactive elements like primary buttons (`rounded.sm`) and cards (`rounded.md`). The overall feel is architectural rather than soft, with full-round shapes reserved only for tiny control details or chips.

Hard edges are common in the navigation and cookie panel, reinforcing the structured, modern tone. Avoid large rounded corners unless a component is explicitly meant to feel friendly or utility-like.

## Components
### Buttons
Primary buttons (`button-primary`) are solid, dark, and compact, with white or near-white text and a fixed, substantial minimum height. They should feel decisive and tactile, with modest internal padding and a small radius. Hover states can invert toward the blue accent or otherwise signal interaction without introducing gradients or heavy shadow.

Secondary buttons (`button-secondary`) should remain more neutral and less emphatic than the primary action, using borders or simpler fills when needed. Link-style buttons (`button-link`) are text-first, underlined, and minimal; they should be used for lightweight navigation or discovery actions such as “Ontdek meer.”

### Cards
Cards use the surface color, a 1px border, and moderate padding. They should feel like clean content containers rather than elevated surfaces. Keep card content typography aligned with the global system and avoid decorative chrome.

### Inputs and Toggles
Inputs should be plain, white, and sharply bordered or minimally outlined, with clear focus states driven by the blue accent. Toggle controls and consent settings should stay understated, using muted grays for inactive tracks and blue only when active. The UI favors clarity over ornament.

### Navigation
Top navigation is compact and uppercase, with black text on white or near-white chip-like containers. It should remain lightweight and editorial, not like a heavy app nav bar. Use generous spacing between items and keep labels short.

### Overlays and Notices
Consent dialogs and similar overlays should be boxed, white, and right-aligned when used as a floating element. Divide header, body, and actions with thin lines and restrained spacing. Primary action buttons can use the blue accent, while the reject action should remain dark and low-key.

### Logos and Marks
Brand and partner marks are often rendered in the primary blue, which makes them feel integrated into the identity rather than purely functional. Keep them clean, unshaded, and surrounded by breathing room.

## Do's and Don'ts
- Do keep the layout spacious and centered, with large negative space around headline content.
- Do use electric blue sparingly as the signature accent for links, icons, and brand marks.
- Do mix Helvetica Now with the Serrif display face to preserve the editorial contrast.
- Do keep corners small and surfaces mostly flat, with thin borders instead of heavy shadows.
- Don't introduce soft gradients, glossy effects, or material depth.
- Don't overuse rounded UI; avoid pill shapes unless the control truly calls for them.
- Don't make body copy heavy or oversized; reserve the biggest weights and sizes for display moments.
- Don't clutter the page with too many colors or competing accents; the system should stay stark and focused.