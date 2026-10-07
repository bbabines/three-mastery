---
id: jewelry.ceramic-pearl
name: Ceramic and pearl from lighting alone
domain: jewelry
prerequisites: [materials.pbr, materials.environment-maps, jewelry.two-environments]
misconceptions:
  glossy-textures: '"Glossy materials need texture maps."'
  more-lights: '"More lights make a glossy surface look shinier."'
  white-pearl: '"A pearl is a white ball."'
contexts:
  glazed-ceramic: Glazed ceramic and enamel
  pearls: Pearls and mother-of-pearl
  glossy-parts: Glossy painted or plastic parts
---

## Definition

Glossy materials like glazed ceramic and pearl get their look from a plain color, the right roughness, and the room they reflect, plus a thin film for a pearl's shifting colors.

## Cost lens

With no texture maps there's nothing extra to download or hold in GPU memory; the environment is shared by every material. Clearcoat and iridescence add GPU work for every pixel they cover, and turning one on from 0 compiles a new shader once.
