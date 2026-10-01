---
id: 2.scene-graph.traverse.implement.1
loop: 2
tier: core
concepts: [scene-graph.traverse]
mode: implement
context: scene-graph.traverse/product-root
lenses: []
misconceptions: []
---

# Traverse: visible mesh list

> **The job:** Collect only meshes in branches that can render.

## Task

A loaded product includes hidden variant branches. Return the Mesh objects in visible branches, including nested ones. Keep the source tree unchanged.

| Function | Return |
| --- | --- |
| `visibleMeshes(root: THREE.Object3D)` | The Mesh objects in visible branches. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/scene-graph/traverse/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/traverse/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Use the traversal variant that stops at a hidden parent.

</details>

## Where else?

Where else would the same code help? The concept card lists Collecting meshes, Applying an override.
