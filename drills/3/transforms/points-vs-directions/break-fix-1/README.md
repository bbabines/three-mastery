---
id: 3.transforms.points-vs-directions.break-and-fix.1
loop: 3
tier: core
concepts: [transforms.points-vs-directions]
mode: break-and-fix
context: transforms.points-vs-directions/velocity
lenses: [space]
misconceptions: [transforms.points-vs-directions/apply-matrix-directions]
---

# Points vs directions: a velocity dragged by position

> **The job:** turn a part's local velocity into a world-space velocity.

## Task

`worldVelocity(part, localVelocity)` returns a world-space movement vector. Rotation and scale affect the velocity; translation does not. The starter treats the velocity like a point, so moving the part changes the arrow's length and direction. Fix it without changing the local velocity.

Move the part with the slider. The orange arrow should keep matching the green arrow.

<div data-scene="velocity"></div>

## Spaces

| Value | Space |
| --- | --- |
| `localVelocity` | Part-local direction and speed |
| Returned velocity | World-space direction and speed |

## Your code

Fix `drills/3/transforms/points-vs-directions/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/transforms/points-vs-directions/break-fix-1
```

## The check

The acceptance test translates, turns, and scales a part, then checks that translation does not affect its world velocity. Your check must reject point-style transformation.

<details><summary>Hint</summary>

The upper-left 3×3 of `matrixWorld` holds rotation and scale but no translation. `transformDirection` discards velocity's speed by normalizing it.

</details>

## Where else?

What other vectors must ignore an object's translation?

<details><summary>A few answers</summary>

A ray direction, a force vector, or the direction of a tool handle.

</details>
