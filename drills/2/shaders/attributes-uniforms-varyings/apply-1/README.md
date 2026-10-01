---
id: 2.shaders.attributes-uniforms-varyings.apply.1
loop: 2
tier: core
concepts: [shaders.attributes-uniforms-varyings]
mode: apply
context: shaders.attributes-uniforms-varyings/barycentric-wireframe
lenses: [space]
misconceptions: []
---

# Attributes uniforms varyings: barycentric wireframe

> **The job:** Pass a barycentric vertex attribute to fragments and show pixels near a triangle edge as white.

## Task

Pass a barycentric vertex attribute to fragments and show pixels near a triangle edge as white. Write `barycentricWire()` so the vertex shader passes barycentric values to the fragment shader and only pixels near an edge are white.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `barycentricWire` in `drills/2/shaders/attributes-uniforms-varyings/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/attributes-uniforms-varyings/apply-1
```

## The check

The Node test checks the attribute and varying path. The browser test gives the plane barycentric corner values and checks that triangle edges are bright while the face stays dark.

<details><summary>Hint</summary> Every triangle corner carries one coordinate of (1,0,0), (0,1,0), or (0,0,1). </details>

## Where else?

Why do barycentric values change across a triangle instead of being copied from one corner?

<details><summary>A few answers</summary> The rasterizer interpolates each corner's values across the triangle, making edge distance available at every fragment. </details>
