---
id: 2.interaction.local-world-manipulation.implement.1
loop: 2
tier: core
concepts: [interaction.local-world-manipulation]
mode: implement
context: interaction.local-world-manipulation/rotate-in-parent
lenses: [space]
misconceptions: []
---

# Gizmo axes: local or world

> **The job:** Return the axis a gizmo should show after a local/world toggle.

## Task

For `world`, return the given axis unchanged. For `local`, turn it by the object's world orientation. Return a unit world-space direction without changing the input axis.

| Function | Return |
| --- | --- |
| `gizmoWorldAxis(object: THREE.Object3D, axis: THREE.Vector3, mode: "local" | "world")` | The chosen local or world axis as a world direction. |

The part and its parent are turned. The local X arrow should turn with both; the world X arrow should remain fixed.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/local-world-manipulation/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/local-world-manipulation/implement-1
```

## The check

The check verifies that the code changes local axes with a rotated parent but keeps world axes fixed. It also rejects an unanswered function.

<details><summary>Hint</summary>

The local axis follows the object's world quaternion; the world axis does not.

</details>

## Where else?

When would a part follow its own turned axis rather than a fixed world axis?
