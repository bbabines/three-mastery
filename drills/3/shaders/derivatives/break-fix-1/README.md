---
id: 3.shaders.derivatives.break-and-fix.1
loop: 3
tier: light
concepts: [shaders.derivatives]
mode: break-and-fix
context: shaders.derivatives/aa-grid
lenses: [space]
misconceptions: [shaders.derivatives/extra-geometry]
---

# Derivatives: the grid edge aliases

> **The job:** keep a shader grid line one pixel wide at different resolutions without extra geometry.

## Task

The grid line flickers and disappears when resolution changes. Repair the fixed-width edge in `gridShader`. The preview plane should show thin, stable lines without line meshes.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `vUv` | interpolated UV across the surface |
| `fwidth(vUv * 8.0)` | change in grid coordinates across neighboring device pixels |
| `gl_FragColor` | output fragment color |

## Your code

Fix `drills/3/shaders/derivatives/break-fix-1/drill.ts`, write one cause sentence in `cause.md`, and write a browser regression assertion in `check.ts`.

```
npm run drill -- drills/3/shaders/derivatives/break-fix-1
```

## The check

The browser test reads a real WebGL pixel at two resolutions. The repaired edge stays partly lit at both; the fixed-width starter does not.

<details><summary>Hint</summary> `fwidth` tells you how much a value changes from one fragment to the next. </details>

## Where else?

Would the same derivative help a barycentric wireframe?

<details><summary>A few answers</summary> Yes. Measure the interpolated barycentric coordinate's pixel footprint before smoothing its edge. </details>
