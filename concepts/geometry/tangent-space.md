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

Tangent space is a set of three directions at each point of a surface, the tangent along the texture's u, the bitangent along its v, and the normal straight out, and a tangent-space normal map stores, in its colors, directions measured in that space to tilt the lighting pixel by pixel.

## Space lens

Tangent space is a fourth space, alongside the object's own space, the world, and camera space. A normal map's colors are directions in tangent space; `geometry.attributes.tangent` and `normal` are measured from the object itself; three.js turns the map's directions into camera space for lighting. With `normalMapType = ObjectSpaceNormalMap`, a map's colors are measured from the object itself instead.
