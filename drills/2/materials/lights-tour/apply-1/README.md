---
id: 2.materials.lights-tour.apply.1
loop: 2
tier: light
concepts: [materials.lights-tour, materials.light-types]
mode: apply
context: materials.lights-tour/softbox-window
lenses: []
misconceptions: [materials.lights-tour/rectarea-any-material, materials.light-types/units-dont-matter]
---

# Lights tour: softbox window

> **The job:** Configure a rectangular softbox and a physically sized point fill. The softbox must face the product, and the point fill must use the requested power in lumens.

## Task

Write `studioLights(width, height, fillLumens)` and return `{ softbox, fill, surface }`. Size and aim the `RectAreaLight` at the product, set the `PointLight.power` in lumens, and use a `MeshStandardMaterial` surface. Initialize `RectAreaLightUniformsLib` before using the area light.

<div data-scene="preview"></div>

## Your code

Write `studioLights` in `drills/2/materials/lights-tour/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/lights-tour/apply-1
```

## The check

The test checks the area light's size and aim, the point light's power, the lit surface, and uniform-library initialization.

<details><summary>Hint</summary> A RectAreaLight has width, height, and a direction; a PointLight exposes power in lumens. </details>

## Where else?

What changes if the product mesh uses `MeshBasicMaterial` under this softbox?

<details><summary>A few answers</summary> `MeshBasicMaterial` ignores these lights. Use a lit material when the softbox should shade the product. </details>
