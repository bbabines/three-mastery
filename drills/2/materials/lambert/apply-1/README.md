---
id: 2.materials.lambert.apply.1
loop: 2
tier: core
concepts: [materials.lambert]
mode: apply
context: materials.lambert/toon
lenses: []
misconceptions: []
---

# Lambert: toon

> **The job:** Build a two-band toon diffuse value from Lambert lighting: compare the clamped surface-light cosine against a threshold, returning a bright or dark level. The viewer position is irrelevant.

## Task

Build a two-band toon diffuse value from Lambert lighting: compare the clamped surface-light cosine against a threshold, returning a bright or dark level. The viewer position is irrelevant. Write `toonDiffuse(normal, toLight, threshold)`. Return 1 for the bright band and 0 for the dark band; do not change either vector.

The preview uses one light angle; the test also checks both sides of the band threshold.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/lambert/apply-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/lambert/apply-1
```

## The check

The test checks both bands with vectors of different lengths and confirms the inputs stay unchanged.

<details><summary>Hint</summary> Normalize the vectors first, then use the cosine to select a band. </details>

## Where else?

Why does a hard band still move when the light moves?

<details><summary>A few answers</summary> A hard band follows the light because its threshold still compares the surface normal with the light direction. </details>
