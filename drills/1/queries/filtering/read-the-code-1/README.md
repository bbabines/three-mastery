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

> **In short:** A raycast hits whatever you hand it, helpers included, so hand it only what should be pickable.
>
> **Used for:** Picking products but not the floor grid, ignoring editor handles, placing only on the floor, and selecting whole machines.

## A · The basics

### Everything you hand it counts

`raycaster.intersectObjects(scene.children)` tests everything in the scene: meshes, but also grid and axes helpers, label sprites, and the handles of editing tools. Helpers are lines, and a ray counts as touching a line when it passes within `raycaster.params.Line.threshold` of it, 1 unit by default. A ray heading for a crate on the floor often touches a grid line first, so `hits[0]` is the grid.

**Analogy: a metal detector.** It beeps for bottle caps just as happily as for rings. It can't know what you want, so you choose where to sweep.

Hover over the shelf, or use the sliders, and try each button. The readout shows what `hits[0]` is, then walks up from it to the product.

<div data-scene="whatGetsHit"></div>

## B · Working knowledge

### A target list

The simplest and most common filter is your own array of what can be picked:

```js
const pickable = [toolbox, crate];                 // add to it when you add a product
const hits = raycaster.intersectObjects(pickable); // their children too
```

Both methods test children too, unless you pass `false` as the second argument. For placing on the floor only, pass just the floor.

### Layers

A raycaster only tests objects that share a layer with it:

```js
raycaster.layers.set(1);                           // test layer 1 only
product.traverse((part) => part.layers.enable(1)); // every mesh inside, not just the group
```

Layers are tested per object, not per branch, so putting a group on layer 1 doesn't put its children there.

### Walking up to the part you want

The ray hits one mesh: a screw, a lid, a handle. The product is somewhere above it. Mark the product, often with `userData`, and walk up:

```js
let part = hits[0].object;
while (part && !part.userData.sku) part = part.parent; // null if nothing above has an sku
```

`hit.object.traverseAncestors(fn)` visits the same parents, starting at the parent, but can't stop early.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
