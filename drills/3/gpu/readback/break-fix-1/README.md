---
id: 3.gpu.readback.break-and-fix.1
loop: 3
tier: light
concepts: [gpu.readback]
mode: break-and-fix
context: gpu.readback/gpu-picking
lenses: [cost]
misconceptions: [gpu.readback/one-pixel-free]
---

# Readback: pick an ID pixel without a pointer hitch

> **The job:** Pick an ID pixel without a pointer hitch.

## Task

Picking one ID pixel causes a visible pointer hitch on a busy scene.

Fix the function in `drill.ts`. The red ID color should appear on the ball; compare synchronous and asynchronous read counts.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/readback/break-fix-1

## The check

Read exactly one pixel from the requested target coordinates through the asynchronous API; never use the blocking read. Write a short assertion in `check.ts` with a different input. It must reject the starter and accept the repair.

<details><summary>Hint</summary>

What work must finish before a synchronous pixel read returns?

</details>

## Where else?

When would an asynchronous ID read matter during pointer movement?

<details><summary>A few answers</summary>

Screenshots; Color sampling.

</details>
