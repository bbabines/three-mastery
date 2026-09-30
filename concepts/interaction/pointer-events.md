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

Pointer events are the browser's one set of events for a mouse, a finger, or a pen, and they give the spot in CSS pixels from the window's corner.

## Space lens

The spot is in CSS pixels from the window's top-left corner, and subtracting the canvas's rectangle and dividing by its size turns it into NDC. Device pixels never enter, since the pixel ratio cancels out.
