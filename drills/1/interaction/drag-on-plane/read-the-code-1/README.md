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

> **In short:** Slide an object across an invisible surface by finding where the pointer's ray crosses it, keeping the grabbed spot under the pointer.
>
> **Used for:** Sliding furniture across a floor, moving pictures along a wall, 3D slider knobs, and dropping map pins.

## A · The basics

### A pointer gives a ray, a plane gives a spot

The pointer is a spot on the screen, but the object lives in 3D. The spot gives a ray: a line out from the camera through the pointer, with no distance chosen. To pick a distance, choose the surface the object moves on, a **plane**, and take the spot where the ray crosses it. The plane is only math, `THREE.Plane`, never drawn, and it goes on forever.

**Analogy: a chess piece.** Your hand moves through the air, but the piece only slides on the board. Where your hand points on the board is where the piece goes.

Drag the crate, or use the slider. The faint square is the plane, and the arrow is the grab offset.

<div data-scene="floorDrag"></div>

### Keep the grab offset

You rarely grab an object exactly at its origin. The **grab offset** is the gap from the spot you grabbed to the object's origin, measured once, on the press. Put the object at the hit plus that offset, and the spot you grabbed stays under the pointer. Put it at the hit alone, and it jumps to put its origin under the pointer.

Pick each button, then grab the crate near a corner and drag, or use the slider.

<div data-scene="grabOffset"></div>

## B · Working knowledge

### On the press: the plane and the offset

```js
const first = raycaster.intersectObject(crate)[0];                      // the grabbed spot
plane.setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), first.point); // level, through it
offset.copy(crate.position).sub(first.point);
```

The plane's normal sets the drag: (0, 1, 0) across a floor, `wall.getWorldDirection(n)` along a wall, or `camera.getWorldDirection(n)` freely across the view. If nothing was hit, leave the press to the orbit; otherwise turn the orbit off and capture the pointer.

### On each move: where the ray meets the plane

```js
raycaster.setFromCamera(ndc, camera);
if (raycaster.ray.intersectPlane(plane, hit)) crate.position.copy(hit).add(offset);
```

`intersectPlane` returns `null` when the plane is behind the ray, like the floor with the pointer above the horizon, so the check skips that move. Near the horizon a small pointer move sends the hit racing off, so clamp it to the room. The axis-constrained drag page narrows this to one line.

### Which space is it in?

Every drag makes the trip **screen pixels** → **NDC** → a ray in **the world** → a hit in **the world** → **measured from the parent**, where `position` lives.

| Value | Space |
| --- | --- |
| `event.clientX`, `event.clientY` | CSS pixels from the window's top-left corner |
| `ndc` | NDC |
| `raycaster.ray`, `plane`, `hit`, `offset` | The world |
| `crate.position` | Measured from its parent |

The code above works when the parent is the scene. On a turned cart, measure the offset in the world and convert at the end:

```js
offset.copy(crate.getWorldPosition(v)).sub(first.point);         // on the press
crate.position.copy(crate.parent.worldToLocal(hit.add(offset))); // on each move
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
