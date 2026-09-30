---
id: 1.queries.ray.read-the-code.1
loop: 1
tier: light
concepts: [queries.ray]
mode: read-the-code
context: queries.ray/line-of-sight
lenses: []
misconceptions:
  - queries.ray/both-ways
---

# Ray

> **In short:** A ray is a line with a start but no end, and three.js can tell you what lies in its path.
>
> **Used for:** Finding what the mouse is over, line of sight in games, dropping parts onto a shelf, and laser sensors.

## A · The basics

### A start and a direction

A **ray** is two things: a **start**, which is a place, and a **direction**, a move of length 1. From the start it runs along the direction, on and on, and never ends.

It only runs one way. Everything behind the start is outside the ray, even when it sits on the same line.

**Analogy: a laser pointer.** The dot lands on whatever is in front of the pointer. Something behind your hand never gets a dot, however well it lines up.

Slide the crate along the line, then flip the direction. The raycast finds the crate only while it's in front of the start.

<div data-scene="beam"></div>

### Asking what it runs into

Asking "what does this ray run into?" is called **raycasting**. three.js's `Raycaster` holds a ray and tests it against the objects you hand it. The answer is a list of **hits**, nearest first, each with the spot where the ray met the object.

## B · Working knowledge

### Making one

```js
const raycaster = new Raycaster();
raycaster.set(start, direction);               // a place, then a direction of length 1
const hits = raycaster.intersectObject(crate); // [] when it misses
```

`set` keeps the direction exactly as you pass it. One shorter than 1 can miss a crate dead ahead, so normalize it first.

### Line of sight

Can the guard see the player? Cast from the guard's eye toward the player, and stop the ray at the player:

```js
const toPlayer = player.getWorldPosition(new Vector3()).sub(eye);
raycaster.set(eye, toPlayer.clone().normalize());
raycaster.far = toPlayer.length(); // ignore anything past the player
const blocked = raycaster.intersectObjects(walls).length > 0;
```

`near` and `far` are distances along the ray, in world units, and hits outside them are left out. They start at 0 and `Infinity`.

### Placing on the ground

To drop a marker onto whatever is under a spot, start the ray high above everything and point it down:

```js
raycaster.set(new Vector3(x, 100, z), new Vector3(0, -1, 0));
const hit = raycaster.intersectObjects(surfaces)[0]; // the nearest: the top surface
if (hit) marker.position.copy(hit.point);           // hit.point is in the world
```

Start it below the shelf and it only finds the floor, because the shelf is behind the start.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
