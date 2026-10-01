---
id: 3.math.cross-product.break-and-fix.1
loop: 3
tier: core
concepts: [math.cross-product, math.triple-product]
mode: break-and-fix
context: math.triple-product/above-below-triangle
lenses: [space]
misconceptions:
  - math.cross-product/order-free
---

# Cross product: the flipped inspection side

> **The job:** tell which side of a triangular panel a probe is on.

## Task

`signedSide(a, b, c, probe)` returns a signed distance from the triangle's plane. Positive means the side its ordered vertices face; negative means the back. The starter reports the opposite side. Fix it without changing the points.

Move the probe through the panel. The readout should say positive on the green front side and negative behind it.

<div data-scene="panel"></div>

## Spaces

| Value | Space |
| --- | --- |
| `a`, `b`, `c`, `probe` | World-space points |
| Panel normal and probe offset | World-space directions |
| Answer | Signed world-space distance |

## Your code

Fix `drills/3/math/cross-product/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/math/cross-product/break-fix-1
```

## The check

The acceptance test checks probes on both sides of an axis-aligned and a slanted panel, and unchanged inputs. Your check must reject the original code.

<details><summary>Hint</summary>

`Triangle.getNormal` gives the normal of the ordered vertices. Swapping two vertices changes which side it faces.

</details>

## Where else?

Where else does the sign of an oriented surface matter?

<details><summary>A few answers</summary>

Backface culling, whether a point lies above a floor triangle, or checking a mirrored basis.

</details>
