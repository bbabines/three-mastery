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

> **In short:** When the middle Euler angle reaches 90°, the other two turn the object around the same line, so one way of turning is lost.
>
> **Used for:** First-person cameras looking straight down, orbit cameras over the very top, and blending two sets of angles.

## A · The basics

### Three turns, one stuck spot

`rotation` is three turns in a row, each around an axis the turns before it have moved. When the middle turn reaches 90° up or down, it swings the last turn's axis onto the first one's. Now two angles turn the object around the same line: three angles, but only two ways left to turn. That's **gimbal lock**, named after a **gimbal**, a set of rings on pivots, one inside another. Move the middle angle off 90° and the lost way of turning comes back.

**Analogy: a camera on a tripod.** The head pans and tilts. Tilt it to aim straight up at the ceiling, and panning only spins the picture until you tilt back down.

The rings are the three turns of `'YXZ'`: green for yaw, red for pitch, blue for roll. Push pitch to 90°, then try yaw and roll: both spin the ship around the same upright line.

<div data-scene="rings"></div>

<details>
<summary>The math, if you're curious</summary>

A spot like this is called a **singularity**. Every three-angle description has one: with `'XYZ'` it's where `rotation.y` is ±90°, and with `'YXZ'` where `rotation.x` is.

</details>

## B · Working knowledge

### A camera looking straight down

A yaw/pitch camera uses `'YXZ'`, so pitch is the middle turn. Looking straight down, yaw and roll both spin the picture around its middle. Keep the pitch a little short of straight up and down:

```js
pitch = MathUtils.clamp(pitch, -1.55, 1.55); // about ±89°
```

To move across a map seen from above, change the camera's `position` instead.

### Reading angles back at the lock

At the lock, only the first and last angles added together matter, so three.js puts the whole spin in the first and sets the last to 0:

```js
const e = new Euler(0.4, Math.PI / 2, 0.3); // 'XYZ', middle turn at 90°
const back = new Euler().setFromQuaternion(new Quaternion().setFromEuler(e));
// back is (0.7, 1.571, 0): the same turn, written another way
```

That isn't a bug. Every three-angle description has this spot, in any engine.

### Turning without getting stuck

`rotateX`, `rotateY`, `rotateZ`, and `rotateOnAxis` turn the object's quaternion directly, so they never lose a way of turning, even at 90°. Only the angles read back from `rotation` look odd.

### Orbit views and blending

`OrbitControls` keeps the camera a hair short of straight up and down, so it never sits on the spot. Near the lock, angles read back can jump: 89° around Y reads (0°, 89°, 0°), but 91° reads (−180°, 89°, −180°). Blend between angles like those and the object swings wildly; the slerp page blends turns safely.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
