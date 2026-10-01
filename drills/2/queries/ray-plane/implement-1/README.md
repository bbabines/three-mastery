---
id: 2.queries.ray-plane.implement.1
loop: 2
tier: core
concepts: [queries.ray-plane]
mode: implement
context: queries.ray-plane/floor-drag
lenses: [space]
misconceptions: []
---

# Ray and plane: a drag point

> **The job:** Find where a world ray crosses a world plane.

## Task

A drag ray may miss an infinite plane if it points away or runs parallel. Return the world hit point, or the ray origin as a stand-in for no hit. Keep the inputs unchanged.

| Function | Return |
| --- | --- |
| `planeDragPoint(ray: THREE.Ray, plane: THREE.Plane)` | The world hit point or ray origin on a miss. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Ray and plane | World space |
| Returned hit or ray origin | World space |

## Your code

Write it in `drills/2/queries/ray-plane/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/ray-plane/implement-1
```

## The check

The tests hit an angled plane without moving the ray and use the origin for a parallel miss.

<details><summary>Hint</summary>

Ray.intersectPlane returns null for a parallel or backward miss.

</details>

## Where else?

Where else can a forward ray fail to reach a plane?

<details><summary>A few answers</summary> Floor dragging, wall placement, or a measuring tool. </details>
