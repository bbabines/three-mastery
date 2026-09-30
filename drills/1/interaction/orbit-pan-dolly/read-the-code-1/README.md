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

> **In short:** Three ways to move a camera around the point it looks at, and moving closer isn't the same as zooming.
>
> **Used for:** Turning a product in a store, sliding around a floor plan, inspecting a small detail, and turntables.

## A · The basics

### Three moves around one point

OrbitControls keeps a **target**, `controls.target`: the point the camera always looks at.

- **Orbit** (left drag) swings the camera around the target at the same distance.
- **Pan** (right drag) slides the camera and the target together, along the camera's own right and up.
- **Dolly** (the wheel) moves the camera along the line to the target, closer or farther.

**Zoom** doesn't move the camera at all. It narrows the lens, with `fov` or `camera.zoom`.

**Analogy: a statue in a museum.** Walk around it (orbit), step sideways along the gallery (pan), step toward it (dolly), or stay put and use binoculars (zoom).

### Dolly and zoom look different

Dolly in until the speaker is twice as big, or zoom in twice as far, and the speaker ends up the same size. The posts behind it don't. A dolly brings the camera much closer to the speaker but only a little closer to the posts, while a zoom enlarges everything by the same amount.

Try each move with the slider. At the far end, dolly and zoom make the speaker the same size, so compare the posts.

<div data-scene="moves"></div>

## B · Working knowledge

### Setting up a product viewer

```js
controls.enablePan = false;           // keeps the view centered on the product
controls.minDistance = 2;             // dolly limits, for a perspective camera
controls.maxDistance = 12;
controls.maxPolarAngle = Math.PI / 2; // never orbit below the floor
```

To circle a different point, change `controls.target` and call `controls.update()`. Orbit is a left drag or one finger, pan a right drag or two fingers, and dolly the wheel or a pinch.

### A turntable

```js
controls.autoRotate = true;
controls.update(delta); // every frame; delta is the seconds since the last frame
```

`autoRotate` turns a set amount per update, so without `delta` it spins twice as fast on a 120 Hz screen.

### The wheel is a dolly, whatever it's called

OrbitControls calls its dolly "zoom" (`enableZoom`, `zoomSpeed`). With a perspective camera, the wheel changes the distance to the target. Moving an orthographic camera closer changes nothing about sizes, so there the wheel changes `camera.zoom`, and `maxDistance` does nothing:

```js
controls.minZoom = 0.5; // wheel limits for an orthographic camera
controls.maxZoom = 4;
```

Each wheel step covers a share of the distance left, so a dolly slows near the target and never passes it. To get close to a detail, move the target to it.

### A floor plan from above

`MapControls` is OrbitControls set up for maps: a left drag pans, a right drag orbits, and panning slides along the floor, so the view never lifts off the ground.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
