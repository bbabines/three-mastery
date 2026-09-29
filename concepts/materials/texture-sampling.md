---
id: materials.texture-sampling
name: Texture sampling
domain: materials
tier: light
prerequisites: [geometry.uvs]
misconceptions:
  mipmaps-performance: '"Mipmaps are only a performance feature." They also prevent shimmer.'
contexts:
  grazing-shimmer: Shimmer at grazing angles
  tiled: Tiled textures
  crisp-ui: Crisp UI textures
---

## Definition

Sampling is how the GPU picks a texture's color for each pixel: filtering blends neighboring texels, mipmaps are smaller copies it reads when the texture is far away, anisotropic filtering keeps it sharp at grazing angles, and wrapping, repeat, and flipY decide where each UV lands in the image.

## Cost lens

Mipmaps add a third to a texture's GPU memory. Anisotropic filtering reads more texels for pixels at grazing angles, a little GPU work for every such pixel. Filter and wrap settings go to the GPU with the image, so changing them after it's drawn uploads it again.
