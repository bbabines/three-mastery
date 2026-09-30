---
id: geometry.object-types-tour
name: 'Tour: object types'
domain: geometry
tier: light
prerequisites: [transforms.object3d-tour]
misconceptions:
  instanced-batched-same: '"InstancedMesh and BatchedMesh are the same thing." Instances share one geometry; a batch holds different geometries under one material.'
  linewidth: '"linewidth sets how thick a line draws." WebGL ignores it and draws 1-pixel lines.'
contexts:
  rack-shelves: A rack of repeated shelves
  point-cloud: A point cloud scan
  wireframe-dimensions: Wireframe and dimension lines
---

## Definition

An object type decides what three.js draws from a geometry and a material, whether triangles, dots, lines, or a picture that faces the camera, and how many draw calls that takes.

## Cost lens

Every Mesh, Points, Line, and Sprite is at least one draw call, CPU time every frame, even when it shares its geometry and material. An InstancedMesh draws all its copies in one draw call, and a Group costs none, though everything inside it still does.
