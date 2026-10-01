---
id: 2.queries.filtering.apply.1
loop: 2
tier: light
concepts: [queries.filtering, queries.ray-aabb]
mode: apply
context: queries.filtering/ignore-helpers
lenses: []
misconceptions: []
---

# Pick filtering and bounds early-out

> **The job:** Use a target list to ignore helpers and a box test to skip distant objects.

## Task

Return the first selectable Mesh hit by a ray, ignoring every unlisted helper. Separately return whether a ray touches a Box3 in front of its origin.

| Function | Return |
| --- | --- |
| `firstTargetName(ray: THREE.Ray, targets: THREE.Object3D[])` | The nearest name among only the target objects. |
| `rayTouchesBox(ray: THREE.Ray, box: THREE.Box3)` | Whether the forward ray touches the box. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/queries/filtering/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/filtering/apply-1
```

## The check

The tests ignore a closer unlisted helper, detect a ray starting inside a box, and reject a box behind the ray.

<details><summary>Hint</summary>

Raycaster only tests the objects you pass it. A ray begins at its origin and moves forward.

</details>

## Where else?

Where else should a visible object be excluded from a hit test?

<details><summary>A few answers</summary> Editor helpers, floor-only placement, or a ghost preview. </details>
