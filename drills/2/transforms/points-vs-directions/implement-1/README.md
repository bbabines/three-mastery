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

# Points vs directions: move a ray from model space into world space: its point moves with translation, while its direction does not

> **The job:** Move a ray from model space into world space: its point moves with translation, while its direction does not.

## Task

Move a ray from model space into world space: its point moves with translation, while its direction does not.

Write `moveRay(point, direction, transform)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `point` | World space unless named local |
| `direction` | Value in the units named in the Task |
| `transform` | Saved transform between named spaces |
| Answer | World space |

## Your code

Write it in `drills/2/transforms/points-vs-directions/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/points-vs-directions/implement-1

## The check

It passes when `moveRay` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the points vs directions page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Transforming a ray direction. Transforming a velocity.

</details>
