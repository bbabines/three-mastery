---
id: 1.rotation.rotate-around-point.read-the-code.1
loop: 1
tier: light
concepts: [rotation.rotate-around-point]
mode: read-the-code
context: rotation.rotate-around-point/orbit
lenses: []
misconceptions:
  - rotation.rotate-around-point/origin-rotation
---

# Rotating around a point

> **In short:** To turn something around any point, move it so that point sits at the origin, turn it, and move it back; in three.js that means turning the object's offset from the point and adding the point back on.
>
> **Used for:** A moon or a camera orbiting a planet or a product that isn't at the center of the scene, swinging a door around its hinge in one step, spinning a product on a turntable around its middle, and turning a selection of parts together around their shared center in an editor.

## A · The basics

### Every turn has a center

Every turn in three.js goes around some point, and which point depends on what you turn:

- **An object's `rotation` or `quaternion`** turns it around its own origin, as the pivots and offset groups page showed, unless its `pivot` is set.
- **A vector turned with `applyAxisAngle` or `applyQuaternion`** swings around (0, 0, 0) of the space it's measured in. For a `position`, that's the parent's origin; for anything straight in the scene, the center of the world.

So a turn always happens around an origin, the object's own or its space's, and never around some other point unless you arrange it. `moon.position.applyAxisAngle(up, angle)` swings the moon around the center of the scene, not around its planet.

### Move, turn, move back

To turn around another point, make that point the origin for a moment:

```js
const offset = moon.position.clone().sub(planet.position); // the move from the planet to the moon
offset.applyAxisAngle(up, angle);                          // turn it: around (0, 0, 0), which is now the planet
moon.position.copy(planet.position).add(offset);           // put the planet back on
moon.rotateOnWorldAxis(up, angle);                         // and turn the moon by the same amount
```

1. The **offset** is the move from the point to the object, "B minus A" from the point vs direction page.
2. Turning the offset turns it around (0, 0, 0), which stands for the point.
3. Adding the point back puts the object on its new spot, the same distance from the point.
4. Turning the object itself keeps it facing the same way toward the point, the way the Moon always shows Earth the same side. Leave this step out for something that should keep facing the same way in the world, like a gondola on a Ferris wheel.

**Analogy: a tetherball.** The ball swings around its pole, wherever the pole stands in the playground, because the rope measures from the pole. Turning around a point works the same way: measure from the point, turn, and measure back.

The planet sits away from the center of the scene. Try both buttons and turn: the moon either circles the planet, keeping its distance, or swings around the world's center and wanders off.

<div data-scene="orbit"></div>

### How this differs from the pivots page

The pivots and offset groups page set an object up so that its own `rotation` always turns around a chosen spot, with a pivot group or `pivot`. That's a standing arrangement, right for something that always turns around the same place, like a door on its hinge.

This page is a one-off move: turn any object around any point, right now, without changing how it's set up. Reach for it when the point changes, like orbiting whichever part is selected, or turning a whole selection around its shared center. For a single turn, both land the object in exactly the same place.

## B · Working knowledge

### Orbiting a point every frame

```js
const up = new Vector3(0, 1, 0);
const offset = new Vector3();
// in the frame loop, where delta is seconds since the last frame:
offset.subVectors(moon.position, planet.position).applyAxisAngle(up, speed * delta);
moon.position.addVectors(planet.position, offset);
```

`offset` is made once and reused, so the frame loop doesn't make a new Vector3 every frame.

### A hinge in one step, with a matrix

The same three steps pack into one matrix. Read it right to left, as on the TRS order page:

```js
const m = new Matrix4()
  .makeTranslation(hinge)                                           // 3. move back
  .multiply(new Matrix4().makeRotationY(angle))                     // 2. turn
  .multiply(new Matrix4().makeTranslation(hinge.clone().negate())); // 1. move the hinge to the origin
door.applyMatrix4(m); // hinge is measured from the door's parent
```

`applyMatrix4` adds the change measured from the parent and writes the result back into `position`, `quaternion`, and `scale`, as the TRS order page showed. Two cautions:

- **It adds on.** Each call turns the door a little more. Use a small step each frame, or start from a saved closed pose each time.
- **It doesn't allow for `pivot`.** An object with a `pivot` set jumps, as the pivots page warned. Use the offset steps above for those, or give the object a pivot group instead.

### Spinning a product around its middle

```js
const center = new Box3().setFromObject(chair).getCenter(new Vector3()); // in the world
chair.position.sub(center).applyAxisAngle(up, angle).add(center);
chair.rotateOnWorldAxis(up, angle);
```

- **It works because the chair sits straight in the scene.** The `Box3` center is in the world, and `position` is measured from the scene. Inside a group, turn the center into the group's space first: `chair.parent.worldToLocal(center)`.
- **Work out the center once, before turning.** The box around a model changes shape as the model turns, so for most models its middle wanders if you measure it again after every step.
- For a product that spins all the time, a pivot group at the center is simpler; the pivots page does exactly that.

### Which space is it in?

| Value | Space |
| --- | --- |
| The point you turn around | Must be measured from the same place as the object's `position`: its parent |
| `offset`, from the point to the object | A direction, measured from the parent |
| The (0, 0, 0) that `applyAxisAngle` turns around | The origin of the vector's own space: the parent's origin, for a position |
| The center from `new Box3().setFromObject(object)` | The world |
| The change `object.applyMatrix4(m)` adds | Measured from its parent |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
