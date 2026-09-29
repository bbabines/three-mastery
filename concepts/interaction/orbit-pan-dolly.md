---
id: interaction.orbit-pan-dolly
name: Orbit, pan, dolly
domain: interaction
tier: light
prerequisites: [interaction.controls-tour, math.spherical-coords, camera.projection-matrix]
misconceptions:
  dolly-is-zoom: '"Dolly and zoom are the same."'
contexts:
  product-viewer: Product viewer
  top-down-planner: Top-down planner
  inspect-detail: Inspecting detail
---

## Definition

Orbit swings the camera around a target point, pan slides the camera and the target together across the view, and dolly moves the camera toward or away from the target, which isn't the same as zooming the lens.

## Space lens

`controls.target` and `camera.position` are in the world. `controls.pan(dx, dy)` takes CSS pixels and turns them into a move along the camera's own right and up.
