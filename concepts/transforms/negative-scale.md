---
id: transforms.negative-scale
name: Negative scale and determinant
domain: transforms
tier: light
prerequisites: [transforms.trs-order]
misconceptions:
  mirror-same: '"Mirroring by object scale and by baked geometry behave the same."'
contexts:
  left-right: Left/right product variants
  mirrored-import: Mirrored imports
  bake-geometry: Baking transforms into geometry
---

## Definition

A negative scale on one axis mirrors an object, and the determinant is a single number from a matrix that's negative when the matrix mirrors; three.js checks it so mirrored objects still draw right side out, but it can't see a mirror baked into the geometry.

## Space lens

three.js checks `object.matrixWorld.determinant()`, so a mirror on the object or on any of its parents counts. A mirror baked with `geometry.scale(-1, 1, 1)` changes the points measured from the object itself, and the object's matrices never show it.
