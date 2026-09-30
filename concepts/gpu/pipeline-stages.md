---
id: gpu.pipeline-stages
name: Pipeline stages
domain: gpu
tier: core
prerequisites: [camera.clip-ndc-screen, geometry.buffer-attribute]
misconceptions:
  fragment-is-pixel: '"A fragment is a pixel." It''s a candidate that may be discarded or overwritten.'
contexts:
  transparency-order: Transparency order
  vertex-vs-pixel: Vertex vs pixel cost
  where-discard: Where discard happens
---

## Definition

Every draw call sends its triangles through the same fixed stages on the GPU, from placing each vertex to coloring each fragment to deciding what reaches the picture.

## Space lens

The vertex shader outputs clip space, rasterization works in device pixels, and a fragment's depth is NDC z squeezed into 0 to 1.

## Cost lens

GPU vertex work runs once per vertex for each draw. GPU work for every pixel runs once per fragment, including fragments that are later thrown away or covered.
