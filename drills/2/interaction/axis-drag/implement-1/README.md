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

Try the scene. The readout changes when your function gives an answer.

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

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Project the whole world movement onto the rail axis, not the screen x movement.

</details>

## Where else?

Where else would the same code help? The concept card lists Height adjustment, Sliding along a rail.
