---
id: 2.materials.color-spaces.implement.1
loop: 2
tier: core
concepts: [materials.color-spaces]
mode: implement
context: materials.color-spaces/normal-maps
lenses: []
misconceptions: [materials.color-spaces/all-srgb]
---

# Color spaces: three maps with different jobs

> **The job:** mark the color map as color and leave the normal and roughness maps as data.

## Task

Write `setTextureSpaces(albedo, normal, roughness)`. Return the same three textures after setting their color spaces for a `MeshStandardMaterial`. A manually loaded color map needs sRGB; a normal map and a roughness map contain numbers for lighting and need no color-space conversion. Do not change their other settings.

The preview sphere uses your maps. Its readout should report one sRGB texture and two data textures.

<div data-scene="preview"></div>

## Your code

Write it in `drills/2/materials/color-spaces/implement-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/color-spaces/implement-1
```

## The check

The test checks each map's color space, that the same textures come back, and that wrapping and flipY are left alone.

<details><summary>Hint</summary> A color photograph and a normal map may both be images, but only one holds display colors. Look at `SRGBColorSpace` and `NoColorSpace`. </details>

## Where else?

Which other texture channels are data rather than display color?

<details><summary>A few answers</summary> Metalness, AO, and depth maps. </details>
