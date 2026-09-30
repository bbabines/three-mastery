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

> **In short:** Mouse, touch, and pen input all arrive as the same events, with the spot measured from the window, not the canvas.
>
> **Used for:** Clicking parts, tapping hotspots on a phone, sketching with a stylus, and hover highlights.

## A · The basics

### One set of events for every kind of pointer

A mouse, a finger, and a pen all send the same events: `pointerdown` when pressed, `pointermove` when moved, `pointerup` when lifted, and `pointercancel` when the browser takes over, for example to scroll the page. `event.pointerType` says which kind sent it (`'mouse'`, `'touch'`, or `'pen'`), so one handler covers all three.

**Analogy: a USB port.** A mouse, a keyboard, and a drawing tablet all plug into the same port and speak the same way. Each one also says what kind of device it is.

### Where on the canvas?

`event.clientX` and `clientY` are CSS pixels from the top-left corner of the browser window, not of the canvas. Subtract the canvas's own corner, then turn the spot into **NDC** (normalized device coordinates), where the canvas runs from −1 to 1 across and up, whatever its size:

```js
const rect = canvas.getBoundingClientRect();
ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
```

The ray from pointer page takes it from there.

Move the pointer over the floor, or use the sliders: the ball lands under it. Then pick the second line and raise the pixel ratio, and the ball runs away from the pointer.

<div data-scene="pixelRatio"></div>

## B · Working knowledge

### Listening on the canvas

```js
const canvas = renderer.domElement;
canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointermove', onPointerMove);
canvas.style.touchAction = 'none'; // a finger drag moves the scene, not the page
```

Listen on the canvas, not the window, so a press on an HTML button over it doesn't also pick the part underneath. Without `touchAction = 'none'`, a finger drag scrolls the page and the browser cancels your drag. OrbitControls sets it for you.

### The pixel ratio stays out of it

```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
```

This sharpens the picture by drawing more device pixels, and the cap at 2 keeps the cost down. Pointer events and the canvas's rectangle stay in CSS pixels, and NDC is a fraction of the canvas, the same in either unit. Multiply only the pointer by `devicePixelRatio` and every click lands twice as far from the corner on a ratio-2 screen, while a ratio-1 screen hides the bug.

### Which space is it in?

This page works between **screen pixels** and **NDC**.

| Value | Space |
| --- | --- |
| `event.clientX`, `event.clientY` | CSS pixels from the window's top-left corner |
| `event.clientX - rect.left` | CSS pixels from the canvas's top-left corner |
| `canvas.width` | Device pixels: CSS pixels times the pixel ratio |
| `ndc` | NDC: −1 to 1 across and up |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
