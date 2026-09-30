---
id: queries.ray-aabb
name: Ray–AABB
domain: queries
tier: light
prerequisites: [queries.ray, geometry.bounding-volumes]
misconceptions:
  inside-misses: '"A ray that starts inside the box misses it." It hits on the way out.'
contexts:
  early-out: Early-out
  bvh-node: BVH node test
  grid-lookup: Grid lookup
---

## Definition

A ray–box test says whether a ray touches a box lined up with the axes, and where it first does, treating the box as solid.

## Space lens

The box and the ray must be in the same space. `new Box3().setFromObject(object)` gives a box in the world, next to `raycaster.ray`; `geometry.boundingBox` is measured from the object itself.

## Cost lens

One box test is a few divisions and comparisons, so testing a box around a group of many parts first can skip every test inside it.
