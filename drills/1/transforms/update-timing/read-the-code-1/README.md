---
id: 1.transforms.update-timing.read-the-code.1
loop: 1
tier: core
concepts: [transforms.update-timing]
mode: read-the-code
context: transforms.update-timing/raycast-after-move
lenses: []
misconceptions:
  - transforms.update-timing/stale-read
  - transforms.update-timing/parents-refresh
---

# Update timing

> **In short:** three.js refreshes every object's saved transforms, `matrix` and `matrixWorld`, when it renders, so code that moves something and reads them before the next render has to ask for a refresh, or use a method that refreshes for you.
>
> **Used for:** Clicking or aiming at something right after it moved; measuring an object right after resizing it; sending positions to a server, a physics engine, or a save file; and big scenes full of things that never move, where the refresh costs time every frame.

## A · The basics

### What happens in one frame

The matrix vs matrixWorld page showed that `matrix` and `matrixWorld` are saved copies. This page is about when they get refreshed. Every frame runs in the same order:

1. **Your code runs:** input handlers, animations, physics, whatever is in your frame loop. Setting `position`, `rotation`, or `scale` changes only those settings.
2. **`renderer.render(scene, camera)` refreshes the saved transforms.** It starts at the scene and works down the tree. Each object's `matrix` is rebuilt from its settings, then its `matrixWorld` is rebuilt by combining that with its parent's. The camera's are refreshed too.
3. **Then it draws,** using each mesh's fresh `matrixWorld`.

So anything your code reads from `matrix` or `matrixWorld` is as of the last render.

**Analogy: a morning newspaper.** News happens all day, but the paper is printed once, overnight. Read it at noon and it tells you how things stood when it was printed. `position` is what just happened, `matrixWorld` is the paper, and each render is a print run. Asking for a refresh is printing a special edition.

### Reading right after a move

A raycast tests a ray against each object's saved `matrixWorld`. Move an object and raycast on the next line, and the ray tests the object where it was last drawn:

```js
box.position.x = 1;                          // move it into the ray
const hits = raycaster.intersectObject(box); // still tests the box at its old spot
```

In the scene, a scanner shoots a fixed ray. Each step of the slider moves the box and raycasts right away. With the first button, the answer lags a step behind: the gray outline shows where the raycast thought the box was. The second button refreshes first.

<div data-scene="raycastAfterMove"></div>

### Asking for a refresh

`updateMatrixWorld()` refreshes an object and everything attached under it, right now, the same way a render would:

```js
box.position.x = 1;
box.updateMatrixWorld();                     // refresh the box and its children now
const hits = raycaster.intersectObject(box); // tests the box at its new spot
```

It doesn't refresh the parents above it. That only matters when a parent moved too; "Refreshing after moving a parent" below covers it.

## B · Working knowledge

### Which methods refresh first

Some methods refresh the saved transforms they need before they answer. Others read them as they are:

| Code | Refreshes first? |
| --- | --- |
| `getWorldPosition`, `getWorldQuaternion`, `getWorldScale`, `getWorldDirection` | Yes: the object and all its parents |
| `localToWorld`, `worldToLocal` | Yes: the object and all its parents |
| `lookAt` | Yes: the object and all its parents |
| `new Box3().setFromObject(object)` | Partly: the object and its children, not its parents |
| `raycaster.intersectObject(object)` | No |
| `raycaster.setFromCamera(pointer, camera)` | No: it reads the camera's saved transform |
| Reading `object.matrix` or `object.matrixWorld` yourself | No |
| `object.toJSON()` | No: it saves each `matrix` as it is |

That's why `getWorldPosition` was right even a line after a move on the local vs world space page. Anything marked "No" needs a refresh first if something just moved. The "Yes" rows have one exception: they refresh the parents but not an object with auto-update off, covered below.

### Refreshing after moving a parent

`updateMatrixWorld()` combines an object with its parent's saved `matrixWorld`, fresh or not. So after moving a shelf, refreshing only the bin on it still gives the bin's old spot:

