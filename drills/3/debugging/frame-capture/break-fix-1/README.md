---
id: 3.debugging.frame-capture.break-and-fix.1
loop: 3
tier: core
concepts: [debugging.frame-capture]
mode: break-and-fix
context: debugging.frame-capture/double-rendering
lenses: [cost]
misconceptions:
  - debugging.frame-capture/scene-graph-truth
---

# Frame capture: the draw count looks too small

> **The job:** count the draw commands a captured frame actually sent to the GPU.

## Task

`drawCount(commands)` receives an ordered capture trace. A command has an `op` name and may have a `count`. The starter counts only one draw-call family. A thumbnail pass and an instanced main pass make the scene use more draws than it reports.

Count `drawArrays`, `drawElements`, `drawArraysInstanced`, and `drawElementsInstanced` as one draw call each. Other commands, including target changes, are not draws. Fix the function, name the wrong assumption in `cause.md`, and write a regression assertion in `check.ts`.

<div data-scene="capture"></div>

## Measure

Use Spector.js to inspect draw calls and the render target bound for each pass. Record the actual number of draws before deciding whether the bottleneck is call count or pixel cost.

## Your code

Edit `drills/3/debugging/frame-capture/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/debugging/frame-capture/break-fix-1

## The check

The acceptance test includes indexed, nonindexed, and instanced draws across two targets. The regression assertion rejects a counter that mistakes scene objects for GPU calls.

<details><summary>Hint</summary> A frame capture records commands, including offscreen passes, rather than scene objects. </details>

## Where else?

What other capture clue explains a frame that draws twice?

<details><summary>A few answers</summary> A thumbnail target, a shadow pass, or a post-processing pass. </details>
