---
id: 2.rotation.lookat-up.implement.1
loop: 2
tier: core
concepts: [rotation.lookat-up]
mode: implement
context: rotation.lookat-up/billboards
lenses: []
misconceptions: [rotation.lookat-up/same-facing]
---

# lookAt and up: aim a part

> **The job:** Aim an ordinary part at a target without losing its chosen up.

## Task

A regular Object3D points its own +Z at a `lookAt` target. `aimWithUp(from, target, up)` returns the orientation that aims +Z from `from` at `target`, keeping +Y as close as possible to `up`. Leave the input vectors unchanged.

The blue aim arrow should match yellow, while green shows the part’s up direction.

<div data-scene="demo"></div>

## Your code

Write it in `drills/2/rotation/lookat-up/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/rotation/lookat-up/implement-1

## The check

The check measures both the part’s +Z aim and its +Y roll, including a tilted up direction. It checks the positions and up vector for mutation.

<details><summary>Hint</summary>

Use an ordinary Object3D at `from`. Set its `up` before aiming; a camera has the opposite forward-axis convention.

</details>

## Where else?

Where else does a part need an aim and an up direction?

<details><summary>A few answers</summary>

A turret barrel. A spotlight mount. A robot gripper.

</details>
