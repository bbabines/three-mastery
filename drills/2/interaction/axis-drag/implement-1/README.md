---
id: 2.interaction.axis-drag.implement.1
loop: 2
tier: core
concepts: [interaction.axis-drag]
mode: implement
context: interaction.axis-drag/gizmo-axis
lenses: [space]
misconceptions: []
---

# Axis drag: project movement onto a rail

> **The job:** Keep only the part of pointer motion that runs along a world-space axis.

## Task

Return the world motion from `start` to `end` projected onto `axis`. The axis can have any length. Do not change any inputs.

| Function | Return |
| --- | --- |
| `railDelta(start: THREE.Vector3, end: THREE.Vector3, axis: THREE.Vector3)` | The world-space drag movement along the axis. |

The yellow rail is tilted. The blue part should travel along it even when the pointer motion points partly across it.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/axis-drag/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/axis-drag/implement-1
```

## The check

The check verifies that the code projects onto a tilted non-unit rail without changing inputs. It also rejects an unanswered function.

<details><summary>Hint</summary>

Project the whole world movement onto the rail axis, not the screen x movement.

</details>

## Where else?

Where would a rail-constrained drag help besides a translation gizmo?
