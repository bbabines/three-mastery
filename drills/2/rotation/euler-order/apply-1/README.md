---
id: 2.rotation.euler-order.apply.1
loop: 2
tier: core
concepts: [rotation.euler-order]
mode: apply
context: rotation.euler-order/yaw-pitch-camera
lenses: []
misconceptions: [rotation.euler-order/order-irrelevant]
---

# Euler order: read three imported angles in their stated order and return an equivalent orientation, leaving the angles intact

> **The job:** Read three imported angles in their stated order and return an equivalent orientation, leaving the angles intact.

## Task

Read three imported angles in their stated order and return an equivalent orientation, leaving the angles intact.

Write `importTurn(angles, order)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/euler-order/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/euler-order/apply-1

## The check

It passes when `importTurn` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the euler order page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

UI rotation sliders. Reading imported rotations.

</details>
