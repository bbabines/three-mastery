---
id: 2.math.dot-product.implement.1
loop: 2
tier: core
concepts: [math.dot-product]
mode: implement
context: math.dot-product/cone-check
lenses: []
misconceptions:
  - math.dot-product/always-unit-range
---

# Dot product: a vision cone

> **The job:** decide whether a target is inside a cone: close enough, and within an angle of the way something faces.

## Task

A security camera in a store notices shoppers inside its cone of view: within `range` of it, and within `halfAngle` degrees of the way it faces. Write `canSee(eye, facing, target, halfAngle, range)`, which returns `true` when `target` is inside the cone.

- `eye` is where the camera is, and `target` is where the shopper is.
- `facing` is the way the camera faces, at any length.
- `halfAngle` runs from 0 to 180: 45 is a 90° wide cone, and 120 sees partly behind.

A target exactly on the cone's edge can go either way. Don't change any of the vectors.

Turn the camera and change the cone. Shoppers turn red when `canSee` says the camera sees them.

<div data-scene="cone"></div>

## Your code

Write it in `drills/2/math/dot-product/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/dot-product/implement-1
```

## The check

It passes when `canSee` agrees with three.js's own `angleTo` and `distanceTo` for targets all around the camera, with a `facing` of any length and cones from narrow to wider than a right angle, and the inputs come back unchanged.

<details>
<summary>Hint</summary>

The dot product page shows the cone check. The 1 to −1 scale only holds for two directions of length 1.

</details>

## Where else?

Where else would you compare a dot product with a threshold instead of just its sign?

<details>
<summary>A few answers</summary>

A spotlight's cone. Snapping a dragged part to the nearest of several directions. Lighting that fades as a surface turns away from the light.

</details>
