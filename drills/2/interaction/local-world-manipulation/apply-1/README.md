---
id: 2.interaction.local-world-manipulation.apply.1
loop: 2
tier: core
concepts: [interaction.local-world-manipulation]
mode: apply
context: interaction.local-world-manipulation/gizmo-space
lenses: [space]
misconceptions: []
---

# Move along a rotated part's local axis

> **The job:** Move a child along its own rotated direction while storing a parent-local position.

## Task

Return the new parent-local position after moving a child `distance` world units along its local X axis. Include both its rotation and its parent's rotation.

| Function | Return |
| --- | --- |
| `moveAlongLocalX(child: THREE.Object3D, distance: number)` | The new position measured from the child's parent. |

The blue part sits under a turned parent. A local X move should follow the part’s own axis, then end in parent-local coordinates.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/local-world-manipulation/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/local-world-manipulation/apply-1
```

## The check

The check verifies that the code uses both parent and child rotation. It also rejects an unanswered function.

<details><summary>Hint</summary>

The local direction changes with both rotations; position still belongs to the parent.

</details>

## Where else?

When would a part follow its own turned axis rather than a fixed world axis?
