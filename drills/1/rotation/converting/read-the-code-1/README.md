---
id: 1.rotation.converting.read-the-code.1
loop: 1
tier: light
concepts: [rotation.converting]
mode: read-the-code
context: rotation.converting/ui-display
lenses: []
misconceptions:
  - rotation.converting/same-numbers
---

# Converting representations

> **In short:** Converting a turn between angles, quaternions, and matrices keeps the turn, but not always the numbers.
>
> **Used for:** Saving and loading turns, showing rotation in degrees, comparing orientations, and copying turns out of matrices.

## A · The basics

### Four ways to write one turn

A turn can be written as Euler angles (three angles and an order), a quaternion (four numbers), a rotation matrix (the object's own three axes), or an axis and an angle. Angles are easiest for people to read; quaternions are best for combining and blending. On an object, `rotation` and `quaternion` stay in sync, and three.js converts between the others:

```js
q.setFromEuler(e);          // angles to a quaternion
e.setFromQuaternion(q);     // a quaternion to angles, in e's order
q.setFromRotationMatrix(m); // a matrix that holds only a turn, to a quaternion
```

### Same turn, different numbers

A round trip keeps the turn but not always the numbers. A turn of 370° around Y reads back as 10°. When three.js works out angles, the middle one always lands between −90° and 90°, so a 120° turn around Y comes back as (−180°, 60°, −180°): flip over, turn 60°, and flip back. A quaternion can come back as −q, with all four signs flipped, which is the same turn.

**Analogy: a compass heading.** Turn right 370° and the compass reads 10°. You face exactly the way you would have; only the number changed.

The left ship is turned by the angles you set, and the right ship by the angles three.js reads back. Set y past 90°: the numbers change completely, but the ships still match.

<div data-scene="roundTrip"></div>

## B · Working knowledge

### Saving and loading turns

```js
const saved = part.quaternion.toArray(); // [x, y, z, w]
part.quaternion.fromArray(saved);        // exactly the same turn back
const angles = cam.rotation.toArray();   // [x, y, z, order]: the order comes along
cam.rotation.fromArray(angles);
```

Save a quaternion, or save angles with their order. `rotation.set(x, y, z)` without an order keeps the object's current order.

### Showing rotation in a UI

`rotation` keeps the numbers you set, but anything that changes the quaternion, like `lookAt` or `slerp`, makes three.js work the angles out again. In an editor, keep the typed angles yourself and write them to the part, instead of reading them back:

```js
part.rotation.y = MathUtils.degToRad(typed.y); // typed: degrees, kept by the editor
yLabel.textContent = `${typed.y}°`;            // shown from typed, not read back
```

### Comparing orientations

Compare turns, not numbers: `a.quaternion.angleTo(b.quaternion) < 1e-4`. `equals` compares the four numbers exactly, so q and −q, or a rounding difference, make it `false`.

### Getting the turn out of a matrix

`setFromRotationMatrix` assumes the matrix holds only a turn; a resize gives a wrong turn, with no error. Split the matrix first:

```js
object.matrixWorld.decompose(position, quaternion, scale);
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
