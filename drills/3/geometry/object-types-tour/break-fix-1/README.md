---
id: 3.geometry.object-types-tour.break-and-fix.1
loop: 3
tier: light
concepts: [geometry.object-types-tour, geometry.instanced-mesh]
mode: break-and-fix
context: geometry.instanced-mesh/select-instance
lenses: []
misconceptions: []
---

# Instanced mesh: one shelf moves all

> **The job:** Reposition one shelf in a repeated set.

## Task

`placeInstance(mesh, index, pose)` moves one shelf to the given local pose in an `InstancedMesh`. The starter changes the whole mesh object's position instead, so every shelf moves. Keep every other instance and the mesh object's transform unchanged, and mark the instance data for upload.

The middle shelf should move to the yellow target while the left and right shelves stay put.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/geometry/object-types-tour/break-fix-1

## The check

The acceptance test reads the chosen instance matrix and checks the mesh object has not moved. Your check should also catch a fix that moves all instances.

<details><summary>Hint</summary>

The object types tour separates one mesh's world transform from each instance's matrix. Which one controls one shelf?

</details>

## Where else?

Where else would moving the whole instanced mesh be too broad?

<details><summary>A few answers</summary>

One tree in a forest, one bolt on a machine, or one marker in a dense point display.

</details>
