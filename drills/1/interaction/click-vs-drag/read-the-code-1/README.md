---
id: 1.interaction.click-vs-drag.read-the-code.1
loop: 1
tier: light
concepts: [interaction.click-vs-drag]
mode: read-the-code
context: interaction.click-vs-drag/select-vs-orbit
lenses: []
misconceptions:
  - interaction.click-vs-drag/same-object-click
---

# Click vs drag

> **In short:** A press and a release count as a click only if the pointer barely moved in between; past a few pixels it's a drag, and pointer capture keeps a drag's events coming wherever the pointer goes.
>
> **Used for:** Selecting a part in a viewer without selecting it after every orbit; telling a tap from a pan on a touch-screen map; a long press that opens a menu on a phone; and a slider knob that keeps following the pointer when it slips off the track.

## A · The basics

### The browser's click doesn't care how far you moved

The pointer events page covered `pointerdown` and `pointerup`. After them, the browser also sends a `click` whenever both landed on the same element, however far the pointer traveled in between. On a 3D canvas every orbit starts and ends on the canvas, so every orbit also ends in a click, and a `click` handler that selects things picks whatever is under the pointer when the user lets go.

The fix is to measure: remember where the press started and how far the pointer has gone since. Within a few pixels, it's a click. Past that, it's a drag, and it stays a drag even if the pointer comes back. The threshold is a rule of thumb: about 5 CSS pixels for a mouse, and more for a finger, which wobbles.

**Analogy: a tap and a swipe on a phone.** Both start and end with your finger on the glass. What tells them apart is how far it traveled in between.

Each button is a different rule for selecting. "Orbit and come back" replays an orbit that starts and ends over the crate, as far as the slider says. Only the last rule tells that orbit from a click; set the slider to 0 and it selects, like a real click. You can also orbit, or click the parts, yourself.

<div data-scene="threshold"></div>

## B · Working knowledge

### The code

```js
const start = new Vector2();
const now = new Vector2();
let dragged = false;

canvas.addEventListener('pointerdown', (event) => {
  start.set(event.clientX, event.clientY);
  dragged = false;
});
canvas.addEventListener('pointermove', (event) => {
  if (now.set(event.clientX, event.clientY).distanceTo(start) > 5) dragged = true;
});
canvas.addEventListener('pointerup', (event) => {
  if (!dragged) selectUnder(event); // a click
});
```

- **Measure the farthest the pointer got,** not only where it let go. An orbit out and back ends near where it started.
- **Landing on the same part twice proves nothing.** Comparing the part under the press with the part under the release looks like a click test, but an orbit around a product usually starts and ends over the product.
- `OrbitControls` doesn't stop the events it uses, so your own listeners on the canvas still run during an orbit.

### Pointer capture keeps a drag going

```js
canvas.addEventListener('pointerdown', (event) => {
  canvas.setPointerCapture(event.pointerId);
});
```

Without capture, a mouse drag that leaves the canvas stops getting `pointermove`, and the `pointerup` goes to whatever is under the pointer, so the canvas never hears the release: the drag sticks and follows the pointer with the button up when it comes back. With capture, every event for that pointer goes to the canvas until the release, which also ends the capture. Browsers already capture a finger on a touch screen this way; a mouse needs the call. `OrbitControls` and `TransformControls` capture for you.

### Long press

```js
canvas.addEventListener('pointerdown', (event) => {
  pressTimer = setTimeout(() => openMenu(event), 500); // held for half a second
});
canvas.addEventListener('pointerup', () => clearTimeout(pressTimer));
```

Also clear the timer on `pointercancel`, and once the pointer moves past the threshold: a finger that slides is panning, not pressing. Half a second is a common choice, not a standard.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
