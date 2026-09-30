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

Clip space is what the lens gives, NDC divides it by w so the view runs from −1 to 1 across and up, and screen pixels stretch NDC over the canvas with y flipped.

## Space lens

NDC runs from −1 to 1 on each axis whatever the canvas size, with y pointing up. Screen pixels are measured from the canvas's top-left corner with y pointing down, in CSS pixels for HTML and pointer events.
