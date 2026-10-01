---
id: 2.rotation.converting.apply.1
loop: 2
tier: light
concepts: [rotation.converting]
mode: apply
context: rotation.converting/comparing
lenses: []
misconceptions: [rotation.converting/same-numbers]
---

# Converting turns: convert a saved euler turn into an equivalent quaternion, even when a later euler round-trip uses different angle numbers

> **The job:** Convert a saved Euler turn into an equivalent quaternion, even when a later Euler round-trip uses different angle numbers.

## Task

Convert a saved Euler turn into an equivalent quaternion, even when a later Euler round-trip uses different angle numbers.

Write `orientationFromEuler(angles)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/converting/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/converting/apply-1

## The check

It passes when `orientationFromEuler` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the converting turns page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Serializing state. Displaying rotation in UI.

</details>
