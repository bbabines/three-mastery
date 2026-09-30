---
id: geometry.uvs
name: UVs
domain: geometry
tier: light
prerequisites: [geometry.buffer-attribute]
misconceptions:
  zero-to-one: '"UVs must stay within 0–1."'
contexts:
  texture-mapping: Texture mapping
  box-uvs: Generating box UVs
  lightmap: Lightmap setup
---

## Definition

UVs are two numbers stored at each vertex that say which spot of a texture lands there, usually from 0 to 1 across the image.

## Space lens

UVs live in the texture's own flat space, u across the image and v up it, with no link to where the vertex sits in 3D. What happens past 0 or 1 is up to the texture's wrap setting.
