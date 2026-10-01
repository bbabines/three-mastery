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

# Compose and decompose: spot a mirror

> **The job:** Flag an imported part whose saved pose reverses its handedness.

## Task

An imported part has a saved `Matrix4`. `isMirroredPose(matrix)` returns true when its scale flips one side of the part. Translation and rotation alone do not mirror it. Leave the matrix unchanged.

Switch the sign of one scale axis. The white tip crosses the part; the readout should flag negative handedness.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `matrix` | Part local to world transform |
| Answer | Boolean: mirrored or not |


## Your code

Write it in `drills/2/transforms/compose-decompose/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/compose-decompose/apply-1

## The check

The check uses rotated and translated matrices with both even and odd numbers of negative scale axes. It checks the matrix remains unchanged.

<details><summary>Hint</summary>

Decompose the saved matrix to inspect its scale. A negative product of the three scale components means the pose changes handedness.

</details>

## Where else?

Where else does a mirrored transform matter?

<details><summary>A few answers</summary>

Correcting face winding. Importing left and right parts. Picking a matching normal direction.

</details>
