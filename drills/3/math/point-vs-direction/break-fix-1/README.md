---
id: 3.math.point-vs-direction.break-and-fix.1
loop: 3
tier: core
concepts: [math.point-vs-direction, math.length]
mode: break-and-fix
context: math.length/nearest-object
lenses: [space]
misconceptions:
  - math.point-vs-direction/always-position
---

# Point vs direction: the nearest rack part

> **The job:** find the closest part within reach of a worker.

## Task

`nearestWithin(center, parts, radius)` returns the index of the nearest part within `radius`, or −1 if none qualify. The worker and parts are positions in world space. The starter chooses the wrong part when the worker is away from the world origin. Fix it without changing the inputs.

<div data-scene="rack"></div>

## Spaces

| Value | Space |
| --- | --- |
| `center`, each `part` | World-space position |
| Difference used for distance | World-space direction from worker to part |

## Your code

Fix `drills/3/math/point-vs-direction/break-fix-1/drill.ts`. Name the cause in `cause.md`, then replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/math/point-vs-direction/break-fix-1
```

## The check

The acceptance test moves the worker to several world positions, includes out-of-range parts, and checks that inputs stay unchanged. Your check must fail on the original code and pass on the fix.

<details><summary>Hint</summary>

The distance between two places is the length of a direction between them. `lengthSq` can compare those distances if the radius is squared too.

</details>

## Where else?

Where else does using a world position as a distance from the origin pick the wrong result?

<details><summary>A few answers</summary>

Picking the nearest interactable, checking a sensor radius, or sorting parts by distance to a camera.

</details>
