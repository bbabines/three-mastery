---
id: 1.transforms.points-vs-directions.read-the-code.1
loop: 1
tier: core
concepts: [transforms.points-vs-directions]
mode: read-the-code
context: transforms.points-vs-directions/velocity
lenses: []
misconceptions:
  - transforms.points-vs-directions/apply-matrix-directions
---

# Points vs directions

> **In short:** When an object moves, turns, or resizes, a place on it follows along, but a direction only turns, so three.js has a separate method for each.
>
> **Used for:** Finding where a click landed on a moving part, casting a ray from a sensor on a robot arm, driving a vehicle at its speed the way it faces, and pushing things with forces like wind in a game.

## A · The basics

### Places and directions that belong to an object

The point vs direction page split Vector3s into two kinds: a **place**, like "12 Oak Street", and a **move** or **direction**, like "walk 3 blocks east". This page is about what happens to each kind when it belongs to an object and the object moves, turns, or resizes.

Picture a machine with a hose coming out of its right side:

- **A place on it:** where the hose connects, 0.6 to the right of the machine's center and 0.2 up.
- **A direction on it:** which way the hose points, straight out to the machine's right.

Both are measured from the machine itself. To use them in the world, say to put a marker there or cast a ray, you convert them with the machine's `matrixWorld`, the saved transform from the matrix vs matrixWorld page.

### Move, turn, resize

- **Move the machine** and the place moves with it. The direction doesn't change: the hose still points the same way, wherever the machine stands.
- **Turn the machine** and both turn with it.
- **Resize the machine** and the place moves out from its center, or in toward it. A direction would stretch too, changing its length, unless the method sets the length back to 1.

**Analogy: a headlamp.** Walk across the room and the lamp comes with you, but the beam still points the same way. Turn your head and the lamp and the beam both turn.

Move, turn, and resize the machine. The spot's numbers change every time. The aim's numbers change only when you turn it, and its length stays 1.

<div data-scene="moveTurnResize"></div>

### One method for each kind

three.js has a method for each kind. Both take a Vector3:

```js
const spot = new Vector3(0.6, 0.2, 0).applyMatrix4(machine.matrixWorld);  // a place
const aim = new Vector3(1, 0, 0).transformDirection(machine.matrixWorld); // a direction
```

- `applyMatrix4` treats the vector as a place: it moves, turns, and resizes it.
- `transformDirection` treats it as a direction: it leaves out the move, turns and resizes it, then sets its length back to 1.

The Vector3 can't tell either method which kind it holds, so using the wrong one never raises an error. It just gives a wrong answer, like `lookAt` on the point vs direction page.

<details>
<summary>The math, if you're curious</summary>

Docs and forums explain this with a fourth number called the **w component**. A place is written (x, y, z, 1) and a direction (x, y, z, 0). The matrix multiplies its move by w, so a place picks up the whole move and a direction picks up none of it. `applyMatrix4` always uses w = 1, and `transformDirection` always uses w = 0.

</details>

## B · Working knowledge

### Picking the method

| You have | Use | What it does |
| --- | --- | --- |
| A place: a hit point, a bolt hole, where a hose connects | `v.applyMatrix4(object.matrixWorld)` or `object.localToWorld(v)` | Moves, turns, and resizes it |
| A direction that should have length 1: a ray, which way something aims | `v.transformDirection(object.matrixWorld)` | Turns it, leaves out the move, and sets its length to 1 |
| A direction whose length matters: a velocity, a force | `v.applyQuaternion(object.getWorldQuaternion(q))` | Only turns it, so the length stays |

A **quaternion** is how three.js stores a turn on its own, with no move or resize; the quaternions page in the rotation domain covers them.

Two things to know about all three:

- **They change the vector you call them on,** like `sub` and `normalize`. Clone first if you still need the original.
- **Some use the saved matrix as it is.** `localToWorld` and `getWorldQuaternion` refresh the object's matrices first. `applyMatrix4(object.matrixWorld)` and `transformDirection(object.matrixWorld)` use `matrixWorld` as it was last saved, so after moving something in the same frame, call `updateMatrixWorld()` first, as on the update timing page.

### Casting a ray from a part

A sensor on a robot arm casts a ray straight out of its tip. The tip is a place and the way it points is a direction, so each gets its own method:

```js
const tip = arm.localToWorld(new Vector3(0, 0, 0.5));                   // a place
const ahead = new Vector3(0, 0, 1).transformDirection(arm.matrixWorld); // a direction
raycaster.set(tip, ahead);
```

`raycaster.set` expects a direction of length 1 and uses whatever it's given, so the length 1 that `transformDirection` hands back is exactly what a ray needs.

The common bug is converting the direction as if it were a place:

```js
const ahead = new Vector3(0, 0, 1).applyMatrix4(arm.matrixWorld); // picks up the arm's position
```

Now `ahead` has the arm's position added in, so the ray points off course, and the farther the arm is from the center of the scene, the worse it gets. Normalizing afterward doesn't fix it: `normalize` only changes the length, and the position is already mixed in.

### Moving at a speed, the way something faces

A velocity is a direction whose length matters: the length is the speed. Say a boat's velocity is 2 units a second straight ahead, measured from the boat itself. To move the boat, turn the velocity the way the boat faces in the world and keep its length:

```js
const velocity = new Vector3(0, 0, 2); // 2 units a second forward, measured from the boat
const facing = boat.getWorldQuaternion(new Quaternion());
boat.position.addScaledVector(velocity.clone().applyQuaternion(facing), delta);
```

`delta` is the seconds since the last frame, as on the normalize page. Adding a world velocity to `boat.position` works because the boat was added straight to the scene; a velocity you add to `position` has to be measured from the same parent as `position`.

Try all three methods, then move and turn the boat. The gray arrow shows where the velocity should point: the way the boat faces, at speed 2. `applyMatrix4` adds the boat's position, so the arrow swings off course as the boat moves. `transformDirection` turns it the right way but cuts the speed to 1. `applyQuaternion` turns it and keeps the speed. If you'd rather use `transformDirection`, put the speed back afterward with `.multiplyScalar(2)`.

<div data-scene="velocity"></div>

### localToWorld is for places

The local vs world page said `localToWorld` and `worldToLocal` treat the vector as a place. Inside, `localToWorld` refreshes the matrices and then calls `applyMatrix4(matrixWorld)`, so it has the same bug with a direction:

```js
crane.localToWorld(new Vector3(0, 0, 1));                  // a spot 1 in front of the crane
new Vector3(0, 0, 1).transformDirection(crane.matrixWorld); // which way the crane faces
```

For which way an object faces, `object.getWorldDirection(v)` does this in one call.

The direction a surface faces, its **normal**, needs its own method once an object is resized unevenly; the normal matrix page covers it.

### Which space is it in?

| Value | Space |
| --- | --- |
| A spot or direction before you convert it with `object.matrixWorld` | Measured from the object itself |
| What `applyMatrix4(object.matrixWorld)`, `transformDirection(object.matrixWorld)`, and `object.localToWorld(v)` give back | The world |
| What `object.getWorldQuaternion(q)` gives back, and a velocity turned by it | The world |
| `hit.point` and `raycaster.ray.direction` | The world |
| A velocity you add to `object.position` | Measured from the object's parent, like `position` |
| `hit.normal` and `hit.face.normal`, the way the surface faces where a raycast hit | Measured from the object that was hit |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
