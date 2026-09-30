---
id: queries.ray-from-pointer
name: Ray from pointer
domain: queries
tier: core
prerequisites: [queries.ray, camera.clip-ndc-screen]
misconceptions:
  window-size: '"Use the window size for NDC." Use the canvas rect.'
contexts:
  click: Click
  hover: Hover
  drag-start: Drag start
---

## Definition

A ray from the pointer starts at the camera and runs out through the spot under the mouse.

## Space lens

The pointer's CSS pixels are measured from the canvas's top-left corner and turned into NDC, and `setFromCamera` turns NDC into a ray in the world.

## Cost lens

Building the ray is a handful of multiplications. Testing it against the scene is the cost, on the CPU, and it grows with the number of objects and triangles tested.
