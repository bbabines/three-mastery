---
id: 2.optimization.allocation-hygiene.implement.1
loop: 2
tier: core
concepts: [optimization.allocation-hygiene]
mode: implement
context: optimization.allocation-hygiene/raycast-loops
lenses: [cost]
misconceptions: []
---

# Allocation: reuse a ray scratch vector

> **The job:** Answer repeated proximity queries without allocating a new result every time.

## Task

Use the supplied scratch Vector3 as the target for `Ray.closestPointToPoint` and return that exact object. The caller can reuse it next frame; do not change the ray or point.

| Function | Return |
| --- | --- |
| `closestInto(ray: THREE.Ray, point: THREE.Vector3, scratch: THREE.Vector3)` | The same scratch Vector3 filled with the nearest ray point. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run the Domain 10 app-logic experiment with render skipped. Query many points with the same scratch vector, then compare Chrome Performance allocation/GC activity and frame time against an allocating version. Record both results; the acceptance test checks object reuse.

## Your code

Write it in `drills/2/optimization/allocation-hygiene/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/allocation-hygiene/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Most three.js query methods accept a target object to fill in place.

</details>

## Where else?

Where else would the same code help? The concept card lists Per-frame updates, Bounds checks.
