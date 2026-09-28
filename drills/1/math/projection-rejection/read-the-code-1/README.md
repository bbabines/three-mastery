---
id: 1.math.projection-rejection.read-the-code.1
loop: 1
tier: core
concepts: [math.projection-rejection]
mode: read-the-code
context: math.projection-rejection/wall-slide
lenses: []
misconceptions:
  - math.projection-rejection/zero-an-axis
---

# Projection and rejection

> **In short:** Splits a move into the part that runs along a direction and the leftover part at right angles to it.
>
> **Used for:** Sliding along walls, keeping a drag on a rail or axis, and finding the closest point on a line.

## A · The basics

### Splitting a move in two

Any move can be split into two parts compared with a direction you pick:

- The **projection**: the part that runs along that direction.
- The **rejection**: the leftover part, at right angles to it.

Add the two parts back together and you get the original move.

**Analogy: a shadow at noon.** With the sun straight overhead, a leaning pole casts a shadow on the ground. The shadow is the part of the pole that runs along the ground. How high the pole reaches is the leftover part, straight up.

Move v with the sliders. The green arrow is the part along the blue line; the orange arrow is the leftover.

<div data-scene="split"></div>

### In three.js

```js
const along = v.clone().projectOnVector(direction); // the part along direction
const flat = v.clone().projectOnPlane(normal);      // the part flat on a surface
```

`projectOnPlane` keeps the part that lies flat on a surface, given the direction the surface faces. It's the rejection: the leftover after removing the part along that direction.

## B · Working knowledge

### Sliding along a wall

When a character runs into a wall at an angle, remove the part of its velocity that goes into the wall. What's left slides along it:

```js
if (velocity.dot(wallNormal) < 0) {
  velocity.projectOnPlane(wallNormal);
}
```

The dot product check means you only slide when moving into the wall. Without it, walking away from a wall would get flattened too.

A common shortcut is to zero one axis, like `velocity.x = 0`. That only works when the wall faces exactly along that axis. For a wall at an angle, it removes the wrong part, and the character sticks or stops dead. Compare them:

<div data-scene="wallSlide"></div>

The wall's normal must be the direction it faces in the world. If the wall is rotated, its normal rotates with it.

### Keeping movement on a rail

To let something move only along a rail or a slider track, keep the part of the drag that runs along the rail:

```js
const alongRail = dragOffset.clone().projectOnVector(railDirection);
```

Transform gizmos use this when you drag a single axis arrow.

### Closest point on a line

The closest point on a line to some other point is where a straight drop meets the line, which is another projection. three.js has it built in: `new Line3(start, end).closestPointToPoint(point, false, target)`.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
