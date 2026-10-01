---
id: 2.interaction.hover-selection.apply.1
loop: 2
tier: light
concepts: [interaction.hover-selection, interaction.controls-coexistence]
mode: apply
context: interaction.hover-selection/multi-select
lenses: []
misconceptions: []
---

# Selection: state and control ownership

> **The job:** Keep selection stronger than hover and stop orbit while dragging.

## Task

A selected part should stay selected when its hover ends. Return the visual state from selected and hovered flags. Set OrbitControls enabled to the opposite of dragging, preserving its other settings.

| Function | Return |
| --- | --- |
| `partState(selected: boolean, hovered: boolean)` | The visual state with selection taking priority. |
| `setOrbitDragState(controls: { enabled: boolean }, dragging: boolean)` | Whether orbit is enabled after the drag state is applied. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/interaction/hover-selection/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/hover-selection/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Selection and hover are distinct states. A custom drag must own pointer movement while active.

</details>

## Where else?

Where else would the same code help? The concept card lists Part highlight, Deselect on empty click.
