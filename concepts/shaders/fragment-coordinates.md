---
id: shaders.fragment-coordinates
name: Fragment coordinates
domain: shaders
tier: light
prerequisites: [shaders.vertex-vs-fragment, camera.clip-ndc-screen]
misconceptions:
  css-pixels: '"gl_FragCoord matches CSS pixels." It includes DPR.'
contexts:
  screen-patterns: Screen-space patterns
  vignette: Vignette
  post-processing: Post-processing
---

## Definition

A fragment shader can read which pixel it's coloring, and that spot is counted in device pixels from the bottom-left, so the pixel ratio changes its numbers.

## Space lens

`gl_FragCoord.xy` is in device pixels from the bottom-left, y up, while pointer events and HTML layout are in CSS pixels from the top-left, y down. `renderer.getDrawingBufferSize()` gives the canvas in device pixels, and `renderer.getSize()` in CSS pixels.

## Cost lens

Anything drawn for every pixel scales with the number of device pixels, which grows with the pixel ratio squared.
