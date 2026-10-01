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

# Quaternions: turn around a parent axis

> **The job:** Turn a mounted part around an axis measured in its parent frame.

## Task

A mounted part already has an orientation. `parentDelta(orientation, parentAxis, radians)` returns its orientation after a turn around `parentAxis` in the parent frame. The axis may be any nonzero length. Leave the orientation and axis unchanged.

The blue aim and green up arrows should match the yellow pose after a parent-axis turn.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/quaternions/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/quaternions/apply-1

## The check

The check compares the result with a world-axis turn after an existing orientation, and checks both inputs remain unchanged.

<details><summary>Hint</summary>

A parent-frame turn acts before the part’s current orientation. Make a quaternion for the axis turn, then combine it on the parent side.

</details>

## Where else?

Where else is a parent-frame turn useful?

<details><summary>A few answers</summary>

Turning a camera mount around world up. Swinging a robot joint. Rotating a panel around its rack axis.

</details>
