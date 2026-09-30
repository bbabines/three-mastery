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

> **In short:** An `ArrowHelper` makes a direction visible, but it reads its numbers in its parent's space, so the parent has to match.
>
> **Used for:** Checking a surface's normal, seeing where a click's ray goes, watching a velocity, and checking which way a spotlight faces.

## A · The basics

### An arrow for a direction

`ArrowHelper` draws a direction, `dir`, normalized first, from a starting point, `origin`, drawn `length` long:

```js
const arrow = new ArrowHelper(dir, origin, length, color);
```

### It reads its numbers in its parent's space

An arrow is an object like any other, so everything about it is measured from its parent: `origin` becomes its `position`, `dir` is turned by any turn above it, and `length` grows with any scale above it. So match the parent to the space the numbers are in. A direction measured from an object itself, like a vertex normal or `hit.face.normal`, goes on an arrow added to that object. A direction in the world, like a ray or a world velocity, goes on an arrow added to the scene.

**Analogy: a sticky-note arrow.** Stuck on a book, it turns when the book turns. Stuck on the desk, it keeps pointing the same way, whatever the book does.

The panel's normal, measured from the panel itself, is (0, 0, 1). Turn the table and compare the three ways of drawing it.

<div data-scene="normalArrow"></div>

## B · Working knowledge

### A velocity: the length is the speed

```js
velocityArrow.position.copy(ship.position);
velocityArrow.setDirection(velocity.clone().normalize());
velocityArrow.setLength(velocity.length() * 0.5); // how far it goes in half a second
```

`setDirection` expects a direction 1 long and doesn't check: handed (3, 3, 0), the arrow points straight up. A velocity of zero has no direction, so hide the arrow while it's zero.

### A ray: seen from the side

```js
raycaster.setFromCamera(pointer, camera);
scene.add(new ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 20, 'red')); // both in the world
```

Seen through the camera it came from, the ray runs along the line of sight, so it's a dot under the pointer at most. Orbit away to see it as a line.

### A hit normal: pick the space

`hit.point` is in the world, but `hit.face.normal` is measured from the hit object itself. Turn the normal into the world first (a stretched object needs the normal matrix instead), then draw it from the hit point:

```js
const worldNormal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
scene.add(new ArrowHelper(worldNormal, hit.point, 0.5));
```

### Which space is it in?

| Value | Space |
| --- | --- |
| The `origin` and `dir` an `ArrowHelper` is given | Its parent's |
| `raycaster.ray.origin`, `.direction`, and `hit.point` | The world |
| `hit.face.normal`, and a mesh's `normal` attribute | Measured from the object itself |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
