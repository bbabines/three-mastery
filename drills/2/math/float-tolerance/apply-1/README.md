---
id: 2.math.float-tolerance.apply.1
loop: 2
tier: core
concepts: [math.float-tolerance]
mode: apply
context: math.float-tolerance/coplanar-checks
lenses: []
misconceptions:
  - math.float-tolerance/equal-math-equal-floats
---

# Tolerance: is the panel flat?

> **The job:** decide whether four corners lie on one flat surface, allowing for rounding.

## Task

A rack's side panels come from a CAD export as four corners each. A flat panel can be drawn as one flat piece; a bent one gets flagged for a fix. Write `isFlatPanel(a, b, c, d, tolerance)`, which returns `true` when corner `d` is within `tolerance` of the flat surface through `a`, `b`, and `c`, on either side of it.

`new Plane().setFromCoplanarPoints(a, b, c)` makes that surface, and `plane.distanceToPoint(d)` says how far `d` is from it: positive on one side and negative on the other. Don't change the corners.

Bend the panel with the slider, both ways. It turns red when `isFlatPanel` flags it.

<div data-scene="panel"></div>

## Your code

Write it in `drills/2/math/float-tolerance/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/float-tolerance/apply-1
```

## The check

It passes when a panel that's turned and moved, which rounding leaves a hair off flat, counts as flat, bends bigger than the tolerance are flagged on both sides, bends within it aren't, and the corners come back unchanged.

<details>
<summary>Hint</summary>

The distance is almost never exactly 0 for a panel that's been turned. What about a corner bent the other way, where the distance is negative?

</details>

## Where else?

Where else does a check need "close enough" instead of "exactly"?

<details>
<summary>A few answers</summary>

Deciding whether two parts touch. Testing that a transform put a point where it should. Checking that a normal has length 1.

</details>
