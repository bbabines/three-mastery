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

Compare the frame budgets for 60 Hz and 120 Hz. A faster display gives each frame less time.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/frame-budget/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/frame-budget/implement-1
```

## The check

The check verifies that the code shows that higher refresh rates leave less time per frame. It also rejects an unanswered function.

<details><summary>Hint</summary>

At 60 Hz the budget is about 16.67 ms; a 120 Hz display halves it.

</details>

## Where else?

Why can two individually short CPU and GPU spans still fill the frame?
