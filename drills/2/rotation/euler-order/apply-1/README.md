---
id: 2.rotation.euler-order.apply.1
loop: 2
tier: core
concepts: [rotation.euler-order]
mode: apply
context: rotation.euler-order/imported-rotations
lenses: []
misconceptions: [rotation.euler-order/order-irrelevant]
---

# Euler order: import the stated turn

> **The job:** Rebuild a part orientation from three imported angles and their order.

## Task

An asset file gives X, Y, and Z angles plus the order in which they act. `importTurn(angles, order)` returns the matching quaternion. The angles are radians. Do not change the vector of imported angles.

Move the middle angle. Blue should match the yellow pose imported with ZXY order.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/euler-order/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/euler-order/apply-1

## The check

The check tries several orders with the same nonzero angles, compares the orientation with three.js, and checks the angle vector is unchanged.

<details><summary>Hint</summary>

Construct an Euler with the supplied order before converting it. The default order only matches one of the cases.

</details>

## Where else?

Where else can a turn order change the result?

<details><summary>A few answers</summary>

Imported camera rigs. Character joint poses. Animation keyframes.

</details>
