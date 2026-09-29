---
id: transforms.pivots
name: Pivots and offset groups
domain: transforms
tier: light
prerequisites: [transforms.local-vs-world]
misconceptions:
  center-rotation: '"Rotation always happens around the geometry''s center."'
contexts:
  door-hinge: Door hinge
  bbox-center: Rotating around a bounding box center
  corner-scale: Scaling from a corner
---

## Definition

An object turns and resizes around its own origin, so to turn it around another point you put it in a group placed at that point, offset it inside the group, and turn the group, or, in r186, set the object's `pivot`.

## Space lens

`rotation` and `scale` work around the object's own origin. The pivot group's `position` is measured from its parent, and the object's offset inside it is measured from the group. `object.pivot` is measured from the object itself, before its `scale`, and that point stays at `position` plus `pivot`, measured from the parent. `geometry.translate` moves the shape's points, measured from the object itself.
