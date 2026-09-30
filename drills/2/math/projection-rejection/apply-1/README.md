---
id: 2.math.projection-rejection.apply.1
loop: 2
tier: core
concepts: [math.projection-rejection]
mode: apply
context: math.projection-rejection/closest-point-line
lenses: []
misconceptions:
  - math.projection-rejection/zero-an-axis
---

# Projection: keep clear of a pipe

> **The job:** find the nearest point on a pipe, then push anything too close straight out from it.

## Task

In a warehouse planner, a sprinkler pipe runs from `pipeStart` to `pipeEnd`, and anything placed near it has to stay at least `clearance` from the pipe's center line. Write `keepClear(point, pipeStart, pipeEnd, clearance)`:

- If `point` is at least `clearance` from the pipe already, return it where it is.
- Otherwise, push it straight away from the nearest point on the pipe until it's exactly `clearance` away.

`new Line3(pipeStart, pipeEnd).closestPointToPoint(point, true, target)` finds the nearest point on the pipe; `true` keeps it between the pipe's ends. `point` is never exactly on the center line. Don't change any of the vectors.

Move the part with the sliders. The grey ghost is where you put it; the solid ball is where `keepClear` lets it sit.

<div data-scene="pipe"></div>

## Your code

Write it in `drills/2/math/projection-rejection/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/projection-rejection/apply-1
```

## The check

It passes when a point that's already clear stays put, a close point ends up exactly `clearance` from the pipe, straight out from the same nearest point, a point past the pipe's end is pushed away from the end, the pipe runs at an angle to every axis, and the inputs come back unchanged.

<details>
<summary>Hint</summary>

The move from the nearest point on the pipe to `point` is the leftover part, at right angles to the pipe. `setLength` changes a move's length and keeps its direction.

</details>

## Where else?

Where else would you split a move into the part along a line and the part at right angles to it?

<details>
<summary>A few answers</summary>

A character sliding along a wall. Snapping a label to the nearest edge of a part. Measuring how far off a planned route a vehicle has drifted.

</details>
