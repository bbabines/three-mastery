---
id: 2.materials.materials-tour.apply.1
loop: 2
tier: light
concepts: [materials.materials-tour, materials.material-flags]
mode: apply
context: materials.materials-tour/unlit-ui
lenses: []
misconceptions: [materials.materials-tour/all-react, materials.material-flags/doubleside-free]
---

# Materials tour: unlit ui

> **The job:** Create an unlit, front-facing cutout label material from a supplied color; the cutout must discard nearly transparent texels while avoiding costly back faces.

## Task

Create an unlit, front-facing cutout label material from a supplied color and alpha mask; the cutout must discard nearly transparent texels while avoiding costly back faces. Use the supplied object or values; return the requested answer so the preview can run it. Keep unrelated settings intact.

<div data-scene="preview"></div>

## Your code

Write `unlitCutout` in `drills/2/materials/materials-tour/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/materials-tour/apply-1
```

## The check

The test covers the intended behavior on more than one input and also checks settings that the function should leave alone.

<details><summary>Hint</summary> MeshBasicMaterial ignores lights. FrontSide is enough for a label that faces the camera; alphaTest cuts holes without blending. </details>

## Where else?

Would a `MeshNormalMaterial` label react to the studio lights behind it?

<details><summary>A starting point</summary> Compare the material or light properties before and after your function returns. </details>
