---
id: 3.shaders.debug-output.break-and-fix.1
loop: 3
tier: core
concepts: [shaders.debug-output]
mode: break-and-fix
context: shaders.debug-output/verify-spaces
lenses: [space]
misconceptions: [shaders.debug-output/final-color-only]
---

# Debug output: repair the shader

> **The job:** Inspect a signed normal by encoding it as visible RGB.

## Task

The debug panel loses its negative directions to black clipping and looks like a flat color. Repair the fragment shader in `normalDebug` and watch the preview plane change. Keep the vertex stage and uniforms connected.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local mesh coordinates |
| `gl_Position` | clip coordinates |
| `vUv` when used | UV coordinates interpolated across the triangle |
| `gl_FragColor` | output color for each fragment |

## Your code

Fix `drills/3/shaders/debug-output/break-fix-1/drill.ts`, write one cause sentence in `cause.md`, and replace the `check.ts` placeholder with a browser regression assertion.

```
npm run drill -- drills/3/shaders/debug-output/break-fix-1
```

## The check

The browser tests draw real pixels in WebGL. Your check must reject the starter pixel and pass the repaired shader; `npm run verify` runs both versions.

<details><summary>Hint</summary> Encode each normalized direction component as `0.5 * component + 0.5`. </details>

## Where else?

What other intermediate value would you display during a UV seam bug?

<details><summary>A few answers</summary> Output UV.x in red and UV.y in green to make seam jumps visible. </details>
