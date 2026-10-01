---
id: 2.transforms.compose-decompose.apply.1
loop: 2
tier: light
concepts: [transforms.compose-decompose, transforms.negative-scale]
mode: apply
context: transforms.compose-decompose/world-rotation
lenses: [space]
misconceptions: [transforms.compose-decompose/clean-decompose]
---

# Compose, decompose, and mirror: inspect a saved transform from an imported part and report whether its scale mirrors the part

> **The job:** Inspect a saved transform from an imported part and report whether its scale mirrors the part.

## Task

Inspect a saved transform from an imported part: decompose it into position, turn, and scale, then report whether the resulting pose mirrors the part. The matrix has no shear. A negative value on one axis mirrors; two negative axes do not.

Write `isMirroredPose(matrix)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `matrix` | Saved transform between named spaces |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/transforms/compose-decompose/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/compose-decompose/apply-1

## The check

It passes when `isMirroredPose` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the compose, decompose, and mirror page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Baking transforms. Copying a world transform.

</details>
