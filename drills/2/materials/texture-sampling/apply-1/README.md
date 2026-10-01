---
id: 2.materials.texture-sampling.apply.1
loop: 2
tier: light
concepts: [materials.texture-sampling, materials.channel-packing]
mode: apply
context: materials.texture-sampling/tiled
lenses: []
misconceptions: [materials.texture-sampling/mipmaps-performance, materials.channel-packing/separate-textures]
---

# Texture sampling: tiled

> **The job:** Connect one packed ORM texture to roughness and metalness, mark it as data, and configure mipmaps plus anisotropic filtering for a tiled surface.

## Task

Connect one packed ORM texture to roughness and metalness, mark it as data, and configure mipmaps plus anisotropic filtering for a tiled surface. Write `packedTiledSurface(material, orm, maxAnisotropy)` and return that material. Use the packed data map for both roughness and metalness.

<div data-scene="preview"></div>

## Your code

Write `packedTiledSurface` in `drills/2/materials/texture-sampling/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/texture-sampling/apply-1
```

## The check

The test checks shared ORM map identity, data color space, mipmaps, anisotropy, and the original material.

<details><summary>Hint</summary> Green is roughness and blue is metalness in a packed ORM map; three.js reads those channels from their respective map slots. </details>

## Where else?

Why would a tiled ORM map shimmer at a grazing angle without mipmaps?

<details><summary>A few answers</summary> Mipmap levels average distant detail; anisotropy helps when the tiled surface is seen at a grazing angle. </details>
