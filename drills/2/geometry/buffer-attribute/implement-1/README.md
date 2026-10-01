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

# BufferAttribute: read a position

> **The job:** Read XYZ by vertex number.

## Task

Write `vertexPosition(position, index)`. Return a new Vector3 containing that vertex’s X, Y, and Z components. `index` is a vertex number; a position attribute stores three components per vertex. Leave the attribute unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `position` | Vertex positions measured from the object itself |
| `index` | Vertex number |
| Answer | Position measured from the object itself |

## Your code

Write it in `drills/2/geometry/buffer-attribute/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/buffer-attribute/implement-1

## The check

It reads later vertices correctly, including when the flat array has more than three entries.

<details><summary>Hint</summary>

Use the attribute’s component getters, which take vertex numbers.

</details>

## Where else?

Where else is one vertex position needed?

<details><summary>A few answers</summary>

Build a face from indexed corners or place an editing handle on a vertex.

</details>
