---
id: 4.gpu.multi-pass.cross.1
loop: 4
tier: core
concepts: [gpu.multi-pass, gpu.stencil, materials.materials-tour, shaders.built-in-functions]
mode: cross-domain
context: gpu.multi-pass/selection-outline
lenses: [cost]
misconceptions: []
---

# Selection outline: stencil vs post pass

> **The job:** combine ideas from several domains in one small piece of code.

## Task

A selection outline can redraw selected objects with stencil, or draw a mask and inspect its edges in a full-screen post pass. Write `outlineWork(selectedDraws, width, height, dpr)` to return the extra draw calls for each method and the pixels touched by the post pass. Count two selected-object draws for stencil, one selected-object mask draw plus one full-screen draw for post. These are work counts, not a prediction of frame time.

<div data-scene="outline"></div>

## Measure

Try several selected-object counts and DPR values in the scene. Write down where post's full-screen pixel cost becomes large and where stencil's repeated selected draws become large. Confirm the actual frame cost in Chrome's performance tools.

## Your code

Write it in `cross/4/outline-tradeoff/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/outline-tradeoff
```

## The check

The check varies both selected draw count and DPR, so leaving out the squared DPR or a pass fails.

<details><summary>Hint</summary>

Use the relevant three.js methods shown on the concept pages. Check the behavior rather than only the code shape.

</details>

## Where else?

Where else would this choice appear in a product viewer or tool?
