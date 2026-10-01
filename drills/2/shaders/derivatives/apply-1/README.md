---
id: 2.shaders.derivatives.apply.1
loop: 2
tier: light
concepts: [shaders.derivatives]
mode: apply
context: shaders.derivatives/wireframe
lenses: [space]
misconceptions: [shaders.derivatives/extra-geometry]
---

# Derivatives: wireframe

> **The job:** Antialias UV grid lines by measuring neighboring pixel change with `fwidth`, without adding line geometry.

## Task

Antialias UV grid lines by measuring neighboring pixel change with `fwidth`, without adding line geometry. Return a material that draws the effect on the preview plane. Use readable GLSL and keep the variable spaces explicit.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local mesh coordinates |
| `gl_Position` | clip coordinates |
| `gl_FragCoord` when used | device pixels |
| varyings | interpolated values between vertices |

## Your code

Write `aaWireGrid` in `drills/2/shaders/derivatives/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/derivatives/apply-1
```

## The check

The Node test inspects the data path. The browser test compiles and draws it in WebGL.

<details><summary>Hint</summary> `fwidth` estimates a line width in fragment-space derivatives. </details>

## Where else?

Could `fwidth` soften a triangle wireframe without a separate line mesh?
