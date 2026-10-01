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

The test keeps a nested visible mesh, skips a hidden subtree, and checks that the child list is unchanged.

<details><summary>Hint</summary>

Use the traversal variant that stops at a hidden parent.

</details>

## Where else?

Where else should hidden branches be skipped during a walk?

<details><summary>A few answers</summary> Applying visible-only overrides, auditing a view, or collecting pick targets. </details>
