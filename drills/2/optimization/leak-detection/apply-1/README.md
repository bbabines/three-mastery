---
id: 2.optimization.leak-detection.apply.1
loop: 2
tier: core
concepts: [optimization.leak-detection]
mode: apply
context: optimization.leak-detection/long-sessions
lenses: [cost]
misconceptions: []
---

# Leak check: flag steady memory growth

> **The job:** Turn repeated GPU memory samples into a regression signal.

## Task

A route cycle records renderer.info.memory after each unload. Return true when the last sample is above the first in geometry or texture count; use at least 20 cycles in the scene or real application before judging a slow leak.

| Function | Return |
| --- | --- |
| `memoryGrew(samples: { geometries: number; textures: number }[])` | Whether GPU resource counts finish above their starting baseline. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run 20 or more identical load/unload cycles. Record renderer.info.memory counts and heap snapshots after each unload, then compare first and last baselines. The check flags retained GPU counts; a manual heap review covers resources not shown in renderer.info.

## Your code

Write it in `drills/2/optimization/leak-detection/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/leak-detection/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Watch a repeated full load/unload cycle; one high point during loading is not a leak.

</details>

## Where else?

Where else would the same code help? The concept card lists SPA route changes, Variant cycling.
