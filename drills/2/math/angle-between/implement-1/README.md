---
id: 2.math.angle-between.implement.1
loop: 2
tier: core
concepts: [math.angle-between]
mode: implement
context: math.angle-between/dial
lenses: []
misconceptions:
  - math.angle-between/angleto-direction
---

# Signed angle: a dial you drag

> **The job:** turn a drag around a knob into how far, and which way, the knob turns.

## Task

A control panel has a knob you turn by dragging around it. Write `dialTurn(center, from, to, axis)`: how far the drag has turned the knob, as a signed angle in radians from −π to π.

- `center` is the middle of the knob, and `axis` is the way its face points, toward you, at any length.
- `from` is where the drag started and `to` is where the pointer is now, both on the knob's face.

Positive means counter-clockwise as you look at the knob's face. A drag that hasn't moved is 0. Don't change any of the vectors.

Drag the pointer around the knob with the slider. The knob's notch should follow the pointer both ways.

<div data-scene="dial"></div>

## Your code

Write it in `drills/2/math/angle-between/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/angle-between/implement-1
```

## The check

It passes when drags turned by known angles, both ways and up to nearly half a turn, come back as those angles, on a knob facing you and on one facing a slanted way, a drag that hasn't moved gives 0 and not `NaN`, and the inputs come back unchanged.

<details>
<summary>Hint</summary>

The angle page has the signed angle recipe. Here, "up" is the knob's axis, and the two directions start at the knob's center.

</details>

## Where else?

Where else do you need to know which way to turn, not just how far?

<details>
<summary>A few answers</summary>

A turret turning toward a target. A compass heading. Rotating a part with a circular gizmo handle.

</details>
