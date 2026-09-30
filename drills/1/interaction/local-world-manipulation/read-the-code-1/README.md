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

> **In short:** Moves and turns can follow the world's fixed axes or the object's own axes, which turn with it.
>
> **Used for:** Sliding along an angled rail, turning knobs on a tilted panel, gizmo space switches, and driving forward.

## A · The basics

### Two sets of axes

The world's X, Y, and Z never turn. An object's own axes turn with it. A move gizmo in an editor offers both: **world** moves along the world's axes, and **local** moves along the object's own axes.

The drag code from the axis-constrained drag page works for either. Only where the axis comes from changes: the world's X is always (1, 0, 0), and the object's own X is (1, 0, 0) turned the way the object is turned.

**Analogy: a sliding door in a wall that runs at an angle.** Push it due east and it jams against the frame. Push it along its track and it slides open.

Switch the gizmo between world and local, then use the slider or drag the X arrow. Only the carriage's own X keeps it on the rail.

<div data-scene="gizmoSpace"></div>

### Turns have axes too

A turn goes around an axis, and the same choice comes up. A knob on a tilted panel, turned around its own up, spins in place, flush with the panel. Turned around the world's up, it tips off the panel.

Try both buttons and turn a.

<div data-scene="turnKnob"></div>

## B · Working knowledge

### Moving along its own axes

```js
part.translateX(0.5);   // along its own X, wherever it's turned
part.position.x += 0.5; // along its parent's X
const axis = new Vector3(1, 0, 0).applyQuaternion(part.getWorldQuaternion(q)); // its own X, in the world
```

`translateX` turns the axis by the object's own turn before adding it to `position`. For a drag, use `getWorldQuaternion`, not `quaternion`, which is measured from the parent: on a turned cart, the drag would slide off at the cart's angle.

### Turning around its own axis or the world's

```js
knob.rotateY(angle);                                 // around its own Y
knob.rotateOnWorldAxis(new Vector3(0, 1, 0), angle); // around the world's Y, if no parent is turned
```

Under a turned parent, `rotateOnWorldAxis` turns around the parent's axis instead. For a true world axis, bring it into the parent's axes first: `worldAxis.clone().applyQuaternion(parent.getWorldQuaternion(q).invert())`.

### The gizmo's space switch

```js
gizmo.setSpace('local'); // arrows and rings follow its own axes; the default is 'world'
```

Scale handles always follow the object's own axes, whatever the space, since stretching a turned object along a world axis would skew it.

### Which space is it in?

| Value | Space |
| --- | --- |
| `part.position`, `part.quaternion` | Measured from its parent |
| `axis`, from `getWorldQuaternion` | Its own X, as a direction in the world |
| The axis `translateX` and `rotateY` use | The object's own axes |
| The axis `rotateOnWorldAxis` takes | The parent's axes: the world's only when no parent is turned |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
