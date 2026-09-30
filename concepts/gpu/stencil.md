---
id: gpu.stencil
name: Stencil buffer
domain: gpu
tier: light
prerequisites: [gpu.depth-early-z]
misconceptions:
  outlines-need-post: '"Outlines require post-processing."'
contexts:
  outlines: Outlines
  masks-portals: Masks and portals
  clipping-caps: Clipping caps
---

## Definition

The stencil buffer holds a small number at every pixel that one draw can write and later draws can test, so a draw can stay inside or outside another draw's mark.

## Cost lens

The stencil test itself is almost free, since it runs alongside the depth test. An outline made with it costs one more draw call per outlined mesh, where a post-processing outline costs several full-screen passes.
