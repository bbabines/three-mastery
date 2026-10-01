---
id: 3.transforms.trs-order.break-and-fix.1
loop: 3
tier: core
concepts: [transforms.trs-order, transforms.compose-decompose]
mode: break-and-fix
context: transforms.trs-order/orbit-point
lenses: [space]
misconceptions: [transforms.trs-order/order-irrelevant]
---

# TRS order: a marker that slips off a scaled part

> **The job:** preview where a point on a scaled and turned part will land.

## Task

`posePreview(position, rotation, scale, localPoint)` builds a part transform and returns the point in world space, plus the scale recovered by `decompose`. The starter moves the point to the wrong place when rotation and scale are both present. Fix the transform order without changing the inputs.

The orange marker should sit on the green marker drawn by a three.js `Object3D` with the same pose.

<div data-scene="pose"></div>

## Spaces

| Value | Space |
| --- | --- |
| `localPoint` | Part-local point |
| `position`, returned point | World-space points |
| `scale` | Part-local scale factors |

## Your code

Fix `drills/3/transforms/trs-order/break-fix-1/drill.ts`, name the cause in `cause.md`, and write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/transforms/trs-order/break-fix-1
```

## The check

The acceptance test uses non-uniform scale and turns about several axes, compares with an `Object3D`, checks the decomposed scale, and checks unchanged inputs. Your check must reject the wrong order.

<details><summary>Hint</summary>

`Matrix4.compose(position, quaternion, scale)` builds three.js's usual local transform. Applying scale after rotation gives a different result.

</details>

## Where else?

Where else can transform order move points unexpectedly?

<details><summary>A few answers</summary>

A product configurator, baking a mesh transform, or positioning a tool on a rotated part.

</details>
