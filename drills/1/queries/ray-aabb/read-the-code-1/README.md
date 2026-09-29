---
id: 1.queries.ray-aabb.read-the-code.1
loop: 1
tier: light
concepts: [queries.ray-aabb]
mode: read-the-code
context: queries.ray-aabb/early-out
lenses: []
misconceptions:
  - queries.ray-aabb/inside-misses
---

# Ray–AABB

> **In short:** `ray.intersectBox(box, target)` finds where a ray first touches a box whose sides line up with the axes, including from inside it, and `ray.intersectsBox(box)` just says whether it touches.
>
> **Used for:** Skipping a whole rack of parts in one test when the ray misses its box, finding which storage bin in a grid a laser passes through, clicking inside a room to find the wall behind it, and the box tests a BVH makes by the thousand.

## A · The basics

### A box lined up with the axes

An **AABB**, short for axis-aligned bounding box, is a box whose sides always run along X, Y, and Z. three.js's `Box3` is one: just two corners, `min` and `max`. The bounding box and sphere page used it for a geometry's bounds.

Testing a ray against it is almost as cheap as a sphere, and a box fits long, flat, and square things much more snugly. Like the sphere, there are two questions:

- **`ray.intersectsBox(box)`**: does it touch? `true` or `false`.
- **`ray.intersectBox(box, spot)`**: where? The spot, or `null`.

### From inside, it hits on the way out

The box counts as solid. A ray that starts inside it touches it where it leaves, so `intersectBox` returns the exit. A box entirely behind the start gives `null`.

**Analogy: a laser pointer in a room.** Stand in the middle of a room and point anywhere: the dot always lands on a wall. You don't have to be outside the room for the walls to count.

Move the start in and out of the room, and turn the laser.

<div data-scene="roomLaser"></div>

## B · Working knowledge

### Skipping a whole group

three.js checks each mesh's own bounding sphere, but not a box around a group. For a rack made of hundreds of parts, one box test in front of the raycast skips them all when the ray misses:

```js
const rackBox = new Box3().setFromObject(rack); // in the world; once, or after the rack moves
if (raycaster.ray.intersectsBox(rackBox)) {
  hits = raycaster.intersectObject(rack);       // only now test its parts
}
```

The same idea, repeated in boxes inside boxes, is a BVH; the BVH page covers it. `setFromObject` and how tight its box is are on the world-space bounds page.

### A box mesh is different

`raycaster.intersectObject(boxMesh)` from inside the mesh finds nothing with the default `FrontSide`: the walls face outward, so the ray sees their backs, as on the ray–triangle page. `intersectBox` has no sides to face; it treats the box as solid.

### A box that doesn't turn

A `Box3` can't turn. The box around a turned object stays lined up with the world, so it's bigger than the object and the ray can pass through a corner of it and miss the object. That's fine for skipping work, and wrong for the final answer. The AABB vs OBB page covers boxes that turn.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
