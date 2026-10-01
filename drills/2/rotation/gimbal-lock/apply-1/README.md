---
id: 2.rotation.gimbal-lock.apply.1
loop: 2
tier: light
concepts: [rotation.gimbal-lock, rotation.slerp]
mode: apply
context: rotation.gimbal-lock/interpolating-euler
lenses: []
misconceptions: [rotation.gimbal-lock/library-bug]
---

# Gimbal lock and slerp: blend a camera between two orientations on the shortest arc, including when its view passes near straight down

> **The job:** Blend a camera between two orientations on the shortest arc, including when its view passes near straight down.

## Task

Blend a camera between two orientations on the shortest arc, including when its view passes near straight down. Keep the inputs unchanged. Interpolating Euler numbers here can behave badly at gimbal lock; interpolate the orientations themselves.

Write `smoothOrientation(start, end, fraction)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/gimbal-lock/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/gimbal-lock/apply-1

## The check

It passes when `smoothOrientation` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the gimbal lock and slerp page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Camera pitched straight down. Turntable at extremes.

</details>
