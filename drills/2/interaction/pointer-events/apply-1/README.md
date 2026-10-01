---
id: 2.interaction.pointer-events.apply.1
loop: 2
tier: light
concepts: [interaction.pointer-events, interaction.click-vs-drag]
mode: apply
context: interaction.pointer-events/touch-tap
lenses: [space]
misconceptions: []
---

# Pointer: a click or a drag

> **The job:** Convert CSS pointer pixels to canvas NDC and classify movement.

## Task

Pointer coordinates are viewport CSS pixels. Subtract the canvas rectangle and scale to NDC. Return whether a gesture moved farther than a CSS-pixel threshold; do not multiply either by DPR.

| Function | Return |
| --- | --- |
| `canvasNdc(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number })` | Canvas-relative normalized coordinates. |
| `wasDrag(down: THREE.Vector2, up: THREE.Vector2, thresholdCssPx: number)` | Whether movement exceeded the drag threshold. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/pointer-events/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/pointer-events/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Pointer events report CSS pixels, while NDC is always −1 to +1.

</details>

## Where else?

Where else would the same code help? The concept card lists Click, Pen input.
