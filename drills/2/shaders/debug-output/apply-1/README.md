---
id: 2.shaders.debug-output.apply.1
loop: 2
tier: core
concepts: [shaders.debug-output]
mode: apply
context: shaders.debug-output/depth-range
lenses: [space]
misconceptions: []
---

# Debug output: depth range

> **The job:** Output device depth as grayscale to inspect where the depth buffer spends its range.

## Task

Output device depth as grayscale to inspect where the depth buffer spends its range. Write `depthDebug()` to show device depth as raw grayscale from `gl_FragCoord.z`.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local coordinates of the mesh |
| `gl_Position` | clip coordinates after projection |
| `vUv` or another varying | interpolated across the triangle |
| `gl_FragCoord` when used | device pixels of the canvas |

## Your code

Write `depthDebug` in `drills/2/shaders/debug-output/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/debug-output/apply-1
```

## The check

The Node test checks the raw depth output path; the browser test checks compilation and drawing.

<details><summary>Hint</summary> `gl_FragCoord.z` is the post-projection depth in [0,1], not world distance. </details>

## Where else?

Why is device depth a poor direct substitute for world distance?

<details><summary>A few answers</summary> Device depth is nonlinear under perspective, so equal gray steps do not mean equal world distances. </details>
