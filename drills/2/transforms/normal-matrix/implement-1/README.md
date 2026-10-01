---
id: 2.transforms.normal-matrix.implement.1
loop: 2
tier: core
concepts: [transforms.normal-matrix]
mode: implement
context: transforms.normal-matrix/face-normal-world
lenses: [space]
misconceptions: [transforms.normal-matrix/normals-like-directions]
---

# Normal matrix: turn a face normal from model space into world space on a part with uneven scale, without changing the given normal

> **The job:** Turn a face normal from model space into world space on a part with uneven scale, without changing the given normal.

## Task

Turn a face normal from model space into world space on a part with uneven scale, without changing the given normal.

Write `normalInWorld(part, localNormal)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Its local frame is relative to its parent |
| `localNormal` | Part local space |
| Answer | World space |

## Your code

Write it in `drills/2/transforms/normal-matrix/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/normal-matrix/implement-1

## The check

It passes when `normalInWorld` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the normal matrix page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Lighting a squashed object. Rim effects.

</details>
