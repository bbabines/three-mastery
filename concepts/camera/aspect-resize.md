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

When the canvas changes shape, resizing the renderer isn't enough: the camera needs its new aspect and a rebuilt projection matrix too, or the picture stretches to fill the new shape.

## Space lens

`renderer.setSize(w, h)` takes CSS pixels and multiplies them by the pixel ratio for the canvas's real pixels. `camera.aspect` is a plain width ÷ height ratio with no unit.
