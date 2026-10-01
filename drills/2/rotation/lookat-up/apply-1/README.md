---
id: 2.rotation.lookat-up.apply.1
loop: 2
tier: core
concepts: [rotation.lookat-up]
mode: apply
context: rotation.lookat-up/aiming-spotlight
lenses: []
misconceptions: [rotation.lookat-up/same-facing]
---

# lookAt and up: aim a camera’s −z at a target, respecting the chosen up vector and keeping the input positions intact

> **The job:** Aim a camera’s −Z at a target, respecting the chosen up vector and keeping the input positions intact.

## Task

Aim a camera’s −Z at a target, respecting the chosen up vector and keeping the input positions intact.

Write `cameraAim(from, target, up)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/lookat-up/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/lookat-up/apply-1

## The check

It passes when `cameraAim` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the lookat and up page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Billboards. Top-down camera.

</details>
