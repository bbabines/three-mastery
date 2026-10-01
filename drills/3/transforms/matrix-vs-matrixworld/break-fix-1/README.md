---
id: 3.transforms.matrix-vs-matrixworld.break-and-fix.1
loop: 3
tier: core
concepts: [transforms.matrix-vs-matrixworld, transforms.add-vs-attach]
mode: break-and-fix
context: transforms.matrix-vs-matrixworld/reparenting
lenses: [space]
misconceptions: [transforms.add-vs-attach/reparent-no-move]
---

# World matrix: a part that jumps when picked up

> **The job:** move a part into a new group without moving it in the world.

## Task

`moveWithoutJump(part, newParent)` reparents the part and returns its world position. Both parent groups may be moved and turned, but have no non-uniform scale or pivot. The starter makes the part jump. Fix it so the part keeps its world transform.

The orange part should stay on the green outline when the new group takes ownership.

<div data-scene="pickup"></div>

## Spaces

| Value | Space |
| --- | --- |
| `part.position` before and after reparenting | Different parent-local spaces |
| Returned position and green outline | World space |

## Your code

Fix `drills/3/transforms/matrix-vs-matrixworld/break-fix-1/drill.ts`, write the cause in `cause.md`, and add a regression assertion in `check.ts`.

```
npm run drill -- drills/3/transforms/matrix-vs-matrixworld/break-fix-1
```

## The check

The acceptance test moves and turns both parents, then checks that the part's world position and world orientation survive reparenting. Your check must reject the jump.

<details><summary>Hint</summary>

`add` keeps local numbers. `attach` changes local numbers to keep the world transform.

</details>

## Where else?

Where else does preserving a world pose during a parent change matter?

<details><summary>A few answers</summary>

Picking up a prop, regrouping a selection, or moving a part between rack assemblies.

</details>
