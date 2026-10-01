---
id: 3.materials.lambert.break-and-fix.1
loop: 3
tier: core
concepts: [materials.lambert]
mode: break-and-fix
context: materials.lambert/terminator
lenses: []
misconceptions: [materials.lambert/depends-on-viewer]
---

# Lambert: the matte surface darkens as the camera walks around even though the light and surface do not move.

> **The job:** Keep diffuse brightness tied to the surface and light, not the viewer.

## Task

The matte surface darkens as the camera walks around even though the light and surface do not move. Fix `matteLight` without replacing unrelated objects or settings. The preview runs the current code; use its readout to check the repaired behavior.

<div data-scene="preview"></div>

## Your code

Repair `drills/3/materials/lambert/break-fix-1/drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/materials/lambert/break-fix-1
```

## The check

The acceptance test covers the visible symptom and a second input. Your short check must reject the original bug and pass on the repair; `npm run verify` exercises both versions.

<details><summary>Hint</summary> Lambert diffuse is a clamped normal-light cosine. </details>

## Where else?

Would a specular highlight behave the same way?

<details><summary>A few answers</summary> No. Specular response uses a view direction, so its highlight moves with the camera. </details>
