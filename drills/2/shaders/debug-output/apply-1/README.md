---
id: 2.shaders.debug-output.apply.1
loop: 2
tier: core
concepts: [shaders.debug-output]
mode: apply
context: shaders.debug-output/depth-range
lenses: [space]
misconceptions: []
---

# Debug output: depth range

> **The job:** Output device depth as grayscale to inspect where the depth buffer spends its range.

## Task

Output device depth as grayscale to inspect where the depth buffer spends its range. Return a working `ShaderMaterial`. The scene renders the material on a plane; the tests inspect its inputs and compile it in Chromium.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `depthDebug` in `drills/2/shaders/debug-output/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/debug-output/apply-1
```

## The check

The Node check verifies the shader's data path. The browser check compiles and draws it on a WebGL canvas.

<details><summary>Hint</summary> `gl_FragCoord.z` is the post-projection depth in [0,1], not world distance. </details>

## Where else?

Why is device depth a poor direct substitute for world distance?

<details><summary>A starting point</summary> Visualize one intermediate value before restoring the finished fragment color. </details>
