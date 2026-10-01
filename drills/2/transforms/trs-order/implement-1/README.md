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

# TRS order: place a vertex

> **The job:** Find where a model vertex lands after scale, turn, and shift.

## Task

`placeVertex(vertex, position, rotation, scale)` returns the world point after scaling the local vertex, rotating it, then translating it. Use the given scale on each axis. Leave all inputs unchanged.

The blue vertex should land on the yellow world marker.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `vertex` | Model local point |
| `position` | World offset |
| `rotation` | Model local to world turn |
| `scale` | Model local multipliers |
| Answer | World point |


## Your code

Write it in `drills/2/transforms/trs-order/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/trs-order/implement-1

## The check

The check uses nonzero translation, a turn, and unequal scale to distinguish TRS order. It checks all inputs remain unchanged.

<details><summary>Hint</summary>

A `Matrix4` can compose position, quaternion, and scale in the usual TRS order. Apply it to a copy of the vertex.

</details>

## Where else?

Where else do you place local geometry in the world?

<details><summary>A few answers</summary>

A mesh corner. A collision sample. A model-space annotation.

</details>
