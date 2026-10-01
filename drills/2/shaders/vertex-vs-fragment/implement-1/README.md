---
id: 2.shaders.vertex-vs-fragment.implement.1
loop: 2
tier: core
concepts: [shaders.vertex-vs-fragment]
mode: implement
context: shaders.vertex-vs-fragment/per-pixel-color
lenses: [space]
misconceptions: [shaders.vertex-vs-fragment/once-per-pixel]
---

# Vertex vs fragment: per pixel color

> **The job:** Color each fragment from its interpolated UV while the vertex shader only places vertices.

## Task

Color each fragment from its interpolated UV while the vertex shader only places vertices. Return a working `ShaderMaterial`. The scene renders the material on a plane; the tests inspect its inputs and compile it in Chromium.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `uvGradient` in `drills/2/shaders/vertex-vs-fragment/implement-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/vertex-vs-fragment/implement-1
```

## The check

The Node check verifies the shader's data path. The browser check compiles and draws it on a WebGL canvas.

<details><summary>Hint</summary> Pass `uv` through a varying; the rasterizer fills in a different value for each fragment. </details>

## Where else?

How would displacement move vertices while this UV color still changes per fragment?

<details><summary>A starting point</summary> Visualize one intermediate value before restoring the finished fragment color. </details>
