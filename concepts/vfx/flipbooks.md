---
id: vfx.flipbooks
name: Flipbooks
domain: vfx
prerequisites: [geometry.uvs]
misconceptions:
  top-left: '"Frame zero is always the top-left cell." Its location depends on the UV origin and atlas layout.'
contexts:
  explosions: Explosion sprites
  smoke: Smoke puffs
  icons: Animated icons
---

## Definition

A flipbook shows one cell of a texture atlas at a time by scaling and offsetting UVs to the chosen frame.

## Cost lens

One texture atlas avoids a texture switch per frame; high-resolution atlases still consume memory and sample bandwidth.
