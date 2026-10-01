---
id: 3.rotation.euler-order.break-and-fix.1
loop: 3
tier: core
concepts: [rotation.euler-order, rotation.gimbal-lock]
mode: break-and-fix
context: rotation.euler-order/ui-sliders
lenses: []
misconceptions: [rotation.euler-order/order-irrelevant]
---

# Euler order: a camera that pitches toward the wrong side

> **The job:** convert yaw, pitch, and roll sliders into a camera orientation.

## Task

`cameraOrientation(yaw, pitch, roll)` returns a quaternion for a camera whose Euler order is `YXZ`: yaw about Y first, pitch about its X, then roll about its Z. Inputs are radians. The starter uses a different order, so the view drifts when yaw and pitch are both present. Fix it.

Near a straight-up or straight-down pitch, yaw and roll controls become hard to distinguish; that is the Euler representation's gimbal lock, not a failure of quaternions. The green arrow uses the requested order; the orange arrow uses yours.

<div data-scene="camera"></div>

## Your code

Fix `drills/3/rotation/euler-order/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/rotation/euler-order/break-fix-1
```

## The check

The acceptance test combines yaw, pitch, and roll, including a steep pitch, and compares the resulting orientation with a camera using the requested order. Your check must reject the other order.

<details><summary>Hint</summary>

`Euler` takes an order as its fourth constructor argument. A camera's quaternion can copy that Euler orientation.

</details>

## Where else?

Where else can Euler order change a result that looks correct when only one slider moves?

<details><summary>A few answers</summary>

An import from another tool, a flight camera, or a three-axis product viewer.

</details>
