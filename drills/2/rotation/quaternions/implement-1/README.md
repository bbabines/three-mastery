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

# Quaternions: turn around a local axis

> **The job:** Turn a part around an axis that moves with the part.

## Task

A part already has an orientation. `localDelta(orientation, localAxis, radians)` returns the orientation after turning around its own `localAxis`. The axis may be any nonzero length. Leave the orientation and axis unchanged.

The blue aim and green up arrows should match the yellow pose after a local-axis turn.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/quaternions/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/quaternions/implement-1

## The check

The check compares the result with a local-axis turn on a pre-rotated part and checks both inputs remain unchanged.

<details><summary>Hint</summary>

A local turn acts after the current orientation in the part’s frame. Build the axis turn with a unit axis before combining quaternions.

</details>

## Where else?

Where else is a local-axis turn useful?

<details><summary>A few answers</summary>

Rolling an aircraft. Twisting a robot wrist. Spinning a wheel attached to a rotated axle.

</details>
