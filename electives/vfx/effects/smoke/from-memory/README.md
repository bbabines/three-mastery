---
id: vfx.effects.smoke.from-memory
elective: vfx
kind: from-memory
concepts: [vfx.flipbooks, vfx.depth-effects, vfx.blending-modes]
renderer: webgpu
---

# Smoke puffs · from memory

Build `smoke(part,camera)` in `electives/vfx/effects/smoke/from-memory/drill.ts`. Return the puffs, their update, and any owned-texture cleanup. The right rack is the reference; the viewer handles selection.

<div data-effect="smoke"></div>

## Checklist

- A small group of puffs rises from the selected part's floor area.
- An eight-frame, four-by-two atlas advances in the intended UV row order.
- Puffs face the camera and fade by age and by the scene-depth gap at the floor.
- They use alpha rather than additive blending, write no depth, and release their atlas on replacement.

Use three.js docs and source without opening guided steps or `/solutions`. Mark done after matching by eye.

<div data-mark-done></div>
