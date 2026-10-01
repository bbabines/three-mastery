---
id: 2.transforms.pivots.apply.1
loop: 2
tier: light
concepts: [transforms.pivots]
mode: apply
context: transforms.pivots/corner-scale
lenses: [space]
misconceptions: [transforms.pivots/center-rotation]
---

# Pivots: swing a point on a door around its hinge instead of around the scene origin, keeping the input points intact

> **The job:** Swing a point on a door around its hinge instead of around the scene origin, keeping the input points intact.

## Task

Swing a point on a door around its hinge instead of around the scene origin, keeping the input points intact.

Write `swingDoor(hinge, point, angle)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `hinge` | World space unless named local |
| `point` | World space unless named local |
| `angle` | Value in the units named in the Task |
| Answer | Scalar or object described in the Task |

## Your code

Write it in `drills/2/transforms/pivots/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/pivots/apply-1

## The check

It passes when `swingDoor` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the pivots page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Door hinge. Rotating around a bounding box center.

</details>
