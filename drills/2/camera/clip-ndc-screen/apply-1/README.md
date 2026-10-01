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

# NDC: pointer to camera coordinates

> **The job:** Turn a canvas pointer position into NDC.

## Task

Write `pixelToNdc(x, y, width, height)`. The input is in CSS pixels from the canvas’s top-left; return a new Vector3 in normalized device coordinates (NDC). The center is (0, 0), left/right are −1/+1, top/bottom are +1/−1, and Z is 0.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `x, y` | CSS pixels from canvas top-left |
| `width, height` | Canvas size in CSS pixels |
| Answer | NDC; Z is 0 |

## Your code

Write it in `drills/2/camera/clip-ndc-screen/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/clip-ndc-screen/apply-1

## The check

The corners and center land at the expected NDC coordinates, including the reversed vertical direction.

<details><summary>Hint</summary>

Compare where +Y points on the canvas and in NDC before writing the vertical conversion.

</details>

## Where else?

What else starts with a pointer in CSS pixels?

<details><summary>A few answers</summary>

Cast a picking ray or aim a drag handle through the camera.

</details>
