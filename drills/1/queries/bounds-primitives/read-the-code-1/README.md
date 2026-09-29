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

> **In short:** `Box3`, `Sphere`, `Plane`, and `Frustum` are simple shapes with quick tests, "is this point inside?" and "do these overlap?", and a plane's distance to a point is signed, so it also says which side the point is on.
>
> **Used for:** Starting a cutscene when the player walks into a zone, stopping a dragged crate from being dropped into another one, pausing animations for things out of the camera's view, and knowing which side of a wall or cutting plane something is on.

## A · The basics

### Four shapes, a few questions each

| Shape | Made of | Questions it answers |
| --- | --- | --- |
| `Box3` | `min` and `max` corners, lined up with the axes | `containsPoint`, `intersectsBox`, `containsBox`, `distanceToPoint` |
| `Sphere` | `center` and `radius` | `containsPoint`, `intersectsSphere`, `intersectsBox`, `distanceToPoint` |
| `Plane` | `normal` and `constant`, as on the ray–plane page | `distanceToPoint`, `intersectsBox`, `intersectsSphere` |
| `Frustum` | Six planes: what a camera sees, as on the frustum page | `containsPoint`, `intersectsBox`, `intersectsSphere`, `intersectsObject` |

Each test is a handful of arithmetic, so running them every frame for every object is fine.

### A plane's distance has a sign

`plane.distanceToPoint(p)` isn't just "how far". It's positive on the side the normal points to, zero on the plane, and negative on the other side. So one call answers both "how far from the wall?" and "which side of the wall?".

**Analogy: height above sea level.** A hilltop at 300 m is +300; a submarine 200 m down is −200. The sign is the useful part: above or below the water.

Walk the player around. The readout shows each shape's test: the box and the ball are trigger zones, and the fence is a plane.

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

Touching counts as overlapping: two crates side by side, sharing a face exactly, report `true`. To let things sit flush, shrink one box a hair first: `dropped.expandByScalar(-0.001)`.

### Which side of a plane

```js
const cut = new Plane(new Vector3(0, 0, 1), 0);  // faces +Z
const inFront = cut.distanceToPoint(point) > 0;  // behind it: below 0
```

Use it for section views that hide everything past a cutting plane, keeping a character on one side of a wall, or sorting points into two halves.

### Distances for each shape

- `plane.distanceToPoint`: signed, negative behind.
- `sphere.distanceToPoint`: negative inside, measured to the surface.
- `box.distanceToPoint`: never negative; 0 anywhere inside.

### Visibility

A `Frustum` built from the camera, as on the frustum page, tests whether a box or sphere is at least partly in view. In view isn't visible: something behind a wall is still in the frustum.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
