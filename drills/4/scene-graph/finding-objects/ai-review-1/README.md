---
id: 4.scene-graph.finding-objects.ai-review.1
loop: 4
tier: light
concepts: [scene-graph.finding-objects]
mode: ai-review
context: scene-graph.finding-objects/find-node
lenses: []
misconceptions: [scene-graph.finding-objects/names-unique]
---
# AI review: finding one of several matching parts

> **The job:** Collect every matching part in a product hierarchy.

## Task

The generated helper returns the first bolt named "fastener". A product with several branches needs all of them. Return every descendant with the requested name in traversal order, without changing the hierarchy.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Run the acceptance check to prove the behavior.

## Your code

Edit `drills/4/scene-graph/finding-objects/ai-review-1/drill.ts` and `cause.md`. Check it with:

    npm run drill -- drills/4/scene-graph/finding-objects/ai-review-1

## The check

A hierarchy with a match under each of two groups must return both. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

How does the bug appear in a duplicated product branch?

<details><summary>A few answers</summary> Each branch may contain a fastener with the same name; traversal must collect both rather than stop at the first match. </details>
