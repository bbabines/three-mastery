---
id: 3.debugging.helpers.break-and-fix.1
loop: 3
tier: light
concepts: [debugging.helpers, debugging.visualizing-vectors]
mode: break-and-fix
context: debugging.visualizing-vectors/ray-direction
lenses: [space]
misconceptions:
  - debugging.visualizing-vectors/parent-irrelevant
---

# Vector helper: a correct ray drawn in the wrong place

> **The job:** draw a world-space ray with an ArrowHelper under a rotated parent.

## Task

`worldArrow(parent, origin, direction)` receives a parent with position and rotation, plus a world-space ray. The starter constructs the arrow from the correct numbers, yet when it is parented, the arrow starts and points somewhere else.

Fix the placement without changing the inputs. Name the space mistake in `cause.md`, then write a regression assertion in `check.ts`. The scene marks the intended ray origin with a red dot.

<div data-scene="rayHelper"></div>

## Spaces

| Value | Space |
| --- | --- |
| `origin`, `direction` | world |
| arrow's position and direction under `parent` | parent local |
| displayed ray | world |

## Your code

Edit `drills/3/debugging/helpers/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/debugging/helpers/break-fix-1

## The check

The acceptance test checks the arrow's world origin and direction under translated and rotated parents. The regression assertion rejects a helper that double-applies its parent transform.

<details><summary>Hint</summary> A child object's position and orientation are read in its parent's local space. </details>

## Where else?

What other helpers can be correct in value yet misleading on screen?

<details><summary>A few answers</summary> A surface normal arrow, a camera frustum, or a box showing world bounds. </details>
