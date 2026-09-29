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

`lookAt` turns an object to face a point in the world by building its axes from two directions, toward the point and the object's `up`, so it can't settle the roll when the two line up; cameras and lights turn their −Z toward the point, everything else its +Z.

## Space lens

The point passed to `lookAt` is in the world, and `object.up` is a direction in the world. `lookAt` allows for a turned parent and writes the turn into `quaternion`, measured from the parent; it doesn't support a parent with non-uniform scale. A spot or directional light shines toward its target's world position, so the target has to be in the scene for that position to stay current.
