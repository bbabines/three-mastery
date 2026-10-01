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

Choose a canvas tone-mapping setup for a lit product with bright highlights, preserving the source color as closely as possible. Return Neutral tone mapping and the supplied exposure, clamped to a useful positive range. Work from the input values; do not replace an input object when the task asks you to configure it.

The preview calls your answer on a concrete scene. The readout stays at "not answered yet" until your function returns a value.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/tone-mapping/implement-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/tone-mapping/implement-1
```

## The check

The acceptance test uses several inputs and checks both the intended result and settings that must be preserved. Read the failed assertion as a scene symptom, then adjust only your function.

<details><summary>Hint</summary> ACES and AgX have a look; Neutral is the product-color choice. Exposure is a multiplier, not a gamma value. </details>

## Where else?

Would the same choice work for a cinematic sunset that intentionally shifts the palette?

<details><summary>A starting point</summary> Trace the same property from the three.js object through the material or light that consumes it. </details>
