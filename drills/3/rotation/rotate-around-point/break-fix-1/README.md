---
id: 3.rotation.rotate-around-point.break-and-fix.1
loop: 3
tier: light
concepts: [rotation.axis-angle, rotation.rotate-around-point]
mode: break-and-fix
context: rotation.rotate-around-point/hinge
lenses: [space]
misconceptions: [rotation.rotate-around-point/origin-rotation]
---

# Axis-angle: a hinge that circles the room

> **The job:** turn a point around a hinge anywhere in the world.

## Task

`turnAtHinge(point, hinge, axis, angle)` rotates a world-space point around a world-space hinge and axis. The axis can have any nonzero length; the angle is in radians. The starter turns around the world origin instead, so the point drifts off the hinge. Fix it without changing the inputs.

The orange point should stay on the green reference point as the hinge turns.

<div data-scene="hinge"></div>

## Spaces

| Value | Space |
| --- | --- |
| `point`, `hinge`, returned point | World-space points |
| `axis` | World-space direction |

## Your code

Fix `drills/3/rotation/rotate-around-point/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/rotation/rotate-around-point/break-fix-1
```

## The check

The acceptance test moves the hinge away from the origin, tries a tilted non-unit axis, and checks unchanged inputs. Your check must reject origin-based rotation.

<details><summary>Hint</summary>

Move the hinge to the origin, rotate the offset with `applyAxisAngle`, then move it back.

</details>

## Where else?

Where else does a rotation center differ from the world origin?

<details><summary>A few answers</summary>

A door, an orbit camera target, or a product turntable.

</details>
