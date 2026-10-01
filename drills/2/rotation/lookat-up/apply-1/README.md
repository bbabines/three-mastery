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

# lookAt and up: aim a camera

> **The job:** Aim a camera at a target while honoring a chosen up direction.

## Task

A camera looks down its own −Z axis. `cameraAim(from, target, up)` returns a quaternion that points this axis from `from` at `target`, with the camera’s +Y as close as possible to `up`. Leave the input vectors unchanged.

The blue aim arrow should match yellow, while green shows the camera’s up direction.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/lookat-up/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/lookat-up/apply-1

## The check

The check verifies the camera’s forward direction and roll for a tilted up vector, and checks every input vector is unchanged.

<details><summary>Hint</summary>

The camera convention differs from an ordinary Object3D: its −Z faces the target. Set the camera position and up vector before calling `lookAt`.

</details>

## Where else?

Where else must an aim keep a chosen roll?

<details><summary>A few answers</summary>

A drone camera. A side-mounted inspection camera. A camera on a tilted vehicle.

</details>
