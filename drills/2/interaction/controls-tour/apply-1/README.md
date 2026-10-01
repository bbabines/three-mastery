---
id: 2.interaction.controls-tour.apply.1
loop: 2
tier: light
concepts: [interaction.controls-tour, interaction.orbit-pan-dolly]
mode: apply
context: interaction.controls-tour/gizmo-move
lenses: []
misconceptions: []
---

# Controls: update and dolly

> **The job:** Keep damped controls moving and distinguish perspective dolly from orthographic zoom.

## Task

Return whether OrbitControls needs an update after a pointer event. Return the camera setting a dolly should change: camera distance for perspective or zoom for orthographic.

| Function | Return |
| --- | --- |
| `needsControlsUpdate(dampingEnabled: boolean, moved: boolean)` | Whether to call controls.update on the next frame. |
| `dollyChanges(camera: THREE.Camera)` | Which camera value the dolly gesture changes. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/interaction/controls-tour/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/controls-tour/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Damping continues after input ends; orthographic dolly changes zoom rather than distance.

</details>

## Where else?

Where else would the same code help? The concept card lists Product viewer orbit, A walkthrough of a showroom.
