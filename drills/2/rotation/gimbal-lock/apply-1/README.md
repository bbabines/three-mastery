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

# Slerp: blend through a steep turn

> **The job:** Blend a camera from one orientation to another at a chosen fraction.

## Task

A camera can pass near straight down while it moves between two saved poses. `smoothOrientation(start, end, fraction)` returns the orientation at a fraction from 0 to 1 along the shortest turn. Keep both saved quaternions unchanged.

Move the fraction slider. The blue aim pointer should follow the yellow orientation as the fraction changes.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/gimbal-lock/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/gimbal-lock/apply-1

## The check

The check samples both ends and several fractions between them. The angular distance must grow in proportion to the fraction, and the saved poses must stay unchanged.

<details><summary>Hint</summary>

Use quaternion interpolation for the turn itself. Blending three Euler angles can take a different route near a steep pitch.

</details>

## Where else?

Where else do smooth orientation blends matter?

<details><summary>A few answers</summary>

Camera transitions. Character aim. A robot wrist moving between poses.

</details>
