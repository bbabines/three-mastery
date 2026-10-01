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

# Vertex normals: restore smooth shading

> **The job:** Rebuild per-vertex normals after a shape edit.

## Task

Write `smoothNormals(geometry)`. Return a copy with normals recomputed from its current triangle positions. Preserve the input geometry. Indexed triangles can share a vertex, so their normals can average into a smooth surface.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `geometry positions` | Measured from object itself |
| Answer | New geometry with rebuilt normal attribute |

## Your code

Write it in `drills/2/geometry/vertex-normals/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/vertex-normals/implement-1

## The check

The copy’s normals follow changed positions, while the source retains its original attributes.

<details><summary>Hint</summary>

Three.js has a geometry method that recomputes vertex normals from triangle positions.

</details>

## Where else?

When else should normals be rebuilt?

<details><summary>A few answers</summary>

After deforming a mesh or changing a procedural surface.

</details>
