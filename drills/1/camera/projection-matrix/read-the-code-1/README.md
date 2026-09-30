---
id: 1.camera.projection-matrix.read-the-code.1
loop: 1
tier: core
concepts: [camera.projection-matrix]
mode: read-the-code
context: camera.projection-matrix/zoom-dolly
lenses: []
misconceptions:
  - camera.projection-matrix/fov-horizontal
  - camera.projection-matrix/fov-dolly
---

# Projection matrix

> **In short:** The camera's lens: how wide it sees and how near and far it draws, which decides where each spot lands on the view.
>
> **Used for:** Zooming a view, flat product thumbnails and floor plans, isometric games, and how far a scene draws.

## A · The basics

### The lens step

The view matrix page measured every spot from the camera. That doesn't yet say where on the view the spot lands: a spot 1 unit right of center lands near the edge when it's close, and near the middle when it's far. The lens decides that.

In three.js, the lens is the camera's **projection matrix**. It's a saved transform too, but instead of a move, a turn, and a resize, it holds the lens. You never fill it in yourself; three.js builds it from the camera's settings:

```js
const camera = new PerspectiveCamera(50, width / height, 0.1, 100); // fov, aspect, near, far
```

`fov` is how wide the view opens, in degrees, from the bottom of the view to the top, not side to side. `aspect` is the picture's width divided by its height, and the side-to-side angle follows from the two. `near` and `far` are the nearest and farthest distances drawn. The space in between, a pyramid with its tip cut off, is the **frustum**.

### Zooming isn't moving closer

A smaller `fov` zooms in: a smaller slice of the world fills the picture, and everything in it grows by the same amount. Moving closer, a **dolly**, grows nearby things much more than distant ones.

**Analogy: the zoom on a phone camera.** Zooming in narrows what the lens takes in, so everything looks bigger. You haven't moved.

Pick a button, then frame the blue sign tighter. It fills the same share of the picture either way. Watch the orange sign behind it: with the zoom it stays half the blue sign's height, and with the dolly it shrinks.

<div data-scene="zoomVsDolly"></div>

<details>
<summary>The math, if you're curious</summary>

`fov` is the **vertical FOV**. The side-to-side angle follows from it and the aspect: 2 × atan(tan(fov ÷ 2) × aspect). At `fov` 50 on a canvas twice as wide as it is tall, that's about 86°.

</details>

## B · Working knowledge

### Changing the lens

```js
camera.fov = 30; // or aspect, near, far, zoom
camera.updateProjectionMatrix();
```

three.js doesn't rebuild the projection matrix when it renders, so a new setting changes nothing on screen until `updateProjectionMatrix()` runs. `camera.zoom = 2` narrows the view like a smaller `fov`. OrbitControls' mouse wheel dollies a perspective camera, though its setting is called `enableZoom`.

### Orthographic cameras

An `OrthographicCamera` sees without perspective: things stay the same size at any distance. Instead of an angle, it sees a box, in world units from the camera's center:

```js
const camera = new OrthographicCamera(-4, 4, 3, -3, 0.1, 100); // left, right, top, bottom, near, far
```

It's the usual choice for product thumbnails that compare real sizes, floor plans, and isometric views, where it sits on a diagonal and looks down. Moving it closer changes nothing about sizes, so zoom with `camera.zoom`. Switch cameras, then move the camera away: with the orthographic one, every rack stays the same size.

<div data-scene="perspectiveVsOrtho"></div>

### near and far

`near` and `far` cut the view off point by point, not object by object: a building running past `far` is sliced there. Set `far` to reach the farthest thing in the scene, and keep `near` as large as the scene allows; the depth precision page explains why.

### Which space is it in?

This page works between **measured from the camera** and **clip space**, the step before NDC.

| Value | Space |
| --- | --- |
| `camera.projectionMatrix` | Converts from measured from the camera, to clip space |
| `camera.fov` | An angle in degrees, bottom to top |
| An OrthographicCamera's `left`, `right`, `top`, `bottom` | World units, from the camera's center |
| `camera.near`, `camera.far` | Distances in front of the camera, along the way it faces |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
