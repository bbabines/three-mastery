---
id: 2.transforms.matrix-vs-matrixworld.apply.1
loop: 2
tier: core
concepts: [transforms.matrix-vs-matrixworld]
mode: apply
context: transforms.matrix-vs-matrixworld/exporting
lenses: [space]
misconceptions: [transforms.matrix-vs-matrixworld/always-current]
---

# matrixWorld: find a nested origin

> **The job:** Find the world position of a part’s origin inside a moving rack.

## Task

`part.matrix` describes its pose under its immediate parent; `part.matrixWorld` includes the ancestors. `worldOrigin(part)` returns the origin in world space immediately after any parent movement.

Move the rack. The blue origin marker should meet the yellow world spot.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Local frame under a parent |
| Answer | World point for the part origin |


## Your code

Write it in `drills/2/transforms/matrix-vs-matrixworld/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/matrix-vs-matrixworld/apply-1

## The check

The check changes the parent after an earlier matrix update, then checks the new world origin. A stale or local matrix gives the wrong spot.

<details><summary>Hint</summary>

Refresh the world matrix through the parent chain before reading its position. The local `matrix` omits the rack’s pose.

</details>

## Where else?

Where else does a nested origin matter?

<details><summary>A few answers</summary>

Following a robot tool. Placing a sensor marker. Measuring between child parts.

</details>
