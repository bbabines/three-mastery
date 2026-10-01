---
id: 2.shaders.fragment-coordinates.apply.1
loop: 2
tier: light
concepts: [shaders.fragment-coordinates]
mode: apply
context: shaders.fragment-coordinates/screen-patterns
lenses: [space]
misconceptions: [shaders.fragment-coordinates/css-pixels]
---

# Fragment coordinates: screen patterns

> **The job:** Build a checker in CSS pixels by converting `gl_FragCoord.xy` from device pixels using the supplied DPR.

## Task

Build a checker in CSS pixels by converting `gl_FragCoord.xy` from device pixels using the supplied DPR. Return a material that draws the effect on the preview plane. Use readable GLSL and keep the variable spaces explicit.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local mesh coordinates |
| `gl_Position` | clip coordinates |
| `gl_FragCoord` when used | device pixels |
| varyings | interpolated values between vertices |

## Your code

Write `cssChecker` in `drills/2/shaders/fragment-coordinates/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/fragment-coordinates/apply-1
```

## The check

The Node test inspects the data path. The browser test compiles and draws it in WebGL.

<details><summary>Hint</summary> Divide device pixel coordinates by DPR before choosing an eight-CSS-pixel cell. </details>

## Where else?

Why does a screen-space checker halve in CSS size when DPR doubles and the shader ignores it?
