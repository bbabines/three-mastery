---
id: 1.interaction.local-world-manipulation.read-the-code.1
loop: 1
tier: core
concepts: [interaction.local-world-manipulation]
mode: read-the-code
context: interaction.local-world-manipulation/rotated-rail
lenses: []
misconceptions:
  - interaction.local-world-manipulation/world-axes
---

# Local vs world manipulation

> **In short:** A drag or a turn can follow the world's axes, which never turn, or the object's own axes, which turn with it, and editors call the second choice "local".
>
> **Used for:** Sliding a carriage along a rail set at an angle; turning a knob on a tilted control panel; the local and world switch on an editor's move gizmo; and driving a vehicle "forward" whichever way it faces.

## A · The basics

### Two sets of axes

The world's X, Y, and Z, from the point vs direction page, never turn. An object's own axes turn with it: the rotation matrix as a basis page showed they're the columns of its matrix. A move gizmo in an editor offers both. **World** moves along the world's axes. **Local** moves along the object's own axes, and in this domain "local" always means that, the object's own axes.

The axis-constrained drag page's code works for either. Only where the axis comes from changes:

- The world's X: `new Vector3(1, 0, 0)`, the same whatever the object does.
- The object's own X, as a direction in the world: `new Vector3(1, 0, 0).applyQuaternion(part.getWorldQuaternion(q))`.

**Analogy: a sliding door in a wall that runs at an angle.** Push it due east and it jams against the frame. Push it along its track and it slides open. The track is the door's own axis.

The carriage sits on a rail set at an angle, with `TransformControls`, from the controls tour, attached. Switch the gizmo between world and local and watch its arrows turn. The slider moves the carriage along the X arrow each one shows; you can also drag the arrows. Only the carriage's own X keeps it on the rail.

<div data-scene="gizmoSpace"></div>

### Turns have axes too

A turn goes around an axis, and the same choice comes up. A knob on a tilted panel turned around its own up spins in place, flush with the panel. Turned around the world's up, it tips off the panel.

<div data-scene="turnKnob"></div>

## B · Working knowledge

### Moving along its own axes

```js
part.translateX(0.5);   // along its own X, wherever it's turned
part.position.x += 0.5; // along its parent's X: the world's, when the parent is the scene
```

`translateX`, `translateY`, `translateZ`, and `translateOnAxis(axis, distance)` turn the axis by the object's own rotation and then add it to `position`. The distance is in the parent's units.

### Reading its own axis for a drag

```js
const axis = new Vector3(1, 0, 0).applyQuaternion(part.getWorldQuaternion(q)); // its own X, in the world
```

- **Use `getWorldQuaternion`, not `quaternion`.** `quaternion` is measured from the parent, so for a part on a turned cart it gives the axis in the cart's axes, and the drag slides off at the cart's angle.
- `new Vector3().setFromMatrixColumn(part.matrixWorld, 0).normalize()` gives the same direction, as on the rotation matrix as a basis page. Normalize, because a scaled part's columns aren't length 1, and refresh the matrix first if the part just moved.

### Turning around its own axis or the world's

```js
knob.rotateY(angle);                                  // around its own Y
knob.rotateOnWorldAxis(new Vector3(0, 1, 0), angle);  // around the world's Y, if no parent is turned
```

`rotateOnWorldAxis` assumes the parent isn't turned. Under a turned parent, it turns around the parent's axis instead. To turn a child around a true world axis, first bring the axis into the parent's axes: `worldAxis.clone().applyQuaternion(parent.getWorldQuaternion(q).invert())`.

### The gizmo's space switch

```js
gizmo.setSpace('local'); // arrows and rings follow the object's own axes; the default is 'world'
```

- **Scale handles always use the object's own axes,** whatever the space: stretching along a world axis would skew a turned object.
- The handles sit at the object's origin, even when it has a `pivot`, as the pivots page mentioned.

### Which space is it in?

| Value | Space |
| --- | --- |
| `part.position`, `part.quaternion` | Measured from its parent |
| `new Vector3(1, 0, 0).applyQuaternion(part.getWorldQuaternion(q))` | A direction in the world: its own X |
| `new Vector3(1, 0, 0).applyQuaternion(part.quaternion)` | A direction in its parent's axes: its own X, as the parent sees it |
| The axis `rotateY` and `translateX` use | The object's own axis |
| The axis `rotateOnWorldAxis` takes | The parent's axes: the world's only when no parent is turned |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
