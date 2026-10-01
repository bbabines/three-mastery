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

Convert Z-up local coordinates into Y-up by reordering axes and negating the former Y axis. Write `zUpToYUp()` so each local `(x, y, z)` becomes `(x, z, -y)` in the vertex stage.

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

The Node test checks the component reorder. The browser test draws a Z-up triangle and checks that it stands upright after conversion.

<details><summary>Hint</summary> A swizzle reorders components; the sign change is also needed to preserve handedness. </details>

## Where else?

What sign change is needed when converting a Z-up vector to Y-up without mirroring?

<details><summary>A few answers</summary> Negating the former Y axis preserves handedness when Z becomes the new up axis. </details>
