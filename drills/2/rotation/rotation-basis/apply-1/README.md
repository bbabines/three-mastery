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

# Rotation basis: camera right

> **The job:** Read a camera’s right direction even when it looks nearly straight up.

## Task

A camera may sit inside a rotated parent. `cameraRight(camera)` returns the unit world direction of its own +X axis from the current world basis. The camera may have moved since the last render.

The blue right-axis arrow should meet the yellow world-basis arrow, even at a steep pitch.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/rotation-basis/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/rotation-basis/apply-1

## The check

The check uses a rotated parent and steep camera pitches. It expects a unit world direction from the current basis, including when a cross with world up becomes unreliable.

<details><summary>Hint</summary>

The first column of `matrixWorld` carries the camera’s right axis. Refresh the world matrix before reading it.

</details>

## Where else?

Where else is a world basis useful near vertical aim?

<details><summary>A few answers</summary>

Moving sideways in a flying camera. Placing a shoulder offset. Drawing camera-facing controls.

</details>
