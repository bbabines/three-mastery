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

> **In short:** A quaternion is three.js's way of storing a turn: four numbers that hold an axis and an angle together, which three.js can combine, compare, and blend without ever getting stuck.
>
> **Used for:** Adding a small turn every frame to a steering car or a spinning propeller, turning a part around its own axes or the world's in an editor, standing an object up on a sloped surface, and taking in turns from glTF files and most physics engines, which hand them over as quaternions.

## A · The basics

### Four numbers for one turn

Earlier pages called a quaternion "three.js's way of storing a turn". Every object has one, `object.quaternion`, and the Object3D tour showed that it stays in sync with `rotation`: change either one and the other follows. Here's what's inside.

A **quaternion** is four numbers, `x`, `y`, `z`, and `w`. They hold the axis-angle pair from the axis-angle page, packed together:

- `x`, `y`, and `z` point along the axis of the turn, scaled by how far the turn goes: tiny for a small turn, full length for a half turn.
- `w` says how far round it goes: 1 is no turn at all, 0 is a half turn (180°), and −1 is a full turn, back where it started.
- Together they always have a length of 1, like a unit vector. A quaternion like this is called a **unit quaternion**, and three.js expects every quaternion to be one.

None of the four numbers is an angle. A quarter turn around Y is (0, 0.707, 0, 0.707): 0.707 isn't 90°, or 45°, or π/2 radians. You never read the turn off the numbers or type them in. You build a quaternion from something readable and let three.js do the rest:

```js
const q = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(90));
ship.quaternion.copy(q); // a quarter turn around Y
```

**Analogy: a barcode.** You can't read a price off the stripes, but the scanner reads them instantly and never makes a mistake. You never draw a barcode by hand either; you print it from the product details. A quaternion is a turn's barcode: made from something readable, read perfectly by three.js.

Why bother with four numbers when three angles would do? Because a quaternion stores the whole turn at once rather than three turns in a row, it has no stuck spot like the one on the gimbal lock page. Combining two turns is one multiply, and blending between two turns is smooth, which the slerp page covers.

Drag the angle all the way round and watch the four numbers. At 360° the ship is back where it started, but `w` reads −1, not 1.

<div data-scene="inside"></div>

<details>
<summary>The math, if you're curious</summary>

For an axis **a** (unit length) and an angle θ, the quaternion is **(a × sin(θ/2), cos(θ/2))**: the axis scaled by the sine of half the angle, and `w` is the cosine of half the angle. The **half angle** is why a full turn gives `w` = −1: half of 360° is 180°, and cos 180° is −1. It's also why q and −q are the same turn, which mathematicians call a **double cover**: every turn has exactly two quaternions.

</details>

### Combining two turns: order matters

To add one turn on top of another, multiply the quaternions. Like the matrices on the TRS order page, the order decides whose axes the new turn uses:

- `q.multiply(d)` applies `d` around the object's **own** axes, the ones that turn with it. `rotateOnAxis` and `rotateX`, `rotateY`, `rotateZ` from the axis-angle page do exactly this.
- `q.premultiply(d)` applies `d` around the **parent's** axes, which are the world's when the parent isn't turned. `rotateOnWorldAxis` does exactly this.

The ship has already turned a quarter turn left, so its nose points along +X. Both buttons add the same turn `tip`, a turn around X. With `multiply`, X means the ship's own side-to-side axis, so its nose tips up. With `premultiply`, X means the parent's X, which now runs along the ship's nose, so the ship rolls instead.

<div data-scene="combine"></div>

## B · Working knowledge

### Building a quaternion from something readable

```js
q.setFromAxisAngle(axis, angle);   // a unit-length axis and radians, from the axis-angle page
q.setFromEuler(euler);             // from three angles and an order
q.setFromUnitVectors(from, to);    // the turn that swings one direction onto another
q.setFromRotationMatrix(m);        // from a matrix that holds only a turn (the rotation basis page)
q.identity();                      // no turn: (0, 0, 0, 1)
q.copy(other.quaternion);          // the same turn as another object
```

Setting `x`, `y`, `z`, or `w` by hand almost always breaks the length-1 rule. The object then turns by some odd amount and its shape is slightly distorted, with no error.

### Standing something up on a slope

`setFromUnitVectors(from, to)` gives the smallest turn that swings the direction `from` onto the direction `to`. Standing a pin upright on sloped ground, so its own up matches the ground's normal:

```js
const up = new Vector3(0, 1, 0);                     // the pin's own up, as it was modeled
pin.quaternion.setFromUnitVectors(up, groundNormal); // groundNormal: unit length, in the pin's parent's space
```

Both directions must be unit length; three.js doesn't check, and an unnormalized one gives the wrong lean with no error.

### Adding a turn every frame

```js
const yAxis = new Vector3(0, 1, 0);
const step = new Quaternion();
// in the frame loop, where delta is seconds since the last frame:
step.setFromAxisAngle(yAxis, speed * delta);
car.quaternion.multiply(step); // steer around the car's own up: the same as car.rotateY(speed * delta)
```

Reuse one `step` rather than making a new Quaternion every frame. Rounding drift is tiny: after a million multiplies the length is still 1 to ten decimal places, so there's rarely any need to call `normalize()` yourself.

### Undoing a turn, and turns in the world

```js
const back = q.clone().invert();        // the same turn in reverse
wheel.getWorldQuaternion(worldTurn);    // the turn in the world, with every parent's turn included
```

`invert` changes the quaternion you call it on, like `sub` does, so clone first. `object.quaternion` is measured from the parent, like `rotation`; the compose and decompose page showed how `getWorldQuaternion` works it out.

### Comparing two turns

Every turn has two quaternions, q and −q, with all four signs flipped. So two objects facing exactly the same way can hold different numbers, and `a.equals(b)` says `false`. Compare the turns instead:

```js
const sameWay = a.quaternion.angleTo(b.quaternion) < 1e-4; // angleTo treats q and −q as the same
```

### Which space is it in?

| Value | Space |
| --- | --- |
| `object.quaternion`, like `rotation` | Measured from its parent |
| What `object.getWorldQuaternion(q)` gives back | The world |
| The turn `d` in `q.multiply(d)` | Around the object's own axes |
| The turn `d` in `q.premultiply(d)` | Around the parent's axes: the world's only when no parent is turned |
| The two directions passed to `setFromUnitVectors` | Any space, as long as both are in the same one |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
