---
id: 2.camera.camera-relative.apply.1
loop: 2
tier: light
concepts: [camera.camera-relative]
mode: apply
context: camera.camera-relative/drag-parallel
lenses: [space]
misconceptions: [camera.camera-relative/forward-plus-z]
---

# Camera directions: read the world directions of a camera’s screen right, screen up, and forward, even when it looks straight up

> **The job:** Read the world directions of a camera’s screen right, screen up, and forward, even when it looks straight up.

## Task

Read the world directions of a camera’s screen right, screen up, and forward, even when it looks straight up.

Write `screenAxes(camera)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Camera pose and lens in world space |
| Answer | CSS pixels, with NDC depth where stated |

## Your code

Write it in `drills/2/camera/camera-relative/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/camera-relative/apply-1

## The check

It passes when `screenAxes` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the camera directions page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Screen-aligned panning. WASD movement.

</details>
