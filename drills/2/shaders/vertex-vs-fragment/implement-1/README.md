---
id: 2.shaders.vertex-vs-fragment.implement.1
loop: 2
tier: core
concepts: [shaders.vertex-vs-fragment]
mode: implement
context: shaders.vertex-vs-fragment/per-pixel-color
lenses: [space]
misconceptions: [shaders.vertex-vs-fragment/once-per-pixel]
---

# Vertex vs fragment: per pixel color

> **The job:** Color each fragment from its interpolated UV while the vertex shader only places vertices.

## Task

Color each fragment from its interpolated UV while the vertex shader only places vertices. Write `uvGradient()` so the vertex stage only places vertices and passes UVs; the fragment stage colors each pixel.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `uvGradient` in `drills/2/shaders/vertex-vs-fragment/implement-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/vertex-vs-fragment/implement-1
```

## The check

The Node test checks UV interpolation wiring; the browser test checks compilation and drawing.

<details><summary>Hint</summary> Pass `uv` through a varying; the rasterizer fills in a different value for each fragment. </details>

## Where else?

How would displacement move vertices while this UV color still changes per fragment?

<details><summary>A few answers</summary> Vertex displacement changes the shape before rasterization; the fragment stage still receives interpolated UVs over the displaced triangles. </details>
