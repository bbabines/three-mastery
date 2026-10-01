---
id: 2.camera.clip-ndc-screen.apply.1
loop: 2
tier: core
concepts: [camera.clip-ndc-screen]
mode: apply
context: camera.clip-ndc-screen/off-screen
lenses: [space]
misconceptions: [camera.clip-ndc-screen/ndc-y-down]
---

# Clip, NDC, screen: convert a pointer’s css pixel position into ndc so a ray can be cast through the camera

> **The job:** Convert a pointer’s CSS pixel position into NDC so a ray can be cast through the camera.

## Task

Convert a pointer’s CSS pixel position into NDC so a ray can be cast through the camera.

Write `pixelToNdc(x, y, width, height)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `x` | NDC or CSS pixels as named in the Task |
| `y` | NDC or CSS pixels as named in the Task |
| `width` | CSS pixels |
| `height` | CSS pixels |
| Answer | CSS pixels, with NDC depth where stated |

## Your code

Write it in `drills/2/camera/clip-ndc-screen/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/clip-ndc-screen/apply-1

## The check

It passes when `pixelToNdc` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the clip, ndc, screen page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Pointer to NDC. World point to label position.

</details>
