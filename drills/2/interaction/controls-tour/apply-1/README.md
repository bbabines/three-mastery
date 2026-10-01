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

Toggle damping and compare the orbit update and dolly readouts for perspective and orthographic cameras.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/interaction/controls-tour/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/controls-tour/apply-1
```

## The check

The check verifies that the code keeps updating for damping after input stops; uses zoom only for an orthographic camera. It also rejects an unanswered function.

<details><summary>Hint</summary>

Damping continues after input ends; orthographic dolly changes zoom rather than distance.

</details>

## Where else?

When would you choose a gizmo or walkthrough control instead of orbit?
