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

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run the Domain 10 skip-render experiment around repeated bounds checks. Record app-logic frame time and allocations in Chrome Performance before and after scratch reuse. Keep the model count fixed; the acceptance test checks the same Box3 identity.

## Your code

Write it in `drills/2/optimization/allocation-hygiene/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/allocation-hygiene/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Box3.setFromObject updates the supplied box instead of allocating a new one.

</details>

## Where else?

Where else would the same code help? The concept card lists Raycast loops, Per-frame updates.