```js
shelf.position.x += 2;
bin.updateMatrixWorld();            // uses the shelf's old saved transform
bin.updateWorldMatrix(true, false); // refreshes the shelf first, then the bin
```

`updateWorldMatrix` takes two switches: the first says whether to refresh the parents above, the second whether to refresh the children below. The simplest rules:

- Refresh from the highest thing that moved: `shelf.updateMatrixWorld()` covers the shelf and everything on it.
- `scene.updateMatrixWorld()` refreshes everything, the same as a render. It visits every object, so call it once after a batch of moves, not once per object in a loop.

### Raycasting right after a move

A raycast in a click handler is usually fine: the click arrives between frames, after everything was drawn, so the saved transforms match the screen. Trouble starts when one piece of code moves something and raycasts right after it: dropping a part and checking what's under it, snapping a part into place and testing for overlaps, or moving the camera and casting a ray from it with `setFromCamera`. Refresh whatever moved first.

### Bounds after a transform

`Box3.setFromObject` refreshes the object you pass and everything under it, but not its parents:

```js
shelf.scale.set(2, 2, 2);
const bounds = new Box3().setFromObject(bin); // bin sits on the shelf: measured at the old size
```

Measure the thing that changed, `new Box3().setFromObject(shelf)`, or call `shelf.updateMatrixWorld()` first. Moving or resizing the object you measure is fine, because `setFromObject` refreshes it.

### Syncing to external data

- **Sending positions out,** to a server, a physics engine, a UI panel, or a save file: read them with the `getWorld…` methods, which refresh first. To read `matrixWorld` on many objects, call `scene.updateMatrixWorld()` once, then read them all. Watch out for `object.toJSON()`: it saves each `matrix` as it is, so a move since the last render is lost unless you refresh first. `GLTFExporter` doesn't have this problem: it rebuilds each `matrix` itself, or, with `trs: true`, writes `position`, `quaternion`, and `scale` as they are.
- **Bringing positions in,** from a physics engine or a server each step: set `position` and `quaternion`, and let the render refresh the rest. If the same step then raycasts or measures, refresh first.

### Objects that never move

Every render refreshes every object in the scene, whether it moved or not. That's CPU time every frame, and it grows with the number of objects: nothing to notice with a few hundred, a real slice of each frame with tens of thousands.

`matrixAutoUpdate = false` tells three.js to stop rebuilding an object's `matrix` from its `position`, `rotation`, and `scale`. It's the usual advice for things that never move, like racks in a warehouse:

```js
rack.position.set(4, 0, -2);
rack.updateMatrix();           // build matrix once, from the position above
rack.matrixAutoUpdate = false; // three.js stops rebuilding it from here on
```

Two things to know:

- **Moving it does nothing until you call `updateMatrix()`.** With auto-update off, changing `position` doesn't change where the rack is drawn. That includes the first placement: set the position, turn auto-update off, skip `updateMatrix()`, and the rack sits at the center of the scene. `updateMatrix()` rebuilds only `matrix`; the next render combines it into `matrixWorld`. `getWorldPosition` doesn't help: with auto-update off it doesn't refresh the rack at all, so it reads the saved `matrixWorld` as the last render left it, even if the rack's parent has moved since.
- **It saves less than it sounds.** Every render still visits the rack and combines it with its parent, which is also why a rack with auto-update off still follows its parent. Skipping the rebuild alone makes little difference to how long the refresh takes. Bigger savings, like not refreshing parts of the scene that never move, belong to the optimization domain.

Try both buttons, then move the rack. With auto-update off, it stays put until you press `rack.updateMatrix()`.

<div data-scene="autoUpdate"></div>

### Which space is it in?

| Value | Space |
| --- | --- |
| `object.position`, right after you set it | Measured from its parent, and already new |
| `object.matrixWorld`, between renders | The world, as of the last refresh |
| What `object.getWorldPosition(v)` gives back | The world, refreshed first |
| `hit.point`, where a raycast hit | The world, using each object's saved `matrixWorld` |
| What `new Box3().setFromObject(object)` gives back | The world |
| What `object.toJSON()` saves | Each object's `matrix`, measured from its parent |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
