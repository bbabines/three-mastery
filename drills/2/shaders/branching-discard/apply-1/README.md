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

Cut a circular hole with a fragment-dependent mask, using `discard` only outside the kept area. Write `circleMask()` to keep pixels inside a UV-centered circle and discard the rest.

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

The Node test checks the discard path; the browser test checks that the material compiles and draws.

<details><summary>Hint</summary> `discard` removes the fragment but can cost early-depth rejection. </details>

## Where else?

How would a translucent mask differ from this hard fragment discard?

<details><summary>A few answers</summary> A translucent mask keeps and blends edge pixels; `discard` removes fragments entirely. </details>
