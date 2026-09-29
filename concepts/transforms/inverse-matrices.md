---
id: transforms.inverse-matrices
name: Inverse matrices
domain: transforms
tier: core
prerequisites: [transforms.matrix-vs-matrixworld]
misconceptions:
  inverse-transpose: '"Inverse equals transpose." True only for a pure rotation (or rotation plus mirror) with no translation or scale.'
contexts:
  world-to-local: worldToLocal
  hit-object-space: A hit point in object space
  view-matrix: Building a view matrix
---

## Definition

The inverse of a matrix undoes it, so the inverse of an object's `matrixWorld` brings a world spot back to being measured from the object itself.

## Space lens

`object.matrixWorld` converts from measured-from-the-object-itself to the world; its inverse converts the other way. `camera.matrixWorldInverse` converts world spots to measured from the camera.

## Cost lens

Inverting is several times the work of applying a matrix to a point, and `worldToLocal` inverts on every call. Invert once and reuse the result when converting many spots.
