---
id: 3.debugging.reading-matrices.break-and-fix.1
loop: 3
tier: core
concepts: [debugging.reading-matrices]
mode: break-and-fix
context: debugging.reading-matrices/mirroring
lenses: [space]
misconceptions: []
---

# Reading matrices: a rotation mistaken for a mirror

> **The job:** tell whether a saved transform reverses handedness.

## Task

`isMirrored(matrix)` reads a world transform. The starter treats one element's sign as the answer; after a part rotates, it can report a mirror where there is none, or miss a real mirror.

Fix the classifier without changing the matrix. Name why one component is insufficient in `cause.md`, then write a regression assertion in `check.ts`. The scene compares an ordinary rotated part with a mirrored one.

<div data-scene="mirrorAudit"></div>

## Spaces

| Value | Space |
| --- | --- |
| `matrix` | local part to world |
| answer | whether the three world axes reverse handedness |

## Your code

Edit `drills/3/debugging/reading-matrices/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/debugging/reading-matrices/break-fix-1

## The check

The acceptance test rotates ordinary and mirrored objects and compares the answer with their determinant sign. The regression assertion rejects a component-sign shortcut.

<details><summary>Hint</summary> A rotated positive axis can point toward negative world X without making the basis mirrored. </details>

## Where else?

Where else does a negative determinant matter?

<details><summary>A few answers</summary> Triangle winding after baking, face culling, and normal orientation. </details>
