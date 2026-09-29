---
id: interaction.pointer-events
name: Pointer events
domain: interaction
tier: light
prerequisites: [camera.clip-ndc-screen]
misconceptions:
  dpr-ndc: '"Multiply by DPR before computing NDC."'
contexts:
  click: Click
  touch-tap: Touch tap
  pen-input: Pen input
---

## Definition

Pointer events are the browser's one set of events for a mouse, a finger, or a pen, and their `clientX` and `clientY` are CSS pixels measured from the window's corner, so you subtract the canvas's rectangle to find the spot on the canvas.

## Space lens

`clientX` and `clientY` are CSS pixels from the window's top-left corner. Subtracting `canvas.getBoundingClientRect()` gives CSS pixels from the canvas's top-left corner, and dividing by the rectangle's size gives NDC. Device pixels never enter: the pixel ratio cancels out.
