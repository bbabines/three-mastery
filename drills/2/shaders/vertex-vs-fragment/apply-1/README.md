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

Write `shaderRuns(vertices, coveredCssPixels, dpr, overdraw, passes)`. Return the count of vertex and fragment invocations. Vertex work repeats in every pass. Fragment work scales with device pixel ratio squared and with overdraw. Do not treat a pixel as a single fragment.

<div data-scene="preview"></div>

## Measure

Use Chrome's performance panel or a GPU profiler to compare frame time at DPR 1 and 2. Record both the pixel count estimate and the measured frame time; frame time is not an acceptance threshold.

## Your code

Write the function in `drills/2/shaders/vertex-vs-fragment/apply-1/drill.ts`, then run:

```
npm run drill -- drills/2/shaders/vertex-vs-fragment/apply-1
```

## The check

The tests change DPR, overdraw, and pass count independently so one mistaken multiplier cannot pass.

<details><summary>Hint</summary> Device pixels are a two-dimensional grid. </details>

## Where else?

How would transparent layers or a shadow pass change these counts?
