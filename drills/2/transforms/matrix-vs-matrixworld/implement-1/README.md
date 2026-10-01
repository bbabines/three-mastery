---
id: 2.transforms.matrix-vs-matrixworld.implement.1
loop: 2
tier: core
concepts: [transforms.matrix-vs-matrixworld]
mode: implement
context: transforms.matrix-vs-matrixworld/reparenting
lenses: [space]
misconceptions: [transforms.matrix-vs-matrixworld/always-current]
---

# matrixWorld: save a nested pose

> **The job:** Capture the full world transform of a part after its rack moves.

## Task

`worldTransform(part)` returns a copy of the part’s current world matrix, including all ancestors. A caller may keep that copy while the rack moves again. Leave the part and its parent untouched.

Move the rack. The blue corner placed by the saved matrix should meet the yellow world corner.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Local frame under a parent |
| Answer | Copy of part local to world transform |


## Your code

Write it in `drills/2/transforms/matrix-vs-matrixworld/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/matrix-vs-matrixworld/implement-1

## The check

The check moves an ancestor after a previous update, compares all matrix elements, and then moves it again to ensure the returned matrix is a snapshot.

<details><summary>Hint</summary>

Update the world matrix through the parents and clone it. Returning the live `matrixWorld` lets a later move change the saved pose.

</details>

## Where else?

Where else do you need a pose snapshot?

<details><summary>A few answers</summary>

Saving an animation key. Recording a grab pose. Sending a transform to a renderer.

</details>
