---
id: 2.materials.color-spaces.apply.1
loop: 2
tier: core
concepts: [materials.color-spaces]
mode: apply
context: materials.color-spaces/picker-mismatch
lenses: []
misconceptions: []
---

# Color spaces: match a picker color

> **The job:** make an unlit marker use a CSS picker color without tone mapping shifting it.

## Task

Write `matchPicker(material, cssColor)`. Return the same `MeshBasicMaterial` after setting its color from the CSS string and excluding this marker from tone mapping. The renderer is already set to its usual sRGB output. The marker is a UI cue, so it should use the chosen display color even when the rest of the scene is tone mapped.

The preview marker should use the picker color shown in the readout.

<div data-scene="preview"></div>

## Your code

Write it in `drills/2/materials/color-spaces/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/materials/color-spaces/apply-1
```

## The check

The test checks several CSS colors, that the returned material is the one passed in, and that tone mapping is disabled for the marker.

<details><summary>Hint</summary> three.js `Color.setStyle` accepts CSS colors and stores them for lighting. `toneMapped` is a material flag. </details>

## Where else?

What else should keep an exact display color while the 3D scene changes exposure?

<details><summary>A few answers</summary> Selection outlines, product labels, and warning markers. </details>
