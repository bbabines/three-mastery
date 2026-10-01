---
id: 2.camera.project-unproject.implement.1
loop: 2
tier: core
concepts: [camera.project-unproject]
mode: implement
context: camera.project-unproject/under-cursor
lenses: [space]
misconceptions: [camera.project-unproject/behind-camera]
---

# project and unproject: project a world point to screen pixels for a label, retaining its ndc depth for an off-screen check

> **The job:** Project a world point to screen pixels for a label, retaining its NDC depth for an off-screen check.

## Task

Project a world point to screen pixels for a label, retaining its NDC depth for an off-screen check.

Write `labelPosition(camera, worldPoint, width, height)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Camera pose and lens in world space |
| `worldPoint` | World space |
| `width` | CSS pixels |
| `height` | CSS pixels |
| Answer | World space |

## Your code

Write it in `drills/2/camera/project-unproject/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/project-unproject/implement-1

## The check

It passes when `labelPosition` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the project and unproject page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

3D labels. Building a ray.

</details>
