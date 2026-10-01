---
id: 2.shaders.built-in-matrices.implement.1
loop: 2
tier: core
concepts: [shaders.built-in-matrices]
mode: implement
context: shaders.built-in-matrices/rim-light
lenses: [space]
misconceptions: [shaders.built-in-matrices/world-normals]
---

# Built in matrices: rim light

> **The job:** Compute a rim mask from a normal transformed by `normalMatrix`, which produces a view-space normal.

## Task

Compute a rim mask from a normal transformed by `normalMatrix`, which produces a view-space normal. Write `viewRim()` and transform the normal with `normalMatrix` before making the view-space rim.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `viewRim` in `drills/2/shaders/built-in-matrices/implement-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/built-in-matrices/implement-1
```

## The check

The Node test checks the normal-matrix path. The browser test turns the same plane and checks that its view-facing rim brightens.

<details><summary>Hint</summary> `normalMatrix` does not give world normals. Its output is in view space, where the camera looks down -Z. </details>

## Where else?

Would the same `normalMatrix` result be valid for a world-space height gradient?

<details><summary>A few answers</summary> No. A height gradient needs world position or world normal, not the camera-relative normal from `normalMatrix`. </details>
