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

# World bounds: the box stays at the origin

> **The job:** A camera fit uses a part’s geometry box and misses its turned, moved parent.

## Task

A camera fit uses a part's box, but its parent has moved and turned. `boundsInWorld` should return a tight world-space `Box3` around the part and all its children. It must work before anything renders.

Fix `boundsInWorld` in `drill.ts`. The yellow outline is the correct box; your returned box is red. They should overlap.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| Geometry's vertex positions | The part's own space |
| Parent position and rotation | The parent's space |
| Returned box | World space |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/scene-graph/world-bounds/break-fix-1

## The check

The test moves and turns a parent, then compares all six bounds to a tight world-space box. Your check should also include a child mesh.

<details><summary>Hint</summary>

Whose transform is missing if the geometry box is returned directly?

</details>

## Where else?

Where else would a local box put a world-space decision in the wrong place?

<details><summary>A few answers</summary>

Placing a model on the floor, fitting a camera, or measuring a rack's footprint.

</details>
