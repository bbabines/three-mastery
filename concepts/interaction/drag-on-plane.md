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

Dragging on a plane means finding where the pointer's ray crosses a plane through the grabbed spot on every move, and placing the object at that hit plus the grab offset.

## Space lens

Every drag goes screen pixels → NDC → a ray in the world → a hit in the world → measured from the parent, where `position` lives. The plane, the hit, and the grab offset are in the world, so convert with `parent.worldToLocal` at the end.

## Cost lens

One ray–plane test per pointer move is a few multiplications. The raycast against meshes happens once, on the press.
