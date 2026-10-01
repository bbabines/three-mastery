---
id: 2.debugging.visualizing-vectors.apply.1
loop: 2
tier: light
concepts: [debugging.visualizing-vectors, debugging.nan-degenerate]
mode: apply
context: debugging.visualizing-vectors/ray-direction
lenses: [space]
misconceptions: []
---

# Vectors: draw a safe world direction

> **The job:** Turn a local direction into the world and reject non-finite values.

## Task

A ray direction arrow belongs under a transformed parent. Return its local direction turned into world space, with unit length. If a vector contains NaN or infinity, replace it with zero before it reaches a helper.

| Function | Return |
| --- | --- |
| `worldArrowDirection(object: THREE.Object3D, local: THREE.Vector3)` | The unit direction for a world-space ArrowHelper. |
| `finiteOrZero(vector: THREE.Vector3)` | The unchanged finite vector or a zero-vector fallback. |

The preview shows one world-space arrow; the test also checks invalid vectors.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/debugging/visualizing-vectors/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/visualizing-vectors/apply-1
```

## The check

The test checks world rotation, unit length, unchanged local input, and a zero result for nonfinite values.

<details><summary>Hint</summary>

A helper needs both the right direction and the right parent space; NaN can spread silently.

</details>

## Where else?

How would you draw a normal on a rotated part?

<details><summary>A few answers</summary> Transform the local normal into world space before giving it to a world-space arrow helper. </details>
