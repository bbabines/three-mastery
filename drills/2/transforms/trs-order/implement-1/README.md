---
id: 2.transforms.trs-order.implement.1
loop: 2
tier: core
concepts: [transforms.trs-order]
mode: implement
context: transforms.trs-order/pivot-rotate
lenses: [space]
misconceptions: [transforms.trs-order/order-irrelevant]
---

# TRS order: place a model vertex after scale, then rotation, then translation; return its world position without changing inputs

> **The job:** Place a model vertex after scale, then rotation, then translation; return its world position without changing inputs.

## Task

Place a model vertex after scale, then rotation, then translation; return its world position without changing inputs.

Write `placeVertex(vertex, position, rotation, scale)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `vertex` | Model local space |
| `position` | World space unless named local |
| `rotation` | Value in the units named in the Task |
| `scale` | Value in the units named in the Task |
| Answer | World space |

## Your code

Write it in `drills/2/transforms/trs-order/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/trs-order/implement-1

## The check

It passes when `placeVertex` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the trs order page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Orbiting a point. Scaling a rotated part.

</details>
