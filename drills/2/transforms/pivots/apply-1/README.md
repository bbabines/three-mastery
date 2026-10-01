---
id: 2.transforms.pivots.apply.1
loop: 2
tier: light
concepts: [transforms.pivots]
mode: apply
context: transforms.pivots/corner-scale
lenses: [space]
misconceptions: [transforms.pivots/center-rotation]
---

# Pivots: swing a door

> **The job:** Swing a point around a door hinge away from the scene origin.

## Task

`swingDoor(hinge, point, angle)` returns the point after a positive `angle` in radians around the world Y axis through `hinge`. Keep both input points unchanged.

Move the turn slider. The blue door edge should meet the yellow swing target.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `hinge` | World point on hinge |
| `point` | World point on door |
| `angle` | Radians around world Y |
| Answer | World point |


## Your code

Write it in `drills/2/transforms/pivots/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/pivots/apply-1

## The check

The check places the hinge away from the origin and turns in both directions. It checks the returned point and both inputs.

<details><summary>Hint</summary>

Move the point into the hinge’s frame, turn it around Y, then move it back. A turn around the world origin swings the wrong arc.

</details>

## Where else?

Where else do you rotate around an offset pivot?

<details><summary>A few answers</summary>

A robot elbow. A turntable corner. A cabinet handle.

</details>
