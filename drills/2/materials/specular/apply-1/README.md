---
id: 2.materials.specular.apply.1
loop: 2
tier: light
concepts: [materials.specular]
mode: apply
context: materials.specular/glossy-matte
lenses: []
misconceptions: [materials.specular/highlights-stay]
---

# Specular: glossy matte

> **The job:** Compute a Blinn-Phong highlight from normal, light direction, view direction, and shininess. The highlight must move with the viewer and narrow as shininess grows.

## Task

Compute a Blinn-Phong highlight from normal, light direction, view direction, and shininess. The highlight must move with the viewer and narrow as shininess grows. Write `blinnHighlight(normal, toLight, toView, shininess)` and return a value from 0 to 1. Do not change the vectors.

<div data-scene="preview"></div>

## Your code

Write `blinnHighlight` in `drills/2/materials/specular/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/specular/apply-1
```

## The check

The test varies view angle and shininess and checks that all three vectors remain unchanged.

<details><summary>Hint</summary> Build the halfway vector from the directions toward the light and viewer, then raise the clamped normal cosine to shininess. </details>

## Where else?

What happens to a glossy highlight when the camera moves but the light stays fixed?

<details><summary>A few answers</summary> The halfway direction changes with the camera, so a glossy highlight moves even when the light stays fixed. </details>
