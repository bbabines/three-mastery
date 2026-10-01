---
id: 2.shaders.vertex-vs-fragment.apply.1
loop: 2
tier: core
concepts: [shaders.vertex-vs-fragment]
mode: apply
context: shaders.vertex-vs-fragment/run-counts
lenses: [cost]
misconceptions: [shaders.vertex-vs-fragment/once-per-pixel]
---

# Vertex and fragment work: estimate the runs

> **The job:** compare vertex and fragment cost when a mesh covers a screen at different pixel ratios and overdraw.

## Task

Write `shaderRuns(vertices, coveredCssPixels, dpr, overdraw, passes)`. Estimate vertex and fragment invocations when every pass covers the same CSS area. Both kinds of work repeat per pass; fragment work also scales with DPR squared and overlapping layers.

<div data-scene="preview"></div>

## Measure

Use Chrome's performance panel or a GPU profiler to compare frame time at DPR 1 and 2. Record both the pixel count estimate and the measured frame time; frame time is not an acceptance threshold.

## Your code

Write the function in `drills/2/shaders/vertex-vs-fragment/apply-1/drill.ts`, then run:

```
npm run drill -- drills/2/shaders/vertex-vs-fragment/apply-1
```

## The check

The tests change DPR, overdraw, and pass count independently, including fragment work in repeated passes.

<details><summary>Hint</summary> Device pixels are a two-dimensional grid. </details>

## Where else?

How would transparent layers or a shadow pass change these counts?

<details><summary>A few answers</summary> Extra transparent layers raise overdraw. A shadow pass adds work too, but its fragment area follows the shadow map rather than the canvas, so measure it separately. </details>
