---
id: 3.transforms.local-vs-world.break-and-fix.1
loop: 3
tier: core
concepts: [transforms.object3d-tour, transforms.local-vs-world]
mode: break-and-fix
context: transforms.local-vs-world/world-position
lenses: [space]
misconceptions: [transforms.local-vs-world/position-is-world]
---

# Local vs world: a lamp left at the origin

> **The job:** put an inspection lamp at the position of a part inside a rack.

## Task

`lampPosition(part)` returns the part's world-space position. The part can sit inside moved, turned, or scaled parent groups. The starter leaves the lamp at the wrong place when the part is nested. Fix it without changing the part's local transform.

The orange lamp should sit on the green part, wherever the rack moves.

<div data-scene="lamp"></div>

## Spaces

| Value | Space |
| --- | --- |
| `part.position` | Part's parent's local space |
| Returned lamp position | World space |

## Your code

Fix `drills/3/transforms/local-vs-world/break-fix-1/drill.ts`, name the cause in `cause.md`, then write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/transforms/local-vs-world/break-fix-1
```

## The check

The acceptance test nests the part under turned and scaled groups and checks that local values stay unchanged. Your check must reject the original code.

<details><summary>Hint</summary>

The Object3D tour names the method that reports where an object is in the world, refreshing parent matrices on the way.

</details>

## Where else?

Where else does reading a child's local position produce a misplaced world marker?

<details><summary>A few answers</summary>

Placing a label, aiming a light, or moving an attached tool to a part.

</details>
