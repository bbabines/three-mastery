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

> **In short:** After the lens, a spot lands in NDC, −1 to 1 across and up, then on a canvas pixel, where y runs down.
>
> **Used for:** Pinning HTML labels to a scene, turning a click into a ray, arrows toward things off screen, and vertex shaders.

## A · The basics

### The last steps of the trip

The projection matrix page ran a spot through the camera's lens. Three steps are left before it's a pixel:

1. **Clip space** is what the lens gives: x, y, z, and a fourth number, **w**. For a perspective camera, w is the spot's depth in front of the camera.
2. **NDC** is x, y, and z divided by w. The farther away a spot, the bigger its w and the smaller the result: this divide is where far things shrink.
3. **Screen pixels** come from stretching NDC over the canvas.

three.js and the GPU do all three for every point of every mesh. You do the last one yourself when you pin an HTML label to a point in the scene.

### NDC: −1 to 1, whatever the canvas

**NDC** stands for normalized device coordinates. The visible view runs from −1 to 1 across and from −1 to 1 up, so (−1, −1) is the bottom-left corner and (0, 0) the center. y points up, like y in the world. z runs from −1 at the near plane to 1 at the far plane, and any number outside −1 to 1 means off screen.

**Analogy: "a third of the way across, near the top".** That places a sticker the same way on a postcard or a poster. Pixels are the ruler of one particular canvas, used only at the end.

Move the ball, and orbit the view. The readout follows the ball through each step, and the HTML label sits at the pixel the last step gives.

<div data-scene="trip"></div>

<details>
<summary>The math, if you're curious</summary>

NDC = (clip x ÷ w, clip y ÷ w, clip z ÷ w). The divide is called the **perspective divide**.

</details>

## B · Working knowledge

### Is it on screen?

```js
const ndc = point.clone().project(camera); // the world to NDC, divide included
const onScreen = Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1 && Math.abs(ndc.z) <= 1;
```

Use it to hide a label, or to point an arrow at something off screen. A vertex shader stops at clip space, `gl_Position`, and the GPU does the divide and the pixels.

### Flipping y, both ways

NDC's y points up, but CSS and pointer events count y down from the top, so the step to a label's pixel flips it:

```js
const x = (ndc.x + 1) / 2 * canvas.clientWidth;
const y = (1 - ndc.y) / 2 * canvas.clientHeight; // flipped
```

Without the flip, the label mirrors top to bottom: it moves down as the point moves up. Use `clientWidth`, in CSS pixels; `canvas.width` counts device pixels, twice as many at a pixel ratio of 2. Try both buttons.

<div data-scene="labelFlip"></div>

A click goes the other way, to the NDC that `raycaster.setFromCamera(ndc, camera)` wants. Measure from the canvas's own rectangle, not the window; the flip is the minus sign:

```js
const rect = canvas.getBoundingClientRect();
ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; // flipped
```

### Which space is it in?

This page works between **clip space** and **screen pixels**, by way of **NDC**.

| Value | Space |
| --- | --- |
| `gl_Position` in a vertex shader | Clip space: x, y, z, and w |
| What `point.clone().project(camera)` gives back | NDC: −1 to 1 across and up |
| `x` and `y` in "Flipping y, both ways" | CSS pixels from the canvas's top-left corner, y down |
| `event.clientX`, `event.clientY` | CSS pixels from the window's top-left corner, y down |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
