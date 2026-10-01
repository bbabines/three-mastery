---
id: 2.queries.ray.apply.1
loop: 2
tier: light
concepts: [queries.ray, queries.ray-sphere]
mode: apply
context: queries.ray/pointer-picking
lenses: []
misconceptions: []
---

# Ray and sphere: choose a forward hit

> **The job:** Use a ray as a forward half-line and a sphere as a coarse target.

## Task

Return a point three world units in front of a ray origin. For a spherical hotspot, return the first surface hit in front of the ray, or the ray origin when it misses.

| Function | Return |
| --- | --- |
| `pointAhead(ray: THREE.Ray, distance: number)` | The point at that distance along the forward ray. |
| `hotspotPoint(ray: THREE.Ray, sphere: THREE.Sphere)` | The hotspot hit in front of the ray, or its origin on a miss. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/queries/ray/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/ray/apply-1
```

## The check

The tests read a point along a ray without moving it, then handle sphere hits from inside and a miss.

<details><summary>Hint</summary>

Ray.at moves forward only; intersectSphere finds the nearest forward surface.

</details>

## Where else?

Where else do you need a point along a forward ray?

<details><summary>A few answers</summary> Pointer picking, line of sight, or hotspot placement. </details>
