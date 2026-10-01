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

Create an unlit, front-facing cutout label material from a supplied color and alpha mask; the cutout must discard nearly transparent texels while avoiding costly back faces. Write `unlitCutout(color, mask)` and return a `MeshBasicMaterial`. Use the supplied mask as its map, keep only front faces, and discard nearly clear pixels.

<div data-scene="preview"></div>

## Your code

Write `unlitCutout` in `drills/2/materials/materials-tour/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/materials-tour/apply-1
```

## The check

The test checks the map, CSS color, unlit material type, front faces, alpha cutoff, and depth-writing behavior.

<details><summary>Hint</summary> MeshBasicMaterial ignores lights. FrontSide is enough for a label that faces the camera; alphaTest cuts holes without blending. </details>

## Where else?

Would a `MeshNormalMaterial` label react to the studio lights behind it?

<details><summary>A few answers</summary> `MeshNormalMaterial` ignores studio lights too; it displays normals as colors instead of the chosen label color. </details>
