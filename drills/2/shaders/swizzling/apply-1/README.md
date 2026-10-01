---
id: 2.shaders.swizzling.apply.1
loop: 2
tier: light
concepts: [shaders.swizzling]
mode: apply
context: shaders.swizzling/axis-conversion
lenses: [space]
misconceptions: [shaders.swizzling/converts-axes]
---

# Swizzling: axis conversion

> **The job:** Convert Z-up local coordinates into Y-up by reordering axes and negating the former Y axis.

## Task

Convert Z-up local coordinates into Y-up by reordering axes and negating the former Y axis. Return a material that draws the effect on the preview plane. Use readable GLSL and keep the variable spaces explicit.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local mesh coordinates |
| `gl_Position` | clip coordinates |
| `gl_FragCoord` when used | device pixels |
| varyings | interpolated values between vertices |

## Your code

Write `zUpToYUp` in `drills/2/shaders/swizzling/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/swizzling/apply-1
```

## The check

The Node test inspects the data path. The browser test compiles and draws it in WebGL.

<details><summary>Hint</summary> A swizzle reorders components; the sign change is also needed to preserve handedness. </details>

## Where else?

What sign change is needed when converting a Z-up vector to Y-up without mirroring?
