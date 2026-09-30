---
id: queries.ray-sphere
name: Ray–sphere
domain: queries
tier: light
prerequisites: [queries.ray, geometry.bounding-volumes]
misconceptions:
  inside-misses: '"A ray that starts inside the sphere misses it." It hits on the way out.'
contexts:
  coarse-hit: Coarse hit test
  sphere-early-out: Bounding sphere early-out
  hotspot: Hotspot hit
---

## Definition

A ray–sphere test says whether a ray touches a ball, and where it first does, counting the way out when the ray starts inside.

## Space lens

The sphere and the ray must be in the same space. `geometry.boundingSphere` is measured from the object itself; `sphere.clone().applyMatrix4(mesh.matrixWorld)` puts it in the world, next to `raycaster.ray`.
