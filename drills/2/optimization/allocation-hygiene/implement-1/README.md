---
id: 2.optimization.allocation-hygiene.implement.1
loop: 2
tier: core
concepts: [optimization.allocation-hygiene]
mode: implement
context: optimization.allocation-hygiene/raycast-loops
lenses: [cost]
misconceptions: []
---

# Allocation: reuse a ray scratch vector

> **The job:** Answer repeated proximity queries without allocating a new result every time.

## Task

Use the supplied scratch Vector3 as the target for `Ray.closestPointToPoint` and return that exact object. The caller can reuse it next frame; do not change the ray or point.

| Function | Return |
| --- | --- |
| `closestInto(ray: THREE.Ray, point: THREE.Vector3, scratch: THREE.Vector3)` | The same scratch Vector3 filled with the nearest ray point. |

The preview fills the supplied scratch vector with one nearest point.

<div data-scene="practice"></div>

## Measure

Query many points with one scratch vector, then with a new vector for each query. In Chrome Performance, compare allocations, garbage collection, and CPU time.

## Your code

Write it in `drills/2/optimization/allocation-hygiene/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/allocation-hygiene/implement-1
```

## The check

The test checks the ray result, exact scratch-object identity, and unchanged ray and point.

<details><summary>Hint</summary>

Most three.js query methods accept a target object to fill in place.

</details>

## Where else?

Where else could a scratch vector help in a raycast loop?

<details><summary>A few answers</summary> Reuse one vector for each hit point or direction instead of allocating one on every frame. </details>
