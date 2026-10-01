---
id: 2.transforms.inverse-matrices.implement.1
loop: 2
tier: core
concepts: [transforms.inverse-matrices]
mode: implement
context: transforms.inverse-matrices/world-to-local
lenses: [space]
misconceptions: [transforms.inverse-matrices/inverse-transpose]
---

# Inverse matrices: hit a nested part

> **The job:** Find the local hit point on a part inside a moved assembly.

## Task

A hit arrives in world space, but a nested part defines its geometry locally. `pointInPart(part, worldPoint)` returns that hit in the part’s local frame. The part and its ancestors may have moved since the last frame. Leave the hit and object transforms unchanged.

The blue local hit should meet the yellow spot on the gray local ghost.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Local frame under its parent |
| `worldPoint` | World point |
| Answer | Part local point |


## Your code

Write it in `drills/2/transforms/inverse-matrices/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/inverse-matrices/implement-1

## The check

The check moves a parent and part, then checks the local hit without relying on a render. It also checks the world point and object transforms are intact.

<details><summary>Hint</summary>

`worldToLocal` uses the part’s full ancestry. Pass it a copy of the point so the original world hit remains available.

</details>

## Where else?

Where else must a world hit become local?

<details><summary>A few answers</summary>

A decal on a moving part. A local bounding-box test. A drag handle attached to a child.

</details>
