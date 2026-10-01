---
id: 2.shaders.built-in-functions.implement.1
loop: 2
tier: core
concepts: [shaders.built-in-functions]
mode: implement
context: shaders.built-in-functions/rings
lenses: [space]
misconceptions: [shaders.built-in-functions/step-smoothstep]
---

# Built in functions: rings

> **The job:** Draw a ring whose two edges blend smoothly over a supplied width, using `smoothstep` on distance from UV center.

## Task

Draw a ring whose two edges blend smoothly over a supplied width, using `smoothstep` on distance from UV center. Write `softRing(radius, edge)`. Treat both inputs as distances in UV space and blend each ring edge over `edge`.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `softRing` in `drills/2/shaders/built-in-functions/implement-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/built-in-functions/implement-1
```

## The check

The Node test checks the uniforms and smooth edges. The browser test reads dark pixels inside and outside the ring and a bright pixel on it.

<details><summary>Hint</summary> A hard `step` aliases at edges; subtract two smooth transitions to keep the ring soft. </details>

## Where else?

How would this ring edge look if both `smoothstep` calls became `step`?

<details><summary>A few answers</summary> Two hard `step` edges would look jagged as the ring crosses pixel centers. </details>
