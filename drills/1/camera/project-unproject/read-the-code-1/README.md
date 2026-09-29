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

> **In short:** `project` takes a spot in the world to where it lands on the view, in NDC, and `unproject` goes back, from a spot on the view and a depth you choose to a spot in the world.
>
> **Used for:** Pinning HTML labels, tooltips, and health bars to things in a scene; dropping an object where the mouse points; building the ray a click sends into the scene; and checking whether something is in view.

## A · The basics

### The whole trip in one call

The clip space, NDC, screen page walked through the trip one step at a time. `Vector3` has two methods that make the whole trip in one call:

- **`v.project(camera)`** goes from the world to NDC: it applies the view matrix, then the projection matrix, dividing by w on the way.
- **`v.unproject(camera)`** goes back, from NDC to the world: it undoes the projection matrix, then applies the camera's `matrixWorld`.

```js
const ndc = part.getWorldPosition(new Vector3()).project(camera);
```

Both change the vector you call them on, like `sub`, so clone a vector you still need.

### Going back needs a depth

Going from the world to the view always has one answer: every spot lands at exactly one place in NDC. Going back doesn't. Every spot along a line straight out from the camera lands on the same place on the view, so a spot on the view only tells you a direction. `unproject` gets the depth from the z you give it: −1 is the near plane, 1 is the far plane.

**Analogy: a photo of a room.** You can always point to where the lamp shows up in the photo. But pointing at a spot in the photo doesn't tell you how far away the thing there was, only which direction it was in. `project` is finding the lamp in the photo. `unproject` is going from a spot in the photo back into the room, and it needs you to say how far.

Move the pointer over the scene. The ball stays under it, at the distance the slider sets: `unproject` gives the direction, and the distance is up to you.

<div data-scene="underCursor"></div>

## B · Working knowledge

### Pinning a label to a point

HTML labels, tooltips, and health bars that follow things in the scene are projected every frame, after the camera moves:

```js
const ndc = anchor.getWorldPosition(v).project(camera);
label.style.transform = `translate(${(ndc.x + 1) / 2 * width}px, ${(1 - ndc.y) / 2 * height}px)`;
```

`width` and `height` are the canvas's CSS size, and y flips on the way to pixels, as on the clip space, NDC, screen page. three.js's `CSS2DRenderer` add-on does this for a whole set of labels. Neither it nor your own code hides a label behind another object; that takes a raycast, covered in the spatial queries domain.

Cost: `project` is a few multiplications, so hundreds of labels a frame are fine. With HTML labels, moving the elements usually costs more than the math. Thousands of markers belong in a shader or `Points`; those are rules of thumb, not hard limits.

### A point behind the camera can land on screen

Behind the camera, w comes out negative. Dividing by it flips x and y to the other side of the center, and pushes z above 1. The flipped x and y can land inside −1 to 1, so a label that only checks x and y shows up on screen, mirrored, for something behind you. Check z too:

```js
const ndc = anchor.getWorldPosition(v).project(camera);
label.hidden = Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1 || Math.abs(ndc.z) > 1;
```

A z above 1 means behind the camera or past its far plane; below −1 means closer than its near plane. `CSS2DRenderer` hides labels whose z is outside −1 to 1.

Slide the sign behind the camera. With only x and y checked, its label stays on screen, on the wrong side. Orbit the view around to see where the sign really is.

<div data-scene="behind"></div>

### Placing an object under the cursor

Unproject the pointer's NDC to get a direction, then choose the distance yourself:

```js
const spot = new Vector3(ndc.x, ndc.y, 0.5).unproject(camera);
const dir = spot.sub(camera.position).normalize();
ball.position.copy(camera.position).addScaledVector(dir, 6); // 6 units from the camera
```

Don't use the unprojected spot as the place itself. NDC z isn't spread evenly: most of its range is used up close to the camera, as the depth precision page explains. With `near` 0.1 and `far` 100, z 0.5 is only about 0.4 units from the camera, and even z 0.9 is only about 2.

### Building a ray

A ray from the camera through the pointer, for finding what a click hit, is the same two lines: the camera's position is the start, and `dir` is the direction. `raycaster.setFromCamera(ndc, camera)` does exactly that for a perspective camera. The ray from pointer page covers it.

### Neither one refreshes the camera

`project` and `unproject` use the camera's matrices as they were last saved. After moving the camera in code, call `camera.updateMatrixWorld()` first, as on the update timing page; after changing `fov`, `aspect`, `near`, or `far`, call `camera.updateProjectionMatrix()`. In a frame loop after a render, both are already current.

And don't scale the camera: `project` uses the view matrix, which leaves the camera's scale out, while `unproject` uses `matrixWorld`, which keeps it in. On a scaled camera they stop undoing each other, as on the view matrix page.

### Which space is it in?

This page skips across the trip in one call: between **the world** and **NDC**, in either direction.

| Value | Space |
| --- | --- |
| `v` before `v.project(camera)` | The world |
| What `project` gives back | NDC: −1 to 1 across and up when on screen; z above 1 behind the camera |
| What you pass to `unproject` | NDC, with z picking the depth: −1 the near plane, 1 the far plane |
| What `unproject` gives back | The world |
| `dir` in "Placing an object under the cursor" | A direction in the world, length 1 |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
