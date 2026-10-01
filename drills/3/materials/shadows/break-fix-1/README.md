---
id: 3.materials.shadows.break-and-fix.1
loop: 3
tier: light
concepts: [materials.shadows]
mode: break-and-fix
context: materials.shadows/fit-directional
lenses: [cost]
misconceptions: [materials.shadows/bigger-map]
---

# Shadows: repair the preview

> **The job:** Fit a directional shadow camera around a product before spending more map pixels.

## Task

The contact shadow stays blocky even after map resolution grows. Repair `fitProductShadow`. Keep unrelated settings intact and watch the readout change.

<div data-scene="preview"></div>

## Measure

Record map size and frustum width. Compare texels per world unit; frame time is a measurement, not a pass threshold.

## Your code

Fix `drills/3/materials/shadows/break-fix-1/drill.ts`, then write the cause in `cause.md` and a short regression assertion in `check.ts`.

```
npm run drill -- drills/3/materials/shadows/break-fix-1
```

## The check

The acceptance test covers the symptom and a second input. Your regression check must fail on the original code and pass after repair.

<details><summary>Hint</summary> Texels per world unit depend on the frustum width as well as map size. </details>

## Where else?

Would a point light have the same shadow-rendering cost?

<details><summary>A few answers</summary> It renders six cube faces, so a point-light shadow is more expensive. </details>
