---
id: 4.materials.pbr.cross.1
loop: 4
tier: core
concepts: [assets.gltf-structure, materials.pbr, materials.color-spaces, shaders.debug-output]
mode: cross-domain
context: assets.gltf-structure/audit-materials
lenses: []
misconceptions: []
---

# Roughness looks wrong on a packed map

> **The job:** Show packed roughness as raw grayscale before changing the lighting.

## Task

While auditing an imported product's materials, a powder-coated steel finish looks too glossy. Its packed material map stores roughness in the green channel, as linear data. Write `roughnessDebug(packed)` to return a `ShaderMaterial` that draws that green channel as a raw grayscale value. Set the map's color space for data, not color. Use the fragment view to verify the map's interpretation before changing lighting.

<div data-scene="channels"></div>

## Your code

Write it in `cross/4/packed-roughness/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/packed-roughness
```

## The check

A browser check renders a one-pixel packed map whose channels differ and reads the output pixel. It fails if the shader uses red or blue, or if the data is color-converted.

<details><summary>Hint</summary>

Roughness is data in one packed channel. Color conversion would change the value being inspected.

</details>

## Where else?

Which other packed channels benefit from a direct debug view?

<details><summary>A few answers</summary>

Metalness, ambient occlusion, or an object-ID mask.

</details>
