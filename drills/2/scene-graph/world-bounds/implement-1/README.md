---
id: 2.scene-graph.world-bounds.implement.1
loop: 2
tier: core
concepts: [scene-graph.world-bounds]
mode: implement
context: scene-graph.world-bounds/camera-fit
lenses: [space]
misconceptions: []
---

# World bounds: measure a rotated model

> **The job:** Return the world-space size of a whole model, including hidden children.

## Task

A product has rotated and hidden child meshes. Update the tree, then return the tight world-space Box3 size. The model must stay where it is.

| Function | Return |
| --- | --- |
| `tightWorldSize(root: THREE.Object3D)` | The tight world-space size as a Vector3. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/scene-graph/world-bounds/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/world-bounds/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

The geometry bounding box alone is in local space.

</details>

## Where else?

Where else would the same code help? The concept card lists Floor placement, Footprint measurement.
