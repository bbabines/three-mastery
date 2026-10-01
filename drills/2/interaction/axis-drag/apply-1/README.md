---
id: 2.interaction.axis-drag.apply.1
loop: 2
tier: core
concepts: [interaction.axis-drag]
mode: apply
context: interaction.axis-drag/height-adjust
lenses: [space]
misconceptions: []
---

# Axis drag: move a child on its parent rail

> **The job:** Turn a world drag along an axis into a child's local position.

## Task

A rail belongs to a translated and rotated parent. Project the world drag onto the world axis, add it to the child's world position, and return the target in parent-local coordinates.

| Function | Return |
| --- | --- |
| `childRailPosition(child: THREE.Object3D, worldDrag: THREE.Vector3, worldAxis: THREE.Vector3)` | The new child position in its parent's space. |

The rail sits under a turned parent. The blue part should stay on the yellow rail after a world-space drag.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/axis-drag/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/axis-drag/apply-1
```

## The check

The check verifies that the code converts a tilted world rail into parent-local position. It also rejects an unanswered function.

<details><summary>Hint</summary>

Project in world space first, then convert the target to the parent's space.

</details>

## Where else?

Where would a rail-constrained drag help besides a translation gizmo?
