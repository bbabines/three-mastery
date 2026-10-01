---
id: 2.gpu.multi-pass.implement.1
loop: 2
tier: core
concepts: [gpu.multi-pass]
mode: implement
context: gpu.multi-pass/selection-outline
lenses: [cost]
misconceptions: []
---

# Post: count full-screen work

> **The job:** Estimate the fragment work added by full-screen passes.

## Task

Each post pass covers the target picture once. Return the number of pixel-sized fragment candidates for the given width, height, and pass count.

| Function | Return |
| --- | --- |
| `postFragments(width: number, height: number, passes: number)` | The full-screen fragment candidates across the passes. |

Raise the resolution or pass count and watch the full-screen fragment estimate rise with both.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/multi-pass/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/multi-pass/implement-1
```

## The check

The check verifies that the code scales with both resolution and pass count. It also rejects an unanswered function.

<details><summary>Hint</summary>

A full-screen pass costs work at every output pixel, even if its filter code is short.

</details>

## Where else?

What does a second full-screen effect add at twice the canvas width and height?
