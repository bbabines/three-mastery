---
id: 4.math.projection-rejection.ai-review.1
loop: 4
tier: core
concepts: [math.projection-rejection]
mode: ai-review
context: math.projection-rejection/wall-slide
lenses: []
misconceptions: []
---

# AI review: a wall slide that changes its input

> **The job:** Review a generated collision helper before accepting it in a movement system.

## Task

The proposed `slideOnWall(velocity, wallNormal)` returns the part of a velocity along a wall. It produces the right result on one call, yet another system that reads the same velocity afterward behaves differently. Both vectors belong to the caller and must come back unchanged.

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
