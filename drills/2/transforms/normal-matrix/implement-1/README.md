---
id: 2.transforms.normal-matrix.implement.1
loop: 2
tier: core
concepts: [transforms.normal-matrix]
mode: implement
context: transforms.normal-matrix/face-normal-world
lenses: [space]
misconceptions: [transforms.normal-matrix/normals-like-directions]
---

# Normal matrix: carry a face normal

> **The job:** Return a world normal for a part with unequal scale.

## Task

`normalInWorld(part, localNormal)` returns a unit face normal in world space. The part and its parent may rotate and scale unevenly. Leave the given local normal unchanged.

The blue normal should meet the yellow world normal after the orange panel stretches.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `part` | Local frame under a parent |
| `localNormal` | Part local direction |
| Answer | Unit world direction |


## Your code

Write it in `drills/2/transforms/normal-matrix/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/transforms/normal-matrix/implement-1

## The check

The check builds two tangents along the transformed face. The returned normal must stay perpendicular to both, and the local normal must remain unchanged.

<details><summary>Hint</summary>

Build a normal matrix from the part’s current world matrix. Apply it to a copy of the normal and normalize the result.

</details>

## Where else?

Where else is a world normal used?

<details><summary>A few answers</summary>

Lighting a deformed part. Positioning a decal. Testing which side of a surface faces a sensor.

</details>
