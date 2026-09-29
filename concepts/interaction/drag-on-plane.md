---
id: interaction.drag-on-plane
name: Drag on a plane
domain: interaction
tier: core
prerequisites: [interaction.click-vs-drag, queries.ray-plane, transforms.local-vs-world]
misconceptions:
  hit-is-position: '"The hit point is where the object goes." Without the grab offset, the object''s origin snaps to the cursor.'
contexts:
  floor-drag: Floor drag
  wall-drag: Wall drag
  slider-3d: 3D slider
---

## Definition

Dragging on a plane means intersecting the pointer's ray with a plane through the grabbed spot on every move, then placing the object at the hit plus the offset it was grabbed at.

## Space lens

Every drag goes screen → NDC → world ray → world hit point → the parent's space (`parent.worldToLocal`) to set `position`. The plane, the hit, and the grab offset are in the world; `position` is measured from the parent.

## Cost lens

One ray–plane test per pointer move is a few multiplications. The raycast against meshes happens once, on the press.
