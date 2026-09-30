---
id: 1.rotation.euler-order.read-the-code.1
loop: 1
tier: core
concepts: [rotation.euler-order]
mode: read-the-code
context: rotation.euler-order/ui-sliders
lenses: []
misconceptions:
  - rotation.euler-order/order-irrelevant
  - rotation.euler-order/y-is-yaw
---

# Euler angles and order

> **In short:** `rotation` is three turns, one around each axis, done one after another, so the order they run in changes the result.
>
> **Used for:** Rotation sliders in an editor, reading imported rotations, first-person mouse-look, and a robot arm with one motor per axis.

## A · The basics

### Three angles, one per axis

`rotation` holds three angles in radians: `rotation.x` turns the object around X, `.y` around Y, and `.z` around Z. Angles like these are called **Euler angles** (say "oiler").

```js
ship.rotation.set(0, MathUtils.degToRad(90), 0); // a quarter turn around Y
```

For something whose nose is its +Z and whose top is its +Y, the three turns have names. **Yaw** swings the nose side to side, **pitch** tips it up or down, and **roll** tilts it around the nose.

### The order changes the result

Three turns can't happen at once, so three.js does them in the sequence `rotation.order` names, `'XYZ'` unless you change it. Each turn goes around the object's own axis, wherever the turns before it left it. So the same three angles in another order give a different turn.

**Analogy: a book on a table.** Stand it on its spine, then spin it a quarter turn. Spin it first and then stand it up, and the cover faces a different way.

Step through the three turns, then switch the order and step through again. The faint line is the axis the latest turn went around.

<div data-scene="steps"></div>

<details>
<summary>The math, if you're curious</summary>

Turns around the object's own, moving axes are called **intrinsic**. As matrices, three.js's `'XYZ'` is R = Rx · Ry · Rz.

</details>

### rotation.y isn't always yaw

With `'XYZ'`, the X turn comes first. Once a camera is tipped to look down, `rotation.y` turns it around its own tipped Y, and the horizon tilts: a roll nobody asked for. The order `'YXZ'` does yaw first, around the upright axis, so the horizon stays level.

The picture in the corner is what the gray camera sees. With `'XYZ'`, drag yaw and watch the horizon tilt. With `'YXZ'`, it stays level.

<div data-scene="yawPitch"></div>

## B · Working knowledge

### Rotation sliders

Sliders give degrees, so convert each one:

```js
part.rotation.x = MathUtils.degToRad(xSlider.value);
part.rotation.y = MathUtils.degToRad(ySlider.value);
part.rotation.z = MathUtils.degToRad(zSlider.value);
```

With `'XYZ'`, the x slider always turns the part around its parent's X, but the y and z sliders turn it around its own axes, as the turns before them left them. That's why one slider seems to change what it does as you move the others.

### A yaw/pitch camera

```js
camera.rotation.order = 'YXZ'; // yaw first, around the upright axis
camera.rotation.y = yaw;       // from the mouse's left-right
camera.rotation.x = pitch;     // from the mouse's up-down
```

`PointerLockControls`, three.js's first-person mouse-look, uses `'YXZ'` for the same reason.

### Changing the order

Setting `rotation.order` keeps the three numbers and reads them in the new order, so the object jumps. `reorder` keeps the turn and changes the numbers instead:

```js
cam.rotation.order = 'YXZ';  // same numbers, new turn: the camera jumps
cam.rotation.reorder('YXZ'); // same turn, new numbers
```

Simplest of all: set the order once, before any angles.

### Reading imported rotations

A glTF file stores each turn as a quaternion, and three.js works out `rotation` from it in `'XYZ'`. A part turned 120° around Y can read back as (−180°, 60°, −180°): the same turn, written another way. Other programs may mean something else by "XYZ", so test one axis at a time.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
