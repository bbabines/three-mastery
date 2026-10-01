---
id: 3.materials.texture-sampling.break-and-fix.1
loop: 3
tier: light
concepts: [materials.texture-sampling]
mode: break-and-fix
context: materials.texture-sampling/grazing-shimmer
lenses: []
misconceptions: [materials.texture-sampling/mipmaps-performance]
---

# Texture sampling: repair the preview

> **The job:** Stop shimmer on a distant tiled texture.

## Task

The floor sparkles as the camera tilts low because distant texels are sampled too sharply. Repair `distantTile`. Keep unrelated settings intact and watch the readout change.

<div data-scene="preview"></div>

## Your code

Fix `drills/3/materials/texture-sampling/break-fix-1/drill.ts`, then write the cause in `cause.md` and a short regression assertion in `check.ts`.

```
npm run drill -- drills/3/materials/texture-sampling/break-fix-1
```

## The check

The acceptance test covers the symptom and a second input. Your regression check must fail on the original code and pass after repair.

<details><summary>Hint</summary> Mipmaps average distant detail before minification. </details>

## Where else?

Would the same filter suit a pixel-perfect UI sprite?

<details><summary>A few answers</summary> A fixed-scale UI sprite can deliberately use nearest sampling and no mipmaps. </details>
