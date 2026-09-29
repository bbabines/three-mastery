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

> **In short:** To frame a model, wrap it in a bounding sphere and back the camera off until the sphere fits inside the narrower of the view's two angles, which on a phone held upright is the side-to-side one.
>
> **Used for:** Showing a freshly loaded model, whatever its size; zooming to a part someone clicked; making product thumbnails automatically; and a "fit to view" button that resets the camera.

## A · The basics

### Wrap it, then back off

Models come in every size: a screw might be 0.01 units across and a warehouse 100. To show one, measure it and put the camera far enough back that it fits:

1. **Measure.** `new Box3().setFromObject(model)` fits a box around the model in the world, as on the matrix vs matrixWorld page. `box.getBoundingSphere(sphere)` gives the ball around that box: a center and a radius.
2. **Back off.** The camera goes far enough back that the ball fits inside the view's angle. The bigger the ball or the narrower the angle, the farther back.
3. **Aim.** Point the camera at the ball's center.

A ball fits the same from every side, so the camera can orbit afterwards without the model poking out of the view.

**Analogy: stepping back for a group photo.** You step back until everyone fits. Hold the phone upright and the picture is narrow, so for a wide group you step back until they fit side to side; getting them in top to bottom isn't enough.

### Tall screens: fit the narrower angle

three.js's `fov` is the angle from the bottom of the view to the top, as on the projection matrix page. On a wide screen, the side-to-side angle is wider than that, so fitting top to bottom is enough. On a tall screen, like a phone held upright, the side-to-side angle is the narrower one. Fitting only `fov` there leaves the sides of the model cut off. Fit the narrower of the two.

Make the screen tall with the slider, then compare the buttons. Fitting only the vertical `fov` cuts off the shelf's ends; fitting the narrower angle backs the camera off until they're in.

<div data-scene="fitView"></div>

<details>
<summary>The math, if you're curious</summary>

A ball just touches the edges of the view when the camera is this far from its center:

distance = radius ÷ sin(angle ÷ 2)

where the angle is the narrower of the view's two angles, in radians. Some code uses tan instead of sin, which puts the camera slightly too close, so the ball's edges get clipped.

</details>

## B · Working knowledge

### The code

```js
const box = new Box3().setFromObject(model);
const sphere = box.getBoundingSphere(new Sphere());

const vertical = MathUtils.degToRad(camera.fov);
const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
const distance = sphere.radius / Math.sin(Math.min(vertical, horizontal) / 2);

const back = camera.getWorldDirection(new Vector3()).negate(); // keep the way the camera faces
camera.position.copy(sphere.center).addScaledVector(back, distance);
camera.lookAt(sphere.center);
controls.target.copy(sphere.center); // when OrbitControls drives the camera
```

Things to know:

- **An empty model breaks it.** Before anything has loaded, the box is empty and its sphere's radius is −1, so the distance comes out negative and the camera lands on the wrong side, facing away. Check `box.isEmpty()` first.
- **Set `near` and `far` to suit.** A model 0.01 units across needs a much smaller `near` than a warehouse. A common choice is `camera.near = distance / 100` and `camera.far = distance * 100`, then `camera.updateProjectionMatrix()`; the depth precision page covers why `near` shouldn't be smaller than it needs to be.
- **`setFromObject` refreshes the model and its children,** but not its parents, as on the update timing page. If you just moved the model's parent, refresh first.

### Focus on a part

Framing a clicked part is the same code with the part in place of the model. The focus on object page in the interaction domain adds the smooth move there.

### Thumbnails

For product thumbnails, an orthographic camera is common, so every product is shown without perspective. It has no angle to back off from: set its `zoom` so the ball fits the box instead:

```js
camera.zoom = Math.min(camera.right - camera.left, camera.top - camera.bottom) / (2 * sphere.radius);
camera.updateProjectionMatrix();
```

Place it on the same line from the center as above, far enough back that the whole ball is past `near`.

### Which space is it in?

This page places the camera in **the world** so the model lands inside −1 to 1 in **NDC**.

| Value | Space |
| --- | --- |
| What `new Box3().setFromObject(model)` gives back | The world |
| `sphere.center` and `sphere.radius` | The world, in world units |
| `vertical`, `horizontal` | Angles in radians |
| What `camera.getWorldDirection(v)` gives back, and `back` | Directions in the world, length 1 |
| `camera.position` after the fit | Measured from its parent: the world, for a camera with no parent |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
