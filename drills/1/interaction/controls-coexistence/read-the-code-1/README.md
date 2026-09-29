---
id: 1.interaction.controls-coexistence.read-the-code.1
loop: 1
tier: light
concepts: [interaction.controls-coexistence]
mode: read-the-code
context: interaction.controls-coexistence/transform-controls
lenses: []
misconceptions:
  - interaction.controls-coexistence/ignore-each-other
---

# Controls coexistence

> **In short:** Every controls object listens to the same pointer on the same canvas and knows nothing about the others, so while a gizmo or your own drag is moving something, switch the camera controls off.
>
> **Used for:** A move gizmo in an editor next to an orbiting camera; dragging parts around in a configurator you can also spin; HTML buttons and labels on top of a 3D view; and a measuring tool that draws with the pointer.

## A · The basics

### Every listener hears every press

The controls tour showed that each controls object adds its own pointer listeners to the canvas. None of them knows the others exist. Press on a gizmo's arrow with both running, and `TransformControls` starts moving the crate while `OrbitControls` starts orbiting the view. The view swings, and because the camera moves under the pointer, the crate slides somewhere unexpected too.

The fix is one line: when the gizmo starts dragging, switch the orbit off, and when it stops, switch it back on. `controls.enabled = false` makes a controls object ignore the pointer.

**Analogy: two waiters at one table.** Both hear "the check, please", and with no word between them, both bring a bill.

Drag one of the gizmo's arrows, or use the slider, which replays a drag of the X arrow. With nothing wired, the view orbits during the drag too. With the listener, only the crate moves.

<div data-scene="bothMove"></div>

## B · Working knowledge

### A gizmo and the orbit

```js
gizmo.addEventListener('dragging-changed', (event) => {
  controls.enabled = !event.value; // off while a handle is dragged, back on after
});
```

`dragging-changed` fires when a drag on a handle starts, with `value` true, and when it ends, with `value` false.

### Your own drag

```js
canvas.addEventListener('pointerdown', (event) => {
  if (!partUnder(event)) return; // empty space: leave the press to the orbit
  controls.enabled = false;
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointerup', () => (controls.enabled = true));
```

- Only switch the orbit off when the press lands on something draggable, so a drag on empty space still orbits.
- `OrbitControls` stops reacting to pointer moves the moment `enabled` is false, even partway into its own drag, and it still tidies up on the release.
- **`enabled = false` doesn't stop a glide.** With damping on, `update()` keeps spending the leftover motion, so a view that was flicked just before the press drifts on for a moment.

### HTML on top of the canvas

An HTML element over the canvas gets the pointer events where it sits, and the canvas under it gets none. That's right for a button. But a layer of labels that covers the whole view blocks the orbit everywhere. Let the layer pass the pointer through, and catch it only on the parts meant to be clicked:

```js
labelLayer.style.pointerEvents = 'none';
buyButton.style.pointerEvents = 'auto';
```

The 3D-to-2D anchoring page builds a layer like this.

### The gizmo shows up in raycasts

The gizmo's helper is part of the scene, so a raycast against `scene.children` also hits its handles, including invisible ones it uses for picking: 11 hits from a single ray in the r186 check. Raycast a list of your own parts instead, as the filtering page in the spatial queries domain covers.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
