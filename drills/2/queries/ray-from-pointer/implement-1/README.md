---
id: 2.queries.ray-from-pointer.implement.1
loop: 2
tier: core
concepts: [queries.ray-from-pointer]
mode: implement
context: queries.ray-from-pointer/hover
lenses: [space]
misconceptions: []
---

# Pointer ray: canvas coordinates

> **The job:** Turn viewport pointer pixels into canvas-relative normalized coordinates.

## Task

Given a pointer position in CSS pixels and a canvas rectangle, return NDC: left is −1, right is +1, top is +1, bottom is −1. Do not multiply by DPR.

| Function | Return |
| --- | --- |
| `pointerNdc(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number })` | The pointer as canvas-relative NDC. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/queries/ray-from-pointer/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/ray-from-pointer/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Use the canvas bounds in CSS pixels, not the window or drawing buffer.

</details>

## Where else?

Where else would the same code help? The concept card lists Click, Drag start.
