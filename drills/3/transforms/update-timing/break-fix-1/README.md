---
id: 3.transforms.update-timing.break-and-fix.1
loop: 3
tier: core
concepts: [transforms.update-timing, transforms.pivots]
mode: break-and-fix
context: transforms.pivots/door-hinge
lenses: [space]
misconceptions: [transforms.update-timing/stale-read]
---

# Update timing: a door marker that lags behind

> **The job:** keep a hinge marker on a moved door in the same update.

## Task

`movedAnchor(part, newPosition, anchorLocal)` moves a part to `newPosition` in its parent's space, then returns the world-space location of `anchorLocal`. The part may have a pivot, rotation, and parent. The starter gives the marker an old location after the move. Fix the same-tick read without changing `anchorLocal`.

Move the door with the slider. The orange marker should stay on its green hinge.

<div data-scene="door"></div>

## Spaces

| Value | Space |
| --- | --- |
| `newPosition` | Parent-local position |
| `anchorLocal` | Part-local point |
| Returned marker position | World-space point |

## Your code

Fix `drills/3/transforms/update-timing/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/transforms/update-timing/break-fix-1
```

## The check

The acceptance test moves a pivoted part and reads the marker immediately, including under a moved parent. Your check must reject a stale matrix read.

<details><summary>Hint</summary>

Changing `position` marks the object's world matrix for update; reading `matrixWorld` directly does not force that update. `updateWorldMatrix(true, false)` refreshes its parents too.

</details>

## Where else?

What other same-tick reads can use an old transform?

<details><summary>A few answers</summary>

World bounds, a raycast after a drag, or an attached label's world point.

</details>
