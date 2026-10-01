---
id: 2.geometry.bounding-volumes.apply.1
loop: 2
tier: light
concepts: [geometry.bounding-volumes]
mode: apply
context: geometry.bounding-volumes/camera-fit
lenses: []
misconceptions: [geometry.bounding-volumes/world-space]
---

# Bounding volumes: refresh a sphere

> **The job:** Refresh a local bounding sphere after vertices move.

## Task

Write `freshBoundingSphere(geometry)`. The position array has been edited directly since the sphere was last computed. Recompute the geometry’s bounding sphere and return a separate Sphere with the new center and radius. The sphere is measured from the object itself, before its world transform.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `geometry positions` | Measured from the object itself |
| Answer | Sphere center and radius in the same space |

## Your code

Write it in `drills/2/geometry/bounding-volumes/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/bounding-volumes/apply-1

## The check

The new sphere encloses the edited vertices and is not the stale sphere from before the change.

<details><summary>Hint</summary>

A bound cached before a position edit does not follow array writes. Which geometry method rebuilds it?

</details>

## Where else?

What else needs a refreshed bound?

<details><summary>A few answers</summary>

Camera framing, frustum culling, or a quick raycast rejection.

</details>
