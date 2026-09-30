---
id: 2.math.reflection.apply.1
loop: 2
tier: light
concepts: [math.reflection, math.triple-product]
mode: apply
context: math.reflection/mirror-camera
lenses: []
misconceptions:
  - math.reflection/n-unnormalized
---

# Reflection and the triple product: a mirror camera

> **The job:** decide which side of a mirror something is on, and find where its reflection appears.

## Task

A showroom mirror is drawn by a second camera placed at the viewer's reflection, behind the mirror. Each frame starts with two questions. Write:

- `inFront(a, b, c, point)`: `true` when `point` is on the mirror's front side. From behind, there's nothing to draw.
- `mirrorImage(a, b, c, point)`: where `point`'s reflection appears: straight across the mirror, as far behind it as `point` is in front.

`a`, `b`, and `c` are three corners of the mirror, listed counter-clockwise as seen from the front. Treat the mirror as carrying on past its edges. Don't change any of the vectors.

Orbit around the mirror, and behind it. The ghosts behind the mirror are placed by `mirrorImage`; the mirror lights up while `inFront` says your camera is in front.

<div data-scene="mirror"></div>

## Your code

Write it in `drills/2/math/reflection/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/reflection/apply-1
```

## The check

It passes when `inFront` agrees with three.js's `Plane` for points on both sides, each image sits straight across the mirror at the same distance on the other side, with the halfway point on the mirror, it works for points behind the mirror too, and the inputs come back unchanged.

<details>
<summary>Hint</summary>

The triple product page shows which side of a triangle a point is on. `reflect` works on directions, so reflect the move from a corner to the point, then add it back. Does the normal you built have length 1?

</details>

## Where else?

Where else would you check which side of a surface something is on before doing more work?

<details>
<summary>A few answers</summary>

Skipping lights behind a surface. Detecting that a fast object passed through a wall between two frames. Spotting a mirrored part whose axes flip handedness.

</details>
