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

The preview shows one selected detail level and cutout setting.

<div data-scene="practice"></div>

## Measure

Keep the part's on-screen size fixed while comparing detail levels. Record frame time and draw calls. For the panel, compare cutout rendering with blended transparency at the same coverage and record both frame times.

## Your code

Write it in `drills/2/optimization/culling-lod/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/culling-lod/apply-1
```

## The check

The test checks distance boundaries and that the cutout keeps surviving pixels depth writing.

<details><summary>Hint</summary>

LOD changes detail per object, not per triangle; an alpha-tested cutout can keep depth rejection.

</details>

## Where else?

Why does an instanced mesh need special culling care?

<details><summary>A few answers</summary> One large batch has one bounds volume, so distant instances may keep the whole batch in view. </details>
