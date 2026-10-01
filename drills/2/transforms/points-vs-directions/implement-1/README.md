---
id: 2.transforms.points-vs-directions.implement.1
loop: 2
tier: core
concepts: [transforms.points-vs-directions]
mode: implement
context: transforms.points-vs-directions/hit-point
lenses: [space]
misconceptions: [transforms.points-vs-directions/apply-matrix-directions]
---

# Points vs directions: move a ray

> **The job:** Move a ray from model coordinates into the world.

## Task

`moveRay(point, direction, transform)` returns a world-space point and a unit world direction. Translation moves the point but not the direction; rotation turns both. The matrix may have unequal scale. Leave all inputs unchanged.

The blue ray should start at the yellow world hit and point along the yellow ray.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `point` | Model local point |
| `direction` | Model local direction |
| `transform` | Model local to world transform |
| Answer | World point and unit world direction |


## Your code

Write it in `drills/2/transforms/points-vs-directions/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/points-vs-directions/implement-1

## The check

The check uses translation, rotation, and unequal scale. It verifies both ray fields and checks the input point, direction, and matrix.

<details><summary>Hint</summary>

A point uses `applyMatrix4`; a direction uses `transformDirection`, which drops translation and normalizes. Work on copies.

</details>

## Where else?

Where else do points and directions travel together?

<details><summary>A few answers</summary>

A picking ray. A spotlight origin and aim. A projectile spawn and heading.

</details>
