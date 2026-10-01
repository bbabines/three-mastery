---
id: 2.geometry.interleaved.apply.1
loop: 2
tier: light
concepts: [geometry.interleaved, geometry.updating-buffers]
mode: apply
context: geometry.interleaved/cache-friendly
lenses: []
misconceptions: [geometry.interleaved/own-array]
---

# Interleaved attributes: move one vertex

> **The job:** Edit one position in a shared buffer.

## Task

Write `moveInterleavedVertex(position, index, newPosition)`. `index` is a vertex number in an interleaved position attribute. Write the new XYZ, mark the shared InterleavedBuffer for upload, and return true. Keep other vertices and `newPosition` unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `position` | Interleaved vertex positions measured from object |
| `index` | Vertex number |
| `newPosition` | Position measured from object |
| Answer | Boolean success |

## Your code

Write it in `drills/2/geometry/interleaved/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/interleaved/apply-1

## The check

The chosen vertex moves, neighboring packed values stay put, and the shared buffer is marked for upload.

<details><summary>Hint</summary>

The position attribute is one view of an interleaved buffer. Which object owns the GPU update flag?

</details>

## Where else?

Where else do several attributes share one upload?

<details><summary>A few answers</summary>

Move a vertex whose position and color are packed in the same buffer.

</details>
