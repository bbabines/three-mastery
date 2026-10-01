---
id: 2.rotation.axis-angle.apply.1
loop: 2
tier: light
concepts: [rotation.axis-angle, rotation.rotate-around-point]
mode: apply
context: rotation.axis-angle/tilted-axis
lenses: []
misconceptions: [rotation.axis-angle/on-axis-world]
---

# Axis-angle and orbit: rotate a point around a tilted axis through a chosen center, preserving the point and center

> **The job:** Rotate a point around a tilted axis through a chosen center, preserving the point and center.

## Task

Rotate a point around a tilted axis through a chosen center, preserving the point and center. The axis can tilt in any direction. Move the point relative to the center, apply the axis-angle turn, then put it back in world space.

Write `orbitOnAxis(point, center, axis, radians)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/axis-angle/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/axis-angle/apply-1

## The check

It passes when `orbitOnAxis` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the axis-angle and orbit page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Hinges. rotateOnAxis vs rotateOnWorldAxis.

</details>
