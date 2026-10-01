---
id: 3.materials.lights-tour.break-and-fix.1
loop: 3
tier: light
concepts: [materials.lights-tour]
mode: break-and-fix
context: materials.lights-tour/room-from-above
lenses: []
misconceptions: [materials.lights-tour/rectarea-any-material]
---

# Lights tour: the panel is present, but its tabletop stays dark and flat because the returned material does not respond to that light.

> **The job:** Light a tabletop from a broad ceiling panel using a compatible lit material.

## Task

The panel is present, but its tabletop stays dark and flat because the returned material does not respond to that light. Fix `ceilingPanel` without replacing unrelated objects or settings. The preview runs the current code; use its readout to check the repaired behavior.

<div data-scene="preview"></div>

## Your code

Repair `drills/3/materials/lights-tour/break-fix-1/drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/materials/lights-tour/break-fix-1
```

## The check

The acceptance test covers the visible symptom and a second input. Your short check must reject the original bug and pass on the repair; `npm run verify` exercises both versions.

<details><summary>Hint</summary> RectAreaLight works with Standard or Physical and needs its uniform library initialized. </details>

## Where else?

Would the same panel light a Basic material used for UI?

<details><summary>A few answers</summary> No. Basic is unlit; use a physically lit material for the tabletop. </details>
