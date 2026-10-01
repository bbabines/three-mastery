---
id: 3.gpu.draw-call-anatomy.break-and-fix.1
loop: 3
tier: core
concepts: [gpu.draw-call-anatomy]
mode: break-and-fix
context: gpu.draw-call-anatomy/many-small-parts
lenses: [cost]
misconceptions: []
---

# Draw call anatomy: find the faulty result

> **The job:** A performance estimate says ten submissions although the material groups and shadow pass multiply them.

## Task

A performance estimate says ten submissions although the material groups and shadow pass multiply them. Count each visible group in the main pass and each shadow-light pass.

Fix `drawSubmissions` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Measure

Record the scene’s frame interval and draw calls. Say whether this correctness repair should change either number. For GPU execution time, use a GPU trace rather than the CPU render-call duration.

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/gpu/draw-call-anatomy/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

How many material groups and eligible passes submit draws for one visible mesh?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Shadow passes doubling calls; Multi-material meshes.

</details>
