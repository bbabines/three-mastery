---
id: 2.rotation.quaternions.implement.1
loop: 2
tier: core
concepts: [rotation.quaternions]
mode: implement
context: rotation.quaternions/accumulating
lenses: []
misconceptions: [rotation.quaternions/components-angles]
---

# Quaternions: apply a turn around an object’s own axis to its current orientation without changing either input

> **The job:** Apply a turn around an object’s own axis to its current orientation without changing either input.

## Task

Apply a turn around an object’s own axis to its current orientation without changing either input.

Write `localDelta(orientation, localAxis, radians)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/quaternions/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/quaternions/implement-1

## The check

It passes when `localDelta` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the quaternions page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Local vs world deltas. Orientation from two vectors.

</details>
