---
id: 2.scene-graph.traverse.apply.1
loop: 2
tier: core
concepts: [scene-graph.traverse]
mode: apply
context: scene-graph.traverse/apply-override
lenses: []
misconceptions: []
---

# Traverse: find the product root

> **The job:** Walk upward from a clicked mesh to the part that owns it.

## Task

A ray hits a small child mesh, while the product ID is on an ancestor. Return the nearest ancestor's `userData.productId`, or an empty string when there is none.

| Function | Return |
| --- | --- |
| `productIdForHit(hit: THREE.Object3D)` | The nearest product ID above a clicked mesh, or an empty string. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/scene-graph/traverse/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/traverse/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

The clicked object is a mesh; its metadata may be several parents above.

</details>

## Where else?

Where else would the same code help? The concept card lists Collecting meshes, Finding the product root from a clicked mesh.
