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

Combine a live shadow on a floor with a baked ambient-occlusion texture: receive the live shadow, sample the AO map on UV set 1, and enable the key light shadow. Write `hybridFloor(floor, material, ao, key)` and return the same floor. Connect the AO texture, let the floor receive shadows, and let the key light cast them.

<div data-scene="preview"></div>

## Your code

Write `hybridFloor` in `drills/2/materials/shadows/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/shadows/apply-1
```

## The check

The test checks the AO map and UV channel, floor shadow reception, key-light casting, and original floor.

<details><summary>Hint</summary> An AO map supplies static crevice detail; a moving product still needs a live cast shadow. </details>

## Where else?

Which part of a static room can use baked AO, and which shadow still needs a live light?

<details><summary>A few answers</summary> Static crevices can use baked AO. A moving chair still needs a live cast shadow. </details>
