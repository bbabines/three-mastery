---
id: camera.depth-precision
name: Depth precision
domain: camera
tier: core
prerequisites: [camera.clip-ndc-screen]
misconceptions:
  far-plane: '"The far plane causes z-fighting." Near is the main lever.'
contexts:
  coplanar-decals: Coplanar decals
  large-scenes: Large scenes
  log-depth: Logarithmic depth trade-off
---

## Definition

A perspective camera's depth buffer spends most of its values just past the near plane, so the near distance decides how finely distant surfaces can be told apart.

## Space lens

The depth buffer's value is NDC z squeezed from −1 to 1 into 0 to 1. `polygonOffsetFactor` and `polygonOffsetUnits` nudge depth in depth-buffer steps, not world units.

## Cost lens

`logarithmicDepthBuffer: true` spreads precision out, but writes depth from the fragment shader, which stops the GPU from skipping hidden pixels before shading them: GPU work for every pixel.
