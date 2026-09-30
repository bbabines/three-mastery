---
id: materials.lambert
name: Diffuse (Lambert)
domain: materials
tier: core
prerequisites: [math.dot-product, geometry.vertex-normals, materials.lights-tour]
misconceptions:
  depends-on-viewer: '"Diffuse depends on the viewer."'
contexts:
  side-lighting: Side lighting
  terminator: The terminator line
  toon: Toon shading
---

## Definition

Diffuse light is the light a matte surface scatters evenly in every direction, so its brightness depends on how squarely the surface faces the light, not on where it's seen from.

## Space lens

The normal and the direction to the light must be in the same space; three.js's own lighting puts both in view space, measured from the camera. The camera's position still never enters the diffuse result.
