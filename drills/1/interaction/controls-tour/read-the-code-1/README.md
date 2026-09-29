---
id: 1.interaction.controls-tour.read-the-code.1
loop: 1
tier: light
concepts: [interaction.controls-tour]
mode: read-the-code
context: interaction.controls-tour/product-orbit
lenses: []
misconceptions:
  - interaction.controls-tour/damping-update
  - interaction.controls-tour/add-controls
---

# Tour: controls

> **In short:** Controls are three.js add-ons that turn the mouse, touch, and keys into moves: `OrbitControls` swings the camera around a point, `TransformControls` moves one object by its drag handles, and `PointerLockControls` turns the camera with the mouse like a first-person game.
>
> **Used for:** Spinning a product in an online store; dragging a part into place in an editor or a configurator; walking through a showroom or a building plan like a game; and panning around a floor plan.

## A · The basics

### Input in, moves out

The pages so far moved things with code. Controls move them with the user's hands: they listen for pointer and key events on the canvas and change an object's `position` and `rotation`, usually the camera's. They aren't part of three.js's core. Each one is imported from `three/addons/controls/`, and every scene on these pages already runs an `OrbitControls`.

They share a small base class, `Controls`: the object they move (`controls.object`), the element they listen on, an `enabled` switch, `update()`, and `dispose()`, which removes their listeners.

**Analogy: three ways to look at a car in a showroom.** Walk around it (orbit), push it to a new spot (transform), or sit in the driver's seat and turn your head (pointer lock).

### The members, at a glance

| Member | What it moves | Pick it for | Cost |
| --- | --- | --- | --- |
| `OrbitControls` | The camera, around a target point | Product viewers, inspecting a model | A little CPU math each time `update()` runs |
| `TransformControls` | One object you attach, by its handles | Editors, placing and turning parts | A raycast against its handles on each pointer move |
| `PointerLockControls` | The way the camera faces, from mouse movement, with the cursor hidden | First-person walkthroughs | A little CPU math per mouse move |

Others are built the same way, such as `MapControls` (OrbitControls with the left button set to pan, for maps and floor plans) and `DragControls` (drag whole objects with the pointer). This page only maps them out: the orbit, pan, dolly page covers the orbit camera's moves, the drag pages later in this domain cover moving objects, and the controls coexistence page covers running two at once.

Try each one. The readout shows its setup lines and what it's changing.

<div data-scene="members"></div>

## B · Working knowledge

### OrbitControls

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);   // the point it circles and looks at
controls.enableDamping = true;  // glide to a stop after the user lets go
// in the frame loop, before rendering:
controls.update();
```

- **Damping needs `update()` every frame.** The glide happens a step at a time, inside `update()`. Without it in the frame loop, the camera only moves while the pointer moves: it lags behind, falls short of the drag, and stops dead when the pointer stops. Call `update()` after moving the camera or the target in code, too.
- It turns the camera with `lookAt(controls.target)` on every update, so a turn you give the camera yourself is undone on the next frame. Move `controls.target` instead.

### TransformControls

```js
import { TransformControls } from 'three/addons/controls/TransformControls.js';

const gizmo = new TransformControls(camera, renderer.domElement);
gizmo.attach(crate);            // the object it moves, already in the scene
scene.add(gizmo.getHelper());   // the handles you see and grab
gizmo.setMode('rotate');        // 'translate' (the default), 'rotate', or 'scale'
```

- **Add its helper, not the controls.** In r186 `TransformControls` isn't an Object3D. `scene.add(gizmo)` logs "object not an instance of THREE.Object3D" to the console and adds nothing, so no handles appear.
- It listens to the same presses as `OrbitControls`, so dragging a handle also orbits the view unless you switch the orbit off while it drags. The controls coexistence page covers it.

### PointerLockControls

```js
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const look = new PointerLockControls(camera, renderer.domElement);
startButton.addEventListener('click', () => look.lock()); // hides the cursor
look.addEventListener('unlock', () => showMenu());         // the user pressed Esc
look.moveForward(speed * delta);                           // from your own key handling
```

- **Locking needs a click or a key press first.** Browsers refuse the lock unless the user has just interacted with the page, so call `lock()` from a click handler, never as the page loads. Esc always unlocks.
- It only turns the camera. Walking is your own key handling, with `moveForward` and `moveRight`, which stay level with the floor.

### Which space is it in?

| Value | Space |
| --- | --- |
| `controls.target` | The world |
| `camera.position`, as the controls change it | Measured from its parent: the world, for a camera with no parent |
| What `TransformControls` writes into the attached object | Its `position`, `quaternion`, and `scale`, measured from its parent |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
