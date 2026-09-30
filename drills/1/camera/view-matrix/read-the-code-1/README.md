---
id: 1.camera.view-matrix.read-the-code.1
loop: 1
tier: core
concepts: [camera.view-matrix]
mode: read-the-code
context: camera.view-matrix/view-depth
lenses: []
misconceptions:
  - camera.view-matrix/inverse
---

# View matrix

> **In short:** Turns a place in the world into where it sits from the camera's seat: how far right, how far up, and how far ahead.
>
> **Used for:** Drawing every frame, fog that fades with distance, tooltips held in front of you, and signs that face you.

## A · The basics

### A camera is an object

A camera has a `position`, a `rotation`, and a `matrixWorld`, like any object. What makes it a camera is that three.js can draw the scene from its point of view. It looks down its own −Z, with its own +X to the right of its picture and its own +Y up.

### Measuring from the camera

To draw a point, three.js first measures it from the camera: how far to its right, how far up, and how far in front. That's **view space**. A spot 4 units straight ahead is (0, 0, −4): z is negative in front, because the camera looks down −Z.

**Analogy: directions from the driver's seat.** A gas station has a fixed address, but to the driver it's "200 meters ahead and a bit to the left". That changes every time the car moves or turns, though the station never moves.

### The view matrix does the measuring

A camera's `matrixWorld` takes a spot measured from the camera into the world, like any object's. The **view matrix** goes the other way, from the world to measured from the camera. It's the inverse, and three.js keeps it ready as `camera.matrixWorldInverse`:

```js
const fromCamera = ball.position.clone().applyMatrix4(camera.matrixWorldInverse);
```

Move and turn the camera. The ball never moves, but its numbers measured from the camera change every time.

<div data-scene="fromCamera"></div>

## B · Working knowledge

### Keeping something in front of the camera

A tooltip or a crosshair stays at one spot measured from the camera, like "0.3 up and 1.5 in front". Bring that spot into the world with `matrixWorld`, every frame:

```js
tooltip.position.set(0, 0.3, -1.5).applyMatrix4(camera.matrixWorld);
```

Or add it to the camera once, with `camera.add(tooltip)`, and its `position` is measured from the camera from then on. A camera's children only draw if the camera is in the scene.

The view matrix is not the camera's transform: it goes the other way. Put in place of `matrixWorld`, it reads (0, 0.3, −1.5) as a spot in the world, and the tooltip moves opposite to the camera. Try both buttons, then move and turn the camera.

<div data-scene="inFront"></div>

Facing the camera is simpler. A **billboard**, a flat sign that always faces the viewer, copies the camera's turn: `sign.quaternion.copy(camera.quaternion)`, when neither has a turned parent.

### How far in front is it?

```js
camera.updateMatrixWorld(); // after moving it in code: refreshes the view matrix too
const depth = -spot.clone().applyMatrix4(camera.matrixWorldInverse).z;
```

That's the spot's **view depth**: how far in front of the camera, along the way it faces. It isn't the straight-line distance from `distanceTo`, which is longer for a spot off to the side. Fog fades things by view depth.

### Don't scale a camera

The view matrix leaves any scale on the camera out, but `matrixWorld`, `localToWorld`, and the camera's children keep it. The two stop undoing each other, so spots land in the wrong place. Change `fov` or `zoom` to see more or less instead.

### Which space is it in?

This page works between **the world** and **measured from the camera**.

| Value | Space |
| --- | --- |
| `camera.matrixWorld` | Converts from measured from the camera, to the world |
| `camera.matrixWorldInverse` | Converts from the world, to measured from the camera |
| What `applyMatrix4(camera.matrixWorldInverse)` gives back | Measured from the camera: x right, y up, −z in front |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
