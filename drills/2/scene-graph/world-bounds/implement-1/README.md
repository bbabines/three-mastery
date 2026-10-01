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
| Child geometry and transforms | Local to each child and parent |
| Tight box size | Lengths along world axes |

## Your code

Write it in `drills/2/scene-graph/world-bounds/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/world-bounds/implement-1
```

## The check

The test compares a tight world box under a moved, turned, scaled parent, including a hidden child.

<details><summary>Hint</summary>

The geometry bounding box alone is in local space.

</details>

## Where else?

Where else would a loose or local box make a bad decision?

<details><summary>A few answers</summary> Camera fit, floor placement, or footprint measurement. </details>
