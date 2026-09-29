---
id: 1.interaction.pointer-events.read-the-code.1
loop: 1
tier: light
concepts: [interaction.pointer-events]
mode: read-the-code
context: interaction.pointer-events/click
lenses: []
misconceptions:
  - interaction.pointer-events/dpr-ndc
---

# Pointer events

> **In short:** Pointer events are the browser's one set of events for a mouse, a finger, or a pen, and their `clientX` and `clientY` are CSS pixels from the window's corner, so you subtract the canvas's rectangle to find the spot on the canvas.
>
> **Used for:** Clicking a part to select it; tapping a hotspot on a phone; sketching notes on a model with a stylus; and highlighting whatever the mouse is over.

## A · The basics

### One set of events for every kind of pointer

A mouse, a finger, and a pen all send the same events: `pointerdown` when pressed, `pointermove` when moved, `pointerup` when lifted, and `pointercancel` when the browser takes over, for example to scroll the page. `event.pointerType` says which kind sent it: `'mouse'`, `'touch'`, or `'pen'`. One handler covers all three, and three.js's own controls listen to these events.

**Analogy: a USB port.** A mouse, a keyboard, and a drawing tablet all plug into the same port and speak the same way, and each one says what kind of device it is.

### Where on the canvas?

`event.clientX` and `clientY` are CSS pixels from the top-left corner of the browser window, not of the canvas. The canvas usually sits somewhere else on the page, like the scenes here, to the right of the sidebar. Subtract the canvas's own corner, from `canvas.getBoundingClientRect()`, then turn the spot into NDC as on the clip space, NDC, screen page.

Move the pointer over the floor, or use the sliders. The ball goes where the ray through the pointer meets the floor. Then pick the second line and raise the pixel ratio: the ball runs away from the pointer, farther from the canvas's top-left corner.

<div data-scene="pixelRatio"></div>

## B · Working knowledge

### Listening on the canvas

```js
const canvas = renderer.domElement;
canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointermove', onPointerMove);
canvas.style.touchAction = 'none'; // a finger drag moves the scene, not the page
```

- **Listen on the canvas, not the window.** A press on an HTML button over the canvas then goes to the button only, so it doesn't also pick the part underneath.
- **Set `touch-action: none`.** Without it, a finger drag on a phone scrolls the page, and the browser sends `pointercancel` and stops sending your moves. `OrbitControls` and `TransformControls` set it on the canvas for you.
- `event.button` is 0 for the main button, a finger, or a pen tip, and 2 for a right-click.

### From the pointer to NDC

```js
const rect = canvas.getBoundingClientRect();
ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
```

The ray from pointer page in the spatial queries domain takes it from here. `event.offsetX` looks like a shortcut, but it measures from the canvas's padding edge and goes wrong with a border or a CSS transform.

### The pixel ratio stays out of it

```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
```

This sharpens the picture: `canvas.width` becomes the CSS width times the ratio, counted in device pixels. Pointer events and `getBoundingClientRect()` both stay in CSS pixels, and NDC is a fraction of the canvas, which is the same in either unit. Multiply only the pointer by `devicePixelRatio` and the fraction grows: on a screen with a ratio of 2, every click lands twice as far from the canvas's top-left corner. On a ratio-1 screen it works fine, so the bug only shows up on some screens. Dividing CSS pixels by `canvas.width` is the same mistake the other way round. Why the ratio is capped at 2 is about cost, which the resolution and DPR page in the optimization domain covers.

### Which space is it in?

This page works between **screen pixels** and **NDC**.

| Value | Space |
| --- | --- |
| `event.clientX`, `event.clientY` | CSS pixels from the window's top-left corner |
| `rect.left`, `rect.top` | CSS pixels: the canvas's corner, from the window's top-left corner |
| `event.clientX - rect.left` | CSS pixels from the canvas's top-left corner |
| `canvas.width`, `canvas.height` | Device pixels: CSS pixels times the pixel ratio |
| `ndc` | NDC: −1 to 1 across and up |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
