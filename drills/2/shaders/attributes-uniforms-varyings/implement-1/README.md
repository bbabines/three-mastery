---
id: 2.shaders.attributes-uniforms-varyings.implement.1
loop: 2
tier: core
concepts: [shaders.attributes-uniforms-varyings]
mode: implement
context: shaders.attributes-uniforms-varyings/passing-time
lenses: [space]
misconceptions: [shaders.attributes-uniforms-varyings/copied-unchanged]
---

# Attributes uniforms varyings: passing time

> **The job:** Pass per-vertex UV through an interpolated varying and use a per-draw time uniform to pulse its red channel.

## Task

Pass per-vertex UV through an interpolated varying and use a per-draw time uniform to pulse its red channel. Return a working `ShaderMaterial`. The scene renders the material on a plane; the tests inspect its inputs and compile it in Chromium.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `pulseUv` in `drills/2/shaders/attributes-uniforms-varyings/implement-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/attributes-uniforms-varyings/implement-1
```

## The check

The Node check verifies the shader's data path. The browser check compiles and draws it on a WebGL canvas.

<details><summary>Hint</summary> A uniform is one value for the draw; a varying carries UV through interpolation. </details>

## Where else?

How would a barycentric wireframe differ if its varying were declared `flat`?

<details><summary>A starting point</summary> Visualize one intermediate value before restoring the finished fragment color. </details>
