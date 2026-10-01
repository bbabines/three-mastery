---
id: 4.queries.intersection-anatomy.ai-review.1
loop: 4
tier: core
concepts: [queries.intersection-anatomy]
mode: ai-review
context: queries.intersection-anatomy/orient-marker
lenses: []
misconceptions: []
---
# AI review: a click misses a part that just moved

> **The job:** Raycast a moved part in the same update tick.

## Task

The generated picker works until code moves an object immediately before asking for a hit. Update the object’s world transform before intersecting it. Return whether the ray hits its current position.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/queries/intersection-anatomy/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/queries/intersection-anatomy/ai-review-1

## The check

Move a box and raycast at its new position before the renderer has drawn another frame. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

Where else could this flaw appear when the scene grows beyond one simple example?

<details><summary>A few answers</summary> A second product variant, a mobile viewport, or a scene with nested parts can expose a hidden assumption. </details>
