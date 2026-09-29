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
---

# Pivots and offset groups

> **In short:** An object turns and resizes around its origin, the point its `position` puts in place, so to turn it around a different point you hang it from a group at that point and turn the group, or, in r186, set the object's `pivot`.
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

It works because a child is measured from its parent, as on the local vs world space page: turn the parent, and the child swings around the parent's origin. The group is called a **pivot group** or an **offset group**.

### Or tell the object its pivot

three.js r186 also gives every object a `pivot` setting. It's empty by default. Set it to a point, and the object's `rotation` and `scale` work around that point instead of its origin, with no group needed:

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

### A pivot group or `pivot`?

Reach for a pivot group by default. It works with every three.js method and every tutorial, it can hold several parts that turn together, and groups nest, so a robot arm is a chain of them, one per joint.

Use `pivot` for a single object that always turns around the same spot on its own shape, like a door, a lid, or a dial, when you'd rather not add a group. It's copied by `clone` and `copy` and saved by `toJSON`. Know what changes when it's set:

- **`position` stops being where the origin is.** Once the object turns, its origin swings around the pivot, so `getWorldPosition` no longer matches `position`. Code that reads `position` as "where it is" gets the wrong spot.
- **Resizing works around it too.** `bar.pivot = new Vector3(0, -0.5, 0)` makes a bar 1 tall grow up from its base, but it also means setting `pivot` on an object that's already turned or resized moves it.
- **`applyMatrix4` and `attach` don't allow for it.** On a turned object with a `pivot`, both make it jump.

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

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
