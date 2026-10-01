---
id: 2.queries.bvh.apply.1
loop: 2
tier: core
concepts: [queries.bvh]
mode: apply
context: queries.bvh/collision
lenses: [cost]
misconceptions: []
---

# BVH: count the box tests saved

> **The job:** Count boxes visited by a bounds-tree ray query.

## Task

Return how many node boxes a ray tests while descending only through hit boxes. Include a missed node in the count, because testing its box was still work.

| Function | Return |
| --- | --- |
| `boxTestsForRay(ray: THREE.Ray, root: THREE.Object3D)` | The number of bounds tests, including misses. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/queries/bvh/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/bvh/apply-1
```

## The check

The test counts a missed box but skips its children, and stops at the root when the ray points away.

<details><summary>Hint</summary>

Measure the work done by the tree, not just the leaves returned.

</details>

## Where else?

Where else can pruning a missed branch save many tests?

<details><summary>A few answers</summary> Dense mesh picking, shape casts, or collision broad phases. </details>
