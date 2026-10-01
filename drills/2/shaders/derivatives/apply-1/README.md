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

Antialias UV grid lines by measuring neighboring pixel change with `fwidth`, without adding line geometry. Write `aaWireGrid()` and use `fwidth` on interpolated UVs to soften grid edges.

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

The Node test checks the derivative path. The browser test compares a bright wire line with the dark middle of a grid cell.

<details><summary>Hint</summary> `fwidth` estimates a line width in fragment-space derivatives. </details>

## Where else?

Could `fwidth` soften a triangle wireframe without a separate line mesh?

<details><summary>A few answers</summary> Yes. A barycentric edge distance can use `fwidth` to cover about one pixel without extra line geometry. </details>
