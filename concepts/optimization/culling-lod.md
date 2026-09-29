---
id: optimization.culling-lod
name: Culling and LOD
domain: optimization
tier: light
prerequisites: [camera.frustum, camera.world-size-per-pixel, geometry.instanced-mesh]
misconceptions:
  per-triangle: '"Culling happens per triangle."'
contexts:
  large-scenes: Large scenes
  many-parts: Many parts
  instanced-bounds: Instanced bounds
---

## Definition

Culling skips whole objects that are out of the camera's view, each tested by its bounding sphere, and LOD (level of detail) swaps in simpler versions of a model the farther it is from the camera.

## Space lens

Culling tests each object's bounding sphere, moved into the world by its `matrixWorld`, against the camera's view. LOD measures the straight-line distance in the world from the camera to the LOD object's own position.

## Cost lens

A culled object costs one quick sphere test on the CPU and nothing else: no draw call, no vertex or pixel work. An object with any part in view costs all of it. LOD cuts vertex work, and draw calls when the far versions have fewer parts, for the memory of the extra versions.
