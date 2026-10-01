---
id: 2.interaction.drag-on-plane.apply.1
loop: 2
tier: core
concepts: [interaction.drag-on-plane]
mode: apply
context: interaction.drag-on-plane/slider-3d
lenses: [space]
misconceptions: []
---

# Plane drag: a wall slider

> **The job:** Constrain a moved point to a wall while keeping where it was grabbed.

## Task

A wall drag uses a world Plane and an initial grab point. Return the movement from the first ray hit to the new ray hit. If either misses, return a zero vector. This delta can be added to an object without snapping.

| Function | Return |
| --- | --- |
| `wallDragDelta(startRay: THREE.Ray, moveRay: THREE.Ray, wall: THREE.Plane)` | The world-space delta along the drag plane. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/drag-on-plane/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/drag-on-plane/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Subtract the initial hit from the new hit so the object keeps its grab offset.

</details>

## Where else?

Where else would the same code help? The concept card lists Floor drag, Wall drag.
