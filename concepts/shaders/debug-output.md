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

Any value inside a shader can be inspected by mapping it into 0 to 1 and writing it out as the fragment's color for a moment.

## Space lens

A normal shown as a color is in whatever space it was computed in. `MeshNormalMaterial` shows normals measured from the camera, so its colors change as you orbit; world normals need a small shader, and their colors stay put.
