---
id: 1.debugging.helpers.read-the-code.1
loop: 1
tier: light
concepts: [debugging.helpers]
mode: read-the-code
context: debugging.helpers/shadow-frustum
lenses: []
misconceptions:
  - debugging.helpers/camera-only
---

# Helpers

> **In short:** A helper is a line drawing of something you normally can't see, like an object's axes, its box, or a camera's view.
>
> **Used for:** Checking which way a part faces, fixing a cut-off shadow, checking a box before framing, and seeing a drag plane.

## A · The basics

### Drawing what can't be seen

Much of what goes wrong in a scene can't be seen: which way an object's axes point, how big its bounds are, what a camera covers. A **helper** is an ordinary three.js object, mostly lines, that draws one of those. You add it like anything else, and remove it when you're done.

**Analogy: chalk lines on a building site.** They show where the walls will go, they're quick to snap, and they're gone before the carpet goes down.

| Helper | Draws |
| --- | --- |
| `AxesHelper(size)` | X in red, Y in green, Z in blue |
| `ArrowHelper(dir, origin)` | One direction from a starting point |
| `BoxHelper(object)` | The box around an object and everything under it |
| `CameraHelper(camera)` | What a camera can see: its frustum |
| `VertexNormalsHelper(mesh, size)` | A short line along each vertex normal |
| `PlaneHelper(plane, size)` | A `Plane`, as a square |

### CameraHelper draws a shadow's camera too

A light that casts shadows renders the scene from its own camera, `light.shadow.camera`. For a directional light that camera sees a box, and anything outside the box casts no shadow. `new CameraHelper(sun.shadow.camera)` draws that box.

Pick a helper. With the CameraHelper on the shadow, shrink the shadow box and watch the shadow get cut off where the box ends.

<div data-scene="helperTour"></div>

## B · Working knowledge

### Marking a part

```js
part.add(new AxesHelper(0.8));      // the part's own axes, turning with it
const bounds = new BoxHelper(part); // the box around the part, in the world
scene.add(bounds);
bounds.update();                    // after the part moves
```

### Checking a shadow box

The helper is right once `renderer.shadowMap.enabled` and `sun.castShadow` are on, since the shadow camera only moves into place when shadows render. After resizing the box, update the lens and then the helper:

```js
sun.shadow.camera.left = -3;                // likewise right, top, and bottom
sun.shadow.camera.updateProjectionMatrix();
shadowView.update();                        // shadowView: the CameraHelper
```

### Where to add them

`AxesHelper` and `ArrowHelper` draw in the space of whatever they're added to: on a part, an `AxesHelper` shows the part's own axes. `BoxHelper`, `CameraHelper`, and `VertexNormalsHelper` work out their lines in the world already, so add them to the scene; under a moved parent they get moved twice.

### Take them out before you measure

Raycasts hit helpers, each one adds a draw call or two to `renderer.info`, and `Box3.setFromObject(scene)` includes them. Hide or remove them before measuring anything, and `dispose()` them when you're done.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
