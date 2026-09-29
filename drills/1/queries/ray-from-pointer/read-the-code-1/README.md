---
id: 1.queries.ray-from-pointer.read-the-code.1
loop: 1
tier: core
concepts: [queries.ray-from-pointer]
mode: read-the-code
context: queries.ray-from-pointer/click
lenses: []
misconceptions:
  - queries.ray-from-pointer/window-size
---

# Ray from pointer

> **In short:** To find what's under the mouse, you turn the pointer's spot on the canvas into NDC, and `raycaster.setFromCamera` builds a ray from the camera through that spot, out into the scene.
>
> **Used for:** Selecting a part with a click, highlighting whatever the mouse is over, starting a drag on the object that was grabbed, and dropping new furniture where the user points.

## A · The basics

### From a spot on the screen to a ray in the world

A click tells you a spot on the screen, in pixels. The scene is 3D. Every point along a line straight out from the camera lands on that same spot, as the project and unproject page showed, so the click really picks a line, not a point. That line, starting at the camera and running out through the spot, is a ray, as on the ray page.

Getting it takes three steps:

1. **The pointer event** says where the mouse is, in CSS pixels from the window's top-left corner.
2. **Measure it on the canvas, then turn it into NDC,** the −1 to 1 view from the clip space, NDC, screen page, with y pointing up.
3. **`raycaster.setFromCamera(pointer, camera)`** turns that NDC spot into a ray: it starts at the camera's position and points through the spot.

**Analogy: pointing through a window.** Stand at a window and put your finger on the glass over a tree. The line from your eye through your fingertip runs on until it reaches the tree. Your eye is the camera, the glass is the screen, and your fingertip is the pointer.

Move the pointer on the camera in the scene's screen, the white pane in front of it. The red ray runs from the camera through the dot. The picture in the top-right corner is what that camera sees: whatever the ray hits sits right where the pointer is.

<div data-scene="throughTheView"></div>

<details>
<summary>The math, if you're curious</summary>

`setFromCamera` uses **unprojection**, from the project and unproject page. For a perspective camera, it unprojects the NDC spot to a point in the world, subtracts the camera's position to get a direction, and normalizes it. An orthographic camera works differently: every ray points the way the camera faces, and the start moves to the pointer's spot instead.

</details>

## B · Working knowledge

### The whole thing, from memory

```js
const raycaster = new Raycaster();
const pointer = new Vector2();

renderer.domElement.addEventListener('pointerdown', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickable);
  if (hits.length > 0) select(hits[0].object);
});
```

`pickable` is your own list of the objects that can be picked; the filtering page covers why. Reading `hits` is the intersection anatomy page.

### Measure from the canvas, not the window

Many examples use the window's size: `event.clientX / window.innerWidth * 2 - 1`. That's only right when the canvas fills the whole window from its top-left corner. Put the canvas beside a sidebar, below a header, or partway down a page that scrolls, and the ray goes somewhere other than the pointer. `getBoundingClientRect()` gives where the canvas is on the screen right now, scrolling included.

Try both buttons, then move the pointer or the sliders. This canvas sits beside the sidebar and partway down the page, so with the window's size the ring and the hit part company.

<div data-scene="canvasRect"></div>

### Three more ways to get it wrong

- **No minus sign on y.** The page's y runs down and NDC's runs up, so the y line is flipped. Without the minus, pointing near the top casts the ray near the bottom.
- **`canvas.width` instead of the rect's width.** After `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, `canvas.width` counts device pixels, while `clientX` counts CSS pixels. At a ratio of 2, pointing at the right edge lands in the middle.
- **Listening on `window`.** Clicks on buttons and panels outside the canvas then pick things too. Listen on `renderer.domElement`. Orbiting with the mouse also fires `pointerdown`; telling a click from a drag is the click vs drag page, in the interaction domain.

### Hover

For hover highlighting, save the pointer in a `pointermove` handler and raycast from it once per frame, in the frame loop. The camera is current there, and the highlight stays right while the camera moves under a mouse that's standing still. Each raycast is CPU work, so once a frame is plenty.

### The camera it reads

`setFromCamera` reads the camera's saved `matrixWorld` and its projection matrix; it doesn't refresh them. In a click handler that's fine, since the last render left them current. After moving the camera in code, call `camera.updateMatrixWorld()` first, as on the update timing page, and after changing `fov` or `aspect`, `camera.updateProjectionMatrix()`.

It gives a direction of length 1, so the ray page's warning about `set` doesn't apply.

### Which space is it in?

This page works from **CSS pixels**, through **NDC**, out into **the world**.

| Value | Space |
| --- | --- |
| `event.clientX`, `event.clientY` | CSS pixels from the window's top-left corner, y down |
| `event.clientX - rect.left`, `event.clientY - rect.top` | CSS pixels from the canvas's top-left corner, y down |
| `pointer` after the two lines | NDC: −1 to 1 across the canvas and up |
| `canvas.width`, `canvas.height` | Device pixels, so don't mix them with `clientX` |
| `raycaster.ray.origin` | The world: the camera's position |
| `raycaster.ray.direction` | A direction in the world, length 1 |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
