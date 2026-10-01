---
id: 4.assets.disposal.ai-review.1
loop: 4
tier: core
concepts: [assets.disposal]
mode: ai-review
context: assets.disposal/variant-switching
lenses: []
misconceptions: [assets.disposal/dispose-everything]
---
# AI review: replacing a variant breaks the next one

> **The job:** Dispose an old material without destroying a texture still used by the new material.

## Task

The generated cleanup passes a one-variant demo, but the next variant loses its shared color map. Dispose the old material and its old-only map. Leave a map shared with the next material alive.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Write a regression assertion in `check.ts` that rejects the original bug.

## Your code

Edit `drills/4/assets/disposal/ai-review-1/drill.ts`, `cause.md`, and `check.ts`. Check it with:

    npm run drill -- drills/4/assets/disposal/ai-review-1

## The check

Watch dispose events for both a shared map and an old-only map after a swap. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

Where else could this flaw appear when the scene grows beyond one simple example?

<details><summary>A few answers</summary> A second product variant, a mobile viewport, or a scene with nested parts can expose a hidden assumption. </details>
