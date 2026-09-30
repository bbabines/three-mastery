---
id: rotation.lookat-up
name: lookAt and the up vector
domain: rotation
tier: core
prerequisites: [rotation.rotation-basis, transforms.local-vs-world]
misconceptions:
  same-facing: '"Everything faces the target the same way." Cameras look down −Z; other objects point +Z at the target.'
  spotlight-lookat: '"spotLight.lookAt aims the light." Spot and directional lights shine at their `.target`, whatever their rotation.'
contexts:
  billboards: Billboards
  aiming-spotlight: Aiming a spotlight
  top-down-camera: Top-down camera
---

## Definition

lookAt turns an object to face a point in the world, and the object's up direction settles how it's rolled around that line.

## Space lens

The point and `up` are both in the world, and the turn lookAt sets is measured from the object's parent. A spot light shines toward its target's world position, so the target has to be in the scene.
