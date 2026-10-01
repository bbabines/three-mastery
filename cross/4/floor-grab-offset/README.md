---
id: 4.interaction.drag-on-plane.cross.1
loop: 4
tier: core
concepts: [math.point-vs-direction, queries.ray-plane, interaction.drag-on-plane]
mode: cross-domain
context: interaction.drag-on-plane/floor-drag
lenses: [space]
misconceptions: []
---

# Drag a part across the floor with a grab offset

> **The job:** Move a dragged part across the floor without snapping its origin to the pointer.

## Task

A part is grabbed away from its origin. Write `dragFloor(ray, grabbed, origin)` to place its origin after the pointer ray meets the horizontal plane through `grabbed`. Keep the original gap from the grabbed point to the origin. If the ray does not hit in front of it, leave the origin where it is. Do not change the inputs.

<div data-scene="floor"></div>

## Spaces

| Value | Space |
| --- | --- |
| `ray`, `grabbed`, `origin` | World space |
| Return value | World space |

## Your code

Write it in `cross/4/floor-grab-offset/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/floor-grab-offset
```

## The check

The check uses an off-center grab, a sloping ray, and a parallel ray. It also checks that the input points stay unchanged.

<details><summary>Hint</summary>

What gap separates the grabbed point from the part origin at pointer-down, and should that gap change?

</details>

## Where else?

When else does an off-center grab matter?

<details><summary>A few answers</summary>

Dragging a wall-mounted handle, a 3D slider thumb, or a gizmo grabbed away from its pivot.

</details>
