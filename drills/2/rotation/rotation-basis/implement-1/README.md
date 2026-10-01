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

# Rotation basis: read forward

> **The job:** Read a part’s forward axis from a scaled basis matrix.

## Task

An ordinary part faces along its own +Z. `forwardFromBasis(rotationMatrix)` returns that axis as a unit world direction, even when the matrix includes unequal scale. Leave the matrix unchanged.

The blue +Z arrow should meet the yellow basis arrow at unit length, even with uneven scale.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/rotation-basis/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/rotation-basis/implement-1

## The check

The check uses a rotated matrix with unequal scale. It checks direction, unit length, and that the matrix is unchanged.

<details><summary>Hint</summary>

A basis matrix stores each transformed local axis in a column. Choose the +Z column and normalize away its scale.

</details>

## Where else?

Where else do you read direction from a scaled transform?

<details><summary>A few answers</summary>

A vehicle nose. A spotlight mount. A sensor’s facing direction.

</details>
