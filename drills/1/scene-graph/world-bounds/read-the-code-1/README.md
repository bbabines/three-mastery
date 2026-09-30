---
id: 1.scene-graph.world-bounds.read-the-code.1
loop: 1
tier: core
concepts: [scene-graph.world-bounds]
mode: read-the-code
context: scene-graph.world-bounds/floor-placement
lenses: []
misconceptions:
  - scene-graph.world-bounds/geometry-box
---

# World-space bounds

> **In short:** One call measures a whole model where it stands: a single box, square to the world's axes, around everything under it.
>
> **Used for:** Standing a product on the floor, checking it fits a space, framing the camera, and dropping parts onto shelves.

## A · The basics

### One box around the whole model

The bounding box and sphere page covered one geometry's box, measured from the object itself. A loaded model is dozens of Meshes, each with its own box, and each moved, turned, and resized by the objects above it. `setFromObject` puts them together:

```js
const box = new Box3().setFromObject(model);
box.getSize(new Vector3());   // width, height, and depth, in the world
box.getCenter(new Vector3()); // the middle of the box, in the world
box.min.y;                    // the model's lowest point, in the world
```

It visits the model and everything under it, takes each Mesh's box into the world, and returns one box that holds them all. Its sides always line up with the world's X, Y, and Z axes, which is why it's called an **axis-aligned bounding box**, or AABB.

**Analogy: a moving box for a chair.** You measure the whole chair as it stands, legs and arms included, not each leg on its own. The box stays square to the walls, so a chair turned at an angle needs a bigger box.

### Why it isn't geometry.boundingBox

A Mesh's `geometry.boundingBox` is measured from the Mesh itself, before anything above it moves, turns, or resizes it. In the rack model, the upright's tube is scaled down inside the file, so its geometry box says it's about 60 units tall, while in the scene it stands about 2. And a Group holds no geometry, so it has no geometry box at all.

Pick what to measure. The red box is the tube's geometry box, drawn as if its numbers were in the world.

<div data-scene="whichBox"></div>

## B · Working knowledge

### Standing a model on the floor

```js
const box = new Box3().setFromObject(model);
model.position.y -= box.min.y; // its lowest point now sits at y = 0
```

This works while `model` sits straight in the scene, since `box.min.y` is in the world and `position` is measured from the parent. `setFromObject` doesn't refresh the parents above the model, so after moving the cart a rack stands on, call `cart.updateMatrixWorld()` before measuring the rack.

### Hidden parts and helpers count

`setFromObject` doesn't check `visible`, so a hidden part still counts, and so does a helper or label added to the model. To measure only what's shown, build the box from the visible Meshes:

```js
const box = new Box3();
model.traverseVisible((object) => {
  if (object.isMesh) box.expandByObject(object);
});
```

### Turned models: loose or tight

By default, each Mesh's own box is turned into the world and boxed again. That's quick, but once a Mesh is turned, it gives a **loose box**. `setFromObject(model, true)` boxes every vertex instead: the **tight box**, which costs CPU time for every vertex, fine once after a load but not every frame.

Turn the J-cup. The green box is the tight one, and the yellow loose box always holds it.

<div data-scene="tilt"></div>

### Which space is it in?

| Value | Space |
| --- | --- |
| `mesh.geometry.boundingBox` | Measured from the mesh itself |
| `new Box3().setFromObject(object)` | The world |
| `model.position` | Measured from its parent |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
