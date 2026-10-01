---
id: 2.camera.fit-to-bounds.apply.1
loop: 2
tier: light
concepts: [camera.fit-to-bounds, camera.world-size-per-pixel]
mode: apply
context: camera.fit-to-bounds/thumbnails
lenses: [space]
misconceptions: [camera.fit-to-bounds/vertical-enough]
---

# Fit to bounds: sphere and pixel scale

> **The job:** Fit a sphere in either viewport shape.

## Task

Write `distanceForRadius(radius, verticalFovDegrees, aspect)` to return the smallest camera-to-center distance that fits a sphere in both width and height. `aspect` is width divided by height. Also write `worldPerPixel(viewDepth, verticalFovDegrees, viewportHeight)` for world units covered by one CSS pixel at that view depth.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `radius, viewDepth` | World units |
| `verticalFovDegrees` | Degrees, top to bottom |
| `aspect` | Viewport width / height |
| `viewportHeight` | CSS pixels |
| Answers | World units; world units per CSS pixel |

## Your code

Write it in `drills/2/camera/fit-to-bounds/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/fit-to-bounds/apply-1

## The check

Portrait and landscape both fit the sphere; moving a target farther away increases world units per CSS pixel.

<details><summary>Hint</summary>

The narrower of the horizontal and vertical half-angles controls fit. At a chosen depth, use the visible vertical span and canvas height.

</details>

## Where else?

Where else is world size per CSS pixel useful?

<details><summary>A few answers</summary>

Keep a gizmo readable or choose a level of detail for a distant part.

</details>
