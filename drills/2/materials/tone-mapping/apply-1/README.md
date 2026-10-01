---
id: 2.materials.tone-mapping.apply.1
loop: 2
tier: core
concepts: [materials.tone-mapping]
mode: apply
context: materials.tone-mapping/bright-environments
lenses: []
misconceptions: []
---

# Tone mapping: bright environments

> **The job:** Convert exposure in photographic stops into the renderer exposure multiplier while keeping Neutral tone mapping for bright studio lighting.

## Task

Convert exposure in photographic stops into the renderer exposure multiplier while keeping Neutral tone mapping for bright studio lighting. Work from the input values; do not replace an input object when the task asks you to configure it.

The preview calls your answer on a concrete scene. The readout stays at "not answered yet" until your function returns a value.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/tone-mapping/apply-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/tone-mapping/apply-1
```

## The check

The acceptance test uses several inputs and checks both the intended result and settings that must be preserved. Read the failed assertion as a scene symptom, then adjust only your function.

<details><summary>Hint</summary> One stop doubles the light multiplier; a negative stop halves it. </details>

## Where else?

How would you make a bright HDR environment one stop darker without changing its texture?

<details><summary>A starting point</summary> Trace the same property from the three.js object through the material or light that consumes it. </details>
