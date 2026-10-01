---
id: 3.materials.baked-lighting.break-and-fix.1
loop: 3
tier: light
concepts: [materials.baked-lighting]
mode: break-and-fix
context: materials.baked-lighting/ao-crevices
lenses: []
misconceptions: [materials.baked-lighting/reacts-to-moving]
---

# Baked lighting: repair the preview

> **The job:** Sample baked crevice AO from the mesh second UV set.

## Task

The crevice shading follows the main color UVs and lands in the wrong place. Repair `attachCreviceAo`. Keep unrelated settings intact and watch the readout change.

<div data-scene="preview"></div>

## Your code

Fix `drills/3/materials/baked-lighting/break-fix-1/drill.ts`, then write the cause in `cause.md` and a short regression assertion in `check.ts`.

```
npm run drill -- drills/3/materials/baked-lighting/break-fix-1
```

## The check

The acceptance test covers the symptom and a second input. Your regression check must fail on the original code and pass after repair.

<details><summary>Hint</summary> A baked AO texture usually uses `channel = 1` and a `uv1` attribute. </details>

## Where else?

What lighting is still needed when a chair moves past the wall?

<details><summary>A few answers</summary> The chair and its moving shadow need live lighting; baked AO stays static. </details>
