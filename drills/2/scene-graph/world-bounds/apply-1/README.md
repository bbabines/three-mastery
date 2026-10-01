---
id: 2.scene-graph.world-bounds.apply.1
loop: 2
tier: core
concepts: [scene-graph.world-bounds]
mode: apply
context: scene-graph.world-bounds/footprint
lenses: [space]
misconceptions: []
---

# World bounds: set a model on the floor

> **The job:** Compute how far a model must move vertically to rest on the floor.

## Task

A model is rotated and offset inside its parent. Return the world-space lift that puts the lowest vertex at world y = 0. Do not move it inside the function.

| Function | Return |
| --- | --- |
| `liftToFloor(root: THREE.Object3D)` | The vertical world-space offset needed to touch the floor. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/scene-graph/world-bounds/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/world-bounds/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

The answer is the negative of the world box minimum y.

</details>

## Where else?

Where else would the same code help? The concept card lists Camera fit, Floor placement.
