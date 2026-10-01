---
id: 2.debugging.reading-matrices.apply.1
loop: 2
tier: core
concepts: [debugging.reading-matrices]
mode: apply
context: debugging.reading-matrices/mirroring
lenses: [space]
misconceptions: []
---

# Matrix reading: detect a mirror

> **The job:** Use a matrix determinant to detect reversed handedness.

## Task

Return true when a world transform mirrors an object. Include rotation and non-uniform scale in the test; the sign of the determinant tells you whether an odd number of axes were flipped.

| Function | Return |
| --- | --- |
| `mirrorsSpace(matrix: THREE.Matrix4)` | Whether the world transform reverses handedness. |

The preview checks one transform; the test covers odd and even axis flips.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/debugging/reading-matrices/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/reading-matrices/apply-1
```

## The check

The test checks a rotated, nonuniform transform with one negative axis and another with two.

<details><summary>Hint</summary>

A negative determinant means one or three axes are flipped.

</details>

## Where else?

Why can one negative matrix element mislead a mirror check?

<details><summary>A few answers</summary> Rotation changes individual element signs; the full matrix determinant tells whether handedness flipped. </details>
