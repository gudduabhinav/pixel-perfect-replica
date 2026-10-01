# 360° Room Paint Visualizer

An interactive panorama viewer where you look around a room, tap a wall, and repaint it instantly — shadows and texture preserved.

## What gets built

**Main page (/)** — full-screen 360° room you can drag/swipe to look around, pinch/scroll to zoom, with floating controls on top.

Controls:
- Colour palette bar with popular paint shades (name, hex, code), grouped swatches
- Room switcher: Living Room, Modern Bedroom, Minimalist Kitchen
- Surface selector: tap a wall in the scene, or pick from a list (Wall A, Wall B, Accent Wall, Ceiling)
- Before/After toggle plus a drag slider to compare original vs painted
- Reset all, and Download image of the current view

## How the colour looks real

The repaint is done in a shader on the GPU: the original photo's brightness (lights, shadows, texture grain) is kept, while only the hue/saturation of the selected surface is replaced. A mask defines which pixels belong to which surface, so the paint stops cleanly at edges and never covers furniture.

## Technical notes

- Stack is TanStack Start + React 19 (the project's fixed framework), not Next.js — same React Three Fiber code, just a route file instead of `app/page.jsx`.
- Packages to add: `three`, `@react-three/fiber`, `@react-three/drei`.
- Files:
  - `src/components/canvas/RoomViewer360.tsx` — R3F Canvas, inverted `SphereGeometry(500, 60, 40)`, OrbitControls with damping, clamped polar angle, zoom-only FOV, raycast click → surface id from mask texture read.
  - `src/components/canvas/WallShader.ts` — ShaderMaterial: `uBaseTexture`, `uMaskTexture`, up to 4 `uTargetColor`/`uStrength` slots, `uBlendMode` (multiply / overlay / soft-light), RGB→HSL→RGB in GLSL preserving luminance, `uReveal` for the split slider.
  - `src/components/ui/ColorPickerPalette.tsx`, `RoomSwitcher.tsx`, `SurfaceLegend.tsx`, `CompareSlider.tsx`, `ExportButton.tsx`.
  - `src/data/paints.ts`, `src/data/rooms.ts`.
  - `src/routes/index.tsx` — integration page with head metadata.
- Canvas created with `preserveDrawingBuffer` so export via `toDataURL` works.
- WebGL is browser-only: the viewer is loaded lazily behind `ClientOnly` with a skeleton, so server rendering never touches Three.js.
- Panorama images and their matching surface masks are generated as equirectangular assets (base photo + flat colour-coded mask per room) and imported from `src/assets`. Masks use pure R/G/B/Y channels so the shader can resolve a surface id per pixel.
- Design system: dark studio UI, warm neutral accent, glass control bars — tokens in `src/styles.css`, no hardcoded colours in components.

## Caveat

Generated panoramas are approximations of real HDR room captures; geometry at the poles can look soft. Everything stays 100% client-side with no server cost.
