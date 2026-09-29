---
id: optimization.draw-call-reduction
name: Draw call reduction
domain: optimization
tier: core
prerequisites: [gpu.draw-call-anatomy, geometry.instanced-mesh]
misconceptions:
  instancing-fill-rate: '"Instancing fixes a fill-rate-bound scene."'
contexts:
  repeated-hardware: Repeated hardware
  static-environment: Static environment
  same-material-parts: Many same-material parts
---

## Definition

Draw call reduction draws the same picture with fewer draw calls: parts that never move are merged into one mesh, repeats become one InstancedMesh, and different shapes that share a material become one BatchedMesh.

## Cost lens

Every draw call removed saves CPU time every frame. The GPU still processes the same vertices and the same pixels, so a scene that's slow on pixel work gets no faster. Merging copies each part's vertices into the merged geometry, so merging repeats of one shape costs memory that instancing doesn't.
