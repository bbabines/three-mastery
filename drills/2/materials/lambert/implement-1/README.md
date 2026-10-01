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

Compute the Lambert diffuse response from surface normal, light direction, albedo, and irradiance. Normalize directions, clamp the back side to zero, and return one channel of reflected light. Write `lambertResponse(normal, toLight, albedo, irradiance)` and return one channel of diffuse light. Do not change either direction.

The preview shows one matte-light value; the test also checks the unlit back side.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/lambert/implement-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/lambert/implement-1
```

## The check

The test checks front, side, and back lighting with nonunit vectors and unchanged inputs.

<details><summary>Hint</summary> The cosine comes from the angle between the surface normal and the direction toward the light. </details>

## Where else?

What happens when a viewer walks around a matte wall while its light stays still?

<details><summary>A few answers</summary> Its diffuse brightness stays the same as the viewer walks around; only the surface-light angle matters. </details>
