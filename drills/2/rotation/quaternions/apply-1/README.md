---
id: 2.rotation.quaternions.apply.1
loop: 2
tier: core
concepts: [rotation.quaternions]
mode: apply
context: rotation.quaternions/from-two-vectors
lenses: []
misconceptions: [rotation.quaternions/components-angles]
---

# Quaternions: apply a turn around an axis measured in the parent’s frame, preserving the current orientation

> **The job:** Apply a turn around an axis measured in the parent’s frame, preserving the current orientation.

## Task

Apply a turn around an axis measured in the parent’s frame, preserving the current orientation.

Write `parentDelta(orientation, parentAxis, radians)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/quaternions/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/quaternions/apply-1

## The check

It passes when `parentDelta` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the quaternions page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Accumulating rotations. Local vs world deltas.

</details>
