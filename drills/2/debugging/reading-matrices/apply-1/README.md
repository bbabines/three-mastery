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

Try the scene. The readout changes when your function gives an answer.

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

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A negative determinant means one or three axes are flipped.

</details>

## Where else?

Where else would the same code help? The concept card lists Console transform checks, Spotting scale.
