---
id: 1.math.point-vs-direction.read-the-code.1
loop: 1
tier: core
concepts: [math.point-vs-direction]
mode: read-the-code
context: math.point-vs-direction/position-velocity
lenses: []
misconceptions:
  - math.point-vs-direction/always-position
---

# Point vs direction

> **In short:** A Vector3 is three numbers that mean either a place (a point) or a move (a direction), and three.js can't tell which.
>
> **Used for:** Placing objects, aiming one thing at another, velocities, and the way a camera faces.

## A · The basics

### The 3D world

A 3D scene is empty space with a center point called the **origin**. To say where something is, you measure from the origin in three directions:

- **X** is right. Negative X is left.
- **Y** is up. Negative Y is down.
- **Z** is toward you. Negative Z is away from you, into the screen.

The unit is whatever you decide. Most three.js projects treat 1 as one meter.

### A position is three numbers

Where something sits is three numbers: how far along X, then Y, then Z. (2, 1, 0) means 2 to the right, 1 up, and 0 toward you. Every object in three.js has one, called `position`. Drag the sliders.

<div data-scene="axes"></div>

### A move is also three numbers

Three numbers can also describe a **move**: go this far in each direction, starting from wherever you are. As a move, (3, 1, 0) means go 3 to the right and 1 up. It isn't a place. It's an instruction.

**Analogy: an address vs. walking directions.** "12 Oak Street" is a place, and it never moves. "Walk 3 blocks east" is a move, and where it takes you depends on where you start.

In the scene below, the starting point keeps changing. The move stays the same, so you end up somewhere different every time.

<div data-scene="move"></div>

### Same box, two meanings

three.js stores both kinds in the same type, `Vector3`, which is just a box for three numbers. The box doesn't know which kind it holds. You tell by where the numbers came from:

| Code | What the three numbers are |
| --- | --- |
| `mesh.position` | A place |
| `camera.getWorldDirection(v)` | A direction: which way the camera faces |
| `velocity` in a game loop | A move: how far to go each second |

## B · Working knowledge

### Getting from A to B

The move from A to B is B minus A:

```js
const move = b.clone().sub(a);
```

That one line is how you aim anything at anything: a turret at a target, a camera at a product, a ray from the camera through the mouse.

`sub` changes the vector you call it on. Without `.clone()`, `b` itself becomes the move and the position it held is gone. `add`, `multiplyScalar`, and `normalize` work the same way.

### Moving something

To send an object along a move, add the move to its position:

```js
mesh.position.add(move);
```

To put something halfway between two places, blend them. Adding two positions doesn't give a place by itself; the sum only means something once you halve it, which is what `lerp(b, 0.5)` does.

```js
const middle = a.clone().lerp(b, 0.5);
```

### Know which one a method wants

Some methods want a place and some want a direction. They all take a `Vector3`, so passing the wrong kind never raises an error. It just aims wrong.

| Method | Wants |
| --- | --- |
| `object.lookAt(v)` | A place to look at |
| `new ArrowHelper(dir, origin)` | A direction, then a place |
| `raycaster.set(origin, direction)` | A place, then a direction |

Try both buttons. `dir` is the move from the turret to the target, but `lookAt` reads it as a place, the spot (0, 0, −3), and turns toward that instead.

<div data-scene="lookAt"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
