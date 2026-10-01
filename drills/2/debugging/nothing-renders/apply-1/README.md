---
id: 2.debugging.nothing-renders.apply.1
loop: 2
tier: light
concepts: [debugging.nothing-renders, debugging.helpers]
mode: apply
context: debugging.nothing-renders/invisible-geometry
lenses: [space]
misconceptions: []
---

# Visibility: check a model and show its bounds

> **The job:** Test a model against the camera and draw a helper around it.

## Task

Return whether the model's world bounds touch the camera frustum. Make a BoxHelper for a model so its location can be inspected even when the material is wrong.

| Function | Return |
| --- | --- |
| `inCameraView(object: THREE.Object3D, camera: THREE.Camera)` | Whether the object world bounds touch the camera frustum. |
| `boundsHelper(object: THREE.Object3D)` | A BoxHelper that shows the object bounds. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/debugging/nothing-renders/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/nothing-renders/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A BoxHelper can show where a model went, even when its material does not render.

</details>

## Where else?

Where else would the same code help? The concept card lists Invisible loaded model, Black post-processing output.
