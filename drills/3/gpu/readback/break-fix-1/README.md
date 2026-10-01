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

# Readback: find the faulty result

> **The job:** A one-pixel ID pick stalls the main thread because it uses synchronous readback.

## Task

A one-pixel ID pick stalls the main thread because it uses synchronous readback. Return the asynchronous read promise for the RGBA ID pixel.

Fix `pickPixel` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/readback/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

What work must finish before a synchronous pixel read returns?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Screenshots; Color sampling.

</details>
