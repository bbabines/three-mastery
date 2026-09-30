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

> **In short:** Measure how far the pointer traveled between the press and the release: a few pixels is a click, more is a drag.
>
> **Used for:** Selecting parts in an orbit viewer, telling a tap from a pan, long presses, and slider knobs.

## A · The basics

### The browser's click doesn't care how far you moved

After `pointerdown` and `pointerup`, the browser also sends a `click` whenever both landed on the same element, however far the pointer traveled. Every orbit starts and ends on the canvas, so a `click` handler that selects things picks whatever is under the pointer when an orbit ends.

The fix is to measure how far the pointer has gone since the press. Within a few pixels it's a click; past that it's a drag, even if the pointer comes back. That's usually about 5 CSS pixels for a mouse, and more for a finger, which wobbles.

**Analogy: a tap and a swipe on a phone.** Both start and end with your finger on the glass. What tells them apart is how far it traveled in between.

Pick each rule and press "Orbit and come back": only the last rule doesn't select. Set the slider to 0 and it selects, like a real click.

<div data-scene="threshold"></div>

## B · Working knowledge

### Selecting only on a click

```js
start.set(event.clientX, event.clientY);                                         // pointerdown
if (now.set(event.clientX, event.clientY).distanceTo(start) > 5) dragged = true; // pointermove
if (!dragged) selectUnder(event);                                                // pointerup
```

Reset `dragged` on each press. Checking that the press and the release landed on the same part proves nothing, since an orbit around a product usually starts and ends over it. OrbitControls doesn't stop the events it uses, so these listeners still run during an orbit.

### Keeping a drag going off the canvas

```js
canvas.setPointerCapture(event.pointerId); // in the pointerdown handler
```

Without capture, a mouse drag that leaves the canvas loses its `pointerup`, so the drag sticks and follows the pointer with the button up. With it, every event for that pointer goes to the canvas until the release. OrbitControls and TransformControls capture for you.

### Long press

```js
canvas.addEventListener('pointerdown', (event) => {
  pressTimer = setTimeout(() => openMenu(event), 500); // held for half a second
});
canvas.addEventListener('pointerup', () => clearTimeout(pressTimer));
```

Clear the timer on `pointercancel` too, and once the pointer passes the threshold: a finger that slides is panning, not pressing.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
