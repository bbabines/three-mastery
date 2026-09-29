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

> **In short:** Helpers are ready-made three.js objects that draw what a scene normally keeps invisible, like an object's axes, the box around it, what a camera or a shadow covers, or which way its normals point, so you can check it by eye.
>
> **Used for:** Checking which way a loaded part really faces; finding out why a shadow is cut off at one edge; making sure a bounding box fits a part before framing the camera on it; and seeing the plane a drag slides along.

## A · The basics

### Drawing what can't be seen

Much of what goes wrong in a scene can't be seen: which way an object's axes point, how big its bounds are, what a camera covers. A **helper** is an ordinary three.js object, mostly lines, that draws one of those. You add it to the scene like anything else, and remove it when you're done. Two are already in every scene on these pages: the floor grid is a `GridHelper`, and the red, green, and blue lines at the center are an `AxesHelper`.

**Analogy: chalk lines on a building site.** The builders snap lines on the floor to show where the walls go. Nobody lives in them, they're quick to add, and they're gone before the carpet goes down.

| Helper | Draws | Keeps up by itself? |
| --- | --- | --- |
| `AxesHelper(size)` | X in red, Y in green, Z in blue | Yes, as a child of the thing it marks |
| `ArrowHelper(dir, origin, length, color)` | One direction from a starting point | No: `setDirection` and `setLength`; the visualizing vectors page |
| `Box3Helper(box, color)` | A `Box3` you computed | Yes: it redraws from the box every frame |
| `BoxHelper(object, color)` | The box around an object and everything under it | No: `helper.update()` after the object moves |
| `CameraHelper(camera)` | What a camera can see: its frustum | Follows the camera; `helper.update()` after its lens changes |
| `GridHelper(size, divisions)` | A flat grid, for scale | Yes |
| `PlaneHelper(plane, size, color)` | A `Plane` as a square | Yes: it reads the plane every frame |
| `VertexNormalsHelper(mesh, size, color)` | A short line along each vertex normal | No: `helper.update()` after the mesh moves |

`VertexNormalsHelper` is an addon: `import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js'`. Each light type has one too, like `DirectionalLightHelper`.

Pick a helper. The slider changes the size of the box the sun's shadow is drawn from.

<div data-scene="helperTour"></div>

### CameraHelper draws shadows' cameras too

A light that casts shadows renders the scene from its own position into a shadow map, using a camera of its own: `light.shadow.camera` (the shadows page). For a directional light that camera sees a box, and anything outside the box casts no shadow, so the shadow is cut off at the box's edge. `new CameraHelper(sun.shadow.camera)` draws the box. Shrink it with the slider and watch the shadow get cut where the box ends.

## B · Working knowledge

### Setting them up

```js
part.add(new AxesHelper(0.8));        // the part's own axes, turning with it
const bounds = new BoxHelper(part);   // the box around the part, in the world
scene.add(bounds);
bounds.update();                      // after the part moves

const shadowView = new CameraHelper(sun.shadow.camera);
scene.add(shadowView);
sun.shadow.camera.left = -3;          // likewise right, top, and bottom
sun.shadow.camera.updateProjectionMatrix();
shadowView.update();                  // after changing the lens
```

The shadow camera only moves into place when shadows render, so its helper is right once `renderer.shadowMap.enabled` and `sun.castShadow` are on.

### Where to add them

- **`AxesHelper` and `ArrowHelper`** draw in the space of whatever they're added to. Added to a part, an `AxesHelper` shows the part's own axes; added to the scene, the world's.
- **`BoxHelper`, `CameraHelper`, and `VertexNormalsHelper`** work out their lines in the world already. Add them to the scene. Under a moved parent they get moved twice: a `VertexNormalsHelper` added to a mesh at x = 3 draws its lines at x = 6.

### Take them out before you measure

- **Raycasts hit them.** `raycaster.intersectObjects(scene.children)` returns hits on helpers too; the filtering page keeps them out.
- **They count.** Each one adds a draw call or two to `renderer.info`, and `Box3.setFromObject(scene)` includes them. Hide or remove them before measuring anything, and `dispose()` them when you're done.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
