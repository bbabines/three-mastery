---
id: 1.queries.filtering.read-the-code.1
loop: 1
tier: light
concepts: [queries.filtering]
mode: read-the-code
context: queries.filtering/selectable-only
lenses: []
misconceptions:
  - queries.filtering/helpers-ignored
---

# Filtering

> **In short:** A raycast tests every object you hand it, helpers and labels included, so you choose what it tests, with a list, the recursive flag, or layers, and then walk up from the mesh it hit to the part you want.
>
> **Used for:** Clicking products on a shelf without picking the floor grid, ignoring the drag handles of an editing tool, placing furniture only on the floor, and finding the whole machine when the click landed on one of its screws.

## A · The basics

### Everything you hand it counts

`raycaster.intersectObjects(scene.children)` tests everything in the scene: meshes, but also grid and axes helpers, label sprites, and the handles of editing tools. Helpers are lines, and a ray counts as touching a line when it passes within `raycaster.params.Line.threshold` of it, 1 world unit by default. A ray heading for a crate on the floor often touches a grid line first, so `hits[0]` is the grid.

**Analogy: a metal detector.** It beeps for bottle caps just as happily as for rings. It can't know what you want; you choose where to sweep.

Hover over the shelf, or use the sliders, and try each button. The readout shows what `hits[0]` is, then walks up from it to the product.

<div data-scene="whatGetsHit"></div>

## B · Working knowledge

### A list of what can be picked

The simplest and most common filter: keep your own array and pass it.

```js
const pickable = [toolbox, crate];                 // add to it when you add a product
const hits = raycaster.intersectObjects(pickable); // recursive by default: their children too
```

For placing on the floor only, pass just the floor: `raycaster.intersectObject(floor)`.

### The recursive flag

`intersectObject` and `intersectObjects` test children too, unless you pass `false` as the second argument. With `false`, only the objects in the list are tested, and a `Group` has no shape of its own, so it's never hit.

### Layers

Every object has `layers`, and a raycaster only tests objects that share one with it:

```js
raycaster.layers.set(1);                          // test layer 1 only
product.traverse((part) => part.layers.enable(1)); // every mesh inside, not just the group
```

Layers are tested per object, not per branch: putting a group on layer 1 doesn't put its children there. The visibility, removal, layers page, in the scene graph domain, covers layers for cameras too.

### Walking up to the part you want

The ray hits one mesh: a screw, a lid, a handle. The product is somewhere above it. Mark the product, often with `userData`, and walk up:

```js
let part = hits[0].object;
while (part && !part.userData.sku) part = part.parent; // null if nothing above has an sku
```

`hit.object.traverseAncestors(fn)` visits the same parents, but starts at the parent, never the mesh itself, and can't stop early. The traverse variants page covers it.

### Sprites need the camera

A `Sprite`, like the text labels in these scenes, faces the camera, so testing one needs `raycaster.camera`. `setFromCamera` sets it; after `raycaster.set(...)` it's `null`, and a sprite in the list throws an error. One more reason to pass a list.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
