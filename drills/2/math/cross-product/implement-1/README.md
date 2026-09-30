---
id: 2.math.cross-product.implement.1
loop: 2
tier: core
concepts: [math.cross-product]
mode: implement
context: math.cross-product/orthonormal-basis
lenses: []
misconceptions:
  - math.cross-product/unit-result
  - math.cross-product/order-free
  - math.cross-product/parallel-zero
---

# Cross product: a right and an up for any forward

> **The job:** from the way something faces, build the two other directions that go with it: its right and its up.

## Task

Camera controls, gizmos, and anything that moves "to the right" of where it faces need two more directions to go with a forward direction. Write `axesFor(forward, worldUp)`, which returns `{ right, up }`:

- `right` is at right angles to `forward` and `worldUp`, on your right when you face along `forward` with `worldUp` over your head.
- `up` is at right angles to `forward` and `right`, on the same side as `worldUp`.

Both have length 1, though `forward` and `worldUp` can be any length. When `forward` points straight along `worldUp`, up or down, there's no single right. Use (0, 0, 1) in place of `worldUp` then, so you still get two usable directions. Don't change `forward` or `worldUp`.

Turn and tilt the forward arrow. Push **tilt** all the way to 90 to look straight up.

<div data-scene="axes"></div>

## Your code

Write it in `drills/2/math/cross-product/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/cross-product/implement-1
```

## The check

It passes when `right` and `up` match the axes three.js builds for `lookAt` from the same forward and up, both have length 1 whatever the inputs' lengths, looking straight up or down still gives two length-1 directions at right angles, and the inputs come back unchanged.

<details>
<summary>Hint</summary>

Cross the right two directions in the right order, then normalize: the cross product page covers all three. Check the cross product's length before you trust it.

</details>

## Where else?

Where else would you build a direction at right angles to two others?

<details>
<summary>A few answers</summary>

The way a triangle faces. Moving a camera sideways when you press D. Tilting a part to sit flat on a sloped surface.

</details>
