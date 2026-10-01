---
id: 2.queries.ray-triangle.apply.1
loop: 2
tier: core
concepts: [queries.ray-triangle]
mode: apply
context: queries.ray-triangle/backface
lenses: [space]
misconceptions: []
---

# Triangle: interpolate a hit UV

> **The job:** Use barycentric coordinates to find the UV between triangle corners.

## Task

A hit point lies on a triangle in world space. Use three.js Triangle.getBarycoord to blend three corner UVs. Return a Vector2. The inputs must remain unchanged.

| Function | Return |
| --- | --- |
| `uvAtPoint(point: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, uvA: THREE.Vector2, uvB: THREE.Vector2, uvC: THREE.Vector2)` | The interpolated UV at the triangle hit point. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/queries/ray-triangle/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/ray-triangle/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Barycentric weights blend any corner value, not only positions.

</details>

## Where else?

Where else would the same code help? The concept card lists Exact picking, UV interpolation at a hit.
