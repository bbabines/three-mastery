---
id: 4.transforms.normal-matrix.cross.1
loop: 4
tier: core
concepts: [transforms.normal-matrix, geometry.face-normals, queries.intersection-anatomy]
mode: cross-domain
context: transforms.normal-matrix/face-normal-world
lenses: [space]
misconceptions: []
---

# Place a marker flush on a clicked surface

> **The job:** make one decision that needs ideas from several parts of 3D work.

## Task

A raycast hit provides `hit.face.normal` in the mesh's local space. Write `markerNormal(localNormal, mesh)` to give a length-1 world normal for a marker. The mesh may sit inside a turned, unevenly stretched parent. Update its world matrix. Do not change the input normal.

<div data-scene="marker"></div>

## Spaces

| Value | Space |
| --- | --- |
| `localNormal` | Hit mesh local space |
| `mesh.matrixWorld` | Local to world |
| Return value | World direction |

## Your code

Write it in `cross/4/surface-marker/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/surface-marker
```

## The check

The check builds a sloped triangle under non-uniform scale and rotation, then proves the returned normal is perpendicular to both transformed edges. Ordinary direction transforms fail this case.

<details><summary>Hint</summary>

Use the relevant three.js method from the concept pages. Keep every value in the same space before combining it.

</details>

## Where else?

Where else would this same decision appear in a product viewer or tool?
