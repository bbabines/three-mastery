---
id: shaders.debug-output
name: Debug output
domain: shaders
tier: core
prerequisites: [shaders.built-in-matrices]
misconceptions:
  final-color-only: '"Only the final color can be inspected."'
contexts:
  verify-spaces: Verifying spaces
  uv-seams: Finding UV seams
  depth-range: Checking depth range
---

## Definition

A shader has no console, so you inspect any value in it by writing that value out as the color, mapped into 0 to 1 first: normals, UVs, depth, positions, masks, or anything else an effect depends on.

## Space lens

A normal shown as a color is in whatever space it was computed in. `MeshNormalMaterial` shows normals measured from the camera, so its colors change as you orbit; world normals need a small shader, and their colors stay put.
