---
id: 2.shaders.debug-output.implement.1
loop: 2
tier: core
concepts: [shaders.debug-output]
mode: implement
context: shaders.debug-output/uv-seams
lenses: [space]
misconceptions: [shaders.debug-output/final-color-only]
---

# Debug output: uv seams

> **The job:** Output repeating UV values directly as red and green so seams and mirrored islands become visible.

## Task

Output repeating UV values directly as red and green so seams and mirrored islands become visible. Write `uvDebug()` so repeating UV values appear as red and green without lighting or color conversion.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `uvDebug` in `drills/2/shaders/debug-output/implement-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/debug-output/implement-1
```

## The check

The Node test checks the UV output path; the browser test checks compilation and drawing.

<details><summary>Hint</summary> Intermediate UVs are valid visible output; they do not need final lighting. </details>

## Where else?

How could a UV color reveal the seam on a mirrored texture island?

<details><summary>A few answers</summary> A mirrored island reverses the direction of its color ramp, exposing the boundary even when the texture appears continuous. </details>
