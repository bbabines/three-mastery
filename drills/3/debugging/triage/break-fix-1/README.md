---
id: 3.debugging.triage.break-and-fix.1
loop: 3
tier: core
concepts: [debugging.triage]
mode: break-and-fix
context: debugging.triage/black-screen
lenses: []
misconceptions: []
---

# Triage: a black part blamed on its material

> **The job:** check scene membership and camera visibility before blaming appearance.

## Task

`firstBlocker(scene, camera, mesh)` returns the first reason a part cannot appear: `scene` if it is not in the scene, `camera` if outside the view, `material` if its basic material is black, or `none` if these checks find no blocker. The starter reports an appearance problem even when the part is missing or outside the view.

Fix the order of diagnosis, name the bad assumption in `cause.md`, then write a regression assertion in `check.ts`. Use the scene buttons to change the symptom.

<div data-scene="triage"></div>

## Your code

Edit `drills/3/debugging/triage/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/debugging/triage/break-fix-1

## The check

The acceptance test checks a detached part, one outside the frustum, and a black in-frame material. The regression assertion must reject an appearance-first diagnosis.

<details><summary>Hint</summary> A material cannot explain a missing part until you know the camera could draw it. </details>

## Where else?

What should you check before changing a shader after a black render target?

<details><summary>A few answers</summary> Which target was bound, whether a draw pass ran, and whether the camera saw anything. </details>
