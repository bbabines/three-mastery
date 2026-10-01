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

Connect one packed ORM texture to roughness and metalness, mark it as data, and configure mipmaps plus anisotropic filtering for a tiled surface. Use the supplied object or values; return the requested answer so the preview can run it. Keep unrelated settings intact.

<div data-scene="preview"></div>

## Your code

Write `packedTiledSurface` in `drills/2/materials/texture-sampling/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/texture-sampling/apply-1
```

## The check

The test covers the intended behavior on more than one input and also checks settings that the function should leave alone.

<details><summary>Hint</summary> Green is roughness and blue is metalness in a packed ORM map; three.js reads those channels from their respective map slots. </details>

## Where else?

Why would a tiled ORM map shimmer at a grazing angle without mipmaps?

<details><summary>A starting point</summary> Compare the material or light properties before and after your function returns. </details>
