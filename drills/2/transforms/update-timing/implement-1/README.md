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

# Update timing: get a point on a part in world space immediately after an ancestor moves, before another frame renders

> **The job:** Get a point on a part in world space immediately after an ancestor moves, before another frame renders.

## Task

Get a point on a part in world space immediately after an ancestor moves, before another frame renders.

Write `freshWorldPoint(part, localPoint)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Its local frame is relative to its parent |
| `localPoint` | Part local space |
| Answer | World space |

## Your code

Write it in `drills/2/transforms/update-timing/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/update-timing/implement-1

## The check

It passes when `freshWorldPoint` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the update timing page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Raycasting right after a move. Syncing to external data.

</details>
