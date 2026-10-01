---
id: 2.shaders.built-in-matrices.implement.1
loop: 2
tier: core
concepts: [shaders.built-in-matrices]
mode: implement
context: shaders.built-in-matrices/rim-light
lenses: [space]
misconceptions: [shaders.built-in-matrices/world-normals]
---

# Built in matrices: rim light

> **The job:** Compute a rim mask from a normal transformed by `normalMatrix`, which produces a view-space normal.

## Task

Compute a rim mask from a normal transformed by `normalMatrix`, which produces a view-space normal. Return a working `ShaderMaterial`. The scene renders the material on a plane; the tests inspect its inputs and compile it in Chromium.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `viewRim` in `drills/2/shaders/built-in-matrices/implement-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/built-in-matrices/implement-1
```

## The check

The Node check verifies the shader's data path. The browser check compiles and draws it on a WebGL canvas.

<details><summary>Hint</summary> `normalMatrix` does not give world normals. Its output is in view space, where the camera looks down -Z. </details>

## Where else?

Would the same `normalMatrix` result be valid for a world-space height gradient?

<details><summary>A starting point</summary> Visualize one intermediate value before restoring the finished fragment color. </details>
