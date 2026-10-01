---
id: 2.queries.ray-plane.apply.1
loop: 2
tier: core
concepts: [queries.ray-plane]
mode: apply
context: queries.ray-plane/measuring
lenses: [space]
misconceptions: []
---

# Ray and plane: wall placement

> **The job:** Place a marker on a wall without assuming the wall faces upward.

## Task

Given a ray and a wall plane, return the world hit point plus an offset along the plane normal. Return the ray origin if there is no forward hit.

| Function | Return |
| --- | --- |
| `wallMarkerPoint(ray: THREE.Ray, wall: THREE.Plane, offset: number)` | The offset world marker point, or ray origin on a miss. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Ray and wall plane | World space |
| Offset | World units along the wall normal |
| Returned marker point | World space |

## Your code

Write it in `drills/2/queries/ray-plane/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/ray-plane/apply-1
```

## The check

The test uses an angled wall and checks that the marker offset follows its normal.

<details><summary>Hint</summary>

Offset along the plane normal, not a fixed world axis.

</details>

## Where else?

Where else should an offset follow a surface normal?

<details><summary>A few answers</summary> Wall labels, decal placement, or keeping a marker off a floor. </details>
