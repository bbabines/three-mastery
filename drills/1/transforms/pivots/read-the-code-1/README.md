---
id: 1.transforms.pivots.read-the-code.1
loop: 1
tier: light
concepts: [transforms.pivots]
mode: read-the-code
context: transforms.pivots/door-hinge
lenses: []
misconceptions:
  - transforms.pivots/center-rotation
  - transforms.pivots/pivot-group-only
  - transforms.pivots/pivot-position
---

# Pivots and offset groups

> **In short:** An object turns and resizes around its origin, the point its `position` puts in place. There are two ways to turn it around a different point: hang it from a group at that point and turn the group, which works in every version of three.js, or set the object's own `pivot`, which three.js added in r183.
>
> **Used for:** Doors and lids that swing on a hinge, a loaded model that should spin around its middle, bars in a chart that grow up from the floor, and a robot arm that bends at each joint.

## A · The basics

### An object turns around its origin

An object's **origin** is the point on its shape that `position` puts in place: the spot (0, 0, 0), measured from the object itself. `rotation` turns the object around that point, and `scale` grows or shrinks it toward and away from that point.

Most shapes three.js builds, like `BoxGeometry` and `SphereGeometry`, have their origin in the middle, so they turn around their middle. That's why it seems like rotation always happens around the center. Models loaded from files are different: the origin is wherever the artist left it, like the floor under a chair or one corner of a shelf.

**Analogy: a pinned photo.** A photo pinned to a corkboard swings around the pin, not around its middle. Move the pin to a corner and it swings around the corner.

### Turning around a different point: a pivot group

A **pivot** is the point something turns around. To make a door swing on its hinge instead of spinning around its middle:

1. Make a group and put it where the hinge is.
2. Add the door to the group, offset so its hinge edge sits on the group's origin.
3. Turn the group, not the door.

```js
const hinge = new Group();
hinge.position.set(-0.6, 1.1, 0); // where the hinge is
hinge.add(door);
door.position.x = 0.6;            // half the door's width, measured from the hinge
hinge.rotation.y = angle;         // the door swings around the hinge
```

It works because a child is measured from its parent, as on the local vs world space page: turn the parent, and the child swings around the parent's origin. The group is called a **pivot group** or an **offset group**. It works in every version of three.js, and it's what older tutorials, forum answers, and most AI-written code show, because for years it was the only built-in way.

### Or tell the object its pivot

Since r183, every object also has a `pivot` setting. It's empty by default. Set it to a point, and the object's `rotation` and `scale` work around that point instead of its origin, with no group needed:

```js
door.pivot = new Vector3(-0.6, 0, 0); // the hinge edge, measured from the door itself
door.rotation.y = angle;              // the door swings around its hinge edge
```

`pivot` is measured from the object itself, in the shape's own size before any `scale`: the same kind of spot you pass to `localToWorld` on the local vs world space page. On a door 1.2 wide, (−0.6, 0, 0) is its left edge. With no turn and no resize, setting it changes nothing; the door only swings around it once it turns.

Try all three buttons, then open the door. The last two look the same, but watch the readout: with `pivot`, the door's `position` stays put while its world position swings around.

<div data-scene="hinge"></div>

## B · Working knowledge

### Spinning a loaded model around its middle

When a model's origin is off in a corner, find the middle of the box that just fits around it, a `Box3`, and hang the model from a group placed there:

```js
const center = new Box3().setFromObject(model).getCenter(new Vector3()); // in the world
const spinner = new Group();
spinner.position.copy(center);
scene.add(spinner);
spinner.add(model);
model.position.sub(center); // shift it back by the same amount, so it doesn't jump
spinner.rotation.y = angle; // spins around the model's middle
```

This assumes the model was added straight to the scene. `spinner.attach(model)` does the shifting for you; the add vs attach page covers it.

### Growing from the floor or a corner

`scale` grows an object away from its origin, so a pivot group works for resizing too. A bar in a chart should grow up from the floor, not both ways from its middle, so put the group at the bar's base:

```js
base.add(bar);
bar.position.y = 0.5;  // half the bar's height, so its bottom sits on the group's origin
base.scale.y = value;  // grows upward; the bottom stays on the floor
```

To grow from a corner, put the group at that corner and offset the object by half its size on each axis.

### The other fix: move the shape itself

`geometry.translate(x, y, z)` moves the shape's points, measured from the object itself, so the origin ends up somewhere else on the shape. `geometry.center()` moves them so the origin is the shape's middle. No extra group is needed, but it changes the shape's data, so every mesh that shares that geometry changes too.

### What changed with `pivot`

`pivot` gives the same result as the group: the door ends up in exactly the same place either way. What changes is where the numbers live and which code still works:

- **Everything sits on one object.** With a group, the hinge's spot is `hinge.position` and the turn is `hinge.rotation`. With `pivot`, the door holds both, and the hinge sits at `position` plus `pivot`, measured from its parent.
- **`position` stops being where the origin is.** Once the object turns, its origin swings around the pivot. `getWorldPosition`, and the move stored in its `matrix`, give that swung origin, not `position`. Code that reads `position` as "where it is" gets the wrong spot.
- **Only turning and resizing change.** With no turn and no resize, `pivot` changes nothing, and changing `position` still slides the whole object. Resizing works around the pivot too: `bar.pivot = new Vector3(0, -0.5, 0)` makes a bar 1 tall grow up from its base. It also means setting `pivot` on an object that's already turned or resized moves it.
- **Code that rebuilds `position` from a matrix makes it jump.** `applyMatrix4`, `attach`, and loading a `toJSON` save with `ObjectLoader` all split a matrix back into `position`, `rotation`, and `scale`. The split puts the origin into `position`, then the pivot's shift is added again on top. `clone` and `copy` are fine: they copy `pivot` along with the rest.
- **Tools don't all know about it.** glTF files have no pivot setting, so `GLTFExporter` writes an object with a `pivot` as an offset group: a parent node at the pivot and a child shifted back. three.js's `GLTFLoader` turns that pair back into one object with a `pivot`; other programs see the group. `TransformControls`, the drag handles from three.js's addons, draws its handles at the object's origin, not at the pivot.

### A pivot group or `pivot`?

Reach for a pivot group when several parts turn together, when joints chain like a robot arm, when you want the hinge as a real object you can add things to or read with `getWorldPosition`, when code calls `attach` or `applyMatrix4` on the part, or when the code has to work with older three.js.

Use `pivot` for a single object that always turns around the same spot on its own shape, like a door, a lid, or a dial, when you'd rather not add a group. Read where it is with `getWorldPosition`, not `position`.

### Which space is it in?

| Value | Space |
| --- | --- |
| `hinge.position` | Measured from its parent, here the scene |
| `door.position`, once it's inside the hinge group | Measured from the hinge group, its parent |
| The point `rotation` and `scale` work around | The object's own origin, unless `pivot` is set |
| What `new Box3().setFromObject(model)` gives back | The world |
| The move `geometry.translate(x, y, z)` makes | Measured from the object itself |
| `object.pivot` | Measured from the object itself, before its `scale` |
| Where the pivot point stays, once `pivot` is set | At `position` plus `pivot`, measured from its parent |
| `object.position`, once `pivot` is set | Measured from its parent, but no longer where the origin is after a turn or resize |
| What `object.getWorldPosition(v)` gives back, with `pivot` set | The world: the object's origin, not the pivot point |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
