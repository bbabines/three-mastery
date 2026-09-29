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

The stencil buffer holds a small number for every pixel that one draw can write and later draws can test against, so a draw can mark pixels and another can draw only inside or outside the mark; three.js leaves it off until the renderer is created with `{ stencil: true }`, and each material sets it up with `stencilWrite`, `stencilFunc`, `stencilRef`, and `stencilZPass`.

## Cost lens

The stencil test itself is almost free: it runs alongside the depth test for every fragment. An outline made with it costs one more draw call per outlined mesh, where a post-processing outline costs several full-screen passes.
