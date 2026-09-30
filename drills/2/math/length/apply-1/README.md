---
id: 2.math.length.apply.1
loop: 2
tier: light
concepts: [math.length, math.normalize]
mode: apply
context: math.length/speed-clamp
lenses: []
misconceptions:
  - math.normalize/zero-vector
---

# Length and normalize: fly toward a target

> **The job:** move something toward a target at a steady speed, without flying past it.

## Task

A drone flies straight toward a target at `speed` units per second. Each frame, `stepToward(position, target, speed, delta)` returns the drone's next position, where `delta` is the seconds since the last frame:

- It moves `speed × delta` closer, along the straight line to the target.
- If the target is closer than that, it lands exactly on the target. It never flies past.
- Already on the target, it stays put.

Don't change `position` or `target`.

Move the target with the sliders. The drone should fly at the same speed whether the target is near or far, and stop dead on it.

<div data-scene="drone"></div>

## Your code

Write it in `drills/2/math/length/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/length/apply-1
```

## The check

It passes when each step covers `speed × delta` straight toward the target, near and far targets get the same step, a target closer than one step is landed on exactly, a drone already on the target stays there with no `NaN`, and the inputs come back unchanged.

<details>
<summary>Hint</summary>

The normalize page has the aim-then-move pattern. Measure how far away the target is first, to know whether this step would reach it.

</details>

## Where else?

Where else do you need a direction and a distance from the same move?

<details>
<summary>A few answers</summary>

Capping a character's speed. A camera easing toward a new view at a set rate. Knockback that pushes away from a hit at a fixed strength.

</details>
