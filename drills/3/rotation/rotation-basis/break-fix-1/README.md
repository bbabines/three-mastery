---
id: 3.rotation.rotation-basis.break-and-fix.1
loop: 3
tier: core
concepts: [rotation.rotation-basis, rotation.converting]
mode: break-and-fix
context: rotation.rotation-basis/forward-from-matrix
lenses: [space]
misconceptions: [rotation.converting/same-numbers]
---

# Rotation basis: a forward arrow made from angle numbers

> **The job:** find a rotated object's world-space forward direction.

## Task

`forwardFromEuler(angles)` returns where the object's local +Z axis points after the Euler rotation. The starter treats the three angle values as a direction vector, so the arrow points somewhere unrelated to the object's front. Fix it without changing `angles`.

The orange arrow should line up with the green arrow as you turn the object.

<div data-scene="basis"></div>

## Spaces

| Value | Space |
| --- | --- |
| Local +Z | Object-local direction |
| Returned arrow | World-space direction |

## Your code

Fix `drills/3/rotation/rotation-basis/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/rotation/rotation-basis/break-fix-1
```

## The check

The acceptance test includes zero and combined rotations, and checks the arrow is unit length. Your check must reject angle numbers used as a direction.

<details><summary>Hint</summary>

Convert the Euler to a quaternion, make a rotation matrix, and extract its basis. The third basis axis is local +Z in world space.

</details>

## Where else?

What other local axis can you read from a rotation basis?

<details><summary>A few answers</summary>

A tool's right direction, a camera's up direction, or a part's hinge axis.

</details>
