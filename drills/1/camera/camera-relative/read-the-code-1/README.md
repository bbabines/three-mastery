---
id: 1.camera.camera-relative.read-the-code.1
loop: 1
tier: light
concepts: [camera.camera-relative]
mode: read-the-code
context: camera.camera-relative/wasd
lenses: []
misconceptions:
  - camera.camera-relative/forward-plus-z
---

# Camera-relative directions

> **In short:** To move things the way the view faces, take the camera's forward from `getWorldDirection` and its right and up from its `matrixWorld`, never from the world's X and Z.
>
> **Used for:** WASD and joystick movement in a first-person view; panning a view as the mouse drags; sliding an object sideways across the screen; and spawning something just in front of the player.

## A · The basics

### The camera's own directions

The view matrix page said a camera looks down its own −Z, with its own +X pointing right on its screen and its own +Y pointing up. **Camera-relative directions** are those three, turned into directions in the world:

- **Forward:** the way the camera looks. `camera.getWorldDirection(v)` gives it. For a camera, it's the camera's own −Z; for any other object, `getWorldDirection` gives its own +Z.
- **Right:** right on the camera's screen, its own +X.
- **Up:** up on the camera's screen, its own +Y.

Use them whenever something should move "the way I'm looking" or "left and right on my screen", however the camera is turned.

**Analogy: "turn left" in a car.** A passenger's "left" means the driver's left, whichever way the car faces, while west on a map never changes. The world's X and Z are map directions. Camera-relative directions are the passenger's.

### Reading them from the camera's matrix

The rotation matrix as a basis page showed that a matrix's columns are the object's own axes, in the world. For a camera, the first column is its right, the second is up on its screen, and the third is its back, the opposite of where it looks:

```js
const forward = camera.getWorldDirection(new Vector3());
const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
```

Turn and tilt the camera. Yellow is forward, red is right, and green is up on the camera's screen. They turn with the camera, and they stay square to each other and length 1 at any angle.

<div data-scene="cameraArrows"></div>

## B · Working knowledge

### WASD movement

```js
if (keys.w) player.position.addScaledVector(forward, speed * delta);
if (keys.d) player.position.addScaledVector(right, speed * delta);
```

For walking on the ground, forward has to be level, or looking down walks you into the floor. Build it from right instead: `new Vector3().crossVectors(camera.up, right)` is level and points the way the camera faces, even when it looks straight down. Setting forward's y to 0 and normalizing looks simpler, but straight down it leaves almost nothing to normalize, and the result points wherever rounding sends it.

### Why not forward × up?

A common recipe builds right from forward with the cross product: `forward.clone().cross(camera.up).normalize()`. It works while the camera is roughly level, but:

- **It shrinks as the camera tilts.** The cross product of two directions gets shorter as they line up, as on the cross product page, so skipping the `normalize()` makes strafing slow down as you look down.
- **Straight up or down, it breaks.** Forward and up are parallel, the cross product is next to nothing, and normalizing it gives a direction chosen by rounding, not by the camera. Try it in the scene: the orange arrow swings off.
- **A tilted horizon fools it.** With a rolled camera, as in a flight game, it gives the level right, not the screen's right.

The first column of `matrixWorld` is the camera's real right at every angle. Cameras shouldn't have a scale (the view matrix page), but if one might, normalize the column.

### Panning and dragging across the screen

OrbitControls pans exactly this way: it moves the camera and its target along the first and second columns of the camera's matrix, so a drag to the right moves the view to the right on screen. Sliding an object across the screen under the pointer is the same idea: move it by right times the pointer's sideways movement and up times its upward movement, each converted to world units with the world size per pixel page. The drag on a plane page in the interaction domain covers dragging in full.

### Refresh first if the camera just turned

`getWorldDirection` refreshes the camera's matrices before answering, as on the update timing page. `setFromMatrixColumn(camera.matrixWorld, 0)` reads the saved matrix as it is, so if the same step just turned the camera, call `camera.updateMatrixWorld()` first. In a frame loop after a render, the saved matrix is current.

### Which space is it in?

This page turns directions **measured from the camera**, its own right, up, and forward, into directions in **the world**.

| Value | Space |
| --- | --- |
| What `camera.getWorldDirection(v)` gives back | A direction in the world, length 1: the camera's own −Z |
| `new Vector3().setFromMatrixColumn(camera.matrixWorld, 0)` | A direction in the world: the camera's own +X, right on its screen |
| `new Vector3().setFromMatrixColumn(camera.matrixWorld, 1)` | A direction in the world: the camera's own +Y, up on its screen |
| `new Vector3().setFromMatrixColumn(camera.matrixWorld, 2)` | A direction in the world: the camera's own +Z, its back |
| `camera.up` | A direction in the world, (0, 1, 0) unless you change it: the up that `lookAt` keeps level |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
