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

Swizzling builds a new vector from another vector's parts, picked by letter in any order, even repeated.

## Space lens

A swizzle picks parts without changing space: `vWorldPos.xz` is still in the world, minus the height. Swapping two axes mirrors whatever it's applied to, so changing between Z-up and Y-up also flips one sign.
