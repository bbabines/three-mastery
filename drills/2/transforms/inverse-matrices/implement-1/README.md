---
id: 2.transforms.inverse-matrices.implement.1
loop: 2
tier: core
concepts: [transforms.inverse-matrices]
mode: implement
context: transforms.inverse-matrices/world-to-local
lenses: [space]
misconceptions: [transforms.inverse-matrices/inverse-transpose]
---

# Inverse matrices: map a hit point in world space back into a nested part’s local space without moving the part or point

> **The job:** Map a hit point in world space back into a nested part’s local space without moving the part or point.

## Task

Map a hit point in world space back into a nested part’s local space without moving the part or point.

Write `pointInPart(part, worldPoint)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Its local frame is relative to its parent |
| `worldPoint` | World space |
| Answer | World space |

## Your code

Write it in `drills/2/transforms/inverse-matrices/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/inverse-matrices/implement-1

## The check

It passes when `pointInPart` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the inverse matrices page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

A hit point in object space. Building a view matrix.

</details>
