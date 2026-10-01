---
id: 2.shaders.built-in-functions.apply.1
loop: 2
tier: core
concepts: [shaders.built-in-functions]
mode: apply
context: shaders.built-in-functions/falloff
lenses: [space]
misconceptions: []
---

# Built in functions: falloff

> **The job:** Make a UV-centered radial falloff with `clamp` and `mix`, going from a warm center to a cool edge.

## Task

Make a UV-centered radial falloff with `clamp` and `mix`, going from a warm center to a cool edge. Write `radialFalloff()` so UV distance blends a warm center into a cool edge.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `radialFalloff` in `drills/2/shaders/built-in-functions/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/built-in-functions/apply-1
```

## The check

The Node test checks the `clamp` and `mix` data path; the browser test checks compilation and drawing.

<details><summary>Hint</summary> Clamp a radius-based factor to 0–1, then mix the endpoint colors. </details>

## Where else?

Could the same `clamp` and `mix` pattern make a soft circular mask?

<details><summary>A few answers</summary> Yes. Use the same clamped distance as an alpha value instead of mixing two colors. </details>
