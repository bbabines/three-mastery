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

An object's world bounds are one box, lined up with the world's axes, around the object and everything under it, with hidden parts and helpers included.

## Space lens

A geometry's `boundingBox` is measured from the mesh itself, while `setFromObject` gives a box in the world. It refreshes the object and everything under it, but not the parents above it.

## Cost lens

The default box is a little CPU work for each Mesh, and the tight box is CPU work for every vertex. Either is fine after a load or on a click; measure once and keep the box rather than measuring every frame.
