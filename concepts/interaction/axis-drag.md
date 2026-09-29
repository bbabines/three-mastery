---
id: interaction.axis-drag
name: Axis-constrained drag
domain: interaction
tier: core
prerequisites: [interaction.drag-on-plane, math.projection-rejection]
misconceptions:
  screen-delta: '"Use the screen delta directly."'
contexts:
  gizmo-axis: Gizmo axis
  height-adjust: Height adjustment
  rail-slide: Sliding along a rail
---

## Definition

An axis-constrained drag crosses the pointer's ray with a plane that contains the axis and faces the camera, then keeps only the part of the move that runs along the axis.

## Space lens

The axis, the plane, and the hit are in the world, and the distance along the axis is in world units. The result becomes `position` directly only when the parent is the scene; otherwise convert it with `parent.worldToLocal`.
