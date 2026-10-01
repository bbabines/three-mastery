---
id: 3.rotation.quaternions.break-and-fix.1
loop: 3
tier: core
concepts: [rotation.quaternions, rotation.slerp]
mode: break-and-fix
context: rotation.slerp/camera-transitions
lenses: []
misconceptions: [rotation.slerp/lerp-euler]
---

# Quaternions: a camera that spins the long way

> **The job:** blend two camera orientations along the short turn.

## Task

`blendOrientation(from, to, t)` returns a quaternion between two Euler orientations at `t` from 0 to 1. The inputs use the same order. The starter blends Euler angle numbers, so a camera going from +170° to −170° swings through the front instead of making the short turn across the back. Fix it without changing the inputs.

The orange pointer should follow the green short-turn pointer as the blend slider moves.

<div data-scene="blend"></div>

## Your code

Fix `drills/3/rotation/quaternions/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/rotation/quaternions/break-fix-1
```

## The check

The acceptance test blends orientations across the ±π boundary and on a tilted axis, checks the endpoints, and checks unchanged Euler inputs. Your check must reject Euler-number interpolation.

<details><summary>Hint</summary>

Convert each endpoint with `Quaternion.setFromEuler`, then `slerpQuaternions` between them. The quaternion represents the orientation; its components are not separate angle sliders.

</details>

## Where else?

Where else can interpolating angles directly choose a surprising path?

<details><summary>A few answers</summary>

A turret turning across north, a product turntable, or a camera transition.

</details>
