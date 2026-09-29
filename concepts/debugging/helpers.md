---
id: debugging.helpers
name: Helpers
domain: debugging
tier: light
prerequisites: [debugging.nothing-renders, camera.frustum, materials.shadows]
misconceptions:
  camera-only: '"CameraHelper is only for cameras." It also shows shadow frustums.'
contexts:
  orientation: Checking orientation
  shadow-frustum: Shadow frustum
  bounds: Bounds
---

## Definition

A helper is a ready-made three.js object, mostly lines, that draws something a scene normally keeps invisible, like an object's axes, its bounds, what a camera or a shadow sees, or its normals.

## Space lens

AxesHelper and ArrowHelper draw in the space of whatever they're added to. BoxHelper, CameraHelper, and VertexNormalsHelper work out their lines in the world, so they belong in the scene itself, not under a moved parent.

## Cost lens

Each helper adds a draw call or two, counted in `renderer.info`, and raycasts hit it. Hide or remove helpers before measuring anything.
