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

# Update timing: put a marker at the world center of a part directly after the part or one of its parents moves

> **The job:** Put a marker at the world center of a part directly after the part or one of its parents moves.

## Task

Put a marker at the world center of a part directly after the part or one of its parents moves.

Write `freshBoundsCenter(part, localCenter)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Its local frame is relative to its parent |
| `localCenter` | Part local space |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/transforms/update-timing/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/update-timing/apply-1

## The check

It passes when `freshBoundsCenter` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the update timing page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Raycasting right after a move. Bounds after a transform.

</details>
