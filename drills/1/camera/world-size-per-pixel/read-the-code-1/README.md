---
id: 1.camera.world-size-per-pixel.read-the-code.1
loop: 1
tier: light
concepts: [camera.world-size-per-pixel]
mode: read-the-code
context: camera.world-size-per-pixel/hotspots
lenses: []
misconceptions:
  - camera.world-size-per-pixel/constant-size
---

# World size per pixel

> **In short:** One pixel on screen covers more of the world the farther away you look, so a marker that should stay the same size on screen has to grow in step with its depth in front of the camera.
>
> **Used for:** Hotspots and pins that stay the same size as you zoom; the move and rotate handles in editors; switching to a simpler model when an object is only a few pixels tall; and deciding whether a detail is too small to be worth drawing.

## A · The basics

### One pixel covers more, farther away

Things look smaller the farther away they are, as on the projection matrix page. Turned around: one pixel on screen covers a small patch of the world up close, and a bigger patch far away. Twice as deep in front of the camera, a pixel covers twice the width.

**Analogy: a finger held at arm's length.** It covers a coin on a table in front of you, a door across the street, and a whole house down the road. A pixel works the same way: the same pixel covers more of the world the farther away that part of the world is.

### Measuring it

At any depth, the view is a certain height in world units. Divide that by the canvas's height in pixels and you get the world size of one pixel. three.js gives you the first part: `camera.getViewSize(depth, size)` writes the width and height of the view, in world units, at that depth in front of the camera.

```js
const size = camera.getViewSize(depth, new Vector2());
const worldPerPixel = size.y / canvas.clientHeight;
```

The yellow hotspots sit at different depths. With a fixed size, near ones look big and far ones small, and all of them change as you zoom with the mouse wheel. Scaled by world size per pixel, each one stays 24 pixels tall wherever it is and however you zoom.

<div data-scene="hotspots"></div>

<details>
<summary>The math, if you're curious</summary>

What `getViewSize` works out, divided by the canvas height:

world per pixel = 2 × depth × tan(fov ÷ 2) ÷ (canvas height × zoom)

with `fov` in radians; three.js's `camera.fov` is in degrees. The depth is **view depth**, from the view matrix page.

</details>

## B · Working knowledge

### Keeping a hotspot the same size on screen

```js
const depth = -hotspot.position.clone().applyMatrix4(camera.matrixWorldInverse).z;
const worldPerPixel = camera.getViewSize(depth, size).y / canvas.clientHeight;
hotspot.scale.setScalar(24 * worldPerPixel); // 24 pixels tall, for a hotspot 1 unit tall
```

Run it every frame, after the camera moves. Things to get right:

- **Depth, not distance.** `getViewSize` wants view depth, straight along the way the camera faces, as on the view matrix page. `camera.position.distanceTo(hotspot.position)` is longer for anything off to the side, so hotspots near the edges of a wide view come out too big: 28 pixels instead of 24 at the edge of a view twice as wide as it is tall.
- **Which pixels.** `clientHeight` is in CSS pixels, the same kind as the page's icons and labels. `canvas.height` counts device pixels, twice as many at a pixel ratio of 2, so it gives a hotspot half the size.
- **Zoom.** `getViewSize` includes `camera.zoom`; a formula written by hand often forgets it.
- **Orthographic cameras** have the same world size per pixel at every depth, and no `getViewSize`: it's `(camera.top - camera.bottom) / camera.zoom / canvas.clientHeight`.

Two shortcuts skip the math for simple cases. `new PointsMaterial({ size: 8, sizeAttenuation: false })` draws every point 8 CSS pixels across. `new SpriteMaterial({ sizeAttenuation: false })` keeps a sprite the same share of the view's height at any depth, which isn't quite a fixed pixel size: it changes when the canvas does.

### Handles in an editor

The move and rotate handles in an editor, called a **gizmo**, stay the same size on screen as you zoom, the same way. three.js's `TransformControls` add-on scales its handles with their distance from the camera for this reason.

### Picking the level of detail

The same number says how many pixels an object covers: its height divided by the world size per pixel. An object only a few pixels tall looks the same drawn as a simple box as with all its detail. three.js's `LOD` object switches between versions of a model by distance from the camera:

```js
const lod = new LOD();
lod.addLevel(detailedRack, 0);
lod.addLevel(simpleRack, 40); // from 40 units away
```

The culling and LOD page in the optimization domain covers choosing those distances.

### Which space is it in?

This page links the two ends of the trip: **screen pixels** and **the world**, at a depth **measured from the camera**.

| Value | Space |
| --- | --- |
| `depth` | How far in front of the camera, along the way it faces, in world units |
| What `camera.getViewSize(depth, size)` gives back | World units: the view's width and height at that depth |
| `canvas.clientHeight` | CSS pixels |
| `canvas.height` | Device pixels: CSS pixels times the pixel ratio |
| `worldPerPixel` | World units per CSS pixel, at that depth |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
