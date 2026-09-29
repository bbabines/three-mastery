---
id: camera.aspect-resize
name: Aspect and resize
domain: camera
tier: light
prerequisites: [camera.projection-matrix]
misconceptions:
  setsize-aspect: '"setSize fixes the aspect."'
contexts:
  window-resize: Window resize
  split-views: Split views
  thumbnail-size: Rendering a thumbnail at a new size
---

## Definition

When the canvas changes shape, `renderer.setSize` resizes the canvas only; the camera needs its own update, `camera.aspect = w / h` and then `camera.updateProjectionMatrix()`, or the picture stretches to fill the new shape.

## Space lens

`renderer.setSize(w, h)` takes CSS pixels and multiplies them by the pixel ratio for the canvas's real pixels. `camera.aspect` is a plain width ÷ height ratio with no unit.
