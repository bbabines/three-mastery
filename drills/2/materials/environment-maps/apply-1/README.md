---
id: 2.materials.environment-maps.apply.1
loop: 2
tier: core
concepts: [materials.environment-maps]
mode: apply
context: materials.environment-maps/chrome
lenses: []
misconceptions: []
---

# Environment maps: chrome

> **The job:** Give a chrome product material its own reflection texture and intensity without replacing the material; use full metalness and low roughness.

## Task

Give a chrome product material its own reflection texture and intensity without replacing the material; use full metalness and low roughness. Work from the input values; do not replace an input object when the task asks you to configure it.

The preview calls your answer on a concrete scene. The readout stays at "not answered yet" until your function returns a value.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/environment-maps/apply-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/environment-maps/apply-1
```

## The check

The acceptance test uses several inputs and checks both the intended result and settings that must be preserved. Read the failed assertion as a scene symptom, then adjust only your function.

<details><summary>Hint</summary> A visible scene background is not automatically the material envMap. </details>

## Where else?

When would a scene-wide environment be simpler than a per-material map?

<details><summary>A starting point</summary> Trace the same property from the three.js object through the material or light that consumes it. </details>
