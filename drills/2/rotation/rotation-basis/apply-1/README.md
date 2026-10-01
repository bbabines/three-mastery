---
id: 2.rotation.rotation-basis.apply.1
loop: 2
tier: core
concepts: [rotation.rotation-basis]
mode: apply
context: rotation.rotation-basis/local-axes
lenses: []
misconceptions: [rotation.rotation-basis/opaque-box]
---

# Rotation basis: read a camera’s right direction from its current world basis, including when the camera looks straight up

> **The job:** Read a camera’s right direction from its current world basis, including when the camera looks straight up.

## Task

Read a camera’s right direction from its current world basis, including when the camera looks straight up.

Write `cameraRight(camera)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/rotation-basis/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/rotation-basis/apply-1

## The check

It passes when `cameraRight` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the rotation basis page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Reading forward from a matrix. makeBasis from three axes.

</details>
