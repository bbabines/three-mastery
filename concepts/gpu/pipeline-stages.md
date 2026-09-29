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

Every draw call sends its triangles through the same fixed order of stages on the GPU: the vertex shader places each vertex, clipping and culling drop what can't be seen, rasterization turns each triangle into fragments, one per pixel it covers, the fragment shader colors each fragment, and the depth and stencil tests and blending decide what reaches the picture.

## Space lens

The vertex shader outputs clip space; rasterization works in device pixels; a fragment's depth is NDC z squeezed into 0 to 1.

## Cost lens

GPU vertex work runs about once per vertex per draw. GPU work for every pixel runs once per fragment, so it grows with the pixels an object covers, including fragments that are later thrown away or overwritten.
