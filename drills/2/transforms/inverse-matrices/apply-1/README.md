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

# Inverse matrices: undo a saved model-to-world transform so a world hit becomes a local point, preserving the saved matrix

> **The job:** Undo a saved model-to-world transform so a world hit becomes a local point, preserving the saved matrix.

## Task

Undo a saved model-to-world transform so a world hit becomes a local point, preserving the saved matrix.

Write `undoTransform(worldPoint, modelToWorld)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `worldPoint` | World space |
| `modelToWorld` | Saved transform between named spaces |
| Answer | Part local space |

## Your code

Write it in `drills/2/transforms/inverse-matrices/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/inverse-matrices/apply-1

## The check

It passes when `undoTransform` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the inverse matrices page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

worldToLocal. A hit point in object space.

</details>
