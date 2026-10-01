---
id: 3.shaders.attributes-uniforms-varyings.break-and-fix.1
loop: 3
tier: core
concepts: [shaders.attributes-uniforms-varyings]
mode: break-and-fix
context: shaders.attributes-uniforms-varyings/color-gradient
lenses: [space]
misconceptions: [shaders.attributes-uniforms-varyings/copied-unchanged]
---

# Attributes uniforms varyings: repair the shader

> **The job:** Show the smooth interpolated UV gradient across a triangle.

## Task

The plane is split into hard red and black bands instead of a smooth ramp. Repair the fragment shader in `uvGradient` and watch the preview plane change. Keep the vertex stage and uniforms connected.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local mesh coordinates |
| `gl_Position` | clip coordinates |
| `vUv` when used | UV coordinates interpolated across the triangle |
| `gl_FragColor` | output color for each fragment |

## Your code

Fix `drills/3/shaders/attributes-uniforms-varyings/break-fix-1/drill.ts`, write one cause sentence in `cause.md`, and replace the `check.ts` placeholder with a browser regression assertion.

```
npm run drill -- drills/3/shaders/attributes-uniforms-varyings/break-fix-1
```

## The check

The browser tests draw real pixels in WebGL. Your check must reject the starter pixel and pass the repaired shader; `npm run verify` runs both versions.

<details><summary>Hint</summary> A varying already interpolates between the vertex values for each fragment. </details>

## Where else?

How would a barycentric wireframe use the same interpolation?

<details><summary>A few answers</summary> Each triangle corner contributes a coordinate that changes continuously toward the opposite edge. </details>
