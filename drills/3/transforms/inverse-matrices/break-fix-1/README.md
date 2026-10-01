---
id: 3.transforms.inverse-matrices.break-and-fix.1
loop: 3
tier: core
concepts: [transforms.inverse-matrices]
mode: break-and-fix
context: transforms.inverse-matrices/hit-object-space
lenses: [space]
misconceptions: [transforms.inverse-matrices/inverse-transpose]
---

# Inverse matrices: a click stored on the wrong part spot

> **The job:** store a world-space click as a point local to a part.

## Task

`localHit(part, worldHit)` returns the clicked world point in the part's local space. The part may be translated, turned, and scaled. The starter returns the wrong local point as soon as the transform includes translation or scale. Fix it without changing `worldHit`.

The orange marker reconstructed from your local point should sit on the green click.

<div data-scene="hit"></div>

## Spaces

| Value | Space |
| --- | --- |
| `worldHit` | World-space point |
| Returned point | Part-local point |

## Your code

Fix `drills/3/transforms/inverse-matrices/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/transforms/inverse-matrices/break-fix-1
```

## The check

The acceptance test uses translation, non-uniform scale, and rotation, then checks that converting back recovers the original world point. Your check must reject a transpose used as an inverse.

<details><summary>Hint</summary>

`matrixWorld` goes from local to world. Its inverse goes back. A transpose only undoes a pure rotation or mirror.

</details>

## Where else?

Where else do you need to bring a world point into an object's own space?

<details><summary>A few answers</summary>

Placing a decal, recording a picked vertex, or checking whether a hit is inside a local box.

</details>
