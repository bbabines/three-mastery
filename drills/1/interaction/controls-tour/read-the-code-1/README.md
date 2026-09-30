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

> **In short:** Controls listen to the user's mouse, touch, and keys and move the camera or an object for you.
>
> **Used for:** Spinning a product in a store, placing parts in an editor, walking through a showroom, and panning a floor plan.

## A · The basics

### Input in, moves out

Controls move things with the user's hands. They listen for pointer and key events on the canvas and change an object's `position` and `rotation`, usually the camera's. They're add-ons, each imported from its own file:

```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

They share a small base: the object they move (`controls.object`), an `enabled` switch, `update()`, and `dispose()`, which removes their listeners.

**Analogy: three ways to look at a car in a showroom.** Walk around it (orbit), push it to a new spot (transform), or sit in the driver's seat and turn your head (pointer lock).

### The members, at a glance

| Member | What it moves | Pick it for | Cost |
| --- | --- | --- | --- |
| `OrbitControls` | The camera, around a target point | Product viewers, inspecting a model | A little CPU math each `update()` |
| `TransformControls` | One object, by its drag handles | Editors, placing and turning parts | A raycast at its handles on each pointer move |
| `PointerLockControls` | The way the camera faces, cursor hidden | First-person walkthroughs | A little CPU math per mouse move |

Others work the same way, like `MapControls` (an orbit whose left button pans) and `DragControls` (drag whole objects). The orbit, pan, dolly page covers the orbit camera's moves, the drag on a plane page covers moving objects yourself, and the controls coexistence page covers running two at once.

Try each button: orbit the view, drag the crate's arrows, then lock the pointer and look around.

<div data-scene="members"></div>

## B · Working knowledge

### OrbitControls

```js
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);  // the point it circles and looks at, in the world
controls.enableDamping = true; // glide to a stop after the user lets go
controls.update();             // in the frame loop, before rendering
```

Damping glides a step at a time inside `update()`, so without it in the frame loop the camera lags the drag and stops dead on release. `update()` also aims the camera at the target, so turn the view by moving `controls.target`, not the camera.

### TransformControls

```js
const gizmo = new TransformControls(camera, renderer.domElement);
gizmo.attach(crate);          // the object it moves, already in the scene
scene.add(gizmo.getHelper()); // the handles you see and grab
gizmo.setMode('rotate');      // or 'translate' (the default) or 'scale'
```

The controls themselves aren't an object in the scene, so `scene.add(gizmo)` logs an error and no handles appear. Dragging a handle also orbits the view until you switch the orbit off during the drag.

### PointerLockControls

```js
const look = new PointerLockControls(camera, renderer.domElement);
startButton.addEventListener('click', () => look.lock()); // hides the cursor
look.addEventListener('unlock', () => showMenu());         // the user pressed Esc
look.moveForward(speed * delta);                           // from your own key handling
```

Browsers refuse the lock until the user clicks or presses a key, so call `lock()` from a click handler, never as the page loads. It only turns the camera. Walking is your own key handling, and `moveForward` and `moveRight` stay level with the floor.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
