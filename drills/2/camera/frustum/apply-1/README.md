---
id: 2.camera.frustum.apply.1
loop: 2
tier: light
concepts: [camera.frustum, camera.aspect-resize]
mode: apply
context: camera.frustum/shadow-camera
lenses: [space]
misconceptions: [camera.frustum/tests-triangles]
---

# Frustum and resize: resize a perspective camera’s lens and tell whether a world point lies inside its new view frustum

> **The job:** Resize a perspective camera’s lens and tell whether a world point lies inside its new view frustum.

## Task

Resize a perspective camera’s lens and tell whether a world point lies inside its new view frustum. Set `camera.aspect` from the new width and height, refresh its projection matrix, and test the point against the six current frustum planes.

Write `visibleAfterResize(camera, width, height, worldPoint)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Camera pose and lens in world space |
| `width` | CSS pixels |
| `height` | CSS pixels |
| `worldPoint` | World space |
| Answer | World space |

## Your code

Write it in `drills/2/camera/frustum/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/frustum/apply-1

## The check

It passes when `visibleAfterResize` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the frustum and resize page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Visibility test. Culling.

</details>
