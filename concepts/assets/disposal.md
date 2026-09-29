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

Taking an object out of the scene frees nothing on the GPU: its geometries, materials, and textures stay there until you call `dispose()` on each one, and only the code that owns a resource should do that, once nothing else still uses it.

## Cost lens

Every model that's removed but not disposed keeps its full GPU memory, so memory climbs with each swap. Disposing something that's still in use frees nothing for long: the next render that draws it uploads or compiles it again, the same work as the first time.
