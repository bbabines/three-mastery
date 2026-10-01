---
id: 3.camera.fit-to-bounds.break-and-fix.1
loop: 3
tier: light
concepts: [camera.fit-to-bounds, camera.world-size-per-pixel]
mode: break-and-fix
context: camera.fit-to-bounds/focus-part
lenses: [space]
misconceptions: [camera.fit-to-bounds/vertical-enough]
---

# Fit to bounds: a clipped thumbnail

> **The job:** Keep a bounding sphere inside a portrait view and size a hotspot there.

## Task

`fitAndPixelSize(radius, verticalFovDegrees, aspect, viewportHeight)` returns a camera distance that fits a centered bounding sphere, plus the world height of one CSS pixel at that distance. The sphere fits in landscape but clips across a portrait thumbnail. `aspect` is width divided by height; `radius` and `distance` are world units. Fix the distance and keep the pixel size consistent with it.

Switch between wide and tall viewports in the scene. The sphere should fit within both pictures.

<div data-scene="demo"></div>

## Spaces

| Value | Space |
| --- | --- |
| `radius`, `distance`, `unitsPerPixel` | World units |
| `verticalFovDegrees` | Vertical angle in degrees |
| `aspect` | Viewport width divided by height |
| `viewportHeight` | CSS pixels |

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/camera/fit-to-bounds/break-fix-1

## The check

The acceptance test checks portrait and landscape fitting and the pixel size at the returned distance. Your check should reject a distance based only on vertical field of view.

<details><summary>Hint</summary>

The fit-to-bounds page shows how vertical field of view and aspect give the horizontal opening. Which opening is narrower in portrait?

</details>

## Where else?

Where else must a camera fit a subject after its viewport changes shape?

<details><summary>A few answers</summary>

A product thumbnail, a model preview beside a sidebar, or a phone layout.

</details>
