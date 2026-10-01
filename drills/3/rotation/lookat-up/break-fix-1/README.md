---
id: 3.rotation.lookat-up.break-and-fix.1
loop: 3
tier: core
concepts: [rotation.lookat-up]
mode: break-and-fix
context: rotation.lookat-up/top-down-camera
lenses: [space]
misconceptions: [rotation.lookat-up/same-facing]
---

# lookAt and up: a top-down camera that rolls sideways

> **The job:** point a camera at a target while keeping the top of its view aligned with a chosen world direction.

## Task

`aimCamera(camera, target, worldUp)` turns the camera toward `target` and returns its orientation. The camera's position is already set. The starter faces the target but leaves the view rolled the wrong way when `worldUp` differs from the default. Fix it without changing the target or world-up vectors.

The orange up arrow should match the green reference arrow on the top-down view.

<div data-scene="topdown"></div>

## Spaces

| Value | Space |
| --- | --- |
| `target` | World-space point |
| `worldUp` | World-space direction for the top of the view |
| Returned orientation | Camera's rotation in world space |

## Your code

Fix `drills/3/rotation/lookat-up/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/rotation/lookat-up/break-fix-1
```

## The check

The acceptance test aims near straight down with more than one requested up direction. It checks both facing and roll, not just whether the target sits in front. Your check must reject default-up aiming.

<details><summary>Hint</summary>

Set `camera.up` before calling `lookAt`. Two orientations can face the same target but put the top of the view in different directions.

</details>

## Where else?

Where else does the chosen up direction matter while aiming?

<details><summary>A few answers</summary>

A billboard, a tilted work surface, or a camera viewing a model from below.

</details>
