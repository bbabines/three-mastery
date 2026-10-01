---
id: 2.interaction.focus-on-object.apply.1
loop: 2
tier: light
concepts: [interaction.focus-on-object, interaction.interpolation-toolbox]
mode: apply
context: interaction.focus-on-object/reset-view
lenses: [space]
misconceptions: []
---

# Focus: center a camera move

> **The job:** Find a model's world center and ease a focus transition.

## Task

Return the world center of an object's full bounds for a focus target. Return a smoothstep eased fraction for an animation, clamped to [0, 1]. Move camera position and controls target together using that fraction.

| Function | Return |
| --- | --- |
| `focusCenter(root: THREE.Object3D)` | The world center of the full object bounds. |
| `focusEase(elapsed: number, duration: number)` | The clamped smoothstep fraction of the focus move. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/focus-on-object/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/focus-on-object/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A focus animation moves both camera and target; smoothstep slows at both ends.

</details>

## Where else?

Where else would the same code help? The concept card lists Double-click focus, Guided views.
