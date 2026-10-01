---
id: 2.transforms.matrix-vs-matrixworld.implement.1
loop: 2
tier: core
concepts: [transforms.matrix-vs-matrixworld]
mode: implement
context: transforms.matrix-vs-matrixworld/reparenting
lenses: [space]
misconceptions: [transforms.matrix-vs-matrixworld/always-current]
---

# matrix vs matrixWorld: save the full world transform of a nested part after its parent has moved, leaving the part and parent untouched

> **The job:** Save the full world transform of a nested part after its parent has moved, leaving the part and parent untouched.

## Task

Save the full world transform of a nested part after its parent has moved, leaving the part and parent untouched.

Write `worldTransform(part)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Its local frame is relative to its parent |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/transforms/matrix-vs-matrixworld/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/matrix-vs-matrixworld/implement-1

## The check

It passes when `worldTransform` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the matrix vs matrixworld page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

World-space bounds. Exporting transforms.

</details>
