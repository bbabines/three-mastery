---
id: 1.interaction.axis-drag.read-the-code.1
loop: 1
tier: core
concepts: [interaction.axis-drag]
mode: read-the-code
context: interaction.axis-drag/rail-slide
lenses: []
misconceptions:
  - interaction.axis-drag/screen-delta
---

# Axis-constrained drag

> **In short:** To slide something along one line, drag on a plane that holds the line, then keep only the part of the move along it.
>
> **Used for:** Gizmo arrow handles, raising a shelf on its uprights, sliding a carriage along a rail, and opening drawers.

## A · The basics

### A plane that holds the line

To move along a single line, the **axis**, the pointer's ray still needs a plane to cross, and the plane has to contain the axis. Many planes do, like the pages of a book fanning around its spine. Take the one that faces the camera the most: the ray crosses it steeply, so the hit follows the pointer calmly instead of racing off.

### Keep only the part along the axis

The hit wanders over that plane in two directions. With an axis of length 1, `move.dot(axis)` says how far the move goes along the axis. Move the object that far along the axis and drop the rest.

**Analogy: a bead on a wire.** Wave your hand anywhere near it and the bead only slides along the wire, to the spot closest to your hand.

Drag the carriage along the rail or up the post, or use the slider: the green line is the part of the move that's dropped. Orbit, and the plane turns to keep facing you.

<div data-scene="axisPlane"></div>

### Why not use how far the mouse moved?

```js
part.position.x += event.movementX * 0.01; // looks simpler
```

`event.movementX` is how many CSS pixels the pointer moved since the last event. Used directly, the speed is wrong, since a pixel covers more of the world far away than up close. The direction also flips once you orbit to the far side, and sideways moves drive even an axis that runs up the screen.

Try both buttons with the drag slider, then orbit to the far side.

<div data-scene="screenDelta"></div>

## B · Working knowledge

### On the press: a plane that faces you

```js
const axis = new Vector3(1, 0, 0); // in the world, length 1
normal.copy(camera.position).sub(grabbed).projectOnPlane(axis).normalize();
plane.setFromNormalAndCoplanarPoint(normal, grabbed);
start.copy(part.position);
```

`projectOnPlane(axis)` removes the part of the direction to the camera that runs along the axis. What's left is the plane's normal, as close to the camera as it can be.

### On each move: keep the part along the axis

```js
if (raycaster.ray.intersectPlane(plane, hit)) {
  const along = move.subVectors(hit, grabbed).dot(axis);
  part.position.copy(start).addScaledVector(axis, along);
}
```

The axis must have length 1, or `dot` and `addScaledVector` each scale by its length. `MathUtils.clamp(along, 0, railLength)` keeps the part on its rail, and `Math.round(along / 0.1) * 0.1` snaps it to steps of 0.1.

### Which space is it in?

| Value | Space |
| --- | --- |
| `axis`, `normal` | Directions in the world, length 1 |
| `grabbed`, `hit`, `plane` | The world |
| `along` | A distance along the axis, in world units |
| `start`, `part.position` | Measured from its parent |

The world and the parent's space match only when the parent is the scene. Inside a turned parent, convert the result with `parent.worldToLocal`, as on the drag on a plane page. The local vs world manipulation page covers axes that turn with the part.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
