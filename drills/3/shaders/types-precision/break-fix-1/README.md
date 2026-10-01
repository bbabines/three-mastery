---
id: 3.shaders.types-precision.break-and-fix.1
loop: 3
tier: light
concepts: [shaders.types-precision]
mode: break-and-fix
context: shaders.types-precision/compile-errors
lenses: [space]
misconceptions: [shaders.types-precision/int-is-float]
---

# Types precision: repair the effect

> **The job:** Emit valid GLSL float literals for shader uniforms and constants.

## Task

The generated shader fails to compile when an integer-valued parameter is inserted into a float expression. Repair `glslFloat`. The preview reports its output, and the test covers another input.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| input position or pixel | local space or device pixels, as named in the function |
| output | the space named in the return description |

## Your code

Fix `drills/3/shaders/types-precision/break-fix-1/drill.ts`, write the cause in `cause.md`, then replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/shaders/types-precision/break-fix-1
```

## The check

The acceptance test covers the symptom and a general case. Your check must reject the original bug and pass on the repair.

<details><summary>Hint</summary> GLSL float literals need a decimal point when the value is integral. </details>

## Where else?

How would a mobile shader expose precision trouble far from the origin?

<details><summary>A few answers</summary> Mediump may quantize a large coordinate enough to cause banding or jitter. </details>
