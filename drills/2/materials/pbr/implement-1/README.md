---
id: 2.materials.pbr.implement.1
loop: 2
tier: core
concepts: [materials.pbr]
mode: implement
context: materials.pbr/chrome
lenses: []
misconceptions: [materials.pbr/half-metal]
---

# Pbr: chrome

> **The job:** Configure a standard material as polished chrome: fully metallic, low roughness, and a neutral base color. Return the same material.

## Task

Configure a standard material as polished chrome: fully metallic, low roughness, and a neutral base color. Return the same material. Work from the input values; do not replace an input object when the task asks you to configure it.

The preview calls your answer on a concrete scene. The readout stays at "not answered yet" until your function returns a value.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/pbr/implement-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/pbr/implement-1
```

## The check

The acceptance test uses several inputs and checks both the intended result and settings that must be preserved. Read the failed assertion as a scene symptom, then adjust only your function.

<details><summary>Hint</summary> Metalness is an endpoint for a single physical surface, not a slider for gloss. </details>

## Where else?

What property would you change to turn polished chrome into brushed steel?

<details><summary>A starting point</summary> Trace the same property from the three.js object through the material or light that consumes it. </details>
