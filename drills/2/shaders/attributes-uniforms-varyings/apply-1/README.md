---
id: 2.shaders.attributes-uniforms-varyings.apply.1
loop: 2
tier: core
concepts: [shaders.attributes-uniforms-varyings]
mode: apply
context: shaders.attributes-uniforms-varyings/barycentric-wireframe
lenses: [space]
misconceptions: []
---

# Attributes uniforms varyings: barycentric wireframe

> **The job:** Pass a barycentric vertex attribute to fragments and show pixels near a triangle edge as white.

## Task

Pass a barycentric vertex attribute to fragments and show pixels near a triangle edge as white. Return a working `ShaderMaterial`. The scene renders the material on a plane; the tests inspect its inputs and compile it in Chromium.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `barycentricWire` in `drills/2/shaders/attributes-uniforms-varyings/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/attributes-uniforms-varyings/apply-1
```

## The check

The Node check verifies the shader's data path. The browser check compiles and draws it on a WebGL canvas.

<details><summary>Hint</summary> Every triangle corner carries one coordinate of (1,0,0), (0,1,0), or (0,0,1). </details>

## Where else?

Why do barycentric values change across a triangle instead of being copied from one corner?

<details><summary>A starting point</summary> Visualize one intermediate value before restoring the finished fragment color. </details>
