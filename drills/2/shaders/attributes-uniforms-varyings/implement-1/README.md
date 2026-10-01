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

Pass per-vertex UV through an interpolated varying and use a per-draw time uniform to pulse its red channel. Write `pulseUv(time)` so the vertex shader passes UVs and the fragment shader uses the time uniform to pulse red.

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

The Node test checks UV varying and time uniform wiring; the browser test checks compilation and drawing.

<details><summary>Hint</summary> A uniform is one value for the draw; a varying carries UV through interpolation. </details>

## Where else?

How would a barycentric wireframe differ if its varying were declared `flat`?

<details><summary>A few answers</summary> A `flat` varying would hold one corner's value across each triangle, so a smooth wireframe fade would become a hard patch. </details>
