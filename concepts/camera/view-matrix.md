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

The view matrix re-measures any spot in the world from the camera: how far to its right, how far up, and how far in front.

## Space lens

It converts from the world to measured from the camera (view space), the opposite of `camera.matrixWorld`, and a spot in front of the camera has a negative z. It leaves out any scale on the camera.
