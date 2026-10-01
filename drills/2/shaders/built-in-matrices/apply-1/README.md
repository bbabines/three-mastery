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

Transform local vertices through model-view and projection matrices, then color by device-pixel X over supplied resolution. Return a working `ShaderMaterial`. The scene renders the material on a plane; the tests inspect its inputs and compile it in Chromium.

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

The Node check verifies the shader's data path. The browser check compiles and draws it on a WebGL canvas.

<details><summary>Hint</summary> `gl_Position` is clip space; `gl_FragCoord` is device pixels after rasterization. </details>

## Where else?

How would a view-space rim mask change if you accidentally used world normals?

<details><summary>A starting point</summary> Visualize one intermediate value before restoring the finished fragment color. </details>
