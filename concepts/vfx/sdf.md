---
id: vfx.sdf
name: Signed distance fields
domain: vfx
prerequisites: [math.length, shaders.built-in-functions]
misconceptions:
  painted-textures: '"Masks must be painted textures."'
contexts:
  circle-ring-masks: Circle and ring masks
  rounded-rect-glow: Rounded-rectangle glow
  dissolve-edges: Dissolve edges
---

## Definition

A signed distance field gives every point its distance to a shape's edge, negative inside the shape and positive outside, and smoothstep turns those distances into a mask with a crisp or soft edge.

## Cost lens

A few math operations for every pixel the shape covers, and no texture memory. Each extra shape combined into the field adds its own few operations per pixel.
