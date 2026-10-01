---
id: 3.gpu.measurement.break-and-fix.1
loop: 3
tier: core
concepts: [gpu.measurement]
mode: break-and-fix
context: gpu.measurement/timing-frame
lenses: [cost]
misconceptions: [gpu.measurement/render-time-gpu]
---

# Measurement: find the faulty result

> **The job:** A dashboard mistakes CPU render submission time for GPU execution time.

## Task

A dashboard labels time spent inside renderer.render as GPU time. Report CPU submission time and draw calls, leaving GPU time unknown until a GPU timer or trace measures it.

Fix `measureSubmission` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Measure

Use the switches in this scene one at a time. Record frame interval and draw calls for each setting; use a GPU trace to decide whether GPU execution changed.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/measurement/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

What did performance.now measure around render(), and when does queued GPU work finish?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Spector.js capture; renderer.info counts.

</details>
