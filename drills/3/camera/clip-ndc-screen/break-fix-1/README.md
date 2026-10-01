---
id: 3.camera.clip-ndc-screen.break-and-fix.1
loop: 3
tier: core
concepts: [camera.clip-ndc-screen]
mode: break-and-fix
context: camera.clip-ndc-screen/pointer-ndc
lenses: [space]
misconceptions: [camera.clip-ndc-screen/ndc-y-down]
---

# Screen Y: a label on the wrong side

> **The job:** Put a projected label at the matching CSS pixel height.

## Task

`screenY(ndcY, height)` converts a projected Y value to a CSS pixel Y in a viewport of `height` pixels. NDC Y is +1 at the top and −1 at the bottom. CSS pixel Y starts at 0 at the top. The starter places a label near the top at the bottom instead. Fix the conversion.

In the scene, your blue label and the green reference should land at the same height.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| `ndcY` | Normalized device Y, from −1 to +1, positive up |
| `height` | Viewport height in CSS pixels |
| Answer | CSS pixels from the viewport's top |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/clip-ndc-screen/break-fix-1

## The check

The acceptance test checks the top, middle, and bottom of several viewport heights. Your check should reject a conversion that puts positive NDC Y below the middle.

<details><summary>Hint</summary>

The clip/NDC/screen page shows where each Y axis starts and which way it grows. Check both endpoints before writing the conversion.

</details>

## Where else?

Where else does an upside-down Y axis put a UI element in the wrong place?

<details><summary>A few answers</summary>

A tooltip over a mesh, a pointer-to-ray conversion, or a selection rectangle.

</details>
