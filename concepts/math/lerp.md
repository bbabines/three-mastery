---
id: math.lerp
name: Lerp
domain: math
tier: light
prerequisites: [math.point-vs-direction]
misconceptions:
  stays-unit: '"Lerped unit vectors stay unit length."'
  t-in-range: '"t stays within 0–1"; outside, it extrapolates.'
contexts:
  positions: Positions
  colors: Colors
  blend-weights: Blend weights
---

## Definition

Lerp blends between two values by a fraction t, where 0 gives the first, 1 gives the second, and values outside 0–1 keep going past the ends.
