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

`gl_FragCoord` tells a fragment shader which pixel it's coloring, counted in device pixels from the bottom-left corner of the canvas or render target, so the pixel ratio changes its numbers.

## Space lens

`gl_FragCoord.xy` is in device pixels, y up, from the bottom-left. Pointer events and HTML layout are in CSS pixels, y down, from the top-left. `renderer.getDrawingBufferSize()` gives the canvas size in device pixels; `renderer.getSize()` gives it in CSS pixels.

## Cost lens

Anything drawn for every pixel scales with the number of device pixels, which grows with the pixel ratio squared.
