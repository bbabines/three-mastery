---
id: math.float-tolerance
name: Floating-point tolerance
domain: math
tier: core
prerequisites: []
misconceptions:
  equal-math-equal-floats: '"Equal math means equal floats."'
contexts:
  vector-equality: Vector equality tests
  degenerate-triangles: Degenerate triangles
  coplanar-checks: Coplanar checks
---

## Definition

Computers round numbers slightly, so values that should be equal are compared as close enough, within a tolerance, rather than exactly.

## Space lens

The farther a number is from zero, the bigger the gaps between the values a computer can store, so positions far from the origin are less precise.

## Cost lens

JavaScript uses 64-bit numbers, but vertex data and most GPU math use 32-bit floats, which hold about 7 significant digits.
