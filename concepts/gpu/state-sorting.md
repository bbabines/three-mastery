---
id: gpu.state-sorting
name: State changes and sorting
domain: gpu
tier: light
prerequisites: [gpu.draw-call-anatomy]
misconceptions:
  scene-order: '"Render order is scene order."'
contexts:
  material-count: Material count
  renderorder-fix: renderOrder fixes
  early-z-benefit: Early-z benefit
---

## Definition

Every frame, with `sortObjects` on (the default), three.js sorts what it draws: opaque objects by `renderOrder`, then material, then front to back; transparent objects by `renderOrder`, then back to front; objects with transmission get their own list, drawn between the two. `renderOrder` always beats distance.

## Cost lens

Drawing same-material objects back to back skips state changes: less CPU time for every draw call. Drawing opaque objects front to back lets the depth test throw away hidden fragments before they're shaded: less GPU work for every pixel. The sort itself is a little CPU time every frame.
