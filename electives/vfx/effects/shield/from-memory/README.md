---
id: vfx.effects.shield.from-memory
elective: vfx
kind: from-memory
concepts: [vfx.cellular-noise, vfx.uv-animation, vfx.depth-effects]
renderer: webgpu
---

# Shield or highlight shell · from memory

Build `shield(part,camera)` in `electives/vfx/effects/shield/from-memory/drill.ts`. Return the visible shell; the viewer handles swaps and disposal. Match the right rack by eye.

<div data-effect="shield"></div>

## Checklist

- The shell fits the selected part's current world bound.
- Cellular veins move through UV animation while the shell stays in place.
- Contact with opaque rack geometry fades using scene depth.
- Transparent additive color writes no depth and disappears on deselection.

Use three.js docs and source without opening guided steps or `/solutions`. Mark done after matching.

<div data-mark-done></div>
