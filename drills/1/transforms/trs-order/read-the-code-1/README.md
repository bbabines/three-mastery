---
id: 1.transforms.trs-order.read-the-code.1
loop: 1
tier: core
concepts: [transforms.trs-order]
mode: read-the-code
context: transforms.trs-order/orbit-point
lenses: []
misconceptions:
  - transforms.trs-order/order-irrelevant
  - transforms.trs-order/parent-shear
---

# TRS order

> **In short:** Every object resizes, then turns, then moves, always in that order, but when you combine changes yourself, the order you combine them in decides where things end up.
>
> **Used for:** Orbiting a camera or a moon around a point versus spinning a wheel in place, placing hundreds of copies of a tree each at its own spot and angle, stretching a part that's already tilted, and adding a small extra move on top of an object's transform, like a camera shake.

## A · The basics

### Three steps, always in the same order

An object's `position`, `rotation`, and `scale` hold a move, a turn, and a resize. As the matrix vs matrixWorld page showed, three.js packs all three into the object's `matrix`, one saved transform it can apply to any point in one step. When three.js builds it, it always uses the same order, starting from the shape as it was made:

1. **Resize** it, while it still sits at its origin facing its default way.
2. **Turn** it around its origin.
3. **Move** it to its `position`.

Steps 1 and 2 happen around the object's origin unless its `pivot` is set; the pivots and offset groups page covers that.

The name comes from the three steps: **T**ranslate (move), **R**otate (turn), **S**cale (resize). Setting the values in code only stores numbers, and three.js combines them later, always in this order. So which line comes first in your code changes nothing:

```js
crate.position.set(3, 0, 0);
crate.rotation.y = Math.PI / 2;
// Swapping these two lines gives exactly the same result.
```

Because the resize comes before the turn, `scale` always stretches along the object's own length, width, and height, even after it's been turned.

**Analogy: a framing order.** The form has boxes for the size, the tilt, and the spot on the wall. You can fill in the boxes in any order. The framer always cuts it to size first, then tilts it, then hangs it.

### Combine the steps yourself, and order matters

Sometimes you combine changes yourself instead of letting three.js do it: to swing something around a point, to place copies of a shape, or to add one more change on top of an object's transform. Then the order is yours, and it changes the result. Turn then move is not the same as move then turn:

- **Turn, then move:** the object turns where it stands, then goes out to its spot. It spins in place.
- **Move, then turn:** it goes out to its spot first. The turn then happens around the point it left, its parent's origin, so it swings around that point like a moon around a planet.

Both end up facing the same new way. Only where they end up is different.

**Analogy: a merry-go-round.** Turn a horse on its pole and it faces a new way but stays in its place on the ride. Turn the whole ride and the horse travels around the center.

Pick each order, then drag the turn. With turn, then move, the cone spins where it stands. With move, then turn, it travels around the circle, swinging around its parent's origin. The code in the readout is explained in the working knowledge section.

<div data-scene="swing"></div>

<details>
<summary>The math, if you're curious</summary>

For an object with no `pivot`, three.js builds its matrix as **T × R × S**, translate × rotate × scale. It reads right to left: S, the one next to the shape, happens first. Swapping two of them usually changes the result, which is why matrix multiplication is called **non-commutative**. `a.multiply(b)` puts `b` on the right, so `b` happens first, measured from the object itself. `a.premultiply(b)` puts `b` on the left, so it happens last, measured from the parent.

</details>

## B · Working knowledge

### Spinning in place versus orbiting a point

When you combine two matrices yourself, the method you pick decides whether the new change is measured from the object itself or from its parent:

```js
m.multiply(change);    // measured from the object itself: a turn spins it in place
m.premultiply(change); // measured from its parent: a turn swings it around the parent's origin
```

`object.applyMatrix4(change)` premultiplies, so the change is measured from the parent. It also writes the result straight back into `position`, `rotation`, and `scale`. That makes it a quick way to orbit something around its parent's origin:

```js
const step = new Matrix4().makeRotationY(speed * delta); // delta: seconds since the last frame
moon.applyMatrix4(step); // swings a little further around its parent's origin each frame
```

You also combine matrices yourself for an `InstancedMesh`, which draws one shape many times and takes a matrix you build for each copy. Start from the copy's spot and `multiply` its turn, so each copy turns where it stands. `result.multiplyMatrices(a, b)` gives the same as `a.clone().multiply(b)`.

Turning has the same pair: `object.rotateY(angle)` turns measured from the object itself and `object.rotateOnWorldAxis(axis, angle)` turns around a world axis. The rotation domain covers them.

### Stretching a tilted part

Since resizing comes first, a part's own `scale` stretches it along its own length, and a rectangle stays a rectangle. Stretch its parent instead, and the stretch is measured from the parent: it runs along the parent's X, which cuts across the tilted part at an angle. The corners stop being square. That skew is called **shear**.

<div data-scene="stretch"></div>

Nothing warns you. The part's own `scale` still says 1, and none of its `position`, `rotation`, or `scale` values can describe the skew. It happens when both are true:

- A parent is scaled **non-uniformly**: not the same on all three axes, like (1, 2, 1). `parent.scale.setScalar(2)` is uniform and never skews anything.
- A child is turned at an angle to that stretch. A child that isn't turned just gets stretched.

The fix: put the stretch on the part itself, not on a group above it, and keep groups that hold turned parts at a uniform scale. The compose and decompose page shows what's lost when you try to read a skewed transform back out.

### Which space is it in?

| Value | Space |
| --- | --- |
| `object.position` | Measured from its parent |
| `object.rotation` | Measured from its parent; it turns around the object's own origin, or its `pivot` if one is set |
| `object.scale` | Along the object's own axes, so it follows the object's turn |
| A change added with `m.multiply(change)` | Measured from the object itself |
| A change added with `m.premultiply(change)` | Measured from its parent |
| A change added with `object.applyMatrix4(change)` | Measured from its parent |
| A parent's `scale`, as it reaches a child | Along the parent's axes, not the child's |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
