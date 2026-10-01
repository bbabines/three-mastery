---
id: 2.geometry.buffer-attribute.implement.1
loop: 2
tier: core
concepts: [geometry.buffer-attribute]
mode: implement
context: geometry.buffer-attribute/color-attribute
lenses: []
misconceptions: [geometry.buffer-attribute/array-index]
---

# BufferAttribute: read one vertex’s xyz position from a flat position attribute using its item size

> **The job:** Read one vertex’s XYZ position from a flat position attribute using its item size.

## Task

Read one vertex’s XYZ position from a flat position attribute using its item size.

Write `vertexPosition(position, index)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/buffer-attribute/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/buffer-attribute/implement-1

## The check

It passes when `vertexPosition` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the bufferattribute page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Reading vertex 7's position. Custom per-vertex data.

</details>
