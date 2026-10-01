---
id: 2.shaders.types-precision.apply.1
loop: 2
tier: light
concepts: [shaders.types-precision]
mode: apply
context: shaders.types-precision/mobile-banding
lenses: [space]
misconceptions: [shaders.types-precision/int-is-float]
---

# Types precision: mobile banding

> **The job:** Keep a distant-origin gradient stable with high precision floats and explicit float literals.

## Task

Keep a distant-origin gradient stable with high precision floats and explicit float literals. Return a material that draws the effect on the preview plane. Use readable GLSL and keep the variable spaces explicit.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local mesh coordinates |
| `gl_Position` | clip coordinates |
| `gl_FragCoord` when used | device pixels |
| varyings | interpolated values between vertices |

## Your code

Write `farOriginGradient` in `drills/2/shaders/types-precision/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/types-precision/apply-1
```

## The check

The Node test inspects the data path. The browser test compiles and draws it in WebGL.

<details><summary>Hint</summary> GLSL float literals use decimal points; highp gives more useful range than mediump. </details>

## Where else?

What visual symptom appears when a far-origin value loses precision on mobile?
