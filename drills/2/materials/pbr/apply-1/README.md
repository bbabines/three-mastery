---
id: 2.materials.pbr.apply.1
loop: 2
tier: core
concepts: [materials.pbr]
mode: apply
context: materials.pbr/brushed
lenses: []
misconceptions: [materials.pbr/half-metal]
---

# Pbr: brushed

> **The job:** Configure a brushed steel material. Keep metalness at the metal endpoint, make reflections broader than polished chrome, and use the supplied finish color.

## Task

Configure a brushed steel material. Keep metalness at the metal endpoint, make reflections broader than polished chrome, and use the supplied finish color. Work from the input values; do not replace an input object when the task asks you to configure it.

The preview calls your answer on a concrete scene. The readout stays at "not answered yet" until your function returns a value.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/pbr/apply-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/pbr/apply-1
```

## The check

The acceptance test uses several inputs and checks both the intended result and settings that must be preserved. Read the failed assertion as a scene symptom, then adjust only your function.

<details><summary>Hint</summary> Roughness widens reflections; metalness says whether the surface is metal. </details>

## Where else?

Which channel describes scratches in a roughness texture?

<details><summary>A starting point</summary> Trace the same property from the three.js object through the material or light that consumes it. </details>
