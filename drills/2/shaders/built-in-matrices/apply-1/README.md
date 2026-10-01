---
id: 2.shaders.built-in-matrices.apply.1
loop: 2
tier: core
concepts: [shaders.built-in-matrices]
mode: apply
context: shaders.built-in-matrices/screen-space
lenses: [space]
misconceptions: []
---

# Built in matrices: screen space

> **The job:** Transform local vertices through model-view and projection matrices, then color by device-pixel X over supplied resolution.

## Task

Transform local vertices through model-view and projection matrices, then color by device-pixel X over supplied resolution. Write `screenGradient(resolution)`. Use the model-view and projection matrices for position, then divide device-pixel X by the supplied resolution.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `screenGradient` in `drills/2/shaders/built-in-matrices/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/built-in-matrices/apply-1
```

## The check

The Node test checks the resolution uniform and matrix path; the browser test checks compilation and drawing.

<details><summary>Hint</summary> `gl_Position` is clip space; `gl_FragCoord` is device pixels after rasterization. </details>

## Where else?

How would a view-space rim mask change if you accidentally used world normals?

<details><summary>A few answers</summary> A rim mask compares the view direction with a normal transformed into view space; a world normal would shift the effect as the camera moves. </details>
