---
id: 3.math.float-tolerance.break-and-fix.1
loop: 3
tier: core
concepts: [math.lerp, math.float-tolerance]
mode: break-and-fix
context: math.float-tolerance/vector-equality
lenses: [space]
misconceptions:
  - math.float-tolerance/equal-math-equal-floats
---

# Floating-point tolerance: an arrival light that never turns on

> **The job:** light up a beacon when a moving part is close enough to its destination.

## Task

`hasArrived(start, destination, progress, tolerance)` lerps a part from its start position toward its destination, then says whether it is within `tolerance` world units. `progress` runs from 0 to 1. The starter leaves the arrival light off almost until the exact endpoint. Fix it without changing the positions.

Move the progress slider. The green arrival light should come on when the moving part enters the destination's translucent radius.

<div data-scene="arrival"></div>

## Spaces

| Value | Space |
| --- | --- |
| `start`, `destination`, lerped position | World-space points |
| `tolerance` | World-space distance |

## Your code

Fix `drills/3/math/float-tolerance/break-fix-1/drill.ts`, write the cause in `cause.md`, and replace `check.ts`'s placeholder with a regression assertion.

```
npm run drill -- drills/3/math/float-tolerance/break-fix-1
```

## The check

The acceptance test checks positions just inside and outside a tolerance, a translated path, and unchanged inputs. Your check must reject exact-only arrival.

<details><summary>Hint</summary>

The destination is a point, and the tolerance is a distance around it. Compare a distance with a distance, or squared distance with squared tolerance.

</details>

## Where else?

Where else can exact equality make a system wait forever?

<details><summary>A few answers</summary>

Camera motion settling, object snapping, or a nearly coplanar geometry check.

</details>
