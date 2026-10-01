---
id: 2.transforms.update-timing.implement.1
loop: 2
tier: core
concepts: [transforms.update-timing]
mode: implement
context: transforms.update-timing/bounds-after-transform
lenses: [space]
misconceptions: [transforms.update-timing/stale-read]
---

# Update timing: read a moved point

> **The job:** Read a point on a nested part immediately after an ancestor shifts.

## Task

`freshWorldPoint(part, localPoint)` returns the local point in world space without waiting for the next render. The part’s parent may have changed position or turn. Leave the local point unchanged.

Move the rack. The blue point should meet the yellow mark before another frame renders.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Local frame under a parent |
| `localPoint` | Part local point |
| Answer | World point |


## Your code

Write it in `drills/2/transforms/update-timing/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/update-timing/implement-1

## The check

The check moves an ancestor after its last update, then compares the world point immediately. It checks the local input is unchanged.

<details><summary>Hint</summary>

Call `updateWorldMatrix` through the parent chain, then apply the current world matrix to a copy of the point.

</details>

## Where else?

Where else is a fresh world-space attachment needed?

<details><summary>A few answers</summary>

A live collision probe. A tool tip. A camera rig marker.

</details>
