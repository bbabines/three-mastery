---
id: 1.camera.project-unproject.read-the-code.1
loop: 1
tier: core
concepts: [camera.project-unproject]
mode: read-the-code
context: camera.project-unproject/labels-3d
lenses: []
misconceptions:
  - camera.project-unproject/behind-camera
---

# project and unproject

> **In short:** `project` finds where a spot in the world lands on the view, and `unproject` goes back from the view at a depth you choose.
>
> **Used for:** Pinning labels to things in a scene, dropping an object under the mouse, building a click's ray, and in-view checks.

## A · The basics

### The whole trip in one call

The clip space, NDC, screen page walked through the trip a step at a time. Two `Vector3` methods make it in one call:

- **`v.project(camera)`** goes from the world to NDC, through the view matrix, the lens, and the divide by w.
- **`v.unproject(camera)`** goes back, from NDC to the world.

```js
const ndc = part.getWorldPosition(new Vector3()).project(camera);
```

Both change the vector you call them on, like `sub`, so clone a vector you still need.

### Going back needs a depth

Every spot in the world lands at exactly one place on the view. Going back isn't like that: every spot along a line straight out from the camera lands on the same place, so a place on the view only gives a direction. `unproject` takes the depth from the z you pass: −1 is the near plane and 1 the far plane.

**Analogy: a photo of a room.** You can always point to where the lamp shows up in the photo. But a spot in the photo only says which direction something was in, not how far away.

Move the pointer over the scene. The ball stays under it, at the distance the slider sets.

<div data-scene="underCursor"></div>

## B · Working knowledge

### Pinning a label to a point

```js
const ndc = anchor.getWorldPosition(v).project(camera);
label.style.transform = `translate(${(ndc.x + 1) / 2 * width}px, ${(1 - ndc.y) / 2 * height}px)`;
```

Run it every frame, after the camera moves. `width` and `height` are the canvas's size in CSS pixels. `project` uses the camera's matrices as last saved, so after moving the camera in code, call `camera.updateMatrixWorld()` first. It's cheap: hundreds of labels a frame are fine, and moving the HTML usually costs more than the math.

### A point behind the camera can land on screen

Behind the camera, the divide flips x and y to the other side of the center, and they can land inside −1 to 1. A label that checks only x and y then shows up, mirrored, for something behind you. Check z too; above 1 means behind the camera or past `far`:

```js
label.hidden = Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1 || Math.abs(ndc.z) > 1;
```

Slide the sign behind the camera and try both buttons. With only x and y checked, its label stays on screen; orbit around to see where the sign really is.

<div data-scene="behind"></div>

### Placing an object under the cursor

```js
const dir = new Vector3(ndc.x, ndc.y, 0.5).unproject(camera).sub(camera.position).normalize();
ball.position.copy(camera.position).addScaledVector(dir, 6); // you choose the distance
```

Take only the direction from `unproject`, not the spot itself. NDC z isn't spread evenly: with `near` 0.1 and `far` 100, z 0.5 is only about 0.4 units away. The camera's position and `dir` make the ray a click sends; `raycaster.setFromCamera(ndc, camera)` builds that ray for a perspective camera.

### Which space is it in?

This page works between **the world** and **NDC**, in one call either way.

| Value | Space |
| --- | --- |
| `v` before `project`, and what `unproject` gives back | The world |
| What `project` gives back | NDC; z above 1 behind the camera |
| What you pass to `unproject` | NDC, with z for the depth: −1 near, 1 far |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
