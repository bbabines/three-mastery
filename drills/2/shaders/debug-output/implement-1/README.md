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

Output repeating UV values directly as red and green so seams and mirrored islands become visible. Return a working `ShaderMaterial`. The scene renders the material on a plane; the tests inspect its inputs and compile it in Chromium.

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

The Node check verifies the shader's data path. The browser check compiles and draws it on a WebGL canvas.

<details><summary>Hint</summary> Intermediate UVs are valid visible output; they do not need final lighting. </details>

## Where else?

How could a UV color reveal the seam on a mirrored texture island?

<details><summary>A starting point</summary> Visualize one intermediate value before restoring the finished fragment color. </details>
