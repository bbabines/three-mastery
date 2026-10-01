---
id: 2.queries.ray-triangle.implement.1
loop: 2
tier: core
concepts: [queries.ray-triangle]
mode: implement
context: queries.ray-triangle/exact-picking
lenses: [space]
misconceptions: []
---

# Ray and triangle: exact pick

> **The job:** Test an exact triangle after a coarse bounds hit.

## Task

Use three.js Ray.intersectTriangle with backface culling enabled. Return the world hit point, or the ray origin when it misses.

| Function | Return |
| --- | --- |
| `frontFacePoint(ray: THREE.Ray, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3)` | The front-face triangle hit or ray origin on a miss. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/queries/ray-triangle/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/ray-triangle/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

The order of a, b, and c controls which side is the front.

</details>

## Where else?

Where else would the same code help? The concept card lists UV interpolation at a hit, Back-face handling.
