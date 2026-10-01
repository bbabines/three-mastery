---
id: 2.transforms.inverse-matrices.apply.1
loop: 2
tier: core
concepts: [transforms.inverse-matrices]
mode: apply
context: transforms.inverse-matrices/view-matrix
lenses: [space]
misconceptions: [transforms.inverse-matrices/inverse-transpose]
---

# Inverse matrices: undo a saved pose

> **The job:** Map a world-space hit back onto an imported model.

## Task

A hit arrives in world coordinates, while the model keeps points in local coordinates. `undoTransform(worldPoint, modelToWorld)` returns the corresponding local point. The matrix may include translation, turn, and unequal scale. Leave both inputs unchanged.

The blue local hit should meet the yellow point on the gray local ghost.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `worldPoint` | World point |
| `modelToWorld` | Model local to world transform |
| Answer | Model local point |


## Your code

Write it in `drills/2/transforms/inverse-matrices/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/inverse-matrices/apply-1

## The check

The check uses a transformed model with translation, rotation, and unequal scale. It compares the recovered local point and checks both inputs are intact.

<details><summary>Hint</summary>

Invert a copy of the saved model-to-world matrix. Applying the forward matrix to the world hit moves it in the wrong direction.

</details>

## Where else?

Where else do you undo a saved transform?

<details><summary>A few answers</summary>

Picking a mesh vertex. Reading a local texture coordinate. Testing a point against local bounds.

</details>
