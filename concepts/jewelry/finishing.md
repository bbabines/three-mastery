---
id: jewelry.finishing
name: Shadows, glow, and smooth edges
domain: jewelry
prerequisites: [gpu.multi-pass, camera.projection-matrix, materials.shadows, jewelry.polished-metal, jewelry.gem-shader]
misconceptions:
  bloom-expensive: '"Bloom makes everything look expensive."'
  msaa-enough: '"antialias: true smooths every edge."'
  white-is-white: '"A white background color always shows as white."'
  sharp-shadow: '"A sharp shadow looks more real than a soft one."'
  one-view: '"If it looks good from one view, it looks good from every view."'
contexts:
  product-viewer: Finishing a product viewer
  match-reference: Matching a reference render
  still-shots: Rendering still product shots
---

## Definition

The finishing layer is everything after the materials: a long lens and chosen views, a soft shadow baked once onto the ground, darkening in the gaps, a little contrast, a faint glow on only the brightest sparkles, and edges smoothed by averaging slightly shifted frames.

## Cost lens

The shadow is baked once and then free, and bloom adds 13 full-screen draws every frame. Ambient occlusion draws the scene again every frame. Averaging redraws the scene for 32 frames only while the view is still, then stops drawing it. The closer the camera, the more pixels the gem shader runs on.
