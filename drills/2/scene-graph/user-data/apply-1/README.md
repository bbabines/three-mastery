---
id: 2.scene-graph.user-data.apply.1
loop: 2
tier: light
concepts: [scene-graph.user-data, scene-graph.material-override]
mode: apply
context: scene-graph.user-data/mark-selectable
lenses: []
misconceptions: []
---

# Metadata: select and highlight a part

> **The job:** Find the tagged part for a picked mesh and swap one material.

## Task

A model stores a selectable ID on a parent. Return that ID from a clicked child. Highlight a Mesh by replacing its material, and return the old material so it can be restored.

| Function | Return |
| --- | --- |
| `selectableId(hit: THREE.Object3D)` | The nearest selectable ID, or an empty string. |
| `swapMaterial(mesh: THREE.Mesh, replacement: THREE.Material)` | The original material, while the mesh receives the replacement. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/scene-graph/user-data/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/user-data/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Store the exact old material object; cloning it is not needed for a temporary swap.

</details>

## Where else?

Where else would the same code help? The concept card lists Tagging parts with IDs, Storing an original material.
