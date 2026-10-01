---
id: 2.interaction.frame-rate-independence.implement.1
loop: 2
tier: core
concepts: [interaction.frame-rate-independence]
mode: implement
context: interaction.frame-rate-independence/hover-scale
lenses: []
misconceptions: []
---

# Smoothing: one rate at every refresh speed

> **The job:** Compute a damping fraction from elapsed time.

## Task

Given a damping rate `lambda` and elapsed seconds `dt`, return the fraction to blend toward a target. It should compose across two short frames like one long frame.

| Function | Return |
| --- | --- |
| `dampingFraction(lambda: number, dt: number)` | The elapsed-time damping fraction. |

Compare a long frame with two short frames. Both should move the blue marker the same distance toward the yellow target.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/interaction/frame-rate-independence/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/frame-rate-independence/implement-1
```

## The check

The check verifies that the code composes across different frame lengths. It also rejects an unanswered function.

<details><summary>Hint</summary>

A fixed lerp fraction changes speed with refresh rate; use elapsed seconds.

</details>

## Where else?

Where else must a transition behave the same at 60 Hz and 120 Hz?
