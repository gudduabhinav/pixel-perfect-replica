# Simple Indian Home + Paint Mixing Calculator

## Goal
Make the 360° experience feel like a real, modest Indian middle-class home rather than a luxury interior, while adding a useful colour-mixing tool for painters.

## Room redesign
- Replace the current three high-end panoramas with simple square-room scenes: a family living room, practical bedroom, and compact dining room.
- Use believable Indian details sparingly: tiled floors, tube light/fan, grilled window, simple sofa/bed/table, modest curtains and switches.
- Keep furniture low and minimal so all four walls, ceiling, corners, and floor remain easy to inspect while dragging 360°.
- Generate matching wall masks for each new panorama so repainting and wall selection still work in real time.

## Colour mixing calculator
- Add a dedicated “Mix Colour” tool beside the existing palette.
- Let the user choose 2–3 base colours, adjust their ratios, preview the resulting mixed colour, and apply it directly to the selected wall.
- Show a practical painter recipe in parts and millilitres for a chosen total quantity, plus an approximate result notice because real paint varies by brand/base/finish.
- Keep preset paint shades available; custom mixtures will work alongside them.

## Interface polish
- Keep the 360° room as the main full-screen experience and fit the mixer into a focused panel rather than cluttering the room view.
- Improve mobile control placement so room switching, wall selection, palette, mixing, compare, reset, and export remain usable.
- Use the existing dark studio styling and semantic design tokens.

## Validation
- Check the new rooms visually on desktop and mobile.
- Verify dragging shows the full room, every paintable surface can be selected, mixed colours apply instantly, quantities calculate correctly, and export/compare/reset still work.

## Technical details
- Keep Three.js lazy-loaded behind the existing client-only boundary.
- Preserve RGBA mask-driven wall picking and shader repainting.
- Use deterministic RGB weighted mixing for screen preview and clearly label it as an estimate for physical paint.
