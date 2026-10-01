---
id: 2.shaders.branching-discard.apply.1
loop: 2
tier: light
concepts: [shaders.branching-discard]
mode: apply
context: shaders.branching-discard/masks
lenses: [space, cost]
misconceptions: [shaders.branching-discard/if-free]
---

# Branching discard: masks

> **The job:** Cut a circular hole with a fragment-dependent mask, using `discard` only outside the kept area.

## Task

Cut a circular hole with a fragment-dependent mask, using `discard` only outside the kept area. Return a material that draws the effect on the preview plane. Use readable GLSL and keep the variable spaces explicit.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `position` | local mesh coordinates |
| `gl_Position` | clip coordinates |
| `gl_FragCoord` when used | device pixels |
| varyings | interpolated values between vertices |

## Measure

Use Chrome's performance panel to compare this material against a plain color material at the same resolution. Record frame time and pixel ratio; frame time is a measurement, not a pass threshold.

## Your code

Write `circleMask` in `drills/2/shaders/branching-discard/apply-1/drill.ts`. Save, then run:

```
npm run drill -- drills/2/shaders/branching-discard/apply-1
```

## The check

The Node test inspects the data path. The browser test compiles and draws it in WebGL.

<details><summary>Hint</summary> `discard` removes the fragment but can cost early-depth rejection. </details>

## Where else?

How would a translucent mask differ from this hard fragment discard?
