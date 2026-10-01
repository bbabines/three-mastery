---
id: 2.shaders.built-in-functions.implement.1
loop: 2
tier: core
concepts: [shaders.built-in-functions]
mode: implement
context: shaders.built-in-functions/rings
lenses: [space]
misconceptions: [shaders.built-in-functions/step-smoothstep]
---

# Built in functions: rings

> **The job:** Draw a ring whose two edges blend smoothly over a supplied width, using `smoothstep` on distance from UV center.

## Task

Draw a ring whose two edges blend smoothly over a supplied width, using `smoothstep` on distance from UV center. Return a working `ShaderMaterial`. The scene renders the material on a plane; the tests inspect its inputs and compile it in Chromium.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `softRing` in `drills/2/shaders/built-in-functions/implement-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/built-in-functions/implement-1
```

## The check

The Node check verifies the shader's data path. The browser check compiles and draws it on a WebGL canvas.

<details><summary>Hint</summary> A hard `step` aliases at edges; subtract two smooth transitions to keep the ring soft. </details>

## Where else?

How would this ring edge look if both `smoothstep` calls became `step`?

<details><summary>A starting point</summary> Visualize one intermediate value before restoring the finished fragment color. </details>
