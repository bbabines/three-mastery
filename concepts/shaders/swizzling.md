---
id: shaders.swizzling
name: Swizzling
domain: shaders
tier: light
prerequisites: [shaders.attributes-uniforms-varyings]
misconceptions:
  converts-axes: '"A swizzle alone converts axis conventions." Z-up to Y-up also needs a sign flip.'
contexts:
  ground-distance: Ground-plane distance with .xz
  packed-textures: Packed textures
  axis-conversion: Axis conversion
---

## Definition

Swizzling picks a vector's parts by letter, in any order and even repeated, like `p.xz`, `color.bgr`, or `v.xxx`, and builds a new vector from them in one step.

## Space lens

A swizzle doesn't change space; it only picks parts. `vWorldPos.xz` is still in the world, with the height left out. Swapping two axes mirrors whatever it's applied to, so changing between Z-up and Y-up also flips one sign.
