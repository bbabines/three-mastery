---
id: 2.transforms.update-timing.apply.1
loop: 2
tier: core
concepts: [transforms.update-timing]
mode: apply
context: transforms.update-timing/external-sync
lenses: [space]
misconceptions: [transforms.update-timing/stale-read]
---

# Update timing: move a bounds marker

> **The job:** Place a marker at a part’s world center just after its parent moves.

## Task

`freshBoundsCenter(part, localCenter)` returns the world point for a bounds center in the part’s local frame. A parent may have moved since the last render. Leave the local center unchanged.

Move the parent. The blue marker should follow the yellow bounds center immediately.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Local frame under a parent |
| `localCenter` | Part local point |
| Answer | World point |


## Your code

Write it in `drills/2/transforms/update-timing/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/update-timing/apply-1

## The check

The check changes an ancestor after an earlier matrix update, then verifies the marker without rendering another frame. It checks the local center is unchanged.

<details><summary>Hint</summary>

Refresh the full parent chain before using `matrixWorld`. A rendered frame might update it later, but the answer is needed now.

</details>

## Where else?

Where else do you need a fresh world point between frames?

<details><summary>A few answers</summary>

Collision queries. Drag handles. Audio emitters on moving parts.

</details>
