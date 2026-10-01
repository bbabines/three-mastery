---
id: 4.interaction.placement
loop: 4
domain: interaction
parts:
  - interaction.controls-tour
  - interaction.pointer-events
  - interaction.click-vs-drag
  - interaction.hover-selection
  - interaction.orbit-pan-dolly
  - interaction.drag-on-plane
  - interaction.axis-drag
  - interaction.local-world-manipulation
  - interaction.controls-coexistence
  - interaction.focus-on-object
  - interaction.anchoring
  - interaction.frame-rate-independence
  - interaction.interpolation-toolbox
---

# Placement check: Interaction and manipulation

A no-docs check of the decisions in this domain. Write every function in `placement/4/interaction/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `enableSmoothOrbit` | Enable damped orbit controls. |
| `pointerNdc` | Convert pointer pixels in a canvas to NDC. |
| `isDrag` | Separate a drag from a small click jitter. |
| `nextHover` | Keep hover separate from an existing selection. |
| `clampedDistance` | Clamp a dolly move to allowed camera distances. |
| `dragOrigin` | Keep the grab offset while moving on a plane. |
| `railDelta` | Constrain motion to an angled rail. |
| `worldAxis` | Convert a local handle axis to a world direction. |
| `orbitAllowed` | Pause orbit controls while dragging a part. |
| `focusCenter` | Find the clicked object's world bounds center. |
| `anchorPixels` | Anchor a world point to top-left canvas pixels. |
| `dampingAlpha` | Compute a frame-rate-independent easing fraction. |
| `smoothFraction` | Ease a clamped fraction smoothly between zero and one. |
