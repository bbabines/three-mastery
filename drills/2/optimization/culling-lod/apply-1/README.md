---
id: 2.optimization.culling-lod.apply.1
loop: 2
tier: light
concepts: [optimization.culling-lod, optimization.overdraw]
mode: apply
context: optimization.culling-lod/many-parts
lenses: [cost]
misconceptions: []
---

# Culling and overdraw: choose cheaper distant pixels

> **The job:** Select a lower-detail mesh at distance and make a cutout write depth.

## Task

Return the LOD index from ascending world-distance thresholds. Configure a cutout panel with alphaTest and depth writes rather than translucent blending.

| Function | Return |
| --- | --- |
| `lodLevel(distance: number, thresholds: number[])` | The detail level selected by distance. |
| `makeCutout(material: THREE.MeshBasicMaterial, threshold: number)` | The alpha-tested, depth-writing panel material. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run the Domain 10 vertex-load and shader-swap experiments with the same projected coverage. Record frame time and draw calls before and after distant LOD. For the panel, compare opaque or cutout coverage against blended overdraw; write down both frame times.

## Your code

Write it in `drills/2/optimization/culling-lod/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/culling-lod/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

LOD changes detail per object, not per triangle; an alpha-tested cutout can keep depth rejection.

</details>

## Where else?

Where else would the same code help? The concept card lists Large scenes, Instanced bounds.
