---
id: 1.camera.clip-ndc-screen.read-the-code.1
loop: 1
tier: core
concepts: [camera.clip-ndc-screen]
mode: read-the-code
context: camera.clip-ndc-screen/label-position
lenses: []
misconceptions:
  - camera.clip-ndc-screen/ndc-y-down
---

# Clip space, NDC, screen

> **In short:** After the lens, a spot is squeezed into NDC, where the whole view runs from −1 to 1 across and up, and then spread over the canvas's pixels, where y runs down instead of up.
>
> **Used for:** Pinning HTML labels and price tags to points in a scene; turning a mouse click into something three.js can aim a ray with; showing an arrow toward something that's off screen; and writing `gl_Position` in a vertex shader.

## A · The basics

### The last steps of the trip

The view matrix page measured a spot from the camera, and the projection matrix page ran it through the camera's lens. Three steps are left before it's a pixel:

1. **Clip space.** What comes out of the projection matrix is four numbers: x, y, z, and a fourth called **w**. For a perspective camera, w is the spot's depth in front of the camera.
2. **NDC.** Dividing x, y, and z by w gives **NDC**. The farther away a spot is, the bigger its w, so the smaller its result. This divide is where "farther things look smaller" actually happens.
3. **Screen pixels.** NDC is stretched over the canvas to find the pixel.

three.js and the GPU do all three for every point of every mesh. You do the last one yourself whenever you pin something from the page, like an HTML label, to a point in the scene.

### NDC: −1 to 1, whatever the canvas

**NDC** stands for normalized device coordinates. In NDC, the visible part of the view runs from −1 to 1 across and from −1 to 1 up:

- (−1, −1) is the bottom-left corner of the view, (1, 1) the top-right, and (0, 0) the center.
- y points **up**, like y in the world.
- z runs from −1 at the near plane to 1 at the far plane.

It's the same on a phone and a wall-sized screen; that's what "normalized" means. A spot with any of x, y, or z outside −1 to 1 is off screen.

**Analogy: "a third of the way across and near the top".** That places a sticker the same way on a postcard or a poster. NDC places things on the view that way. Pixels are the ruler of one particular canvas, and you only measure with it at the end.

Move the ball, and orbit the view. Your view is the camera here: the readout follows the ball through each step, and the HTML label is pinned at the pixel the last step gives.

<div data-scene="trip"></div>

<details>
<summary>The math, if you're curious</summary>

The names you'll see in docs and forums: the divide by w is the **perspective divide**, and the four-number form is called **homogeneous coordinates**. NDC comes out as:

NDC = (clip x ÷ w, clip y ÷ w, clip z ÷ w)

An orthographic camera's w is always 1, so the divide changes nothing, and that's why sizes don't change with distance. Stretching NDC over the canvas is the **viewport transform**.

</details>

## B · Working knowledge

### Clip space and NDC in code

You rarely do the divide yourself. On a `Vector3`, `applyMatrix4` does it for you, and `project` does the whole trip from the world to NDC in one call; the project and unproject page covers it.

```js
const ndc = point.clone().project(camera); // x, y, and z, each −1 to 1 when on screen
```

To see the clip-space numbers themselves, use a `Vector4`, which keeps w:

```js
const clip = new Vector4(point.x, point.y, point.z, 1)
  .applyMatrix4(camera.matrixWorldInverse)
  .applyMatrix4(camera.projectionMatrix);
```

A vertex shader's job is to hand the GPU clip space: `gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);`. The GPU does the divide and the pixels itself. The shaders domain covers it.

### From NDC to a pixel: flip y

NDC's y points up. The page's y, in CSS and in pointer events, points down from the top. So the step to pixels flips y:

```js
const x = (ndc.x + 1) / 2 * canvas.clientWidth;
const y = (1 - ndc.y) / 2 * canvas.clientHeight; // flipped
label.style.transform = `translate(${x}px, ${y}px)`;
```

Leave out the flip and the label mirrors top to bottom: it moves down when the point moves up, and it only lines up when the point is at the exact middle height of the view. Try both buttons.

<div data-scene="labelFlip"></div>

### From the pointer to NDC: flip y back

A click or a mouse move goes the other way, pixels to NDC, which is what `raycaster.setFromCamera(ndc, camera)` wants. The same flip appears, as a minus sign:

```js
const rect = canvas.getBoundingClientRect();
ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; // flipped
```

Measure from the canvas's own rectangle, not the window, unless the canvas fills the window. The ray from pointer page covers the rest.

### CSS pixels, not device pixels

With a pixel ratio above 1, set with `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, the canvas has more real pixels than CSS pixels: `canvas.width` is the CSS width times the pixel ratio. HTML positions and pointer events are in CSS pixels, so use `canvas.clientWidth` and `clientHeight`, or `getBoundingClientRect()`, never `canvas.width`.

### Is it on screen?

A point is on screen when all three NDC numbers are between −1 and 1:

```js
const ndc = point.clone().project(camera);
const onScreen = Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1 && Math.abs(ndc.z) <= 1;
```

Use it to hide a label, or to show an arrow at the edge pointing toward an objective. The z test matters: the project and unproject page shows a point behind the camera whose x and y land on screen.

### Which space is it in?

This page works between the last stops on the trip: **clip space**, through **NDC**, to **screen pixels**.

| Value | Space |
| --- | --- |
| `clip` from the `Vector4` above, and `gl_Position` in a vertex shader | Clip space: x, y, z, and w, the depth in front of the camera |
| What `point.clone().project(camera)` gives back | NDC: −1 to 1 across and up |
| `x` and `y` from "From NDC to a pixel" | CSS pixels from the canvas's top-left corner, y down |
| `event.clientX`, `event.clientY` | CSS pixels from the window's top-left corner, y down |
| `canvas.clientWidth`, `canvas.clientHeight` | CSS pixels |
| `canvas.width`, `canvas.height` | Device pixels: CSS pixels times the pixel ratio |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
