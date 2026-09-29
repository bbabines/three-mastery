---
id: 1.interaction.orbit-pan-dolly.read-the-code.1
loop: 1
tier: light
concepts: [interaction.orbit-pan-dolly]
mode: read-the-code
context: interaction.orbit-pan-dolly/product-viewer
lenses: []
misconceptions:
  - interaction.orbit-pan-dolly/dolly-is-zoom
---

# Orbit, pan, dolly

> **In short:** Orbit swings the camera around a target point, pan slides the camera and the target together across the view, and dolly moves the camera toward or away from the target, which isn't the same as zooming the lens.
>
> **Used for:** Turning a product in an online store; sliding around a floor plan seen from above; moving in close to check a small detail, like a screw; and a turntable that spins a model on its own.

## A · The basics

### Three moves around one point

`OrbitControls`, from the controls tour, keeps a **target**, `controls.target`: the point the camera always looks at.

- **Orbit** (left drag) moves the camera around the target on a ball, at the same distance, using the spherical coordinates from the spherical coordinates page. The target stays put.
- **Pan** (right drag) slides the camera and the target together, along the camera's own right and up. The view keeps its angle, and everything slides across the screen.
- **Dolly** (the wheel) moves the camera along the line to the target, closer or farther. The target stays put.

**Zoom** is a fourth thing, and it doesn't move the camera at all: it narrows the lens, with `fov` or `camera.zoom`, as on the projection matrix page.

**Analogy: a statue in a museum.** Walk around it (orbit), step sideways along the gallery (pan), step toward it (dolly), or stay where you are and look through binoculars (zoom).

### Dolly and zoom look different

Dolly in until the speaker is twice as big, or zoom in twice as far, and the speaker ends up the same size either way. The posts behind it don't. A dolly brings the camera much closer to the speaker but only a little closer to the posts, so they grow less. A zoom enlarges everything by the same amount, and the depth looks flatter.

Try each move with the slider. At the far end, dolly and zoom make the speaker the same size: compare the posts.

<div data-scene="moves"></div>

## B · Working knowledge

### The settings for each move

```js
controls.target.set(0, 1, 0);          // what it circles; call controls.update() after changing it
controls.enablePan = false;            // keeps a product viewer centered on the product
controls.minDistance = 2;              // dolly limits, for a perspective camera
controls.maxDistance = 12;
controls.maxPolarAngle = Math.PI / 2;  // never orbit below the floor
controls.autoRotate = true;            // a turntable: call controls.update(delta) every frame
```

- Orbit is a left drag or one finger. Pan is a right drag, a left drag with Shift, Ctrl, or Cmd held, or two fingers. Dolly is the wheel, a middle drag, or a pinch.
- `autoRotate` turns a set amount per `update()`, so pass the frame's seconds, `controls.update(delta)`, or it spins twice as fast on a 120 Hz screen. The frame-rate-independent motion page covers why.

### The wheel is a dolly, whatever it's called

OrbitControls calls its dolly "zoom": `enableZoom`, `zoomSpeed`. With a perspective camera the wheel changes the distance to the target, and `minDistance` and `maxDistance` limit it. With an orthographic camera, moving closer changes nothing about sizes, so the wheel really does change `camera.zoom`: limit it with `minZoom` and `maxZoom`, since `maxDistance` does nothing there.

Each wheel step covers a share of the distance that's left, so a dolly slows down near the target and never passes it. To get closer to a detail, move the target to it (the focus on object page), or set `controls.zoomToCursor = true` to dolly toward the spot under the pointer.

### A floor plan from above

`MapControls` is OrbitControls set up for maps: a left drag pans, a right drag orbits, and panning slides along the floor instead of the screen (`screenSpacePanning = false`), so dragging never lifts the view off the ground.

### Moving it from code

`controls.rotateLeft(angle)`, `rotateUp(angle)`, `pan(dx, dy)` in CSS pixels, `dollyIn(scale)`, and `dollyOut(scale)` do what the pointer does, for buttons like "turn left" or "closer". `dollyIn(0.5)` halves the distance to the target. `controls.saveState()` stores a view and `controls.reset()` jumps back to it.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
