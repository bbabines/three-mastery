---
id: transforms.trs-order
name: TRS order
domain: transforms
tier: core
prerequisites: [transforms.matrix-vs-matrixworld]
misconceptions:
  order-irrelevant: '"Order doesn''t matter."'
  parent-shear: '"A parent''s uneven scale just stretches a rotated child along the child''s own axes." It shears the child instead.'
contexts:
  pivot-rotate: Rotating around a pivot
  orbit-point: Orbiting a point
  scale-rotated: Scaling a rotated part
---

## Definition

Every object resizes first, then turns, then moves, whatever order the code sets them in, but when you combine changes yourself, the order you combine them in changes the result.

## Space lens

`position`, `rotation`, and `scale` are measured from the parent, and `scale` stretches along the object's own axes because it happens before the turn. A change added with `m.multiply(change)` is measured from the object itself; one added with `m.premultiply(change)` or `object.applyMatrix4(change)` is measured from the parent.
