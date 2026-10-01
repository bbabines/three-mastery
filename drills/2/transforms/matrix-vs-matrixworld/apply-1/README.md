---
id: 2.transforms.matrix-vs-matrixworld.apply.1
loop: 2
tier: core
concepts: [transforms.matrix-vs-matrixworld]
mode: apply
context: transforms.matrix-vs-matrixworld/exporting
lenses: [space]
misconceptions: [transforms.matrix-vs-matrixworld/always-current]
---

# matrix vs matrixWorld: find where the origin of a part inside a moving rack ends up in the world by reading its current world matrix

> **The job:** Find where the origin of a part inside a moving rack ends up in the world by reading its current world matrix.

## Task

Find where the origin of a part inside a moving rack ends up in the world by reading its current world matrix.

Write `worldOrigin(part)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Its local frame is relative to its parent |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/transforms/matrix-vs-matrixworld/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/matrix-vs-matrixworld/apply-1

## The check

It passes when `worldOrigin` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the matrix vs matrixworld page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Reparenting. World-space bounds.

</details>
