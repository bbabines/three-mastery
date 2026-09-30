---
id: 1.queries.bounds-primitives.read-the-code.1
loop: 1
tier: light
concepts: [queries.bounds-primitives]
mode: read-the-code
context: queries.bounds-primitives/trigger-volumes
lenses: []
misconceptions:
  - queries.bounds-primitives/plane-distance-positive
---

# Bounds primitives

> **In short:** Boxes, balls, planes, and camera views make quick yes-or-no tests, and a plane's distance tells you which side you're on.
>
> **Used for:** Trigger zones, keeping dropped crates apart, skipping things out of view, and knowing which side of a wall you're on.

## A · The basics

### Four shapes, a few questions each

three.js has four simple shapes for quick tests. A `Box3` is a box lined up with the axes, stored as its `min` and `max` corners. A `Sphere` is a `center` and a `radius`. A `Plane` is a flat surface that never ends, and a `Frustum` is the six planes around what a camera sees.

Each one answers questions like `containsPoint` and `intersectsBox` with a handful of arithmetic, so running them every frame for every object is fine.

### A plane's distance has a sign

`plane.distanceToPoint(p)` isn't just "how far". It's positive on the side the normal points to, zero on the plane, and negative on the other side. So one call answers both "how far from the wall?" and "which side of the wall?".

**Analogy: height above sea level.** A hilltop at 300 m is +300, and a submarine 200 m down is −200. The sign is the useful part: above or below the water.

Walk the player around. The box and the ball are trigger zones, and the fence is a plane.

<div data-scene="zones"></div>

## B · Working knowledge

### Trigger volumes

```js
const doorway = new Box3(new Vector3(-1, 0, -0.5), new Vector3(1, 2.5, 0.5));
if (doorway.containsPoint(player.position)) openDoor(); // player added straight to the scene
```

Points on the edge count as inside.

### Placement overlap

```js
const dropped = new Box3().setFromObject(crate);
const blocked = others.some((other) => dropped.intersectsBox(new Box3().setFromObject(other)));
```

Touching counts as overlapping, so two crates sharing a face report `true`. To let things sit flush, shrink one box a hair first with `dropped.expandByScalar(-0.001)`.

### Which side of a plane

```js
const cut = new Plane(new Vector3(0, 0, 1), 0); // faces +Z
const inFront = cut.distanceToPoint(point) > 0; // behind it: below 0
```

Use it for section views that hide everything past a cutting plane, or to keep a character on one side of a wall. A sphere's `distanceToPoint` goes negative inside too, measured to its surface, but a box's is 0 anywhere inside.

### Visibility

A `Frustum` built from the camera tests whether a box or sphere is at least partly in view. In view isn't visible, though: something behind a wall is still in the frustum.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
