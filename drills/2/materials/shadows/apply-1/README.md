---
id: 2.materials.shadows.apply.1
loop: 2
tier: light
concepts: [materials.shadows, materials.baked-lighting]
mode: apply
context: materials.shadows/contact-shadow
lenses: []
misconceptions: [materials.shadows/bigger-map]
---

# Shadows: contact shadow

> **The job:** Combine a live shadow on a floor with a baked ambient-occlusion texture: receive the live shadow, sample the AO map on UV set 1, and enable the key light shadow.

## Task

Combine a live shadow on a floor with a baked ambient-occlusion texture: receive the live shadow, sample the AO map on UV set 1, and enable the key light shadow. Use the supplied object or values; return the requested answer so the preview can run it. Keep unrelated settings intact.

<div data-scene="preview"></div>

## Your code

Write `hybridFloor` in `drills/2/materials/shadows/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/shadows/apply-1
```

## The check

The test covers the intended behavior on more than one input and also checks settings that the function should leave alone.

<details><summary>Hint</summary> An AO map supplies static crevice detail; a moving product still needs a live cast shadow. </details>

## Where else?

Which part of a static room can use baked AO, and which shadow still needs a live light?

<details><summary>A starting point</summary> Compare the material or light properties before and after your function returns. </details>
