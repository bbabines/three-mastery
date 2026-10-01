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

# BufferAttribute: read a vertex color

> **The job:** Read RGB by vertex number.

## Task

Write `vertexColor(colors, vertexIndex)`. Return a new Vector3 holding the chosen vertex’s red, green, and blue components. The attribute stores three components per vertex; `vertexIndex` is a vertex number, not a raw array offset. Leave the attribute unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `colors` | RGB values per vertex |
| `vertexIndex` | Vertex number |
| Answer | RGB component values |

## Your code

Write it in `drills/2/geometry/buffer-attribute/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/buffer-attribute/apply-1

## The check

It reads a vertex beyond the first one without accidentally treating its number as the flat array offset.

<details><summary>Hint</summary>

A BufferAttribute can read components by vertex number. How does that differ from indexing `colors.array`?

</details>

## Where else?

Where else must you distinguish vertex number from array offset?

<details><summary>A few answers</summary>

Read a position or edit one vertex’s normal in a packed attribute.

</details>
