---
id: 3.assets.gltf-structure.break-and-fix.1
loop: 3
tier: core
concepts: [assets.gltf-structure]
mode: break-and-fix
context: assets.gltf-structure/unexpected-children
lenses: []
misconceptions:
  - assets.gltf-structure/one-mesh
---

# glTF structure: a missing primitive in the audit

> **The job:** collect all mesh primitives under an imported part before auditing its materials.

## Task

`primitiveMeshes(part)` receives a node from a loaded glTF scene. A part can be a Mesh or a Group whose children contain several primitive meshes, perhaps under another node. The material audit shows only one of the primitives in the starter scene.

Fix the collector without changing the hierarchy. Write the cause in `cause.md`, then add a regression assertion in `check.ts` that catches this shape of import.

<div data-scene="primitives"></div>

## Your code

Edit `drills/3/assets/gltf-structure/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/assets/gltf-structure/break-fix-1

## The check

The collector must include every nested mesh once, in traversal order, and leave the source hierarchy untouched. The regression check rejects the original one-level search.

<details><summary>Hint</summary> A glTF mesh with several primitives can load as a Group of three.js meshes. That Group may itself be nested. </details>

## Where else?

Where else would a one-level search miss part of a loaded asset?

<details><summary>A few answers</summary> Bounds calculations, variant swaps, and material overrides. </details>
