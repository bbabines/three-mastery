---
id: 4.materials.pbr.cross.1
loop: 4
tier: core
concepts: [assets.gltf-structure, materials.pbr, materials.color-spaces, shaders.debug-output]
mode: cross-domain
context: materials.pbr/brushed
lenses: []
misconceptions: []
---

# Roughness looks wrong on a packed map

> **The job:** combine ideas from several domains in one small piece of code.

## Task

A packed material map stores roughness in the green channel, as linear data. Write `roughnessDebug(packed)` to return a `ShaderMaterial` that draws that green channel as a raw grayscale value. Set the map's color space for data, not color. Use a tiny fragment view so you can tell a channel problem from a lighting problem.

<div data-scene="channels"></div>

## Your code

Write it in `cross/4/packed-roughness/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/packed-roughness
```

## The check

A browser check renders a one-pixel packed map whose channels differ and reads the output pixel. It fails if the shader uses red or blue, or if the data is color-converted.

<details><summary>Hint</summary>

Use the relevant three.js methods shown on the concept pages. Check the behavior rather than only the code shape.

</details>

## Where else?

Where else would this choice appear in a product viewer or tool?
