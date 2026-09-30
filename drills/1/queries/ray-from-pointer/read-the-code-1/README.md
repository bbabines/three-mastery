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

> **In short:** A click lands on one spot of a flat screen, and three.js turns it into a ray from the camera through that spot.
>
> **Used for:** Clicking to select a part, hover highlights, starting a drag, and dropping furniture where you point.

## A · The basics

### From a spot on the screen to a ray in the world

A click gives you a spot on the screen, but the scene is 3D. Every point on a line straight out from the camera lands on that same spot, so a click really picks a line. That line, from the camera out through the spot, is a ray.

Three steps get you there. The pointer event says where the mouse is, in CSS pixels. You measure that against the canvas and turn it into **NDC**, where −1 to 1 runs across the canvas and up it. Then `raycaster.setFromCamera(pointer, camera)` builds a ray that starts at the camera and points through that spot.

**Analogy: pointing through a window.** Put your finger on the glass over a tree, and the line from your eye through your fingertip runs on to the tree. Your eye is the camera, and the glass is the screen.

Move the pointer with the sliders. The red ray runs from the camera in the scene through the dot on its screen, and the picture in the top-right corner is what it sees.

<div data-scene="throughTheView"></div>

<details>
<summary>The math, if you're curious</summary>

For a perspective camera, `setFromCamera` **unprojects** the NDC spot: it takes it back through the lens to a point in the world, then aims the ray from the camera's position at that point.

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

`pickable` is your target list: the objects that can be picked. Reading the hits is the intersection anatomy page.

### Measure the canvas, not the window

Many examples divide by `window.innerWidth`. That only works when the canvas fills the window from its top-left corner; beside a sidebar or partway down a page that scrolls, the ray goes somewhere else. `getBoundingClientRect()` gives where the canvas is right now, scrolling included.

The y line has a minus sign because the page's y runs down and NDC's runs up. And divide by `rect.width`, never `canvas.width`: after `setPixelRatio`, the canvas counts device pixels while `clientX` counts CSS pixels.

Try both buttons, then move the pointer or the sliders. With the window's size, the hit lands away from the ring.

<div data-scene="canvasRect"></div>

### Hover, and a camera moved in code

For hover, save the pointer in a `pointermove` handler and raycast from it once per frame, so the highlight stays right while the camera moves under a still mouse. `setFromCamera` reads the camera's saved matrices without refreshing them, so after moving the camera in code, call `camera.updateMatrixWorld()` first.

### Which space is it in?

| Value | Space |
| --- | --- |
| `event.clientX`, `clientY` | CSS pixels from the window's top-left corner |
| `event.clientX - rect.left` | CSS pixels from the canvas's top-left corner |
| `pointer` | NDC: −1 to 1 across the canvas and up |
| `raycaster.ray` | The world, starting at the camera |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
