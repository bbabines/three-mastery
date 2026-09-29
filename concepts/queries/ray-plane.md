---
id: queries.ray-plane
name: Ray–plane
domain: queries
tier: core
prerequisites: [queries.ray-from-pointer]
misconceptions:
  every-ray-hits: '"Every ray hits an infinite plane."'
contexts:
  floor-drag: Dragging on a floor
  placement-grid: Placement grid
  measuring: Measuring
---

## Definition

`ray.intersectPlane(plane, target)` gives the spot where a ray crosses an endless flat surface, or `null` when the ray runs parallel to it or points away from it.

## Space lens

A `Plane` is in whatever space you built it in, normally the world, to match `raycaster.ray`. To make a plane follow an object, move it with `plane.applyMatrix4(object.matrixWorld)`.

## Cost lens

One ray–plane test is a few multiplications, with no triangles and no objects to walk through, so it's far cheaper than raycasting a floor mesh.
