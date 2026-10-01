---
id: vfx.effects.sparks.from-memory
elective: vfx
kind: from-memory
concepts: [vfx.particles, vfx.integration-forces, vfx.sprite-facing]
renderer: webgpu
---

# Sparks when a part snaps in · from memory

Build the selection burst in `electives/vfx/effects/sparks/from-memory/drill.ts`. Return an object and its `update(delta)` function from `sparks(part,camera)`. The viewer owns selection and cleanup; the right rack is your visual target.

<div data-effect="sparks"></div>

## Checklist

- A finite burst begins at the selected part's world center.
- Streaks move with elapsed time, gravity, and a lifetime fade.
- Their planes face the camera and align along projected velocity.
- Additive glow has no dark rectangles; changing selection makes a new burst.

Use three.js docs and source without opening the guided steps or `/solutions`. Mark done after matching by eye.

<div data-mark-done></div>
