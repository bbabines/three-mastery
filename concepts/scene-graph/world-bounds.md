---
id: scene-graph.world-bounds
name: World-space bounds
domain: scene-graph
tier: core
prerequisites: [geometry.bounding-volumes, transforms.update-timing, scene-graph.traverse]
misconceptions:
  geometry-box: '"Object bounds equal geometry.boundingBox."'
contexts:
  camera-fit: Camera fit
  floor-placement: Floor placement
  footprint: Footprint measurement
---

## Definition

`new Box3().setFromObject(object)` returns one box around an object and everything under it, in the world and lined up with the world's axes, with hidden objects and helpers included.

## Space lens

A geometry's `boundingBox` is measured from the mesh itself. What `setFromObject` gives back is in the world, as of each object's current transform; it refreshes the object and everything under it, but not the parents above it.

## Cost lens

The default box is CPU work per object: eight corners for each Mesh. `setFromObject(object, true)` is CPU work per vertex, every vertex of every Mesh. Either is fine after a load or on a click; measure once and keep the box rather than measuring every frame.
