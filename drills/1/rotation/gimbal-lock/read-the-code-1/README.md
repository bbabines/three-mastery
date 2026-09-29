---
id: 1.rotation.gimbal-lock.read-the-code.1
loop: 1
tier: light
concepts: [rotation.gimbal-lock]
mode: read-the-code
context: rotation.gimbal-lock/camera-down
lenses: []
misconceptions:
  - rotation.gimbal-lock/library-bug
---

# Gimbal lock

> **In short:** When the middle of the three Euler turns reaches 90°, the first and last turns end up going around the same line, so two angles do the same thing and one way of turning is lost.
>
> **Used for:** Knowing why a first-person camera looking straight down spins instead of turning, why an orbit view acts oddly at the very top of a model, why blending two sets of angles can take a wild path, and why three.js keeps every turn as a quaternion.

## A · The basics

### Three turns, one stuck spot

The Euler angles and order page showed that `rotation` is three turns done one after another, each around an axis the turns before it have moved. Most of the time the three axes point different ways, so each angle turns the object a different way.

There's one exception. When the middle turn reaches 90° up or down, it swings the last turn's axis onto the first turn's axis. Now the first and last angles both turn the object around the same line. Three angles, but only two ways left to turn. That's **gimbal lock**. Move the middle angle off 90° and the lost way of turning comes back.

A **gimbal** is a ring on pivots, one inside another, like the rings that keep a ship's compass level. Each ring is one of the three turns, which is exactly how the three Euler angles work.

**Analogy: a camera on a tripod.** The head pans left and right and tilts up and down. Tilt it to aim straight up at the ceiling, and panning no longer changes where it aims: it only spins the picture. One way of moving is gone until you tilt back down.

The three rings are the three turns of `'YXZ'`: green for yaw (Y), red for pitch (X), blue for roll (Z). Push Pitch to 90°, then try Yaw and Roll: the blue ring's pivots line up with the green ring's, and both sliders spin the ship around the same upright line.

<div data-scene="rings"></div>

<details>
<summary>The math, if you're curious</summary>

Mathematicians call a spot like this a **singularity**: the three angles stop matching up one-to-one with turns, so many different sets of angles give the same turn. Every way of describing a turn with three angles has one somewhere. With `'XYZ'` it's where `rotation.y` is ±90°; with `'YXZ'` it's where `rotation.x` is ±90°.

</details>

## B · Working knowledge

### A camera looking straight down

A yaw/pitch camera uses `'YXZ'`, so pitch is the middle turn. Looking straight down, pitch is −90°, and yaw and roll now do the same thing: both spin the picture around its middle.

```js
camera.rotation.order = 'YXZ';
camera.rotation.set(-Math.PI / 2, yaw, 0); // straight down: yaw only spins the picture
```

For a map view, that spin is often fine; to move across the map, move the camera's `position`. A first-person camera stops the pitch at straight up and down, as three.js's `PointerLockControls` does, so it never goes past the stuck spot. Keep it a little short of 90° if the spin at the very top bothers you:

```js
pitch = MathUtils.clamp(pitch, -1.55, 1.55); // about ±89°, just short of straight up and down
```

### Reading angles back at the lock

At the lock, only the first and last angles added together matter, so three.js can't tell 0.4 + 0.3 from 0.7 + 0. When it works out angles from a quaternion or a matrix there, it puts the whole spin in the first angle and sets the last one to 0:

```js
const e = new Euler(0.4, Math.PI / 2, 0.3);               // 'XYZ', middle turn at 90°
const back = new Euler().setFromQuaternion(new Quaternion().setFromEuler(e));
// back is (0.7, 1.571, 0): the same turn, written another way
```

It isn't a bug in three.js. Any three-angle description has this spot, in every engine and every math library.

### Turning without getting stuck

`rotateX`, `rotateY`, `rotateZ`, and `rotateOnAxis` don't go through the three angles. They turn the object's quaternion around the axis you ask for, so they never lose a way of turning, even at 90°. Only the angles you read back from `rotation` look odd. The quaternions page explains why a quaternion has no stuck spot.

```js
ship.rotation.set(0, Math.PI / 2, 0); // 'XYZ', at the lock. Then, each on its own:
ship.rotation.x += 0.3;               // these two give the same turn…
ship.rotation.z += 0.3;
ship.rotateX(0.3);                    // …but these two still turn it different ways
ship.rotateZ(0.3);
```

### Turntables at the top

An orbit view has the same spot. three.js's `OrbitControls` moves the camera with two angles, around the up axis and over the top. Looking straight down on a model, dragging left and right only spins the picture, like the tripod aimed at the ceiling. It keeps the camera a hair short of straight up and straight down (0.000001 radians), so it never sits exactly on the spot.

### Blending angles near the lock

Angles read back near the lock can jump even when the turn barely changes. A turn of 89° around Y reads back as (0°, 89°, 0°), and one of 91° as (−180°, 89°, −180°). Blend between two sets of angles like those and the object swings wildly on the way. The slerp page covers blending turns the safe way.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
