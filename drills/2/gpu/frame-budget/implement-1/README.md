---
id: 2.gpu.frame-budget.implement.1
loop: 2
tier: core
concepts: [gpu.frame-budget]
mode: implement
context: gpu.frame-budget/comparing-devices
lenses: [cost]
misconceptions: []
---

# Frame budget: choose a target

> **The job:** Convert a refresh target to milliseconds per frame.

## Task

Return the milliseconds available for one frame at a target refresh rate. Compare frame time, not FPS, when judging performance.

| Function | Return |
| --- | --- |
| `budgetForHz(refreshHz: number)` | Milliseconds available for one frame. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/frame-budget/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/frame-budget/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

At 60 Hz the budget is about 16.67 ms; a 120 Hz display halves it.

</details>

## Where else?

Where else would the same code help? The concept card lists Setting targets, Judging a fix.
