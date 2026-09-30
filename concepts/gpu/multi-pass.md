---
id: gpu.multi-pass
name: Multi-pass and post-processing
domain: gpu
tier: core
prerequisites: [gpu.render-targets]
misconceptions:
  cheap-filters: '"Post effects are cheap filters."'
contexts:
  selection-outline: Selection outline
  bloom: Bloom
  fxaa: FXAA
---

## Definition

Post-processing renders the scene into a render target, then runs full-screen passes that each read the last picture and write a new one, and the last pass has to put the tone mapping and screen colors back.

## Cost lens

Every full-screen pass is GPU work for every pixel of its picture, and each pass's render targets take GPU memory. Some effects also render the scene again, adding draw calls and vertex work.
