---
id: camera.camera-relative
name: Camera-relative directions
domain: camera
tier: light
prerequisites: [math.cross-product, camera.view-matrix, rotation.rotation-basis]
misconceptions:
  forward-plus-z: '"Camera forward is +Z."'
contexts:
  screen-pan: Screen-aligned panning
  wasd: WASD movement
  drag-parallel: Dragging parallel to the view
---

## Definition

A camera looks down its own −Z, so its forward, right, and up in the world come from its own axes turned by its matrix, not from the world's axes.

## Space lens

All three are directions in the world. They come from the camera's own axes: right is its own +X, up on screen its own +Y, and forward its own −Z.
