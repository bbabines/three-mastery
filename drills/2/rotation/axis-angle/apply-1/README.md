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

# Axis-angle: orbit around a tilted hinge

> **The job:** Swing a point around a tilted hinge that does not pass through the scene origin.

## Task

A hinge can point in any direction. `orbitOnAxis(point, center, axis, radians)` returns the point after turning around the line through `center` in the direction of `axis`. Positive radians follow the right-hand rule. The axis may have any nonzero length. Leave all three vectors unchanged.

In the scene, the blue point should land on the yellow target while the orange hinge stays fixed.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/axis-angle/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/axis-angle/apply-1

## The check

The check uses an off-center hinge and a tilted, non-unit axis. It compares the returned point with a three.js rotation and checks that the inputs are untouched.

<details><summary>Hint</summary>

Move the point relative to the hinge before turning it. `applyAxisAngle` expects a unit axis; restore the hinge offset afterward.

</details>

## Where else?

What else rotates around a hinge away from the world origin?

<details><summary>A few answers</summary>

A robot arm joint. A tilted solar panel. A door handle around its spindle.

</details>
