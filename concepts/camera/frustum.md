---
id: camera.frustum
name: Frustum
domain: camera
tier: light
prerequisites: [camera.projection-matrix]
misconceptions:
  tests-triangles: '"Frustum culling tests triangles."'
contexts:
  visibility-test: Visibility test
  culling: Culling
  shadow-camera: Fitting a shadow camera
---

## Definition

The frustum is the part of the world a camera can see, bounded by six planes that three.js builds from the projection and view matrices, and three.js skips drawing any object whose bounding sphere lies completely outside it.

## Space lens

`Frustum.setFromProjectionMatrix` takes the projection matrix times the view matrix, and the planes come out in the world. `intersectsObject` moves the object's bounding sphere into the world with its saved `matrixWorld`.

## Cost lens

Culling costs a little CPU time per object every frame and saves a draw call for every object it skips. An object partly in view is drawn whole: the GPU still runs the vertex shader for every one of its vertices.
