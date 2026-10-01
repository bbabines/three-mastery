---
id: 3.debugging.isolation.break-and-fix.1
loop: 3
tier: core
concepts: [debugging.isolation]
mode: break-and-fix
context: debugging.isolation/z-fighting
lenses: []
misconceptions: []
---

# Isolation: the hidden panel never comes back

> **The job:** hide one suspected surface for a probe, then restore the original scene state.

## Task

`withHidden(part, probe)` temporarily hides a part while `probe` checks whether a flicker remains. It returns the probe's result. The starter works when the probe succeeds; after a failed probe, the panel stays gone.

Fix the cleanup path. Keep the part's original `visible` value, even when it started hidden. Name the cause in `cause.md` and write a regression assertion in `check.ts`. Press the scene button to see what happens after a failed probe.

<div data-scene="isolatePanel"></div>

## Your code

Edit `drills/3/debugging/isolation/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/debugging/isolation/break-fix-1

## The check

The acceptance test covers successful and throwing probes and both initial visibility states. The regression assertion must reject a probe that leaves a changed scene behind.

<details><summary>Hint</summary> Scene isolation is an experiment. Even when the experiment fails, its temporary change must be undone. </details>

## Where else?

What other temporary scene changes need guaranteed restoration?

<details><summary>A few answers</summary> A debug material override, a layer mask, or an offscreen render target. </details>
