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

Build a two-band toon diffuse value from Lambert lighting: compare the clamped surface-light cosine against a threshold, returning a bright or dark level. The viewer position is irrelevant. Work from the input values; do not replace an input object when the task asks you to configure it.

The preview calls your answer on a concrete scene. The readout stays at "not answered yet" until your function returns a value.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/lambert/apply-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/lambert/apply-1
```

## The check

The acceptance test uses several inputs and checks both the intended result and settings that must be preserved. Read the failed assertion as a scene symptom, then adjust only your function.

<details><summary>Hint</summary> Normalize the vectors first, then use the cosine to select a band. </details>

## Where else?

Why does a hard band still move when the light moves?

<details><summary>A starting point</summary> Trace the same property from the three.js object through the material or light that consumes it. </details>
