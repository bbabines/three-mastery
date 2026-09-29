---
id: vfx.effects.selection-ring.from-memory
elective: vfx
kind: from-memory
concepts: [vfx.sdf, vfx.uv-animation, vfx.blending-modes]
renderer: webgpu
---

# Selection ring under a clicked part

> **The effect:** click a part of the rack, and a glowing ring appears on the floor under it, with dashes spinning around it.

## The scene

Build it from memory in `electives/vfx/effects/selection-ring/from-memory/drill.ts`. The scene is complete except for the hook, `selectionRing(part)`: it gets the selected part and returns the ring to put under it, or `null` for no ring. The wiring in `effect` already swaps the rings and frees the old one. The floor is at y = 0.

The right rack runs the reference. Match it by eye; the numbers don't need to be exact.

<div data-effect="selectionRing"></div>

## Checklist

- Clicking a part puts a ring on the floor under it. Clicking another part moves it there, and clicking the empty floor removes it.
- The ring is centered under the part and wide enough to surround its footprint, thin parts included.
- It's a soft-edged ring made from a distance field, not a texture.
- Dashes spin around it at a steady speed, with no seam, and the spin uses wrapped time.
- It glows: the ring brightens the floor and never darkens it, and the square around it doesn't show.
- It lies just above the floor, with no flicker as you orbit.

The three.js docs and source are fine to use. AI tools, `/solutions`, and the guided build's steps aren't.

<div data-mark-done></div>
