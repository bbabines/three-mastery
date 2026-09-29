---
id: camera.clip-ndc-screen
name: Clip space, NDC, screen
domain: camera
tier: core
prerequisites: [camera.projection-matrix]
misconceptions:
  ndc-y-down: '"NDC y points down like CSS."'
contexts:
  pointer-ndc: Pointer to NDC
  label-position: World point to label position
  off-screen: Off-screen test
---

## Definition

The projection matrix turns a spot into clip space, four numbers; dividing the first three by the fourth, w, gives NDC, where the view runs from −1 to 1 across and up; and stretching NDC over the canvas, with y flipped, gives its pixel.

## Space lens

Clip space is what comes out of the projection matrix, and a vertex shader's `gl_Position`. NDC runs from −1 to 1 on each axis whatever the canvas size, with y pointing up. Screen pixels are measured from the canvas's top-left corner, with y pointing down, in CSS pixels for HTML and pointer events.
