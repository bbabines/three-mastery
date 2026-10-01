---
id: 2.geometry.buffer-attribute.apply.1
loop: 2
tier: core
concepts: [geometry.buffer-attribute]
mode: apply
context: geometry.buffer-attribute/custom-data
lenses: []
misconceptions: [geometry.buffer-attribute/array-index]
---

# BufferAttribute: read a mesh vertex’s rgb color from a packed color attribute without confusing flat array offsets with vertex numbers

> **The job:** Read a mesh vertex’s RGB color from a packed color attribute without confusing flat array offsets with vertex numbers.

## Task

Read a mesh vertex’s RGB color from a packed color attribute without confusing flat array offsets with vertex numbers.

Write `vertexColor(colors, vertexIndex)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/geometry/buffer-attribute/apply-1/drill.ts`. Check it with:

    npm run drill -- drills/2/geometry/buffer-attribute/apply-1

## The check

It passes when `vertexColor` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the bufferattribute page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

Reading vertex 7's position. Writing a color attribute.

</details>
