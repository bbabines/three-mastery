---
id: 3.math.angle-between.break-and-fix.1
loop: 3
tier: core
concepts: [math.angle-between, math.spherical-coords]
mode: break-and-fix
context: math.angle-between/turn-direction
lenses: []
misconceptions:
  - math.angle-between/angleto-direction
---

# Signed angle: an orbit control that only turns right

> **The job:** report which way an orbit control moved around its vertical axis.

## Task

`orbitTurn(from, to)` returns the signed change in azimuth from −π to π. Both inputs are three.js `Spherical` values, with the same center, and are away from the poles. A positive answer turns toward +X from +Z; a negative answer turns the other way. Radius and polar angle may differ.

The starter reports the same sign for a left and right turn. Fix it without changing the inputs. Move the orbit target with the slider; the blue pointer should follow in both directions.

<div data-scene="orbit"></div>

## Your code

Fix `drills/3/math/angle-between/break-fix-1/drill.ts`, name the cause in `cause.md`, then write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/math/angle-between/break-fix-1
```

## The check

The acceptance test checks both turn directions, wraparound at ±π, changed radius and polar angle, and unchanged inputs. Your check must reject the original code.

<details><summary>Hint</summary>

`angleTo` gives only an unsigned angle. Spherical `theta` is the turn around Y, measured from +Z toward +X.

</details>

## Where else?

Where else does a positive-only angle make motion go the wrong way?

<details><summary>A few answers</summary>

A dial, a turret tracking a target, or a compass heading.

</details>
