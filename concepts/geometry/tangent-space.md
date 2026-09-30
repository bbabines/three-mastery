---
id: geometry.tangent-space
name: Tangent space and normal maps
domain: geometry
tier: core
prerequisites: [geometry.vertex-normals, geometry.uvs]
misconceptions:
  world-directions: '"Normal map colors are world directions."'
  green-channel: '"The green channel convention doesn''t matter." glTF and three.js use +Y (OpenGL); Unreal uses −Y (DirectX).'
contexts:
  low-poly-detail: Surface detail on low-poly meshes
  mirrored-uvs: Mirrored UVs breaking lighting
  import-maps: Importing maps from Substance or Unreal
---

## Definition

Tangent space is three directions at each point of a surface, one along the texture's u, one along its v, and one straight out, and a normal map stores its tilts in that space.

## Space lens

Tangent space is a fourth space, measured from the surface at that point, and a normal map's colors are directions in it. The `normal` and `tangent` attributes are measured from the object itself, and three.js turns the map's directions into camera space for lighting.
