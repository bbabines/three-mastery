---
id: 2.math.angle-between.apply.1
loop: 2
tier: core
concepts: [math.angle-between]
mode: apply
context: math.angle-between/compass-heading
lenses: []
misconceptions:
  - math.angle-between/angleto-direction
---

# Signed angle: a compass heading

> **The job:** turn the way the camera faces into a compass heading a person can read.

## Task

A minimap shows which way a drone's camera faces as a compass heading. North is −Z and east is +X. Write `heading(direction)`: the direction's heading in degrees, clockwise from north as seen from above, from 0 up to but not including 360. North is 0, east 90, south 180, and west 270.

Ignore how far `direction` tilts up or down; it's never straight up or down. It can be any length. Don't change it.

Turn and tilt the drone. The yellow needle points the way `heading` says, and it should line up with the grey arrow, the way the drone faces seen from above.

<div data-scene="compass"></div>

## Your code

Write it in `drills/2/math/angle-between/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/angle-between/apply-1
```

## The check

It passes when directions built from known headings all the way round come back as those headings, tilted up or down and at any length, every answer is at least 0 and under 360, and the direction comes back unchanged.

<details>
<summary>Hint</summary>

Measure the signed angle from north to the direction around the up axis, then turn it into degrees. Which way is clockwise when you look down from above?

</details>

## Where else?

Where else would you show an angle to a person, and what has to happen to it first?

<details>
<summary>A few answers</summary>

A rotation field in a product editor. The angle a door stands open. A sun position picker for lighting a scene.

</details>
