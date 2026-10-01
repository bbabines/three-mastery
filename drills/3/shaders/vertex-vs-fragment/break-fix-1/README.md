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

# Vertex vs fragment: overlapping layers cost more

> **The job:** Count vertex and fragment work when the same translucent surface is drawn in several equal-size passes.

## Task

The estimate stays low when overlapping translucent layers are drawn in several equal-size passes. Repair `shaderRuns`. The preview reports one case, and the test covers another.

<div data-scene="preview"></div>


## Measure

Use Chrome's Performance panel to record frame time and pixel ratio. Compare the calculation with measured work; frame time is not a pass threshold.

## Your code

Fix `drills/3/shaders/vertex-vs-fragment/break-fix-1/drill.ts`, write the cause in `cause.md`, then replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/shaders/vertex-vs-fragment/break-fix-1
```

## The check

The acceptance test covers the symptom and a general case. Your check must reject the original bug and pass on the repair.

<details><summary>Hint</summary> Each pass runs vertices and covered fragments again. Overlap can run several fragments at one device pixel. </details>

## Where else?

Why should a shadow pass be measured separately from this equal-size estimate?

<details><summary>A few answers</summary> Its resolution and covered area come from the shadow map, not the canvas. It also needs matching displacement in its depth material. </details>
