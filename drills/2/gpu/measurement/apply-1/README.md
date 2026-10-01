---
id: 2.gpu.measurement.apply.1
loop: 2
tier: core
concepts: [gpu.measurement]
mode: apply
context: gpu.measurement/spector
lenses: [cost]
misconceptions: []
---

# Measure: compare one controlled change

> **The job:** Report the frame-time saving from one proof experiment.

## Task

A resolution experiment records baseline and changed frame times with everything else fixed. Return the saved milliseconds and percentage. A positive saving suggests fill-rate pressure; it is a measurement, not a fixed pass bar. In the scene, let DPR 2 collect at least 30 frames, switch to DPR 1, then compare the frame-time and draw-call readouts. Keep the camera still. A frame capture can confirm that the draw count stayed fixed.

| Function | Return |
| --- | --- |
| `frameSaving(baselineMs: number, changedMs: number)` | Saved frame milliseconds and percentage from baseline. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/measurement/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/measurement/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Change one variable, keep coverage fixed, and compare frame time rather than FPS.

</details>

## Where else?

Where else would the same code help? The concept card lists Timing a frame, renderer.info counts.
