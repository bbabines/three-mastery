---
id: 2.math.point-vs-direction.apply.1
loop: 2
tier: core
concepts: [math.point-vs-direction]
mode: apply
context: math.point-vs-direction/w-component
lenses: [space]
misconceptions:
  - math.point-vs-direction/always-position
---

# Point vs direction: riding a turntable

> **The job:** carry a point and a direction along when the thing they belong to slides and turns.

## Task

A product sits on a turntable that slides and turns. Two values belong to it: a hotspot, the point on the product where a label goes, and the beam of the product's built-in lamp, the direction it shines. Both are stored measured from the turntable itself, so they never change. To draw them, you need them in the world. Write:

- `hotspotInWorld(hotspot, matrixWorld)`: where the hotspot is in the world.
- `beamInWorld(beam, matrixWorld)`: which way the beam points in the world, at length 1.

`matrixWorld` is the turntable's saved transform: its move, turn, and resize packed into one value. Two Vector3 methods apply it:

- `v.applyMatrix4(m)` treats `v` as a point: it resizes, turns, and moves it.
- `v.transformDirection(m)` treats `v` as a direction: it resizes and turns it, leaves out the move, and sets its length back to 1.

Both change `v`, and neither of your functions may change what it's handed.

Slide and turn the turntable. The yellow ball should cover the red dot painted on the product, and the yellow arrow should run out of the white lamp.

<div data-scene="turntable"></div>

## Spaces

| Value | Space |
| --- | --- |
| `hotspot`, `beam` | Measured from the turntable itself |
| `matrixWorld` | Takes values measured from the turntable into the world |
| What you return | The world |

## Your code

Write it in `drills/2/math/point-vs-direction/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/point-vs-direction/apply-1
```

## The check

It passes when the hotspot lands where three.js's own `localToWorld` puts it, the beam turns with the turntable and has length 1, sliding the turntable moves the hotspot but not the beam, and the inputs come back unchanged.

<details>
<summary>Hint</summary>

Decide for each value whether it's a place or a move, then pick the method that treats it that way. Clone before you apply it.

</details>

## Where else?

Where else does a value need to follow something that moves, and does it matter whether it's a place or a direction?

<details>
<summary>A few answers</summary>

A raycast hit point and the ray's direction. A velocity on a moving platform. The spot a camera orbits around and the way the camera faces.

</details>
