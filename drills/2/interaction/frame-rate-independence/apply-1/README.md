---
id: 2.interaction.frame-rate-independence.apply.1
loop: 2
tier: core
concepts: [interaction.frame-rate-independence]
mode: apply
context: interaction.frame-rate-independence/drag-smoothing
lenses: [space]
misconceptions: []
---

# Smoothing: move a camera target

> **The job:** Smooth a world-space point toward a target at the same rate on any display.

## Task

Return the current world point blended toward the target for elapsed seconds `dt` at rate `lambda`. Do not change either input Vector3.

| Function | Return |
| --- | --- |
| `smoothedTarget(current: THREE.Vector3, target: THREE.Vector3, lambda: number, dt: number)` | The smoothed world-space target point. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/frame-rate-independence/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/frame-rate-independence/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Apply a fraction derived from dt, not a fixed 0.1 each frame.

</details>

## Where else?

Where else would the same code help? The concept card lists Camera smoothing, Hover scale.
