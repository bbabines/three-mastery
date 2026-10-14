---
id: tactile.reading-light
name: Reading the light
domain: tactile
prerequisites: [tactile.before-you-light, materials.environment-maps]
misconceptions:
  hdri-is-background: '"Any HDRI will do; it''s just a background."'
  rotation-moves-background: '"Rotating the environment rotates the background too."'
  brighter-more-detail: '"A brighter environment shows more detail."'
contexts:
  product-viewer: Picking the HDRI for a product viewer
  photo-match: Matching a 3D object to a photographed room
  game-prop: Lighting a scanned game prop
---

## Definition

Reading the light means checking the room before the material: gray clay and a gray ball show how one-sided and how tinted the HDRI's light is, a chrome ball shows the room itself, and the environment's rotation and brightness are set apart from what the background shows.

## Cost lens

Choosing or turning an HDRI costs nothing per frame once it's prefiltered (PMREM, once per HDRI). A visible HDRI background adds one full-screen draw.
