---
id: 2.geometry.vertex-normals.implement.1
loop: 2
tier: core
concepts: [geometry.vertex-normals]
mode: implement
context: geometry.vertex-normals/low-poly
lenses: []
misconceptions: [geometry.vertex-normals/imported-right]
---

# Vertex normals: rebuild a mesh’s per-vertex normals for smooth shading after its positions change, preserving the original geometry

> **The job:** Rebuild a mesh’s per-vertex normals for smooth shading after its positions change, preserving the original geometry.

## Task

Rebuild a mesh’s per-vertex normals for smooth shading after its positions change, preserving the original geometry.

Write `smoothNormals(geometry)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/vertex-normals/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/vertex-normals/implement-1

## The check

It passes when `smoothNormals` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the vertex normals page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Smoothing artifacts. Fixing bad normals.

</details>
