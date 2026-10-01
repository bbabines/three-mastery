---
id: 2.interaction.anchoring.apply.1
loop: 2
tier: core
concepts: [interaction.anchoring]
mode: apply
context: interaction.anchoring/measurement-labels
lenses: [space]
misconceptions: []
---

# Anchor: hide an occluded price tag

> **The job:** Check whether another surface blocks a world label from the camera.

## Task

Return true when a world point is in front of the camera and no listed blocker lies between the camera and point. Use a raycaster with a distance limit to avoid treating geometry behind the label as an occluder.

| Function | Return |
| --- | --- |
| `labelUnoccluded(world: THREE.Vector3, camera: THREE.Camera, blockers: THREE.Object3D[])` | Whether the label can be seen from the camera. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/anchoring/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/anchoring/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A label can be in front of the camera but behind another mesh.

</details>

## Where else?

Where else would the same code help? The concept card lists Hotspots, Price tags.
