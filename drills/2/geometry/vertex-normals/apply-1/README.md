---
id: 2.geometry.vertex-normals.apply.1
loop: 2
tier: core
concepts: [geometry.vertex-normals]
mode: apply
context: geometry.vertex-normals/fix-normals
lenses: []
misconceptions: [geometry.vertex-normals/imported-right]
---

# Vertex normals: give each triangle its own vertices and face normals to make a low-poly model show hard edges

> **The job:** Give each triangle its own vertices and face normals to make a low-poly model show hard edges.

## Task

Give each triangle its own vertices and face normals to make a low-poly model show hard edges.

Write `hardEdges(geometry)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/vertex-normals/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/vertex-normals/apply-1

## The check

It passes when `hardEdges` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the vertex normals page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Smoothing artifacts. Low-poly look.

</details>
