---
id: 2.gpu.frame-budget.apply.1
loop: 2
tier: core
concepts: [gpu.frame-budget]
mode: apply
context: gpu.frame-budget/judging-fix
lenses: [cost]
misconceptions: []
---

# Frame budget: find the limiting side

> **The job:** Estimate frame time when CPU and GPU work overlap.

## Task

Return the slower of CPU work and GPU work as the frame duration. Include the milliseconds over budget for a target refresh rate.

| Function | Return |
| --- | --- |
| `framePressure(cpuMs: number, gpuMs: number, refreshHz: number)` | The limiting frame duration and milliseconds over budget. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/frame-budget/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/frame-budget/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

CPU and GPU overlap, so the longer side usually sets frame time.

</details>

## Where else?

Where else would the same code help? The concept card lists Setting targets, Comparing devices.
