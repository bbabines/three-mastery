---
id: 3.materials.light-types.break-and-fix.1
loop: 3
tier: light
concepts: [materials.light-types]
mode: break-and-fix
context: materials.light-types/studio-product
lenses: []
misconceptions: [materials.light-types/units-dont-matter]
---

# Light types: a distant wall stays bright

> **The job:** Make a point source dim with square distance in scene units.

## Task

The far wall stays too bright when the room doubles in size. Repair `pointIllumination`. Keep unrelated settings intact and watch the readout change.

<div data-scene="preview"></div>

## Your code

Fix `drills/3/materials/light-types/break-fix-1/drill.ts`, then write the cause in `cause.md` and a short regression assertion in `check.ts`.

```
npm run drill -- drills/3/materials/light-types/break-fix-1
```

## The check

The acceptance test covers the symptom and a second input. Your regression check must fail on the original code and pass after repair.

<details><summary>Hint</summary> A point source spreads energy over a sphere whose area grows with distance squared. </details>

## Where else?

What if a model was imported in millimeters but its lights were placed as meters?

<details><summary>A few answers</summary> The 1000-fold distance change makes the point source vastly dimmer. </details>
