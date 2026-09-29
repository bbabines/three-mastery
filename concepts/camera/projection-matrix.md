---
id: camera.projection-matrix
name: Projection matrix
domain: camera
tier: core
prerequisites: [camera.view-matrix]
misconceptions:
  fov-horizontal: '"FOV is horizontal."'
  fov-dolly: '"Narrowing FOV equals moving closer."'
contexts:
  zoom-dolly: Zoom vs dolly
  ortho-thumbnails: Orthographic thumbnails
  isometric: Isometric views
---

## Definition

A camera's projection matrix is its lens: how much of the world it sees and the nearest and farthest distances it draws, and three.js rebuilds it only when you call `updateProjectionMatrix()`.

## Space lens

It converts spots measured from the camera into clip space, the step before NDC. A perspective camera's `fov` is an angle in degrees, top to bottom; an orthographic camera's `left`, `right`, `top`, and `bottom` are world units measured from the camera.
