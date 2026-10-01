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

Build a checker in CSS pixels by converting `gl_FragCoord.xy` from device pixels using the supplied DPR. Write `cssChecker(dpr)` and divide device-pixel coordinates by the supplied DPR before making the checker.

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

The Node test checks the DPR uniform and fragment-coordinate path. The browser test checks that two pixels one CSS cell apart have opposite checker colors.

<details><summary>Hint</summary> Divide device pixel coordinates by DPR before choosing an eight-CSS-pixel cell. </details>

## Where else?

Why does a screen-space checker halve in CSS size when DPR doubles and the shader ignores it?

<details><summary>A few answers</summary> Without dividing by DPR, each checker tile occupies half as many CSS pixels when DPR doubles. </details>
