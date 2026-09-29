---
id: interaction.local-world-manipulation
name: Local vs world manipulation
domain: interaction
tier: core
prerequisites: [interaction.axis-drag, rotation.rotation-basis, transforms.local-vs-world]
misconceptions:
  world-axes: '"Axes are always world axes."'
contexts:
  rotated-rail: Moving along a rotated rail
  rotate-in-parent: Rotating relative to a parent
  gizmo-space: Gizmo space toggle
---

## Definition

The same drag or turn can follow the world's axes, which never turn, or the object's own axes, which turn with it; editors call the second choice "local".

## Space lens

The world's X is `(1, 0, 0)` everywhere. The object's own X, as a direction in the world, is `(1, 0, 0)` turned by `getWorldQuaternion`; turned by `quaternion` instead, it's measured in the parent's axes. `rotateOnWorldAxis` takes its axis in the parent's axes, which match the world's only when no parent is turned.
