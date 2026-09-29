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

> **In short:** To slide something along one line, cross the pointer's ray with a plane that contains the line and faces the camera, then keep only the part of the move that runs along the line.
>
> **Used for:** The arrow handles of a move gizmo in an editor; raising or lowering a shelf on its uprights; sliding a carriage along a rail in a configurator; and pulling a drawer open.

## A · The basics

### A plane that holds the line

The drag on a plane page moved things across a plane. To move along a single line, the **axis**, the ray still needs a plane to cross, and the plane has to contain the axis, or moving on the plane could never move along it. Many planes contain one line, like the pages of a book fanning around its spine. Take the one that faces the camera the most: the ray crosses it at a steep angle, so the hit follows the pointer calmly instead of racing off, as a plane seen edge-on does.

### Keep only the part along the axis

The hit wanders around on that plane, in two directions. The part of its move that runs along the axis is what the projection and rejection page called the projection: with an axis of length 1, `move.dot(axis)` says how far along the axis the move goes. Move the object that far along the axis, and drop the rest.

**Analogy: a bead on a wire.** Wave your hand anywhere near it and the bead only slides along the wire, to the spot closest to your hand.

Drag the carriage, or use the slider, which moves the pointer up and to the right. The faint square is the plane; orbit the view and it turns to keep facing you. The green line is the part of the move that's dropped. The post uses the same code with a different axis.

<div data-scene="axisPlane"></div>

## B · Working knowledge

### The code

```js
// on the press: a plane through the grabbed spot that contains the axis and faces the camera
const axis = new Vector3(1, 0, 0);   // in the world, length 1
normal.copy(camera.position).sub(grabbed).projectOnPlane(axis).normalize();
plane.setFromNormalAndCoplanarPoint(normal, grabbed);
start.copy(part.position);

// on each move
if (raycaster.ray.intersectPlane(plane, hit)) {
  const along = move.subVectors(hit, grabbed).dot(axis);
  part.position.copy(start).addScaledVector(axis, along);
}
```

- `projectOnPlane(axis)` removes the part of the direction to the camera that runs along the axis. What's left is square to the axis and as close to the camera as it can be: the plane's normal. three.js's `TransformControls` builds its drag planes the same way.
- **The axis must have length 1.** Otherwise `dot` and `addScaledVector` each scale by its length, and an axis of length 2 moves the part four times as far as the pointer.
- **Limits and steps:** `MathUtils.clamp(along, 0, railLength)` keeps it on the rail, and `Math.round(along / 0.1) * 0.1` snaps it to steps of 0.1.
- **An axis pointing at the camera can't be dragged well.** Moving along it barely moves on screen, and the normal comes out as next to nothing. `TransformControls` hides an arrow that points almost straight at the camera.
- `start` and `axis` are in the world, which matches `position` when the part's parent is the scene. Inside a turned parent, convert the result with `parent.worldToLocal`, as on the drag on a plane page. The local vs world manipulation page covers axes that turn with the part.

### Why not the screen delta?

```js
part.position.x += event.movementX * 0.01; // looks simpler
```

`event.movementX` is how many CSS pixels the pointer moved since the last event. Used directly:

- **The speed is wrong.** A pixel covers more of the world far away than up close, as on the world size per pixel page, so a fixed 0.01 per pixel races ahead of the pointer up close and lags behind it far away.
- **The direction flips.** Orbit around to the far side, and a drag to the right moves the part left on screen.
- **Any drag moves any axis.** Sideways pointer movement moves the part even along an axis that runs up the screen or toward the camera.

The ray and the plane get all three right: the grabbed spot stays under the pointer, as far as the axis allows. Try both buttons, then orbit around to the far side with the slider.

<div data-scene="screenDelta"></div>

### Which space is it in?

This page works from **screen pixels** to **the world**, along one direction in the world.

| Value | Space |
| --- | --- |
| `axis`, `normal` | Directions in the world, length 1 |
| `grabbed`, `hit`, `plane` | The world |
| `along` | A distance along the axis, in world units |
| `start`, `part.position` | Measured from its parent: the world, when the parent is the scene |
| `event.movementX` | CSS pixels since the last pointer event |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
