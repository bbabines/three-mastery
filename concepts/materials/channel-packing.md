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

Channel packing stores several grayscale maps in one texture, one per color channel, the way glTF stores roughness in green and metalness in blue.

## Cost lens

One texture instead of three: one download, one upload, and a third of the GPU memory of three separate textures of the same size.
