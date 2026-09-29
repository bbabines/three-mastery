---
id: transforms.pivots
name: Pivots and offset groups
domain: transforms
tier: light
prerequisites: [transforms.local-vs-world]
misconceptions:
  center-rotation: '"Rotation always happens around the geometry''s center."'
  pivot-group-only: '"Turning around another point always needs a parent group."'
  pivot-position: '"With pivot set, position is still where the object''s origin ends up."'
contexts:
  door-hinge: Door hinge
  bbox-center: Rotating around a bounding box center
  corner-scale: Scaling from a corner
---

## Definition

An object turns and resizes around its own origin; to turn it around another point, either put it in a group placed at that point, offset it inside the group, and turn the group, which works in every version, or set the object's `pivot`, added in r183.

## Space lens

`rotation` and `scale` work around the object's own origin, unless `pivot` is set. The pivot group's `position` is measured from its parent, and the object's offset inside it is measured from the group. `object.pivot` is measured from the object itself, before its `scale`, and that point stays at `position` plus `pivot`, measured from the parent. Once the object turns or resizes, its origin swings around that point, so `position` is no longer where the origin is; `getWorldPosition` gives the origin. `geometry.translate` moves the shape's points, measured from the object itself.
