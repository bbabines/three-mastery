---
id: assets.disposal
name: Disposal ownership
domain: assets
tier: core
prerequisites: [assets.reuse-caching]
misconceptions:
  remove-frees: '"remove() frees memory."'
  dispose-everything: '"Dispose everything under a removed object." Only dispose what nothing else still uses.'
contexts:
  variant-switching: Variant switching
  spa-route: SPA route changes
  long-sessions: Long sessions
---

## Definition

Taking an object out of the scene frees nothing on the GPU, and only disposing its geometries, materials, and textures does, which their owner should do once nothing else uses them.

## Cost lens

Every model that's removed but not disposed keeps its full GPU memory. Disposing something still in use only buys a second upload or compile on the next render that draws it.
