---
id: 2.math.cross-product.apply.1
loop: 2
tier: core
concepts: [math.cross-product]
mode: apply
context: math.cross-product/turn-test
lenses: []
misconceptions:
  - math.cross-product/order-free
---

# Cross product: left or right on a route

> **The job:** tell whether a path turns left or right at a corner.

## Task

A delivery robot follows a route across a warehouse floor, and at each corner it signals which way it's turning. Write `turnAt(previous, corner, next)`, which returns `'left'`, `'right'`, or `'straight'` for the turn at `corner`, arriving from `previous` and leaving toward `next`.

Y is up. Rounding can leave a straight route with a tiny turn, so call it `'straight'` when the cross product's up part is between −0.000001 and 0.000001. Routes never double back on themselves. Don't change any of the points.

Move the middle corner. Each corner's label shows what `turnAt` says.

<div data-scene="route"></div>

## Your code

Write it in `drills/2/math/cross-product/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/cross-product/apply-1
```

## The check

It passes when `turnAt` names turns of every size to the left and right correctly, including on a raised route, driving the route the other way flips each answer, three points in a line give `'straight'` even with rounding, and the points come back unchanged.

<details>
<summary>Hint</summary>

The cross product page has the left-or-right test. Which two directions does it cross, and in which order?

</details>

## Where else?

Where else would you ask which side of a direction something is on?

<details>
<summary>A few answers</summary>

Which way a character should turn to face a target. Whether a triangle's corners are listed clockwise or counter-clockwise. Whether a dragged point is inside or outside a shape's corner.

</details>
