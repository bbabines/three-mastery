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

three.js hands every ShaderMaterial's vertex shader the matrices that carry a vertex from the object's own measurements to the world (`modelMatrix`), to the camera (`viewMatrix`, or both at once with `modelViewMatrix`), and into clip space (`projectionMatrix`), plus a `normalMatrix` that turns normals into the camera's space, not the world's.

## Space lens

This concept is the space lens for shaders. `position` and `normal` are measured from the object itself; `modelMatrix` and `cameraPosition` are about the world; `modelViewMatrix`, `viewMatrix`, and `normalMatrix` give values measured from the camera; `gl_Position` is clip space. Two values can only be compared when they're in the same space.
