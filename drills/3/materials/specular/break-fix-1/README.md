---
id: 3.materials.specular.break-and-fix.1
loop: 3
tier: light
concepts: [materials.specular]
mode: break-and-fix
context: materials.specular/moving-highlights
lenses: []
misconceptions: [materials.specular/highlights-stay]
---

# Specular: the glint stays at the same strength when the camera shifts to the side of the polished panel.

> **The job:** Let a glossy highlight move as the viewer moves.

## Task

The glint stays at the same strength when the camera shifts to the side of the polished panel. Fix `glint` without replacing unrelated objects or settings. The preview runs the current code; use its readout to check the repaired behavior.

<div data-scene="preview"></div>

## Your code

Repair `drills/3/materials/specular/break-fix-1/drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/materials/specular/break-fix-1
```

## The check

The acceptance test covers the visible symptom and a second input. Your short check must reject the original bug and pass on the repair; `npm run verify` exercises both versions.

<details><summary>Hint</summary> The halfway vector includes both light and viewer directions. </details>

## Where else?

How would a rough surface change this moving highlight?

<details><summary>A few answers</summary> A broader lobe has a lower shininess exponent and remains visible over more view angles. </details>
