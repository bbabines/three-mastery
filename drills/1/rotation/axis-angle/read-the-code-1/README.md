---
id: 1.rotation.axis-angle.read-the-code.1
loop: 1
tier: light
concepts: [rotation.axis-angle]
mode: read-the-code
context: rotation.axis-angle/on-axis-vs-world
lenses: []
misconceptions:
  - rotation.axis-angle/on-axis-world
---

# Axis-angle

> **In short:** Any turn, however it was made, is one turn by some angle around one line, its axis, and three.js takes that pair as a unit-length Vector3 and an angle in radians.
>
> **Used for:** Doors, lids, and laptop screens swinging on a hinge; a globe, fan, or wind turbine spinning around a tilted shaft; the rotate handles in an editor, which turn a part around its own axis or the world's; and wheels spinning on their axles as a car drives.

## A · The basics

### One line and one angle

The Euler angles and order page described a turn as three turns in a row. **Axis-angle** describes it as a single turn: pick a line through the object's origin, the **axis**, and turn around it by an **angle**. Every turn can be written this way, however many steps it took to make.

- The axis is a direction, and three.js expects it to be unit length, as on the normalize page.
- The angle is in radians. Which way is positive follows the right-hand rule: thumb along the axis, and your fingers curl the positive way.

```js
const shaft = new Vector3(0.3, 1, 0).normalize(); // a tilted line
globe.setRotationFromAxisAngle(shaft, angle);     // the whole turn: angle around the shaft
```

**Analogy: a marshmallow on a stick.** The stick is the axis, and how far you twist it is the angle. Hold the stick at a slant and the marshmallow still turns around the stick, not around straight up.

### Whose axis?

Two methods add a turn around an axis, and they read the same axis differently:

- `object.rotateOnAxis(axis, angle)` measures the axis from the object itself. (0, 1, 0) means the object's own up, which leans when the object leans. `rotateX`, `rotateY`, and `rotateZ` are shortcuts for it.
- `object.rotateOnWorldAxis(axis, angle)` measures the axis from the object's parent. (0, 1, 0) means the parent's up, which is the world's up when the parent isn't turned.

The fan leans 30°, and both buttons spin it around (0, 1, 0) every frame. With `rotateOnAxis` it spins around its own leaning Y, like a tilted desk fan. With `rotateOnWorldAxis` it spins around the world's upright Y, so its lean swings around in a circle.

<div data-scene="whoseAxis"></div>

## B · Working knowledge

### Swinging a hinge

`setRotationFromAxisAngle` sets the whole turn, replacing whatever turn the object had. That suits anything that swings from a closed position: set the angle each time, don't add to it.

```js
const hingeLine = new Vector3(1, 0, 0);                             // along the lid's back edge
lid.setRotationFromAxisAngle(hingeLine, MathUtils.degToRad(-open)); // open: 0 to 110
```

It turns around a line through the lid's origin. For the lid to swing on its back edge, the origin has to sit on that edge, or the lid needs a pivot group or a `pivot`; the pivots and offset groups page covers both.

### Spinning around a tilted axis every frame

```js
const shaft = new Vector3(0.3, 1, 0).normalize(); // measured from the planet itself
planet.rotateOnAxis(shaft, speed * delta);         // delta: seconds since the last frame
```

`rotateOnAxis` adds a little more turn each call, so the planet keeps spinning around its own tilted shaft. The quaternions page explains how the small turns add up.

### Turning a direction, or building a turn

The same pair turns up across three.js:

```js
const facing = new Vector3(0, 0, 1).applyAxisAngle(new Vector3(0, 1, 0), MathUtils.degToRad(90)); // (1, 0, 0)
const q = new Quaternion().setFromAxisAngle(axis, angle);
const m = new Matrix4().makeRotationAxis(axis, angle);
```

`applyAxisAngle` turns a vector around a line through (0, 0, 0) of whatever space the vector is in. That's right for a direction. For a position, it swings it around the origin; the rotating around a point page covers turning around somewhere else.

### The axis must be unit length

three.js doesn't normalize the axis for you; its source says it assumes a normalized axis. Pass (1, 1, 0) as it is, and the object turns but also comes out stretched and skewed, with no error. Normalize any axis you build yourself.

### When the parent is turned

`rotateOnWorldAxis` really measures the axis from the parent, and three.js's own source notes that it assumes no turned parent. Inside a turned group, (0, 1, 0) is the group's up, not the world's. To turn a part around a true world axis there, first turn the axis into the parent's space:

```js
const undo = part.parent.getWorldQuaternion(new Quaternion()).invert();
part.rotateOnWorldAxis(worldAxis.clone().applyQuaternion(undo), angle);
```

### Which space is it in?

| Value | Space |
| --- | --- |
| The axis passed to `rotateOnAxis`, and the axes of `rotateX`, `rotateY`, `rotateZ` | Measured from the object itself, so it turns with the object |
| The axis passed to `rotateOnWorldAxis` | Measured from its parent: the world's axes only when no parent is turned |
| The turn `setRotationFromAxisAngle` sets | Measured from its parent, replacing the old turn |
| The vector `applyAxisAngle` turns | Whatever space the vector is in, around (0, 0, 0) of that space |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
