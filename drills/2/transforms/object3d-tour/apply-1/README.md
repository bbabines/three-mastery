---
id: 2.transforms.object3d-tour.apply.1
loop: 2
tier: light
concepts: [transforms.object3d-tour, transforms.add-vs-attach]
mode: apply
context: transforms.object3d-tour/tag-sku
lenses: [space]
misconceptions: [transforms.object3d-tour/position-assign]
---

# Object3D: attach without a jump

> **The job:** Move a part to a new group while keeping its world position.

## Task

A part changes parent during an assembly step. `keepWorldOnAttach(part, newParent)` attaches it to the new group and returns its world position. The part should stay in the same visible place even though its local coordinates change.

Attach the part. The orange part and blue returned point should stay on the yellow starting spot.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Local frame under old parent, then new parent |
| `newParent` | Target local frame |
| Answer | World point |


## Your code

Write it in `drills/2/transforms/object3d-tour/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/object3d-tour/apply-1

## The check

The check uses two translated and rotated groups. It checks the part’s parent changed while its world position stayed fixed.

<details><summary>Hint</summary>

`add` keeps local coordinates and usually makes the part jump. `attach` adjusts the local transform to preserve its world pose.

</details>

## Where else?

Where else do you reparent without a visible jump?

<details><summary>A few answers</summary>

Picking up an object. Moving a tool between rigs. Reorganizing a scene hierarchy.

</details>
