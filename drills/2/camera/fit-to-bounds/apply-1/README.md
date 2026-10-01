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

# Fit and pixel size: find a camera distance that fits a bounding sphere in both portrait and landscape viewports

> **The job:** Find a camera distance that fits a bounding sphere in both portrait and landscape viewports.

## Task

Find a camera distance that fits a bounding sphere in both portrait and landscape viewports. The sphere is centered on the view axis; use the narrower of the horizontal and vertical field of view. `radius` is in world units, `verticalFovDegrees` is an angle in degrees, and `aspect` is width divided by height.

Also write `worldPerPixel(viewDepth, verticalFovDegrees, viewportHeight)`: the world-space height one CSS pixel covers at a point this far along the camera's view axis. `viewportHeight` is in CSS pixels; use the same pixel kind for the hotspot you size with the result.

Write both functions in the starter. Save it to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `radius` | World units along the camera view axis |
| `verticalFovDegrees` | Degrees of vertical field of view |
| `aspect` | Viewport width divided by height |
| `viewDepth` | World units along the camera view axis |
| `viewportHeight` | CSS pixels |
| Both answers | World units |

## Your code

Write it in `drills/2/camera/fit-to-bounds/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/fit-to-bounds/apply-1

## The check

It passes when a sphere fits in both portrait and landscape views, and a hotspot sized with `worldPerPixel` spans one CSS pixel at several depths.

<details><summary>Hint</summary>

Use the method from the fit and pixel size page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Focus on a part. Auto-frame on load.

</details>
