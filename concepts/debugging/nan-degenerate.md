---
id: debugging.nan-degenerate
name: NaN and degenerate cases
domain: debugging
tier: light
prerequisites: [math.normalize, math.dot-product, math.float-tolerance, transforms.inverse-matrices]
misconceptions:
  nan-throws: '"NaN would throw an error." It spreads silently.'
contexts:
  vanishing: Vanishing objects
  exploded-geometry: Exploded geometry
  failed-raycasts: Failed raycasts
---

## Definition

A degenerate case is an input with no sensible answer, like the direction of a zero-length vector, where three.js returns a fallback but your own math can make NaN.
