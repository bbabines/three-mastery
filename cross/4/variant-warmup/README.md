---
id: 4.assets.decode-upload-compile.cross.1
loop: 4
tier: core
concepts: [assets.decode-upload-compile, gpu.measurement, optimization.hitch-avoidance]
mode: cross-domain
context: assets.decode-upload-compile/variant-switch
lenses: [cost]
misconceptions: []
---

# Hitch on the first variant switch

> **The job:** combine ideas from several domains in one small piece of code.

## Task

A finish switch hitches the first time because its texture uploads and shader compiles. Write `warmVariants(renderer, scene, camera, mesh, variants)` to draw each variant once before interaction, then restore the original material even if rendering throws. Rendering each is needed to warm both the program and its texture. The scene button shows the first and later switch timings.

<div data-scene="warm"></div>

## Measure

Measure the first and later switch on the same device. Use Chrome's performance tools to see whether upload or compile dominates. A pre-rendered variant can still cost memory, so record `renderer.info.memory.textures` too.

## Your code

Write it in `cross/4/variant-warmup/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/variant-warmup
```

## The check

The check records which material was drawn at each render call and verifies the original is restored after success and failure.

<details><summary>Hint</summary>

Use the relevant three.js methods shown on the concept pages. Check the behavior rather than only the code shape.

</details>

## Where else?

Where else would this choice appear in a product viewer or tool?
