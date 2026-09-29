---
id: transforms.local-vs-world
name: Local vs world space
domain: transforms
tier: core
prerequisites: [math.point-vs-direction]
misconceptions:
  position-is-world: '"object.position is the world position."'
contexts:
  world-position: A part's world position
  light-on-part: Attaching a light to a part
  nested-compare: Comparing nested objects
---

## Definition

An object's position, rotation, and scale are measured from its parent, while its world position is measured from the scene itself.

## Space lens

`position`, `rotation`, and `scale` are measured from the parent. `getWorldPosition` and the other `getWorld…` methods answer in the world. The vector passed to `localToWorld` is measured from the object itself, not from its parent.
