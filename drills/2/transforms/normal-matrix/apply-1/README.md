---
id: 2.transforms.normal-matrix.apply.1
loop: 2
tier: core
concepts: [transforms.normal-matrix]
mode: apply
context: transforms.normal-matrix/rim
lenses: [space]
misconceptions: [transforms.normal-matrix/normals-like-directions]
---

# Normal matrix: decide whether an unevenly scaled face points toward a world-space viewer, using its correct world normal

> **The job:** Decide whether an unevenly scaled face points toward a world-space viewer, using its correct world normal.

## Task

Decide whether an unevenly scaled face points toward a world-space viewer, using its correct world normal.

Write `faceToward(part, localNormal, worldView)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Its local frame is relative to its parent |
| `localNormal` | Part local space |
| `worldView` | World space |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/transforms/normal-matrix/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/normal-matrix/apply-1

## The check

It passes when `faceToward` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the normal matrix page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Lighting a squashed object. Face normal to world.

</details>
