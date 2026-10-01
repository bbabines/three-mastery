---
id: 3.materials.materials-tour.break-and-fix.1
loop: 3
tier: light
concepts: [materials.materials-tour]
mode: break-and-fix
context: materials.materials-tour/debug-view
lenses: []
misconceptions: [materials.materials-tour/all-react]
---

# Materials tour: the surface looks like an ordinary lit product even in normals mode, so rotations do not reveal the rgb normal field.

> **The job:** Show a normal-direction debug view without scene lighting.

## Task

The surface looks like an ordinary lit product even in normals mode, so rotations do not reveal the RGB normal field. Fix `inspectionMaterial` without replacing unrelated objects or settings. The preview runs the current code; use its readout to check the repaired behavior.

<div data-scene="preview"></div>

## Your code

Repair `drills/3/materials/materials-tour/break-fix-1/drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/materials/materials-tour/break-fix-1
```

## The check

The acceptance test covers the visible symptom and a second input. Your short check must reject the original bug and pass on the repair; `npm run verify` exercises both versions.

<details><summary>Hint</summary> A normal debug material is deliberately unlit. </details>

## Where else?

Which other quick debug material ignores scene lights?

<details><summary>A few answers</summary> MeshDepthMaterial and MeshBasicMaterial are useful for inspecting depth and flat color. </details>
