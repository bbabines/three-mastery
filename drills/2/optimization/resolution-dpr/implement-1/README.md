---
id: 2.optimization.resolution-dpr.implement.1
loop: 2
tier: core
concepts: [optimization.resolution-dpr]
mode: implement
context: optimization.resolution-dpr/4k-monitors
lenses: [cost]
misconceptions: [optimization.resolution-dpr/display-setting]
---

# Resolution and DPR: cap the drawing size

> **The job:** Choose how many device pixels the renderer draws for each CSS pixel.

## Task

A large monitor reports a high device pixel ratio. Write `pixelRatioFor` to keep it at or below `cap` without asking the renderer to draw fewer than one pixel per CSS pixel. Treat a missing or invalid device ratio as 1. The page applies the answer to its renderer.

Move the device and cap sliders. The buffer dimensions should follow the chosen ratio, even though the canvas stays the same CSS size.

<div data-scene="pixelBudget"></div>

## Measure

Compare the buffer width × height shown in the readout at ratios 1 and 2. A doubled ratio draws four times as many pixels. Record those two pixel counts; frame time varies too much to be an acceptance check.

## Your code

Write it in `drills/2/optimization/resolution-dpr/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/optimization/resolution-dpr/implement-1

## The check

The result stays between 1 and the cap, respects a smaller device ratio, and handles invalid reported ratios.

<details><summary>Hint</summary> The resolution and DPR page explains why the pixel cost follows the square of the ratio. </details>

## Where else?

Where else would you deliberately lower the drawing ratio?

<details><summary>A few answers</summary> A phone with limited GPU bandwidth, a dense dashboard, or a full-screen post effect. </details>
