---
id: 2.interaction.drag-on-plane.implement.1
loop: 2
tier: core
concepts: [interaction.drag-on-plane]
mode: implement
context: interaction.drag-on-plane/wall-drag
lenses: [space]
misconceptions: []
---

# Plane drag: keep the grab offset

> **The job:** Move a child object on a drag plane without snapping its origin to the cursor.

## Task

Find the world ray–plane hit, add the world grab offset, and return that point in the parent's local space. If the ray misses, return the child's current local position. Do not move the child.

| Function | Return |
| --- | --- |
| `planeDragLocal(ray: THREE.Ray, plane: THREE.Plane, grabOffset: THREE.Vector3, child: THREE.Object3D)` | The new position in the child's parent space. |

The yellow grab marker starts away from the blue part’s origin. The part should keep that offset and follow the wall plane.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/drag-on-plane/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/drag-on-plane/implement-1
```

## The check

The check verifies that the code keeps the offset under a rotated and translated parent. It also rejects an unanswered function.

<details><summary>Hint</summary>

The hit and grab offset are world-space; child.position is in its parent's space.

</details>

## Where else?

How would the same grab-offset rule work for a floor drag?
