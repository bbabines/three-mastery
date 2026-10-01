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

> **The job:** Prepare each finish for its first draw, then put the original finish back.

## Task

A finish switch hitches the first time because its texture uploads and shader compiles. Write `warmVariants(renderer, scene, camera, mesh, variants)` to draw each variant once before interaction, then restore the original material even if rendering throws. Rendering each is needed to warm both the program and its texture. The scene button shows the first and later switch timings.

<div data-scene="warm"></div>

## Measure

Compare the cold first switch with a different variant's first switch after warm-up, then its later switch. Reload before repeating a cold run. Use Chrome's performance tools to see whether upload or compile dominates. A pre-rendered variant can still cost memory, so record `renderer.info.memory.textures` too.

## Your code

Write it in `cross/4/variant-warmup/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/variant-warmup
```

## The check

The check records which material was drawn at each render call and verifies the original is restored after success and failure.

<details><summary>Hint</summary>

A completed download can still leave first-draw GPU work. What happens when each finish is drawn once?

</details>

## Where else?

What else can hitch the first time it appears?

<details><summary>A few answers</summary>

Opening a material picker, enabling a new light setup, or showing a hidden high-resolution variant.

</details>
