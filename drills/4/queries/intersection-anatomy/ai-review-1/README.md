---
id: 4.queries.intersection-anatomy.ai-review.1
loop: 4
tier: core
concepts: [queries.intersection-anatomy]
mode: ai-review
context: queries.intersection-anatomy/paint-uv
lenses: []
misconceptions: []
---
# AI review: a paint click misses a part that just moved

> **The job:** Raycast a moved paint target in the same update tick.

## Task

The generated picker works until code moves a paintable object immediately before asking for a hit. The painter needs a current hit before it can use the hit's UV; this helper returns whether the ray reaches the object at its new position.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/queries/intersection-anatomy/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/queries/intersection-anatomy/ai-review-1

## The check

Move a box and raycast at its new position before the renderer has drawn another frame. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

When can a ray use stale geometry even after the mesh moves?

<details><summary>A few answers</summary> A moved parent also changes the child’s world transform; update the hierarchy before the same-tick raycast. </details>
