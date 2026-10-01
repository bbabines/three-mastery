---
id: 2.scene-graph.scene-stats.apply.1
loop: 2
tier: light
concepts: [scene-graph.scene-stats, scene-graph.visibility-layers]
mode: apply
context: scene-graph.scene-stats/before-after
lenses: []
misconceptions: []
---

# Scene audit: count shared data and visibility

> **The job:** Count unique geometry and test whether an object can render through its ancestors.

## Task

A loaded scene contains copies that share geometry and parts hidden by parent visibility or camera layers. Count unique geometry resources, and report whether a Mesh can render for a given camera.

| Function | Return |
| --- | --- |
| `uniqueGeometryCount(root: THREE.Object3D)` | The number of distinct mesh geometry resources. |
| `rendersForCamera(mesh: THREE.Object3D, camera: THREE.Camera)` | Whether the object is visible through its parents and camera layer. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/scene-graph/scene-stats/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/scene-stats/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A hidden parent stops rendering; layers are tested on each object, not inherited.

</details>

## Where else?

Where else would the same code help? The concept card lists Asset audit, Variant comparison.
