---
id: camera.view-matrix
name: View matrix
domain: camera
tier: core
prerequisites: [transforms.inverse-matrices, transforms.update-timing]
misconceptions:
  inverse: '"The view matrix is the camera''s transform." It''s the inverse.'
contexts:
  view-depth: View-space depth
  camera-ui: Camera-relative UI
  billboards: Billboards
---

## Definition

The view matrix, `camera.matrixWorldInverse`, re-measures any spot in the world from the camera: how far to its right, how far up, and how far in front.

## Space lens

It converts from the world to measured from the camera (view space), where x is to the camera's right, y is up on its screen, and a spot in front of the camera has a negative z. `camera.matrixWorld` goes the other way. The view matrix leaves out any scale on the camera.
