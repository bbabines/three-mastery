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
| Hit point and triangle corners | World space |
| Corner UVs and returned UV | Texture coordinates, from 0 to 1 |

## Your code

Write it in `drills/2/queries/ray-triangle/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/ray-triangle/apply-1
```

## The check

The test blends three UVs at a point inside a sloped triangle and leaves the inputs unchanged.

<details><summary>Hint</summary>

Barycentric weights blend any corner value, not only positions.

</details>

## Where else?

Where else do three corner values blend at a surface point?

<details><summary>A few answers</summary> Vertex colors, texture painting, or a hit-based effect. </details>
