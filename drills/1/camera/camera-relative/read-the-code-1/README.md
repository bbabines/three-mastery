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

> **In short:** A camera's own forward, right, and up, turned into world directions, so movement follows the view instead of the world's axes.
>
> **Used for:** WASD and joystick movement, panning a view, sliding objects across the screen, and spawning things in front of the player.

## A · The basics

### The camera's own directions

A camera looks down its own −Z, with its own +X to the right of its picture and its own +Y up. Turned into the world, those give three **camera-relative directions**: forward, right, and up. Use them whenever something should move "the way I'm looking" or "left and right on my screen".

**Analogy: "turn left" in a car.** A passenger's "left" means the car's left, whichever way it faces, while west on a map never changes. The world's X and Z are map directions.

### Reading them

`getWorldDirection` gives forward: a camera's −Z, though for any other object it gives +Z. Right and up are the first two columns of the camera's `matrixWorld`, as on the rotation matrix as a basis page:

```js
const forward = camera.getWorldDirection(new Vector3());
const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
```

Turn and tilt the camera: yellow is forward, red is right, and green is up. Then pick forward × up and tilt straight down: the orange right swings off.

<div data-scene="cameraArrows"></div>

## B · Working knowledge

### WASD movement

```js
if (keys.w) player.position.addScaledVector(forward, speed * delta);
if (keys.d) player.position.addScaledVector(right, speed * delta);
```

For walking on the ground, forward has to be level, or looking down walks you into the floor. Build it from right: `new Vector3().crossVectors(camera.up, right)` is level and points the way the camera faces, even looking straight down.

### Why not forward × up?

A common recipe builds right as `forward.clone().cross(camera.up).normalize()`. Looking straight up or down, forward and up are parallel, the cross product is next to nothing, and the result points wherever rounding sends it. With a rolled camera, it gives the level right, not the screen's. The matrix's first column is the real right at every angle.

### Panning and dragging across the screen

OrbitControls pans by moving the camera and its target along right and up, so a drag to the right moves the view right. Sliding an object under the pointer works the same way. The columns come from the saved `matrixWorld`, so if the same step just turned the camera, call `camera.updateMatrixWorld()` first; `getWorldDirection` refreshes on its own.

### Which space is it in?

This page works between **measured from the camera** and **the world**.

| Value | Space |
| --- | --- |
| What `camera.getWorldDirection(v)` gives back | The world, length 1: the camera's own −Z |
| Column 0 of `camera.matrixWorld` | The world: the camera's own +X, right on its screen |
| Column 1 of `camera.matrixWorld` | The world: the camera's own +Y, up on its screen |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
