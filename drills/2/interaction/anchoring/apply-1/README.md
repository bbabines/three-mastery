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

The yellow blocker sits between the camera and the blue price tag. Your answer should hide that tag, but a blocker beyond the tag should leave it visible.

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

The check verifies that the code hides a tag behind a blocker but not one in front of it. It also rejects an unanswered function.

<details><summary>Hint</summary>

A label can be in front of the camera but behind another mesh.

</details>

## Where else?

How would this change for a hotspot on an occluded moving part?
