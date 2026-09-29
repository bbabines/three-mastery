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

> **In short:** `new Box3().setFromObject(model)` gives one box around a model and everything under it, measured in the world and lined up with the world's axes, which is what you need to place, measure, or frame a model you didn't build.
>
> **Used for:** Standing a loaded product on the floor; checking whether a rack fits the floor space a customer typed in; framing the camera around whatever just loaded; and keeping a dragged part from sinking into the shelf it's dropped on.

## A · The basics

### One box around the whole model

The bounding box and sphere page covered one geometry's box: measured from the object itself, so it stays put when the mesh moves. A loaded model is dozens of Meshes, each with its own geometry box, and each moved, turned, and resized by the objects above it. `setFromObject` puts them together:

```js
const box = new Box3().setFromObject(model);
box.getSize(new Vector3());   // width, height, and depth, in world units
box.getCenter(new Vector3()); // the middle of the box, in the world
box.min.y;                    // the lowest point of the model, in the world
```

It visits the model and everything under it, the same way `traverse` does, takes each Mesh's box into the world, and returns one box that holds them all. The box's sides always line up with the world's X, Y, and Z axes; docs call it an **axis-aligned bounding box**, or AABB.

**Analogy: a moving box for a chair.** You measure the whole chair as it stands, legs and arms included, not each leg on its own. And the box's sides stay square to the floor and the walls, so a chair turned at an angle needs a bigger box.

### Why it isn't geometry.boundingBox

A Mesh's `geometry.boundingBox` is measured from the Mesh itself, before anything above it moves, turns, or resizes it. In Brad's rack file, the upright's tube node is scaled to 0.038, so its Meshes' geometry boxes say the tube is 60 units tall. In the scene below, it stands 2 units tall. And a Group or a part holds no geometry at all, so it has no `geometry.boundingBox` to read.

Pick what to measure. The red box is the tube's geometry box, drawn as if its numbers were in the world.

<div data-scene="whichBox"></div>

## B · Working knowledge

### Standing a model on the floor

```js
const box = new Box3().setFromObject(model);
model.position.y -= box.min.y; // its lowest point now sits at y = 0
```

This works when `model` sits straight in the scene. `box.min.y` is in the world, but `position` is measured from the parent, so under a moved or resized parent the two don't line up. Measure again after moving it: the box doesn't follow the model.

### Measuring a footprint

```js
const size = box.getSize(new Vector3());
const fits = size.x <= spaceWidth && size.z <= spaceDepth;
```

Brad's rack, as exported, is about 1.31 wide, 2.29 tall, and 2.03 deep. glTF's unit is the meter, so that's meters. Framing a camera around the box is the fit to bounds page, in the camera domain.

### Everything under it counts, hidden or not

`setFromObject` doesn't check `visible`, so hiding the rack's pull-up bar leaves the box as wide as before, as the scene shows. Helpers count too: a debug `AxesHelper` or a label Sprite added to the model makes the box bigger. Lights, cameras, and empty marker nodes have no geometry and add nothing. To measure only what's shown, keep helpers out of the model and build the box from the visible Meshes:

```js
const box = new Box3();
model.traverseVisible((object) => {
  if (object.isMesh) box.expandByObject(object);
});
```

`expandByObject` also takes in everything under the Mesh it's given. The rack's Meshes have nothing under them, so here that's only the Mesh.

### Turned models: loose or tight

By default, `setFromObject` takes each Mesh's geometry box, turns its eight corners into the world, and boxes those. That's quick, but once a Mesh is turned, the corners stick out past the real shape, so the box is loose. `setFromObject(model, true)` boxes every vertex instead: a tight fit that costs CPU time for every vertex in the model. Fine once after a load; not every frame on a big model.

Turn the J-cup. Both boxes change shape, because they stay lined up with the world's axes while the J-cup turns. The green box is the tight one; the yellow default box always holds it, with room to spare once the J-cup is at an angle.

<div data-scene="tilt"></div>

### After moving a parent

As on the update timing page, `setFromObject` refreshes the object and everything under it, but not its parents. Move the cart a rack stands on, measure the rack, and you get the rack's old spot. Measure the cart, or call `cart.updateMatrixWorld()` first.

### Which space is it in?

| Value | Space |
| --- | --- |
| `mesh.geometry.boundingBox` | Measured from the mesh itself |
| What `new Box3().setFromObject(object)` gives back | The world |
| `box.getSize(v)`, `box.min`, `box.max` | The world, in world units |
| `model.position`, which the floor placement changes | Measured from its parent |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
