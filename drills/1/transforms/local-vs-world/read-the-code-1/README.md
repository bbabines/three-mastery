---
id: 1.transforms.local-vs-world.read-the-code.1
loop: 1
tier: core
concepts: [transforms.local-vs-world]
mode: read-the-code
context: transforms.local-vs-world/world-position
lenses: []
misconceptions:
  - transforms.local-vs-world/position-is-world
---

# Local vs world space

> **In short:** An object's `position` is measured from the thing it's attached to, so where it really sits in the scene, its world position, is a separate value you ask three.js for.
>
> **Used for:** Things built from parts, like wheels on a car or bins on a shelf; aiming at or measuring the distance to a part; lights and labels that ride along with something that moves; and handing positions to anything that works in the world, like raycasting.

## A · The basics

### Objects can carry other objects

Any object in three.js can hold other objects. `parent.add(child)` attaches the child, and from then on the child goes wherever the parent goes:

- Move the parent, and the child moves with it.
- Turn the parent, and the child swings around with it.
- Make the parent bigger, and the child grows and moves out with it.

The scene is the parent at the very top. Everything you add straight to the scene hangs from it.

**Analogy: a cup on a tray.** Carry the tray across the room and the cup comes too. You never picked up the cup.

### A child's position is measured from its parent

A child's `position` isn't measured from the center of the scene. It's measured from its parent: "1 to the right of the cart's center and 0.8 up." When the parent moves, that's still true, so the numbers in `position` don't change, even though the child is somewhere else now.

Where the child really is, measured from the center of the scene, is its **world position**. The **world** is the scene's own measuring frame: the origin and the X, Y, and Z axes from the point vs direction page.

**Analogy: a seat number on a plane.** Seat 14B says where you sit in the plane. It stays 14B the whole flight, while your spot on a map changes every second. The seat number is measured from the parent, the plane. The spot on the map is the world position.

Move, turn, and resize the cart. The ball's `position` never changes. Its world position changes every time.

<div data-scene="carry"></div>

<details>
<summary>The math, if you're curious</summary>

The names you'll see in docs and forums: values measured from the parent are in **parent space**, values measured from the object itself are in **object space** (also called model space or local space), and the scene's frame is **world space**. When a parent only moves, a child's world position is the parent's world position plus the child's `position`. Once the parent turns or resizes, three.js combines them with matrices, which the matrix vs matrixWorld page covers.

</details>

### Why it's easy to miss

For an object added straight to the scene, the parent is the scene itself, so "measured from its parent" and "in the world" are the same thing: its `position` is its world position. That's why `position` seems to mean "where it is," until you put something inside a group.

## B · Working knowledge

### Finding where something really is

Ask for the world position. You pass in a Vector3 for the answer to be written into:

```js
const spot = new Vector3();
bin.getWorldPosition(spot);
```

It's right even if you moved the parent a line earlier. Not every value is kept that fresh; the update timing page covers which ones. `getWorldQuaternion`, `getWorldScale`, and `getWorldDirection` do the same for rotation, size, and facing.

### Aiming at a part

`lookAt` turns toward a spot in the world. For a target added straight to the scene, `target.position` works, as on the point vs direction page. For a target inside a group, `position` is measured from the group, but `lookAt` still reads those numbers as a spot in the world:

```js
turret.lookAt(box.position);               // aims at the wrong spot
turret.lookAt(box.getWorldPosition(spot)); // aims at the box
```

Try both buttons, then move the shelf. The wrong version keeps aiming at the same empty spot wherever the shelf goes.

<div data-scene="aim"></div>

### Comparing objects in different groups

Two positions can only be compared when they're measured from the same place. Two bins on two different shelves can both have a `position` of (0, 1, 0) and be meters apart. Compare their world positions instead:

```js
binA.getWorldPosition(a);
binB.getWorldPosition(b);
const gap = a.distanceTo(b);
```

### Attaching something to a moving part

To make a light, a label, or a camera ride along with something, add it as a child and set its position measured from that thing:

```js
forklift.add(headlight);
headlight.position.set(0, 1, 2); // 1 up and 2 forward, measured from the forklift
```

The headlight now follows the forklift everywhere, with no code in the frame loop. `add` vs `attach`, which decides whether an object jumps when you give it a new parent, comes later in this domain.

### Converting a spot: localToWorld and worldToLocal

Sometimes you have a spot measured from the object itself, like "0.5 above the lamp's own center," and you need it in the world. Or you have a world spot, like the point a raycast hit, and need it measured from the object:

```js
const bulb = lamp.localToWorld(new Vector3(0, 0.5, 0)); // now in the world
const offset = lamp.worldToLocal(hit.point.clone());    // now measured from the lamp itself
```

Three things to know about them:

- **"Local" means two different things.** The three.js docs call `position` local, meaning measured from the parent. They also call the input to `localToWorld` local, but that one is measured from the object itself. So `part.localToWorld(part.position.clone())` counts the part's offset twice and lands in the wrong spot. For an object's own world position, use `getWorldPosition`.
- **They change the vector you pass in,** like `sub` and `add`. `part.localToWorld(part.position)` without `.clone()` moves the part.
- **They treat the vector as a place.** Converting a direction is different; the points vs directions page covers it.

### Which space is it in?

| Value | Space |
| --- | --- |
| `object.position`, `.rotation`, `.scale` | Measured from its parent |
| What `object.getWorldPosition(v)` and the other `getWorld…` methods give back | The world |
| The spot `object.lookAt(v)` turns toward | The world |
| What you pass to `object.localToWorld(v)` | Measured from the object itself |
| What `object.worldToLocal(v)` gives back | Measured from the object itself |
| `hit.point`, where a raycast hit | The world |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
