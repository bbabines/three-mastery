---
id: 3.interaction.orbit-pan-dolly.break-and-fix.1
loop: 3
tier: light
concepts: [interaction.orbit-pan-dolly, interaction.focus-on-object]
mode: break-and-fix
context: interaction.orbit-pan-dolly/top-down-planner
lenses: []
misconceptions: []
---

# Orbit pan dolly: find the faulty result

> **The job:** Focusing a part moves the camera, but the next orbit swings around the old target.

## Task

Focusing a part moves the camera, but the next orbit swings around the old target. Move the camera along its current view direction and update the orbit target together.

Fix `focusView` in `drill.ts`. The scene shows the current result alongside a reference; they should agree after the repair.

<div data-scene="demo"></div>

## Your code

Fix `drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

    npm run drill -- drills/3/interaction/orbit-pan-dolly/break-fix-1

## The check

The acceptance test covers more than the scene pose. Your check must fail on the original bug and pass after the fix, using behavior instead of looking for a particular line of code.

<details><summary>Hint</summary>

Which point will OrbitControls use as its center after focus?

</details>

## Where else?

Where else would the same wrong assumption cause an error?

<details><summary>A few answers</summary>

Product viewer; Inspecting detail.

</details>
