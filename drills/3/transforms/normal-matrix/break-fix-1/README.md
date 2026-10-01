---
id: 3.transforms.normal-matrix.break-and-fix.1
loop: 3
tier: core
concepts: [transforms.normal-matrix, transforms.negative-scale]
mode: break-and-fix
context: transforms.normal-matrix/squashed-lighting
lenses: [space]
misconceptions: [transforms.normal-matrix/normals-like-directions]
---

# Normal matrix: a surface lit from the wrong side

> **The job:** point a surface normal correctly after a part is stretched and turned.

## Task

`worldSurface(part, localNormal)` returns a unit world-space normal and whether the part's world transform is mirrored. The starter treats the normal like an ordinary direction, so the lighting arrow tilts away from a stretched surface. Fix the normal without changing `localNormal`.

Turn the part. The orange arrow should match the green normal-matrix arrow, even when one scale axis is much longer.

<div data-scene="surface"></div>

## Spaces

| Value | Space |
| --- | --- |
| `localNormal` | Part-local normal |
| Returned normal | World-space normal |
| `mirrored` | True when world transform reverses handedness |

## Your code

Fix `drills/3/transforms/normal-matrix/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/transforms/normal-matrix/break-fix-1
```

## The check

The acceptance test uses slanted normals under non-uniform scale, rotation, and negative scale. Your check must reject a normal transformed like a direction.

<details><summary>Hint</summary>

`Matrix3.getNormalMatrix(matrixWorld)` makes the inverse-transpose transform for normals. A negative determinant marks a mirrored transform.

</details>

## Where else?

Where else does a stretched object's normal affect a result?

<details><summary>A few answers</summary>

Face lighting, aligning a marker to a raycast surface, or reflecting a view from a sloped panel.

</details>
