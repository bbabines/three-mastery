---
id: 3.optimization.resolution-dpr.break-and-fix.1
loop: 3
tier: core
concepts: [optimization.resolution-dpr]
mode: break-and-fix
context: optimization.resolution-dpr/phones
lenses: [cost]
misconceptions:
  - optimization.resolution-dpr/display-setting
---

# Resolution: a phone draws more pixels than planned

> **The job:** cap a renderer's pixel ratio when the device reports a dense display.

## Task

`applyPixelBudget(renderer, deviceRatio)` sets a renderer's pixel ratio and returns the chosen value. A product page targets at most 2 device pixels per CSS pixel; a valid device ratio below that remains unchanged. The starter looks crisp on one monitor, but a DPR 3 phone draws more than twice the intended pixel count.

Fix the cap, name its cost in `cause.md`, and write a regression assertion in `check.ts`. Use the slider to compare the drawing buffer at different device ratios.

<div data-scene="phoneBudget"></div>

## Measure

Record the drawing-buffer width × height at device ratios 1, 2, and 3. Going from 2 to 3 multiplies pixel work by 2.25 at the same CSS size; measure that work rather than treating DPR as a display-only setting.

## Your code

Edit `drills/3/optimization/resolution-dpr/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/optimization/resolution-dpr/break-fix-1

## The check

The acceptance test checks several valid device ratios and that the renderer receives the returned ratio. The regression assertion rejects an uncapped high-DPR request.

<details><summary>Hint</summary> The pixel ratio multiplies both buffer width and height. </details>

## Where else?

What else grows with the square of DPR?

<details><summary>A few answers</summary> Full-screen render targets, post-processing passes, and some transparency work. </details>
