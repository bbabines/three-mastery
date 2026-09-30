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

> **In short:** Finds where a ray meets an endless flat surface, like the floor, without any mesh, and says so when it never does.
>
> **Used for:** Dragging furniture across a floor, snapping parts to a grid, measuring a room, and sliding things along a wall.

## A · The basics

### A plane is a surface that never ends

A **plane** in three.js isn't a mesh and isn't drawn. It's a perfectly flat surface that goes on forever in every direction, with no thickness and no edges. `Plane` stores it as a **normal**, the direction it faces, and a **constant**, which places it:

```js
const floor = new Plane(new Vector3(0, 1, 0), 0); // facing up, at y = 0: the ground
```

`ray.intersectPlane(floor, spot)` writes the crossing point into `spot` and returns it. It needs no geometry, so the floor exists everywhere, even where nothing is modeled.

**Analogy: the surface of a calm sea.** A stone thrown down at an angle meets it once, however far off. Thrown flat or up at the sky, it never comes down to it.

### When there's no answer

"Endless" doesn't mean "always hit". `intersectPlane` returns `null` when the ray runs parallel to the plane, or when the plane is behind the ray, since a ray only goes forward.

Tilt and raise the laser. The floor, shown in blue, is an endless plane.

<div data-scene="laserFloor"></div>

## B · Working knowledge

### Placing on a grid

Cast from the pointer, cross the floor plane, and snap the ghost to the middle of its grid cell:

```js
raycaster.setFromCamera(pointer, camera);
if (raycaster.ray.intersectPlane(floor, spot)) {
  ghost.position.set(Math.floor(spot.x) + 0.5, 0.25, Math.floor(spot.z) + 0.5);
}
```

Always check for `null`: point above the horizon and there's no crossing. `intersectPlane` then leaves `spot` untouched, so code without the check quietly reuses the last spot.

Move the pointer, or the sliders, across the floor, then up past the horizon.

<div data-scene="placementGrid"></div>

### Building the plane you need

The constant is minus the height along the normal, so a table top at y = 0.8 is `new Plane(new Vector3(0, 1, 0), -0.8)`. It's easier to give the direction it faces, `up` here, and any point on it:

```js
const tableTop = new Plane().setFromNormalAndCoplanarPoint(up, new Vector3(0, 0.8, 0));
```

For a plane that moves with an object, build it measured from the object, then `plane.applyMatrix4(object.matrixWorld)` moves it into the world.

### A plane or a floor mesh?

`raycaster.intersectObject(floorMesh)` works too, but it stops at the mesh's edges, misses from behind unless the material is `DoubleSide`, and tests every triangle. A plane has none of those limits and costs a few multiplications. Use the mesh when the ground really has shape, like terrain or steps.

### Measuring

Two clicks on the floor give two points in the world, and `a.distanceTo(b)` is the distance between them, in world units.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
