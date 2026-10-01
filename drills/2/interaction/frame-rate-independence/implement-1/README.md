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

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/interaction/frame-rate-independence/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/frame-rate-independence/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A fixed lerp fraction changes speed with refresh rate; use elapsed seconds.

</details>

## Where else?

Where else would the same code help? The concept card lists Camera smoothing, Drag smoothing.
