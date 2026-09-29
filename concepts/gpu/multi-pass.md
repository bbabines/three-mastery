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

Post-processing renders the scene into a render target, then runs full-screen passes that each read the last picture and write a new one; an `EffectComposer` chain needs `OutputPass` at the end, or tone mapping and sRGB output are lost (r186's `renderer.setEffects` applies both for you instead).

## Cost lens

Every full-screen pass is GPU work for every pixel of the picture it writes, usually the whole canvas at full device resolution, and each pass's render targets take GPU memory. Some effects also render the scene again: more draw calls and vertex work.
