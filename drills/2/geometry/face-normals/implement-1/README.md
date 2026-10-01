---
id: 2.geometry.face-normals.implement.1
loop: 2
tier: core
concepts: [geometry.face-normals]
mode: implement
context: geometry.face-normals/flat-shading
lenses: []
misconceptions: [geometry.face-normals/average-of-vertex]
---

# Face normals: normal after stretch

> **The job:** Turn a face normal into the world.

## Task

Write `faceNormalWorld(a, b, c, modelToWorld)`. The corners are measured from the object itself; the saved transform may turn and unevenly stretch it. Return a new unit direction in the world, perpendicular to the transformed face. Leave all inputs unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `a, b, c` | Positions measured from object itself |
| `modelToWorld` | Object space to world space |
| Answer | Unit direction in the world |

## Your code

Write it in `drills/2/geometry/face-normals/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/geometry/face-normals/implement-1

## The check

The result matches the transformed triangle’s face after a nonuniform scale and stays perpendicular.

<details><summary>Hint</summary>

A normal is a direction, not a point. For a stretched object, a plain direction transform does not keep it perpendicular.

</details>

## Where else?

Where else do world normals after stretch matter?

<details><summary>A few answers</summary>

Aim a surface marker or compare a ray hit with a world light direction.

</details>
