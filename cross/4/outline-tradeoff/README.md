---
id: 4.gpu.multi-pass.cross.1
loop: 4
tier: core
concepts: [gpu.multi-pass, gpu.stencil, materials.materials-tour, shaders.built-in-functions]
mode: cross-domain
context: gpu.multi-pass/fxaa
lenses: [cost]
misconceptions: []
---

# Selection outline: stencil vs post pass

> **The job:** Compare the added draw work of stencil and post-process selection outlines.

## Task

A viewer already runs FXAA, and a selection outline can add work by redrawing selected objects with stencil or by drawing a mask and inspecting its edges in another full-screen pass. Write `outlineWork(selectedDraws, width, height, dpr)` to return the outline's extra draw calls for each method and the pixels touched by its post pass. Count two selected-object draws for stencil, one selected-object mask draw plus one full-screen draw for post. These counts exclude the existing FXAA pass and do not predict frame time.

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

Count selected-object redraws separately from the full-screen pixels. The existing FXAA pass is not new outline work.

</details>

## Where else?

When else is a draw-call versus full-screen-pixel trade-off useful?

<details><summary>A few answers</summary>

Hover highlights, masked glows, or selection outlines on high-DPR displays.

</details>
