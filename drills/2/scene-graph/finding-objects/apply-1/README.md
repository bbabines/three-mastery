---
id: 2.scene-graph.finding-objects.apply.1
loop: 2
tier: light
concepts: [scene-graph.finding-objects, scene-graph.safe-mutation]
mode: apply
context: scene-graph.finding-objects/group-by-material
lenses: []
misconceptions: []
---

# Finding and changing a loaded tree

> **The job:** Find all matching meshes, then remove every temporary helper.

## Task

A model can repeat names. Find every Mesh with the requested name, including hidden meshes, and remove every object tagged `userData.helper` without skipping siblings.

| Function | Return |
| --- | --- |
| `namedMeshes(root: THREE.Object3D, name: string)` | All meshes with that name, even when names repeat. |
| `removeTaggedHelpers(root: THREE.Object3D)` | How many helper objects were removed. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/scene-graph/finding-objects/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/finding-objects/apply-1
```

## The check

The tests find both meshes with a repeated name, ignore a Group with that name, and remove adjacent tagged helpers.

<details><summary>Hint</summary>

Collect objects first, then remove them after traversal.

</details>

## Where else?

Where else do repeated names and changing child lists matter?

<details><summary>A few answers</summary> Imported parts, helper cleanup, or a scene-tree search. </details>
