---
id: materials.channel-packing
name: Channel packing
domain: materials
tier: light
prerequisites: [materials.pbr, materials.color-spaces]
misconceptions:
  separate-textures: '"Each map is its own texture."'
contexts:
  reading-packed: Reading packed maps
  building-packed: Building packed maps
  wrong-roughness: Wrong-roughness bugs
---

## Definition

Channel packing stores several grayscale maps in one texture, one in each of its red, green, and blue channels: glTF puts roughness in green and metalness in blue, ambient occlusion often shares the same texture in red, and three.js's materials read exactly those channels.

## Cost lens

One texture instead of three: one download, one upload, and one texture for the GPU to bind, at a third of the GPU memory of three separate RGBA textures of the same size.
