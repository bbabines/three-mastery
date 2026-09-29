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

A ray from the pointer starts at the camera and runs through the spot under the mouse; you get it by turning the pointer's position on the canvas into NDC and handing that to `raycaster.setFromCamera`.

## Space lens

`event.clientX` and `clientY` are CSS pixels from the window's top-left corner. Subtracting the canvas rect gives CSS pixels from the canvas's corner, which become NDC. `setFromCamera` turns NDC into a ray in the world.

## Cost lens

Building the ray is a handful of multiplications. Testing it against the scene is the cost, on the CPU, and it grows with the number of objects and triangles tested.
