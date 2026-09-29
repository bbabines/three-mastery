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

> **In short:** Euler angles, a quaternion, a rotation matrix, and an axis with an angle are four ways of writing one turn, and three.js converts between any of them, though the numbers that come back can differ from the ones that went in and still mean the same turn.
>
> **Used for:** Saving rotations to a file, a database, or a link and loading them back; showing a part's rotation in degrees in an editor panel; checking whether two objects face the same way; and copying a turn out of a matrix, a physics engine, or a loaded file onto an object.

## A · The basics

### Four ways to write one turn

Each page in this domain introduced one of them:

| Form | What it is | In three.js | Best for |
| --- | --- | --- | --- |
| Euler angles | Three angles and an order | `Euler`, like `object.rotation` | People: sliders, typed-in degrees, labels |
| Quaternion | Four numbers holding an axis and an angle | `Quaternion`, like `object.quaternion` | Combining, blending, and storing turns |
| Rotation matrix | The object's own three axes | The turn inside a `Matrix4`, like `object.matrix` | Reading axes, and turning many points at once |
| Axis-angle | One line and one angle | A `Vector3` and a number | Hinges and spins |

### Converting between them

| From | To | Method |
| --- | --- | --- |
| Euler angles | Quaternion | `q.setFromEuler(e)` |
| Quaternion | Euler angles | `e.setFromQuaternion(q)`, in `e`'s order unless you pass one |
| Rotation matrix | Quaternion | `q.setFromRotationMatrix(m)` |
| Rotation matrix | Euler angles | `e.setFromRotationMatrix(m)` |
| Euler angles | Rotation matrix | `m.makeRotationFromEuler(e)` |
| Quaternion | Rotation matrix | `m.makeRotationFromQuaternion(q)` |
| Axis-angle | Quaternion | `q.setFromAxisAngle(axis, angle)` |
| Axis-angle | Rotation matrix | `m.makeRotationAxis(axis, angle)` |
| Quaternion | Axis-angle | `new Vector4().setAxisAngleFromQuaternion(q)`: x, y, z hold the axis and w the angle |
| A whole matrix: move, turn, and resize | Its three parts | `m.decompose(position, quaternion, scale)`, from the compose and decompose page |

On an object, `rotation` and `quaternion` convert for you: set either one and the other follows, as the Object3D tour showed.

### Same turn, different numbers

A round trip doesn't have to give back the numbers you put in. The turn survives; the numbers may not:

- **Angles wrap.** A turn of 370° around Y reads back as 10°.
- **Several sets of angles make the same turn.** When three.js works out angles from a quaternion or a matrix, the middle angle always comes out between −90° and 90°, and the other two between −180° and 180°. A 120° turn around Y fits that as (−180°, 60°, −180°): flip over, turn 60°, and flip over again.
- **At gimbal lock,** the last angle comes back as 0, as the gimbal lock page showed.
- **A quaternion can come back as −q,** with all four signs flipped, which is the same turn.

**Analogy: a compass heading.** Turn right 370° and the compass reads 10°. You face exactly the way you would have; only the number changed.

The left ship is turned by the angles you set. The right ship is turned by the angles three.js reads back from the left ship's quaternion. Set Y past 90° and the numbers change completely, but the two ships still match.

<div data-scene="roundTrip"></div>

## B · Working knowledge

### Saving and loading turns

```js
const saved = part.quaternion.toArray();      // [x, y, z, w]
part.quaternion.fromArray(saved);             // exactly the same turn back

const savedAngles = cam.rotation.toArray();   // [x, y, z, order]: the order comes along
cam.rotation.fromArray(savedAngles);
```

- **Save a quaternion, or save angles with their order.** Angles loaded in a different order make a different turn, as the Euler angles and order page showed. `rotation.set(x, y, z)` without an order keeps the object's current order, `'XYZ'` unless you changed it.
- **glTF files and most physics engines hand turns over as quaternions,** so copy them straight into `object.quaternion`.

### Showing rotation in a UI

```js
const label = [part.rotation.x, part.rotation.y, part.rotation.z].map((angle) => MathUtils.radToDeg(angle).toFixed(0));
```

`rotation` keeps the numbers you set. But anything that changes the quaternion, like `lookAt`, `slerp`, `rotateY`, or loading a file, makes three.js work the angles out again, and they can come back as another set: a part turned 120° shows (−180, 60, −180). In an editor where people type angles, keep the typed angles yourself as the source of truth and write them to the object, instead of reading them back from `rotation`.

### Comparing orientations

```js
const sameWay = a.quaternion.angleTo(b.quaternion) < 1e-4; // radians apart
```

Compare turns, not numbers. Two objects facing the same way can hold different Euler angles, and `a.quaternion.equals(b.quaternion)` compares the four numbers exactly, so q and −q, or a rounding difference in the last digit, make it `false`. For objects in different groups, compare what `getWorldQuaternion` gives back for each.

### Getting the turn out of a matrix

`setFromRotationMatrix` assumes the matrix holds nothing but a turn. Most matrices also hold a move and a resize, and a resize makes it give a wrong turn, with no error. Split the matrix first, or strip it down to the turn:

```js
object.matrixWorld.decompose(position, quaternion, scale);                // all three parts
q.setFromRotationMatrix(new Matrix4().extractRotation(object.matrixWorld)); // just the turn
```

### Which space is it in?

| Value | Space |
| --- | --- |
| `object.rotation`, `object.quaternion`, and the turn inside `object.matrix` | Measured from its parent |
| What `object.getWorldQuaternion(q)` gives back, and the turn inside `matrixWorld` | The world |
| Anything converted from one of these | The same space as the value it came from |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
