---
id: 3.scene-graph.world-bounds.break-and-fix.1
loop: 3
tier: core
concepts: [scene-graph.world-bounds]
mode: break-and-fix
context: scene-graph.world-bounds/camera-fit
lenses: [space]
misconceptions: [scene-graph.world-bounds/geometry-box]
---

# World bounds: find the faulty result

> **The job:** A camera fit uses a part’s geometry box and misses its turned, moved parent.

## Task

A camera fit uses a part’s geometry box and misses its turned, moved parent. Return tight world-space bounds including the part’s children.

Fix `boundsInWorld` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs | The named camera, world, or screen space in the task |
| Answer | The space stated in the task |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/world-bounds/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Whose transform is missing if the geometry box is returned directly?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Floor placement; Footprint measurement.

</details>
