---
id: 3.shaders.built-in-functions.break-and-fix.1
loop: 3
tier: core
concepts: [shaders.built-in-functions]
mode: break-and-fix
context: shaders.built-in-functions/rings
lenses: [space]
misconceptions: [shaders.built-in-functions/step-smoothstep]
---

# Built in functions: repair the shader

> **The job:** Draw a soft ring edge that does not alias as the camera moves.

## Task

The ring edge snaps between black and white instead of showing a narrow gray transition. Repair the fragment shader in `softRing` and watch the preview plane change. Keep the vertex stage and uniforms connected.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local mesh coordinates |
| `gl_Position` | clip coordinates |
| `vUv` when used | UV coordinates interpolated across the triangle |
| `gl_FragColor` | output color for each fragment |

## Your code

Fix `drills/3/shaders/built-in-functions/break-fix-1/drill.ts`, write one cause sentence in `cause.md`, and replace the `check.ts` placeholder with a browser regression assertion.

```
npm run drill -- drills/3/shaders/built-in-functions/break-fix-1
```

## The check

The browser tests draw real pixels in WebGL. Your check must reject the starter pixel and pass the repaired shader; `npm run verify` runs both versions.

<details><summary>Hint</summary> `smoothstep` blends across an interval; `step` jumps at one threshold. </details>

## Where else?

Where else would a soft function edge help?

<details><summary>A few answers</summary> A radial falloff mask or distant stripe can use a width-controlled transition. </details>
