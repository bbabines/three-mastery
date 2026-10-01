---
id: 3.assets.memory-math.break-and-fix.1
loop: 3
tier: core
concepts: [assets.memory-math]
mode: break-and-fix
context: assets.memory-math/tab-crash
lenses: [cost]
misconceptions:
  - assets.memory-math/file-equals-memory
---

# Runtime memory: a texture estimate that runs low

> **The job:** estimate how many GPU bytes an RGBA texture and its mip levels occupy.

## Task

`textureBytes(width, height)` receives positive integer dimensions. The uploaded image is 8-bit RGBA and uses the full mip chain down to 1 × 1. The starter's reported budget is low even though its base-image arithmetic is right.

Fix the estimate. Name the omission in `cause.md`, then write a regression assertion in `check.ts`. Change the size slider to see how much memory the budget misses.

<div data-scene="textureBudget"></div>

## Measure

Record the byte estimate at 512 and 2048 pixels square. Compare that with the download size of a compressed image; the GPU keeps decoded texels and mip levels.

## Your code

Edit `drills/3/assets/memory-math/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/assets/memory-math/break-fix-1

## The check

The acceptance test includes rectangular and square textures, the final 1 × 1 mip, and a one-pixel texture. The learner check must reject the original omission.

<details><summary>Hint</summary> Each mip level halves both dimensions until they reach one. The lower levels have a cost even though each is smaller. </details>

## Where else?

Where else does the compressed file size understate runtime memory?

<details><summary>A few answers</summary> Swatch libraries, thumbnail caches, and several simultaneous product variants. </details>
