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

Keep a distant-origin gradient stable with high precision floats and explicit float literals. Write `farOriginGradient(origin)` using high precision float values and explicit float literals.

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

The Node test checks the precision declaration and float path. The browser test checks that two local positions around a distant origin produce distinct gradient values.

<details><summary>Hint</summary> GLSL float literals use decimal points; highp gives more useful range than mediump. </details>

## Where else?

What visual symptom appears when a far-origin value loses precision on mobile?

<details><summary>A few answers</summary> Low precision can make adjacent positions collapse to one value, causing bands or jitter far from the origin. </details>
