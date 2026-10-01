---
id: 4.scene-graph.finding-objects.ai-review.1
loop: 4
tier: light
concepts: [scene-graph.finding-objects]
mode: ai-review
context: scene-graph.finding-objects/group-by-material
lenses: []
misconceptions: [scene-graph.finding-objects/names-unique]
---
# AI review: a material group loses matching parts

> **The job:** Collect every matching part before grouping product hardware by material.

## Task

Before grouping hardware by material, the viewer collects every bolt named "fastener" across the product. The generated helper returns only the first one, so later branches never reach the grouping step. Return every descendant with the requested name in traversal order, without changing the hierarchy.

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
