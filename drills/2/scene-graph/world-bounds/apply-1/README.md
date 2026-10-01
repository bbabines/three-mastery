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
| Child geometry and positions | Each child's own and parent's space |
| Lowest box point | World space |
| Returned lift | Distance along world up |

## Your code

Write it in `drills/2/scene-graph/world-bounds/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/world-bounds/apply-1
```

## The check

The test finds the lowest world point under rotation and checks that the root was not moved.

<details><summary>Hint</summary>

The answer is the negative of the world box minimum y.

</details>

## Where else?

Where else does a local height give the wrong placement?

<details><summary>A few answers</summary> Floor placement, camera fitting, or a rotated footprint. </details>
