---
id: 3.interaction.frame-rate-independence.break-and-fix.1
loop: 3
tier: core
concepts: [interaction.frame-rate-independence]
mode: break-and-fix
context: interaction.frame-rate-independence/camera-smoothing
lenses: []
misconceptions: [interaction.frame-rate-independence/lerp-per-frame]
---

# Frame rate independence: find the faulty result

> **The job:** A camera catch-up feels faster on a 120 Hz screen than a 60 Hz screen.

## Task

A camera catch-up feels faster on a 120 Hz screen than a 60 Hz screen. Move the value toward its target by the same amount for the same elapsed time.

Fix `smoothMove` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/frame-rate-independence/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Should two half-length updates equal one full-length update?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Hover scale; Drag smoothing.

</details>
