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

# Local vs world: place a work light

> **The job:** Place a light at a local offset from a moving machine part.

## Task

A work light is bolted to a nested part. `lightWorld(part, localOffset)` returns the offset’s current world position. The part may be turned and shifted by its ancestors. Leave the local offset unchanged.

Move the rack. The blue light should follow the yellow mounting spot.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Local frame under its parent |
| `localOffset` | Part local point |
| Answer | World point |


## Your code

Write it in `drills/2/transforms/local-vs-world/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/local-vs-world/apply-1

## The check

The check rotates and moves the part’s parent, then compares the world light spot. It checks that the local offset is unchanged.

<details><summary>Hint</summary>

`localToWorld` walks the full parent chain. Give it a copy of the mounting offset.

</details>

## Where else?

Where else does a local mounting point need a world spot?

<details><summary>A few answers</summary>

A tool tip. A camera bolted to a rig. A label pinned to a model.

</details>
