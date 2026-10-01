---
id: 2.optimization.resolution-dpr.apply.1
loop: 2
tier: core
concepts: [optimization.resolution-dpr]
mode: apply
context: optimization.resolution-dpr/orbit-dpr
lenses: [cost]
misconceptions: [optimization.resolution-dpr/display-setting]
---

# Resolution and DPR: draw less while orbiting

> **The job:** Lower the drawing ratio while a product view moves, then restore it when the view settles.

## Task

The viewer uses a capped ratio while idle and a ratio of 1 while dragging. Write `ratioWhileOrbiting(deviceRatio, moving, cap)`. A valid `deviceRatio` may be fractional; an invalid or zero one falls back to 1. `cap` is at least 1. The function returns the ratio for the current state and changes no renderer itself.

Toggle motion in the scene. The canvas remains the same CSS size while the backing buffer shrinks and grows.

<div data-scene="orbitBudget"></div>

## Measure

Record the buffer pixel count with motion off and on. The cost of drawing the frame changes with those counts; the CPU scene work does not. Do not use a frame-time threshold as a pass condition.

## Your code

Write it in `drills/2/optimization/resolution-dpr/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/optimization/resolution-dpr/apply-1

## The check

The moving ratio is 1. Idle uses the smaller of the valid device ratio and cap, including fractional ratios.

<details><summary>Hint</summary> Compare device pixels drawn, not the CSS size of the canvas. </details>

## Where else?

When else might temporary lower quality be less noticeable?

<details><summary>A few answers</summary> While a model rotates automatically, during a fast camera flight, or while resizing the window. </details>
