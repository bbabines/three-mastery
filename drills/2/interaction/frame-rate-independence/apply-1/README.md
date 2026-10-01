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

The blue marker approaches the yellow target. Two half-steps should leave it where one full step does.

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

The check verifies that the code matches one long step with two half steps and preserves inputs. It also rejects an unanswered function.

<details><summary>Hint</summary>

Apply a fraction derived from dt, not a fixed 0.1 each frame.

</details>

## Where else?

Where else must a transition behave the same at 60 Hz and 120 Hz?
