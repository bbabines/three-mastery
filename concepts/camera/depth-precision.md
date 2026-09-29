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

The depth buffer stores how far away the nearest surface at each pixel is, as a value from 0 at the near plane to 1 at the far plane, and a perspective camera spends most of those values just past the near plane, so `near` decides how finely distant surfaces can be told apart.

## Space lens

The depth buffer's value is NDC z squeezed from −1 to 1 into 0 to 1. `polygonOffsetFactor` and `polygonOffsetUnits` nudge depth in depth-buffer terms, not world units.

## Cost lens

`logarithmicDepthBuffer: true` spreads precision out, but writes depth from the fragment shader, which stops the GPU from skipping hidden pixels before shading them: GPU work for every pixel.
