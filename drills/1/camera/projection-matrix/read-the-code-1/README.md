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

> **In short:** The projection matrix is the camera's lens: it holds how wide the camera sees and how near and far it draws, and it decides where on the view each spot in front of the camera lands.
>
> **Used for:** Zooming a view in and out; product thumbnails and floor plans drawn without perspective; isometric-style games and diagrams; and choosing how far a scene is drawn before distant things are cut off.

## A · The basics

### The lens step

The view matrix page measured every spot from the camera: how far right, up, and in front. That doesn't yet say where on the view the spot lands. A spot 1 unit to the right of the camera's center lands near the edge of the view when it's close, and near the middle when it's far away. The camera's lens decides that.

In three.js, the lens is the camera's **projection matrix**, `camera.projectionMatrix`. It's a saved transform too, but instead of a move, a turn, and a resize, it holds the lens: how wide the camera sees, and the nearest and farthest distances it draws. You never fill it in yourself. You set the camera's settings, and three.js builds the matrix from them.

### A perspective camera's settings

Most scenes use a `PerspectiveCamera`, which sees the way an eye or a phone camera does: things look smaller the farther away they are.

```js
const camera = new PerspectiveCamera(50, width / height, 0.1, 100); // fov, aspect, near, far
```

- **`fov`**, the field of view, is how wide the view opens, as an angle **in degrees, from the bottom of the view to the top**. A smaller angle shows a smaller slice of the world, so what's in it looks bigger.
- **`aspect`** is the picture's width divided by its height. How wide the view opens from side to side follows from `fov` and `aspect` together.
- **`near`** and **`far`** are the nearest and farthest distances in front of the camera that get drawn. Anything closer than `near` or farther than `far` is cut off.

The space the camera can see is shaped like a pyramid lying on its side, with its tip at the camera and cut off at `near`. It's called the **frustum**, and it has its own page.

**Analogy: the zoom on a phone camera.** Zooming in narrows what the lens takes in, so a smaller slice of the world fills the picture and everything in it looks bigger. You haven't moved. Lowering `fov` is zooming in.

### Zooming isn't moving closer

Both make the thing you're looking at bigger, but they give different pictures. Zooming (a smaller `fov`) enlarges everything by the same amount, near and far. Moving closer, called a **dolly**, enlarges nearby things much more than distant ones, because you got closer to them by a bigger share of their distance.

The camera below frames the blue sign, and the picture in the top-right corner is what it sees. Pick a button, then frame the blue sign tighter. It fills the same share of the picture either way, but the orange sign twice as far away doesn't: with the zoom it stays half the blue sign's height, and with the dolly it shrinks to less than a third.

<div data-scene="zoomVsDolly"></div>

<details>
<summary>The math, if you're curious</summary>

The names you'll see in docs and forums: `fov` is the **vertical FOV**, and the side-to-side angle is the **horizontal FOV**. The two are linked by the aspect:

horizontal FOV = 2 × atan(tan(vertical FOV ÷ 2) × aspect)

So `fov` 50 on a canvas twice as wide as it is tall sees about 86° from side to side. A perspective camera does a **perspective projection**, and an orthographic camera an **orthographic projection**.

</details>

## B · Working knowledge

### After changing a setting, call updateProjectionMatrix

```js
camera.fov = 30;
camera.updateProjectionMatrix();
```

The projection matrix is a saved copy, and unlike `matrixWorld`, three.js doesn't rebuild it when it renders. Setting `fov`, `aspect`, `near`, `far`, or `zoom` changes nothing on screen until you call `updateProjectionMatrix()`. The aspect and resize page covers the most common case, a resized canvas.

### fov is measured top to bottom

three.js's `fov` is the vertical angle. The side-to-side angle depends on the aspect: `fov` 50 sees about 86° across on a canvas twice as wide as it is tall, and only about 26° across on a portrait phone screen half as wide as it is tall. Some other tools and many game settings menus measure FOV side to side, so a value copied from one of them gives a different view in three.js. The fit to bounds page uses the side-to-side angle to keep a model in view on narrow screens.

### Zoom vs dolly

- **Zoom:** a smaller `fov`, or `camera.zoom = 2`, which narrows the view the same way without changing `fov`. Near and far things grow by the same amount, and the camera doesn't move, so it never ends up inside what it's looking at.
- **Dolly:** move the camera closer. Nearby things grow faster than distant ones, which is how moving closer looks in real life.

OrbitControls' mouse wheel is a dolly for a perspective camera, even though its setting is called `enableZoom`. With an orthographic camera it changes `camera.zoom` instead, since moving an orthographic camera closer changes nothing about sizes.

### Orthographic cameras

An `OrthographicCamera` sees without perspective: things stay the same size however far away they are. Instead of an angle, it sees a box, set by how far its edges are from the camera's center, in world units:

```js
const camera = new OrthographicCamera(-4, 4, 3, -3, 0.1, 100); // left, right, top, bottom, near, far
```

That camera shows a slice of the world 8 units wide and 6 tall, at any distance. It's the usual choice for:

- **Thumbnails and technical views,** where products should compare at their real sizes, and floor plans seen from straight above.
- **Isometric views,** the look of many strategy games and diagrams: an orthographic camera placed on a diagonal and aimed down at the scene with `lookAt`.

To zoom, change `camera.zoom` and call `updateProjectionMatrix()`; moving it closer won't make anything bigger. It has no `aspect`: the box sets the picture's shape, so on a resize you change `left`, `right`, `top`, and `bottom`.

Switch between the two cameras, then move the camera away. With perspective, the far racks look smaller than the near ones, and all of them shrink as the camera backs off. With orthographic, every rack is the same size, at any distance.

<div data-scene="perspectiveVsOrtho"></div>

### near and far

`near` and `far` cut the view off at both ends, point by point. A building that runs from 15 to 30 units away, with `far` at 20, is drawn only up to 20 units: the rest vanishes as if sliced off. Set `far` to reach the farthest thing in the scene. Keep `near` as large as the scene allows; the depth precision page covers why it matters much more than `far`.

### Which space is it in?

This page works between two stops on the trip: **measured from the camera** and **clip space**, which the clip space, NDC, screen page covers.

| Value | Space |
| --- | --- |
| What `v.applyMatrix4(camera.matrixWorldInverse)` gives back | Measured from the camera |
| `camera.projectionMatrix` | Converts from measured from the camera, to clip space, the step before NDC |
| `camera.fov` | An angle in degrees, bottom to top |
| An OrthographicCamera's `left`, `right`, `top`, `bottom` | World units, measured from the camera's center |
| `camera.near`, `camera.far` | Distances in front of the camera, along the way it faces |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
