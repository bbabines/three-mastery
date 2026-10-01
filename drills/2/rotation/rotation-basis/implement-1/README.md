---
id: 2.rotation.rotation-basis.implement.1
loop: 2
tier: core
concepts: [rotation.rotation-basis]
mode: implement
context: rotation.rotation-basis/make-basis
lenses: []
misconceptions: [rotation.rotation-basis/opaque-box]
---

# Rotation basis: read an ordinary object’s forward direction from a rotated and scaled basis matrix, returning a unit world direction

> **The job:** Read an ordinary object’s forward direction from a rotated and scaled basis matrix, returning a unit world direction.

## Task

Read an ordinary object’s forward direction from a rotated and scaled basis matrix, returning a unit world direction.

Write `forwardFromBasis(rotationMatrix)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/rotation-basis/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/rotation-basis/implement-1

## The check

It passes when `forwardFromBasis` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the rotation basis page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Reading forward from a matrix. Extracting local axes.

</details>
