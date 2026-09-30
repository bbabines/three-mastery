---
id: 2.math.float-tolerance.implement.1
loop: 2
tier: core
concepts: [math.float-tolerance]
mode: implement
context: math.float-tolerance/degenerate-triangles
lenses: []
misconceptions:
  - math.float-tolerance/equal-math-equal-floats
---

# Tolerance: spot a squashed triangle

> **The job:** find the triangles squashed so flat they have no direction to face, at any size and anywhere in the scene.

## Task

Before working out which way each triangle of an imported model faces, you skip the degenerate ones: triangles squashed flat, with their three corners on one line, so they have no area and no direction to face. Rounding means a degenerate triangle's area usually comes out as a tiny number instead of 0. Write `isDegenerate(a, b, c)`, which returns `true` for a degenerate triangle.

It has to work for models measured in meters and in millimeters (numbers in the thousands), near the origin or far from it. A thin triangle that's really there, even one a hundred times longer than it's wide, isn't degenerate. `new Triangle(a, b, c).getArea()` gives the area. Don't change the corners.

Squash the triangle with the slider, then switch to millimeters. It turns red when `isDegenerate` says it is.

<div data-scene="squash"></div>

## Your code

Write it in `drills/2/math/float-tolerance/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/float-tolerance/implement-1
```

## The check

It passes when corners on a line count as degenerate, including ones rounding leaves with a tiny area and ones in millimeters thousands of units from the origin, while a real triangle a tenth of a millimeter long, a thin one in millimeters, and an ordinary one don't, and the corners come back unchanged.

<details>
<summary>Hint</summary>

No single area works at every size. Compare the area with the triangle's own size, like its longest edge multiplied by itself.

</details>

## Where else?

Where else would a fixed tolerance work at one size and fail at another?

<details>
<summary>A few answers</summary>

Checking whether two positions match in a scene measured in millimeters. Welding a model's duplicate vertices. Deciding whether a camera has stopped moving.

</details>
