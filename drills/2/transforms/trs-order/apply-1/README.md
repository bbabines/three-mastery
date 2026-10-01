---
id: 2.transforms.trs-order.apply.1
loop: 2
tier: core
concepts: [transforms.trs-order]
mode: apply
context: transforms.trs-order/scale-rotated
lenses: [space]
misconceptions: [transforms.trs-order/order-irrelevant]
---

# TRS order: scale and turn a point around a pivot, then put it back in the world at that pivot

> **The job:** Scale and turn a point around a pivot, then put it back in the world at that pivot.

## Task

Scale and turn a point around a pivot, then put it back in the world at that pivot.

Write `orbitWithScale(point, pivot, rotation, scale)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `point` | World space unless named local |
| `pivot` | World space unless named local |
| `rotation` | Value in the units named in the Task |
| `scale` | Value in the units named in the Task |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/transforms/trs-order/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/trs-order/apply-1

## The check

It passes when `orbitWithScale` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the trs order page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Rotating around a pivot. Orbiting a point.

</details>
