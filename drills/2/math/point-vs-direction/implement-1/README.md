---
id: 2.math.point-vs-direction.implement.1
loop: 2
tier: core
concepts: [math.point-vs-direction]
mode: implement
context: math.point-vs-direction/midpoint
lenses: []
misconceptions: []
---

# Point vs direction: a dimension line

> **The job:** work out the two values a dimension line needs: the move from one part to another, for its arrow, and the place halfway between them, for its label.

## Task

A configurator measures the gap between two parts with a dimension line: an arrow from part A to part B, and a label halfway along. Write both values in `drill.ts`:

- `moveBetween(a, b)` returns the move from `a` to `b`. Add it to `a` and you land on `b`.
- `midpoint(a, b)` returns the place halfway between `a` and `b`.

`a` and `b` are the parts' positions. Neither function may change them.

Drag the sliders. **shift both** moves both parts together: the label should follow them, and the move shouldn't change.

<div data-scene="dimension"></div>

## Your code

Write it in `drills/2/math/point-vs-direction/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/point-vs-direction/implement-1
```

## The check

It passes when adding the move to `a` lands on `b`, the midpoint is halfway, shifting both parts together shifts the midpoint but not the move, and `a` and `b` come back unchanged.

<details>
<summary>Hint</summary>

The point vs direction page has both lines. `sub` and `lerp` change the vector they're called on, so clone first.

</details>

## Where else?

Where else does it matter whether three numbers are a place or a move?

<details>
<summary>A few answers</summary>

A velocity added to a position each frame. `lookAt` wanting a place while `ArrowHelper` wants a direction. Moving an object by a matrix, which shifts a place but not a direction.

</details>
