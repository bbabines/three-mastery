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

> **In short:** Controls on one canvas all hear the same press, so switch the orbit off while something else is dragging.
>
> **Used for:** Editor gizmos beside an orbit camera, dragging parts in a configurator, HTML labels over a view, and measuring tools.

## A · The basics

### Every listener hears every press

Each controls object adds its own pointer listeners to the canvas, and none of them knows the others exist. Press a gizmo's arrow with an orbit running, and the crate moves while the view swings, so the crate slides somewhere unexpected too.

The fix is to switch the orbit off while the gizmo drags and back on after. `controls.enabled = false` makes a controls object ignore the pointer.

**Analogy: two waiters at one table.** Both hear "the check, please", and with no word between them, both bring a bill.

Pick each button, then drag one of the gizmo's arrows or use the slider. With nothing wired, the view orbits during the drag too.

<div data-scene="bothMove"></div>

## B · Working knowledge

### A gizmo and the orbit

```js
gizmo.addEventListener('dragging-changed', (event) => {
  controls.enabled = !event.value; // off while a handle is dragged, back on after
});
```

`dragging-changed` fires when a handle drag starts, with `value` true, and when it ends, with `value` false.

### Your own drag

```js
canvas.addEventListener('pointerdown', (event) => {
  if (partUnder(event)) controls.enabled = false; // empty space still orbits
});
canvas.addEventListener('pointerup', () => (controls.enabled = true));
```

`enabled = false` doesn't stop a glide. With damping on, `update()` still spends the leftover motion, so a view flicked just before the press drifts on for a moment.

### HTML on top of the canvas

An HTML element over the canvas takes the pointer where it sits, so a layer of labels covering the view blocks the orbit everywhere. Let the layer pass the pointer through, and catch it only where something is clickable:

```js
labelLayer.style.pointerEvents = 'none';
buyButton.style.pointerEvents = 'auto';
```

The 3D-to-2D anchoring page builds a layer like this.

### The gizmo shows up in raycasts

The gizmo's helper is in the scene, so a raycast against `scene.children` hits its handles too, including invisible ones it uses for picking. Raycast a list of your own parts instead.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
