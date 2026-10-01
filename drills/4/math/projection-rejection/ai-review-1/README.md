---
id: 4.math.projection-rejection.ai-review.1
loop: 4
tier: core
concepts: [math.projection-rejection]
mode: ai-review
context: math.projection-rejection/axis-constraint
lenses: []
misconceptions: []
---

# AI review: a wall slide that changes its input

> **The job:** Review the wall-contact stage of a rail-constrained drag before accepting it.

## Task

Before a rail-constrained drag projects movement onto its rail, `slideOnWall(velocity, wallNormal)` removes movement into a guard wall. The proposed helper produces the right result on one call, yet the later rail stage reads a changed velocity. Both vectors belong to the caller and must come back unchanged.

Read `drill.ts`, name the flaw in `cause.md`, then fix it. In `check.ts`, write a small regression assertion that rejects the original version and accepts the repair. Run the drill check; the scene shows the incoming and outgoing directions.

<div data-scene="wallSlide"></div>

## Your code

Edit `drills/4/math/projection-rejection/ai-review-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/4/math/projection-rejection/ai-review-1

## The check

The result must match three.js's projection onto the plane for an angled wall, while both inputs retain their original values. The regression assertion should prove ownership of the inputs, not inspect the function's source.

<details><summary>Hint</summary> Many three.js vector methods change the vector they are called on. </details>

## Where else?

Where else can a numerically correct return value conceal a bug?

<details><summary>A few answers</summary> A shared camera direction, a stored ray, or a velocity reused for animation. </details>
