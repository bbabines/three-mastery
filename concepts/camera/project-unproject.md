---
id: camera.project-unproject
name: project and unproject
domain: camera
tier: core
prerequisites: [camera.clip-ndc-screen]
misconceptions:
  behind-camera: '"A point behind the camera always lands off-screen." It can land on-screen; check z.'
contexts:
  labels-3d: 3D labels
  under-cursor: Placing an object under the cursor
  build-ray: Building a ray
---

## Definition

`v.project(camera)` takes a spot in the world to NDC in one call, and `v.unproject(camera)` takes a spot in NDC, with a z you choose for its depth, back into the world.

## Space lens

`project` goes from the world to NDC; `unproject` goes from NDC to the world. Neither refreshes the camera's matrices first. In what you pass to `unproject`, z −1 is the near plane and 1 the far plane, and the depths in between aren't evenly spread.

## Cost lens

A `project` call is a few multiplications: hundreds of labels a frame are fine CPU work, and with HTML labels, moving the elements usually costs more than the math. Thousands of markers belong in a shader or `Points` (a rule of thumb).
