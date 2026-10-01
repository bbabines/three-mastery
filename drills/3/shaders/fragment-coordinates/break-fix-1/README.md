---
id: 3.shaders.fragment-coordinates.break-and-fix.1
loop: 3
tier: light
concepts: [shaders.fragment-coordinates]
mode: break-and-fix
context: shaders.fragment-coordinates/vignette
lenses: [space]
misconceptions: [shaders.fragment-coordinates/css-pixels]
---

# Fragment coordinates: repair the effect

> **The job:** Keep a screen-space vignette centered at the same CSS position at any DPR.

## Task

The vignette center shifts when DPR changes from 1 to 2 even though the CSS viewport stays fixed. Repair `vignetteRadius`. The preview reports its output, and the test covers another input.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| input position or pixel | local space or device pixels, as named in the function |
| output | the space named in the return description |

## Your code

Fix `drills/3/shaders/fragment-coordinates/break-fix-1/drill.ts`, write the cause in `cause.md`, then replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/shaders/fragment-coordinates/break-fix-1
```

## The check

The acceptance test covers the symptom and a general case. Your check must reject the original bug and pass on the repair.

<details><summary>Hint</summary> Convert `gl_FragCoord.xy` from device pixels by dividing by DPR before comparing CSS size. </details>

## Where else?

What happens to an eight-CSS-pixel checker when DPR doubles?

<details><summary>A few answers</summary> Its period must use 16 device pixels, or divide gl_FragCoord by DPR first. </details>
