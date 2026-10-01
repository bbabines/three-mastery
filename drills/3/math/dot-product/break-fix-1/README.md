---
id: 3.math.dot-product.break-and-fix.1
loop: 3
tier: core
concepts: [math.normalize, math.dot-product]
mode: break-and-fix
context: math.dot-product/cone-check
lenses: []
misconceptions:
  - math.dot-product/always-unit-range
---

# Dot product: a scanner with a stretched detection cone

> **The job:** keep a warehouse scanner's detection cone pointed where the scanner faces.

## Task

The scanner uses `canSee(facing, toward, halfAngle)` to decide whether a target is inside its cone. `facing` and `toward` are directions in the same space, but their lengths vary. `halfAngle` is in radians. A zero direction cannot point at a target.

The starter sometimes reports a target outside the scanner's cone as visible. Fix the function without changing its inputs. Move the target with the slider; the yellow target should only be detected inside the green cone.

<div data-scene="scanner"></div>

## Your code

Fix `drills/3/math/dot-product/break-fix-1/drill.ts`, then write the cause in its `cause.md` and the regression assertion in its `check.ts`.

```
npm run drill -- drills/3/math/dot-product/break-fix-1
```

## The check

The acceptance test tries directions of different lengths, targets just inside and outside the cone, and a zero direction. Your regression check must fail on the original code and pass after your fix. `npm run verify` proves that property for the reference check.

<details><summary>Hint</summary>

The dot product page says when its result stays between −1 and 1. Think about what the cone threshold assumes about both inputs.

</details>

## Where else?

Where else can vector length change a decision that should depend only on direction?

<details><summary>A few answers</summary>

A lamp's facing test, a character's field of view, or a surface-light alignment test.

</details>
