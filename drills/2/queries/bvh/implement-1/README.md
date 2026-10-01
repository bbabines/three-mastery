---
id: 2.queries.bvh.implement.1
loop: 2
tier: core
concepts: [queries.bvh]
mode: implement
context: queries.bvh/shape-casts
lenses: [cost]
misconceptions: []
---

# BVH: prune boxes before leaves

> **The job:** Visit only branches whose bounds a ray intersects.

## Task

A small teaching bounds tree stores a Box3 in each Object3D node's `userData.bounds`; leaves have `userData.leafId`. Return IDs of leaves whose bounds intersect the forward ray.

| Function | Return |
| --- | --- |
| `candidateLeafIds(ray: THREE.Ray, root: THREE.Object3D)` | IDs of leaf boxes touched by the ray. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/queries/bvh/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/bvh/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A BVH is useful when you stop descending as soon as a node box misses.

</details>

## Where else?

Where else would the same code help? The concept card lists High-poly picking, Collision queries.
