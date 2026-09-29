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

> **In short:** The view matrix, `camera.matrixWorldInverse`, re-measures every spot in the world from the camera: how far to its right, how far up, and how far in front.
>
> **Used for:** Drawing every frame, since it's the first step from the world to the screen; fog and other effects that fade with distance from the viewer; a tooltip or crosshair that stays put in front of you; and sprites and particles that always face the camera.

## A · The basics

### From the world to the screen

This domain follows a point on its trip from the world to a pixel on the screen. Each page covers one step of the trip, or a tool for it:

1. **The world:** where the point is in the scene, as on the local vs world space page.
2. **Measured from the camera:** how far to the camera's right, how far up, and how far in front. This page.
3. **Clip space and NDC:** where on the view it lands, from −1 to 1 across and up. The projection matrix page and the clip space, NDC, screen page.
4. **Screen pixels:** which pixel of the canvas it lands on.

three.js makes the whole trip for every point of every mesh's shape, every frame. You make it yourself for things like pinning an HTML label to a point in the scene.

### A camera is an object

A camera in three.js is an Object3D like any other. It has a `position`, a `rotation`, and a `matrixWorld`, and it can go in a group. What makes it a camera is that three.js can draw the scene from its point of view.

A camera looks down its own −Z: straight ahead, from the camera's point of view, is the negative Z direction. Its own +X points to its right and its own +Y points up its screen. The camera-relative directions page turns those into directions in the world.

### Measuring from the camera

To draw a point, three.js first needs it measured from the camera: how far to the camera's right, how far up, and how far in front. In those three numbers, x is right and y is up, and z is negative for anything in front, because the camera looks down its own −Z. A spot 4 units straight ahead is (0, 0, −4).

**Analogy: directions from the driver's seat.** A gas station has a fixed address. To the driver it's "200 meters ahead and a bit to the left," and that changes every time the car moves or turns, though the station never moves. The address is the world position. "Ahead and to the left" is the spot measured from the camera.

### The view matrix does the measuring

A camera's `matrixWorld` works like any object's: it takes a spot measured from the camera into the world. Going the other way, from the world to measured from the camera, takes its inverse, as on the inverse matrices page. three.js keeps that inverse ready on every camera as `camera.matrixWorldInverse`, and it's called the **view matrix**:

```js
const fromCamera = ball.position.clone().applyMatrix4(camera.matrixWorldInverse);
```

The ball here sits straight in the scene, so its `position` is in the world.

Move and turn the camera. The ball never moves, so its world position stays the same, but its numbers measured from the camera change every time. The red, green, and blue lines show those three numbers along the camera's own right, up, and back directions. The blue one runs forward, because the third number is negative for a ball in front.

<div data-scene="fromCamera"></div>

<details>
<summary>The math, if you're curious</summary>

The names you'll see in docs and forums: the space measured from the camera is **view space**, also called camera space or eye space. Shaders get the view matrix as `viewMatrix`. Each mesh also gets a **`modelViewMatrix`**: its `matrixWorld` and the view matrix combined into one, so a single step takes each point of the mesh's shape from being measured from the mesh itself to view space. three.js combines the two for every mesh it draws, every frame.

</details>

## B · Working knowledge

### Which way each matrix goes

| Code | Converts |
| --- | --- |
| `v.applyMatrix4(camera.matrixWorld)` or `camera.localToWorld(v)` | From measured from the camera, to the world |
| `v.applyMatrix4(camera.matrixWorldInverse)` | From the world, to measured from the camera |

The view matrix is not "the camera's transform". The camera's transform is `matrixWorld`, like any object's. The view matrix is its inverse, and it goes the other way.

### Keeping something in front of the camera

A tooltip, a crosshair, or a tool held in front of you stays at the same spot measured from the camera, like "0.3 up and 1.5 in front". That's camera-relative UI. Bring the spot into the world with the camera's `matrixWorld`:

```js
tooltip.position.set(0, 0.3, -1.5).applyMatrix4(camera.matrixWorld);
```

That line has to run every frame, after anything that moves the camera. Or make the tooltip a child of the camera, and three.js carries it along with no code in the frame loop:

```js
camera.add(tooltip);
tooltip.position.set(0, 0.3, -1.5); // measured from the camera
scene.add(camera); // its children only draw if the camera is in the scene
```

The mistake is reaching for the view matrix because it's the camera's matrix. It goes the other way: it reads (0, 0.3, −1.5) as a spot in the world and measures that from the camera. The tooltip lands somewhere unrelated, and it moves the opposite way whenever the camera moves. Try both buttons, then move and turn the camera.

<div data-scene="inFront"></div>

### How far in front is it?

How far in front of the camera a spot is, its **view depth**, is its third number measured from the camera, made positive:

```js
const depth = -spot.clone().applyMatrix4(camera.matrixWorldInverse).z;
```

View depth is measured straight along the way the camera faces. It isn't the straight-line distance: a spot off to the side of the view is farther away in a straight line, but can have the same depth. three.js's fog fades things by view depth, and the world size per pixel page uses it to keep a marker the same size on screen. `camera.position.distanceTo(spot)` is the straight-line distance, a different number.

### Things that always face the camera

A **billboard** is something flat that always turns to face the viewer, like a tree drawn as a flat picture, a particle, or a health bar over a character. three.js's `Sprite` is one: its shader measures its center from the camera and lays its corners out along the camera's own right and up, so it faces you from any angle. The labels in these scenes are sprites. To make a flat mesh face the camera, give it the camera's turn:

```js
healthBar.quaternion.copy(camera.quaternion); // when neither has a turned parent
```

### Don't scale a camera

In r186, three.js leaves any scale out of the view matrix, so a camera with a `scale` draws as if it had none. Everything that uses `camera.matrixWorld` does include the scale, like `localToWorld` and the camera's children. The two stop undoing each other, so a spot converted into the world and back lands in the wrong place. To see more or less of the scene, change the camera's `fov` or `zoom` instead; the projection matrix page covers both.

### It's refreshed with matrixWorld

`matrixWorldInverse` is a saved copy, like `matrixWorld`, and three.js refreshes both at the same moment: when it renders, or when you call `camera.updateMatrixWorld()`. After moving the camera in code, refresh before using the view matrix in the same step, as on the update timing page:

```js
camera.position.set(0, 2, 8);
camera.updateMatrixWorld(); // refreshes matrixWorld and matrixWorldInverse
const depth = -spot.clone().applyMatrix4(camera.matrixWorldInverse).z;
```

### Which space is it in?

This page works between two stops on the trip: **the world** and **measured from the camera**.

| Value | Space |
| --- | --- |
| `ball.position`, for a ball added straight to the scene | The world |
| `camera.matrixWorld` | Converts from measured from the camera, to the world |
| `camera.matrixWorldInverse`, the view matrix | Converts from the world, to measured from the camera |
| What `v.applyMatrix4(camera.matrixWorldInverse)` gives back | Measured from the camera (view space): x right, y up, −z in front |
| A child's `position`, once it's added to the camera | Measured from the camera |
| `depth` in "How far in front is it?" | How far in front of the camera, along the way it faces |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
