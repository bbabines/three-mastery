---
id: 1.rotation.quaternions.read-the-code.1
loop: 1
tier: core
concepts: [rotation.quaternions]
mode: read-the-code
context: rotation.quaternions/local-world-deltas
lenses: []
misconceptions:
  - rotation.quaternions/components-angles
  - rotation.quaternions/order-free
---

# Quaternions

> **In short:** Four numbers that hold a whole turn at once, which three.js can combine and blend without ever getting stuck.
>
> **Used for:** Steering a car, turning parts in an editor, standing a pin on a slope, and turns loaded from glTF files.

## A · The basics

### Four numbers for one turn

Every object has a `quaternion` that stays in sync with `rotation`: change one and the other follows. A **quaternion** is four numbers, `x`, `y`, `z`, and `w`, that hold an axis and an angle together. `x`, `y`, and `z` point along the axis, and `w` says how far round: 1 is no turn and 0 is a half turn. Together they always have length 1.

None of the four is an angle: a quarter turn around Y is (0, 0.707, 0, 0.707). So you build a quaternion from something readable instead of typing the numbers:

```js
ship.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(90));
```

A quaternion holds the whole turn at once, not three turns in a row, so it has no stuck spot like gimbal lock.

**Analogy: a barcode.** You can't read the price off the stripes, but the scanner reads them perfectly. You print a barcode from the product details; you never draw one by hand.

Drag the angle all the way round and watch the four numbers. At 360° the ship is back where it started, but `w` reads −1.

<div data-scene="inside"></div>

<details>
<summary>The math, if you're curious</summary>

For an axis **a** of length 1 and an angle θ, the quaternion is (a × sin(θ/2), cos(θ/2)). That **half angle** is why a full turn gives `w` = −1.

</details>

### Combining two turns

To add one turn on top of another, multiply, and the order decides whose axes the new turn uses. `q.multiply(d)` applies `d` around the object's own axes, the way `rotateX` does. `q.premultiply(d)` applies it around the parent's axes, the way `rotateOnWorldAxis` does.

The ship has already turned a quarter turn around Y, so its nose points along +X. Try both buttons: `multiply` tips the nose up, and `premultiply` rolls the ship around it.

<div data-scene="combine"></div>

## B · Working knowledge

### Building one

```js
q.setFromAxisAngle(axis, angle);        // an axis of length 1, and radians
q.setFromEuler(euler);                  // three angles and an order
q.setFromUnitVectors(up, groundNormal); // swing one direction onto another
```

`setFromUnitVectors` gives the smallest turn that swings a pin's up onto a slope's normal. Its directions, like the axis, must have length 1; three.js doesn't check. Setting `x`, `y`, `z`, or `w` by hand breaks the length-1 rule too, and the object turns oddly and distorts, with no error.

### Adding a turn every frame

A small step around the car's own up, added every frame, steers it:

```js
step.setFromAxisAngle(yAxis, speed * delta); // step: one Quaternion, made once
car.quaternion.multiply(step);               // the same as car.rotateY(speed * delta)
```

### Comparing and undoing

q and −q, with all four signs flipped, are the same turn, so `equals` can say `false` for two objects facing the same way. Compare the turns instead. `invert` changes the quaternion it's called on, so clone first.

```js
const sameWay = a.quaternion.angleTo(b.quaternion) < 1e-4;
const back = q.clone().invert(); // the same turn in reverse
```

### Which space is it in?

| Value | Space |
| --- | --- |
| `object.quaternion` | Measured from its parent |
| `object.getWorldQuaternion(q)` | The world |
| `d` in `q.multiply(d)` | Around the object's own axes |
| `d` in `q.premultiply(d)` | Around the parent's axes |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
