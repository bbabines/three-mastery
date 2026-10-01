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

# Object3D and attach: move a part into a new group with the object3d attach operation, keeping the part at the same world spot

> **The job:** Move a part into a new group with the Object3D attach operation, keeping the part at the same world spot.

## Task

Move a part into a new group with the Object3D `attach` operation, keeping the part at the same world spot. The parents have only position and rotation; `attach` cannot keep the world transform exactly under non-uniform scale.

Write `keepWorldOnAttach(part, newParent)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Its local frame is relative to its parent |
| `newParent` | Its local frame is relative to its parent |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/transforms/object3d-tour/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/object3d-tour/apply-1

## The check

It passes when `keepWorldOnAttach` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the object3d and attach page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Placing and turning a product. Hiding a part.

</details>
