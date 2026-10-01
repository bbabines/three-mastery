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

# Points vs directions: convert a velocity into world space, keeping the effect of scale on its speed but ignoring translation

> **The job:** Convert a velocity into world space, keeping the effect of scale on its speed but ignoring translation.

## Task

Convert a velocity into world space, keeping the effect of scale on its speed but ignoring translation.

Write `worldVelocity(localVelocity, transform)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `localVelocity` | Part local units per second |
| `transform` | Saved transform between named spaces |
| Answer | World space |

## Your code

Write it in `drills/2/transforms/points-vs-directions/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/points-vs-directions/apply-1

## The check

It passes when `worldVelocity` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the points vs directions page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Transforming a hit point. Transforming a velocity.

</details>
