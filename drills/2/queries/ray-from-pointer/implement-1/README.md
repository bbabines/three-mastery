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
| Pointer and canvas rectangle | Viewport CSS pixels |
| Returned point | Canvas NDC, from −1 to +1 |

## Your code

Write it in `drills/2/queries/ray-from-pointer/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/ray-from-pointer/implement-1
```

## The check

The test uses an offset, non-square canvas rectangle and checks center and corner NDC values.

<details><summary>Hint</summary>

Use the canvas bounds in CSS pixels, not the window or drawing buffer.

</details>

## Where else?

Where else can a canvas offset shift a pointer action?

<details><summary>A few answers</summary> Touch picking, hover, or a drag on a scrolled page. </details>
