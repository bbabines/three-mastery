---
id: geometry.bounding-volumes
name: Bounding box and sphere
domain: geometry
tier: light
prerequisites: [geometry.buffer-attribute, transforms.matrix-vs-matrixworld]
misconceptions:
  world-space: '"geometry.boundingBox is in world space."'
contexts:
  culling: Culling
  raycast-early-out: Raycast early-out
  camera-fit: Camera fitting
---

## Definition

A geometry's bounding box and bounding sphere are a box lined up with the axes and a ball that fit around its vertices, measured from the object itself.

## Space lens

`geometry.boundingBox` and `geometry.boundingSphere` are measured from the object itself, so they don't follow the mesh. `geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld)` and `new Box3().setFromObject(mesh)` give a box in the world.

## Cost lens

They're cheap tests that let three.js skip expensive work on the CPU: culling tests each object's sphere against the camera's view, and raycasting tests the sphere and then the box before any triangles.
