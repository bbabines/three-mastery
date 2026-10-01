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

# TRS order: orbit with scale

> **The job:** Scale and turn a point around a chosen pivot.

## Task

`orbitWithScale(point, pivot, rotation, scale)` returns the point after moving into the pivot frame, scaling, turning, and moving back. Scale acts before rotation. Leave the point, pivot, quaternion, and scale untouched.

Change the turn. The blue point should meet the yellow target, even with unequal scale.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `point` | World point |
| `pivot` | World point |
| `rotation` | Turn around pivot |
| `scale` | Multipliers in pivot frame |
| Answer | World point |


## Your code

Write it in `drills/2/transforms/trs-order/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/trs-order/apply-1

## The check

The check uses an offset pivot and unequal scale, so swapping scale and turn misses the target. It checks the inputs remain unchanged.

<details><summary>Hint</summary>

Work with the point relative to the pivot. A composed transform applies scale, then rotation, then translation.

</details>

## Where else?

Where else does transform order change a result?

<details><summary>A few answers</summary>

A stretched orbit arm. A model vertex. A scaled camera rig.

</details>
