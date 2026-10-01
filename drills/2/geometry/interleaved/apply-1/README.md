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

# Interleaved buffers: move a vertex in an interleaved position attribute by vertex number, then mark its shared buffer for upload

> **The job:** Move a vertex in an interleaved position attribute by vertex number, then mark its shared buffer for upload.

## Task

Move a vertex in an interleaved position attribute by vertex number, then mark its shared buffer for upload. The UV values share the same storage and must stay unchanged; the stride is wider than the three position components.

Write `moveInterleavedVertex(position, index, newPosition)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/interleaved/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/interleaved/apply-1

## The check

It passes when `moveInterleavedVertex` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the interleaved buffers page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Reading loaded glTF data. Manual vertex edits.

</details>
