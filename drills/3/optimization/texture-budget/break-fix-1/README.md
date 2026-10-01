---
id: 3.optimization.texture-budget.break-and-fix.1
loop: 3
tier: core
concepts: [optimization.texture-budget]
mode: break-and-fix
context: optimization.texture-budget/thumbnail-textures
lenses: [cost]
misconceptions:
  - optimization.texture-budget/always-sharper
---

# Texture budget: every thumbnail keeps the 4K source

> **The job:** choose enough source texels for the pixels a thumbnail actually covers.

## Task

`textureSize(cssPixels, dpr, sourceSize)` returns a power-of-two size for a square thumbnail texture. It needs at least the number of device pixels along one side, but never more than the source image's power-of-two size. The starter always keeps the source size, even for small thumbnails.

Fix the choice, name the wasted resource in `cause.md`, and write a regression assertion in `check.ts`. Change the thumbnail width in the scene and compare bytes.

<div data-scene="thumbnailBudget"></div>

## Measure

Record the RGBA plus mipmap bytes at the chosen size and at 4096. The texture's download size is a different number; memory and upload cost follow decoded texels.

## Your code

Edit `drills/3/optimization/texture-budget/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/optimization/texture-budget/break-fix-1

## The check

The acceptance test includes small, medium, and larger-than-source display sizes at different DPRs. The regression assertion rejects an unconditional 4K choice.

<details><summary>Hint</summary> `MathUtils.ceilPowerOfTwo` rounds up to a texture size; cap that size by the source. </details>

## Where else?

What other texture surfaces rarely use all source pixels?

<details><summary>A few answers</summary> Swatch cards, distant LODs, and small product previews on phones. </details>
