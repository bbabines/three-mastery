---
id: 4.optimization.adaptive-quality.ai-review.1
loop: 4
tier: light
concepts: [optimization.adaptive-quality]
mode: ai-review
context: optimization.adaptive-quality/thermal-throttling
lenses: [cost]
misconceptions: []
---
# AI review: quality flickers near the frame budget

> **The job:** Adapt DPR to sustained frame cost without changing it on every tiny timing fluctuation.

## Task

The proposed controller toggles quality on consecutive frames around 16.7 ms, causing visible sharp-soft flicker. Use a dead band: lower DPR by 0.25 above 20 ms, raise it below 14 ms, and keep it between 1 and 2.

Review the proposed code in `drill.ts`. State the faulty assumption and its effect in `cause.md`, then repair the code. Write a regression assertion in `check.ts` that rejects the original bug.

## Measure

Record the frame time and drawing-buffer pixel count before and after each quality change. Treat timing as a measurement, never a pass threshold.

## Your code

Edit `drills/4/optimization/adaptive-quality/ai-review-1/drill.ts`, `cause.md`, and `check.ts`. Check it with:

    npm run drill -- drills/4/optimization/adaptive-quality/ai-review-1

## The check

A series of frame times near 16.7 ms must leave DPR steady; clear slow and fast frames must change it. The acceptance check fails on the proposal and passes after the repair.

<details><summary>Hint</summary> Look for a case the proposed helper handles differently from the job's contract. </details>

## Where else?

What happens when a warm phone alternates just above and below the frame target?

<details><summary>A few answers</summary> Without a dead band or sustained-frame rule, DPR oscillates; measured thermal slowdown should lower quality gradually. </details>
