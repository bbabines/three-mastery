---
id: 1.debugging.visualizing-vectors.read-the-code.1
loop: 1
tier: light
concepts: [debugging.visualizing-vectors]
mode: read-the-code
context: debugging.visualizing-vectors/normal-direction
lenses: []
misconceptions:
  - debugging.visualizing-vectors/parent-irrelevant
---

# Visualizing vectors

> **In short:** To see a direction, draw it with an `ArrowHelper`, starting at the right point and added to the object whose space the direction is measured in, because the arrow reads its numbers in its parent's space.
>
> **Used for:** Checking that a surface's normal really points out of its front; seeing where a click's ray goes; watching a moving object's velocity; and checking which way a camera or a spotlight faces.

## A · The basics

### An arrow for a direction

The point vs direction page drew every move as an arrow. The helper behind those is `ArrowHelper`:

```js
const arrow = new ArrowHelper(dir, origin, length, color); // dir must be 1 long
```

`dir` is the direction, normalized first, `origin` is the point it starts from, and `length` is how long to draw it.

### It reads its numbers in its parent's space

An arrow is an object like any other, so everything about it is measured from its parent: `origin` becomes its `position`, `dir` is turned by any turn above it, and `length` grows with any scale above it. The same two vectors draw a different arrow under a different parent, and none of them is wrong in itself. What matters is matching the parent to the space the numbers are in:

- **Measured from an object itself,** like a vertex normal or `hit.face.normal`: add the arrow to that object.
- **In the world,** like a ray or a world velocity: add the arrow to the scene.

**Analogy: a sticky-note arrow.** Stuck on a book, it turns when the book turns. Stuck on the desk, it keeps pointing the way it did, whatever the book does. The note's drawing is the same either way; where you stick it decides what it points at.

The panel's front is its own +Z, so its normal, measured from the panel itself, is (0, 0, 1). Turn the table and compare the three ways of drawing it.

<div data-scene="normalArrow"></div>

## B · Working knowledge

### A velocity: the length is the speed

```js
velocityArrow.position.copy(ship.position);
velocityArrow.setDirection(velocity.clone().normalize());
velocityArrow.setLength(velocity.length() * 0.5); // how far it goes in half a second
```

`setDirection` expects a direction 1 long and doesn't check. Handed (3, 3, 0), the arrow points straight up instead of diagonally, with no error. A velocity of zero has no direction at all, so hide the arrow while it's zero.

### A ray: seen from the side

```js
raycaster.setFromCamera(pointer, camera);
scene.add(new ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 20, 'red')); // both in the world
```

Seen through the camera it came from, the ray runs straight along the line of sight, so it's a dot under the pointer at most. Orbit away, or draw it in a second camera's view, to see it as a line.

### A hit normal: pick the space

`hit.point` is in the world, but `hit.face.normal` is measured from the hit object itself (the intersection anatomy page). Turn the normal into the world first, then draw it from the hit point:

```js
const worldNormal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
scene.add(new ArrowHelper(worldNormal, hit.point, 0.5));
```

`transformDirection` is right for an object scaled the same on every axis; a stretched one needs the normal matrix page's method.

### Which space is it in?

| Value | Space |
| --- | --- |
| The `origin` and `dir` an `ArrowHelper` is given | Its parent's |
| `raycaster.ray.origin` and `.direction` | The world |
| `hit.point` | The world |
| `hit.face.normal`, and a mesh's `normal` attribute | Measured from the object itself |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
