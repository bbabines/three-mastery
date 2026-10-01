---
id: 2.transforms.points-vs-directions.apply.1
loop: 2
tier: core
concepts: [transforms.points-vs-directions]
mode: apply
context: transforms.points-vs-directions/ray-direction
lenses: [space]
misconceptions: [transforms.points-vs-directions/apply-matrix-directions]
---

# Points vs directions: carry velocity

> **The job:** Turn and scale a velocity without adding a position offset.

## Task

`worldVelocity(localVelocity, transform)` returns the velocity after the matrix’s turn and scale. Velocity has no location, so translation must not affect it. Keep its speed change from scale, and leave both inputs unchanged.

The blue velocity arrow should match yellow after the part turns and stretches.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `localVelocity` | Model local displacement per time |
| `transform` | Model local to world transform |
| Answer | World displacement per time |


## Your code

Write it in `drills/2/transforms/points-vs-directions/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/points-vs-directions/apply-1

## The check

The check uses a large translation and unequal scale. It compares the full vector, including speed, and checks the inputs are unchanged.

<details><summary>Hint</summary>

Use only the linear part of the matrix for velocity. `transformDirection` removes scale by normalizing, so it loses speed.

</details>

## Where else?

Where else do transformed displacements keep scale?

<details><summary>A few answers</summary>

Conveyor motion. Particle velocity. A stretchable rig’s movement.

</details>
