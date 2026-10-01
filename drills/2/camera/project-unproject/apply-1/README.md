---
id: 2.camera.project-unproject.apply.1
loop: 2
tier: core
concepts: [camera.project-unproject]
mode: apply
context: camera.project-unproject/build-ray
lenses: [space]
misconceptions: [camera.project-unproject/behind-camera]
---

# project and unproject: unproject a chosen ndc spot and depth into a world point, updating the camera after a move

> **The job:** Unproject a chosen NDC spot and depth into a world point, updating the camera after a move.

## Task

Unproject a chosen NDC spot and depth into a world point, updating the camera after a move.

Write `pointAtNdcDepth(camera, x, y, depth)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Camera pose and lens in world space |
| `x` | NDC or CSS pixels as named in the Task |
| `y` | NDC or CSS pixels as named in the Task |
| `depth` | NDC depth or view distance as named in the Task |
| Answer | World space |

## Your code

Write it in `drills/2/camera/project-unproject/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/project-unproject/apply-1

## The check

It passes when `pointAtNdcDepth` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the project and unproject page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

3D labels. Placing an object under the cursor.

</details>
