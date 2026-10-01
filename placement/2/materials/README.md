---
id: 2.materials.placement
loop: 2
domain: materials
parts:
  - materials.materials-tour
  - materials.lights-tour
  - materials.color-spaces
  - materials.tone-mapping
  - materials.lambert
  - materials.specular
  - materials.pbr
  - materials.light-types
  - materials.environment-maps
  - materials.shadows
  - materials.baked-lighting
  - materials.texture-sampling
  - materials.channel-packing
  - materials.material-flags
---

# Placement check: materials, lighting, and color

> **What it's for:** find out which parts you can write from memory before Loop 2 practice.

No docs or three.js source for this check. Write all fourteen functions in `placement/2/materials/check.ts`, then run `npm run pick -- done` once. The first attempt counts. A missed part points to its drills.

| Function | Returns |
| --- | --- |
| `unlitType` | Choose a material family for a lit or unlit label. |
| `areaLit` | Whether RectAreaLight can light this material. |
| `mapSpace` | The texture color space for this map channel. |
| `productTone` | The tone mapping that keeps product colors close to source. |
| `diffuseCosine` | Clamped Lambert cosine for arbitrary-length vectors. |
| `halfVector` | Normalized Blinn half vector. |
| `finishMetalness` | Metalness for bare metal or paint over metal. |
| `pointIrradiance` | Point-source intensity at distance, inverse-square. |
| `addEnvironment` | Set an environment light without changing the backdrop. |
| `shadowTexelsPerUnit` | Directional shadow-map texel density. |
| `useSecondUv` | Choose the second UV set for a baked AO map. |
| `mipFilter` | Set mipmapped minification for a distant tiling texture. |
| `unpackOrm` | Read roughness and metalness from an ORM pixel. |
| `oneSided` | Set front-face rendering for a one-sided panel. |
