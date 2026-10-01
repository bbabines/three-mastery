---
id: 3.materials.material-flags.break-and-fix.1
loop: 3
tier: light
concepts: [materials.material-flags]
mode: break-and-fix
context: materials.material-flags/thin-surfaces
lenses: []
misconceptions: [materials.material-flags/doubleside-free]
---

# Material flags: cutouts stack like glass

> **The job:** Render a one-sided perforated wall panel with depth-writing cutouts.

## Task

The panel draws hidden back faces and stacks like transparent glass despite binary holes. Repair `perforatedPanel`. Keep unrelated settings intact and watch the readout change.

<div data-scene="preview"></div>

## Your code

Fix `drills/3/materials/material-flags/break-fix-1/drill.ts`, then write the cause in `cause.md` and a short regression assertion in `check.ts`.

```
npm run drill -- drills/3/materials/material-flags/break-fix-1
```

## The check

The acceptance test covers the symptom and a second input. Your regression check must fail on the original code and pass after repair.

<details><summary>Hint</summary> FrontSide and alphaTest let surviving pixels write depth. </details>

## Where else?

When would a thin leaf need both sides visible?

<details><summary>A few answers</summary> A leaf seen from behind may need DoubleSide; a front-facing wall panel does not. </details>
