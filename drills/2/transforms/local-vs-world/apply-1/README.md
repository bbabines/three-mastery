---
id: 2.transforms.local-vs-world.apply.1
loop: 2
tier: core
concepts: [transforms.local-vs-world]
mode: apply
context: transforms.local-vs-world/light-on-part
lenses: [space]
misconceptions: [transforms.local-vs-world/position-is-world]
---

# Local vs world: place a work light a fixed offset from a nested part, returning the light spot in world space without changing the offset

> **The job:** Place a work light a fixed offset from a nested part, returning the light spot in world space without changing the offset.

## Task

Place a work light a fixed offset from a nested part, returning the light spot in world space without changing the offset.

Write `lightWorld(part, localOffset)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Its local frame is relative to its parent |
| `localOffset` | Part local space |
| Answer | World space |

## Your code

Write it in `drills/2/transforms/local-vs-world/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/local-vs-world/apply-1

## The check

It passes when `lightWorld` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the local vs world page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

A part's world position. Attaching a light to a part.

</details>
