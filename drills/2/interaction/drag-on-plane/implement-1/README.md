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

Try the scene. The readout changes when your function gives an answer.

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

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

The hit and grab offset are world-space; child.position is in its parent's space.

</details>

## Where else?

Where else would the same code help? The concept card lists Floor drag, 3D slider.
