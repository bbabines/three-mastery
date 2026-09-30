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

Texture sampling is how the GPU picks a color from a texture for each screen pixel, whether the texture is magnified, shrunk, tiled, or seen at a grazing angle.

## Cost lens

Mipmaps add a third to a texture's GPU memory, and anisotropic filtering adds a little GPU work for pixels at grazing angles. Filter and wrap settings go to the GPU with the image, so changing them after it's drawn uploads it again.
