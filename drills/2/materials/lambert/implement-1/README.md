---
id: 2.materials.lambert.implement.1
loop: 2
tier: core
concepts: [materials.lambert]
mode: implement
context: materials.lambert/side-lighting
lenses: []
misconceptions: [materials.lambert/depends-on-viewer]
---

# Lambert: side lighting

> **The job:** Compute the Lambert diffuse response from surface normal, light direction, albedo, and irradiance. Normalize directions, clamp the back side to zero, and return one channel of reflected light.

## Task

Compute the Lambert diffuse response from surface normal, light direction, albedo, and irradiance. Normalize directions, clamp the back side to zero, and return one channel of reflected light. Work from the input values; do not replace an input object when the task asks you to configure it.

The preview calls your answer on a concrete scene. The readout stays at "not answered yet" until your function returns a value.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/lambert/implement-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/lambert/implement-1
```

## The check

The acceptance test uses several inputs and checks both the intended result and settings that must be preserved. Read the failed assertion as a scene symptom, then adjust only your function.

<details><summary>Hint</summary> The cosine comes from the angle between the surface normal and the direction toward the light. </details>

## Where else?

What happens when a viewer walks around a matte wall while its light stays still?

<details><summary>A starting point</summary> Trace the same property from the three.js object through the material or light that consumes it. </details>
