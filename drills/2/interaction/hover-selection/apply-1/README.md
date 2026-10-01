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

The blue part is selected and no longer hovered. It should keep its selected emphasis while orbit is disabled only during a drag.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/interaction/hover-selection/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/hover-selection/apply-1
```

## The check

The check verifies that the code keeps selection when hover exits; disables orbit only during a custom drag. It also rejects an unanswered function.

<details><summary>Hint</summary>

Selection and hover are distinct states. A custom drag must own pointer movement while active.

</details>

## Where else?

How would you keep a selected part highlighted as the pointer moves elsewhere?
