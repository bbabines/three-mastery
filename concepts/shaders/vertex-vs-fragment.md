---
id: shaders.vertex-vs-fragment
name: Vertex vs fragment
domain: shaders
tier: core
prerequisites: [gpu.pipeline-stages]
misconceptions:
  once-per-pixel: '"Fragment shaders run once per pixel." Overdraw runs them more.'
contexts:
  displacement: Displacement
  per-pixel-color: Per-pixel color
  run-counts: Comparing run counts
---

## Definition

Every material is two small programs on the GPU: the vertex shader runs once for each vertex and says where it lands, and the fragment shader runs once for each fragment and says its color.

## Space lens

The vertex shader starts from `position`, measured from the object itself, and hands back `gl_Position` in clip space. The fragment shader works on one spot on the canvas, in device pixels.

## Cost lens

Vertex work grows with the vertex count and repeats in every pass that draws the mesh. Fragment work grows with the pixels covered, overdraw, and the pixel ratio squared, and is usually most of a scene's GPU time.
