---
id: 4.optimization.leak-detection.cross.1
loop: 4
tier: core
concepts: [assets.disposal, scene-graph.safe-mutation, optimization.leak-detection]
mode: cross-domain
context: optimization.leak-detection/variant-cycling
lenses: [cost]
misconceptions: []
---

# Memory climbs after 20 variant swaps

> **The job:** combine ideas from several domains in one small piece of code.

## Task

A product viewer owns some finish materials and textures, while others are shared. Write `swapFinish(mesh, next, ownedMaterials, ownedTextures)` to replace the current finish and dispose only an old material the viewer owns. Dispose its owned maps only when the next material does not still use them. Repeating this swap should not make owned resources grow without bound.

<div data-scene="swaps"></div>

## Measure

Render once before measuring. Swap 20 times and inspect geometry and texture counts in `renderer.info.memory`; materials need disposal-event or program checks because that counter does not list materials. Confirm the result again after another 20 swaps.

## Your code

Write it in `cross/4/variant-leak/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/variant-leak
```

## The check

The check makes 20 swaps and counts disposal events, including an owned old map and a shared map kept by the next finish.

<details><summary>Hint</summary>

Use the relevant three.js methods shown on the concept pages. Check the behavior rather than only the code shape.

</details>

## Where else?

Where else would this choice appear in a product viewer or tool?
