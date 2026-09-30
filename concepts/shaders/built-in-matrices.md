---
id: shaders.built-in-matrices
name: Built-in matrices and spaces
domain: shaders
tier: core
prerequisites: [shaders.attributes-uniforms-varyings, transforms.normal-matrix, camera.view-matrix]
misconceptions:
  world-normals: '"normalMatrix gives world normals."'
contexts:
  world-height: Height gradient in world space
  rim-light: View-space rim light
  screen-space: Screen-space effects
---

## Definition

three.js hands a custom vertex shader the matrices that carry a vertex from the object itself to the world, to the camera, and into clip space, plus one that turns normals into the camera's space, not the world's.

## Space lens

`position` and `normal` are measured from the object itself, `modelMatrix` gives the world, and `modelViewMatrix` and `normalMatrix` give values measured from the camera. Two values can only be compared when they're in the same space.
