---
id: 2.shaders.built-in-functions.apply.1
loop: 2
tier: core
concepts: [shaders.built-in-functions]
mode: apply
context: shaders.built-in-functions/falloff
lenses: [space]
misconceptions: []
---

# Built in functions: falloff

> **The job:** Make a UV-centered radial falloff with `clamp` and `mix`, going from a warm center to a cool edge.

## Task

Make a UV-centered radial falloff with `clamp` and `mix`, going from a warm center to a cool edge. Return a working `ShaderMaterial`. The scene renders the material on a plane; the tests inspect its inputs and compile it in Chromium.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `radialFalloff` in `drills/2/shaders/built-in-functions/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/built-in-functions/apply-1
```

## The check

The Node check verifies the shader's data path. The browser check compiles and draws it on a WebGL canvas.

<details><summary>Hint</summary> Clamp a radius-based factor to 0–1, then mix the endpoint colors. </details>

## Where else?

Could the same `clamp` and `mix` pattern make a soft circular mask?

<details><summary>A starting point</summary> Visualize one intermediate value before restoring the finished fragment color. </details>
