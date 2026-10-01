---
id: 4.debugging.reading-matrices.ai-review.1
loop: 4
tier: core
concepts: [debugging.reading-matrices]
mode: ai-review
context: debugging.reading-matrices/console-check
lenses: []
misconceptions: [debugging.reading-matrices/set-order]
---
# AI review: a matrix log shows the wrong position

> **The job:** Read translation out of a saved transform.

## Task

The generated inspector takes the values from the last column as printed in row-major notation. Its output stays zero after moving the part. Return the translation held in Matrix4.elements, which uses column-major storage.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/debugging/reading-matrices/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/debugging/reading-matrices/ai-review-1

## The check

Compose transforms with nonzero translation, turn, and scale, then compare with decompose. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

Where else could this flaw appear when the scene grows beyond one simple example?

<details><summary>A few answers</summary> A second product variant, a mobile viewport, or a scene with nested parts can expose a hidden assumption. </details>
