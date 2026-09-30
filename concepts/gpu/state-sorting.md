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

Every frame, three.js draws solid objects first, grouped by material and nearest first, then see-through objects farthest first, and an object's render order beats both.

## Cost lens

Drawing same-material objects back to back saves CPU time on every draw call, and drawing solid ones front to back saves GPU work for every pixel. The sort itself is a little CPU time every frame.
