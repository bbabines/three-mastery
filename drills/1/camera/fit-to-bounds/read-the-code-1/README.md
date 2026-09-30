---
id: 1.camera.fit-to-bounds.read-the-code.1
loop: 1
tier: light
concepts: [camera.fit-to-bounds]
mode: read-the-code
context: camera.fit-to-bounds/auto-frame
lenses: []
misconceptions:
  - camera.fit-to-bounds/vertical-enough
---

# Fit to bounds

> **In short:** Frames a model by wrapping it in a ball and backing the camera off until the ball fits the view's narrower angle.
>
> **Used for:** Showing a freshly loaded model, zooming to a clicked part, automatic thumbnails, and a "fit to view" button.

## A · The basics

### Wrap it, then back off

Models come in every size, from a screw 0.01 units across to a warehouse 100 across. To show one, wrap it in a ball, back the camera off until the ball fits inside the view's angle, and aim at the ball's center. A ball fits the same from every side, so the camera can orbit afterward without the model poking out.

**Analogy: stepping back for a group photo.** You step back until everyone fits. Hold the phone upright and the picture is narrow, so a wide group has to fit side to side, not just top to bottom.

### Tall screens: fit the narrower angle

`fov` is the angle from the bottom of the view to the top. On a wide screen, the side-to-side angle is wider, so fitting `fov` is enough. On a tall screen, like a phone held upright, the side-to-side angle is narrower, and fitting only `fov` cuts off the model's sides. Fit the narrower of the two.

Change the screen's shape with the slider and compare the buttons. On a tall screen, fitting only `fov` cuts off the shelf's ends.

<div data-scene="fitView"></div>

## B · Working knowledge

### Measuring the model

```js
const box = new Box3().setFromObject(model); // in the world
if (box.isEmpty()) return; // nothing has loaded yet
const sphere = box.getBoundingSphere(new Sphere());
```

An empty box gives a sphere with a radius of −1, and the camera would land on the wrong side, facing away. To focus on a clicked part, measure the part instead.

### Backing off

```js
const vertical = MathUtils.degToRad(camera.fov);
const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
const distance = sphere.radius / Math.sin(Math.min(vertical, horizontal) / 2);
camera.position.copy(sphere.center).addScaledVector(back, distance);
```

`back` points from the model toward the camera; `camera.getWorldDirection(v).negate()` keeps the current view. Then aim with `camera.lookAt(sphere.center)`, copy the center into `controls.target` if OrbitControls drives the camera, and set `near` and `far` to suit the model's size.

### Thumbnails

An orthographic camera shows every product without perspective. It has no angle to back off from, so set its `zoom` until the ball fits its box:

```js
camera.zoom = Math.min(camera.right - camera.left, camera.top - camera.bottom) / (2 * sphere.radius);
camera.updateProjectionMatrix();
```

### Which space is it in?

This page works between **the world** and **NDC**: it places the camera so the model lands inside −1 to 1.

| Value | Space |
| --- | --- |
| `box`, `sphere.center`, `sphere.radius` | The world |
| `back` | A direction in the world, length 1 |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
