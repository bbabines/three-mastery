---
id: 1.interaction.drag-on-plane.read-the-code.1
loop: 1
tier: core
concepts: [interaction.drag-on-plane]
mode: read-the-code
context: interaction.drag-on-plane/floor-drag
lenses: []
misconceptions:
  - interaction.drag-on-plane/hit-is-position
---

# Drag on a plane

> **In short:** To drag something across a surface, cast a ray from the pointer on every move, find where it crosses an invisible plane through the spot you grabbed, and put the object there plus the offset you grabbed it at.
>
> **Used for:** Sliding furniture across the floor in a room planner; moving a picture or a shelf along a wall; the knob of a slider built in 3D; and dropping pins on a map or a floor plan.

## A · The basics

### A pointer gives a ray, a plane gives a spot

The pointer is a spot on the screen, and the object lives in 3D. The ray from pointer page turned the spot into a ray: a line out from the camera through the pointer, with no distance chosen. To pick a distance, choose the surface the object moves on, a **plane**, and take the spot where the ray crosses it, as on the ray–plane page. The plane is only math, `THREE.Plane`, never drawn, and it goes on forever, so the drag keeps working past the edge of any floor you can see.

Every pointer move repeats the same steps: pointer → NDC → a ray from the camera → where the ray crosses the plane → the object's new position.

**Analogy: a chess piece.** Your hand moves through the air, but the piece only slides on the board. Where your hand points on the board is where the piece goes.

Drag the crate with the mouse, or use the slider. The faint square is the plane: level, through the spot you grabbed. The yellow dot is where the ray crosses it, and the arrow is the grab offset.

<div data-scene="floorDrag"></div>

### Keep the grab offset

You rarely grab an object exactly at its origin. The **grab offset** is the gap between the spot you grabbed and the object's origin, measured once, on the press. On every move the object goes to the hit plus that offset, so the spot you grabbed stays under the pointer. Put the object at the hit alone and its origin snaps to the pointer on the first move: the object jumps.

Grab the crate near a corner, with the mouse or the slider, and compare. Here the plane is the floor itself.

<div data-scene="grabOffset"></div>

## B · Working knowledge

### The code

```js
const plane = new Plane();
const hit = new Vector3();
const offset = new Vector3();

function onPointerDown(event) {
  raycaster.setFromCamera(ndc, camera);   // ndc from the event, as on the pointer events page
  const first = raycaster.intersectObject(crate)[0];
  if (!first) return;                     // missed: leave the press to the orbit
  plane.setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), first.point); // level, through the grab
  offset.copy(crate.position).sub(first.point);
  controls.enabled = false;
  canvas.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  raycaster.setFromCamera(ndc, camera);
  if (raycaster.ray.intersectPlane(plane, hit)) crate.position.copy(hit).add(offset);
}
// on pointerup: controls.enabled = true
```

- **`intersectPlane` can return `null`,** when the plane is behind the ray, like the floor when the pointer is above the horizon. Skip that move; `hit` keeps its old value.
- **Near the horizon, a small pointer move goes a long way.** On a floor seen almost edge-on, the hit races off into the distance. Clamp the result to the room.
- **Turning the orbit off** while dragging is the controls coexistence page's topic; the press also needs the click vs drag page's pointer capture.

### Which plane?

| Drag | Plane's normal | Through |
| --- | --- | --- |
| Across a floor or a table | `(0, 1, 0)` | The grabbed spot |
| Along a wall | The way the wall faces, in the world: `wall.getWorldDirection(n)` | The grabbed spot |
| Freely across the view | The way the camera faces: `camera.getWorldDirection(n)` | The grabbed spot |

Sliding along one line, like a 3D slider's track, needs one more step: the axis-constrained drag page.

### Objects inside a parent

The code above works when the crate's parent is the scene. On a turned or moved cart, `position` is measured from the cart, so measure the offset in the world and convert the result into the parent's space at the end:

```js
offset.copy(crate.getWorldPosition(v)).sub(first.point);                // on the press
crate.position.copy(crate.parent.worldToLocal(hit.add(offset)));       // on each move
```

### Cost

A ray–plane test is a few multiplications, so doing it on every pointer move is fine. The raycast against the crate's triangles happens once, on the press. A mouse can send several moves per frame; when a move does more work, save the latest pointer spot and handle it once per frame.

### Which space is it in?

Every drag makes the same trip: **screen pixels** → **NDC** → a ray in **the world** → a hit in **the world** → **measured from the parent**, where `position` lives.

| Value | Space |
| --- | --- |
| `event.clientX`, `event.clientY` | CSS pixels from the window's top-left corner |
| `ndc` | NDC |
| `raycaster.ray`, `first.point`, `hit`, `plane` | The world |
| `offset` | A move in the world, from the grabbed spot to the crate's origin |
| `crate.position` | Measured from its parent: the world, when the parent is the scene |
| What `crate.parent.worldToLocal(v)` gives back | Measured from the parent |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
