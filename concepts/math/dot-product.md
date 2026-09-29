---
id: math.dot-product
name: Dot product
domain: math
tier: core
prerequisites: [math.normalize]
misconceptions:
  only-three-values: '"Only −1, 0, or 1."'
  always-unit-range: '"Always within [−1, 1]."'
  acos-unclamped: '"Math.acos of the dot of two unit vectors is always safe." Rounding can push it just past 1, and acos returns NaN; angleTo clamps.'
contexts:
  front-behind: Front/behind test
  lambert: Lambert N·L
  projection-length: Projection length on an axis
  plane-distance: Signed distance to a plane
  cone-check: Cone check
---

## Definition

The dot product turns two directions into one number that says how much they point the same way: 1 for the same way, 0 at right angles, and −1 for opposite, when both have length 1.

## Space lens

Both directions must be measured in the same space, like both in world space.
