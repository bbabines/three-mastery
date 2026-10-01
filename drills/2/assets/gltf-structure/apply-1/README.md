---
id: 2.assets.gltf-structure.apply.1
loop: 2
tier: core
concepts: [assets.gltf-structure]
mode: apply
context: assets.gltf-structure/audit-materials
lenses: []
misconceptions: []
---

# glTF: find nodes using a mesh

> **The job:** Find every node that refers to one glTF mesh definition.

## Task

Several glTF nodes may instance the same mesh definition. Return all their names in node order for a mesh index; do not treat the mesh index as a node index.

| Function | Return |
| --- | --- |
| `nodeNamesForMesh(document: { nodes: { name?: string; mesh?: number }[] }, meshIndex: number)` | The names of nodes that reference the mesh index. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/assets/gltf-structure/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/gltf-structure/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Nodes are instances in a hierarchy; a mesh is a reusable geometry definition.

</details>

## Where else?

Where else would the same code help? The concept card lists Finding a part by node name, Explaining unexpected child meshes.
