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

Configure a rectangular softbox and a physically sized point fill. The softbox must face the product, and the point fill must use the requested power in lumens. Use the supplied object or values; return the requested answer so the preview can run it. Keep unrelated settings intact.

<div data-scene="preview"></div>

## Your code

Write `studioLights` in `drills/2/materials/lights-tour/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/lights-tour/apply-1
```

## The check

The test covers the intended behavior on more than one input and also checks settings that the function should leave alone.

<details><summary>Hint</summary> A RectAreaLight has width, height, and a direction; a PointLight exposes power in lumens. </details>

## Where else?

What changes if the product mesh uses `MeshBasicMaterial` under this softbox?

<details><summary>A starting point</summary> Compare the material or light properties before and after your function returns. </details>
