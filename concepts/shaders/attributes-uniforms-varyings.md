---
id: shaders.attributes-uniforms-varyings
name: Attributes, uniforms, varyings
domain: shaders
tier: core
prerequisites: [shaders.vertex-vs-fragment, geometry.buffer-attribute]
misconceptions:
  copied-unchanged: '"Varyings are copied unchanged." They''re interpolated across the triangle by default; `flat` turns that off.'
contexts:
  passing-time: Passing time
  color-gradient: Per-vertex color gradients
  barycentric-wireframe: Barycentric wireframe
---

## Definition

An attribute is stored for each vertex, a uniform is one value for the whole draw call, and a varying is handed from the vertex shader to the fragment shader, blended across the triangle.

## Space lens

A varying keeps the space of whatever the vertex shader wrote into it: `position` copied into a varying is still measured from the object itself.

## Cost lens

Changing a uniform is a small upload before the draw call. Changing an attribute means uploading its whole buffer again, unless you mark an update range.
