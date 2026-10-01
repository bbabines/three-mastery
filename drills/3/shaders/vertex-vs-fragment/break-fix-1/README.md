---
id: 3.shaders.vertex-vs-fragment.break-and-fix.1
loop: 3
tier: core
concepts: [shaders.vertex-vs-fragment]
mode: break-and-fix
context: shaders.vertex-vs-fragment/displacement
lenses: [cost]
misconceptions: [shaders.vertex-vs-fragment/once-per-pixel]
---

# Vertex vs fragment: repair the effect

> **The job:** Count vertex work across color and shadow passes and fragment work across covered device pixels.

## Task

The performance estimate stays low when a displaced translucent layer is stacked over itself. Repair `shaderRuns`. The preview reports its output, and the test covers another input.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| input position or pixel | local space or device pixels, as named in the function |
| output | the space named in the return description |

## Measure

Use Chrome's Performance panel to record frame time and pixel ratio. Compare the calculation with measured work; frame time is not a pass threshold.

## Your code

Fix `drills/3/shaders/vertex-vs-fragment/break-fix-1/drill.ts`, write the cause in `cause.md`, then replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/shaders/vertex-vs-fragment/break-fix-1
```

## The check

The acceptance test covers the symptom and a general case. Your check must reject the original bug and pass on the repair.

<details><summary>Hint</summary> Fragment invocations grow with DPR squared and overdraw; vertex work repeats in each draw pass. </details>

## Where else?

What would a shadow pass add to a displaced mesh?

<details><summary>A few answers</summary> Another vertex run, and the depth material must match the displacement. </details>
