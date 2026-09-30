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

> **In short:** One line to turn around and one angle to turn by: every turn, however it was made, fits this form.
>
> **Used for:** Doors and lids on hinges, globes and fans on tilted shafts, editor rotate handles, and spinning wheels.

## A · The basics

### One line and one angle

**Axis-angle** writes a turn as a single turn around one line, the **axis**, by one **angle**. The axis is a direction of length 1. The angle is in radians, turning the way your right hand's fingers curl with the thumb along the axis.

```js
const shaft = new Vector3(0.3, 1, 0).normalize(); // a tilted line
globe.setRotationFromAxisAngle(shaft, angle);
```

**Analogy: a marshmallow on a stick.** The stick is the axis, and how far you twist it is the angle. Hold the stick at a slant and the marshmallow still turns around the stick, not around straight up.

### Whose axis?

`rotateOnAxis(axis, angle)` measures the axis from the object itself, so (0, 1, 0) is its own up, which leans when the object leans. `rotateX`, `rotateY`, and `rotateZ` are shortcuts for it. `rotateOnWorldAxis(axis, angle)` measures the axis from the parent, which is the world only when no parent is turned.

The fan leans 30°. Try both buttons: one spins it around its own leaning Y, and the other around the world's upright Y, so its lean swings in a circle.

<div data-scene="whoseAxis"></div>

## B · Working knowledge

### Swinging a hinge

`setRotationFromAxisAngle` replaces the whole turn, so set the angle each time instead of adding to it:

```js
const hingeLine = new Vector3(1, 0, 0);                             // along the lid's back edge
lid.setRotationFromAxisAngle(hingeLine, MathUtils.degToRad(-open)); // open: 0 to 110
```

The line runs through the lid's origin, so the origin has to sit on the hinge; the pivots page shows how.

### Spinning around a tilted axis

```js
const shaft = new Vector3(0.3, 1, 0).normalize(); // measured from the planet itself
planet.rotateOnAxis(shaft, speed * delta);         // delta: seconds since the last frame
```

Each call adds a little more turn, so the planet keeps spinning around its own tilted shaft.

### Turning a direction

```js
const facing = new Vector3(0, 0, 1).applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2); // (1, 0, 0)
```

`applyAxisAngle` turns a vector around (0, 0, 0) of whatever space it's in. `Quaternion.setFromAxisAngle` and `Matrix4.makeRotationAxis` take the same pair.

### Keep the axis length 1

three.js doesn't normalize the axis. Pass (1, 1, 0) as it is, and the object turns but also comes out stretched and skewed, with no error. Normalize any axis you build yourself.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
