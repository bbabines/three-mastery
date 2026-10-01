---
id: 2.assets.gltf-structure.implement.1
loop: 2
tier: core
concepts: [assets.gltf-structure]
mode: implement
context: assets.gltf-structure/find-by-name
lenses: []
misconceptions: []
---

# glTF: count primitives in a mesh

> **The job:** Count the draw pieces behind one glTF mesh definition.

## Task

A glTF mesh has one or more primitives. Return the primitive count for a mesh index, or zero if that index is absent. Multiple primitives become multiple three.js Mesh objects.

| Function | Return |
| --- | --- |
| `primitiveCount(document: { meshes: { primitives: unknown[] }[] }, meshIndex: number)` | The number of glTF primitives for one mesh index. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/assets/gltf-structure/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/gltf-structure/implement-1
```

## The check

The test counts three primitives in one glTF mesh, one in another, and zero for a missing index.

<details><summary>Hint</summary>

The mesh definition contains a primitives array. Each primitive has its own geometry and material.

</details>

## Where else?

Where else does one glTF mesh contain several drawable pieces?

<details><summary>A few answers</summary> Material assignments, unexpected child meshes, or an asset audit. </details>
