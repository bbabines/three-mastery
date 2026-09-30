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

> **In short:** The same pixel shows a bigger patch of the world the deeper you look, which is why constant-size markers have to scale with depth.
>
> **Used for:** Hotspots that stay one size as you zoom, editor handles, picking a level of detail, and skipping tiny details.

## A · The basics

### One pixel covers more, farther away

Things look smaller the farther away they are. Turned around, a pixel on screen covers a small patch of the world up close and a bigger patch far away. Twice as deep in front of the camera, a pixel covers twice the width.

**Analogy: a finger at arm's length.** It covers a coin on the table, a door across the street, and a whole house down the road. A pixel works the same way.

### Measuring it

`camera.getViewSize(depth, size)` gives the width and height of the view, in world units, at a depth in front of the camera. Divide that height by the canvas's height in CSS pixels, and you have the world size of one CSS pixel at that depth.

Switch buttons, and scroll the mouse wheel to move closer and farther. At a fixed size, near hotspots look big and far ones small; scaled per pixel, each stays 24 CSS pixels tall.

<div data-scene="hotspots"></div>

<details>
<summary>The math, if you're curious</summary>

world per pixel = 2 × depth × tan(fov ÷ 2) ÷ (canvas height × zoom), with `fov` in radians. The depth is **view depth**, straight along the way the camera faces.

</details>

## B · Working knowledge

### Keeping a hotspot the same size on screen

```js
const depth = -hotspot.position.clone().applyMatrix4(camera.matrixWorldInverse).z;
const worldPerPixel = camera.getViewSize(depth, size).y / canvas.clientHeight;
hotspot.scale.setScalar(24 * worldPerPixel); // 24 CSS pixels, for a hotspot 1 unit tall
```

Run it every frame, after the camera moves. Use view depth, not `distanceTo`: the straight-line distance is longer for anything off to the side, so hotspots near the edges come out too big. Divide by `clientHeight`, in CSS pixels like the page's icons; `canvas.height` counts device pixels, so above a pixel ratio of 1 the hotspot comes out too small.

### Handles and level of detail

An editor's move and rotate handles, its **gizmo**, stay one size on screen the same way. The same number also says how many pixels an object covers, and one only a few pixels tall can be drawn as a simple box. three.js's `LOD` switches versions by distance:

```js
lod.addLevel(detailedRack, 0);
lod.addLevel(simpleRack, 40); // from 40 units away
```

### Which space is it in?

This page works between **screen pixels** and **the world**, at a depth **measured from the camera**.

| Value | Space |
| --- | --- |
| `depth` | How far in front of the camera, along the way it faces |
| What `camera.getViewSize(depth, size)` gives back | World units, at that depth |
| `worldPerPixel` | World units per CSS pixel, at that depth |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
