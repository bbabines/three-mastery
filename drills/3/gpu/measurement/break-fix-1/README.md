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

# Measurement: report what a CPU render-call timer actually measures

> **The job:** Report what a CPU render-call timer actually measures.

## Task

A dashboard calls the duration of `renderer.render()` GPU time, but a GPU trace disagrees.

Fix the function in `drill.ts`. Change one scene switch at a time, compare frame interval and draw count, then inspect the timing label.

<div data-scene="demo"></div>

## Measure

Use the switches in this scene one at a time. Record frame interval and draw calls for each setting; use a GPU trace to decide whether GPU execution changed.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/measurement/break-fix-1

## The check

Time only the CPU submission span; leave GPU time unknown and report the renderer draw count. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

What did performance.now measure around render(), and when does queued GPU work finish?

</details>

## Where else?

Which experiment would separate fill cost from draw submission cost?

<details><summary>A few answers</summary>

Spector.js capture; renderer.info counts.

</details>
