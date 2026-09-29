---
id: 1.queries.ray-plane.read-the-code.1
loop: 1
tier: core
concepts: [queries.ray-plane]
mode: read-the-code
context: queries.ray-plane/placement-grid
lenses: []
misconceptions:
  - queries.ray-plane/every-ray-hits
---

# Ray–plane

> **In short:** `ray.intersectPlane(plane, target)` finds where a ray crosses a flat surface that goes on forever, with no mesh needed, and gives back `null` when the ray never gets there.
>
> **Used for:** Dragging furniture across a floor, snapping new parts to a placement grid, measuring a room by clicking two spots on the floor, and sliding a part along a wall.

## A · The basics

### A plane is a surface that never ends

A **plane** in three.js isn't a mesh and isn't drawn. It's the idea of a perfectly flat surface that goes on forever in every direction, with no thickness and no edges. `Plane` stores it as two things: a **normal**, the direction it faces, and a **constant**, which places it:

```js
const floor = new Plane(new Vector3(0, 1, 0), 0); // facing up, at y = 0: the ground
```

`ray.intersectPlane(floor, spot)` writes the crossing point into `spot` and returns it. It works from either side and needs no geometry at all, which makes it the standard way to drag things on a floor: the floor exists everywhere, even where nothing is modeled.

**Analogy: the surface of a calm sea.** Throw a stone down at an angle and it meets the water once, however far off. Throw it flat, skimming along at a constant height, and it never comes down. Throw it up at the sky and the water is behind it.

### When there's no answer

"Endless" doesn't mean "always hit". `intersectPlane` returns `null` when:

- **the ray runs parallel to the plane**, like the stone thrown flat, and
- **the plane is behind the ray**, like the stone thrown upward. The ray page's rule holds: a ray only goes forward.

One odd case: a ray lying exactly in the plane counts as hitting it at its own start.

Tilt and raise the laser. The floor, shown in blue, is an endless math plane.

<div data-scene="laserFloor"></div>

## B · Working knowledge

### Placing on a grid

The ray from pointer page's ray, a floor plane, and a snap:

```js
const floor = new Plane(new Vector3(0, 1, 0), 0);
const spot = new Vector3();

raycaster.setFromCamera(pointer, camera);
if (raycaster.ray.intersectPlane(floor, spot)) {
  ghost.position.set(Math.floor(spot.x) + 0.5, 0.25, Math.floor(spot.z) + 0.5); // the middle of the cell
}
```

Always check for `null`: point above the horizon and there's no crossing. `intersectPlane` then leaves `spot` untouched, so code without the check quietly reuses the last spot.

Move the pointer, or the sliders, across the floor, then up past the horizon.

<div data-scene="placementGrid"></div>

Dragging an object you grabbed also needs the offset between where you grabbed it and its center. That's the drag on a plane page, in the interaction domain.

### Building the plane you need

- **The constant has a surprising sign.** It's minus the height along the normal: `new Plane(new Vector3(0, 1, 0), -0.8)` is a table top at y = 0.8. Easier to read: `new Plane().setFromNormalAndCoplanarPoint(normal, pointOnIt)`, which takes the direction it faces and any point on it.
- **A plane that moves with an object:** build it measured from the object, then `plane.applyMatrix4(object.matrixWorld)` puts it in the world, like the ray.
- **Other planes:** a wall is a plane with a sideways normal, and a plane facing the camera lets you drag in any direction on screen; the interaction domain covers both.

### A plane or a floor mesh?

`raycaster.intersectObject(floorMesh)` works too, but it's limited by the mesh: nothing past its edges, nothing from behind unless the material is `DoubleSide`, and a triangle test for every triangle. A plane has none of those limits and costs a few multiplications. Use the mesh when the ground really has shape, like terrain or steps.

### Measuring

Two clicks on the floor give two points in the world, and `a.distanceTo(b)` is the distance between them, in world units.

### Which space is it in?

| Value | Space |
| --- | --- |
| `raycaster.ray` after `setFromCamera` | The world |
| `floor`, built from a normal and a constant | Whatever space you built it in; here, the world |
| `spot` from `intersectPlane` | The same space as the ray and the plane |
| `plane.applyMatrix4(object.matrixWorld)` | Moves a plane measured from the object into the world |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
