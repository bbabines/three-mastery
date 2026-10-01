---
id: 2.materials.tone-mapping.implement.1
loop: 2
tier: core
concepts: [materials.tone-mapping]
mode: implement
context: materials.tone-mapping/blown-highlights
lenses: []
misconceptions: [materials.tone-mapping/brand-colors]
---

# Tone mapping: blown highlights

> **The job:** Choose a canvas tone-mapping setup for a lit product with bright highlights, preserving the source color as closely as possible. Return Neutral tone mapping and the supplied exposure, clamped to a useful positive range.

## Task

Write `productToneSetup(exposure)` and return `{ toneMapping, exposure }` for a color-critical product. Use Neutral tone mapping, keep positive input exposures, and choose a small positive fallback for zero or negative input.

The preview uses one exposure; the test also checks zero and negative inputs.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/tone-mapping/implement-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/tone-mapping/implement-1
```

## The check

The test checks Neutral for several inputs and requires a positive exposure for zero and negative values.

<details><summary>Hint</summary> ACES and AgX have a look; Neutral is the product-color choice. Exposure is a multiplier, not a gamma value. </details>

## Where else?

Would the same choice work for a cinematic sunset that intentionally shifts the palette?

<details><summary>A few answers</summary> A cinematic sunset may favor a filmic operator when shifting the palette is part of the intended look. </details>
