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

> **In short:** `object.rotation` stores a turn as three angles, one around each axis, done one after another in a set order, so the same three angles in a different order give a different turn.
>
> **Used for:** Rotation sliders and number boxes in an editor or a product configurator, reading the rotation of a model someone else exported, a first-person camera that looks left-right and up-down, and a turret or robot arm with one motor per axis.

## A · The basics

### Three angles, one per axis

The Object3D tour showed `rotation` next to `position` and `scale`. It holds three angles, in radians:

- `rotation.x` turns the object around the X axis.
- `rotation.y` turns it around the Y axis.
- `rotation.z` turns it around the Z axis.

```js
ship.rotation.set(0, MathUtils.degToRad(90), 0); // a quarter turn around Y
```

Three angles like these are called **Euler angles** (say "oiler", after the mathematician Leonhard Euler), and `rotation` is a three.js `Euler`. Which way counts as positive follows the right-hand rule from the cross product page: point your right thumb along the axis, and your fingers curl the positive way.

Three words come up all the time. For something whose nose points along its +Z and whose top is its +Y, like the yellow ship below:

- **Yaw** swings the nose left or right, around the up axis, like shaking your head.
- **Pitch** tips the nose up or down, around the side-to-side axis, like nodding.
- **Roll** tilts it around the nose, like a plane banking into a turn.

### The three turns happen one after another

Three turns can't happen at once, so three.js does them in a sequence. `rotation.order` names the sequence, and it starts as `'XYZ'`:

1. Turn around the object's own X axis.
2. Then turn around its own Y axis, wherever the first turn left it.
3. Then turn around its own Z axis, wherever the first two left it.

Each turn moves the axes the next turn uses, so the order changes the result. Keep the same three angles, change the order, and the object ends up facing somewhere else.

**Analogy: a book on a table.** Stand it up on its spine, then spin it a quarter turn. Now lay it flat again, spin it first, then stand it up. Same two moves in a different order, and the cover faces a different way.

Step through the three turns. The arrows are the ship's own axes, and the faint line is the axis the latest turn went around. In step 2, the turn goes around the green arrow where step 1 left it, not around the world's upright Y. Then switch the order and step through again: same three angles, a different ship.

<div data-scene="steps"></div>

<details>
<summary>The math, if you're curious</summary>

Turning around the object's own, moving axes is called an **intrinsic** rotation. Turning around fixed axes that never move is **extrinsic**. three.js's 'XYZ' is intrinsic X, then Y, then Z, which is the same turn as extrinsic Z, then Y, then X: the fixed axes, in reverse. As matrices, 'XYZ' is **R = Rx · Ry · Rz**. Angles around three different axes like these are also called **Tait–Bryan angles**. When another tool or a paper says "XYZ", check which kind it means.

</details>

### rotation.y isn't always yaw

`rotation.y` only yaws around the upright axis when the Y turn comes first, or when the turns before it are zero. With the default 'XYZ', the X turn comes first. So once a camera is tipped to look down, its Y turn goes around its own tipped Y. The view turns, but the horizon tilts too: a roll nobody asked for, even though `rotation.z` is 0.

For something you steer with yaw and pitch, like a first-person camera, use the order `'YXZ'`: yaw first, around the upright axis, then pitch around the camera's own side-to-side axis. The horizon stays level.

The picture in the corner is what the gray camera sees, with the far edge of the ground as its horizon. With `'XYZ'`, look down and then yaw: the horizon tilts in the picture, though `rotation.z` is still 0. With `'YXZ'` it stays level whatever you do.

<div data-scene="yawPitch"></div>

## B · Working knowledge

### Setting a rotation in degrees

```js
part.rotation.set(0, MathUtils.degToRad(90), 0);  // radians in, so convert degrees
part.rotation.y += MathUtils.degToRad(15);        // 15° more around Y
console.log(MathUtils.radToDeg(part.rotation.y)); // back to degrees, for a label
```

`part.rotation.y = 90` turns 90 radians: more than 14 full turns, landing about 117° round. No error, just an odd angle.

### UI rotation sliders

Three sliders wired to `rotation.x`, `.y`, and `.z` behave like the steps above. With `'XYZ'`:

- The X slider always turns the part around its parent's X, which never moves.
- The Y slider turns it around its own Y, as the X turn left it.
- The Z slider always turns it around its own Z, wherever that points.

That's why a slider can seem to change what it does as you move the others. When a control should always turn around the world's up, whatever else is set, turn with `rotateOnWorldAxis` instead; the axis-angle page covers it.

### A yaw/pitch camera

```js
camera.rotation.order = 'YXZ'; // yaw first, around the upright axis, then pitch
camera.rotation.y = yaw;       // left and right, from the mouse
camera.rotation.x = pitch;     // up and down, from the mouse
```

three.js's own `PointerLockControls`, the first-person mouse-look addon, uses `'YXZ'` for the same reason. It also stops the pitch at straight up and straight down, so the camera can't flip over the top; the gimbal lock page covers what happens there.

### Changing the order

Setting `rotation.order` keeps the three numbers and reads them in the new order, so the object jumps to a different turn. To keep the turn and get new numbers for it, use `reorder`:

```js
cam.rotation.order = 'YXZ';  // same numbers, new meaning: the camera jumps
cam.rotation.reorder('YXZ'); // same turn, new numbers
```

The simplest rule: set the order once, before you set any angles.

### Reading imported rotations

glTF files store each part's turn as a quaternion, not as angles, so `GLTFLoader` sets `quaternion` and three.js works out `rotation` from it, in `'XYZ'`. A part the designer turned 120° around up can read back as (−180°, 60°, −180°): the same turn, written another way. The converting representations page covers why.

Other programs don't all mean the same thing by "XYZ", either. In some, the letters name turns around fixed axes, which three.js would call `'ZYX'`. When angles copied from another program come out wrong, test one axis at a time.

### Which space is it in?

| Value | Space |
| --- | --- |
| `rotation.x`, `.y`, `.z` | Measured from the parent |
| The axis the first turn goes around (X, for `'XYZ'`) | The parent's axis, which never moves |
| The axis each later turn goes around | The object's own axis, as the turns before it left it |
| The same turn seen from the parent, for `'XYZ'` | The parent's Z, then Y, then X |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
