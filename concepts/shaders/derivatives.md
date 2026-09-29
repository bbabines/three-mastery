---
id: shaders.derivatives
name: Derivatives
domain: shaders
tier: light
prerequisites: [shaders.built-in-functions]
misconceptions:
  extra-geometry: '"Anti-aliased lines need extra geometry."'
contexts:
  aa-grid: Anti-aliased grid
  wireframe: Wireframe
  flat-normals: Flat normals without split vertices
---

## Definition

`dFdx`, `dFdy`, and `fwidth` tell a fragment shader how much a value changes between its pixel and the neighboring pixel across or up, which lets it size an edge to one pixel or find which way the surface faces.

## Space lens

A derivative is a change per screen pixel, so the same surface gives bigger derivatives far away than up close, and smaller ones at a higher pixel ratio. `dFdx(vViewPos)` is a step across the surface, in the space `vViewPos` is in.
