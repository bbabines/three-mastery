---
id: 2.queries.bounds-primitives.apply.1
loop: 2
tier: light
concepts: [queries.bounds-primitives, queries.aabb-vs-obb]
mode: apply
context: queries.bounds-primitives/placement-overlap
lenses: [space]
misconceptions: []
---

# Bounds: containment and rotation

> **The job:** Use signed plane distance and compare a rotated object's world AABB.

## Task

Return whether a point is on the positive side of a Plane. For a rotated box Mesh, return the world AABB size after updating matrices.

| Function | Return |
| --- | --- |
| `positiveSide(plane: THREE.Plane, point: THREE.Vector3)` | Whether the point lies on the positive side of the plane. |
| `worldAabbSize(mesh: THREE.Mesh)` | The axis-aligned world box size of a rotated Mesh. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Plane and point | World space |
| Rotated mesh | Geometry in its own space; transform in the scene |
| Box size | Lengths along world axes |

## Your code

Write it in `drills/2/queries/bounds-primitives/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/bounds-primitives/apply-1
```

## The check

The tests use both signs of plane distance and measure the expanded AABB of a turned box.

<details><summary>Hint</summary>

Plane distance is signed. A world AABB stays aligned with the axes, so turning expands it.

</details>

## Where else?

Where else do signed distances or rotated bounds decide a result?

<details><summary>A few answers</summary> Placement zones, trigger volumes, or a visibility check. </details>
