---
id: 2.debugging.reading-matrices.implement.1
loop: 2
tier: core
concepts: [debugging.reading-matrices]
mode: implement
context: debugging.reading-matrices/spotting-scale
lenses: [space]
misconceptions: []
---

# Matrix reading: find translation

> **The job:** Read a transform position from the column-major elements array.

## Task

Return the translation stored in a Matrix4. `Matrix4.set` takes row-major arguments, but `elements` stores translation at indices 12–14. Do not change the matrix.

| Function | Return |
| --- | --- |
| `matrixTranslation(matrix: THREE.Matrix4)` | The translation Vector3 encoded in the matrix. |

The preview reports translation from a matrix that also has rotation and scale.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/debugging/reading-matrices/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/reading-matrices/implement-1
```

## The check

The test reads translation after rotation and scale and confirms the source matrix remains unchanged.

<details><summary>Hint</summary>

setFromMatrixPosition reads the translation from elements 12–14.

</details>

## Where else?

How would you inspect a nested part's world position?

<details><summary>A few answers</summary> Update its world matrix and read translation from `matrixWorld`, not its local matrix. </details>
