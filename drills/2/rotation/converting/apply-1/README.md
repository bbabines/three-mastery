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

# Converting turns: preserve an imported pose

> **The job:** Turn a saved Euler orientation into a quaternion for an animated part.

## Task

An imported part stores its turn as Euler angles with an order. `orientationFromEuler(angles)` returns a quaternion for the same orientation. Keep the given angles and their order unchanged; an equivalent quaternion may use different numbers.

The blue pointer should face the same way as the yellow reference after conversion.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/converting/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/converting/apply-1

## The check

The check compares the quaternion with the orientation three.js gives an object for two different Euler orders. It also checks the saved Euler input is unchanged.

<details><summary>Hint</summary>

A quaternion can be built from an Euler directly. Keep the Euler order; converting through a default-order Euler changes the pose.

</details>

## Where else?

Where else do you need to carry an orientation between representations?

<details><summary>A few answers</summary>

Importing an animation clip. Saving a camera pose. Blending two keyframes.

</details>
