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

Every material is two small programs on the GPU: the vertex shader runs once for each vertex and says where it lands, and the fragment shader runs once for each fragment a triangle covers and says what color it is.

## Space lens

The vertex shader starts from `position`, measured from the object itself, and must hand back `gl_Position` in clip space. The fragment shader works on one fragment at one spot on the canvas, counted in device pixels.

## Cost lens

Vertex work grows with the vertex count and repeats in every pass that draws the mesh, shadow passes included. Fragment work is GPU work for every pixel: the pixels an object covers, times overdraw, times the pixel ratio squared. As a rule of thumb, it's most of a scene's GPU time.
