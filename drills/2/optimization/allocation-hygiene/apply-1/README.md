---
id: 2.optimization.allocation-hygiene.apply.1
loop: 2
tier: core
concepts: [optimization.allocation-hygiene]
mode: apply
context: optimization.allocation-hygiene/bounds-checks
lenses: [cost]
misconceptions: []
---

# Allocation: reuse a bounds scratch box

> **The job:** Measure many model bounds without creating a Box3 on each update.

## Task

Fill the supplied Box3 with a model's current world bounds and return that same Box3. Include hidden descendants and update parent matrices first.

| Function | Return |
| --- | --- |
| `boundsInto(root: THREE.Object3D, scratch: THREE.Box3)` | The same Box3 filled with current world bounds. |

The preview fills one scratch box from the model's current world bounds.

<div data-scene="practice"></div>

## Measure

Repeat world-bounds checks on the same model set with and without a reusable Box3. In Chrome Performance, record allocations and CPU time for both runs.

## Your code

Write it in `drills/2/optimization/allocation-hygiene/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/allocation-hygiene/apply-1
```

## The check

The test checks current world bounds, hidden descendants, and reuse of the supplied Box3.

<details><summary>Hint</summary>

Box3.setFromObject updates the supplied box instead of allocating a new one.

</details>

## Where else?

Where else can a reusable Box3 avoid frame allocations?

<details><summary>A few answers</summary> Update one scratch box in a per-frame culling or picking loop instead of making a new box each time. </details>
